const router = require("express").Router();
var bcrypt = require('bcryptjs');
const { Socket } = require("socket.io");
const MusicianModel = require('../models/Musician.model');
const OwnerModel = require('../models/Owner.model');


router.post('/signup', (req, res) => {
  const { email, password, type } = req.body;

  // SERVER SIDE VALIDATION
  if (!email || !password) {
    res.status(500)
      .json({
        errorMessage: 'Please enter email and password'
      });
    return;
  }

  // PassWord Hashing
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  if (type === 'musician') {
    MusicianModel.create({ email, password: hash })
      .then((user) => {
        // ensuring that we don't share the hash as well with the user
        user.password = "***";
        res.status(200).json(user);
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(500).json({
            errorMessage: 'email entered already exists!',
            message: err
          });
        }
        else {
          res.status(500).json({
            errorMessage: 'Something went wrong! Go to sleep!',
            message: err
          });
        }
      });
  }
  else {
    OwnerModel.create({ email, password: hash })
      .then((user) => {
        // ensuring that we don't share the hash as well with the user
        user.password = "***";
        res.status(200).json(user);
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(500).json({
            errorMessage: 'email entered already exists!',
            message: err
          });
        }
        else {
          res.status(500).json({
            errorMessage: 'Something went wrong! Go to sleep!',
            message: err
          });
        }
      });
  }
});


router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  // SERVER SIDE VALIDATION
  if (!email || !password) {
    res.status(500).json({
      errorMessage: 'Please enter email and password'
    });
    return;
  }

  MusicianModel.findOne({ email })
    .then((user) => {
      // checking for password match
      bcrypt.compare(password, user.password)
        .then((passwordIsCorrect) => {
          if (passwordIsCorrect) {
            user.password = '***';
            req.session.loggedInUser = user;
            res.status(200).json(user);
            const me = () => async dispatch => {
              try {
                const { data } = await axios.get('/user');
                dispatch(getUser(data));
                socket.emit('logged-in', data._id);
              } catch (err) {
                console.log(err);
              }
            };
          }
          else {
            res.status(500).json({
              errorMessage: 'Passwords don\'t match'
            });
            return;
          }
        })
        .catch(() => {
          res.status(500).json({
            errorMessage: 'Something went wrong'
          });
          return;
        });
    })
    .catch((err) => {
      OwnerModel.findOne({ email })
        .then((user) => {
          // checking for password match
          bcrypt.compare(password, user.password)
            .then((passwordIsCorrect) => {
              if (passwordIsCorrect) {
                user.password = '***';
                req.session.loggedInUser = user;
                res.status(200).json(user);
              }
              else {
                res.status(500).json({
                  error: 'Passwords don\'t match'
                });
                return;
              }
            })
            .catch((err) => {
              res.status(500).json({
                errorMessage: 'something went wrong',
                message: err
              });
              return;
            });
        })
        .catch(() => {
          res.status(500).json({
            errorMessage: 'Wrong email',
            message: err
          });
          return;
        });
    });
});


router.post('/signout', (req, res) => {
  req.session.destroy();
  res.status(204).json({
    message: "successfully signed out"
  });
});



const isLoggedIn = (req, res, next) => {
  if (req.session.loggedInUser) {
    next();
  }
  else {
    res.status(401).json({
      message: 'Unauthorized user',
      code: 401
    });
  }
};


router.get('/user', isLoggedIn, (req, res) => {
  res.status(200).json(req.session.loggedInUser);
});


module.exports = router;