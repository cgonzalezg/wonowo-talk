'use strict';
const moment = require('moment');
const Wit = require('node-wit').Wit;
const client = new Wit({
	accessToken: process.env.WIT_CLIENT_KEY
});

module.exports = {
	POST_recomendations: recomendations,
	mapWitResponse,
	getBookingTime,
	getLocation,
	getInitDate,
	getGuests,
	getEndDate,
	createAccUrl,
	createTransUrl
};

const ErrorDestination = 1;

function getBookingTime(duration) {
	console.log(duration);
	if (!duration) {
		// 4 days in seconds
		return 345600;
	} else
		return duration.reduce((p, c) => {
			return p + c.normalized.value;
		}, 0);
}

function getLocation(location) {
	if (!location) {
		let err = new Error();
		err.type = ErrorDestination;
		throw err;
	}
	return location.reduce((p, c) => {
		return c.value;
	}, '');
}

function getInitDate(dateTime) {
	if (!dateTime) return moment().add(4, 'd').format('DD-MM-YYYY');
	let response = {};
	switch (dateTime[0].type) {
		case 'value':
			const date = dateTime.reduce((p, c) => {
				return c.value;
			}, '');
			response = moment(date).format('DD-MM-YYYY');
			break;
		case 'interval':
			response = dateTime[0].values.map((item) => {
				return {
					initDate: moment(item.from.value).format('DD-MM-YYYY'),
					endDate: moment(item.to.value).format('DD-MM-YYYY')
				};
			});
			break;
		default:
			response = moment().add(4, 'd').format('DD-MM-YYYY');
	}
	return response;
}

function getGuests(contact) {
	if (!contact) return 1;
	return contact.length + 1;
}

function getEndDate(initDate, time) {
	return moment(initDate, 'DD-MM-YYYY').add(time, 's').format('DD-MM-YYYY');
}

/**
 * create the url for Accomodations offers
 * @param  {[type]} loc      [description]
 * @param  {[type]} initDate [description]
 * @param  {[type]} endDate  [description]
 * @param  {[type]} guests   [description]
 * @return {[type]}          [description]
 */
function createAccUrl(loc, initDate, endDate, guests) {
	const locParam = `loc=${loc}`;
	const initDateParam = `fecha_inicio=${initDate}`;
	const endDateParam = `fecha_final=${endDate}`;
	const host = 'http://www.wonowo.net/api/Accomodations/getAccomodation';
	const guestParams = `huespedes=${guests}`;
	return `${host}?${locParam}&${initDateParam}&${endDateParam}&${guestParams}`;
}

/**
 * create the url for transporst offers
 * @param  {[type]} initCity [description]
 * @param  {[type]} endCity  [description]
 * @param  {[type]} initDate [description]
 * @return {[type]}          [description]
 */
function createTransUrl(initCity, endCity, initDate) {
	const initLocParam = `loc_origen=${initCity}`;
	const endLocParam = `loc_destino=${endCity}`;
	const date = `fecha=${initDate}`;
	const host = 'http://www.wonowo.net/api/TransportTickets/getTransport';
	return `${host}?${initLocParam}&${endLocParam}&${date}`;
}

/**
 * Map the WIT response
 * @param  {[type]} initCity [description]
 * @param  {[type]} witData  [description]
 * @return {[type]}          [description]
 */
function mapWitResponse(initCity, witData) {
	const time = getBookingTime(witData.entities.duration);
	const endCity = getLocation(witData.entities.location);
	const initDate = getInitDate(witData.entities.datetime);
	console.log('asdasd', initDate);
	const guests = getGuests(witData.entities.contact);
	let response = [];
	if (Array.isArray(initDate)) {
		console.log('is an array');
		response = initDate.map((item) => {
			console.log('assadsad', item);
			console.log(item.initDate, item.endDate);
			const accUrl = createAccUrl(initCity, item.initDate, item.endDate, guests);
			const transportUrl = createTransUrl(initCity, endCity, item.initDate);
			return {
				accUrl,
				transportUrl,
				date: item.initDate
			};
		});
	} else {
		console.log('NOT ARRAY');
		const endDate = getEndDate(initDate, time);
		const accUrl = createAccUrl(initCity, initDate, endDate, guests);
		const transportUrl = createTransUrl(initCity, endCity, initDate);
		response = [{
			accUrl,
			transportUrl,
			date: initDate
		}];
	}
	return response;
}

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function recomendations(req, res) {
	const text = req.body.text;
	const initCity = req.body.initCity;
	let response = {};
	client.message(text, {})
		.then((data) => {
			const personas = getGuests(data.entities.contact);
			const dates = mapWitResponse(initCity, data);
			const destination = getLocation(data.entities.location);
			response = {
				personas,
				dates,
				destination
			};
			res.json(response);
		}).catch((err) => {
			console.log('polla', err);
			res.status = 400;
			response = {
				msg: 'we could find a destination'
			};
			res.json(response);
		});

}
