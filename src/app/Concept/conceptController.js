const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../User/userProvider");
const conceptProvider = require("../Concept/conceptProvider");
const conceptService = require("../Concept/conceptService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 1
 * API Name : 1단계 테스트 문제 조회 API
 * [GET] /concepts/stageOne
 */
exports.getConceptStageOne = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));
    
    const stageOneRows = await conceptProvider.selectConceptStageOne();

    return res.send(response(baseResponse.SUCCESS, stageOneRows));
};

/**
 * API No. 2
 * API Name : 2단계 테스트 문제 조회 API
 * [GET] /concepts/stageTwo/:keywordId
 */
exports.getConceptStageTwo = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const keywordId = req.params.keywordId;
    const stageTwoRows = await conceptProvider.selectConceptStageTwo(keywordId);

    if (stageTwoRows.length < 1) return res.send(response(baseResponse.CONCEPT_KEYWORD_NOT_EXIST));
    else return res.send(response(baseResponse.SUCCESS, stageTwoRows));
};

/**
 * API No. 3
 * API Name : 3단계 테스트 문제 조회 API
 * [GET] /concepts/stageThree
 */
exports.getConceptStageThree = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const stageThreeRows = await conceptProvider.selectConceptStageThree();

    return res.send(response(baseResponse.SUCCESS, stageThreeRows));
};

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

exports.getConceptInfo = async function(req,res) {

    const userId = req.verifiedToken.userId;
    const {stageOneResult, stageTwoResult} = req.params;

    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    if(stageTwoResult < 1 || stageTwoResult > 4)
        return res.send(response(baseResponse.CONCEPT_POST_STAGETWORESULT));
    
    const retrieveConceptInfoResult = await conceptProvider.retrieveConceptInfo(stageOneResult, stageTwoResult);

    return res.send(response(baseResponse.SUCCESS,retrieveConceptInfoResult));
}

exports.postConceptTwo = async function(req,res) {

    const userId = req.verifiedToken.userId;
    const conceptId = req.params.conceptId;

    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    if(conceptId < 1 || conceptId > 20)
        return res.send(response(baseResponse.CONCEPT_CONCEPTID_ERROR));
    
    const selectConceptIngRows = await conceptProvider.selectConceptIng(userId);
    if (selectConceptIngRows.length > 0) {
        return res.send(response(baseResponse.CONCEPT_POST_EXIST));
    }

    const postUserConceptResponse = await conceptService.postUserConceptTwo(userId, conceptId);

    return res.send(postUserConceptResponse);
}