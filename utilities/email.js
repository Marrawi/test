const nodemailer = require('nodemailer');
const db = require('./dbUtil');

module.exports = {
  sendEmail: async function (UserName, UserEmail, verifyToken, text) {
    try {

      const col = await db.getCollection('info');

      let data = await col.findOne({name: 'info'});

      let emailSender, emailPassword;

      if (data.emailOneUsed <= data.emailTwoUsed && data.emailOneUsed <= data.emailThreeUsed) {
        emailSender = data.emailOneName;
        emailPassword = data.emailOnePassword;
        data.emailOneUsed += 1
      } else if ( data.emailTwoUsed <= data.emailOneUsed && data.emailTwoUsed <= data.emailThreeUsed ) {
        emailSender = data.emailTwoName;
        emailPassword = data.emailTwoPassword;
        data.emailTwoUsed += 1
      } else {
        emailSender = data.emailThreeName;
        emailPassword = data.emailThreePassword;
        data.emailThreeUsed += 1
      }

      const transporter = await nodemailer.createTransport({ service: 'gmail', host: 'smtp.gmail.com',
      port: 587, tls: {rejectUnauthorized: false}, auth: { user: emailSender, pass: emailPassword } });

      let Content, Subject;

      if (text == 'verify') {
        // email verifection Subject and Content to verfiy user email
        subject = 'تفعيل حسابك'
        content = `
        <div style="background-color: #fff; margin-top: 10%; margin-bottom:10%; width: 75%; color: #021A71; margin-right:auto;
        margin-left:auto; direction: rtl; text-align: center; border-style: solid; border-width: 5px; border-color: #021A71;">
          <h1 style="margin-top: 10%; font-size: 200%">مرحباً بك يا ${UserName} في موقع Syrian Worker</h1>
          <h1 style="font-size: 150%; margin-top: 5%">الرجاء الضغط على الزر التالي من أجل تفعيل حسابك في الموقع</h1>
          <a href="${process.env.FRONTEND_HOST}/send/${verifyToken}" style="align-items: center; text-decoration: none;
          background-color: #021A71; border-radius: 9999px; color: #fff; padding-left: 1%; padding-right: 1%;
          margin-top: 1%; font-weight: 700; cursor: pointer; font-size: 125%;">اضغط هنا</a>
          <h1 style="font-size:100%; margin-top: 5%">في حال عدم عمل الزر بشكل صحيح .. الرجاء نسخ الرابط التالي ولصقه في متصفحك</h1>
          <p style="font-size:100%; margin-bottom: 10%">${process.env.FRONTEND_HOST}/send/${verifyToken}</p>
        </div>
        `
      } else if (text == 'reset') {

        // email reset Content to reset user password
        subject = 'تغيير كلمة المرور'
        content = `
        <div style="background-color: #fff; margin-top: 10%; margin-bottom:10%; width: 75%; color: #021A71; margin-right:auto;
        margin-left:auto; direction: rtl; text-align: center; border-style: solid; border-width: 5px; border-color: #021A71;">
          <h1 style="margin-top: 10%; font-size: 200%">مرحباً بك يا ${UserName}</h1>
          <h1 style="font-size: 150%; margin-top: 5%">الرجاء الضغط على الرابط التالي من أجل إنشاء كلمة سر جديدة</h1>
          <a href="${process.env.FRONTEND_HOST}/reset/${verifyToken}"  style="align-items: center; text-decoration: none;
          background-color: #021A71; border-radius: 9999px; color: #fff; padding-left: 1%; padding-right: 1%;
          margin-top: 1%; font-weight: 700; cursor: pointer; font-size: 125%;">اضغط هنا</a>
          <h1 style="font-size:100%; margin-top: 5%">في حال عدم عمل الزر بشكل صحيح .. الرجاء نسخ الرابط التالي ولصقه في متصفحك</h1>
          <p style="font-size:100%; margin-bottom: 10%">${process.env.FRONTEND_HOST}/reset/${verifyToken}</p>
        </div>
        `
      }

      const mailOptions = { from: emailSender, to: UserEmail, subject: subject, html: content };

      const result = await transporter.sendMail(mailOptions);

      await col.update(data);

      await db.saveDatabase();

      return true

    } catch (err) {

    }
  }
}
