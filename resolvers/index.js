// auth apps
const signIn = require('./auth/signin');
const signUp = require('./auth/signup');
const reset = require('./auth/reset');
const resetVerify = require('./auth/resetVerify');
const emailSend = require('./auth/emailSend');
const emailVerfiy = require('./auth/emailVerfiy');

// data info
const getData = require('./data/getData');
const getSiteInfo = require('./data/getSiteInfo');
const getThisTask = require('./data/getThisTask');
const updateData = require('./data/updateData');
const postWithdraw = require('./data/postWithdraw');
const sendProof = require('./data/sendProof');

const rootResolver = {
  ...signUp,
  ...signIn,
  ...reset,
  ...resetVerify,
  ...emailSend,
  ...emailVerfiy,
  ...getData,
  ...getSiteInfo,
  ...updateData,
  ...postWithdraw,
  ...sendProof,
  ...getThisTask
};

module.exports = rootResolver;
