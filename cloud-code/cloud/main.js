var mailgun = require('mailgun');

mailgun.initialize('bryabov.ru', 'key-e234f397d92218410ab1c1ab361b1c18');

Parse.Cloud.beforeSave('MessageObject', function(request, response) {
	'use strict';

	var text =
		'From: ' + request.object.get('name') + '\n' +
		'Email: ' + request.object.get('email') + '\n\n' +
		'Message:\n' + request.object.get('message');

	mailgun.sendEmail({
		to: 'rv.boris@yandex.ru',
		from: request.object.get('email'),
		subject: 'New message from bryabov.ru',
		text: text
	}, {
		success: function() {
			response.success();
		},
		error: response.error
	});
});