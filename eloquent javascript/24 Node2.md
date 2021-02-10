### Stream

* 可写流 所有可写流都有write方法 可以传入String 或者Buffer
* end() 结束流 end里面参数在结束前被写入 
* 这些方法可以回调

#### 可写流

```javascript
let fs = require('fs')
let writestream = fs.createWriteStream('a.txt')
//同步 创建可写流对象
writestream.write('aaa\n')
//true
writestream.write('bbb\n')
//true
writestream.write('ccc\n')
//true  代表缓冲区还可以写 没有满
writestream.end()
//end 后写入
```

#### 可读流

```javascript
let fs = require('fs')

let rs = fs.createReadStream('./test2/2020-07-17 15-31-03-跨域方式总结：JSONP.mkv')
//.是当前工作目录 __dirname是文件所在目录
rs.on('data', data => {
  console.log(data)
})  //被动接受数据
rs.on('data', data => {
  rs.pause()  //暂停
  rs.resume() //恢复
})
 rs.on('end',()=>{}) //数据读完后触发

console.log(rs.read(5))
//读后序5个字节 从缓冲区删除  数字大于缓冲区 返回null 但是再次读可以读到 增大缓冲区 加入新数据
```

##### 复制文件

```javascript
let fs = require('fs')

console.log(process.pid)

let rs = fs.createReadStream('./test2/2020-07-17 15-31-03-跨域方式总结：JSONP.mkv')
let ws = fs.createWriteStream('copy.mkv')

rs.on('data', data => {
  if (ws.write(data) === false) { //缓冲区占满
    rs.pause()
  }
})

ws.on('drain', () => {  //ws缓冲区用完触发
  rs.resume()
})

rs.on('end', () => { //ws没有数据了
  ws.end()
})

//上面代码相当于
rs.pipe(ws)
```

* 流的两大作用：限制内存占用，协调不同流对象

```javascript
let fs = require('fs')
let zlib = require('zlib')
//创建压缩流
var compressStream = zlib.createGzip()
//双工流 可以写入 可以读出
console.log(compressStream.readableHighWaterMark)

console.log(process.pid)

let rs = fs.createReadStream('./test2/2020-07-17 15-31-03-跨域方式总结：JSONP.mkv')
let ws = fs.createWriteStream('copy.gz')

rs.pipe(compressStream).pipe(ws)
// rs.pipe(compressStream)
// compressStream.pipe(ws)

ReadableStream.prototype.pipe = function (writable) {
  var readable = this
  readable.on('data', data => {
    if (writable.write(data) === false) {
      readable.pause()
    }
  })
  writable.on('drain', () => {
    readable.resume()
  })
  readable.on('end', () => {
    writable.end()
  })
  return writable
}
```

* 抽象为流
  * tcp connection 
  * 加密 crypto    
  * 压缩  zlib
  * 标准输入，输出

#### Stream 的创建于内部机制

* 可读流

```javascript
// let stream = require('stream')
let { Readable, Writable, Duplex, Transform } = require('stream')
let i = 0
let myReadable = new Readable({
  highWaterMark: 65536,    //缓冲区水位标记
  read() { //外面读数据时 Readable对象就会调用这个read()函数
    console.log('generating data')
    this.push(String(i++).repeat(10))
  }
})


myReadable.on('data', data => {
  console.log(data)
})

//交替执行
```

```bash
$node
myrs = new stream.Readable({
  highWaterMark: 16,    //缓冲区16
  read() {
    console.log('generate data')
    this.push('a' + (Math.random() * 10 | 0))
  }
})
myrs.read(5)
```

![image-20200806213154373](24%20Node2.assets/image-20200806213154373.png)

* 当成异步了 先读没有 返回 null  给缓冲区填满 

![](24%20Node2.assets/image-20200806213235058.png)

* 缓冲区BufferList 双向链表

![image-20200806213347425](24%20Node2.assets/image-20200806213347425.png)

