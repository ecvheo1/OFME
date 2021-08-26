const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../User/userProvider");
const conceptProvider = require("../Concept/conceptProvider");
const conceptService = require("../Concept/conceptService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");



exports.getConceptStageOne = async function (req, res) {
    const userId = req.verifiedToken.userId;

    // 컨셉을 진행중인지 확인
    const conceptProgressStatusResult = await conceptProvider.retreiveConceptProgressStatus(userId);
    if (conceptProgressStatusResult.length > 0)
        return res.send(errResponse(baseResponse.CONCEPT_PROGRESS_ERROR));
    
    // 컨셉을 이미 진행했는지 확인
    const conceptAlreadyStatusResult = await conceptProvider.retreiveConceptAlreadyStatusResult(userId);
    if (conceptAlreadyStatusResult.length > 0)
        return res.send(errResponse(baseResponse.CONCEPT_ALREADY_ERROR));  

    // 1단계 테스트 문제 조회
    const stageOneResult = await conceptProvider.retreiveStageOneResult();
    
    return res.send(response(baseResponse.SUCCESS, stageOneResult));
};


exports.getConceptStageTwo = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const keywordId = req.params.keywordId;

    if(!keywordId)
        return res.send(errResponse(baseResponse.CONCEPT_KEYWORDID_EMPTY));
    else if(keywordId < 1 || keywordId > 12)
        return res.send(errResponse(baseResponse.CONCEPT_KEYWORDID_ERROR));
    
    // 2단계 테스트 조회
    const stageTwoResult = await conceptProvider.retreiveStageTwoResult(keywordId);

    return res.send(response(baseResponse.SUCCESS, stageTwoResult));
};


exports.getConceptStageThree = async function (req, res) {
    const userId = req.verifiedToken.userId;

    const stageThreeResult = await conceptProvider.retreiveStageThreeResult();

    return res.send(response(baseResponse.SUCCESS, stageThreeResult));
};


exports.getConceptInfo = async function(req,res) {
    const userId = req.verifiedToken.userId;
    const {stageOneResult, stageTwoResult} = req.params;

    if(stageOneResult < 1 || stageOneResult > 12)
        return res.send(response(baseResponse.CONCEPT_POST_STAGEONERESULT));

    if(stageTwoResult < 1 || stageTwoResult > 4)
        return res.send(response(baseResponse.CONCEPT_POST_STAGETWORESULT));
    
    const conceptInfoResult = await conceptProvider.retrieveConceptInfo(stageOneResult, stageTwoResult);

    return res.send(response(baseResponse.SUCCESS,conceptInfoResult));
}


exports.postConceptTwo = async function(req,res) {
    const userId = req.verifiedToken.userId;
    const conceptId = req.params.conceptId;

    if(conceptId < 1 || conceptId > 20)
        return res.send(response(baseResponse.CONCEPT_CONCEPTID_ERROR));

    // 컨셉을 진행중인지 확인
    const conceptProgressStatusResult = await conceptProvider.retreiveConceptProgressStatus(userId);
    if (conceptProgressStatusResult.length > 0)
        return res.send(errResponse(baseResponse.CONCEPT_PROGRESS_ERROR));
    
    const userConceptResponse = await conceptService.postUserConceptTwo(userId, conceptId);

    return res.send(userConceptResponse);
}






/**
 * API No. 4
 * API Name : 컨셉 정보 조회 API
 * [GET] /concepts/:conceptId
 */
exports.getConcept = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const conceptId = req.params.conceptId;
    const getConceptRows = await conceptProvider.getConcept(conceptId);

    if (getConceptRows.length > 0) return res.send(response(baseResponse.SUCCESS, getConceptRows));
    else return res.send(response(baseResponse.CONCEPT_NOT_EXIST));
};

/**
 * API No. 5
 * API Name : 컨셉 등록 API
 * [POST] /concepts
 */
exports.postConcept = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const {stageOneResult, stageTwoResult} = req.body;

    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    if(stageTwoResult < 1 || stageTwoResult > 4)
        return res.send(response(baseResponse.CONCEPT_POST_STAGETWORESULT));
    
    const selectConceptIngRows = await conceptProvider.selectConceptIng(userId);
    if (selectConceptIngRows.length > 0) {
        return res.send(response(baseResponse.CONCEPT_POST_EXIST));
    }


    const postUserConceptResponse = await conceptService.postUserConcept(userId, stageOneResult, stageTwoResult);

    return res.send(postUserConceptResponse);
};

/**
 * API No. 6
 * API Name : 모든 컨셉 인덱스 조회 API
 * [GET] /concepts/all
 */
exports.getConceptId = async function (req, res) {
    const getConceptIdRows = await conceptProvider.getConceptId();
    if (getConceptIdRows.length > 0) {
        return res.send(response(baseResponse.SUCCESS, getConceptIdRows));
    } else
        return res.send(response(baseResponse.DB_ERROR));
};