```javascript
var net = require('net')
var server = net.createServer() //创建tcp服务对象
var port = 5555

server.on('connection', conn => { //客户端连接成功
  console.log(conn.address(), 'comes in') //连接者浏览器写的地址

  conn.on('data', data => {        //连接上发来数据时触发的事件及函数
    console.log(data.toString())   
  })

  conn.write('HTTP/1.1 200 OK\r\n')    //向客户端发送
  conn.write('Content-Type:text/html\r\n')
  conn.write('\r\n')
  conn.write(`<h1>
  it works! ${new Date()}
    <img src="a.jpg" >
  </h1>`)
  conn.end()
})

server.listen(port,'127.0.0.1',() => {  //接收来自本机ip的连接
  console.log('listening on port', port)
})


//客户端 conn = net.connect(5555,'127.0.0.1')
//conn.write('') conn.on('data',data=>console.log(data.toString())) conn.end
```

![image-20200713171346054](14%20HTTP.assets/image-20200713171346054.png)

![image-20200713171401576](14%20HTTP.assets/image-20200713171401576.png)

![image-20200713172017451](14%20HTTP.assets/image-20200713172017451.png)

> nc -l  -p 8800 也能监听

```javascript
var net = require('net')
var server = net.createServer()
var port = 5555

server.on('connection', conn => {
  console.log(conn.address(), 'comes in')

  conn.on('data', data => {
    var d = data.toString()
    var lines = d.split('\r\n')
    var firstLine = lines.shift()
    var firstLinePart = firstLine.split(' ')
    console.log(firstLinePart)

    conn.write('HTTP/1.1 200 OK\r\n')
    conn.write('Content-Type:text/html\r\n')
    conn.write('\r\n')
    conn.write(`<h1>
      you are visiting ${firstLinePart[1]},  use ${firstLinePart[0]} method
      it's now ${new Date()}
      <img src="a.jpg" >
  </h1>`)
    conn.end()
  })
})

server.listen(port, () => {
  console.log('listening on port', port)
})
```

> HTTP/1.1 200 OK    状态码 3xx 跳转 缓存  4xx 请求有问题 5xx  服务器端出了问题
>
> nc www.baidu.com 80 
>
> GET /foo/var HTTP/1.1 

#### 表单提交

* decodeURIComponent   解码

* encodeURIComponent   转义编码

* GET /example/message.html?name=Jean&message=Yes%3F HTTP/1.1   真正的 ?使用%3代替

* 如果是post方法 浏览器发出的请求是这样的

  POST /example/message.html HTTP/1.1

  Host: xxxx.com

  User-Agent: yyyyyy  
  
  
  
   name=lily&message=hello

```javascript
var net = require('net')
var server = net.createServer()
var port = 5555

server.on('connection', conn => {

  conn.on('data', data => {
    var d = data.toString()
    console.log(d)

    conn.write('HTTP/1.1 200 OK\r\n')
    conn.write('Content-Type: text/html\r\n')
    conn.write('\r\n')
    conn.write(`
      <form method='POST' action="">
        Name: <input type="text" name="name">
        Message: <textarea name="msg"></textarea>
        <button>Submit</button>
      </form>
    `)
    conn.end()
  })
})
// action = ""
// 向自己发送post请求
//浏览器network headers
server.listen(port, () => {
  console.log('listening on port', port)
})
```

![image-20200713211252019](14%20HTTP.assets/image-20200713211252019.png)

#### 留言板

> http
>
> 基于tcp的请求响应模型
>
> 协议自身的头部都是文本

> METHOS /foo/bar HTTP/1.1
>
> Host: www. baidu.com
>
> User-Agent: Chrome Windows/xxxxx
>
> Accept-Encoding: gzip, deflate //可接受的编码方式 压缩方式
>
> Accept-Language: zh-CN, en-Us
>
> 
>
> request body

> HTTP/1.1 200 OK
>
> Content-Type: text/html
>
> Location: https://www.jd.com/ //状态码3开头 会跳转到这里
>
> Content-length: 44556 //从<!doctype html> 从这里开始数
>
> Date：
>
> Last-Modified: 

```javascript
console.log(new Date().toISOString())
//2020-07-14T01:19:45.146Z
console.log(new Date().toUTCString())
//Tue, 14 Jul 2020 01:19:45 GMT

navigator.userAgent
//"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
```

> ftp 21
>
> dhcp 67
>
> dns 53
>
> http 80
>
> https 443

