const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


exports.createUser = async function (email, password, checkPassword, nickname, imgUrl) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            // 이메일 중복 확인
            const emailRows = await userProvider.emailCheck(email);
            if (emailRows.length > 0)
                return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);
            
            // 비밀번호 재확인
            if (!(password === checkPassword))
                return errResponse(baseResponse.SIGNUP_PASSWORD_CONFIRM);

            // 닉네임 중복 확인
            const nicknameRows = await userProvider.nicknameCheck(nickname);
            console.log(nicknameRows)
            if(nicknameRows.length > 0)
                return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);
            
            // 비밀번호 암호화
            const hashedPassword = await crypto
                .createHash("sha512")
                .update(password)
                .digest("hex");

            const insertUserInfoParams = [email, hashedPassword, nickname, imgUrl];

            await connection.beginTransaction();

            const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
            console.log(`추가된 회원 : ${userIdResult[0].insertId}`)

            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS, {"createUser" : userIdResult[0].insertId});

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - createUser Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.postLogin = async function (email, password) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {

            // 이메일 존재 유무 확인
            const emailRows = await userProvider.emailCheck(email);
            if (emailRows.length < 1)
                return errResponse(baseResponse.LOGIN_EMAIL_NOT_EXIST);
            
            // 계정 상태 확인
            const userInfoRows = await userProvider.accountCheck(email);

            if (userInfoRows[0].status === "Deleted") {
                return errResponse(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT);
            }
            
            // 비밀번호 확인
            const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

            const passwordRows = await userProvider.passwordCheck(email);

            if (passwordRows[0].password !== hashedPassword) {
                return errResponse(baseResponse.LOGIN_PASSWORD_WRONG);
            }

            // 이미 로그인된 유저인지 확인
            const checkJWT = await userProvider.checkJWT(passwordRows[0].id);
            console.log(checkJWT);
            if(checkJWT.length > 0) {
                return errResponse(baseResponse.SIGNIN_ALREADY_LOGIN);
            }

            await connection.beginTransaction();

            //토큰 생성 Service
            let token = await jwt.sign(
                {
                    userId: userInfoRows[0].id,
                    email: userInfoRows[0].email
                }, // 토큰의 내용(payload)
                secret_config.jwtsecret, // 비밀키
                {
                    expiresIn: "365d",
                    subject: "userInfo",
                } // 유효 기간 365일
            );

            console.log(token);
            
            const tokenResult = await userDao.insertToken(connection, passwordRows[0].id, token);

            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - postLogin Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - postLogin Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteJWT = async function(userId) {
    try {
        const connection = await pool.getConnection(async(conn) => conn);
        try {

        await connection.beginTransaction();
        
        const deleteJWTResult = await userDao.deleteJWT(connection, userId);

        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS, {'userId' : userId});

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - logout Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - logout Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteUser = async function(userId, email) {
    try {
        const connection = await pool.getConnection(async(conn) => conn);
        try {

        await connection.beginTransaction();

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);
        if (userInfoRows[0].status === "Deleted") {
            return errResponse(baseResponse.LOGIN_WITHDRAWAL_ACCOUNT);
        }
        
        const deleteJWTResult = await userDao.deleteJWT(connection, userId);
        const deleteUserResult = await userDao.deleteUser(connection, userId);

        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS, {'userId' : userId});

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - Withdraw Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - Withdraw Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};