const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const qnaDao = require("./qnaDao");

// Provider: Read 비즈니스 로직 처리

exports.selectQuestions = async function (userId) {
  const selectParams = [userId, userId];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectQuestionsResult = await qnaDao.selectQuestions(connection, selectParams);
  connection.release();

  return selectQuestionsResult;
};

exports.selectQuestionsList = async function (sort, userId) {
  const selectParams = [userId, sort];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectQuestionsResult = await qnaDao.selectQuestionsList(connection, selectParams);
  connection.release();

  return selectQuestionsResult;
};

exports.selectListShare = async function (sort, userId, share) {
  const selectParams = [userId, sort, share];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectQuestionsResult = await qnaDao.selectListShare(connection, selectParams);
  connection.release();

  return selectQuestionsResult;
};

exports.selectListNoAnswer = async function (sort, userId) {
  const selectParams = [userId, sort];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectQuestionsResult = await qnaDao.selectListNoAnswer(connection, selectParams);
  connection.release();

  return selectQuestionsResult;
};

exports.selectAnswers = async function (userId, questionId) {
  const selectParams = [userId, questionId];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectAnswersResult = await qnaDao.selectAnswers(connection, selectParams);
  connection.release();

  return selectAnswersResult;
};

exports.selectAnswersIs = async function (questionId, userId) {
  const selectParams = [questionId, userId];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectAnswersIsResult = await qnaDao.selectAnswersIs(connection, selectParams);
  connection.release();

  return selectAnswersIsResult;
};

exports.selectQuestionIs = async function (questionId) {
  const selectParams = [questionId];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectAnswersIsResult = await qnaDao.selectQuestionIs(connection, selectParams);
  connection.release();

  return selectAnswersIsResult;
};

exports.selectEverything = async function (userId) {
  const selectParams = [userId, userId];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectEverythingResult = await qnaDao.selectEverything(connection, selectParams);
  connection.release();

  return selectEverythingResult;
};

exports.selectMyReward = async function (userId) {
  const selectParams = [userId, userId];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectMyRewardResult = await qnaDao.selectMyReward(connection, selectParams);
  connection.release();

  return selectMyRewardResult;
};

exports.selectShare = async function (userId) {
  const selectParams = [userId];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectResult = await qnaDao.selectShare(connection, selectParams);
  connection.release();

  return selectResult;
};

exports.selectCheck = async function (userId) {
  const selectParams = [userId];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectResult = await qnaDao.selectCheck(connection, selectParams);
  connection.release();

  return selectResult;
};

exports.selectNoCheck = async function (userId) {
  const selectParams = [userId];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectResult = await qnaDao.selectNoCheck(connection, selectParams);
  connection.release();

  return selectResult;
};

exports.selectQuestionPages = async function (questionId) {
  const selectParams = [questionId];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectResult = await qnaDao.selectQuestionPages(connection, selectParams);
  connection.release();

  return selectResult;
};

exports.selectRockIs = async function (questionId, userId) {
  const selectParams = [userId, questionId];
  const connection = await pool.getConnection(async (conn) => conn);
  const selectResult = await qnaDao.selectRockIs(connection, selectParams);
  connection.release();

  return selectResult;
};