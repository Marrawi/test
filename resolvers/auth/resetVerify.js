const bcrypt = require('bcrypt');
const User = require('./../../models/user');
const captcha = require('./../../utilities/captcha').captcha;
const AppError = require('./../../utilities/AppError');

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

  resetVerify: async (args, req) => {

    try {

      const captchaResault = await captcha(args.recaptchaToken);
      if (!captchaResault) { return AppError('Captcha_Error'); }

      // if user already sign in
      if (req.isAuth) { return AppError('Already_Sign_In'); }

      // find the User in Database via ID
      const user = await User.findOne({verifyToken: args.verifyToken});

      // if there is not a user reject the preocess
      if (!user) { return AppError('Account_Not_Found'); }

      // hash the password
      const hashedPassword = await bcrypt.hash(args.password, 12);

      // update User isVerified state
      await User.updateOne({_id:user.id},{$set:{password: hashedPassword, verifyToken: null}});

      // send the result to API
      return { __typename: "Massage", status: true };

    }
    catch (err) { console.log(err); }
  }
}
