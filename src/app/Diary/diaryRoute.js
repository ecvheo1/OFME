module.exports = function(app){
    const diary = require('./diaryController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const multer = require('multer');
    const uploader = multer({dest:'Diary/'});

    // 1. 데일리 다이어리 조회 API
    app.get('/diarys', jwtMiddleware, diary.getDiarys);

    // 2. 데일리 다이어리 작성 API
    app.post('/diarys', jwtMiddleware, diary.postDiarys);

    // 3. 데일리 다이어리 수정 API
    app.patch('/diarys', jwtMiddleware, diary.patchDiarys);
    
    // 4. 데일리 다이어리 삭제 API
    app.delete('/diarys', jwtMiddleware, diary.deleteDiarys);

    // 5. 날짜에 대한 컨셉 조회 API
    app.get('/date', jwtMiddleware, diary.getDateDiarys);
    
    // 6.
    app.get('/uploads', uploader.single(), diary.getDateDiarys);
};