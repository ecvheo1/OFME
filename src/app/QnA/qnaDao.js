// 질문 리스트 조회
async function selectQuestions(connection, selectParams) {
  const selectQuestionsQuery = `
  SELECT rankrow.id, sort, question, QnAAnswer.share
  FROM (
    SELECT *, RANK() OVER (PARTITION BY qna.sort ORDER BY qna.question ASC, qna.id ASC) AS a
    FROM QnAQuestion AS qna
      WHERE sort = 'O'
      ORDER BY RAND()
  ) AS rankrow
  LEFT JOIN QnAAnswer on QnAAnswer.questionId = rankrow.id and QnAAnswer.userId = ? and QnAAnswer.status = 'Activated'
  WHERE rankrow.a <= 20 and rankrow.status = 'Activated'
  UNION ALL
  SELECT rankrow.id, sort, question, QnAAnswer.share
  FROM (
    SELECT *, RANK() OVER (PARTITION BY qna.sort ORDER BY qna.question ASC, qna.id ASC) AS a
    FROM QnAQuestion AS qna
      WHERE (sort = 'D' or sort = 'T')and status = 'Activated'
  ) AS rankrow
  LEFT JOIN QnAAnswer on QnAAnswer.questionId = rankrow.id and QnAAnswer.userId = ? and QnAAnswer.status = 'Activated'
  WHERE rankrow.a <= 20 and rankrow.status = 'Activated' 
                `;
  const [selectQuestionsRows] = await connection.query(selectQuestionsQuery, selectParams);
  return selectQuestionsRows;
}
// 질문 리스트 조회
async function selectQuestionsList(connection, selectParams) {
  const selectQuestionsQuery = `
SELECT QnAQuestion.id, sort, question, QnAAnswer.share
FROM (
   SELECT *
   FROM QnAAnswer AS qna
    WHERE userId = ? and status = 'Activated'
) AS QnAAnswer
RIGHT JOIN QnAQuestion on QnAQuestion.id = QnAAnswer.questionId
WHERE QnAQuestion.sort = ? and QnAQuestion.status = 'Activated';
                `;
  const [selectQuestionsRows] = await connection.query(selectQuestionsQuery, selectParams);
  return selectQuestionsRows;
}
// 질문 리스트 조회
async function selectListShare(connection, selectParams) {
  const selectQuestionsQuery = `
SELECT QnAQuestion.id, sort, question, QnAAnswer.share
FROM (
   SELECT *
   FROM QnAAnswer AS qna
    WHERE userId = ? and status = 'Activated'
) AS QnAAnswer
RIGHT JOIN QnAQuestion on QnAQuestion.id = QnAAnswer.questionId
WHERE QnAQuestion.sort = ? and share = ? and QnAQuestion.status = 'Activated';
                `;
  const [selectQuestionsRows] = await connection.query(selectQuestionsQuery, selectParams);
  return selectQuestionsRows;
}
// 질문 리스트 조회
async function selectListNoAnswer(connection, selectParams) {
  const selectQuestionsQuery = `
SELECT QnAQuestion.id, sort, question, QnAAnswer.share
FROM (
   SELECT *
   FROM QnAAnswer AS qna
    WHERE userId = ? and status = 'Activated'
) AS QnAAnswer
RIGHT JOIN QnAQuestion on QnAQuestion.id = QnAAnswer.questionId
WHERE QnAQuestion.sort = ? and share IS NULL and QnAQuestion.status = 'Activated';
                `;
  const [selectQuestionsRows] = await connection.query(selectQuestionsQuery, selectParams);
  return selectQuestionsRows;
}
// 질문 리스트 조회
async function selectAnswers(connection, selectParams) {
  const selectQuestionsQuery = `
SELECT question, answer, share, date_format(QnAQuestion.createAt, '%Y-%m-%d') as createAt
FROM QnAQuestion
INNER JOIN QnAAnswer ON QnAQuestion.id = QnAAnswer.questionId
WHERE QnAAnswer.userId = ? and QnAAnswer.status = 'Activated' and QnAQuestion.id = ?;
                `;
  const [selectQuestionsRows] = await connection.query(selectQuestionsQuery, selectParams);
  return selectQuestionsRows;
}
// 질문 리스트 조회
async function createAnswers(connection, createAnswersParams) {
  const QuestionsQuery = `
INSERT INTO QnAAnswer(questionId, userId, answer, share)
VALUES (?, ? ,?, ?);
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, createAnswersParams);
  return QuestionsRows;
}
// 질문 리스트 조회
async function createReward(connection, createRewardParams) {
  const QuestionsQuery = `
INSERT INTO Reward(userId, point, route)
VALUES (?, ? ,?);
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, createRewardParams);
  return QuestionsRows;
}
// 질문 리스트 조회
async function selectAnswersIs(connection, selectParams) {
  const QuestionsQuery = `
SELECT *
FROM QnAAnswer
where questionId = ? and userId = ? and status = 'Activated';
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, selectParams);
  return QuestionsRows;
}
// 질문 리스트 조회
async function selectQuestionIs(connection, selectParams) {
  const QuestionsQuery = `
SELECT *
FROM QnAQuestion
WHERE id = ? and status = 'Activated';
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, selectParams);
  return QuestionsRows;
}
// 답변 수정
async function updateAnswers(connection, Params) {
  const QuestionsQuery = `
update QnAAnswer
set answer = ?, share = ?
where id = ? and status = 'Activated';
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, Params);
  return QuestionsRows;
}
// 답변 삭제
async function deleteAnswers(connection, Params) {
  const QuestionsQuery = `
update QnAAnswer
set status = 'Deleted'
where id = ? and status = 'Activated';
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, Params);
  return QuestionsRows;
}

