const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const typeDao = require("./typeDao");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");


exports.retrieveTypes = async function() {
  const connection = await pool.getConnection(async (conn) => conn);
  const typeListResult = await typeDao.selectTypes(connection);
  connection.release();

  return response(baseResponse.SUCCESS, typeListResult);
}

exports.retrieveTypeResult = async function(typeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const typeResult = await typeDao.selectTypeResult(connection, typeId);
  connection.release();

  return response(baseResponse.SUCCESS, typeResult);
}

exports.retrieveTypeTests = async function() {
  const connection = await pool.getConnection(async (conn) => conn);
  const typeTestListResult = await typeDao.selectTypeTests(connection);

  // for(let i=0; i<12; i++) {
  //   console.log(typeTestListResult[i].question);
  //   (typeTestListResult[i].question).replace(/\-/g,'');
  // }

  connection.release();

  return response(baseResponse.SUCCESS, typeTestListResult);
}