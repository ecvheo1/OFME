const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const conceptDao = require("./conceptDao");

exports.retreiveConceptProgressStatus = async function(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const conceptProgressStatusResult = await conceptDao.selectConceptProgressStatus(connection, userId);
  connection.release();

  return conceptProgressStatusResult;
}

exports.retreiveConceptAlreadyStatusResult =async function(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const conceptAlreadyStatusResult = await conceptDao.selectConceptAlreadyStatus(connection, userId);
  connection.release();

  return conceptAlreadyStatusResult;
}

exports.retreiveStageOneResult = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const stageOneResult = await conceptDao.selectStageOne(connection);
  connection.release();

  return stageOneResult;
};

exports.retreiveStageTwoResult = async function (keywordId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const stageTwoResult = await conceptDao.selectStageTwo(connection, keywordId);
  connection.release();

  return stageTwoResult;
};

exports.retreiveStageThreeResult = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const stageThreeResult = await conceptDao.selectStageThree(connection);
  connection.release();

  return stageThreeResult;
};

exports.retrieveConceptInfo = async function(stageOneResult, stageTwoResult) {
  const connection = await pool.getConnection(async (conn) => conn);
  const conceptInfoResult = await conceptDao.selectConceptInfoResult(connection, stageOneResult, stageTwoResult);
  connection.release();

  return conceptInfoResult;
}












exports.getConcept = async function (conceptId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const conceptResult = await conceptDao.selectConcept(connection, conceptId);
  connection.release();

  return conceptResult;
};

exports.getConceptId = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const getConceptIdResult = await conceptDao.selectConceptId(connection);
  connection.release();

  return getConceptIdResult;
};

exports.retreiveConceptId = async function(stageOneResult, stageTwoResult) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectTestResult = await conceptDao.selectTestResult(connection, stageOneResult, stageTwoResult);
  connection.release();

  return selectTestResult;
}