```javascript
var net = require('net')
var server = net.createServer()
var port = 80

var msgs = [
  {
    name: 'Lily',
    content: 'hello',
    timestamp: 1594648307592
  },
  {
    name: 'Jim',
    content: 'world',
    timestamp: 1594648907592
  }
]

server.on('connection', conn => {

  conn.on('data', data => {
    var d = data.toString()

    var [headers, body] = d.split('\r\n\r\n')
    var [firstLine, ...lines] = headers.split('\r\n')
    var [method, path] = firstLine.split(' ')

    // console.log(headers + `\r\n`)
    // console.log(body + `\r\n`)
    if (method === 'POST') {
      var msg = parseQueryString(body.replace(/\+/g, '%20'))  //空格的变成的+换成空格
      msg.timestamp = Date.now()
      msgs.push(msg)


			//提交之后以跳转的方式打开页面 这样表单就会用get的方式打开页面
      conn.write('HTTP/1.1 302 Template\r\n')
      conn.write('Location: /\r\n') //挪动到了新地址  /代表根目录  回跳到根目录 用get方式打开页面
      conn.write('\r\n')
      conn.end()
      return  //防止刷新再提交
    }

    conn.write('HTTP/1.1 200 OK\r\n')
    conn.write('Content-Type: text/html; charset=UTF-8\r\n') //挪动到了新地址  /代表根目录  回跳到根目录 用get方式打开页面
    conn.write('\r\n')

    conn.write(`
        <form method='POST' action="">
          Name: <input type="text" name="name">
          Message: <textarea name="content"></textarea>
          <button>Submit</button>
        </form>
        <hr>
        ${
      Array.from(msgs).reverse().map(msg => `
          <div>
            <h3>${msg.name.replace(/</g, '&lt;')} <small>${new Date(msg.timestamp).toString()}</small></h3>
            <p>${msg.content.replace(/</g, '&lt;')}</small></p>
          </div>
        `).join('')
      }
    `)
    conn.end()
  })
})
server.listen(port, () => {
  console.log('listening on port', port)
})

function parseQueryString(str) {
  return str.split('&')
    .reduce((result, pair) => {
      var [key, val] = pair.split('=')
      result[key] = decodeURIComponent(val) //汉字
      return result
    }, {})
}
```

#### xhr对象

* 浏览器通过JS(而不是刷新页面)发送HTTP请求的接口叫做XMLHttpRequest  
* 这个接口允许你把返回的内容按到xml格式来解析

```javascript
xhr = new XMLHttpRequest()
xhr.open('GET', 'https://xieranmaya.github.io/images/cats/cats.json')
xhr.send()
xhr.responseText //响应来的内容
xhr.status
xhr.getAllResponseHeaders()
xhr.getResponseHeader('Content-length')
var cats = JSON.parse(xhr.responseText)
cats


xhr2 = new XMLHttpRequest()
xhr2.open('GET', 'https://xieranmaya.github.io/images/cats/cats.xml')
xhr2.send()
//send()里面是请求体
xhr2.responseXML //解析为xml格式
xhr2.responseXML.querySelector('cat:first-child url').getAttribute('value')




xhr2.open('GET', 'https://xieranmaya.github.io/images/cats/cats.xml',false)
//false send等到响应完全收到返回
xhr = new XMLHttpRequest()
xhr.open('GET', 'https://xieranmaya.github.io/images/cats/cats.json', false)
xhr.setRequestHeader('foo','bar') //foo头的值是bar
console.time('send')
xhr.send() //false时 这个时间不能网页不能交互 类似死循环 true时立即执行完 但是不一定会收到响应
console.timeEnd('send')
console.log(xhr.responseText)
//true时 为了收到响应
// xhr.addEventListener('load', e => {
//   console.log(xhr.responseText)
// })

```

#### xml加载图片

```html
<button>Show Cats!</button>
<script>
  var btn = document.querySelector('button')
  btn.addEventListener('click', e => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://xieranmaya.github.io/images/cats/cats.json')
    xhr.send()

    xhr.onload = function () {
      var cats = JSON.parse(xhr.responseText)
      for (var cat of cats) {
        let img = document.createElement('img')
        img.src = 'https://xieranmaya.github.io/images/cats/' + cat.url
        img.onload = function () {
          document.body.appendChild(img)
        }
      }
    }
  })
</script>
```

#### 	AJAX改表单

> 点击submit  不提交html表单 改为发起ajax请求 成功 自己将新信息加上

