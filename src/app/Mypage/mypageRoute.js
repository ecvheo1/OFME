module.exports = function(app){
    const concept = require('./mypageController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 1. 마이 페이지 조회 API
    app.get('/mypages', jwtMiddleware, concept.getMypage);
    
    // 2. 내 정보 조회 API
    app.get('/mypages/details', jwtMiddleware, concept.getMypageDetail);

    // 3. 내 정보 수정 API
    app.patch('/mypages/details', jwtMiddleware, concept.patchMypageDetail);

    // 4. 비밀번호 수정 API
    app.patch('/mypages/passwords', jwtMiddleware, concept.patchPassWord);
};