* _read流里填数据的 我们写的  read自带的 读出数据
* read(5) 是读取数据的

![image-20200806213413233](24%20Node2.assets/image-20200806213413233.png)

* 可写流

  ```javascript
  let { Readable, Writable, Duplex, Transform } = require('stream')
  
  let i = 0
  let myReadable = new Readable({
    highWaterMark: 65536,    //缓冲区水位标记
    read(size) {
      console.log('generating data')
      this.push(String(i++).repeat(10))
      //push是同步回调
      //可以用setTimeout(异步)来回调 push数据准备好了
    }
  })
  
  var myWritable = new Writable({
    highWaterMark: 16,
    write(chunk, encoding, cb) { //把chunk(一般是buffer)这一段数据处理完后 encoding编码方式 调用callback
  
    }
  })
  
  myWritable.write('aaa')
  myWritable.end()
  ```

#### 创建流

```javascript
let fs = require('fs')

function createFileReadStream(path) {
  var fd = fs.openSync(path) //fd文件描述符 打开文件
  var pos = 0
  var chunkSize = 128

  return new Readable({
    highWaterMark: 4096,
    read(size) {
      var buf = Buffer.alloc(chunkSize)  //分配一个buffer  //读fd文件 （放入buf 从0开始） 读chunkSize个 从pos开始读
      fs.read(fd, buf, 0, chunkSize, pos, (err, bytesRead, buf) => {  //butesRead 读取的数量
        if (err) {

        } else {
          this.push(buf.slice(0, bytesRead))
        }
      })
      pos += chunkSize
    }
  })
}

function createFileWriteStream(path) {
  return new Writable({
    highWaterMark: 4096, //缓冲区是数组
    write(chunk, encoding, cb) {
      //只考虑成功
      fs.appendFile(path, chunk, cb)
      // fs.appendFile(path, chunk, err => {
      //   if (err) {
      //     console.log(err)
      //   } else {
      //     cb()
      //   }
      // })
    }
  })
}

var myWs = createFileWriteStream('./b.txt')
myWs.write('aaa')
myWs.write('aaa')
myWs.write('aaa')
myWs.write('aaa')
myWs.write('aaa')
myWs.write('aaa')
myWs.end()

var myRs = createFileReadStream('china-city-area-zip.js')
myRs.on('data', data => {
  console.log(data.toString())
})


class MyWritable extends Writable {
  constructor(...args) {
    super(...args)
  }
  _write() {

  }
}
```

```javascript
//服务器
var http = require('http');
http.createServer(function (request, response) { //read write
  response.writeHead(200, { "Content-Type": 'text/plain' })
  request.on('data', function (chunk) {
    response.write(chunk.toString().toUpperCase())
  })
  request.on("end", function () {
    response.end()
  })

  //双工流
  request.pipe(toUpperStream).pipe(response)
}).listen(8000)

//客户端
var http = require('http')
var request = http.request({
  hostname: 'localhost',
  port: 8000,
  method: "POST",
}, function (response) {
  response.on('data', function (chunk) {
    process.stdout.write(chunk.toString()) //显示在黑窗口控制台
  })
})
request.end("Hello server")
```

* 双工流和转换

```javascript
let { Readable, Writable, Duplex, Transform } = require('stream');
//双工流
var myDuplex = new Duplex({
  highWaterMark: 16384,
  read() {
    this.push()
  },
  write(chunk, encoding, cb) {

  }
})
 
//双工流 读写处理一份数据 transform
var myTransform = new Transform({
  transform(chunk, encoding, cb) {
    cb(null, chunk.toString().toUpperCase())
  }
})
```

```bash
$node
upperStream = new stream.Transform({
  transform(chunk, endcoding, cb) {
    cb(null, chunk.toString().toUpperCase())
  }
})
```

```javascript
process.stdout.write('hello world')

process.stdin.on('data', data => { //控制台输入
  console.log(data.toString())
})

```

