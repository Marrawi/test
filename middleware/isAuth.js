const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  
  const csrf = await req.get('Authorization');
  if (!csrf) { req.isAuth = false; return next(); }

  const localToken = csrf.split(' ')[1];
  const cookie = await req.headers.cookie;
  if (!localToken || localToken === '' || !cookie ) { req.isAuth = false; return next(); }

  const verifylocalToken = await localToken.split(".")[0];
  const splitVerifycookie = await cookie.split(".");
  const verifycookie = await splitVerifycookie[0].replace(/^auth=/,'').concat('.').concat(splitVerifycookie[1]);

  const finishedToken = await verifylocalToken.concat('.').concat(verifycookie);

  let jwtToken;

  try { jwtToken = await jwt.verify(finishedToken, process.env.JWT_SECRET) }
  catch (err) { req.isAuth = false; return next(); }

  if (!jwtToken) { req.isAuth = false; return next(); }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  req.ip = ip;
  req.isAuth = true;
  req.userId = jwtToken.id;

  next();

};
