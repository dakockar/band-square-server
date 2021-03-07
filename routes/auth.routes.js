const router = require("express").Router();
var bcrypt = require('bcryptjs');

const MusicianModel = require('../models/Musician.model');
const OwnerModel = require('../models/Owner.model');
const VenueModel = require('../models/Venue.model');



//POST ROUTE SIGNUP

router.post('/signup', (req, res, next) => {
  const { email, password, type } = req.body;


  // SERVER SIDE VALIDATION
  if (!email || !password) {
    res.status(500)
      .json({
        errorMessage: 'Please enter email and password'
      })
    return
  }
  // const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
  //   if (!myRegex.test(email)) {
  //       res.status(500).json({
  //         errorMessage: 'Email format not correct'
  //       });
  //       return;  
  //   }
  //   const myPassRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
  //   if (!myPassRegex.test(password)) {
  //     res.status(500).json({
  //       errorMessage: 'Password needs to have 8 characters, a number, an Uppercase alphabet and a special character'
  //     });
  //     return;  
  //   }

  //PassWord Hasing

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
        console.log('error---', err)
        if (err.code === 11000) {
          res.status(500).json({
            errorMessage: 'email entered already exists!',
            message: err,
          });
        }
        else {
          res.status(500).json({
            errorMessage: 'Something went wrong! Go to sleep!',
            message: err,
          });
        }
      })
  }
  else {
    OwnerModel.create({ email, password: hash })
      .then((user) => {
        // ensuring that we don't share the hash as well with the user
        user.password = "***";
        res.status(200).json(user);
      })
      .catch((err) => {
        console.log('error---', err)
        if (err.code === 11000) {
          res.status(500).json({
            errorMessage: 'email entered already exists!',
            message: err,
          });
        }
        else {
          res.status(500).json({
            errorMessage: 'Something went wrong! Go to sleep!',
            message: err,
          });
        }
      })
  }


})

// POST ROUTE FOR SIGNIN
router.post('/signin', (req, res, next) => {
  const { email, password } = req.body;
  // -----SERVER SIDE VALIDATION ----------
  /*
  if ( !email || !password) {
      res.status(500).json({
          error: 'Please enter Username. email and password',
     })
    return;  
  }
  const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
  if (!myRegex.test(email)) {
      res.status(500).json({
          error: 'Email format not correct',
      })
      return;  
  }
  */

  MusicianModel.findOne({ email })
    .then((user) => {
      // checking for password match
      bcrypt.compare(password, user.password)
        .then((doesItMatch) => {
          if (doesItMatch) {
            user.password = '***';
            req.session.loggedInUser = user;
            res.status(200).json(user)
          }
          else {
            res.status(500).json({
              error: 'Passwords don\'t match',
            })
            return;
          }
        })
        .catch((err) => {
          res.status(500).json({
            error: err
          })
          return
        });
    })
    .catch((err) => {
      OwnerModel.findOne({ email })
        .then((user) => {
          // checking for password match
          bcrypt.compare(password, user.password)
            .then((doesItMatch) => {
              if (doesItMatch) {
                user.password = '***';
                req.session.loggedInUser = user;
                res.status(200).json(user)
              }
              else {
                res.status(500).json({
                  error: 'Passwords don\'t match',
                })
                return;
              }
            })
            .catch((err) => {
              res.status(500).json({
                error: err
              })
              return
            });
        })
        .catch(() => {
          res.status(500).json({
            error: 'Wrong email',
            message: err
          })
          return;
        })
    })
})

router.post('/signout', (req, res, next) => {
  req.session.destroy();
  res.status(204).json({
    message: "successfully signed out"
  });
})





const isLoggedIn = (req, res, next) => {
  if (req.session.loggedInUser) {
    next()
  }
  else {
    res.status(401).json({
      message: 'Unauthorized user',
      code: 401
    })
  }
};



router.get('/user', isLoggedIn, (req, res, next) => {
  res.status(200).json(req.session.loggedInUser);
});






module.exports = router;