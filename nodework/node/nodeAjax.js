//引入内置模块
//创建服务器用的
var http = require('http');
//解析url地址用的
var urlAll = require('url');
//解析和转换对象和字符串
var querystring = require('querystring');
//引入数据 ……
var data = require('../data/data.js');

//创建服务器                             请求  响应
var server = http.createServer(function (req, res) {
  //跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  //设置响应头
  res.writeHead(200, { 'Content-Type': 'text/plain;charset=UTF-8' });

  //只拿到资源路径
  var urlPathName = urlAll.parse(req.url).pathname;

  //如果是/query 说明数据全要
  if (urlPathName == '/query') {
    //返回数据，把对象或者数组格式转成字符串
    res.end(JSON.stringify(data));
  } else if (urlPathName == '/search') {
    //如果是/search说明只要一条数据，至于是什么数据要看参数
    //此处要分辨发送方式到底是get还是post req.method 就可以知道了
    if (req.method == 'GET') {
      //拿到的是get方式传递来的参数
      var urlQuery = urlAll.parse(req.url).query;
      //用querystring解析“参数格式的字符串”为对象
      var searchJson = querystring.parse(urlQuery);
      //筛选出前台传递参数的值，同过id
      var resultData = data.filter(function (v) {
        return v.name == searchJson.name || v.id == searchJson.name;
      });
      //向前台发送数据
      res.end(JSON.stringify(resultData));
    } else if (req.method == 'POST') {
      //创建一个空的变量用于接收碎片
      var str = '';
      //相当于监听了数据来后台的过程，参数为data
      req.on('data', function (data) {
        //使用str拼接碎片
        str += data;
      });
      //监听完成后需要返回的数据
      req.on('end', function () {
        //将接收到的参数变为对象
        var dataJson = querystring.parse(str);
        //筛选出需要的数据
        var resultData = data.filter(function (v) {
          return v.name == dataJson.name;
        })
        //向前台发送数据
        res.end(JSON.stringify(resultData));
      })
    }
  }
})
server.listen(3000, function () {
  console.log('服务器启动')
})
