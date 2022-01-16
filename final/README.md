# [110-1] Web Programming Final
## Group 11 台灣留學移民找工交流平台
## Demo 影片連結
https://youtu.be/fIwIJPGniXE
## 描述這個服務在做什麼
建立一個台灣學生的海外留學/找工討論區
## Deployed 連結
https://twoverseas-qz4wfq2sea-de.a.run.app/

## 如何在 localhost 安裝與測試之詳細步驟
```
> cd backend
> yarn
> yarn start 
```
瀏覽器開啟 `localhost:8080`

## 功能說明
- 帳戶
    - SignUp
    - Login
    - Logout
- 多重看板
    - 可從選單選取欲瀏覽之看板
- 發文、回應
    - 支援MarkDown編輯器
- 搜尋
    - 右上角搜尋按鈕可以搜尋文章


## 使用之第三方套件、框架、程式碼
- Frontend
    - React
    - React Router
    - css
    - Material UI
- Backend
    - GraphQL
    - Apollo
    - GraphQL Shield
    - graphql-middleware
    - Node.js
    - Express
    - JasonWebToken
    - Bcrypt
- Database
    - MongoDB
- Server
    - GCP

## 每位組員之負責項目
- 羅啟帆: 
    - 組長
    - 全部前端, 串接
- 邱譯：
    - 後端 Post, Board 相關
    - GraphQL
    - Deploy
- 黃柏諭：
    - 後端 User(Auth), Comment 相關
    - GrpahQL
    - 串接 NewPost, NewComment

## 專題製作心得
B07902047 : 這次的作業讓我完整經歷一個 web project 的設計與實作，深感獲益良多。包含分工，前端設計與react撰寫等等皆讓我增加不少經驗。

B06902030 : 這次的 Project 讓我體驗到原來開發一個完整的「網路服務」不是這麼簡單，要考慮的面向非常多，從系統效能到使用者體驗都有很多地方可以琢磨。在我們最後的專案中，我主要負責後端以及 deploy，只能說 graphql 太好用也太麻煩了。

R10922091 : 這堂課歷經三次黑客松摧殘還有最後的final project之後再也不敢在履歷上寫我會JS了。這次的project讓我複習了課堂的知識，也學到很多新東西像是jwt, bcrypt等。
