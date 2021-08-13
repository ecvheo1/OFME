module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },

    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 8~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 2~10자리를 입력해주세요." },

    LOGIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    LOGIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    LOGIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    LOGIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },
    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    SIGNUP_CHECKPASSWORD_EMPTY : { "isSuccess": false, "code": 2019, "message": "재확인 비밀번호를 입력해주세요." },
    SIGNUP_NICKNAME_TYPE : { "isSuccess": false, "code": 2020, "message": "닉네임은 한글만 허용합니다." },
    LOGIN_PASSWORD_LENGTH : { "isSuccess": false, "code": 2021, "message":"비밀번호는 8~20자리를 입력해주세요." },
    USERTYPE_TYPEID_EMPTY : { "isSuccess": false, "code": 2022, "message":"typeId를 입력해주세요." },
    USERTYPE_TYPEID_ERROR : { "isSuccess": false, "code": 2023, "message": "typeId는 1~16 사이의 값을 입력해주세요."},
    USERTYPE_ANSWER_ERROR : { "isSuccess": false, "code": 2024, "message": "body의 value 값 형식이 올바르지 않습니다."},
    USERTYPE_ANSWER_LENGTH : { "isSuccess": false, "code": 2025, "message": "body의 value의 개수가 3개가 아닙니다."},
    USERTYPE_ANSWER_EMPTY : { "isSuccess": false, "code": 2026, "message": "EI, NS, TF, PJ 질문의 답변을 모두 입력해주세요."},
    CONCEPT_POST_STAGETWORESULT :  { "isSuccess": false, "code": 2027, "message": "stageTwoResult 값은 1~4 사이의 값을 입력해주세요."},
    QNA_QUESTIONID_NOT_EXIST : {"isSuccess": false, "code": 2028, "message": "questionId 값을 입력해주세요."},
    CONCEPT_CONCEPTID_ERROR : {"isSuccess": false, "code": 2029, "message": "stageTwoResult 값은 1~20 사이의 값을 입력해주세요."},



    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"이미 사용중인 아이디입니다.(중복된 이메일입니다.)" },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"이미 사용중인 닉네임입니다." },

    LOGIN_EMAIL_NOT_EXIST : { "isSuccess": false, "code": 3003, "message": "존재하지 않은 이메일입니다." },
    LOGIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    LOGIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "탈퇴 된 계정입니다." },
    SIGNUP_PASSWORD_CONFIRM : { "isSuccess": false, "code": 3007, "message": "비밀번호가 일치하지 않습니다." },
    SIGNIN_ALREADY_LOGIN : { "isSuccess": false, "code": 3008, "message": "이미 로그인된 유저입니다." },
    LOGOUT_ALREADY_LOGOUT : { "isSuccess": false, "code": 3009, "message": "이미 로그아웃된 토큰입니다." },
    SIGNUP_USER_PASSWORD_CONFIRM : { "isSuccess": false, "code": 3010, "message": "비밀번호 수정에 실패하였습니다." },
    USER_PASSWORD_FAIL : { "isSuccess": false, "code": 3011, "message": "입력하신 이전 비밀번호가 틀립니다." },

    // 컨셉 error
    CONCEPT_KEYWORD_NOT_EXIST : { "isSuccess": false, "code": 3020, "message": "키워드가 없습니다. 정확히 입력해주세요." },
    CONCEPT_NOT_EXIST : { "isSuccess": false, "code": 3021, "message": "조회할 컨셉이 없습니다. 정확하게 입력해주세요." },
    CONCEPT_POST_NOT_EXIST : { "isSuccess": false, "code": 3022, "message": "등록할 컨셉이 존재하지 않습니다. 정확하게 입력해주세요." },
    CONCEPT_POST_EXIST : { "isSuccess": false, "code": 3023, "message": "컨셉이 이미 진행중 입니다. 종료하고 다시 시도해주세요." },

    // 메인 error
    MAIN_CHARACTER_NOT_EXIST : { "isSuccess": false, "code": 3030, "message": "진행중인 컨셉이 없습니다. 컨셉을 먼저 정해주세요." },
    MAIN_TIMER_NOT_EXIST : { "isSuccess": false, "code": 3031, "message": "타이머가 입력되지 않았습니다." },
    MAIN_CONCEPT_NOT_EXIST : { "isSuccess": false, "code": 3032, "message": "별점을 등록할 컨셉인덱스를 정해주세요." },
    MAIN_STAR_NOT_EXIST : { "isSuccess": false, "code": 3033, "message": "등록할 별점을 입력해주세요." },
    MAIN_INT_STAR_NOT_EXIST : { "isSuccess": false, "code": 3034, "message": "별점은 정수 1~5로 입력해주세요." },

    // 다이어리 error
    DIARY_NOT_EXIST : { "isSuccess": false, "code": 3110, "message": "다이어리가 존재하지 않습니다." },
    DIARY_TITLE_NOT_EXIST : { "isSuccess": false, "code": 3111, "message": "타이틀을 입력해주세요." },
    DIARY_TEXT_NOT_EXIST : { "isSuccess": false, "code": 3112, "message": "내용을 입력해주세요." },
    DIARY_CREATEAT_NOT_EXIST : { "isSuccess": false, "code": 3113, "message": "날짜를 선택해주세요." },
    DIARY_IMG_NOT_EXIST : { "isSuccess": false, "code": 3114, "message": "이미지는 최대 4개까지 입니다." },
    DIARY_CHARACTER_NOT_EXIST : { "isSuccess": false, "code": 3115, "message": "캐릭터를 설정해주세요. 캐릭터를 설정하지 않으면 캐릭터인덱스 -1을 주십시오." },
    DIARY_USER_NOT_EXIST : { "isSuccess": false, "code": 3116, "message": "권한이 없습니다." },
    DIARY_ID_NOT_EXIST : { "isSuccess": false, "code": 3117, "message": "삭제할 다이어리를 입력해주세요." },
    CONCEPT_ID_NOT_EXIST : { "isSuccess": false, "code": 3118, "message": "사용한 컨셉이 없습니다." },

    // QnA error
    QNA_SORT_NOT_EXIST : { "isSuccess": false, "code": 3130, "message": "조회할 카테고리를 정확하게 입력해주세요, O: 오늘의 오브미  D: 일상이야기  T: 나의생각" },
    QNA_ANSWERS_NOT_EXIST : { "isSuccess": false, "code": 3131, "message": "모든 질문: 0 , 공유완료 : 1, 답변완료:2, 미답변 : 3 에 맞게 입력해주세요." },
    QNA_NOT_EXIST : { "isSuccess": false, "code": 3132, "message": "상세 질문 리스트 조회 실패하였습니다." },
    QNA_QUESTION_NOT_EXIST : { "isSuccess": false, "code": 3133, "message": "질문에 대한 답을 등록해주세요." },
    QNA_SHARE_NOT_EXIST : { "isSuccess": false, "code": 3134, "message": "공유 유무를 제대로 입력해주세요. 공유 : Y, 답변만 : N" },
    QNA_ANSEWER_NOT_EXIST : { "isSuccess": false, "code": 3135, "message": "답을 입력해주세요." },
    QNA_ANSEWER_LENGTH_NOT_EXIST : { "isSuccess": false, "code": 3136, "message": "질문에 대한 답은 290자이내로 적어주세요." },
    QNA_ANSEWER_EXIST : { "isSuccess": false, "code": 3137, "message": "이미 작성된 답변이 있습니다. 그 답변을 수정해주세요." },
    QNA_QUESTION_IS_NOT_EXIST : { "isSuccess": false, "code": 3138, "message": "해당 질문이 존재하지 않습니다." },
    QNA_ANSEWER_IS_NOT_EXIST : { "isSuccess": false, "code": 3139, "message": "해당 질문에 대한 답변이 존재하지 않아 수정이 불가합니다. 답변을 작성해주세요." },
    QNA_REWARD_NOT_EXIST : { "isSuccess": false, "code": 3140, "message": "리워드가 부족하여 해당 QnA 잠금해제를 할 수 없습니다." },
    QNA_AROUND_ANSEWER_NOT_EXIST : { "isSuccess": false, "code": 3141, "message": "해당 질문에 대한 답변이 없습니다." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},

}
