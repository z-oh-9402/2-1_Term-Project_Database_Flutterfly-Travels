require('dotenv').config();
const PORT = process.env.PORT;

const morgan = require('morgan');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.options('*',cors());

app.use("/",require('./router/routes'))

// Any error thrown in a route ends up here
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Something went wrong on the server" });
});


const server = app.listen(PORT,()=>{
    console.log(`Server has started on port ${PORT}...`);
});

// Real-time notifications (socket.io) share the same port
require('./realtime').attach(server);