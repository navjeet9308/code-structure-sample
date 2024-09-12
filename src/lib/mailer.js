var Email = require('email-templates');
var nodemailer = require('nodemailer');
var path = require('path');
const envVar = require("../config")
var t = nodemailer.createTransport({
  host: envVar.SMTP_SERVER,
  port: envVar.SMTP_PORT || 587,
  secure: envVar.SMTP_SECURE || false,
  auth: {
    user: envVar.SMTP_USER,
    pass: envVar.SMTP_PASS,
  },
});
function Mailer() { }
/**
 * Send Email
 * @param {Object} data Contruct of data to use for sending mail
 * @param {string} [data.from='noreply@service.me'] Array of email receipients
 * @param {Array} data.to Array of email receipients
 * @param {string} data.template Name of email template to use
 * @param {Object} data.params Data parameters to comsume by template
 * @callback
 */

const sendMail = (data) => {
  return new Promise((resolve, reject) => {
    try {
      //console.debug('Email data: ' + JSON.stringify(data));
      let emailObj = {
        message: {
          from: data.from || 'noreply@serviceo.me',
        },
        views: {
          root: path.join(__dirname, '..', 'email_templates'),
        },
        send: true,
        preview: false,
        transport: t,
        juice: true,
        juiceResources: {
          preserveImportant: true,
          webResources: {
            relativeTo: path.join(__dirname, '..', 'build')
          }
        },
      }
      if (data && data.attachment) {
        emailObj.message['attachments'] = [
          {
            filename: data.attachment.fileName,
            path: data.attachment.path
          }]
      }
      const email = new Email(emailObj);

      //console.debug('path.resolve' + path.resolve('email_templates'));

      email
        .send({
          template: data.template,
          message: {
            to: data.to,
            cc: data.cc,
            bcc: data.bcc
          },
          locals: data.params,
        })
        .then(result => {
          console.debug('Email has been send successfully!');
          resolve(true);
        })
        .catch(err => {
          console.debug(err);
          resolve(false);
        });
    } catch (error) {
      resolve(false);
    }
  });
}

module.exports = Mailer;
Mailer.send = sendMail;