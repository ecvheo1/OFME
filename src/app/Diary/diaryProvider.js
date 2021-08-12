const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const diaryDao = require("./diaryDao");
// Provider: Read 비즈니스 로직 처리

/**
 * API No. 1
 * API Name : 데일리 다이어리 조회 API
 * [GET] /diarys?year=&months=&days=
 */
exports.selectDiary = async function (userId, createAt) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectDiaryRows = await diaryDao.selectDiary(connection, userId, createAt);

  connection.release();

  return selectDiaryRows;
};
/**
 * API Name : 데일리 다이어리 수정 API
 * 다이어리 작성자와 수정할 사용자와 같은 사람인지 확인
 */
exports.selectDiaryUserId = async function (diaryId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectDiaryUserIdRows = await diaryDao.selectDiaryUserId(connection, diaryId);

  connection.release();

  return selectDiaryUserIdRows;
};
/**
 * API Name : 데일리 다이어리 수정 API
 * 수정할 다이어리 이미지 불러오기
 */
exports.selectDiaryImg = async function (diaryId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectDiaryImgRows = await diaryDao.selectDiaryImg(connection, diaryId);

  connection.release();

  return selectDiaryImgRows;
};

/**
 * API No. 5
 * API Name : 데일리 다이어리 조회 API
 * [GET] /date?year=&months=&days=
 */
exports.selectDateDiary = async function (userId, createAt) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectDateDiaryRows = await diaryDao.selectDateDiary(connection, userId, createAt);

  connection.release();

  return selectDateDiaryRows;
};