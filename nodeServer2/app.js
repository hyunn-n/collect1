var express = require('express');
var app = express();

var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.get('/',(req,resp)=>{
    resp.sendFile(__dirname+'/public/index.html')
 });

app.get('/save', (req, res) => { 
    var title = req.query.title;
    var email = req.query.email;
    var content = req.query.content;

    res.send('<h1>'+title+'</h1>'); //서버 입장에서는 res
});

//db연동
const mdbConn = require('./mariadb/mariaDBConn.js');
//const mariaDBConn = require('./mariadb/mariaDBConn.js');
//app.engine('html', require('ejs').renderFile);
const port = process.env.PORT || 3000;

app.get('/list',(req,res) => {
    mdbConn.getUserList()
    .then((rows) => {
       res.send(rows);
    })
    .catch((errMsg) => {
       res.send(errMsg);
    });
});

app.post("/save", (req, res) => {
    const title = req.body.title;
    const email = req.body.email;
    const content = req.body.content;

    mdbConn.insertList(title, email, content)
    .then(() => {
        // 저장 성공 후 HTML 응답 생성
        res.send(`
            <html>
            <body>
                <h1>저장되었습니다.</h1>
                <p><a href="/list">저장된 목록 보기</a></p>
            </body>
            </html>
        `);
    })
    .catch((errMsg) => {
        res.send(errMsg);
    });
});

app.listen(3000, () => {
    console.log(`listening on ${port}`);
});

