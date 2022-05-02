const sgMail = require("@sendgrid/mail");
const { StatusCodes } = require("http-status-codes");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const wrapAsync = require("../utils/wrap-async");

const FormController = {};

FormController.contactForm = wrapAsync(async (req, res, next) => {
    const { email, name, message } = req.body;

    const emailData = {
        to: email,
        from: process.env.EMAIL_TO,
        subject: `Contact form - ${process.env.APP_NAME}`,
        text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${email}`,
        html: `
            <h4>Email received from contact form:</h4>
            <p>Sender name: ${name}</p>
            <p>Sender email: ${email}</p>
            <p>Sender message: ${message}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>https://seoblog.com</p>
        `,
    };

    const sent = await sgMail.send(emailData);
    res.status(StatusCodes.OK).json({
        success: true,
    });
});

FormController.contactBlogAuthorForm = wrapAsync(async (req, res, next) => {
    const { authorEmail, email, name, message } = req.body;

    let mailList = [authorEmail, process.env.EMAIL_TO];

    const emailData = {
        to: mailList,
        from: email,
        subject: `Someone messaged you from ${process.env.APP_NAME}`,
        text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
        html: `
            <h4>Message received from:</h4>
            <p>name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>https://seoblog.com</p>
        `,
    };

    const sent = await sgMail.sendMultiple(emailData);

    res.status(StatusCodes.OK).json({
        success: true,
    });
});

module.exports = FormController;
