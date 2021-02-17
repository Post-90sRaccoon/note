# Express

* Node HTTP 服务器框架

* 原始的拆分方法

```javascript
let http = require('http')

var methods = {
  GET() {

  },
  POST() {

  },
  DELETE() {

  },
  PUT() {

  },
}

function commonLogic(req, res) {

}

var server = http.createServer()
commonLogic(req, res)
server.on('request', (req, res) => {
  console.log(req.method, req.url)
  if (req.method in methods) {
    methods[req.method](req, res)
  } else {
    res.end('method not support')
  }
})

server.listen(8000, () => {

})
```

```javascript
//npm i express
const express = require('express')
const server = express()

//中间件 middleware 执行某种操作的中间的一个步骤
//use 路径开头即可 get post必须完整匹配

//经历每一个中间件函数 前面两个参数req res 都一样
server.use((req, res, next) => {
  console.log(req.method, req.url)
  next()//会让下一个函数运行
})

server.use((req, res, next) => {
  if (req.method == 'GET' || req.method == 'POST') {
    next()
  } else {
    res.end('Method Not Allowed')
  }
})
```

```javascript
server.use((req, res, next) => {
  if (req.method == 'GET') {
    //xxxx
    next()
  } else {
    next()
  }
})

server.get((req, res, next) => {
  //xxxx
  next()
})

server.post((req, res, next) => {
  //xxxx
  next()
})

```

```javascript

server.get('/foo', (req, res, next) => {
  //xxxx  请求指定路径才进来
  next()
})

//一次写两个两个中间件
server.post('/foo', (req, res, next) => {
  //xxxx  请求指定路径才进来
  next()
}, (req, res, next) => {

})
//相当于
server.post('/foo', (req, res, next) => {
  //xxxx  请求指定路径才进来
  next()
})
server.post('/foo', (req, res, next) => {
  //xxxx  请求指定路径才进来
  next()
})
```

```javascript
const express = require('express')
const server = express()

server.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

server.use((req, res, next) => {
  if (req.method == 'GET' || req.method == 'POST') {
    next()
  } else {
    res.end('Method Not Allowed')
  }
})

server.use((req, res, next) => {
  let body = ''
  req.on('data', data => {
    body += data.toString()
  })
  req.on('end', () => {
    req.body = body
    next() //必须在这里调用
  })
})

server.use((req, res, next) => {
  res.write('you are visiting ' + req.url + '\nusing ' + req.method)
  res.write('\nyour request body is ')
  res.end(req.body)
})


server.listen(8000, '127.0.0.1', () => {
  console.log('listening on port', 8000)
})
```

![image-20200813172039092](27%20express.assets/image-20200813172039092.png)

```javascript
server.use((req, res, next) => {
  res.jsonp({ a: 1, b: 2 })
  res.download('./express-server.js')
})

//http://127.0.0.1:8000/foo/bar?callback=foo   
//callback 告诉服务器想要的数据的包裹函数名
///**/ typeof foo === 'function' && foo({"a":1,"b":2});
```

```javascript
server.use((req, res, next) => {//express.Requst express.Response
  res.sendfile('./foo.html') //发回一个文件
  res.json({ a: 1, b: 2 })
  res.jsonp({ a: 1, b: 2 })
  res.redirect()//重定向
  res.render() //模板引擎
  res.send()   //发送各种各样
  res.sendStatus //发送一个状态
  res.download('./express-server.js')
})
```

```javascript
function logOriginalUrl(req, res, next) {
  console.log('Request URL:', req.url)
  next()
}
function logMethod(req, res, next) {
  console.log('Request Type:', req.method)
  next()
}

var logStuff = [logOriginalUrl, logMethod]

server.get('/user/:id', logStuff, function (req, res, next) {
  res.send('Usre Info')
})

//或者
server.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id)
  next()
}, function (req, res, next) {
  res.send('User Info')
})
```

