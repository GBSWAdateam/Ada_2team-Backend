const { name } = require('ejs');
const mongoose = require('mongoose');
const connected = mongoose.connect("mongodb://localhost:27017/Login-tut");

//check data
connected.then(() => {
    console.log("Database connected successfully");
}).catch(() => {
    console.log("Database connection failed");
})



//Create schema
const LoginSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

//collection part
const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;
