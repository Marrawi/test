const Work = require('./../../models/work');
const db = require('./../../utilities/dbUtil');

module.exports = {

  getSiteInfo: async (args, req) => {
    try {

      let col = await db.getCollection('info');

      let data = await col.findOne({name: 'info'});

      let totalProfit = data.allProfit;
      let totalUsers = data.allUsers;
      let siteAge = process.env.SITE_AGE

      // return the result to API
      return {
        status: true,
        totalProfit: totalProfit,
        totalUsers: totalUsers,
        siteAge: siteAge
      };

    }
    catch (err) { console.log(err); }
  }
}