```javascript
server.all('/', (req, res, next) => { })
//任意方法 请求
// '/'  pathname  第一个/之后到？之前的内容


server.use('/ab?cd',)
//? 可以存在 也可以不存在 +出现一次或多次 * 0次或多次 支持正则

server.get('/question/:id', (req, res, next) => {
  res.type('text/html;charset=UTF-8')
  res.write('您正在浏览问题' + req.params.id)
  res.end()
})
//http://localhost:8000/question/34234554?a=1&b=2
//34234554 起名字叫id 匹配的内容不包括id
//:匹配出来的对象叫做params
//server.use('/qusetion/:id/bar 匹配不了了 
//http://localhost:8000/question/34234554/bar?a=1&b=2 同理 这样也匹配不了

server.get('/question/:qid/answer/:aid', (req, res, next) => {
  res.type('text/html;charset=UTF-8')
  console.log(req.query)
  res.write(`您正在浏览问题${req.params.qid}的第${req.params.aid}号回答`)
  res.end()
})
//http://localhost:8000/question/马保国/answer/牛逼?a=1&b=2#xxx
//{a:1,b:2}
//#的东西就不发往服务器
```

#### Router

```javascript
//一个地址写好几种请求方法
server.route('/foo')
  .get((req, res) => {

  })
  .post((req, res) => {

  })
  .head((req, res) => {
    //只请求响应头 不要响应体
    //HEAD /foo/bar HTTP/1.1
  })
```

```javascript
//http://www.foo.com/wenda/question/110
//http://www.foo.com/wenda/question/111
//http://www.foo.com/wenda/question/110/answer/120

//http://www.foo.com/baike/item/javascriptva
//http://www.foo.com/baike/item/c
//http://www.foo.com/baike/item/linux
//http://www.foo.com/baike/item/windows
```

```javascript
const express = require('express')
const server = express()

let baikeRouter = require('./baike-router')
let wendaRouter = require('./wenda-router')

server.use('/baike', baikeRouter)
server.use('/wenda', wendaRouter)

server.listen(80, '127.0.0.1', () => {
  console.log('You are listenting on port 80')
})

//wenda-router.js
let express = require('express')
let wendaRouter = express.Router()

wendaRouter.get('/question/:id', (req, res, next) => {
  res.type('text/html;charset=UTF-8')
  console.log('wendaRouter loaded success')
  res.end(`你在浏览${req.params.id}号问题`)
})

wendaRouter.get('/question/:qid/answer/:aid', (req, res, next) => {
  res.type('text/html;charset=UTF-8')
  console.log('wendaRouter loaded success')
  res.end(`你在浏览${req.params.qid}号问题的${req.params.aid}号回答`)
})

module.exports = wendaRouter

//baike-router.js
let express = require('express')
let baikeRouter = express.Router()

baikeRouter.get('/item/:id', (req, res, next) => {
  res.type('text/html;charset=UTF-8')
  console.log('baikeRouter load success')
  res.end(`您正在查询${req.params.id}语言`)
})

module.exports = baikeRouter
```

```javascript
server.use((req, res, next) => {
  let body = ''
  req.on('data', data => {
    body += data.toString()
  })
  req.on('end', () => {
    if (req.headers['content-type'] == 'application/json') {
      req.body = JSON.parse(body)
    } else if (req.headers['content-type'] == 'www/x-url-form-urlencoded') {
      req.body = querystring.parse(body)
    }
    next()
  })
})
//根据请求体的不同content-type 解析请求体


server.use(express.json())
//express.json 返回一个中间件 如果请求头说了是json 把请求体当json解析 挂在req.body上
server.use(express.urlencoded({ extended: true }))
//解析请求体是url编码的时候 解析并且挂在body上  true 解析扩展编码
```

```javascript
server.use(express.static(__dirname + '/node_modules'))
//静态文件 找到了就拦截 后面不走了 找不到 往后面走
server.use(express.json()) //返回方法 
server.use(express.urlencoded({ extended: true }))

server.use((req, res, next) => {
  console.log(req.body)
  res.end('hello')
})
//{ foo: { baz: '1', bar: '2' } }
```

```bash
$ curl http://localhost:8000/foo/bar -H 'Content-Type:application/x-www-form-urlencoded' -X POST -d "foo[baz]=1&foo[bar]=2"
```