```javascript
// 合法xml
// 内容是合法xml
// Content-Type 是application/xml
// AJAX 阿贾客斯
var net = require('net')
var server = net.createServer()
var port = 80

var msgs = [
  {
    name: 'Lily',
    content: 'hello',
    timestamp: 1594648307592
  },
  {
    name: 'Jim',
    content: 'world',
    timestamp: 1594648907592
  }
]

server.on('connection', conn => {

  conn.on('data', data => {
    var d = data.toString()

    var [headers, body] = d.split('\r\n\r\n')
    var [firstLine, ...lines] = headers.split('\r\n')
    var [method, path] = firstLine.split(' ')

    if (method === 'POST') {
      var msg = parseQueryString(body.replace(/\+/g, '%20'))
      msg.timestamp = Date.now()
      msgs.push(msg)



      conn.write('HTTP/1.1 200 OK\r\n')
      conn.write('\r\n')
      conn.end(JSON.stringify(msgs)) //响应出所有的消息 为了让同时提交的消息显示
      return
    }

    conn.write('HTTP/1.1 200 OK\r\n')
    conn.write('Content-Type: text/html; charset=UTF-8\r\n')
    conn.write('\r\n')

    conn.write(`
        <form method='GET' action="">
          Name: <input type="text" name="name">
          Message: <textarea name="content"></textarea>
          <button>Submit</button>
        </form>
        <script>
          var btn = document.querySelector('button')
          var nameInput = document.querySelector('[name="name"]')
          var contentInput = document.querySelector('[name="content"]')

          btn.addEventListener('click',e=>{
            e.preventDefault()
            var xhr = new XMLHttpRequest()
            xhr.open('POST','/')
            xhr.send('name=' + nameInput.value + '&content=' + contentInput.value)

            xhr.onload = function(e){
              if(xhr.status == 200){
                var div = document.createElement('div')
                div.innerHTML = '<h3>' + nameInput.value + '<small>' + new Date() + '</small></h3><p>' + contentInput.value + '</p>'
                document.body.insertBefore(div,document.querySelector('hr').nextSibling)
                nameInput.value =''
                contentInput.value =''
              }
            }
          })

        </script>
        <hr>
        ${
      Array.from(msgs).reverse().map(msg => `
          <div>
            <h3>${msg.name.replace(/</g, '&lt;')} <small>${new Date(msg.timestamp).toString()}</small></h3>
            <p>${msg.content.replace(/</g, '&lt;')}</p>
          </div>
        `).join('')
      }
    `)
    conn.end()
  })
})
server.listen(port, () => {
  console.log('listening on port', port)
})

function parseQueryString(str) {
  return str.split('&')
    .reduce((result, pair) => {
      var [key, val] = pair.split('=')
      result[key] = decodeURIComponent(val)
      return result
    }, {})
}
```

> http sandboxing
>
> 不能跨域请求 origin   第一个/之前的必须完全一样 127.0.0.1:8080 和localhost:8080也不一样 端口号也必须一样 http和https也不一样
>
> Access-Control-Allow-Origin:* //能被跨域请求

#### xhr操作封装 

```javascript
function ajax(method,url,data,callback){
  var xhr = new XMLHttpRequest()
  xhr.open(method,url)
  xhr.addEventListener('load',e=>{
    callback(JSON.parse(xhr.responseText))
  })
  xhr.send(data)
}
function get(url,callback){
  var xhr = new XMLHttpRequest()
  xhr.open('GET',url)
  xhr.addEventListener('load',e=>{
    callback(JSON.parse(xhr.responseText))
  })
  xhr.send()
}
function post(url,data,callback){
  var xhr = new XMLHttpRequest()
  xhr.open('POST',url)
  xhr.addEventListener('load',e=>{
    callback(JSON.parse(xhr.responseText))
  })
  xhr.send(data)
}



function get(url,callback,fail){
  var xhr = new XMLHttpRequest()
  xhr.open('GET',url)
  xhr.addEventListener('load',e=>{
    if(xhr.status<400){        //请求，响应流程正常结束
      callback(JSON.parse(xhr.responseText))
    } else{
      fail(xhr)    //返回状态码 4xx 5xx
    }
  })
  xhr.addEventListener('error',e=>{ //网络完全不通
    fail(new Error('network broken'))
  })
  xhr.send()
}
get('http://www.xxx.com/aa/bb/cc', function (data) {
  console.log(data)
}, function (err) {

})

//错误就给callback传两个参数 正确传一个参数
function get(url,callback){
  var xhr = new XMLHttpRequest()
  xhr.open('GET',url)
  xhr.addEventListener('load',e=>{
    if(xhr.status<400){        //请求，响应流程正常结束
      callback(JSON.parse(xhr.responseText))
    } else{
      callback(null,xhr)    //返回状态码 4xx 5xx
    }
  })
  xhr.addEventListener('error',e=>{
    callback(null,new Error('network broken'))
  })
  xhr.send()
}

get('http://www.xxx.com/aa/bb/cc', function (data, err) {
  if (data === null) {
    出错了
  } else {
    成功了
  }
  console.log(data)
})

function post(url, data, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('POST', url)
  xhr.addEventListener('load', e => {
    callback(JSON.parse(xhr.responseText))
  })
  xhr.send(data)
}

// post('/', 'name=lily&content=helloworld', function (data) {
//   console.log(data.msgs[0].content)
// })


try{
  get()
}catch(e){
  
}
//catch不到错误 get只是把函数泵定 事件的callback xhr的send都是异步 try catch执行完了 他们才执行
```

