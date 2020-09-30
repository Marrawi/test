const User = require('./../../models/user');
const AppError = require('./../../utilities/AppError');

/*

//////// the logic of verify email method \\\\\\\\\\\

1) verfiy if the params id is real to mongoose
2) search for user with this ID in database
3) if there is not a user reject the proccess
4) update User isVerified state to true
5) return the result to API

*/

module.exports = {

  emailVerfiy: async (args) => {

    try {

      // find the User in Database via ID
      const user = await User.findOne({verifyToken: args.verifyToken});

      if (!user) { return AppError('Email_Verify_Error'); }

      // update User isVerified state
      await User.updateOne({_id:user.id},{$set:{isVerified: true, verifyToken: null}});

      // send the result to API
      return { __typename: "Massage", status: true };

    }
    catch (err) { console.log(err); }
  }
}
