const { name } = require('ejs');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const connected = mongoose.connect("mongodb://localhost:27017/login-tut");

//check data
connected.then(() => {
    console.log("Database connected successfully");
}).catch(() => {
    console.log("Database connection failed");
})

//naver Certified
const smtpTransport = nodemailer.createTransport({
    pool : true,
    maxConnections : 1,
    service : "Naver",
    host : "smtp.naver.com",
    port : 587,
    secure : false,
    requireTLS : true,
    auth : {
        user : "kazizibe08@naver.com",
        pass : "dlatpgns081010@",
    },
    tls : {
        rejectUnauthorized : false,
    }
});

//random certified code
var generateRandomNumber = function(min, max) {
    var randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randNum;
}

//send mail code
const emailAuth = async(req,res) => {
    const number = generateRandomNumber(111111, 999999)

    const { email } = req.body; //사용자가 입력한 이메일

    const mailOptions = {
        from : "bik1111@naver.com ", // 발신자 이메일 주소.
        to : email, //사용자가 입력한 이메일 -> 목적지 주소 이메일
        subject : " 인증 관련 메일 입니다. ",
        html : '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + number
    }
    smtpTransport.sendMail(mailOptions, (err, response) => {
        console.log("response", response);
        //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
        if(err) {
            res.json({ok : false , msg : ' 메일 전송에 실패하였습니다. '})
            smtpTransport.close() //전송종료
            return
        } else {
            res.json({ok: true, msg: ' 메일 전송에 성공하였습니다. ', authNum : number})
            smtpTransport.close() //전송종료
            return 

        }
    })
}

//create token
const generateToken = ()  => {
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24)//24시간 유효
    return { token, expires }
}

const emailLinkauth = (req,res) => {

    const result = generateToken();

    const { email } = req.body;
    const mailOptions = {
        from : "kazizibe08@naver.com", // 발신자 이메일 주소.
        to : email, //사용자가 입력한 이메일 -> 목적지 주소 이메일
        subject : 'Verify your email address',
        html: `<p>Please click the following link to verify your email address:</p>
        <p> <a href="http://localhost:5000/verify-email/?email=${email}?token=${result.token}">Verify email</a></p>
        <p>This link will expire on ${result.expires}.</p>`
    }

    smtpTransport.sendMail(mailOptions, (err, response) => {
        console.log(response);
        //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
        if(err) {
            res.json({ok : false , msg : ' 메일 전송에 실패하였습니다. '})
            smtpTransport.close() //전송종료
            return
        } else {
            res.json({ok: true, msg: ' 메일 전송에 성공하였습니다. ', authNum : number})
            smtpTransport.close() //전송종료
            return 
        }
    })
}

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

module.exports = {
    collection,
    emailAuth,
    emailLinkauth
};