```javascript
//a.js
setInterval(() => {
  process.stdout.write('hello')
}, 1000)
//b.js
process.stdin.on('data', data => {
  console.log(data.toString())
})

//node a.js|node b.js
```

```javascript
let { Transform } = require('stream');

var myTransform = new Transform({
  transform(chunk, encoding, cb) {
    cb(null, chunk.toString().toUpperCase())
  }
})

process.stdin.pipe(myTransform).pipe(process.stdout)
```

#### 实现简单的nc

```javascript
node test.js www.baidu.com 80
GET / HTTP/1.1

var net = require('net')

var domain = process.argv[2]
var port = process.argv[3]

var conn = net.connect(port, domain, () => {
  process.stdin.pipe(conn).pipe(process.stdout)
})
```

#### 用流写静态文件服务器

> 用fs.createReadStream(targetPath).pipe(res)替换readfile

```javascript
var fs = require('fs')
var path = require('path')
var PORT = 80
var http = require('http')
var lodash = require('lodash')

var baseDir = path.resolve(__dirname, './test2')
//dirname 当前文件所在文件夹名字
//不然在C:\Users\荆纬宸\Desktop\目录下执行 node ./新建文件夹.test.js 就不对了

//安全问题 http://localhost:8080/../../../

var server = http.createServer((req, res) => {
  console.log(req.method, req.url)
  let url = decodeURIComponent(req.url).pathname   //pathname 取?a=1之前
  var targetPath = path.join(baseDir, url) //中文url

  if (!targetPath.startsWith(baseDir)) { //目标地址必须是我们期待的开头
    res.writeHead(403) //forbidden
    res.end('403 fuck you hacker')
    return
  }

  fs.stat(targetPath, (err, stat) => {
    if (err) {//用户乱填地址 会出错
      res.writeHead(400)
      res.end('File Not Found')
    } else {
      if (stat.isFile()) {
        fs.createReadStream(targetPath).pipe(res)
      } else if (stat.isDirectory()) {
        var indexPath = path.join(targetPath, 'index.html')
        fs.stat(indexPath, (err, stat) => {
          if (err) {
            if (!req.url.endsWith('/')) { //文件末尾要有'/' 用户可能不输入
              res.writeHead(301, {       //301 不会跳回
                'Location': req.url + '/'
                //相对网站根目录
              })
              res.end()
              return
            }
            res.writeHead(200, {
              'Content-Type': 'text/html;charset=UTF-8'
            })
            fs.readdir(targetPath, { withFileTypes: true }, (err, entries) => {
              var pageHtml = renderIndexPage(entries, targetPath, url)
              res.write(pageHtml)
              res.end()
            })
          } else {
            res.writeHead(200, {
              'Content-Type': 'text/html;charset=UTF-8'
            })
            fs.createReadStream(indexPath).pipe(res)
          }
        })
      }
    }
  })


})

server.listen(PORT, '127.0.0.1', () => {
  console.log('server listening on port', PORT)
})

var pageTpl = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <h1>Index of <%= url %></h1>
  <table>
    <tbody>
      <% entries.forEach((entry,idx)=>{
        var slash = entry.isDirectory() ? '/' : ''
      %>
        <tr>
          <td><%= filesize(50000000 ) %></td>
          <td><a href="<%= encodeURIComponent(entry.name + slash)%><%= entry.name %><%= slash%></a></td>
        </tr>
     <% }) %>
    </tbody>
  </table>
  <footer>
    <p>Node.js ${process.version} / My <a href="https://github.com/nuibility/server">Nuibility</a> Server Running</p>
  </footer>
</body>
</html>
`
var compiledTpl = lodash.template(pageTpl)
function renderIndexPage(entries, parentDir, url) {
  var filesize = require('filesize')
  return compiledTpl({ entries, parentDir, url, filesize })
}
```

![image-20200808131619078](24%20Node2.assets/image-20200808131619078.png)

#### 文件服务器

> npm i mime

```javascript
let http = require('http')
let fs = require('fs')

