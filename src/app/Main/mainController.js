const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../User/userProvider");
const mainProvider = require("../Main/mainProvider");
const mypageProvider = require("../Mypage/mypageProvider");
const mainService = require("../Main/mainService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 1
 * API Name : 메인화면 조회 API (캐릭터)
 * [GET] /characters
 */
exports.getCharacters = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const selectCharactersRows = await mainProvider.selectCharacters(userId);
    const selectNameRows = await mypageProvider.selectMypageDetail(userId)
    console.log(selectNameRows)
    if(selectCharactersRows.length < 1) return res.send(response(baseResponse.MAIN_CHARACTER_NOT_EXIST, {nickname: selectNameRows[0].nickname}));
    else return res.send(response(baseResponse.SUCCESS, selectCharactersRows));
};

/**
 * API No. 2
 * API Name : 액션에 따른 행동이미지 조회 API
 * [GET] /characters/actions
 */
exports.selectActions = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const selectCharactersRows = await mainProvider.selectCharacters(userId);
    if(selectCharactersRows.length < 1) return res.send(response(baseResponse.MAIN_CHARACTER_NOT_EXIST));
    
    const selectActionsRows = await mainProvider.selectActions(selectCharactersRows[0].id);
    return res.send(response(baseResponse.SUCCESS, selectActionsRows));
};

/**
 * API No. 3
 * API Name : 컨셉 시간 저장 API
 * [PATCH] /characters/timers
 */
exports.patchCharactersTimer = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const timer = req.body;

    if (!timer)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));
    

    const updateCharactersTimerRows = await mainService.updateCharactersTimer(userId, timer.timer);
    if(updateCharactersTimerRows.affectedRows === 0) return res.send(response(baseResponse.MAIN_CHARACTER_NOT_EXIST));

    else return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 4
 * API Name : 컨셉 사용 종료 API
 * [PATCH] /characters/ends
 */
exports.patchCharactersEnd = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));
    
    const timer = req.body;

    if (!timer)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const updateCharactersEndRows = await mainService.updateCharactersEnd(userId, timer.timer);

    if(updateCharactersEndRows.affectedRows === 0) return res.send(response(baseResponse.MAIN_CHARACTER_NOT_EXIST));
    
    
    const selectCharactersIdRows = await mainProvider.selectCharactersId(userId);
    return res.send(response(baseResponse.SUCCESS, selectCharactersIdRows));
};
/**
 * API No. 5
 * API Name : 컨셉 평점 등록 API
 * [PATCH] /characters/ratings
 */
exports.patchRating = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));
    
    const {conceptId, conceptPoint} = req.body;

    if (!conceptId)
        return res.send(response(baseResponse.MAIN_CONCEPT_NOT_EXIST));
    else if (!conceptPoint)
        return res.send(response(baseResponse.MAIN_STAR_NOT_EXIST));
    else if (!Number.isInteger(conceptPoint))
        return res.send(response(baseResponse.MAIN_INT_STAR_NOT_EXIST));
    else if (0 >= conceptPoint || conceptPoint >= 6)
        return res.send(response(baseResponse.MAIN_INT_STAR_NOT_EXIST));

    const selectmainIdRows = await mainProvider.selectmainId(conceptId);

    if (selectmainIdRows[0].userId != userId)
        return res.send(response(baseResponse.DIARY_USER_NOT_EXIST));

    const patchRatingRows = await mainService.patchRating(conceptId, conceptPoint);

    if(patchRatingRows.affectedRows === 0)
        return res.send(response(baseResponse.MAIN_CHARACTER_NOT_EXIST));
    
    return res.send(response(baseResponse.SUCCESS));
};