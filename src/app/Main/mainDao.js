async function selectCharacters(connection, userId) {
  const selectQuery = `
select User.nickname, ConceptData.name, ConceptData.id, ConceptImage.url, UserConcept.timer
from UserConcept
inner join User on User.id = UserConcept.userId
inner join ConceptData on ConceptData.id = UserConcept.conceptId
inner join ConceptImage on ConceptImage.conceptId = ConceptData.id
where UserConcept.userId = ? and UserConcept.status = 'Activated'
limit 1;
                `;
  const [selectCharactersRows] = await connection.query(selectQuery, userId);
  return selectCharactersRows;
}

async function updateCharactersEnd(connection, updateParams) {
  const updateCharactersQuery = `
update UserConcept
set status = 'End', timer = ?
where userId = ? and status = 'Activated'
order by id DESC limit 1;
                `;
  const [updateCharactersEndRow] = await connection.query(updateCharactersQuery, updateParams);
  return updateCharactersEndRow;
}



async function selectCharactersId(connection, Params) {
  const selectCharactersIdQuery = `
select id
from UserConcept
where userId = ?
order by id DESC limit 1;
                `;
  const [selectCharactersIdRow] = await connection.query(selectCharactersIdQuery, Params);
  return selectCharactersIdRow;
}



async function selectmainId(connection, conceptId) {
  const selectmainIdQuery = `
select userId
from UserConcept
where id = ?;
                `;
  const [selectmainIdRow] = await connection.query(selectmainIdQuery, conceptId);
  return selectmainIdRow;
}

async function selectActions(connection, conceptId) {
  const selectmainIdQuery = `
select id, situation, url
from ConceptImage
where ConceptId = ? and status = 'Activated';
                `;
  const [selectmainIdRow] = await connection.query(selectmainIdQuery, conceptId);
  return selectmainIdRow;
}

// 유저가 컨셉 진행중인지 확인
async function selectUserConceptStatus(connection, userId) {
  const selectUserConceptStatusQuery = `
  SELECT userId, conceptId
  FROM UserConcept
  WHERE userId = ? and status = 'Activated';
  `;
  const [selectUserConceptStatusRow] = await connection.query(selectUserConceptStatusQuery, userId);
  return selectUserConceptStatusRow;
}

// 유저 닉네임 조회
async function selectUserNickname(connection, userId) {
  const selectUserNicknameQuery = `
  SELECT id, nickname
  FROM User
  WHERE id = ? and status = 'Activated';
  `;
  const [selectUserNicknameRow] = await connection.query(selectUserNicknameQuery, userId);
  return selectUserNicknameRow[0];
}

// 컨셉 진행 중일 때, 메인화면 조회 (컨셉 정보)
async function selectCharacterData(connection, userId) {
  const selectCharacterDataQuery = `
  SELECT ConceptData.id, ConceptData.name, ConceptData.advantage, ConceptData.habit,
       ConceptData.behavior, ConceptData.value, ConceptData.music, UserConcept.isFirstMain
  FROM UserConcept
  INNER JOIN ConceptData on UserConcept.conceptId = ConceptData.id
  WHERE userId = ? and UserConcept.status = 'Activated';
  `
  const [selectCharacterDataRow] = await connection.query(selectCharacterDataQuery, userId);
  return selectCharacterDataRow[0];
}

// 컨셉 진행 중 일 때, 메인화면 조회 (컨셉 이미지)
async function selectCharacterImage(connection, userId, characterStatus1, characterStatus2) {
  const selectCharacterImageQuery = `
  SELECT ConceptImage.url
  FROM ConceptImage 
  INNER JOIN UserConcept on UserConcept.conceptId = ConceptImage.conceptId
  WHERE UserConcept.userId = ? and (situation = ? or situation = ?) and UserConcept.status = 'Activated';
  `
  const [selectCharacterImageRow] = await connection.query(selectCharacterImageQuery, [userId, characterStatus1, characterStatus2]);
  return selectCharacterImageRow;
}

// 컨셉 진행중인지 확인
async function selectConceptProgress(connection, userId) {
  const selectConceptProgressQuery = `
  SELECT userId, conceptId, status
  FROM UserConcept 
  WHERE UserConcept.userId = ? and UserConcept.status = 'Activated';
  `
  const [selectConceptProgressRow] = await connection.query(selectConceptProgressQuery, userId);
  return selectConceptProgressRow;
}


// 컨셉 시간 저장
async function updateTimer(connection, userId, timer) {
  const updateTimerQuery = `
  update UserConcept
  set timer = ?
  where userId = ? and status = 'Activated';
  `;
  const [updateTimerRow] = await connection.query(updateTimerQuery, [timer, userId]);
  return updateTimerRow;
}

// 컨셉 시간 저장 후 종료
async function updateEnd(connection, userId) {
  const updateEndQuery = `
  update UserConcept
  set status = 'End'
  where userId = ? and status = 'Activated';
  `;
  const [updateEndRow] = await connection.query(updateEndQuery, [userId]);
  return updateEndRow;
}

// 컨셉 종료 화면 조회
async function selectConceptEndData(connection, userId) {
  const selectConceptEndDataQuery = `
  SELECT TIMESTAMPDIFF(MINUTE, UserConcept.createAt, now()) AS clientTime, ConceptImage.url, UserConcept.conceptId
  FROM UserConcept
  INNER JOIN ConceptImage on  UserConcept.conceptId = ConceptImage.conceptId
  WHERE UserConcept.userId = ? and ConceptImage.situation = 'default1'
  ORDER BY UserConcept.id DESC limit 1;
  `
  const [selectConceptEndData] = await connection.query(selectConceptEndDataQuery, userId);
  return selectConceptEndData[0];
}

// 컨셉 종료 평점 등록
async function updateRating(connection, userId, conceptPoint) {
  const updateRatingQuery = `
  UPDATE UserConcept
  SET conceptPoint = ?
  WHERE userId = ?
  ORDER BY UserConcept.id DESC limit 1;
  `;
  const [updateRatingRow] = await connection.query(updateRatingQuery, [conceptPoint, userId]);
  return updateRatingRow;
}


// 컨셉 종료 평점 등록
async function updateFirstMain(connection, userId) {
  const updateFirstMainQuery = `
  UPDATE UserConcept
  SET isFirstMain = ?
  WHERE userId = ? and status='Activated';
  `;
  const [updateFirstMainRow] = await connection.query(updateFirstMainQuery, ['F', userId]);
  return updateFirstMainRow;
}

// 컨셉 진행한 시간 조회(분)
async function selectCharacterTime(connection, userId) {
  const selectCharacterTimeQuery = `
  SELECT TIMESTAMPDIFF(MINUTE, createAt, now()) AS clientTime
  FROM UserConcept
  WHERE userId = ? and UserConcept.status = 'Activated';
  `;
  const [selectCharacterTimeRow] = await connection.query(selectCharacterTimeQuery, userId);
  return selectCharacterTimeRow[0];
}


module.exports = {
  selectCharacters,
  updateCharactersEnd,
  selectCharactersId,
  updateRating,
  selectmainId,
  selectActions,
  selectUserConceptStatus,
  selectUserNickname,
  selectCharacterData,
  selectCharacterImage,
  selectConceptProgress,
  updateTimer,
  updateEnd,
  selectConceptEndData,
  updateRating,
  updateFirstMain,
  selectCharacterTime
};
