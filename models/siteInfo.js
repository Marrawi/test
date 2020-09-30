const database = require('lokijs');

const db = new database('db.json');

let data = db.getCollection('info');

if (!data) {
  data = db.addCollection('info').insert({
    name: 'info',
    allUsers: 0,
    allProfit: 0,
    emailOneName: 'syrianWorker1@gmail.com',
    emailOnePassword: 'mxyspueuthxirdgn',
    emailOneUsed: 0,
    emailTwoName: 'syrianWorker2@gmail.com',
    emailTwoPassword: 'mogzhiswzimcpjah',
    emailTwoUsed: 0,
    emailThreeName: 'syrianWorker3@gmail.com',
    emailThreePassword: 'zuyzebfkykbziqxc',
    emailThreeUsed: 0,
  });
}
