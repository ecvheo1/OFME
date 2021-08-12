const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../User/userProvider");
const qnaProvider = require("../QnA/qnaProvider");
const qnaService = require("../QnA/qnaService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 1
 * API Name : 질문 리스트 조회 API
 * [GET] /questions
 */
exports.getQuestions = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const questionsRows = await qnaProvider.selectQuestions(userId);

    return res.send(response(baseResponse.SUCCESS, questionsRows));
};

/**
 * API No. 2
 * API Name : 질문 상세 조회 API
 * [GET] /questions/list?sort=&answers=
 */
exports.getQuestionsList = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const {sort, answers} = req.query;
    
    if (sort !== 'O' && sort !== 'D' && sort !== 'T')
        return res.send(response(baseResponse.QNA_SORT_NOT_EXIST));

    if ((0 > answers || answers >= 4))
        return res.send(response(baseResponse.QNA_ANSWERS_NOT_EXIST));

    if (answers === '0') {
        const questionsListRows = await qnaProvider.selectQuestionsList(sort, userId);
        return res.send(response(baseResponse.SUCCESS, questionsListRows));
    }
    else if (answers === '1') {
            const share = 'Y'
            const questionsListRows = await qnaProvider.selectListShare(sort, userId, share);
            return res.send(response(baseResponse.SUCCESS, questionsListRows));
        }
    else if (answers === '2') {
            const share = 'N'
            const questionsListRows = await qnaProvider.selectListShare(sort, userId, share);
            return res.send(response(baseResponse.SUCCESS, questionsListRows));
    }
    else if (answers === '3') {
        const questionsListRows = await qnaProvider.selectListNoAnswer(sort, userId);
        return res.send(response(baseResponse.SUCCESS, questionsListRows));
    }


    return res.send(response(baseResponse.QNA_NOT_EXIST));
};

/**
 * API No. 3
 * API Name : 답변 조회 API
 * [GET] /questions/:questionId/answers
 */
exports.getAnswers = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));
    
    const questionId = req.params.questionId;
    const selectAnswersRows = await qnaProvider.selectAnswers(userId, questionId);

    if (selectAnswersRows.length > 0)
        return res.send(response(baseResponse.SUCCESS, selectAnswersRows));
    else
        return res.send(response(baseResponse.QNA_QUESTION_NOT_EXIST));
};

/**
 * API No. 4
 * API Name : 답변 등록 API
 * [POST] /questions/:questionId/answers
 */
exports.postAnswers = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const {questionId, answer, share} = req.body;

    if (share !== 'Y' && share !== 'N') return res.send(response(baseResponse.QNA_SHARE_NOT_EXIST));
    if (share.length < 1) return res.send(response(baseResponse.QNA_SHARE_NOT_EXIST));
    if (questionId.length < 1) return res.send(response(baseResponse.QNA_QUESTIONID_NOT_EXIST));
    if (answer.length < 1) return res.send(response(baseResponse.QNA_ANSEWER_NOT_EXIST));
    if (answer.length > 290) return res.send(response(baseResponse.QNA_ANSEWER_LENGTH_NOT_EXIST));

    // 질문 유무 확인
    const getQuestionIsRows = await qnaProvider.selectQuestionIs(questionId);
    if (getQuestionIsRows < 1) return res.send(response(baseResponse.QNA_QUESTION_IS_NOT_EXIST));

    // 유저가 이미 답변을 작성한 질문인지 확인
    const getAnswersIsRows = await qnaProvider.selectAnswersIs(questionId, userId);
    if (getAnswersIsRows.length > 0) return res.send(response(baseResponse.QNA_ANSEWER_EXIST));

    const postAnswersRows = await qnaService.createAnswers(questionId, userId, answer, share);

    return res.send(postAnswersRows);
};

/**
 * API No. 5
 * API Name : 답변 수정 API
 * [PATCH] /questions/:questionId/answers
 */
exports.patchAnswers = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const {questionId, answer, share} = req.body;

    if (share !== 'Y' && share !== 'N') return res.send(response(baseResponse.QNA_SHARE_NOT_EXIST));
    if (share.length < 1) return res.send(response(baseResponse.QNA_SHARE_NOT_EXIST));
    if (questionId.length < 1) return res.send(response(baseResponse.QNA_QUESTIONID_NOT_EXIST));
    if (answer.length < 1) return res.send(response(baseResponse.QNA_ANSEWER_NOT_EXIST));
    if (answer.length > 290) return res.send(response(baseResponse.QNA_ANSEWER_LENGTH_NOT_EXIST));

    const getQuestionIsRows = await qnaProvider.selectQuestionIs(questionId);
    if (getQuestionIsRows < 1) return res.send(response(baseResponse.QNA_QUESTION_IS_NOT_EXIST));

    const getAnswersIsRows = await qnaProvider.selectAnswersIs(questionId, userId);
    if (getAnswersIsRows.length < 1) return res.send(response(baseResponse.QNA_ANSEWER_IS_NOT_EXIST));

    const updateAnswersRows = await qnaService.updateAnswers(getAnswersIsRows[0].id, userId, answer, share, questionId);

    return res.send(updateAnswersRows);
};

