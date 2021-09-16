module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport');

    const bodyParser = require('body-parser');
    const fs = require("fs");
    const AppleAuth = require("apple-auth");
    const config = fs.readFileSync("config/appleConfig.json");
    const auth = new AppleAuth(config, "config/AuthKey.p8");
    const jwt = require("jsonwebtoken");

    // 회원가입 API
    app.post('/sign-up', user.postUsers);

    // 로그인 API
    app.post('/login', user.login);

    // JWT 유효성 확인 API
    //app.get('/check', jwtMiddleware, user.check);

    // 자동 로그인 API
    app.post('/auto-login', jwtMiddleware, user.autoLogin);

    // 로그아웃 API
    app.post('/logout', jwtMiddleware, user.logout);

    // 회원탈퇴 API
    app.delete('/users', jwtMiddleware, user.withdraw);

    // 유저 닉네임 조회 API
    app.get('/nickname', jwtMiddleware, user.nickname);
    
    // 카카오 로그인 API
    app.post('/login/kakao', user.kakaoLogin);
    app.get('/kakao', passport.authenticate('kakao-login'));
    
    // 로그인이 처음일 때 닉네임 설정 API
    app.post('/login/nickname', jwtMiddleware, user.loginNickname);

    // 애플 로그인 API
    app.post("/login/apple", user.appleLogin);

    // 닉네임 중복확인 API //
    app.get('/login/nickname/:nicknames', user.getNickname);






    // 애플 로그인 Web Test
    app.get('/test/apple/login', (req,res) => {
        console.log(Date().toString() + "GET /test/apple/login");
        res.send(`<a href="${auth.loginURL()}">Sign in with Apple</a>`);
    });

    app.get('/token', (req,res) => {
        res.send(auth._tokenGenerator.generate());
    });

    app.post('/auth', bodyParser(), user.appleLogin);

};