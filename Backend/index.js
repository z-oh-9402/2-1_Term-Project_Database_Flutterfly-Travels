require('dotenv').config();
const PORT = process.env.PORT;

const morgan = require('morgan');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.options('*',cors());

app.use("/",require('./router/routes'))

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

// Any error thrown in a route ends up here
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Something went wrong on the server" });
});


app.listen(PORT,()=>{
    console.log(`Server has started on port ${PORT}...`);
});