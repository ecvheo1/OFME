module.exports = function(app){
    const main = require('./mainController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    // 메인화면 조회 API 2
    app.get('/characters2', jwtMiddleware, main.getCharacters2);

    // 컨셉 시간 저장 API
    app.patch('/characters/timers', jwtMiddleware, main.patchTimer);

    // 컨셉 사용 종료 API
    app.patch('/characters/ends', jwtMiddleware, main.patchEnd);

    // 컨셉 평점 등록 API
    app.patch('/characters/ratings', jwtMiddleware, main.patchRating);


    
    // 1. 메인화면 조회 API (캐릭터)
    app.get('/characters', jwtMiddleware, main.getCharacters);

    // 2. 액션에 따른 행동이미지 조회 API
    app.get('/characters/actions', jwtMiddleware, main.selectActions);

};
