const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const qnaProvider = require("./qnaProvider");
const qnaDao = require("./qnaDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createAnswers = async function (questionId, userId, answer, share) {
    try {
        const createAnswersParams = [questionId, userId, answer, share];
        const createRewardParams = [userId, 2, '답변 공유'];

        const connection = await pool.getConnection(async(conn) => conn);
        try {

            await connection.beginTransaction();
            
            const answersResult = await qnaDao.createAnswers(connection, createAnswersParams);
            if (share === 'Y') {
                await qnaDao.createReward(connection, createRewardParams);
            }

            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS);
        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - logout Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - createConcept Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.updateAnswers = async function (answerId, userId, answer, share, questionId) {
    try {
        const createAnswersParams = [answer, share, answerId];
        const createRewardParams = [userId, 2, '답변 공유'];
        const deleteRewardParams = [userId, -2, '답변 공유 제거'];

        const connection = await pool.getConnection(async(conn) => conn);
        try {

        await connection.beginTransaction();
        
        const answersIsResult = await qnaProvider.selectAnswersIs(questionId, userId);

        if (answersIsResult[0].share === 'N' && share === 'Y')
            await qnaDao.createReward(connection, createRewardParams);
        if(answersIsResult[0].share === 'Y' && share === 'N')
            await qnaDao.createReward(connection, deleteRewardParams);

        const answersResult = await qnaDao.updateAnswers(connection, createAnswersParams);

        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS);

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - updateAnswers Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - updateAnswers Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteAnswers = async function (answerId, userId, questionId) {
    try {
        const connection = await pool.getConnection(async(conn) => conn);
        try {
            const deleteAnswersParams = [answerId];
            const deleteRewardParams = [userId, -2, '답변 공유 제거'];

            await connection.beginTransaction();

            const answersIsResult = await qnaProvider.selectAnswersIs(questionId, userId);
            if(answersIsResult[0].share === 'Y')
                await qnaDao.createReward(connection, deleteRewardParams);

            const deleteAnswersResult = await qnaDao.deleteAnswers(connection, deleteAnswersParams);

            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS);
        } catch (err) {
            logger.error(`App - deleteAnswers Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    }  catch (err) {
        logger.error(`App - deleteAnswers Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

exports.updateReward = async function (questionId, userId) {
    try {
        const createRewardParams = [userId, -3, 'QnA 잠금해제'];

        const connection = await pool.getConnection(async(conn) => conn);
        try {

        await connection.beginTransaction();
        
        const MyRewardResult = await qnaProvider.selectMyReward(userId);

        if ((MyRewardResult[0].sumPoint - 3) >= 0) {
            await qnaDao.createReward(connection, createRewardParams);
        }
        else return response(baseResponse.QNA_REWARD_NOT_EXIST);

        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS);

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - logout Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - createConcept Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.insertQnAAround = async function (questionId, userId) {
    try {
        const connection = await pool.getConnection(async(conn) => conn);
        try {

        await connection.beginTransaction();
        
        const insertQnAAroundResult = await qnaDao.insertQnAAround(connection, questionId, userId);

        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS);

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - insertQnAAround Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - insertQnAAround Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};




exports.insertDeclarations = async function (answerId, userId) {
    try {
        const Params = [answerId, userId];

        const connection = await pool.getConnection(async(conn) => conn);

        const insertDeclarationsResult = await qnaDao.insertDeclarations(connection, Params);

        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createConcept Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};