const router = require("express").Router();

const MusicianModel = require('../models/Musician.model')
const OwnerModel = require('../models/Owner.model')
const VenueModel = require('../models/Venue.model')


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


router.get('/venues', (req, res, next) => {
  VenueModel.find()
    .then((venues) => {
      console.log("all venues: ", venues)
      res.status(200).json(venues);
    }).catch((err) => {

    });
})

router.get('/musician-profile/:userId', (req, res) => {

  const { userId } = req.params;

  MusicianModel.findById(userId)
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

router.patch('/musician-profile/:userId', (req, res) => {
  const { userId } = req.params;

  const { firstName, lastName, location, instrument, bandName, genre, aboutMe } = req.body;

  MusicianModel.findByIdAndUpdate(userId, { $set: { firstName, lastName, location, instrument, bandName, genre, aboutMe } }, { new: true })
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

  const { ownerId } = req.params;
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


router.post('/add-venue', (req, res, next) => {
  const { title, location, size, ownerId } = req.body;
  // let owner = req.session.loggedInUser;

  // SERVER SIDE VALIDATION
  if (!title || !location || !size) {
    res.status(500)
      .json({
        message: 'Please fill all the fields'
      })
    return
  }

  VenueModel.create({ title, location, size, ownerId })
    .then((venue) => {
      res.status(200).json(venue);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "Venue creation failed",
        message: err
      });
    });
})


router.get('/venues/:ownerId', (req, res, next) => {
  const { ownerId } = req.params;

  VenueModel.find({ ownerId })
    .populate("ownerId")
    .then((venues) => {
      res.status(200).json(venues);
    })
    .catch((err) => {
      console.log("getting venues failed");
      res.status(500).json({
        message: err
      })
    });
})



router.get('/venue/:venueId', (req, res, next) => {
  const { venueId } = req.params;

  VenueModel.findById(venueId)
    .then((venue) => {
      console.log("venue is fetched: ", venue);
      res.status(200).json(venue);
    })
    .catch((err) => {
      console.log("can't get venue");
      res.status(500).json({
        message: err
      })
    });
})


router.patch('/venue/:venueId', (req, res, next) => {
  const { venueId } = req.params;
  const { title, location, size } = req.body;

  VenueModel.findByIdAndUpdate(venueId, { title, location, size }, { new: true })
    .then((venue) => {
      console.log("venue edited: ", venue);
      res.status(200).json(venue);
    })
    .catch((err) => {
      console.log("edit venue failed");
      res.status(500).json({
        message: err
      })
    });
})


router.delete('/venue/:venueId', (req, res, next) => {
  const { venueId } = req.params;
  console.log("delete venue: ", venueId);

  VenueModel.findByIdAndDelete(venueId)
    .then((deletedVenue) => {
      console.log("venue deleted: ", deletedVenue);
      res.status(200).json(deletedVenue)
    })
    .catch((err) => {
      console.log("venue couldn't be deleted");
      res.status(500).json({
        message: err
      })
    });


})


module.exports = router