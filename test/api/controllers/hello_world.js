var should = require('should');
// var request = require('supertest');
// var server = require('../../../app');
const WitResponse = require('../helpers/witHelper');
const controller = require('../../../api/controllers/hello_world');
describe('controllers', function() {
	describe('recomendations', function() {
		describe('map the wit response ', () => {
			const initCity = 'Madrid';
			const endCity = 'Barcelona';
			const initDate = '01-12-2016';
			const endDate = '15-12-2016';
			const guests = 2;

			it('map the Booking time', (done) => {
				const sut = controller.getBookingTime(WitResponse.entities.duration);
				sut.should.be.equal(1209600);
				done();
			});
			it('map the location', (done) => {
				const sut = controller.getLocation(WitResponse.entities.location);
				sut.should.be.equal(endCity);
				done();
			});
			it('map the initial Date', (done) => {
				const sut = controller.getInitDate(WitResponse.entities.datetime);
				sut.should.be.equal(initDate);
				done();
			});
			it('map the number of guests', (done) => {
				const sut = controller.getGuests(WitResponse.entities.contact);
				sut.should.be.equal(2);
				done();
			});
			it('map the end date', (done) => {
				const time = controller.getBookingTime(WitResponse.entities.duration);
				const sut = controller.getEndDate(initDate, time);
				sut.should.be.equal(endDate);
				done();
			});
			it('create the Accomodations url', (done) => {
				const accExpectatonUrl = `http://www.wonowo.net/api/Accomodations/getAccomodation?loc=${endCity}&fecha_inicio=${initDate}&fecha_final=${endDate}&huespedes=${guests}`;
				const sut = controller.createAccUrl(endCity, initDate, endDate, guests);
				sut.should.be.equal(accExpectatonUrl);
				done();
			});
			it('create the Transport url', (done) => {
				const transExpectationUrl = `http://www.wonowo.net/api/TransportTickets/getTransport?loc_origen=${initCity}&loc_destino=${endCity}&fecha=${initDate}`;
				const sut = controller.createTransUrl(initCity, endCity, initDate);
				sut.should.be.equal(transExpectationUrl);
				done();
			});
			it('the hole object', (done) => {
				const accExpectatonUrl = `http://www.wonowo.net/api/Accomodations/getAccomodation?loc=${initCity}&fecha_inicio=${initDate}&fecha_final=${endDate}&huespedes=${guests}`;
				const transExpectationUrl = `http://www.wonowo.net/api/TransportTickets/getTransport?loc_origen=${initCity}&loc_destino=${endCity}&fecha=${initDate}`;
				const expectations = {
					accUrl: accExpectatonUrl,
					transportUrl: transExpectationUrl,
				};
				const sut = controller.mapWitResponse(initCity, WitResponse);
				// should.exist(sut);
				sut.should.deepEqual(expectations);
				done();
			});
		});
		// 	describe('GET /hello', function() {
		//
		// 		it('should return a default string', function(done) {
		//
		// 			request(server)
		// 				.get('/hello')
		// 				.set('Accept', 'application/json')
		// 				.expect('Content-Type', /json/)
		// 				.expect(200)
		// 				.end(function(err, res) {
		// 					should.not.exist(err);
		//
		// 					res.body.should.eql('Hello, stranger!');
		//
		// 					done();
		// 				});
		// 		});
		//
		// 		it('should accept a name parameter', function(done) {
		//
		// 			request(server)
		// 				.get('/hello')
		// 				.query({
		// 					name: 'Scott'
		// 				})
		// 				.set('Accept', 'application/json')
		// 				.expect('Content-Type', /json/)
		// 				.expect(200)
		// 				.end(function(err, res) {
		// 					should.not.exist(err);
		//
		// 					res.body.should.eql('Hello, Scott!');
		//
		// 					done();
		// 				});
		// 		});
		//
		// 	});
		//
	});

});
