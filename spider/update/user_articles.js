var path = require('path');
var db = require('../models/db.js');

var cheerio = require('cheerio');
var nodegrass = require('nodegrass');

var Entities = require('html-entities').XmlEntities;
entities = new Entities();

var async = require('async');

var targetUrl = 'http://www.jianshu.com';

db.queryArticlesLists(function(data) {
    var dataLists = data;
    var userLists = [];
    // eachSeries
    async.each(dataLists, function(each_data, callback) {
      var userList = {}
      var a_id = each_data['a_id']

      nodegrass.get(targetUrl + each_data['userLink'], function(data,status,headers){
           var $ = cheerio.load(data);
           userList['imgSrc'] = $('.person').find('.avatar>img').attr('src')
           userList['nickname'] = $('.person').find('a.name').text()
           userList['authorTag'] = $('.person').find('span.author-tag').text()
           userList['description'] = $('.description').find('.js-intro').text()
           var metaBlock = $('.person').find('.meta-block p').text()

           userList['focus'] = metaBlock[0]
           userList['fans'] = metaBlock[1]
           userList['articles'] = metaBlock[2]
           userList['words'] = metaBlock[3]
           userList['likes'] = metaBlock[4]
           userList['a_id'] = a_id

           userLists.push(userList)

           callback()

        },'utf-8').on('error', function(e) {
            console.log("User got error: " + e.message);
        });

    }, function(err) {

       async.each(userLists, function(each_data, callback) {
          db.addUser(each_data, function(data) {
            console.log(data)
          })
          callback()
        }, function(err) {
           console.log('<!--------------------插入成功----------------------------->')
        })

    })
 })

db.queryArticlesLists(function(data) {
    var dataLists = data;
    var contentLists = [];

    async.each(dataLists, function(each_data, callback) {
      var contentList = {}

      var nickname = each_data['nickname']
      var r_id = each_data['r_id']
      var a_id = each_data['a_id']

      nodegrass.get(targetUrl + each_data['articleLink'] , function(data,status,headers){
        var $ = cheerio.load(data);
        if(!$('.show-content').html()) return
        contentList['content'] = entities.decode($('.show-content').html());
        contentList['publishTime'] = $('.publish-time').text();
        contentList['wordage'] = $('.wordage').text();
        contentList['nickname'] = nickname;
        contentList['r_id'] = r_id;
        contentList['a_id'] = a_id;

        contentLists.push(contentList)

        callback()
      
      },'utf-8').on('error', function(e) {
            console.log("User got error: " + e.message);
      });
        
    }, function(err) {

       async.each(contentLists, function(each_data, callback) {
          db.addArticles(each_data, function(data) {
            console.log(data)
          })
          callback()
        }, function(err) {
           console.log('<!--------------------插入成功----------------------------->')
        })

    })
 })