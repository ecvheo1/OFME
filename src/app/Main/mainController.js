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

exports.getCharacters2 = async function(req, res) {

    const userId = req.verifiedToken.userId;
    const characterStatus = req.body.characterStatus; // default, water, sleep, sun, tv, reverse 

    // 유저가 컨셉 진행중인지 확인
    const userConceptStatusResult = await mainProvider.retreiveUserConceptStatus(userId);
    
    // 컨셉 진행중이 아닐 때(빈 메인화면)
    if (userConceptStatusResult.length < 1) {
        const emptyCharacterResult = await mainProvider.retreiveEmptyCharacter(userId);
        return res.send(response(baseResponse.SUCCESS, emptyCharacterResult));
    }
    else { // 컨셉 진행중일 때
        if (!characterStatus) characterStatus = "default";
        characterStatus1 = characterStatus + "1";
        characterStatus2 = characterStatus + "2";
        const characterResult = await mainProvider.retreiveCharacter(userId, characterStatus1,characterStatus2);
        return res.send(response(baseResponse.SUCCESS, characterResult));        
    }
}

exports.patchCharactersTimer = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const timer = req.body.timer;

    // 컨셉 진행중인지 확인
    const conceptProgressResult = await mainProvider.retreiveConceptProgress(userId);
    if(conceptProgressResult.length < 1)
        return res.send(errResponse(baseResponse.CONCEPT_PROGRESS_NOT));
    
    if (!timer)
        return res.send(response(baseResponse.CONCEPT_TIMER_EXIST));
    
    const editTimerInfo = await mainService.editTimer(userId, timer);

    return res.send(editTimerInfo);
};
