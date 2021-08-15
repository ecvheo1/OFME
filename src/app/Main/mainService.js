const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const mainProvider = require("./mainProvider");
const mainDao = require("./mainDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


exports.editTimer = async function (userId, timer) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {

            await connection.beginTransaction();

            const updateTimerResult = await mainDao.updateTimer(connection, userId, timer);

            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS);

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - editTimer Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        await connection.rollback();
        connection.release();
        logger.error(`App - editTimer Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

/**
 * API No. 4
 * API Name : 컨셉 사용 종료 API
 */
exports.updateCharactersEnd = async function (userId, timer) {
    try {
        const updateParams = [timer, userId];
        const connection = await pool.getConnection(async (conn) => conn);

        const updateCharactersEndResult = await mainDao.updateCharactersEnd(connection, updateParams);

        connection.release();
        return updateCharactersEndResult;

    } catch (err) {
        logger.error(`App - createMain Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

/**
 * API No. 5
 * API Name : 컨셉 평점 등록 API
 */
exports.patchRating = async function (conceptId, conceptPoint) {
    try {
        const updateParams = [conceptPoint, conceptId];
        const connection = await pool.getConnection(async (conn) => conn);

        const updateRatingResult = await mainDao.updateRating(connection, updateParams);

        connection.release();
        return updateRatingResult;

    } catch (err) {
        logger.error(`App - createMain Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};