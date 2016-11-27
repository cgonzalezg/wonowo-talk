'use strict';
const WitResponse = {
	'msg_id': '8f9b8f80-0347-49a9-82b3-0dbbd3bc12b9',
	'_text': '2 weeks holidays in Madrid next month with Claudia',
	'entities': {
		'duration': [{
			'confidence': 0.9780690680943482,
			'week': 2,
			'value': 2,
			'unit': 'week',
			'normalized': {
				'value': 1209600,
				'unit': 'second'
			}
		}],
		'location': [{
			'confidence': 0.749710918399453,
			'type': 'value',
			'value': 'Barcelona',
			'suggested': true
		}],
		'datetime': [{
			'confidence': 0.9760607723086329,
			'type': 'value',
			'value': '2016-12-01T00:00:00.000-08:00',
			'grain': 'month',
			'values': [{
				'type': 'value',
				'value': '2016-12-01T00:00:00.000-08:00',
				'grain': 'month'
			}]
		}],
		'contact': [{
			'confidence': 0.8663487210681725,
			'type': 'value',
			'value': 'Claudia',
			'suggested': true
		}]
	}
};
module.exports = WitResponse;
