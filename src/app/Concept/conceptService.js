const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const conceptProvider = require("./conceptProvider");
const conceptDao = require("./conceptDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.postUserConcept = async function (userId, stageOneResult, stageTwoResult) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            
            // 컨셉 추천 테스트 결과 조회 (컨셉 인덱스)
            const getConceptIdResult = await conceptProvider.retreiveConceptId(stageOneResult, stageTwoResult);
            
            await connection.beginTransaction();

            // 컨셉 등록
            const postUserConceptResponse = await conceptDao.postUserConcept(connection, userId, getConceptIdResult.conceptId);

            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS, {"conceptId" : getConceptIdResult.conceptId});

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - postUserConcept Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - postUserConcept Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.postUserConceptTwo = async function (userId, conceptId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            
            await connection.beginTransaction();

            // 컨셉 등록
            const postUserConceptTwoResponse = await conceptDao.postUserConcept(connection, userId, conceptId);

            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS, {"conceptId" : conceptId});

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - postUserConceptTwo Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - postUserConceptTwo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

