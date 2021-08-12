const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');

module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    require('../src/app/User/userRoute')(app);
    require('../src/app/Type/typeRoute')(app);
    require('../src/app/Diary/diaryRoute')(app);
    require('../src/app/Concept/conceptRoute')(app);
    require('../src/app/Main/mainRoute')(app);
    require('../src/app/Mypage/mypageRoute')(app);
    require('../src/app/QnA/qnaRoute')(app);
    
    return app;
};