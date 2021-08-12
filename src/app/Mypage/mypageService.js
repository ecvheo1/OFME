const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const mypageProvider = require("./mypageProvider");
const mypageDao = require("./mypageDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.updateMypageDetail = async function (userId, password, newPassword) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try{
            const PasswordResult = await mypageProvider.selectMypageDetailPassword(userId);
            
            const hashedPassword = await crypto
            .createHash("sha512")
            .update(newPassword)
            .digest("hex");

            const basepassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

            if (PasswordResult.length <= 0) 
                return  errResponse(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT);

            if (PasswordResult[0].password !== basepassword)
                return  errResponse(baseResponse.USER_PASSWORD_FAIL);
            

            const updateMypageDetailParams = [hashedPassword, userId];
            await connection.beginTransaction();
            
            const MypageDetailResult = await mypageDao.updateMypageDetail(connection, updateMypageDetailParams);
            
            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS);
        }
        catch(err){
            await connection.rollback();
            connection.release();
            logger.error(`App - password Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - createConcept Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};