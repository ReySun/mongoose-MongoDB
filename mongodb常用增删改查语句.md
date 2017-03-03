---
title: MongoDB常用增删改查语句
date: 2017-02-24 18:59:01
tags:
  - mongodb
categories: mongodb基础
---
## 数据库database
#### 创建及查看库

1. 有则使用这个数据库，没有就创建
``` bash
 use DATABASE_NAME
```

2. 查看当前选择的数据库，默认是test
``` bash
db
```
3. 查看数据库，默认有admin、local和"test"，如果数据库生成但是没有集合（下面会讲）所以此时只有逻辑数据库产生并没有真正意义上的物理数据，这样看不到查询结果
``` bash
show dbs
```
#### 删除库
1. 删除选定的数据库，如果还没有选择任何数据库，然后它会删除默认的 ' test' 数据库，执行成功返回{ "dropped" : DATABASE_NAME, "ok" : 1 }
``` bash
db.dropDatabase()
```

## 集合collection(相当于SQL数据库中的表table)
#### 创建及查看集合
1. 查看集合
``` bash
show collections
```

2. 以下注释只为方便阅读，请勿在命令行使用
``` bash
db.createCollection(name, { //集合的名字
  capped: <Boolean>,        //是否启用集合限制，如果开启需要制定一个限制条件，默认为不启用，这个参数没有实际意义
  autoIndexId: <Boolean>,   //是否使用_id作为索引，默认为使用(true或false)
  size: <number>,           //限制集合使用空间的大小，默认为没有限制,size的优先级比max要高
  max <number>}             //集合中最大条数限制，默认为没有限制
)
```

3. 特殊情况，若没有newdbc集合，会自动创建集合newdbc并插入数据
``` bash
db.newdbc.insert({"name" : "yiibai"})
```

4. 常用方法介绍
- 一般来说，我们创建集合用db.createCollection(name),如：db.createCollection("log"),创建一个名字为log的集合，**没有任何的大小，数量限制，使用_id作为默认索引**；
- 限制集合空间的大小：db.createCollection("log",{size:1024})或db.createCollection("log",{capped:true,size:1024}),创建一个名字为log集合，限制它的空间大小为1M，如果超过1M的大小，则会删除最早的记录；
- 限制集合的最大条数：db.createCollection("log",{max:1024})，创建一个名字为log集合，最大条数为1024条，超过1024再插入数据的话会删除最早的一条记录。这个不能使用capped:true，否则会报错；
- 即限制最大条数有限制使用空间大小：db.createCollection("log",{size:1024,max:1024})或db.createCollection("log",{capped:true,size:1024,max:1024})，限制集合最大使用空间为1M，最大条数为1024条。

#### 删除集合
1. 执行成功返回true，否则将返回 false
``` bash
db.COLLECTION_NAME.drop()
```

## 文档document(相当于SQL数据库中的列column)
#### 增(insert)
1. 单条数据插入
``` bash
db.user.insert({"name":"jack","age":20})
```
2. 批量数据插入采用命令行for循环

#### 删(remove)
1. 不带参数会删除全部数据，且不可恢复，切记！
``` bash
db.user.remove({"name":"joe"})
```

#### 改(update)
1. 整体更新
``` bash
var model = db.user.findOne({"name":"jack"})
model.age=30
db.user.update({"name":"jack"},model)
```
2. 局部更新
- $inc修改器——比如我们做一个在线用户状态记录，每次修改会在原有的基础上自增$inc指定的值，如果“文档”中没有此key，则会创建key
``` bash
db.user.update({"name":"jack"},{$inc:{"age":30}}) //年龄增加30
```
- $set修改器
``` bash
db.user.update({"name":"jack"},{$set:{"age":10}}) //年龄变为10
```
3. upsert操作——如果没有查到，就在数据库里面新增一条，使用起来很简单，将update的第三个参数设为true即可。
4. 批量更新——在mongodb中如果匹配多条，默认的情况下只更新第一条，那么如果我们有需求必须批量更新，那么在mongodb中实现也是很简单的，在update的第四个参数中设为true即可

#### 查(find)
1. 查找key=value的数据
``` bash
db.collection.find({ "key" : value }) 
```
2. key > value
``` bash
db.collection.find({ "key" : { $gt: value } })
```
3. key < value
``` bash
db.collection.find({ "key" : { $lt: value } })
```
4. key >= value
``` bash
db.collection.find({ "key" : { $gte: value } })
```
5. key <= value
``` bash
db.collection.find({ "key" : { $lte: value } })
```
6. value1 < key <value2
``` bash
db.collection.find({ "key" : { $gt: value1 , $lt: value2 } }) 
```
7. key <> value
``` bash
db.collection.find({ "key" : { $ne: value } })
```
8. 取模运算，条件相当于key % 10 == 1 即key除以10余数为1的
``` bash
db.collection.find({ "key" : { $mod : [ 10 , 1 ] } })
```
9. 不属于，条件相当于key的值不属于[ 1, 2, 3 ]中任何一个
``` bash
db.collection.find({ "key" : { $nin: [ 1, 2, 3 ] } }) 
```
10. 属于，条件相当于key等于[ 1, 2, 3 ]中任何一个
``` bash
db.collection.find({ "key" : { $in: [ 1, 2, 3 ] } })
```
11. $size 数量、尺寸，条件相当于key的值的数量是1（key必须是数组，一个值的情况不能算是数量为1的数组）
``` bash
db.collection.find({ "key" : { $size: 1 } })
```
12. $exists 字段存在，true返回存在字段key的数据，false返回不存在字度key的数据
``` bash
db.collection.find({ "key" : { $exists : true|false } }) 
```
13. 正则，类似like；“i”忽略大小写，“m”支持多行.如joe会匹配出来
``` bash
db.collection.find({ "name":/^j/,"name":/e$/ })
```
14. $or或 （注意：MongoDB 1.5.3后版本可用），符合条件a=1的或者符合条件b=2的数据都会查询出来
``` bash
db.collection.find({ $or : [{a : 1}, {b : 2} ] }) 
```
15. 符合条件key=value ，同时符合其他两个条件中任意一个的数据
``` bash
db.collection.find({ "key": value , $or : [{ a : 1 } , { b : 2 }] })  
```
16. 内嵌对象中的值匹配，注意："key.subkey"必须加引号
``` bash
db.collection.find({ "key.subkey" :value })
```
17. 这是一个与其他查询条件组合使用的操作符，不会单独使用。上述查询条件得到的结果集加上$not之后就能获得相反的集合。
``` bash
db.collection.find({ "key": { $not : /^val.val$/i } }) 
```
18. $where中的value,就是我们非常熟悉，非常热爱的js
``` bash
db.collection.find({ $where:function(){return this.name=="joe"} })
```

