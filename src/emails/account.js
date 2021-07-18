const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'osbornetunde@gmail.com',
        subject: 'Welcome to the App',
        text: `Welcome to the App, ${name}. Happy to have you on the platform`
    })
}

const sendExitEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'osbornetunde@gmail.com',
        subject: 'Sorry to see you leave',
        text: `Hi ${name}, we are sorry to see you leave, is there anything we can do to make you stay?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendExitEmail
}
