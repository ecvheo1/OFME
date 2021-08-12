const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../User/userProvider");
const mypageProvider = require("../Mypage/mypageProvider");
const mypageService = require("../Mypage/mypageService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 1
 * API Name : 마이 페이지 조회 API
 * [GET] /mypages
 */
exports.getMypage = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    let sumSelectMypages = await mypageProvider.selectMypage(userId);

    return res.send({
        isSuccess: true,
        code: 1000,
        message: '성공',
        selectMypageResult: sumSelectMypages.selectMypageResult,
        selectMyfriendResult: sumSelectMypages.selectMyfriendResult,
        selectMyhistoryResult: sumSelectMypages.selectMyhistoryResult
      });
};

/**
 * API No. 2
 * API Name : 내 정보 조회 API
 * [GET] /mypages/details
 */
exports.getMypageDetail = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const selectMypageDetailRows = await mypageProvider.selectMypageDetail(userId);
    if (selectMypageDetailRows.length <= 0) return baseResponse.LOGIN_WITHDRAWAL_ACCOUNT;

    return res.send(response(baseResponse.SUCCESS, selectMypageDetailRows));
};

/**
 * API No. 3
 * API Name : 내 정보 수정 API
 * [PATCH] /mypages/details
 */
exports.patchMypageDetail = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const { nickname, imgUrl } = req.body;

    if (!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    if (2 > nickname.length || nickname.length > 10)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    if(!/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/.test(nickname))
        return res.send(response(baseResponse.SIGNUP_NICKNAME_TYPE));

    const updateMypageRows = await mypageProvider.updateMypage(userId, nickname, imgUrl);

    return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 4
 * API Name : 비밀번호 수정 API
 * [PATCH] /mypages/passwords
 */
exports.patchPassWord = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const { newPassword, checkPassword, password } = req.body;

    if(!newPassword)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    
    if(newPassword.length < 8 || newPassword.length > 20)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    
    if(!checkPassword)
        return res.send(response(baseResponse.SIGNUP_CHECKPASSWORD_EMPTY));
    
    if (!(newPassword === checkPassword))
        return res.send(response(baseResponse.SIGNUP_PASSWORD_CONFIRM));
    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    const updateMypageDetailRows = await mypageService.updateMypageDetail(userId, password, newPassword);

    if (updateMypageDetailRows.affectedRows === 0)
        return res.send(response(baseResponse.SIGNUP_USER_PASSWORD_CONFIRM));

    return res.send(updateMypageDetailRows);
};