```javascript
xhr = new XMLHttpRequest()
xhr.open('GET', url.false) //sync 请求发出去没收到响应 send会持续运行

xhr.send() //onload 会在send结束后即刻运行 但此时onload事件还没绑定 所以onload不会运行

xhr.onload = () => {
  console.log(xhr.responseText)
}
```

```javascript
//异步转换成同步 不行
function getSync(url){
  get(url,function(data){
    return data  //getSync执行完后执行 返回给了匿名函数
  })
  //getSync早执行完了 返回undefined
}
var data = getSync('a.txt')

// 同步转异步
var x = Math.sqrt(2)

function sqrtAsync(x, cb) {
  setTimeout(() => {
    cb(Math.sqrt(2))
  })
}

sqrtAsync(2, (value) => {

})
```

### 加载猫片

#### 随缘加载

```html
<button>Show Cats</button>
<script>
  var btn = document.querySelector('button')
  btn.addEventListener('click', e => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://xieranmaya.github.io/images/cats/cats.json')
    xhr.onload = function () {
      var cats = JSON.parse(xhr.responseText)
      for (let cat of cats) {
        let img = document.createElement('img')
        img.src = cat.fullUrl
        img.onload = function () {
          document.body.appendChild(img)
        }
      }
    }
    xhr.send()
  })
</script>
```

#### one by one

```html
<button>Show Cats</button>
<script>
  var btn = document.querySelector('button')
  btn.onclick = function () {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://xieranmaya.github.io/images/cats/cats.json')
    xhr.onload = function () {
      let cats = JSON.parse(xhr.responseText)
      let i = 0

      one()

      function one() {
        getImg(cats[i++].fullUrl, img => {
          document.body.appendChild(img)
          if (i < cats.length) {
            one()
          }
        })
      }

    }
    xhr.send()
  }

  function getImg(url, callback) {
    let img = document.createElement('img')
    img.onload = function () {
      callback(img)
    }
    img.src = url
  }
</script>
```

#### two by two

```html
<button>Show Cats</button>
<script>
  var btn = document.querySelector('button')
  btn.onclick = function () {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://xieranmaya.github.io/images/cats/cats.json')
    xhr.onload = function () {
      let cats = JSON.parse(xhr.responseText)
      let i = 0

      two()

      function two() {
        get2Img(cats[i++].fullUrl, cats[i++].fullUrl, (img1, img2) => {
          document.body.appendChild(img1)
          document.body.appendChild(img2)
          if (i < cats.length) { //偶数张不会出错 奇数张不行
            two()
          }
        })
      }

    }
    xhr.send()
  }


  function get2Img(url1, url2, callback) {
    let img1, img2
    let c = 0
    getImg(url1, img => {
      c++
      img1 = img
      if (c == 2) {
        callback(img1, img2)
      }
    })
    getImg(url2, img => {
      c++
      img2 = img
      if (c == 2) {
        callback(img1, img2)
      }
    })
  }

  function getImg(url, callback) {
    let img = document.createElement('img')
    img.onload = function () {
      callback(img)
    }
    img.src = url
  }
</script>
```

#### 类似百度云下载方式

```html
<button>Show cats</button>
<script>
  let btn = document.querySelector('button')
  btn.onclick = function () {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://xieranmaya.github.io/images/cats/cats.json')
    xhr.onload = function () {
      var cats = JSON.parse(xhr.responseText)
      console.log(cats)
      let i = 0

      for (let i = 0; i < 3; ++i) {
        n()
      }

      function n() {
        getImg(cats[i++].fullUrl, img => {
          document.body.appendChild(img)
          if (i < cats.length) {
            n()
          }
        })
      }

    }

    xhr.send()
  }

  function getImg(url, callback) {
    let img = document.createElement('img')
    img.onload = function () {
      callback(img)
    }
    img.src = url
  }
</script>
```

#### 请求相关的头

* Content - Security - Policy 入口页面有 作用于一个页面 资源不需要这个头
* Referrer - Policy 是否发referrer 或者发什么样的referrer 只发域或者不发