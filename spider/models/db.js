var mysql = require('mysql');
var $conf = require('./config');

// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);

module.exports = {

  addUser: function (params, callback) {
    pool.getConnection(function(err, connection) {
      connection.query('INSERT INTO user VALUES (null ,?, ?,?,?,?,?,?, ?, ?, ?)', [params.imgSrc,params.nickname,params.authorTag,params.description,params.focus,params.fans, params.articles, params.words, params.likes, params.a_id], function(err, result) {
                if(result) {
                  result = {
                    code: 200,
                    msg:'增加成功 users'
                  };    
                }
                callback(result)
                connection.release();
              });
            });
  },
  addLists: function (params, callback) {
    pool.getConnection(function(err, connection) {
      connection.query('INSERT INTO lists VALUES (null ,?, ?,?,?,?,?,?, ?, ?)', [params.imgSrc,params.nickname,params.time,params.title,params.contentTag,params.articleLink, params.userLink, params.r_id, params.a_id], function(err, result) {
                if(result) {
                  result = {
                    code: 200,
                    msg:'增加成功 lists'
                  };    
                }
                callback(result)
                connection.release();
              });
            });
  },
  addArticles: function (params, callback) {
    pool.getConnection(function(err, connection) {
      connection.query('INSERT INTO articles VALUES (null ,?, ?,?,?, ?, ?)', [params.content,params.publishTime,params.wordage,params.nickname, params.r_id, params.a_id], function(err, result) {
                if(result) {
                  result = {
                    code: 200,
                    msg:'增加成功 articles'
                  };    
                }
                callback(result)
                connection.release();
              });
            });
  },
  
  //暂未用到
  delete: function (id, callback) {
    // delete by Id
    pool.getConnection(function(err, connection) {
      connection.query("DELETE FROM csdn_blog WHERE id= ? ", id, function(err, result) {
        if(result.affectedRows > 0) {
          result = {
            code: 200,
            msg:'删除成功'
          };
        } else {
          result = void 0;
        }
        callback(result)
        connection.release();
      });
    });
  },

  //暂未用到
  update: function (params, callback) {
    var param = [];
    var $sql = 'UPDATE csdn_blog SET '

    if(params.name != null) {
      param.push(params.name)
      $sql += 'name = ? ';
    }
    if(params.password != null)  {
       param.push(params.password)
        if(params.name != null){
        	 $sql += ', password = ? ';
        }else {
        	 $sql += 'password = ? ';
        }
    }

    param.push(params.id)
    $sql += 'WHERE id = ?';
    
    if(params.name == null && params.password == null) {
      var result = {
          code: '-1',
          msg: '更新内容为空'
      }
      callback(result)
      return;
    }
    pool.getConnection(function(err, connection) {
      connection.query($sql, param, function(err, result) {
        
        if(result.affectedRows > 0) {
          result = {
          	  code: 200,
             msg: '更新成功'
          }
        }

        callback(result)
        connection.release();
      });
    });
  },

  queryUserByNickname: function (id,callback) {
    var a_id = id;
    pool.getConnection(function(err, connection) {
      connection.query("select * from user where a_id = ?", a_id, function(err, result) {
        callback(result)
        connection.release();
      });
    });
  },
  queryArticlesLists: function(callback) {
    pool.getConnection(function(err, connection) {
      connection.query("SELECT * FROM lists", function(err, result) {
        callback(result)
        connection.release();
      });
    });
  },
  queryArticlesByRid: function(r_id, callback) {
    var r_id = r_id;
    pool.getConnection(function(err, connection) {
      connection.query("select * from articles where r_id = ?", r_id, function(err, result) {
        callback(result)
        connection.release();
      });
    });
  }
};