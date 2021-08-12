// 마이페이지 상단 내 정보들
async function selectMypage(connection, user) {
  const ConceptStageQuery = `
select UserType.createAt, nickname, concept.name, User.imgUrl, TypeData.highlight,
       (select ifnull(sum(point), 0) from Reward where userId = ?) as point
from User
left join (select ConceptData.name, userId
    from UserConcept
    inner join ConceptData on UserConcept.conceptId = ConceptData.id
    where UserConcept.status = 'Activated') concept on concept.userId = User.id
left join UserType on UserType.userId = User.id
left join TypeData on TypeData.id = UserType.typeId
where User.id = ?
order by UserType.createAt DESC limit 1;
                `;
  const [ConceptStageRows] = await connection.query(ConceptStageQuery, user);
  return ConceptStageRows;
}

// 마이페이지 중단 함께한 친구들 조회
async function selectMyfriend(connection, userId) {
  const ConceptStageQuery = `
  select url, name, UserConcept.conceptPoint, UserConcept.conceptId
  from UserConcept
  inner join ConceptData on UserConcept.conceptId = ConceptData.id
  join (select conceptId, url from ConceptImage where ConceptImage.situation = 'default1') Image on Image.conceptId = UserConcept.conceptId
  where UserConcept.userId = ? and UserConcept.status = 'End'
  order by UserConcept.createAt DESC limit 5;
                `;
  const [ConceptStageRows] = await connection.query(ConceptStageQuery, userId);
  return ConceptStageRows;
}

// 마이페이지 하단 나의 성향 히스토리 조회
async function selectMyhistory(connection, userId) {
  const ConceptStageQuery = `
select highlight, date_format(UserType.createAt, '%Y-%m-%d') as createAt
from UserType
inner join TypeData on TypeData.id = UserType.typeId
where userId = ? 
order by UserType.createAt DESC limit 5;
                `;
  const [ConceptStageRows] = await connection.query(ConceptStageQuery, userId);
  return ConceptStageRows;
}

// 내정보 조회
async function selectMypageDetail(connection, userId) {
  const ConceptStageQuery = `
select imgUrl, email, nickname
from User
where id = ? and status = 'Activated';
                `;
  const [ConceptStageRows] = await connection.query(ConceptStageQuery, userId);
  return ConceptStageRows;
}

// 내정보 조회
async function selectMypageDetailPassword(connection, userId) {
  const Query = `
select password
from User
where id = ? and status = 'Activated';
                `;
  const [Rows] = await connection.query(Query, userId);
  return Rows;
}

// 비밀번호 조회
async function updateMypageDetail(connection, updateMypageDetailParams) {
  const Query = `
update User
set password = ?
where id = ?;
                `;
  const [Rows] = await connection.query(Query, updateMypageDetailParams);
  return Rows;
}

// 비밀번호 조회
async function updateMypage(connection, params) {
  const Query = `
update User
set nickname = ?, imgUrl = ?
where id = ?;
                `;
  const [Rows] = await connection.query(Query, params);
  return Rows;
}
module.exports = {
  selectMypage,
  selectMyfriend,
  selectMyhistory,
  selectMypageDetail,
  selectMypageDetailPassword,
  updateMypageDetail,
  updateMypage,
};
