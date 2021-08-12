const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const mypageDao = require("./mypageDao");

// Provider: Read 비즈니스 로직 처리

exports.selectMypage = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const user = [userId, userId]
  const selectMypageResult = await mypageDao.selectMypage(connection, user);
  const selectMyfriendResult = await mypageDao.selectMyfriend(connection, userId);
  const selectMyhistoryResult = await mypageDao.selectMyhistory(connection, userId);

  connection.release();

  return {selectMypageResult, selectMyfriendResult, selectMyhistoryResult};
};

exports.selectMypageDetail = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectMypageDetailResult = await mypageDao.selectMypageDetail(connection, userId);
  connection.release();

  return selectMypageDetailResult;
};

exports.selectMypageDetailPassword = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectMypageDetailPasswordResult = await mypageDao.selectMypageDetailPassword(connection, userId);
  connection.release();

  return selectMypageDetailPasswordResult;
};

exports.updateMypage = async function (userId, nickname, imgUrl) {
  const connection = await pool.getConnection(async (conn) => conn);
  const params = [nickname, imgUrl, userId]
  const updateMypageResult = await mypageDao.updateMypage(connection, params);
  connection.release();

  return updateMypageResult;
};