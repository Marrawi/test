const User = require('./../../models/user');
const Work = require('./../../models/work');
const AppError = require('./../../utilities/AppError');

module.exports = {

  getThisTask: async (args, req) => {
    try {

      // if user doesn't have auth
      if (!req.isAuth) { return AppError('Must_Sign_In'); }

      // find the User in Database via username
      const user = await User.findById(req.userId);

      // find all Work data in Database and select userFeed only for the same user
      const work = await Work.findById({'_id': args.workID},{ _id: 1,name: 1, timeToFinish: 1, paid: 1, isOpen: 1, priority: 1,
        tags: 1, requirements: 1, steps: 1, explainLink: 1, proofs: 1, finisedTopNum: 1, createdAt: 1,
        userFeed: {$elemMatch: {userId: req.userId}}
      });

      // return the result to API
      return {
        __typename: "Task",
        status: true,
        id: work.id,
        name: work.name,
        timeToFinish: work.timeToFinish,
        paid: work.paid,
        isOpen: work.isOpen,
        priority: work.priority,
        tags: work.tags,
        requirements: work.requirements,
        steps: work.steps,
        explainLink: work.explainLink,
        proofs: work.proofs,
        finisedTopNum: work.finisedTopNum,
        createdAt: work.createdAt,
        userFeed: work.userFeed
      };
    }
    catch (err) { console.log(err); }
  }
}
