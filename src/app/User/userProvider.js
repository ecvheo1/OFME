const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const userDao = require("./userDao");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

exports.emailCheck = async function(email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userListResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return userListResult;
}

exports.nicknameCheck = async function(nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userListResult = await userDao.selectUserNickname(connection, nickname);
  connection.release();

  return userListResult;
}

exports.passwordCheck = async function(email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userListResult = await userDao.selectUserPassword(connection, email);
  connection.release();

  return userListResult;
}

exports.accountCheck = async function(email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userListResult = await userDao.selectUserStatus(connection, email);
  connection.release()

  return userListResult;  
}

exports.checkJWT = async function(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userListResult = await userDao.selectUserJwt(connection, userId);
  connection.release()

  return userListResult; 
}

exports.checkLogoutToken = async function(token) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userListResult = await userDao.selectLogoutToken(connection, token);
  connection.release()

  return userListResult; 
}

exports.getUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getUsers = await userDao.getUser(connection, userId);
  connection.release();

  return getUsers;
};

exports.getUserNickname = async function(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getUserNickname = await userDao.selectUserNickname2(connection, userId);
  connection.release();

  return response(baseResponse.SUCCESS, getUserNickname);
}