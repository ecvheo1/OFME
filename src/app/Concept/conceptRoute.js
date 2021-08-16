module.exports = function(app){
    const concept = require('./conceptController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    // 1단계 테스트 문제 조회 API
    app.get('/concepts/stageOne', jwtMiddleware, concept.getConceptStageOne);
    
    // 2단계 테스트 문제 조회 API
    app.get('/concepts/stageTwo/:keywordId', jwtMiddleware, concept.getConceptStageTwo);
    
    // 3단계 테스트 문제 조회 API
    app.get('/concepts/stageThree', jwtMiddleware, concept.getConceptStageThree);
    
    // 컨셉 추천 테스트 결과 조회
    app.get('/concepts2/:stageOneResult/:stageTwoResult/result', jwtMiddleware, concept.getConceptInfo);
    
    // 컨셉 등록 API
    app.post('/concepts2/:conceptId', jwtMiddleware, concept.postConceptTwo);
    




    // 4. 컨셉 정보 조회 API
    app.get('/concepts/:conceptId', jwtMiddleware, concept.getConcept);
    
    // 5. 컨셉 등록 API
    app.post('/concepts', jwtMiddleware, concept.postConcept);

    // 6. 모든 컨셉 인덱스 조회 API
    app.get('/concepts/all', concept.getConceptId);

};