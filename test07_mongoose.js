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
/*
Schema ——  一种以文件形式存储的数据库模型骨架，无法直接通往数据库端，
也就是说它不具备对数据库的操作能力，仅仅只是数据库模型在程序片段中的一种表现，
可以说是数据属性模型(传统意义的表结构)，又或着是'集合'的模型骨架。
*/
//代码：集合的数据模型定义,定义了字段名和字段的类型
var PersonSchema = new mongoose.Schema({
    name: {type: String},
    age: {type: Number, default: 0},
    time: {type: Date, default: Date.now},
    email: {type: String, default: ""}
}, {
    collection: 'jihe'
});

/*
Model —— 由Schema构造生成的模型，除了Schema定义的数据库骨架以外，
还具有数据库操作的行为，类似于管理数据库属性、行为的类
*/
//代码：创建model model(集合名称,集合的数据模型)
var Model = db.model("jihe", PersonSchema);

/*
Entity —— 由Model创建的实体，使用save方法保存数据，Model和Entity都有能影响数据库的操作，但Model比Entity更具操作性。
创建一个文档----集合collection
*/
//创建实例方法一
//代码：创建model model(集合名称,集合的数据模型)
var jiheEntity = new Model({
    name: 'tangcaiye',
    age: 7,
    email: '641418330@qq.com'
});
console.log(jiheEntity.age);
console.log(jiheEntity.time);
jiheEntity.save(function (error, doc) {
    if (error) {
        console.log(error);
    } else {
        console.log(doc);
    }
});
//创建实例方法二
//保存
/*Model.create({name:"zhangsan",age:"17"}, function (err,doc) {
    if (err){
        console.log(err);
    }else{
        console.log(doc);
    }
});
//查找 / 更新(默认只更新第一个) / 删除(默认删除全部匹配)
var query = {name:"zhangsan"};
var update = {$set:{age:100}};
Model.find(query, function (err,doc) {
    console.log("查询")
    console.log(doc);//ARRAY
});
Model.update(query,update,{multi:true}, function (error) {
    if (error){
        console.log(error);
    }else {
        console.log("更新成功");
    }
});
var query = {name:"tangcaiye"};
Model.remove(query, function (err) {
    if (err){
        console.log(err);
    }else {
        console.log("删除成功");
    }
});*/

/*
简单查询 —— 属性过滤 find(Conditions,field,callback);
field省略或为Null，则返回所有属性。
 */
//返回只包含name、age两个键的所有记录
//说明：我们只需要把显示的属性设置为大于零的数就可以，当然1是最好理解的，
//_id是默认返回，如果不要显示加上('_id':0)，
//但是，对其他不需要显示的属性且不是_id，如果设置为0会报错。
/*Model.find({},{name:1, age:1, _id:0},function(err,docs){
    console.log(docs)//docs 查询结果集
})
//findOne(查询单条) —— findOne(Conditions,callback);
Model.findOne({ age: 100}, function (err, doc){
    // 查询符合age等于100的第一条数据
    console.log(doc)// doc是查询结果
});
//findById(按ID单条数据)，只接收文档的_id作为参数，返回单个文档 ——  findById(_id, callback);
Model.findById('58a910bf7eff4e17f85f1e18', function (err, doc){
    console.log(doc)//doc 查询结果文档
});*/

/*
高级查询
*/
//大于$gt
/*
Model.find({'age':{'$gt':17}}, function (err,doc) {
    console.log(doc);
});
//小于$lt
Model.find({'age':{'$lt':17}}, function (err,doc) {
    console.log(doc);
});
//不等于$ne
Model.find({'age':{'$ne':100}}, function (err,doc) {
    console.log(doc);
})
//并$or
Model.find({"$or":[{"name":"tangcaiye"},{"age":6}]},function(error,docs){
    //查询name为tangcaiye或age为6的全部文档
});
//是否存在$exists
Model.find({name: {$exists: true}},function(error,docs){
    //查询所有存在name属性的文档
});
Model.find({email: {$exists: false}},function(error,docs){
    //查询所有不存在email属性的文档
});
//限制数量limit
Model.find({},null,{limit:20},function(err,docs){
    console.log(docs);//如果匹配的结果不到20个，则返回匹配数量的结果，也就是说limit函数指定的是上限而非下限。
});
//跳过数量skip
Model.find({},null,{skip:4},function(err,docs){
    //如果查询结果数量中少于4个的话，则不会返回任何结果
    console.log(docs);//skip函数的功能是略过指定数量的匹配结果，返回余下的查询结果
});
//结果排序sort
Model.find({},null,{sort:{age:-1}},function(err,docs){
    //sort函数可以将查询结果数据进行排序操作，该函数的参数是一个或多个键/值对，
    //键代表要排序的键名，值代表排序的方向，1是升序，-1是降序。
    //查询所有数据，并按照age降序顺序返回数据docs
});*/
