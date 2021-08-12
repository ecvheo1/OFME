module.exports = function(app){
    const concept = require('./conceptController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 6. 모든 컨셉 인덱스 조회 API
    app.get('/concepts/all', concept.getConceptId);
    
    // 1. 1단계 테스트 문제 조회 API
    app.get('/concepts/stageOne', jwtMiddleware, concept.getConceptStageOne);
    
    // 2. 2단계 테스트 문제 조회 API
    app.get('/concepts/stageTwo/:keywordId', jwtMiddleware, concept.getConceptStageTwo);

    // 3. 3단계 테스트 문제 조회 API
    app.get('/concepts/stageThree', jwtMiddleware, concept.getConceptStageThree);

    // 4. 컨셉 정보 조회 API
    app.get('/concepts/:conceptId', jwtMiddleware, concept.getConcept);

    // 5. 컨셉 등록 API
    app.post('/concepts', jwtMiddleware, concept.postConcept);

    // 5-1. 컨셉 추천 테스트 결과 조회
    app.get('/concepts-two/:stageOneResult/:stageTwoResult', jwtMiddleware, concept.getConceptInfo);

    // 5-2. 컨셉 등록 API
    app.post('/concepts-two/:conceptId', jwtMiddleware, concept.postConceptTwo);

};