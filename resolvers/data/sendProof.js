const User = require('./../../models/user');
const Work = require('./../../models/work');
const db = require('./../../utilities/dbUtil');
const AppError = require('./../../utilities/AppError');

module.exports = {

  sendProof: async (args, req) => {

    try {

      // if user doesn't have auth
      if (!req.isAuth) { return AppError('Must_Sign_In'); }

      // find the User in Database via email
      let user = await User.findById(req.userId);

      if (!user) { return AppError('Account_Not_Found'); }

      for (var i = 0; i < user.userIP.length; i++) { if ( user.userIP[i].ip != req.ip ) { user.userIP.push(req.ip); break; } }

      user.save();

      let workID = await Work.findById(args.workID);

      if (!workID) { return AppError('Task_Not_Found'); }

      const dataList = JSON.parse(args.data)

      const userProof =  {
        userId: req.userId,
        userProofs: dataList,
        createdAt: new Date(),
        updatedAt: new Date(),
        waitToVerify: true,
        success: false,
        failed: false,
        faildMassage: ''
      }

      let maxWorker = 0;

      if (workID.userFeed.length > 0) {
        for (var i = 0; i < workID.userFeed.length; i++) {
          if (workID.userFeed[i].userId == req.userId) { return AppError('Task_Already_Finished'); }
          if (workID.userFeed[i].success) { maxWorker += 1 }
          break;
        }
      };

      if (!workID.isOpen) { return AppError('Task_Already_Closed') }

      await workID.userFeed.push(userProof);

      if (maxWorker == workID.finisedTopNum) { workID.isOpen = false };

      await workID.save();

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
