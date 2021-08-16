// 컨셉 진행중인지 확인
async function selectConceptProgressStatus(connection, userId) {
  const selectConceptProgressStatusQuery = `
  SELECT UserConcept.conceptId, UserConcept.status
  FROM UserConcept
  WHERE userId = ? and status = 'Activated';
  `;
  const [selectConceptProgressStatusRow] = await connection.query(selectConceptProgressStatusQuery, userId);
  return selectConceptProgressStatusRow;
}


// 컨셉을 이미 진행했는지 확인
async function  selectConceptAlreadyStatus(connection, userId) {
  const selectConceptAlreadyStatusQuery = `
  SELECT *
  FROM UserConcept
  WHERE DATE_FORMAT(createAt, "%Y-%m-%d") = CURDATE() and userId = ?;
  `;
  const [selectConceptAlreadyStatusRow] = await connection.query(selectConceptAlreadyStatusQuery, userId);
  return selectConceptAlreadyStatusRow;
}


// 컨셉 1단계 테스트 조회
async function selectStageOne(connection) {
  const selectStageOneQuery = `
  SELECT id, keyword
  FROM ConceptTest1
  WHERE status = 'Activated';
  `;
  const [selectStageOneRow] = await connection.query(selectStageOneQuery);
  return selectStageOneRow;
}


// 컨셉 2단계 테스트 조회
async function selectStageTwo(connection, keywordId) {
  const CselectStageTwoQuery = `
  SELECT id, keywordId, question, highlight, answer1, answer2, answer3, answer4
  FROM ConceptTest2
  WHERE keywordId = ? and status = 'Activated';
  `;
  const [CselectStageTwoRows] = await connection.query(CselectStageTwoQuery, keywordId);
  return CselectStageTwoRows[0];
}


// 컨셉 3단계 테스트 조회
async function selectStageThree(connection) {
  const selectStageThreeQuery = `
  SELECT id, question, highlight, answer1, answer2, answer3, answer4
  FROM ConceptTest3
  WHERE status = 'Activated'
  ORDER BY rand() LIMIT 1;
  `;
  const [selectStageThreeRows] = await connection.query(selectStageThreeQuery);
  return selectStageThreeRows[0];
}


// 컨셉 추천 테스트 결과 조회
async function selectConceptInfoResult(connection, stageOneResult, stageTwoResult) {
  const selectConceptInfoResultQuery = `
  SELECT ConceptData.id, url, name, subName, description, advantage, habit, behavior, value, music
  FROM ConceptData
  JOIN ConceptSort on ConceptSort.conceptId = ConceptData.id
  JOIN ConceptImage on ConceptImage.ConceptId = ConceptSort.conceptId
  WHERE ConceptSort.testKeywordId = ? and ConceptSort.testAnswerId = ? and ConceptImage.situation = 'default1';
  `;
  const [selectConceptInfoResultRows] = await connection.query(selectConceptInfoResultQuery, [stageOneResult, stageTwoResult]);
  return selectConceptInfoResultRows[0];
}

// 컨셉 등록
async function insertUserConcept(connection, userId, conceptId) {
  const insertUserConceptQuery = `
                  INSERT INTO UserConcept (userId, conceptId)
                  VALUES (?, ?)
                `;
  const [insertUserConceptRows] = await connection.query(insertUserConceptQuery, [userId, conceptId]);
  return insertUserConceptRows;
}






// 컨셉 정보 조회
async function selectConcept(connection, conceptId) {
  const ConceptQuery = `
select ConceptData.id, url, name, subName, description, advantage, habit, behavior, value, music
from ConceptData
inner join ConceptImage on ConceptImage.conceptId = ConceptData.id
where ConceptData.id = ? and ConceptData.status = 'Activated' limit 1;
                `;
  const [ConceptRows] = await connection.query(ConceptQuery, conceptId);
  return ConceptRows;
}

// 컨셉 인덱스 불러오기
async function selectConceptId(connection) {
  const ConceptQuery = `
select id, name
from ConceptData
where status = 'Activated'
                `;
  const [ConceptRows] = await connection.query(ConceptQuery);
  return ConceptRows;
}

// 컨셉 추천 결과 컨셉 인덱스 조회
async function selectTestResult(connection, stageOneResult, stageTwoResult) {
  const selectTestResultQuery = `
  select conceptId, testKeywordId, testAnswerId
  from ConceptSort
  where testKeywordId = ? and testAnswerId = ?;

                `;
  const [selectTestResultRows] = await connection.query(selectTestResultQuery, [stageOneResult, stageTwoResult]);
  return selectTestResultRows[0];
}



module.exports = {
  selectConceptProgressStatus,
  selectConceptAlreadyStatus,
  selectStageOne,
  selectStageTwo,
  selectStageThree,
  selectConceptInfoResult,
  insertUserConcept,

  selectConcept,
  selectConceptId,
  selectTestResult
};
