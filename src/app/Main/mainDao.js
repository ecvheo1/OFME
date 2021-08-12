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

async function updateCharactersTimer(connection, updateParams) {
  const updateCharactersQuery = `
update UserConcept
set timer = ?
where userId = ? and status = 'Activated'
order by id DESC limit 1;
                `;
  const [updateCharactersTimerRow] = await connection.query(updateCharactersQuery, updateParams);
  return updateCharactersTimerRow;
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

async function updateRating(connection, Params) {
  const updateRatingQuery = `
update UserConcept
set conceptPoint = ?
where id = ?;
                `;
  const [updateRatingRow] = await connection.query(updateRatingQuery, Params);
  return updateRatingRow;
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

module.exports = {
  selectCharacters,
  updateCharactersEnd,
  updateCharactersTimer,
  selectCharactersId,
  updateRating,
  selectmainId,
  selectActions,
};
