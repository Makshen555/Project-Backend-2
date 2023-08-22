require("dotenv").config();
const sgMail = require('@sendgrid/mail')

const sendEmail = async (valueEmail) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: valueEmail, // Change to your recipient
        from: 'lgomezsa@est.utn.ac.cr', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text:`Estimado usuario haga click en el siguiente link para verificar su usuario`,
        html:`<p>Estimado usuario haga click en el siguiente link para verificar su usuario: http://localhost/cliente/verificacion.html?${valueEmail}</p>`,
    }
    sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}

module.exports = { sendEmail };