//exprestt seting
const express = require('express');
const jquery = require('jquery');
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
app.use(express.static('imgs'));
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

app.get("login")
{
     
}

//naver
app.get('/naver' , (req,res) => {
    res.render('naver');
})

//kakaotalk
app.get('/kakaotalk' , (req,res) => {
    res.render('kakaotalk');
})

//reset-password
app.get('/reset-password' , (req,res) => {
    res.render('reset-password');
})

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
            res.redirect("/signup-b");  // 회원가입 성공 시 /signup-b로 리다이렉트
        }
    } catch (error) {
        console.log("Error:", error);
        res.send("An error occurred");
    }
});

// signup-b 라우트를 별도로 정의
app.get("/signup-b", (req, res) => {
    res.render("signup-b");
});

// Login user
app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ name: req.body.name });
        if (!user) {
            res.render("usersign");
        } else {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (isMatch) {
                res.render("home");
            } else {
                res.render("wrongpassword");
            }
        }
    } catch (error) {
        console.log("Error during login:", error); // 에러 로그
        res.send("An error occurred");
    }
});

//server seting
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//create a new account

