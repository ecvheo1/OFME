// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM User;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 유저 이메일 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailListQuery = `
                SELECT id, email 
                FROM User
                WHERE email = ?;
                `;
  const [userEmailRows] = await connection.query(selectUserEmailListQuery, email);
  return userEmailRows;
}

// 유저 닉네임 조회
async function selectUserNickname(connection, nickname) {
  const selectUserNicknameListQuery = `
                SELECT id, nickname 
                FROM User
                WHERE nickname = ?;
                `;
  const [userNicknameRows] = await connection.query(selectUserNicknameListQuery, nickname);
  return userNicknameRows;
}

// 유저 상태 확인
async function selectUserStatus(connection, email) {
  const selectUserStatusListQuery = `
                SELECT id, email, status 
                FROM User
                WHERE email = ?;
                `;
  const [userStatusRows] = await connection.query(selectUserStatusListQuery, email);
  return userStatusRows;
}

// 16가지 유형 조회
async function selectTypes(connection) {
  const selectTypesQuery = `
                SELECT id, name, highlight
                FROM TypeData
                `;
  const [selectTypesRows] = await connection.query(selectTypesQuery);
  return selectTypesRows;
}

// 유형 결과 조회
async function selectTypeResult(connection, typeId) {
  const selectTypeResultQuery = `
                SELECT id as typeId, subName, name, highlight, keyword, description1, description2
                FROM TypeData
                WHERE id = ?;
                `;
  const [selectTypeResultRows] = await connection.query(selectTypeResultQuery, [typeId]);
  return selectTypeResultRows[0];
}

// 유저 유형 결과 등록
async function postUserType(connection, userId, typeId) {
  const postUserTypeQuery = `
                INSERT INTO UserType (userId, typeId)
                VALUES (?, ?)
                `;
  const [postUserTypeRows] = await connection.query(postUserTypeQuery, [userId, typeId]);
  return postUserTypeRows;
}

// 12단계 테스트 조회
async function selectTypeTests(connection) {
  const selectTypeTestsQuery = `
                SELECT id, sort, question, highlight, ENTPanswer, ISFJanswer
                FROM TypeTest
                `;
  const [selectTypeTestsRows] = await connection.query(selectTypeTestsQuery);
  return selectTypeTestsRows;
}

// 나의 성향 알기 테스트 결과 조회
async function selectTypeResultFromTest(connection, EIvalue, NSvalue, TFvalue, PJvalue) {
  const selectTypeResultFromTestQuery = `
              SELECT id as typeId, subName, name, highlight, keyword, description1, description2
              FROM TypeData
              WHERE EI= ? and NS = ? and TF = ? and PJ = ?;
                `;
  const [selectTypeResultFromTestRows] = await connection.query(selectTypeResultFromTestQuery, [EIvalue, NSvalue, TFvalue, PJvalue]);
  return selectTypeResultFromTestRows[0];
}

module.exports = {
  selectUser,
  selectUserEmail,
  selectUserNickname,
  selectUserStatus,
  selectTypes,
  selectTypeResult,
  postUserType,
  selectTypeTests,
  selectTypeResultFromTest
};