let methods = Object.create(null)

http.createServer((req, res) => {
  function respond(code, body, type) {
    if (!type) type = "text/plain";
    res.writeHead(code, { "Content-Type": type })
    if (body && body.pipe) body.pipe(res)
    else resp.end(body)
  }
  if (req.method in methods) {
    methods[req.method](urlToPath(req.url), respond, req)
  } else {
    respond(405, "Method" + req.method + "not allowed.")
  }
}).listen(80)

function urlToPath(url) {
  // let path = url.parse(url).pathname
  //忽略../.. 安全
  let path = new URL(url).pathname
  return "." + decodeURIComponent(path)
}

//npm mime 模块 告诉多种拓展名对应的mimeType

methods.GET = function (path, respond) {
  fs.stat(path, (err, stats) => {
    if (err && err.code == 'ENOENT') {
      respond(404, 'File not found')
    } else if (err) {
      respond(500, error.toString())
    } else if (stats.isDirectory()) {
      fs.readdir(path, { withFileTypes: true }, (err, dirEntries) => {
        if (err) {
          respond(500, error.toString())
        } else {
          respond(200, dirEntries.map(entry => entry.isDirectory() ? entry.name + '/' : entry.name).join('\n'))
        }
      })
    } else {
      respond(200, fs.createReadStream(path), require("mime").getType(path))
    }
  })
}

methods.DELETE = function (path, respond) {
  fs.stat(path, (err, stats) => {
    if (err && err.code == 'ENOENT') {
      respond(204) //删不存在的文件 返回成功
    } else if (err) {
      respond(500, error.toString())
    } else if (stats.isDirectory()) {
      fs.rmdir(path, respondErrorOrNothing(respond)) //递归删除
    } else {
      fs.unlink(path, respondErrorOrNothing(respond))
    }
  })
}

function respondErrorOrNothing(respond) {
  return function (err) {
    if (err) {
      respond(500, err.toString())
    } else {
      respond(204)
    }
  }
}

methods.PUT = function (path, respond, req) {
  let outStream = fs.createWriteStream(path)
  outStream.on('error', err => {
    respond(500, err.toString())
  })
  outStream.on('finish', function () {
    respond(204)
  })
  req.pipe(outStream)
}

//curl http://localhost/file.txt
//curl -X PUT -d hello http://localhost/file.txt
//curl -X DELETE http://localhost/file.txt
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    #upload-label {
      text-decoration: underline;
      color: blue;
      cursor: pointer;
    }

    #upload-label:active {
      color: red;
    }
  </style>
</head>

<body>
  <input type="text" id="path" value="/">
  <button id="open">打开</button>
  <label id="upload-label">上传<input hidden type="file" id="upload"></label>
  <div id="list"></div>
</body>
<script>
  let base = 'http://localhost:8000'
  let list = document.querySelector('#list')
  let open = document.querySelector('#open')
  let path = document.querySelector('#path')
  document.addEventListener('DOMContentLoaded', function () {
    openfunc('/')
    open.onclick = () => {
      let pathval = path.value
      openfunc(pathval)
    }
    list.onclick = function (e) {
      if (e.target.matches('a.dir')) {
        e.preventDefault()
        let temp = path.value + this.getAttribute('href')
        path.value = temp
        open(temp)
      }
    }
  })
  function openfunc(path) {
    get(base + path).then(str => {
      list.innerHTML = str.split('\n').map(name => {
        if (name.endsWith('/')) {
          return `<a class="dir" href="${name}">${name}</a><br>`
        } else {
          return `<a class='file' href="${name} download=${name}">${name}</a><br>`
        }
      }).join(' ')
    })
  }
  function get(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.get('GET', url)
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.responseText)
        } else {
          reject(xhr.status)
        }
      }
      xhr.onerror = e => {
        reject(error)
      }
      xhr.send()
    })
  }
</script>

</html>
```

