const path = require('path')
const MongoClient = require("mongodb").MongoClient;
const captchapng = require('captchapng')
// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "szhmqd27";
//导出的一个方法 该方法是获取注册页面
exports.getRegisterPage = (req,res)=>{

    res.sendFile(path.join(__dirname,"../public/views/register.html"))

    
}
exports.register = (req,res)=>{
    const result ={
        status:0,
        message:'注册成功'
    }
    //1 拿到浏览器传递过来的数据
    const {username} = req.body;

    //2 先判断数据库中用户名 是否存在 如果存在返回提示
    MongoClient.connect(
        url,
        {useNewUrlParser: true},
        function(err,client){
            const db = client.db(dbName);
            //拿到集合
            const collection = db.collection("accountInfo");
            //查询一个
            collection.findOne({username},(err,doc)=>{
                if(doc){
                    result.status = 1;
                    result.message = "用户名已经存在"
                    //关闭数据库
                    client.close();
                    //返回
                    res.json(result)
                }else{
                    //3 如果用户名不存在 插入到数据库中
                    //result2有值 代表成功I result2为null 就是失败
                    collection.insertOne(req.body,(err,result2)=>{
                        if(!result2){
                            result.status = 2;
                            result.message = "注册失败"
                        }
                        //关闭数据库
                        client.close();
                        //返回
                        res.json(result);
                    })
                }
            })
        }
    )

}
exports.getLoginPage = (req,res) =>{
    res.sendFile(path.join(__dirname,"../public/views/login.html"))
}
exports.getVcodeImage = (req,res) =>{
    const vcode = parseInt(Math.random()*9000+1000);
    req.session.vcode = vcode
    var p = new captchapng(80, 30, vcode); // width,height,numeric captcha
    p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
  
    var img = p.getBase64();
    var imgbase64 = new Buffer(img, "base64");
    res.writeHead(200, {
      "Content-Type": "image/png"
    });
    res.end(imgbase64);
}
// 导出登录的方法
exports.login = (req,res) => {
    // 把浏览器传递过来的验证码 和 req.session.vcode 中的验证码对比
  }