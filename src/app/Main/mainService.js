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
        logger.error(`App - editTimer Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.editEnd = async function(userId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {

            await connection.beginTransaction();

            const updateEndResult = await mainDao.updateEnd(connection, userId);

            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS);

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - editEnd Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - editEnd Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.editRating = async function (userId, conceptPoint) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();

            const updateRatingResult = await mainDao.updateRating(connection, userId, conceptPoint);

            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS);

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - editRating Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - editRating Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.editFirstMain = async function (userId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();

            const updateFirstMainResult = await mainDao.updateFirstMain(connection, userId);

            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS);

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - editFirstMain Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - editFirstMain Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};