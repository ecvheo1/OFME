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

// 유저 JWT 토큰 확인
async function selectUserJwt(connection, userId) {
  const selectUserJwtListQuery = `
                SELECT id, jwt
                FROM Token
                WHERE userId = ? and status = 'Activated';
                `;
  const [userJwtRows] = await connection.query(selectUserJwtListQuery, userId);
  return userJwtRows;
}

// 회원가입
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
      INSERT INTO User (email, password, nickname, imgUrl, status)
      VALUES (?, ?, ?, ?, "Activated");
  `
  const insertUserInfoRows = await connection.query(insertUserInfoQuery, insertUserInfoParams);
  return insertUserInfoRows;
}

// 로그인 - 패스워드 확인
async function selectUserPassword(connection, email) {
  const selectUserPasswordQuery = `
      SELECT id, email, password
      FROM User
      WHERE email = ?;
  `;
  
  const [selectUserPasswordRows] = await connection.query(selectUserPasswordQuery, [email]);
  return selectUserPasswordRows;
}

// 유저 JWT 토큰 등록
async function insertToken(connection, userId, token) {
  const insertTokenQuery = `
      INSERT INTO Token (userId, jwt, status)
      VALUES (?, ?, "Activated");
  `;
  
  const [insertTokenRows] = await connection.query(insertTokenQuery, [userId, token]);
  return insertTokenRows;
}

// 유저 JWT 토큰 상태 변경 - 로그아웃(Deleted)
async function deleteJWT(connection, userId) {
  const deleteJWTQuery = `
      UPDATE Token
      set status = 'Deleted'
      where userId = ?;
  `;
  
  const [deleteJWTRows] = await connection.query(deleteJWTQuery, [userId]);
  return deleteJWTRows;
}
 
// 유저 JWT 토큰 상태 확인
async function selectLogoutToken(connection, token) {
  const selectLogoutTokenQuery = `
                SELECT id, jwt, status
                FROM Token
                WHERE jwt = ?;
                `;
  const [selectLogoutTokenRows] = await connection.query(selectLogoutTokenQuery, token);
  return selectLogoutTokenRows;
}

// 유저 회원탈퇴
async function deleteUser(connection, userId) {
  const deleteUserQuery = `
      UPDATE User
      set status = 'Deleted'
      where id = ?;
  `;
  
  const [deleteUserRows] = await connection.query(deleteUserQuery, [userId]);
  return deleteUserRows;
}

// 유저 정보조회
async function getUser(connection, userId) {
  const getUserQuery = `
      select id, nickname
      from User
      where id = ? and status = 'Activated';
  `;
  
  const [getUserRows] = await connection.query(getUserQuery, [userId]);
  return getUserRows;
}

// 유저 닉네임 조회
async function selectUserNickname2(connection, userId) {
  const selectUserNicknameQuery = `
      select id, nickname
      from User
      where id = ? and status = 'Activated';
  `;
  
  const [selectUserNicknameRows] = await connection.query(selectUserNicknameQuery, [userId]);
  return selectUserNicknameRows[0];
}


module.exports = {
  selectUser,
  selectUserEmail,
  selectUserNickname,
  insertUserInfo,
  selectUserPassword,
  selectUserStatus,
  selectUserJwt,
  insertToken,
  deleteJWT,
  selectLogoutToken,
  deleteUser,
  getUser,
  selectUserNickname2
};
