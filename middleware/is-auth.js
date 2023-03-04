 
const jwt = require('jsonwebtoken');
const process = require('process');

module.exports = (req, res, next) => {
  // to checking header and then token in it.
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  // to extract token [1]
  const token = authHeader.split(' ')[1]; // Authorization: Bearer token
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
