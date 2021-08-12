module.exports = function(app){
    const qna = require('./qnaController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 1. 질문 리스트 조회 API
    app.get('/questions', jwtMiddleware, qna.getQuestions);
    
    // 2. 질문 상세 조회 API
    app.get('/questions/list', jwtMiddleware, qna.getQuestionsList);

    // 3. 답변 조회 API
    app.get('/questions/:questionId/answers', jwtMiddleware, qna.getAnswers);

    // 4. 답변 등록 API
    app.post('/questions/answers', jwtMiddleware, qna.postAnswers);

    // 5. 답변 수정 API
    app.patch('/questions/answers', jwtMiddleware, qna.patchAnswers);

    // 6. 답변 삭제 API
    app.delete('/questions/answers', jwtMiddleware, qna.deleteAnswers);

    // 7. 모든 질문 둘러보기 API
    app.get('/questions/views/everything', jwtMiddleware, qna.getEverything);

    // 8. 내가 공유한 QnA 둘러보기 API
    app.get('/questions/views/share', jwtMiddleware, qna.getShare);

    // 9. 확인완료 둘러보기 API
    app.get('/questions/views/check', jwtMiddleware, qna.getCheck);

    // 10. 미확인 둘러보기 API
    app.get('/questions/views/nocheck', jwtMiddleware, qna.getNoCheck);

    // 11. 확인한 QnA와 내 리워드 조회 API
    app.get('/questions/myrewards', jwtMiddleware, qna.getMyReward);

    // 12. 답변 둘러보기 API
    app.get('/questions/:questionId/pages', jwtMiddleware, qna.getQuestionPages);

    // 13. 둘러보기 답변 신고하기 API
    app.post('/declarations', jwtMiddleware, qna.postDeclarations);
};