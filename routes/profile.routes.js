const router = require("express").Router();

const MusicianModel = require('../models/Musician.model')
const OwnerModel = require('../models/Owner.model')


router.get('/users', (req, res) => {
  MusicianModel.find()
    .then((users) => {
      res.status(200).json(users)
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Something went wrong',
        message: err
      })
    })
})


router.get('/musician-profile/:userId', (req, res) => {
  MusicianModel.findById(req.param.userId)
    .then((response) => {
      res.status(200).json(response)
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Something went wrong',
        message: err
      })
    })
})

router.patch('/musician-profile/:id', (req, res) => {
  let id = req.params.id

  const { firstName, lastName, location, instrument, bandName, genre, aboutMe } = req.body;

  MusicianModel.findByIdAndUpdate(id, { $set: { firstName, lastName, location, instrument, bandName, genre, aboutMe } }, { new: true })
    .then((response) => {
      console.log("inside findbyid", response);
      req.session.loggedInUser = response;
      console.log(req.session.loggedInUser);
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: 'Something went wrong',
        message: err
      })
    })
})


router.patch('/owner-profile/:ownerId', (req, res) => {

  let ownerId = req.params.ownerId;
  const { firstName, lastName } = req.body;

  OwnerModel.findByIdAndUpdate(ownerId, { $set: { firstName, lastName } }, { new: true })
    .then((response) => {
      req.session.loggedInUser = response;
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "something went wrong",
        message: err
      })
    });

})



module.exports = router