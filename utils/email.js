var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require("fs");

async function sendMail(subject, body, destination) {
	var transporter = nodemailer.createTransport(smtpTransport({
		host: 'smtp.gmail.com',
		service: 'Gmail',
		port: 587,
		secure: true,
		debug: true,
		auth: {
			user: 'infocus.sendingSlip@gmail.com',
			pass: 'Aditya@2020'
		}
	}));
	var mailOptions = {
		from: 'infocus.sendingSlip@gmail.com',
		to: destination,
		subject: subject,
		html: body,
	};

	let info = await transporter.sendMail(mailOptions);
}
module.exports = sendMail;