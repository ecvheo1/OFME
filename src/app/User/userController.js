const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const userDao = require("../../app/User/userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy
const axios = require("axios");
const {pool} = require("../../../config/database");
const fs = require("fs");
const AppleAuth = require("apple-auth");
const config = fs.readFileSync("config/appleConfig.json");
const auth = new AppleAuth(config, "config/AuthKey.p8");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");

exports.postUsers = async function (req, res) {

    const {email, password, checkPassword, nickname} = req.body;

    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    
    if(!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    
    if(password.length < 8 || password.length > 20)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    
    if(!checkPassword)
        return res.send(response(baseResponse.SIGNUP_CHECKPASSWORD_EMPTY));

    if(!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    
    if(nickname.length < 2 || nickname.length > 10)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    
    if(!/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/.test(nickname))
        return res.send(response(baseResponse.SIGNUP_NICKNAME_TYPE));
    
    let imgUrl = 'https://ofmebucket.s3.ap-northeast-2.amazonaws.com/profileImage.png';

    const signUpResponse = await userService.createUser(email, password, checkPassword, nickname, imgUrl);
    return res.send(signUpResponse);
};

exports.login = async function (req, res) {

    const {email, password} = req.body;

    if (!email)
        return res.send(response(baseResponse.LOGIN_EMAIL_EMPTY));

    if (email.length > 30)
        return res.send(response(baseResponse.LOGIN_EMAIL_LENGTH));

    if (!regexEmail.test(email))
        return res.send(response(baseResponse.LOGIN_EMAIL_ERROR_TYPE));
    
    if(!password)
        return res.send(response(baseResponse.LOGIN_PASSWORD_EMPTY));
    
    if(password.length < 8 || password.length > 20)
        return res.send(response(baseResponse.LOGIN_PASSWORD_LENGTH));

    const loginReponse = await userService.postLogin(email, password);
    return res.send(loginReponse);
}

// exports.check = async function (req, res) {

//     const iat = new Date(req.verifiedToken.iat * 1000).toLocaleString();
//     const exp = new Date(req.verifiedToken.exp * 1000).toLocaleString();

//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS, { "userId" : req.verifiedToken.userId, "iat" : iat, "exp" : exp}));
// };

exports.autoLogin = async function(req,res) {

    const userIdFromJwt = req.verifiedToken.userId;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdFromJwt);

    if(checkJWT.length < 1)
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    else if (token == checkJWT[0].jwt)
        return res.send(response(baseResponse.SUCCESS, {"userId" : userIdFromJwt, "jwt" : token}));
    else
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
}

exports.logout = async function(req,res) {

    const userIdFromJwt = req.verifiedToken.userId;

    const token = req.headers['x-access-token'];
    const checkLogoutToken = await userProvider.checkLogoutToken(token);

    if(checkLogoutToken[0].status === 'Deleted')
        return res.send(errResponse(baseResponse.LOGOUT_ALREADY_LOGOUT));

    const logoutResponse = await userService.deleteJWT(userIdFromJwt);

    return res.send(logoutResponse);
}

exports.withdraw = async function(req,res) {

    const userIdFromJwt = req.verifiedToken.userId;
    const emailFromJwt = req.verifiedToken.email;

    const deleteUserResponse = await userService.deleteUser(userIdFromJwt, emailFromJwt);

    return res.send(deleteUserResponse);
}

exports.nickname = async function(req,res) {

    const userId = req.verifiedToken.userId;

    const userNickname = await userProvider.getUserNickname(userId);

    return res.send(userNickname);
}

// 카카오 인가코드 받기
passport.use('kakao-login', new kakaoStrategy({ 
    clientID: '7b3ee3480129635ca1fc7e8bd63f8867',
    callbackURL: '/auth/kakao/login/callback',
}, async (accessToken, refreshToken, profile, done) => {
    console.log(accessToken);
    console.log(profile); 
}));


/**
 * API Name : 카카오 로그인
 * [POST] /login/kakao
 */
exports.kakaoLogin = async function (req, res) {
/**
 * * Body: accessToken
*/
    const accessToken = req.body.accessToken;
    const api_url = "https://kapi.kakao.com/v2/user/me";
    var email, profileImg, id;
    console.log(accessToken);
    if(!accessToken)
        return res.send(errResponse("카카오 토큰을 입력해주세요."))
    
    try{
        axios({
            url: api_url,
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + accessToken,
            }
        }).then(async function (response) {
            console.log(accessToken);
            id = response.data.id;
            email = response.data.kakao_account.email;
            if(!email) email = 'kakao email';
            profileImg = response.data.kakao_account.profile.profile_image_url;
            if(!profileImg) profileImg = 'https://ofmebucket.s3.ap-northeast-2.amazonaws.com/profileImage.png';
            
            const socialId = 'K' + String(id);
            try{
            // 가입이 되어있는 유저인지
            const userIdResult = await userProvider.selectUserId(socialId);
            console.log(userIdResult);
            let code, message;
            console.log(userIdResult);
            if(userIdResult == undefined || userIdResult.length < 1){
                console.log('회원가입');
                const socialSignUpResult = await userService.socialSignUp(socialId, email, profileImg);
                console.log(socialSignUpResult)
                userId = socialSignUpResult.insertId;
                code = 1001;
                message = "회원가입성공(카카오), 닉네임 설정해주세요.";
            }
            else {
                console.log('로그인');
                userId = userIdResult.id;
                code = 1000;
                message = "카카오 로그인 성공";
            }
            console.log('토큰');
            let token = await jwt.sign(
                {
                    userId: userId,
                }, // 토큰의 내용(payload)
                secret_config.jwtsecret, // 비밀키
                {
                    expiresIn: "365d",
                    subject: "userInfo",
                } // 유효 기간 365일
            );
            console.log(userId);
            const tokenInsertResult = await userService.tokenInsert(token, userId);
            return res.send({ isSuccess:true, code:code, message:message, "result": { id: userId, jwt: token }});
            } catch (err) {
            console.log(err);
            return res.json(errResponse(baseResponse.APPLE_LOGIN_FAILURE));
            } 
        }).catch(function (error) {
            return res.send(errResponse(baseResponse.KAKAO_LOGIN_FAILURE));
            });
    } catch (err) {
        logger.error(`App - kakaoLogin error\n: ${err.message}`);
        return res.send(errResponse(baseResponse.KAKAO_LOGIN_FAILURE));
    }
};

exports.loginNickname = async function(req,res) {
    const { nickname } = req.body;
    const userId = req.verifiedToken.userId;
    console.log(userId);
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));
    
    if(!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    
    if(nickname.length < 2 || nickname.length > 10)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    
    if(!/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/.test(nickname))
        return res.send(response(baseResponse.SIGNUP_NICKNAME_TYPE));
    
    // 닉네임 중복 확인
    const nicknameRows = await userProvider.nicknameCheck(nickname);
        if(nicknameRows.length > 0)
            return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME));
    
    const nicknameInsertRows = await userService.nicknameInsert(nickname, userId);
    return res.send(nicknameInsertRows);
}


