const User = require('./../../models/user');
const Work = require('./../../models/work');
const db = require('./../../utilities/dbUtil');
const AppError = require('./../../utilities/AppError');

module.exports = {

  getData: async (args, req) => {
    try {

      // if user doesn't have auth
      if (!req.isAuth) { return AppError('Must_Sign_In'); }

      // find the User in Database via username
      const user = await User.findById(req.userId);

      // find all Work data in Database and select userFeed only for the same user
      const work = await Work.find({},{ _id: 1,name: 1, timeToFinish: 1, paid: 1, isOpen: 1, priority: 1,
        tags: 1, requirements: 1, steps: 1, explainLink: 1, proofs: 1, finisedTopNum: 1, createdAt: 1,
        userFeed: {$elemMatch: {userId: req.userId}}
      });

      let col = await db.getCollection('info');

      let data = await col.findOne({name: 'info'});

      let totalProfit = data.allProfit;
      let totalUsers = data.allUsers;
      let siteAge = process.env.SITE_AGE

      // return the result to API
      return {
        __typename: "Data",
        status:  true,
        email: user.email,
        username: user.username,
        money: user.money,
        phoneType: user.phoneType,
        phone: user.phone,
        totalProfit: totalProfit,
        totalUsers: totalUsers,
        siteAge: siteAge,
        withdraws: user.withdraws,
        work: work
      };
    }
    catch (err) { console.log(err); }
  }
}
