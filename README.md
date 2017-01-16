
## 这个是一个简单的blog系统
## 采用了前后端分离的方式，
## 至于为什么要分离呢？就是为了了解一下这个种开发模式
## 并没有什么高深莫测的理由

## ng文件中为前端页面，负责展示
## spider为后台页面，对数据进行变更
## jianshu.sql 为数据库文件，采用的是mysql数据库

## 前端中使用了gulp bower angularjs1 koa less
## 用了这么多的东西就是为了感受(装逼)一下

## 后台是使用了express 同时使用了爬虫，爬取简书的内容，就爬了前几个blog


后台-启动
-----------------
npm run start 

后台-数据更新
-----------------
npm run lists 
npm run content

前台-启动
-----------------
npm run dev 

前台-清除
-----------------
npm run clean 