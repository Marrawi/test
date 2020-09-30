const lokijs = require('lokijs');

const db = new lokijs('db.json', {autoload: true});

module.exports = db;
