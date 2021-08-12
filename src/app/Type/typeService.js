const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const typeProvider = require("./typeProvider");
const typeDao = require("./typeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


exports.postAndGetTypeResult = async function (userId, typeId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            
            // 유형 결과 조회
            const getTypeResult = await typeProvider.retrieveTypeResult(typeId);
            
            await connection.beginTransaction();

            // 유형 결과 등록
            const postUserType = await typeDao.postUserType(connection, userId, typeId);

            await connection.commit();
            connection.release();

            return getTypeResult;

        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - postAndGetTypeResult Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - postAndGetTypeResult Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.TypeTestResult = async function (userId, EI, NS, TF, PJ) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {

            var EIpoint = 0, NSpoint = 0, TFpoint = 0, PJpoint = 0;
            
            for(i of EI)
                if(i === 'ENTP') EIpoint++;
            if(EIpoint >= 2) EIvalue = 'E';
            else EIvalue = 'I';

            for(i of NS)
                if(i === 'ENTP') NSpoint++;
            if(NSpoint >= 2) NSvalue = 'N';
            else NSvalue = 'S';

            for(i of TF)
                if(i === 'ENTP') TFpoint++;
            if(TFpoint >= 2) TFvalue = 'T';
            else TFvalue = 'F';

            for(i of PJ)
                if(i === 'ENTP') PJpoint++;
            if(PJpoint >= 2)PJvalue = 'P';
            else PJvalue = 'J';


            // 유형 결과 조회
            const getTypeResult = await typeDao.selectTypeResultFromTest(connection, EIvalue, NSvalue, TFvalue, PJvalue);

            await connection.beginTransaction();

            // 유형 등록
            const postUserType = await typeDao.postUserType(connection, userId, getTypeResult.typeId);
            
            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS, getTypeResult);
            
        } catch (err) {
            await connection.rollback();
            connection.release();
            logger.error(`App - TypeTestResult Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - TypeTestResult Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};