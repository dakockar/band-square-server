require('dotenv/config');
require('./db');

const express = require('express');
const app = express();

const PORT = process.env.PORT || 5005;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});


require('./config')(app);

const session = require('express-session');
const MongoStore = require('connect-mongo').default;

app.use(session({
  secret: 'NotMyAge',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // is in milliseconds. expiring in 1 day
  },
  store: new MongoStore({
    mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/band-square",
    ttl: 60 * 60 * 24 // is in seconds. expiring in 1 day
  })
}));

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// routes
const allRoutes = require('./routes');
app.use('/api', allRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const profRoutes = require('./routes/profile.routes');
app.use('/api', profRoutes);

const cloudinaryRoutes = require('./routes/cloudinary.routes');
app.use('/api', cloudinaryRoutes);

app.use((req, res) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);


// SOCKET SERVER
const socket = require("socket.io");
const MessageModel = require('./models/Message.model');

io = socket(server);

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    const { to, from, author, message, room } = data;

    MessageModel.create({ to, from, author: author, message: message, room })
      .then((response) => {
        socket.to(response.room).emit("receive_message", response);
      })
      .catch((err) => {
        console.log('error while creating message', err);
      });
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});


module.exports = app;