const router = require('express').Router();
const MusicianModel = require('../models/Musician.model');
const OwnerModel = require('../models/Owner.model');
const VenueModel = require('../models/Venue.model');
const MessageModel = require('../models/Message.model');


router.get('/users', (req, res) => {
  MusicianModel.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Something went wrong with users',
        message: err
      });
    });
});


router.get('/venues', (req, res) => {
  VenueModel.find()
    .then((venues) => {
      res.status(200).json(venues);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Something went wrong with the venues',
        message: err
      });
    });
});


router.get('/musician-profile/:userId', (req, res) => {
  const { userId } = req.params;

  MusicianModel.findById(userId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Something went wrong with musician-profile',
        message: err
      });
    });
});


router.patch('/musician-profile/:userId', (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, location, instrument, bandName, genre, aboutMe, lookingFor } = req.body;

  MusicianModel.findByIdAndUpdate(userId, { $set: { firstName, lastName, location, instrument, bandName, genre, aboutMe, lookingFor } }, { new: true })
    .then((response) => {
      req.session.loggedInUser = response;
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Something went wrong while updating musician-profile',
        message: err
      });
    });
});


// upload profile picture for musicians and owners
router.patch('/upload/:userId', (req, res, next) => {
  const { userId } = req.params;
  const { imgUrl, type } = req.body;

  if (type === "musician") {
    MusicianModel.findByIdAndUpdate(userId, { $set: { imgUrl } }, { new: true })
      .then((response) => {
        req.session.loggedInUser = response;
        res.status(200).json(response);
      })
      .catch((err) => {
        res.status(500).json({
          error: 'Something went wrong uploading picture musician',
          message: err
        });
      });
  }
  else if (type === "owner") {
    OwnerModel.findByIdAndUpdate(userId, { $set: { imgUrl } }, { new: true })
      .then((response) => {
        req.session.loggedInUser = response;
        res.status(200).json(response);
      })
      .catch((err) => {
        res.status(500).json({
          error: 'Something went wrong uploading picture owner',
          message: err
        });
      });
  }
});


router.patch('/owner-profile/:ownerId', (req, res) => {
  const { ownerId } = req.params;
  const { firstName, lastName } = req.body;

  OwnerModel.findByIdAndUpdate(ownerId, { $set: { firstName, lastName } }, { new: true })
    .then((response) => {
      req.session.loggedInUser = response;
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "something went wrong editing owner",
        message: err
      });
    });
});


router.get('/musician/:musicianId', (req, res) => {
  MusicianModel.findById(req.params.musicianId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Something went wrong getting musician',
        message: err
      });
    });
});


router.post('/add-venue', (req, res) => {
  const { title, location, size, ownerId, imgUrl } = req.body;

  // SERVER SIDE VALIDATION
  if (!title || !location || !size) {
    res.status(500)
      .json({
        message: 'Please fill in all the fields'
      });
    return;
  }

  VenueModel.create({ title, location, size, ownerId, imgUrl })
    .then((venue) => {
      res.status(200).json(venue);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Venue creation failed",
        message: err
      });
    });
});


router.get('/venues/:ownerId', (req, res) => {
  const { ownerId } = req.params;

  VenueModel.find({ ownerId })
    .populate("ownerId")
    .then((venues) => {
      res.status(200).json(venues);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Something went wrong when finding venues owner',
        message: err
      });
    });
});


router.get('/venue/:venueId', (req, res, next) => {
  const { venueId } = req.params;

  VenueModel.findById(venueId)
    .then((venue) => {
      res.status(200).json(venue);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Getting venue failed',
        message: err
      });
    });
});


router.patch('/venue/:venueId', (req, res) => {
  const { venueId } = req.params;
  const { title, location, size, imgUrl } = req.body;

  VenueModel.findByIdAndUpdate(venueId, { title, location, size, imgUrl }, { new: true })
    .then((venue) => {
      res.status(200).json(venue);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Editing venue failed',
        message: err
      });
    });
});


router.delete('/venue/:venueId', (req, res) => {
  const { venueId } = req.params;

  VenueModel.findByIdAndDelete(venueId)
    .then((deletedVenue) => {
      res.status(200).json(deletedVenue);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Venue could not be deleted',
        message: err
      });
    });
});


router.get('/chat/:userId', (req, res) => {
  const { userId } = req.params;

  MessageModel.find({ to: userId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Something went wrong while getting chat',
        message: err
      });
    });
});


router.get('/messages/:room', (req, res) => {
  const { room } = req.params;

  MessageModel.find({ room: room })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'something went wrong with chat rooms',
        message: err
      });
    });
});


module.exports = router;