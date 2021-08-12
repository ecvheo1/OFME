const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const diaryProvider = require("./diaryProvider");
const diaryDao = require("./diaryDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

/**
 * API No. 2
 * API Name : 데일리 다이어리 작성 API
 */
exports.createDiary = async function (userId, title, character, text, createAt) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const insertDiaryParams = [userId, title, character, text, createAt];

            await connection.beginTransaction();

            const DiaryResult = await diaryDao.insertDiaryInfo(connection, insertDiaryParams);
            const insertRewardResult = await diaryDao.insertReward(connection, userId);

            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS);

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - createDiary Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        } 
    } catch (err) {
        logger.error(`App - createDiary Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }  
};

/**
 * API No. 3
 * API Name : 데일리 다이어리 수정 API
 */
exports.updateDiary = async function (id, userId, title, character, text, createAt) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {

            const insertDiaryParams = [title, character, text, createAt, id];

            await connection.beginTransaction();

            const updateDiary = await diaryDao.updateDiary(connection, insertDiaryParams);

            await connection.commit();
            connection.release();
            return response(baseResponse.SUCCESS);

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - updateDiary Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - updateDiary Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

/**
 * API No. 4
 * API Name : 데일리 다이어리 삭제 API
 */
exports.deleteDiary = async function (diaryId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const deleteDiary = await diaryDao.deleteDiary(connection, diaryId);
        const deleteDiaryImg = await diaryDao.deleteDiaryImg(connection, diaryId);

        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - updateDiary Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};