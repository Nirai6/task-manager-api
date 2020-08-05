const sgMail = require("@sendgrid/mail")



sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:"niraiarasu6@gmail.com",
        subject:"Thanks for joining in!",
        text: `${name} , Welcome to the app. Let me know how you get along with the app`

    })
}

const sendCancelEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:"niraiarasu6@gmail.com",
        subject:"Cancellation of account",
        text:`Hey ${name},its sad to see you leave our community,If we can improve anything in our service please ping us`
    })
}



module.exports={sendWelcomeEmail,sendCancelEmail}
