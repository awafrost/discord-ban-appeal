const { decodeJwt } = require("./helpers/jwt-helpers.js");
const { unbanUser } = require("./helpers/discord-helpers.js");
const sendGridMail = require("@sendgrid/mail");

async function sendUnbanEmail(usersInfo, url) {
    sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
    const html = `
      <div> 
         Bonjour ${usersInfo.username}#${usersInfo.user_discriminator}! <br>
         Votre demande de débanissement soumise sur ${url} a été approuvée !<br>
         Vous pouvez maintenant nous rejoindre en utilisant cette invitation : ${process.env.INVITE_URL}
      </div>
    `;
    const mail = {
        from: process.env.SENDGRID_SENDER_EMAIL,
        to: usersInfo.email,
        subject: "Votre demande de débanissement a été approuvée !",
        html,
    };
    await sendGridMail.send(mail);
}

exports.handler = async function (event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Méthode HTTP non autorisée" })
        };
    }

    if (event.queryStringParameters.token !== undefined) {
        const unbanInfo = decodeJwt(event.queryStringParameters.token);
        console.log(unbanInfo);
        if (unbanInfo.user_id !== undefined) {
            try {
                // let guild = await getGuildInfo(process.env.REACT_APP_GUILD_ID);
                let response = await unbanUser(unbanInfo.user_id, process.env.REACT_APP_GUILD_ID);
                if (response.response && response.response.data.code === 10026) {
                    throw new Error("L'utilisateur n'est pas réellement banni");
                }
                let success_message = "Cette demande de débanissement a été approuvée et l'utilisateur a été débanni de votre serveur";
                if (process.env.REACT_APP_ENABLE_SENDGRID) {
                    await sendUnbanEmail(unbanInfo, event.headers.host);
                    success_message += " et a été notifié par e-mail qu'il peut nous rejoindre avec l'invitation fournie";
                }
                success_message += ".";
                return {
                    statusCode: 302,
                    headers: { "Location": `/success?msg=${encodeURIComponent(success_message)}` }
                };
            } catch (e) {
                return {
                    statusCode: 302,
                    headers: { "Location": `/error?msg=${encodeURIComponent(e.message)}` }
                };
            }
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify({ message: "Requête invalide" })
    };
}
