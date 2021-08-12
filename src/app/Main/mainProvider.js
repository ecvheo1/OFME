const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const mainDao = require("./mainDao");
// Provider: Read 비즈니스 로직 처리

/**
 * API No. 1
 * API Name : 메인화면 조회 API (캐릭터)
 * [GET] /characters
 */
exports.selectCharacters = async function (userId, createAt) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectCharactersRows = await mainDao.selectCharacters(connection, userId, createAt);

  connection.release();

  return selectCharactersRows;
};
/**
 * API Name : 데일리 다이어리 수정 API
 */
exports.selectCharactersId = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectCharactersIdRows = await mainDao.selectCharactersId(connection, userId);

  connection.release();

  return selectCharactersIdRows;
};
/**
 * API Name : 평점등록할 인덱스와 같은 사람인지 확인
 */
exports.selectmainId = async function (conceptId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectmainIdRows = await mainDao.selectmainId(connection, conceptId);

  connection.release();

  return selectmainIdRows;
};
/**
 * API Name : 평점등록할 인덱스와 같은 사람인지 확인
 */
exports.selectActions = async function (conceptId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectActionsRows = await mainDao.selectActions(connection, conceptId);

  connection.release();

  return selectActionsRows;
};