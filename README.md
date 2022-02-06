# OFME-Server
OFME Backend Repository

## 📌Introduction
새롭게 만나는 캐릭터의 성향을 경험해보면서 나만의 하루를 기록하는 다이어리앱


## 📌Role
- 류영준 : PM, Backend Developer
- 한지윤 : UI/UX Designer
- 하나한 : iOS Developer 


## 📌Development Environment
>AWS EC2에서 Node.js를 통해 서버 배포, AWS RDS에서 DB서버 구축

<img src="https://user-images.githubusercontent.com/78195316/131979463-9867ae52-e847-4b46-8dd7-5e9620505a8e.png" width="30%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://miro.medium.com/max/960/0*uXXbbKGKNQUQonbC.png" width="30%">
</br></br>
<img src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbnveOL%2FbtqKylNzdtm%2FN9aaEvOxd7Hm0N0KJYg6l0%2Fimg.png" width="35%"><img src="https://media.vlpt.us/images/ayoung0073/post/e736dc61-9be5-4f91-b751-4a1f64bc4a97/rds.png" width="35%">
</br></br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://media.vlpt.us/images/leejh3224/post/eeea9dd5-d99a-4b7b-9024-d4866d48ca70/mysql.png" width="200" height="100">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://user-images.githubusercontent.com/78195316/131980650-944822c9-3b9e-4be1-ae61-8e60d5d6bc7c.jpeg" width="40%"> 
</br></br>

## 📌Directory Structure
```
📂 config
 ├── 📄 baseResponseStatus.js
 ├── 📄 secret.js 
 ├── 📄 database.js 
 ├── 📄 express.js
 ├── 📄 jwtMiddleware.js
 ├── 📄 response.js 
 └── 📄 winston.js
📂 src
 └── 📂 app
      ├── 📂 Concept
      |    ├── 📄 conceptController.js
      |    ├── 📄 conceptDao.js
      |    ├── 📄 conceptProvider.js
      |    ├── 📄 conceptRoute.js
      |    └── 📄 conceptService.js
      ├── 📂 Diary
      |    ├── 📄 diaryController.js
      |    ├── 📄 diaryDao.js
      |    ├── 📄 diaryProvider.js
      |    ├── 📄 diaryRoute.js
      |    └── 📄 diaryService.js
      ├── 📂 Main
      |    ├── 📄 mainController.js
      |    ├── 📄 mainDao.js
      |    ├── 📄 mainProvider.js
      |    ├── 📄 mainRoute.js
      |    └── 📄 mainService.js
      ├── 📂 Mypage
      |    ├── 📄 mypageController.js
      |    ├── 📄 mypageDao.js
      |    ├── 📄 mypageProvider.js
      |    ├── 📄 mypageRoute.js
      |    └── 📄 mypageService.js
      ├── 📂 QnA
      |    ├── 📄 qnaController.js
      |    ├── 📄 qnaDao.js
      |    ├── 📄 qnaProvider.js
      |    ├── 📄 qnaRoute.js
      |    └── 📄 qnaService.js
      ├── 📂 Type
      |    ├── 📄 typeController.js
      |    ├── 📄 typeDao.js
      |    ├── 📄 typeProvider.js
      |    ├── 📄 typeRoute.js
      |    └── 📄 typeService.js
      └── 📂 User
           ├── 📄 userController.js
           ├── 📄 userDao.js
           ├── 📄 userProvider.js
           ├── 📄 userRoute.js
           └── 📄 userService.js
📄 .gitignore
📄 index.js
📄 package.json
```
</br>

## 📌OFME Notion Link

## 📌AppStore Download Link
