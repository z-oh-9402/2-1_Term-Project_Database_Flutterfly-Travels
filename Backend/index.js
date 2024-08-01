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

app.listen(PORT,()=>{
    console.log(`Server has started on port ${PORT}...`);
});