```javascript
server.use(express.static(__dirname + '/node_modules'))
//静态文件 找到了就拦截 后面不走了 找不到 往后面走
server.use((req, res, next) => {
  console.log(req.body)
  res.end('hello')
})
function json() {
  return (req, res, next) => {
    if (req.headers['content-type'].contains('json')) {//req.is('json')
      var body = ''
      req.on('data', data => {
        body += data.toString()
      })
      req.on('end', () => {
        req.body = JSON.parse(body)
        next()
      })
    } else {
      next()
    }
  }
}

function urlencoded(options) { //参数是一个对象
  return (req, res, next) => {
    if (req.is('urlencoded')) {
      var body = ''
      req.on('data', data => {
        body += data.toString()
      })
      req.on('end', () => {
        if (options.extended) {
          req.body = qs(body)
          //需要require
        } else {
          req.body = querystring(body)
          //需要require
        }
        next()
      })
    } else {
      next()
    }
  }
}

function static(dirPath) {
  return (req, res, next) => {
    let targetPath = path.join(dirPath, req.url)
    // fs.readFile(targetPath,(err,content)=>{
    //   if(err){
    //     next()
    //   }else{
    //     res.end(content)
    //   }
    // })
    fs.stat(targetPath, (err, stat) => {
      if (err) {
        next()
      } else {
        fs.createReadStream(targetPath).pipe(res)//不考虑文件夹 假设只有文件
      }
    })
  }
}
```

* 跨域

```javascript
const cors = require('cors')
server.use(cors( //处理跨域请求
  {
    origin: ['www.mysite1.com', 'www.mysite2.com'],//支持什么网站跨域 *支持全部
    maxAge:86400,
    allowedHeaders:['MKCOL','DELETE','SEARCH'],
    allowedMehtod:['']
  }
))
```

```javascript
server.use(express.static('public'))
//public
//       js     ->  a.js
//       images ->  a.bmp
//       css    ->  a.css
//       hello.html

//http://localhost:8000/css/a.css
//http://localhost:8000/js/a.js
//http://localhost:8000/images/a.bmp

//创建虚拟前缀
server.use('/static', express.static('public'))
//public
//       js     ->  a.js
//       images ->  a.bmp
//       css    ->  a.css
//       hello.html

//http://localhost:8000/static/css/a.css
//http://localhost:8000/static/js/a.js
//http://localhost:8000/static/images/a.bmp

server.use((err,req,res,next)=>{}) //处理错误要四个参数 
```

* application

  ```javascript
  const server = express() //applicatioin 对象
  
  //server.locals //命名空间
  console.dir(server.locals)
  ```

  ```javascript
  const server = express() //applicatioin 对象
  
  
  const server = express()
  var app = express() //main app
  var admin = express() //sub app
  
  admin.get('/',function(req,res){
    console.log(admin.mountpath) //  /admin
    res.end('Admin HomePage')
  })
  
  app.use('/admin',admin) //use 后面接收函数 说明express() 返回一个函数
   //admin被app 挂载到这个路径(/admin)之下
  ```

  

```javascript
//mount事件 sub app 挂载 到 父app 上触发
const admin = express()
admin.on('mount',function(parent){
  console.log('Admin Mounted')
  console.log(parent)  // refer to the parent app
})

admin.get('/',function(req,res){
  res.send('Admin HomePage')
})

app.use('/admin',admin)
```

```javascript
//HTTP 的请求方法
server.all
server.delete
server.get
server.use
server.post
server.put


//除了请求方法get的另外一个get
server.set('foo',8) //set 了server.locals的settings
server.get('foo')


server.disable('trust proxy')
server.enable('trust proxy')
server.get('trust proxy')
//true
server.enabled('trust proxy')
//查看一下是真是假
```

```javascript
typeof server === 'function'

server.listen = function (...args) {
  let f = this
  let httpSever = http.createServer(f)
  httpServer.listen(...args)
}

server.listen(8000, () => { })
```

* app字段

