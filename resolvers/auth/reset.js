const User = require('./../../models/user');
const captcha = require('./../../utilities/captcha').captcha;
const AppError = require('./../../utilities/AppError');
const sendEmail = require('./../../utilities/email').sendEmail;
const randomstring = require("randomstring");

/*

//////////// the logic of reset password method \\\\\\\\\\\\\\\

1) user post a request with his email
2) search for user with this email in database
3) if there is not a user reject the proccess
4) get time now and add some minutes to it for stopping many send Email request
5) culculate if the user have to wait before sending another Email
6) if user has to waith => send wait response
7) if user does not need to wait => send Email with verfiection link
8) update the time for waiting in database
10) after sending an email and user click on link => verfiy if the params id is real
11) find the User in Database via ID
12) if there is not a user reject the preocess
13) hash the password
14) update User isVerified state
15) return the result to API

*/

/////////////////////////////////////////////// send reset password email Logic

module.exports = {

  reset: async (args, req) => {

    try {

      const captchaResault = await captcha(args.recaptchaToken);
      if (!captchaResault) { return AppError('Captcha_Error'); }

      // if user already sign in
      if (req.isAuth) { return AppError('Already_Sign_In'); }

      const email = args.email.toLowerCase();

      // find the User in Database via email
      const user = await User.findOne({ email: email });

      if (!user) { return AppError('Account_Not_Found'); }

      // get data now in sec
      const timeInSec = await Math.round(Date.now() / 1000);

      // culculate if the user have to wait before sending another Email
      const wait = user.waitToSend - timeInSec;

      // learn about this function in https://www.geeksforgeeks.org/javascript-math-sign-function/
      if (Math.sign(wait) == 1) { return AppError('Wait_Email_Sending'); }

      // generate random string for verifing user's email
      const verifyToken = await randomstring.generate(process.env.RANDOM_STRING);

      const emailResult = await sendEmail(user.username, user.email, verifyToken, 'reset');
      if (!emailResult) { return AppError('Email_Sending_Error'); }

      // Math.round() to eleminate the decmeial point
      const newWait = await Math.round(Date.now() / 1000) + ( process.env.WAITING_MIN * 60 );

      // update User verifyToken token
      await User.updateOne({_id:user.id},{$set:{waitToSend: newWait, verifyToken: verifyToken}});

      // send the result to API
      return { __typename: "Massage", status: true };

    }
    catch (err) { console.log(err); }
  }
}
