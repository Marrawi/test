const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const User = require('./../../models/user');
const Work = require('./../../models/work');
const captcha = require('./../../utilities/captcha').captcha;
const AppError = require('./../../utilities/AppError');
const db = require('./../../utilities/dbUtil');

//////////// the logic of Log-in method \\\\\\\\\\\\\\
/*

1) user post a request with username and password
2) search for user with this username in database
3) if there is not a user reject the proccess
4) if the user is not verified his email => reject the process
5) check the password from API if equal to user passwordin database
6) create JWT token for authentication
7) return the result to API

*/

module.exports = {

  signIn: async (args, context) => {
    try {

      const captchaResault = await captcha(args.recaptchaToken);
      if (!captchaResault) { return AppError('Captcha_Error'); }

      // if user already sign in
      if (context.isAuth) { return AppError('Already_Sign_In'); }

      const username = args.username.toLowerCase();

      // find the User in Database via username
      const user = await User.findOne({ username: username });

      if (!user) { return AppError('Account_Not_Found'); }

      // if the user is not verified his email reject the process
      if (!user.isVerified) { return AppError('Account_Not_Verified'); }

      for (var i = 0; i < user.userIP.length; i++) { if ( user.userIP[i].ip != req.ip ) { user.userIP.push(req.ip); break; } }

      user.save();

      // check the password from API if equal to user password
      const isEqual = await bcrypt.compare(args.password, user.password);
      if (isEqual == false) { return AppError('Incorrect_Password'); }

      // create JWT token
      const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET , { expiresIn: process.env.JWT_EXPIRES_IN });

      // split the token to constant head and variable body
      const splitToken = token.split(".");

      // generate rubbish three tokens : newToken1, newToken2, httpToken and will be deleted
      const newToken1 = await randomstring.generate(23);
      const newToken2 = await randomstring.generate(43);
      const httpToken = await randomstring.generate(43);

      // the localStorage token will be constant head from splitToken and two rubbish tokens : newToken2, httpToken
      const newToken = await splitToken[0].concat('.').concat(newToken1).concat('.').concat(newToken2);

      // the httpOnly cookie Tolken will be variable body and rubbish token : httpToken
      const httpCookie = await splitToken[1].concat('.').concat(splitToken[2]).concat('.').concat(httpToken);

      // set up httpOnly Cookie in User browser
      await context.res.cookie('auth', httpCookie, { maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: true });

      // find the Work in Database via username
      const work = await Work.find({},{ _id: 1,name: 1, timeToFinish: 1, paid: 1, isOpen: 1, priority: 1,
        tags: 1, requirements: 1, steps: 1, explainLink: 1, proofs: 1, finisedTopNum: 1, createdAt: 1,
        userFeed: {$elemMatch: {userId: user.id}}
      });

      let col = await db.getCollection('info');

      let data = await col.findOne({name: 'info'});

      let totalProfit = data.allProfit;
      let totalUsers = data.allUsers;
      let siteAge = process.env.SITE_AGE

      // return the result to API
      return {
        __typename: "User",
        status:  true,
        token: token,
        email: user.email,
        username: user.username,
        money: user.money,
        phoneType: user.phoneType,
        phone: user.phone,
        totalProfit: totalProfit,
        totalUsers: totalUsers,
        siteAge: siteAge,
        blocked: user.blocked,
        withdraws: user.withdraws,
        work: work
      };
    }
    catch (err) { console.log(err); }
  }
}
