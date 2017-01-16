var path = require('path');
var db = require('../models/db.js');

var cheerio = require('cheerio');
var nodegrass = require('nodegrass');

var Entities = require('html-entities').XmlEntities;
entities = new Entities();

var targetUrl = 'http://www.jianshu.com';

nodegrass.get(targetUrl,function(data,status,headers){

      var $ = cheerio.load(data); 
      $('#list-container li').each(function (idx, element) {
        var list = {}
      	list['imgSrc'] = $(element).find('.avatar>img').attr('src')
        list['nickname'] = $(element).find('a.blue-link').text()
      	list['time'] = $(element).find('span.time').attr("data-shared-at")
        list['title'] = $(element).find('.title').text()
        list['contentTag'] = $(element).find('.collection-tag').text()
        list['articleLink'] = $(element).find('.title').attr('href')
        list['userLink'] = $(element).find('.avatar').attr('href')
        var r_id = list['articleLink'].split('/')
        var a_id = list['userLink'].split('/')
        list['r_id'] = r_id[r_id.length - 1]
        list['a_id'] = a_id[a_id.length - 1]

        db.addLists(list, function(data) {
          console.log(data)
        })

        //console.log(list)
      });
      
 },'utf-8').on('error', function(e) {
    console.log("Got error: " + e.message);
 });