```javascript
case sensitive routing   Boolean   大小写敏感路由
env    'production' 'development'  //开发阶段还是产品阶段
etag   设置响应头
jsonp callback name
json escape  转义
json replacer  JSON.stringify({a:1,b:2},function(key,value){这里},2)
JSON.stringify({ a: 1, b: new Map([[1, 1], [2, 2]]) }, function (key, value) {
  if (value instanceof Map) {
    var obj = {}
    for (var [key, val] of value) {
      obj[key] = val
    }
    return obj
  }
  return value
})
json spaces
query parser   
strict routing  严格模式最后有/和没有/是不同的
subdomain offset
trust proxy
x-powerd-by  由express发回的响应内容中响应头会多 "X-Powered-By:Express" 字段
```

```javascript
server.use('/foo',(res,req,next)=>{}) //可以不写路径
server.get('/foo',(req,res,next)=>{}) //必须写路径
//http://xxx/foo/bar/baz 可以匹配use 不匹配get
```

```javascript
req.range()
//端点续传
GET / xxx.exe HTTP / 1.1
Accept - Range: 100 - 200, 500 - 600 只接受100 - 200字节
```

* res的方法

  ```javascript
  res.headerSent //是否发出响应头
  res.appned()   //增加响应头
  res.attachment() //增加响应头 浏览器触发下载
  
  //GET /foo/bar HTTP/1.1
  //Cookie: a=b; c=d; foo=8; username=damiao
  res.cookie()
  //响应头
  //Set-Cookie:user-8;path=/;expires=2020xxxx;httpOnly;
  //Set-Cookie:age=999
  
  //发送cookie 只发送每个cookie的最前面的
  GET/xxx.exe HTTP/1.1
  Cookies:user-8;age=999
  
  res.format({}) //根据类型（html/json）的不同 返回不同的东西
  res.get() //拿到响应头
  res.links({
    previous: 'http//api.example.com/users?page=1',
    next: 'http//api.example.com/users?page=2',
    last: 'http//api.example.com/users?page=5',
  })
  //页面能翻页 前一页和后一页
  res.location(path)
  //跳转头 
  res.redirect()
  //跳转
  res.send()
  ```

* 模板引擎
```javascript
server.engine('pug', require('pug').__express)
server.engine('html', require('ejs').__express)
//pug模板 可以不写  还有ejs模板

//pugjs npm i pug

server.get('/foo', (req, res, next) => {
  res.render('foo.pug', {
    fruits: ['apple', 'orange', 'google']
  })
  //并不是相对当前文件路径 是server.locals settings 里的views  process.cwd()+'/views'
})
server.locals.pretty = true// 不压缩  c+u
// console.log(server.get('views'))
// C: \Users\荆纬宸\Desktop\新建文件夹\express\views

server.get('/bar', (req, res, next) => {
  res.render('bar.html', {
    fruits: ['apple', 'orange', 'google']
  })
})

//views/bar.html
<ul>
  <% fruits.forEach((it)=> { %>
  <li><%= it %></li>
  <% }) %>
</ul>
<p>hello</p>
                            
//foo.png
ul
  each item in fruits
    li= item

ul
  li 111
  li 222

p hello world


//自己实现模板引擎
server.engine('tpl', function (path, data, cb) {
  console.log(path, data)
  cb(null, '<h1>tpl template xxx</h1>') 
})
server.get('/baz', (req, res, next) => {
  res.render('xxxx.tpl', {
    fruits: ['apple', 'orange', 'google']
  })
})
```

* express的中间件机制
```javascript
const http = require('http')
function express() {
  let middlewares = []
  function expressApp(req, res) {
    let i = 0
    step()
    function step() {
      let middleware = middlewares[i++]
      if (middleware) {
        middleware(req, res, () => { 
         //不能直接写step 每一次接收的next函数不能是同一个 不然乱了
          step()
        })
      }
    }
  }
  expressApp.use = function (middleware) {
    middlewares.push(middleware)
  }
  return expressApp
}

let app = express()

app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})
app.use((req, res, next) => {
  let body = ''
  req.on('data', data => {
    body += data.toString()
  })
  req.on('end', () => {
    req.body = body
    next()
  })
})
app.use((req, res, next) => {
  res.end(`you are visiting ${req.url} using ${req.method},you body is ${req.body}`)
})


http.createServer(app).listen(8080, () => {
  console.log('listening', 8080)
})

// http.createServer((req,res)=>{
// })
```

