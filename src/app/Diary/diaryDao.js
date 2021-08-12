// 연도,월,일로 다이어리 조회
async function selectDiary(connection, userId, createAt) {
  const selectQuery = `
SELECT DayDiary.id, userId, conceptId, ConceptData.name, title, content, date_format(DayDiary.createAt, '%Y-%m-%d') as createAt
                FROM DayDiary
                LEFT JOIN ConceptData ON DayDiary.conceptId = ConceptData.id
                WHERE userId = ? and date(DayDiary.createAt) = ? and DayDiary.status = 'Activated';
                `;
  const [selectDiaryRows] = await connection.query(selectQuery, [userId, createAt]);
  return selectDiaryRows;
}

// 다이어리 작성
async function insertDiaryInfo(connection, insertDiaryParams) {
  const insertDiaryQuery = `
                insert into DayDiary(userId, title, conceptId, content, createAt)
                values (?, ?, ?, ?, ?);
                `;
  const [diaryRow] = await connection.query(insertDiaryQuery, insertDiaryParams);
  return diaryRow;
}

// 다이어리 이미지 작성
async function insertDiaryImg(connection, [DiaryImgList]) {
  const insertUserInfoQuery = `
        INSERT INTO DayDiaryImg(dayDiaryId, createAt, image)
        VALUES ?;
    `;
  const [diaryImgRow] = await connection.query(
    insertUserInfoQuery,
    [DiaryImgList]
  );

  return diaryImgRow;
}

// 다이어리 작성자와 수정자 확인
async function selectDiaryUserId(connection, diaryId) {
  const selectQuery = `
                SELECT userId
                FROM DayDiary
                WHERE id = ?;
                `;
  const [selectDiaryUserId] = await connection.query(selectQuery, diaryId);
  return selectDiaryUserId;
}

// 다이어리 수정
async function updateDiary(connection, DiaryParams) {
  const insertDiaryQuery = `
              update DayDiary
              set title = ?, conceptId = ?, content = ?, createAt = ?
              where id = ?;
                `;
  const [diaryRow] = await connection.query(insertDiaryQuery, DiaryParams);
  return diaryRow;
}

// 다이어리 이미지 수정
async function updateDiaryImg(connection, DiaryImgList) {
  const insertUserInfoQuery = `
        update DayDiaryImg
        set createAt = ?, image = ?
        where id = ?;
    `;
  const [diaryImgRow] = await connection.query(
    insertUserInfoQuery,
    DiaryImgList
  );
  return diaryImgRow;
}

// 작성한 다이어리 이미지 불러오기
async function selectDiaryImg(connection, dayDiaryId) {
  const selectQuery = `
                SELECT id, dayDiaryId, image, date_format(createAt, '%Y-%m-%d') as createAt
                FROM DayDiaryImg
                WHERE dayDiaryId = ?;
                `;
  const [selectDiaryRows] = await connection.query(selectQuery, dayDiaryId);
  return selectDiaryRows;
}

// 다이어리삭제
async function deleteDiary(connection, dayDiaryId) {
  const selectQuery = `
        update DayDiary
        set status = 'Deleted'
        where id = ?;
                `;
  const [selectDiaryRows] = await connection.query(selectQuery, dayDiaryId);
  return selectDiaryRows;
}

// 다이어리이미지삭제
async function deleteDiaryImg(connection, dayDiaryId) {
  const selectQuery = `
        update DayDiaryImg
        set status = 'Deleted'
        where dayDiaryId = ?;
                `;
  const [selectDiaryRows] = await connection.query(selectQuery, dayDiaryId);
  return selectDiaryRows;
}

// 연도,월,일로 다이어리 조회
async function selectDateDiary(connection, userId, createAt) {
  const selectQuery = `
SELECT UserConcept.id, conceptId, ConceptData.name
FROM UserConcept
INNER JOIN ConceptData ON UserConcept.conceptId = ConceptData.id
WHERE userId = ? and date(UserConcept.createAt) = ?;
                `;
  const [selectDiaryRows] = await connection.query(selectQuery, [userId, createAt]);
  return selectDiaryRows;
}

// 다이어리 리워드 등록
async function insertReward(connection, userId) {
  const insertRewardQuery = `
                insert into Reward (userId, point, route)
                values (?, 5, '다이어리 등록');
                `;
  const [insertReward] = await connection.query(insertRewardQuery, userId);
  return insertReward;
}


module.exports = {
  selectDiary,
  insertDiaryInfo,
  selectDiaryUserId,
  insertDiaryImg,
  updateDiary,
  updateDiaryImg,
  selectDiaryImg,
  deleteDiary,
  deleteDiaryImg,
  selectDateDiary,
  insertReward
};