/**
 * API No. 6
 * API Name : 답변 삭제 API
 * [DELETE] /questions/answers
 */
exports.deleteAnswers = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const {questionId} = req.body;

    const getQuestionIsRows = await qnaProvider.selectQuestionIs(questionId);
    if (getQuestionIsRows < 1) return res.send(response(baseResponse.QNA_QUESTION_IS_NOT_EXIST));

    const getAnswersIsRows = await qnaProvider.selectAnswersIs(questionId, userId);
    if (getAnswersIsRows.length < 1) return res.send(response(baseResponse.QNA_ANSEWER_IS_NOT_EXIST));

    const deleteAnswersRows = await qnaService.deleteAnswers(getAnswersIsRows[0].id, userId, questionId);

    return res.send(deleteAnswersRows);
};

/**
 * API No. 7
 * API Name : 모든 질문 둘러보기 API
 * [GET] /questions/views/everything
 */
exports.getEverything = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const getEverythingRows = await qnaProvider.selectEverything(userId);

    return res.send(response(baseResponse.SUCCESS, getEverythingRows));
};

/**
 * API No. 8
 * API Name : 내가 공유한 QnA 둘러보기 API
 * [GET] /questions/views/share
 */
exports.getShare = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const getShareRows = await qnaProvider.selectShare(userId);

    return res.send(response(baseResponse.SUCCESS, getShareRows));
};

/**
 * API No. 9
 * API Name : 확인완료 둘러보기 API
 * [GET] /questions/views/check
 */
exports.getCheck = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const getCheckRows = await qnaProvider.selectCheck(userId);

    return res.send(response(baseResponse.SUCCESS, getCheckRows));
};

/**
 * API No. 10
 * API Name : 미확인 둘러보기 API
 * [GET] /questions/views/nocheck
 */
exports.getNoCheck = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const getNoCheckRows = await qnaProvider.selectNoCheck(userId);

    return res.send(response(baseResponse.SUCCESS, getNoCheckRows));
};

/**
 * API No. 11
 * API Name : 확인한 QnA와 내 리워드 조회 API
 * [GET] /questions/myrewards
 */
exports.getMyReward = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const getMyRewardRows = await qnaProvider.selectMyReward(userId);
    return res.send(response(baseResponse.SUCCESS, getMyRewardRows));
};

/**
 * API No. 12
 * API Name : 답변 둘러보기 API
 * [GET] /questions/:questionId/pages
 */
exports.getQuestionPages = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const questionId = req.params.questionId;

    // 이미 잠금해제한 것인지 확인
    const getRockIsRows = await qnaProvider.selectRockIs(questionId, userId);

    // 조회
    const getQuestionPageRows = await qnaProvider.selectQuestionPages(questionId);

    // 잠금해제를 했다면
    if (getRockIsRows.length > 0)
        return res.send(response(baseResponse.SUCCESS, getQuestionPageRows));
        
    
    // 잠금해제를 안했다면 리워드를 차감
    if (getRockIsRows.length < 1) {
        // 해당 질문에 대한 답변이 없다면
        if (getQuestionPageRows.length < 1)
            return res.send(response(baseResponse.QNA_AROUND_ANSEWER_NOT_EXIST));
        const updateRewardRows = await qnaService.updateReward(questionId, userId);
        // 리워드가 부족한 경우
        if (updateRewardRows.isSuccess === false) 
            return res.send(updateRewardRows);
        const insertQnAAroundResult = await qnaService.insertQnAAround(questionId, userId);
    }
    return res.send(response(baseResponse.SUCCESS, getQuestionPageRows));
};

/**
 * API No. 13
 * API Name : 둘러보기 답변 신고하기 API
 * [POST] /declarations
 */
exports.postDeclarations = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const userRows = await userProvider.getUser(userId);
    if (!userRows)
        return res.send(response(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT));

    const { answerId } = req.body;

    // 이미 잠금해제한 것인지 확인
    const postDeclarationRows = await qnaService.insertDeclarations(answerId, userId);

    return res.send(response(baseResponse.SUCCESS));
};