exports.appleLogin = async function(req, res) {
    const { code } = req.body;

    if(!code)
      return res.send(errResponse(baseResponse.INPUT_APPLE_CODE));

    let response = ``;
    let idToken = ``;
    
    console.log(code);

    const connection = await pool.getConnection();

    try {
        response = await auth.accessToken(code);
        idToken = jwt.decode(response.id_token);
        console.log(response);
        console.log(idToken);
    } catch (err) {
        connection.release();
        console.log(err);
        return res.json({isSuccess: true, code: 2000, message: "유효하지 않은 code입니다.",});
    }

    const email = idToken.email;
    const appleId = idToken.sub;

    const profileImg = 'https://ofmebucket.s3.ap-northeast-2.amazonaws.com/profileImage.png';

    console.log(email);
    console.log(appleId);


    // 회원가입이 되어 있는 애플로그인 유저인지 확인
    try {
        const socialIdCheckRows = await userDao.socialIdCheck(connection, appleId);
        console.log(socialIdCheckRows);
        // 회원가입이 되어 있는 애플로그인 유저
        if (socialIdCheckRows.length > 0) {
            let token = await jwt.sign(
                {
                userId: socialIdCheckRows[0].id,
                }, 
                secret_config.jwtsecret,
                {
                expiresIn: "365d",
                subject: "userInfo",
                }
            );
            const tokenInsertResult = await userService.tokenInsert(token, socialIdCheckRows[0].id);
            console.log(tokenInsertResult);
            return res.send({ isSuccess:true, code:1000, message:"애플 로그인 성공", "result": { id: socialIdCheckRows[0].id, jwt: token }});
    } else { // 회원가입이 안 되어 있는 애플로그인 유저
        const insertAppleUserRows = await userDao.insertAppleUser(connection, appleId, email, profileImg);
        let token = await jwt.sign(
        {
            userId: insertAppleUserRows.insertId,
        }, 
        secret_config.jwtsecret,
        {
            expiresIn: "365d",
            subject: "userInfo",
        }
        );
        const tokenInsertResult = await userService.tokenInsert(token, insertAppleUserRows.insertId);
        console.log(tokenInsertResult);
        return res.send({ isSuccess:true, code:1001, message:"회원가입성공(애플), 닉네임 설정해주세요.", "result": { id: insertAppleUserRows.insertId, jwt: token }});
    }
    } catch (err) {
        console.log(err);
        return res.json(errResponse(baseResponse.APPLE_LOGIN_FAILURE));
    } finally {
        connection.release();
    }
};
//


exports.getNickname = async function(req, res) {
    const nickname = req.params.nicknames;

    if(!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    
    if(nickname.length < 2 || nickname.length > 10)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    
    if(!/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/.test(nickname))
        return res.send(response(baseResponse.SIGNUP_NICKNAME_TYPE));
    
    // 닉네임 중복 확인
    const nicknameRows = await userProvider.nicknameCheck(nickname);
        if(nicknameRows.length > 0)
            return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME));

    return res.send({ isSuccess:true, code:1000, message:"사용 가능한 닉네임입니다."});
}
