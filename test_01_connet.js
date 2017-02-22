const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var db = mongoose.connect("mongodb://127.0.0.1:27017/mongoose");
db.connection.on("error", function () {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("数据库连接成功");
});
mongoose.connection.on('disconnected', function () {
    console.log('数据库连接断开');
});