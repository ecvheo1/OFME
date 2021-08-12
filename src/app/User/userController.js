const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const regexEmail = require("regex-email");
const {emit} = require("nodemon");


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