const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../../models/user');
const db = require('./../../utilities/dbUtil');
const sendEmail = require('./../../utilities/email').sendEmail;
const captcha = require('./../../utilities/captcha').captcha;
const AppError = require('./../../utilities/AppError');
const randomstring = require("randomstring");

/*

/////// the logic of create-account method \\\\\\\

1) user post a request with varibales
2) search for user with this varibales in database
3) if user already sign up => reject the proccess
4) if user pass => hash the password
5) get time now for sending emails ( waith time )
6) create User document and save it in Database
7) send verfiection Email to user
8) return the result to API

*/

module.exports = {

  signUp: async (args, req) => {
    try {

      const captchaResault = await captcha(args.input.recaptchaToken);
      if (!captchaResault) { return AppError('Captcha_Error'); }

      // if user already sign in
      if (req.isAuth) { return AppError('Already_Sign_In'); }

      // search for user in database
      const existingUser = await User.findOne({ $or:
        [ { username: args.input.username }, { email: args.input.email }, { phone: args.input.phone } ]
      });

      // if user already sign up => reject the process
      if (existingUser) { return AppError('Unique_Variable'); }

      // hash the password
      const hashedPassword = await bcrypt.hash(args.input.password, 12);

      // (get time now for sending emails) + ( X min * 60 secounds)
      const time = await Math.round(Date.now() / 1000) + ( process.env.WAITING_MIN * 60 );

      // generate random string for verifing user's email
      const verifyToken = await randomstring.generate(process.env.RANDOM_STRING);

      const email = args.input.email.toLowerCase();

      const username = args.input.username.toLowerCase();

      // create User document and save it
      const user = new User({
        email: email,
        username: username,
        phoneType: args.input.phoneType,
        phone: args.input.phone,
        password: hashedPassword,
        money: 0,
        isVerified: false,
        isAdmin: false,
        waitToSend: time,
        verifyToken: verifyToken
      }).save();

      let col = await db.getCollection('info');

      let data = await col.findOne({name: 'info'});

      data.allUsers += 1

      await col.update(data);

      await db.saveDatabase();

      const emailResult = await sendEmail(user.username, user.email, verifyToken, 'verify')
      if (!emailResult) { return AppError('Email_Sending_Error'); }

      // return the result to API
      return { __typename: "Massage", status: true };

    }
    catch (err) { console.log(err); }
  }
}
