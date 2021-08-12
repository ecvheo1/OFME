module.exports = function(app){
    const main = require('./mainController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 메인화면 조회 API (캐릭터)
    app.get('/characters', jwtMiddleware, main.getCharacters);

    // 2. 액션에 따른 행동이미지 조회 API
    app.get('/characters/actions', jwtMiddleware, main.selectActions);

    // 3. 컨셉 시간 저장 API
    app.patch('/characters/timers', jwtMiddleware, main.patchCharactersTimer);

    // 4. 컨셉 사용 종료 API
    app.patch('/characters/ends', jwtMiddleware, main.patchCharactersEnd);

    // 5. 컨셉 평점 등록 API
    app.patch('/characters/ratings', jwtMiddleware, main.patchRating);
};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API