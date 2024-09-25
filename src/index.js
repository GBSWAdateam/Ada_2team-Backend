//exprestt seting
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config'); 

const app = express();  
// convert data into json inport
app.use(express.json());

app.use(express.urlencoded({extended: false}));

//port seting
const port = 5000;

//use view engine
app.set('view engine', 'ejs');

//seting static folder
app.use(express.static("public"));

//route seting
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/views/login' , (req,res) => {
    res.render('login');
})
//signup route
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Register user
app.post("/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const data = {
            name: req.body.name,
            password: hashedPassword
        };

        // Check if user already exists
        const existingUser = await collection.findOne({ name: data.name });

        if (existingUser) {
            res.send("User already exists");
        } else {
            const userdata = await collection.insertMany(data);
            console.log(userdata);
            res.render("signup-b");
        }
    } catch (error) {
        console.log("Error:", error);
        res.send("An error occurred");
    }
});

// Login user
app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ name: req.body.name });
        if (!user) {
            return res.send("User not found");
        }

      
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
            res.render("home");
        } else {
            res.send("Wrong password");
        }
    } catch (error) {
        console.log("Error:", error);
        res.send("An error occurred");
    }
});

//server seting
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