async function selectEverything(connection, Params) {
/* const QuestionsQuery = `
SELECT QnAQuestion.id as questionId, question, QnAAround.id as aroundId
FROM (
   SELECT *
   FROM QnAAround
    WHERE userId = ?
) AS QnAAround
RIGHT JOIN QnAQuestion on QnAQuestion.id = QnAAround.questionId
WHERE QnAQuestion.status = 'Activated' and QnAAround.id IS NULL
UNION ALL
SELECT QnAQuestion.id, question, QnAAround.id
FROM QnAAround
INNER JOIN QnAQuestion ON QnAQuestion.id = QnAAround.questionId
WHERE QnAAround.userId = ?;
                `;
*/
  const QuestionsQuery = `
              SELECT QnAQuestion.id as questionId, question, QnAAround.id as aroundId
              FROM (
                SELECT *
                FROM QnAAround
                  WHERE userId = ?
              ) AS QnAAround
              RIGHT JOIN QnAQuestion on QnAQuestion.id = QnAAround.questionId
              WHERE QnAQuestion.status = 'Activated' ORDER BY RAND();
  `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, Params);
  return QuestionsRows;
}

async function selectMyReward(connection, Params) {
  const QuestionsQuery = `
SELECT (SELECT count(*) FROM QnAAround WHERE userId = ?) as countQnA, IFNULL(SUM(point), 0) as sumPoint
FROM Reward
WHERE Reward.userId = ? and status = 'Activated';
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, Params);
  return QuestionsRows;
}

async function selectShare(connection, Params) {
  const QuestionsQuery = `
  SELECT QnAQuestion.id as questionId, question, QnAAround.id as aroundId
  FROM QnAQuestion
  INNER JOIN QnAAnswer ON QnAQuestion.id = QnAAnswer.questionId
  LEFT JOIN QnAAround ON QnAQuestion.id = QnAAround.questionId and QnAAround.userId = QnAAnswer.userId
  WHERE QnAAnswer.userId = ? and QnAAnswer.status = 'Activated' and QnAAnswer.share = 'Y'
  order by QnAAround.id ASC;
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, Params);
  return QuestionsRows;
}

async function selectCheck(connection, Params) {
  const QuestionsQuery = `
  SELECT QnAQuestion.id as questionId, question, QnAAround.id as aroundId
  FROM QnAAround
  INNER JOIN QnAQuestion ON QnAQuestion.id = QnAAround.questionId
  WHERE QnAAround.userId = ? and QnAQuestion.status = 'Activated'
  order by QnAAround.id ASC;
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, Params);
  return QuestionsRows;
}

async function selectNoCheck(connection, Params) {
  const QuestionsQuery = `
SELECT QnAQuestion.id as questionId, question, QnAAround.id as aroundId
FROM (
   SELECT *
   FROM QnAAround
    WHERE userId = ?
) AS QnAAround
RIGHT JOIN QnAQuestion on QnAQuestion.id = QnAAround.questionId
WHERE QnAQuestion.status = 'Activated' and QnAAround.id IS NULL
ORDER BY RAND();
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, Params);
  return QuestionsRows;
}

async function selectQuestionPages(connection, Params) {
  const QuestionsQuery = `
  SELECT question, User.imgUrl, User.nickname, User.id as userId, answer, QnAAnswer.id as answerId, date_format(QnAAnswer.createAt, '%Y-%m-%d') as createAt
  FROM QnAQuestion
  RIGHT JOIN QnAAnswer ON QnAQuestion.id = QnAAnswer.questionId
  INNER JOIN User ON User.id = QnAAnswer.userId
  WHERE QnAAnswer.status = 'Activated' and QnAAnswer.share = 'Y' and QnAAnswer.questionId = ?
  ORDER BY QnAAnswer.createAt DESC;
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, Params);
  return QuestionsRows;
}

async function selectRockIs(connection, Params) {
  const QuestionsQuery = `
SELECT *
FROM QnAAround
WHERE userId = ? and questionId = ?;
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, Params);
  return QuestionsRows;
}

async function insertDeclarations(connection, Params) {
  const QuestionsQuery = `
insert into Declaration(answerId, userId)
values (?, ?);
                `;
  const [QuestionsRows] = await connection.query(QuestionsQuery, Params);
  return QuestionsRows;
}

// 질문 잠금해제하여 QnAAround 테이블에 추가
async function insertQnAAround(connection, questionId, userId) {
  const insertQnAAroundQuery = `
insert into QnAAround(questionId, userId)
values (?, ?);
                `;
  const [insertQnAAroundRows] = await connection.query(insertQnAAroundQuery, [questionId, userId]);
  return insertQnAAroundRows;
}



module.exports = {
  selectQuestions,
  selectQuestionsList,
  selectListShare,
  selectListNoAnswer,
  selectAnswers,
  createAnswers,
  createReward,
  selectAnswersIs,
  selectQuestionIs,
  updateAnswers,
  deleteAnswers,
  selectMyReward,
  selectEverything,
  selectShare,
  selectCheck,
  selectNoCheck,
  selectQuestionPages,
  selectRockIs,
  insertDeclarations,
  insertQnAAround
};