```javascript
//第二种写法
function f(req, res) {
  a(req, res, () => {
    b(req, res, () => {
      c(req, res, () => {

      })
    })
  })
}
//倒着生成
let midddlewares = [a, b, c, d, e]

// let prevNext = ()=>{}

// for (let i = middlewares.length - 1; i >= 0; i--) {
//   let midddleware = midddlewares[i]
//   let next = prevNext
//   prevNext = () => {
//     middleware(req, res,next)
//   }
// }

function compose(midddlewares) {
  return midddlewares.reduceRight((next, mw) => {
    return (req, res) => { //最后一次的返回值需要接受参数
      mw(req, res, () => {  //不需要接参数
        next(req, res)
      })
    }
  }, () => { })
}

let f = compose([
  (res, req, next) => {
    console.log(req, res)
    setTimeout(next, 2000)
  },
  (res, req, next) => {
    console.log(req, res)
    setTimeout(next, 2000)
  },
  (res, req, next) => {
    console.log(req, res)
    setTimeout(next, 2000)
  }
])

f(1, 2)

function express2(){
  let middlewares = []
  let composed = function(){}

  function expressApp(req,res){
    composed(req,res)
  }

  expressApp.use = function(middleware){
    middlewares.push(middleware)
    composed = composed(middlewares)
  }

  return expressApp
}
```

* 创建express项目

  ```bash
  $npm install -g express-generator
  $express my-website
  ```

  ```javascript
  server.locals.pretty = true
  
  npm init  //创建packge.json
  views //模板
  app.set('views', __dirname + '/views')
  static //前端用的js文件
  
  npm i open //打开浏览器
  npm i pug
  npm i cookie-parser //中间件
  app.use(cookieParser('lkjweoij2o3i409e'))
  
  res.cookie('user', user.name, {
          maxAge: 86400000,
          signed: true,
        })//发cookie 字符串签名
  app.use((req, res, next) => {
    console.log(req.signedCookies)
    next()
  })
  
  .gitignore
  /node_modules/  git提交不提交node_modules
  
  npm i sqlite
  npm i sqlite3 
  
  sqlite.open({
    filename: __dirname + '/bbs.db',
    driver: sqlite3.Database
  }).then(value => {
    db = value
  })
  winpty ./sqlite3.exe bbs.db
  
  npm i multer //解析文件upload请求的中间件
  const uploader = multer({ dest: __dirname + '/uploads/' }) //解析出来的图片无后缀 用fs加格式
  npm i svg-captcha
  
  //刷新验证码 换时间戳
  http://localhost/captcha?t=39838488
  
  //下载别人项目运行
  npm i 即可 会把package.json和lock.json 的依赖全部下载
  //发邮件
  npm i nodemailer
  ```
  
* 保持用户登录状态 给用户下发cookie cookie要签名 防止伪造

#### cookie

POST / login HTTP / 1.1



name = lily & password=123456

\----------------------------

 HTTP / 1.1 200 OK

Set - Cookie: user = lily; Expires = ISO_TIME_STRING; Path = '/';

Set - Cookie: user = lily; Expires = ISO_TIME_STRING;

过期日期 作用路径

\-----------------------------

 GET / HTTP / 1.1

Cookies: user = lily; logedin = true



JS 操作cookie

可以把cookie理解为一个key / val映射对

只不过由于设计太早, 都是以字符串的形式体现的api

设置或增加一个cookie

`document.cookie = "key=val;Expires=Date.toGMTString()"`

获取只能一次性获取所有的映射对

`document.cookie`

用过期删除cookie

`GMT = new Date().toGMTString()`

`document.cookie = "key=;Expires=GMT"`



用http操作cookie

浏览器会主动发送所有的Cookie在Cookies头上面

设置只能用服务器设置

Set-Cookie:a=b httpOnly

httpOnly js读不到

在同一个响应中，Set-Cookie头可以出现多次，一次性设置多个cookie



* ?return_url=
* 提交图片`form(action="/register" method="post" enctype="multipart/form-data")`
* 验证码   http1 get页面  http2 get验证码  http3 post   http3 request需要知道上一个也就是http2 发送过去的验证码
* session会话 和同一个用户会话 如果请求者没有session id 给你个session id  用cookie实现