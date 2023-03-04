 
const bcrypt = require('bcryptjs'); // to encrypt the passwords in the database

const User = require('../../models/user');
const Task = require('../../models/task');
const {authFacebook, authGoogle} = require('../../helpers/passport');
const {generateJWT} = require('../../helpers/jwt');
const {sendEmail, sendPasswordEmail} = require('../../helpers/nodemailer');
const jwt = require('jsonwebtoken'); // to generate JSON web token

module.exports = {
  createUser: async (args) => {
    try {
      // Checking whether the email already exists in the database.
      // If not, to encrypt this password and save the new user in the database.
      const existingUser = await User.findOne({
        email: args.userInput.email,
      });
      if (existingUser) {
        throw new Error('User exists already');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password,
          parseInt(process.env.BCRYPT));

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        confirmed: false,
      });
      const result = await user.save();
      // Send confirmation email.
      sendEmail(result);
      return generateJWT(result);
    } catch (error) {
      throw error;
    }
  },
  login: async ({email, password}) => {
    const user = await User.findOne({
      email: email,
    });
    // Validate the email whether it exists in the database or not.
    if (!user) {
      throw new Error('User does not exist');
    }
    // to compare password by using bcrypt.
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect');
    }
    return generateJWT(user);
  },
  authFacebook: async (args, req, res) => {
    const existingUser = await User.findOne({
      email: args.facebookInput.email,
    });
    req.body = {
      ...req.body,
      access_token: args.facebookInput.accessToken,
    };
    try {
      const {data, info} = await authFacebook(req, res);
      if (data) {
        if (existingUser) {
          console.log('existing User', existingUser);
          return generateJWT(existingUser);
        } else {
          const user = new User({
            email: args.facebookInput.email,
            password: null,
            confirmed: null,
          });
          const result = await user.save();
          return generateJWT(result);
        }
      }
      if (info) {
        console.log(info);
        switch (info.code) {
          case 'ETIMEDOUT':
            return (new Error('Failed to reach Facebook: Try again'));
          default:
            return (new Error('Facebook: something went wrong'));
        }
      }
    } catch (error) {
      return error;
    }
  },
  authGoogle: async (args, req, res) => {
    const existingUser = await User.findOne({
      email: args.googleInput.email,
    });
    try {
      const {data, info} = await authGoogle(req, res);
      if (data) {
        if (existingUser) {
          console.log('existing User', existingUser);
          return generateJWT(existingUser);
        } else {
          const user = new User({
            email: args.googleInput.email,
            password: null,
            confirmed: null,
          });
          const result = await user.save();
          return generateJWT(result);
        }
      }
      if (info) {
        console.log(info);
        switch (info.code) {
          case 'ETIMEDOUT':
            return (new Error('Failed to reach Google: Try again'));
          default:
            return (new Error('Google: something went wrong'));
        }
      }
    } catch (error) {
      return error;
    }
  },
  confirmUser: async (args) => {
    try {
      const decodedToken = jwt.verify(args.confirmInput.emailToken,
          process.env.NODEMAILER_TOKEN);
      await User.findByIdAndUpdate(decodedToken.user, {
        $set: {
          confirmed: true,
        },
      }).exec();
      return {
        msgs: 'User\'s email has been confirmed!',
      };
    } catch (err) {
      throw err;
    }
  },
  resetPasswordEmail: async (args) => {
    try {
      // Checking whether the email already exists in the database.
      const user = await User.findOne({
        email: args.resetPasswordInput.email,
      });
      if (!user) {
        throw new Error('User does not exist');
      } else if (!user.password) {
        throw new Error('You have previously logged in with a social media account. As a security measure, you can not reset password');
      } else {
        sendPasswordEmail(user);
      }
      return {
        msgs: 'Email was sent.',
      };
    } catch (err) {
      throw err;
    }
  },
  resetPassword: async (args) => {
    try {
      const decodedToken = jwt.verify(args.resetPasswordInput.emailToken,
          process.env.NODEMAILER_PASSWORD_TOKEN);
      const hashedPassword = await bcrypt.hash(args.resetPasswordInput.password,
          parseInt(process.env.BCRYPT));
      const result = await User.findByIdAndUpdate(decodedToken.user, {
        $set: {
          password: hashedPassword,
        }});
      return {
        ...result._doc,
        password: null,
      };
    } catch (err) {
      throw err;
    }
  },
  changeEmail: async (args, req) => {
    const user = await User.findById({_id: req.userId});
    const newEmailUser = await User.findOne({email: args.newEmail});
    if (!user.password) {
      throw new Error('You have previously logged in with a social media account. As a security measure, you can not change your email.');
    } else if (newEmailUser) {
      throw new Error('This email address is already registered.');
    } else {
    // to compare password by using bcrypt.
      const isEqual = await bcrypt.compare(args.password, user.password);
      if (!isEqual) {
        throw new Error('Password is incorrect ');
      } else {
        const result = await User.findByIdAndUpdate(req.userId, {
          $set: {
            email: args.newEmail,
          }});
        const resultEmail = {
          ...result._doc,
          id: result._id,
          email: args.newEmail,
        };
        return generateJWT(resultEmail);
      }
    }
  },
  changePassword: async (args, req) => {
    try {
      const user = await User.findById({_id: req.userId});
      const hashedPassword = await bcrypt.hash(args.newPassword,
          parseInt(process.env.BCRYPT));

      if (!user.password) {
        throw new Error('You have previously logged in with a social media account. As a security measure, you can not change your password.');
      } else {
        const isEqual = await bcrypt.compare(args.password, user.password);
        if (!isEqual) {
          throw new Error('Password is incorrect');
        } else {
          await User.findByIdAndUpdate(req.userId, {
            $set: {
              password: hashedPassword,
            }});
          return {
            msgs: 'Password successfilly changed!',
          };
        }
      }
    } catch (err) {
      throw err;
    }
  },
  deleteUser: async (args) => {
    try {
      await Task.deleteMany({creator: args.userId});
      await User.deleteOne({_id: args.userId});
      return {
        msgs: 'User successfilly deleted!',
      };
    } catch (err) {
      throw err;
    }
  },
};
