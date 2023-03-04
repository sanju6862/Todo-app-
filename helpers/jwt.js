 
const jwt = require('jsonwebtoken'); // to generate JSON web token

const generateJWT = (user) => {
  const token = jwt.sign({
    userId: user.id,
    email: user.email,
  }, process.env.TOKEN, {
    expiresIn: '24h', // CHANGE 24h EXPIRATION INTERVAL!!!
  });
  return {
    userId: user.id,
    token: token,
    tokenExpiration: 24, // CHANGE 24h EXPIRATION INTERVAL!!!
    email: user.email,
  };
};

module.exports = {generateJWT};
