module.exports = function(app){
    const type = require('./typeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 16가지 유형 조회 API
    app.get('/types', type.getTypes);

    // 유형 선택 등록 후 결과 조회 API
    app.post('/types/:typeId/direct', jwtMiddleware, type.postTypes);
    
    // 12단계 테스트 조회 API
    app.get('/types/test', type.getTypeTests);

    // 테스트 결과 유형 등록 후 결과 조회 API
    app.post('/types/test', jwtMiddleware, type.postTestTypes);
};

