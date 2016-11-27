'use strict';
const moment = require('moment');
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
const Wit = require('node-wit').Wit;
const client = new Wit({
	accessToken: process.env.WIT_CLIENT_KEY
});

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
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

function createAccUrl(loc, initDate, endDate, guests) {
	const locParam = `loc=${loc}`;
	const initDateParam = `fecha_inicio=${initDate}`;
	const endDateParam = `fecha_final=${endDate}`;
	const host = 'http://www.wonowo.net/api/Accomodations/getAccomodation';
	const guestParams = `huespedes=${guests}`;
	return `${host}?${locParam}&${initDateParam}&${endDateParam}&${guestParams}`;
}

function createTransUrl(initCity, endCity, initDate) {
	const initLocParam = `loc_origen=${initCity}`;
	const endLocParam = `loc_destino=${endCity}`;
	const date = `fecha=${initDate}`;
	const host = 'http://www.wonowo.net/api/TransportTickets/getTransport';
	return `${host}?${initLocParam}&${endLocParam}&${date}`;
}

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
			console.log('dates', response);
			res.json(response);
		}).catch((err) => {
			console.log('polla', err);
			res.status = 400;
			response = {
				msg: 'we could find a destination'
			};
			res.json(response);
		});
	// .catch(console.error);

	console.log('hello world');


	// this sends back a JSON response which is a single string

}
