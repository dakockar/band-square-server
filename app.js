// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

const app = express();
// const httpServer = require('http').createServer(app)
// const options = {}
// const io = require('socket.io')(httpServer, options)

// io.on('connection', socket => {})
// httpServer.listen



// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// //SOCKET SERVER
// const socket = require("socket.io");
// const cors = require("cors");

// app.use(cors());
// app.use(express.json());

// const server = app.listen("3002", () => {
//   console.log("Server Running on Port 3002...");
// });

// io = socket(server);

// io.on("connection", (socket) => {
//   console.log(socket.id);

//   socket.on("join_room", (data) => {
//     socket.join(data);
//     console.log("User Joined Room: " + data);
//   });

//   socket.on("send_message", (data) => {
//     console.log(data);
//     socket.to(data.room).emit("receive_message", data.content);
//   });

//   socket.on("disconnect", () => {
//     console.log("USER DISCONNECTED");
//   });
// });



const session = require('express-session');
const MongoStore = require('connect-mongo').default;

app.use(session({
  secret: 'NotMyAge',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24// is in milliseconds.  expiring in 1 day
  },
  store: new MongoStore({
    mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/band-square",
    ttl: 60 * 60 * 24, // is in seconds. expiring in 1 day
  })
}));




// 👇 Start handling routes here
// Contrary to the views version, all routes are controled from the routes/index.js
const allRoutes = require('./routes');
app.use('/api', allRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const profRoutes = require('./routes/profile.routes');
app.use('/api', profRoutes)

const cloudinaryRoutes = require('./routes/cloudinary.routes')
app.use('/api', cloudinaryRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
