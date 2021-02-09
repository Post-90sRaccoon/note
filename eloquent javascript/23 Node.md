* Node里js可以调用的api集合不一样

*  浏览器里：

  * 受同源策略限制

  *  在浏览器沙箱内运行。可以访问浏览器沙箱内功能

  * document.query...

  *  DOM事件

  * DOM操作

  * BOM

    * screen history location navigator

    * 可以读取并与屏幕 浏览器历史记录 当前浏览的页面地址 浏览器本身进行交互

  * ajax

  

*  Node里：

  * 没有同源策略限制

  * 在操作系统的“环境”下运行的。可以访问操作系统所提供的一系列功能

  * 文件系统api

  * 网络api
    * TCP、UDP

    * HTTP

    * DNS

  * 访问系统中的进程并发送信号

  * 开启新的进程和程序

  * 访问数据库

  * 访问部分硬件提供的能力如摄像头，麦克风，usb

  * 读取屏幕





* Node.js 
  * 不是框架 不是库
  * 不是新语言
  * 是一个JS的运行环境
  * 使用了Chrome的v8引擎 性能高 





* 高性能web服务器
  * 前端构建/前端工程化
  * 转义（es6->es5 less/sass->css）
  * 压缩，混淆（把易读的源代码转换成几乎不可读的,最主要手段改变形参名字）
  * 打包（把从入口文件开始的所有使用到的文件打包成一个文件）
  * 爬虫，命令行工具等
  * Electron/NW.JS (VS Code，Atom) //集成了浏览器和Node

> 语言能否开启多线程取决于环境是否提供这样的能力
>
> 我们说js是单线程的，指的是浏览器中的js都在一个单独的线程里执行
>
> ​	同时这个线程还执行布局，绘制，html解析等操作
>
> ​	并不是说浏览器本身是单线程的
>
>  	我们执行的很多异步操作都是在浏览器的其他线程内执行，执行完成后的回调依然在主线程执行
>		
>  	也就是说，异步必然借助多线程实现

* 某些语言单线程实现异步（伪代码）

  ```javascript
  // recv(id)
  var connIds = [3, 5, 232, 445, 3245]  //tcp连接们
  
  while (true) {
    var readyList = select(server, ...connIds)//没有到任何连接的数据 暂停 收到就立刻返回
    for (var item of readyList) {
      var data = recv(itemId)
      process(data)
    }
  }
  ```

  
```javascript
async function f1() {
  var a = await getJSON('a.json')
  var b = await getJSON('b.json')
  var c = await getJSON('c.json')
  var d = await getJSON('d.json')
}
async function f2() {
  var a1 = await getJSON('1.json')
  var a2 = await getJSON('2.json')
  var a3 = await getJSON('3.json')
  var a4 = await getJSON('4.json')
}

f1()
f2()
//async await 协程 穿插执行 不是完全并行 不同于线程
```
### 版本

* 偶数版本 长时间维护版本 lst  current不会加功能

### 命令行

* 命令 tldr 查询命令最简单用法 `npm i -g tldr`       `tldr nc` 
* `node` 变成交互式控制台
  * .help 
  * .exit 退出
  * .break  前面输入错了  放弃前面的
  * .editor  输入方便
  * .save path   把控制台所有输入 存在一个文件
  * .load      加载文件到控制台
  * process  变量
  * process.cwd() 当前工作目录
  * process.chdir(‘c:/’)  改变当前工作目录
  * process.uptime()  当前进程启动时间
  * process.hrtime()
  * process.cpuUsage()
  * process.recourseUsage()
  * process.memoryUsage()
  * process.assert()
  * process.env 环境变量
  * process.title =   给当前窗口赋值   
  * process.pid  当前node的进程
  * process.ppid   parent父进程id  就是窗口的id
  * process.execPath 执行路径
  * debugPort   调试端口

![image-20200803192351046](23%20Node.assets/image-20200803192351046.png)

```bash
node --inspect=9999 hello.js --sdfaslkd --fasd
//读不到inspect 因为他是给node的参数 在process.execArgv
//

node --inspect=9999
process.execArgv
```

#### require 如何找到要加载的文件

```javascript
//hello.js
var foo = require('./foo') //相对于hello.js（当前文件）
console.log(foo)
console.log(process.argv)
// ../父级文件夹  /根目录
// /home/marijn/elife/run.js
// ./world/world.js
// /home/marijn/elife/world/world.js

//foo.js
module.exports = 'foo'
```

![image-20200803201748858](23%20Node.assets/image-20200803201748858.png)

* 当require路径不像相对路径或绝对路径时，require就会认为它指向一个内置模块，一个安装在node_modules 文件夹里的模块 

### 调试

* vscode调试
* chrome
  ```bash
  node --inspect-brk=9229 hello.js
  brk 停在代码第一行
```
  
  > 浏览器地址 chrome://inspect configure 写端口

![image-20200803203506311](23%20Node.assets/image-20200803203506311.png)

```javascript
debugger
var foo = require('./foo')
var efile = require('elife')
//优先找缓存
//找内置模块(’fs‘，’http‘) 
//找路径 ('./')('../')('/')('C:/foo')  找方法同第三方
//第三方去node_modules找
//C:\Users\荆纬宸\Desktop\新建文件夹\node_modules\  
//（当前文件夹hello.js的路径 的node_modules）
//1.elife.js 2.elife.json  3.解析elife\package.json 找main字段(这个路径相对于package.json) ...\elife\[main]  都不是进去找 elife\index.js
// C:\Users\荆纬宸\Desktop\mode_modules\elife
//依次向上找
console.log(foo)
console.log(process.argv)

require('elife/foo')
//定位node_modules里面的elife文件夹 然后再按照上面的规则对foo
require('lodash/chunk.js')
```

```javascript
var isPrime = function (n) {
  if (n < 2) {
    return false
  }
  if (n == 2 || n == 3) {
    return true
  }

  if (n % 2 == 0) {
    return false
  }
  if (n % 6 !== 5 && n % 6 !== 1) {
    return false
  }

  let sqrt_n = Math.sqrt(n)

  for (let i = 3; i <= sqrt_n; i += 2) {
    if (n % i == 0) {
      return false
    }
  }
  return true
}

var countPrimes = function (n) {
  let result = []
  let temp = n
  for (let i = 2; i <= temp; i++) {
    if (isPrime(i)) {
      if (temp % i == 0) {
        result.push(i)
        temp = temp / i
        i--
      }
    }
  }
  return result
}

let result = []
let n = process.argv[2]
let primes = countPrimes(n)
console.log(process.argv[2] + ': ' + primes.join(' '))
```

* shebang   linux 系统里 	文件名factor 不需要后缀
  * 终端输入 chmod +x factor   
  * 文件头 \#!/usr/local/bin/node （#!加上which node 的路径加上/node）
  * 终端 ./factor 100

```bash
$npm install figlet
$npm install lodash
$npm i -g cnpm //不cpm直接把npm 换源
```

#### figlet

```javascript
var figlet = require('figlet')
var bigHelloWorld = figlet.textSync('Hello world', { font: 'Ghost' })
console.log(bigHelloWorld)

function figletTextPromise(text, options) {
  return new Promise((resolve, reject) => {
    figlet.text(text, options, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

async function foo() {
  var text = await figletTextPromise('Foo Bar', { font: 'Efti Italic' })
  console.log(text)
}
foo()
```

#### 读取文件模块

```javascript
var fs = require('fs')

fs.readFile('hello.js', 'utf8', (err, result) => {  //如果要buffer就不传utf-8
  if (err) {
    console.log(err)
  } else {
    console.log(result)
  }
})

fs.writeFile('a.txt', 'hello world', err => {
  if (err) {
    console.log(err)
  } else {
    console.log('ok')
  }
})

console.log(fs.readdirSync('.'))
//当前工作目录所有文件
console.log(fs.stat('hello.js', (err, stat) => {
  console.log(stat)
})
)
  //status 里有mode mode.toString(2) bash里用ll查看
  // -rw-r--r
  // drwxr-r--r
  // 第一个是d表示是文件夹 第一个是‘-’表示文件   rw表示可读可写 -r可执行
  //最后9位 110 110 110  可读可写不可执行 3组是超级用户 当前用户 用户组的权限


//bash
//mkdir test2

fs.renameSync('foo.js','test2/foo.js')
  //相当于剪切
  fs.renameSync('test2/foo.js','foo333.js')
  //链式存储断开 没有删除 所以文件删除可以恢复
```

```javascript
var util = require('util')
var fs = require('fs')


function readFileP(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

function writeFileP(...args) {
  return new Promise((resolve, reject) => {
    fs.writeFile(...args, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}


function readdirP(...args) {
  return new Promise((resolve, reject) => {
    fs.readdir(...args, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

//util模块 里两个函数 promisify callbackify
//把一个回调函数promise化
function promisify(f) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      f(...args, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}
readFileP = util.promisify(fs.readFile)
readdirP = util.promisify(fs.readdir)
writeFileP = util.promisify(fs.writeFile)

//将基于promise的函数f转换为一个基于回调的函数
function callbackify(f) {
  return function (...args) {
    var cb = args.pop() //最后一个参数是回调函数
    f(...args).then(result => {
      cb(null, result)
    }, reason => {
      cb(reason)
    })
  }
}
```

```javascript
var fsp = require('fs').promises  //用的是promise版本
var util = require('util')

async function main() {
  var content = await fsp.readFile('hello.js')
}

fs.readFile('hello.js').then(content => {
  console.log(content)
})
```

![image-20200804162731793](23%20Node.assets/image-20200804162731793.png)

```javascript
let fs = require('fs')
fs.fchmod(fd, mode, callback)
//整数描述一个文件 fd：文件描述符    这个方法改变文件权限
fs.open('a.txt', 'wr', callback(err,fd))
//以读写模式打开文件 分配新的文件描述符
fs.read()
fs.write()
fs.watchFile() //监听内容的变化 用于保存
fs.symlink()
// 文件占一定内存 文件信息占一片内存指向文件 硬链接是另取一片内存 写入文件信息 指向同一个文件
// 软连接是指向上一个文件信息 被指向的文件信息被删除 就无法访问了
fs.statSync('a.txt') //里面有nlink 表示这个文件被几个文件信息指向
```

#### Path

```javascript
const path = require('path')

path.basename('/foo/bar/a.png')
//'a.png'
path.basename('/foo/bar/a.png?a=1&b=2/')
//a.png?a=1&b=2
path.basename('/foo/bar/a.png', '.png')
//'a' 第二个参数如果是结果的最后，截断
path.delimiter
//':'  路径分隔符
path.dirname('/foo/bar/a.png')
// '/foo/bar' 文件夹名
path.extname('/foo/bar/a.png')
// '.png'
path.isAbsolute('./foo')
//false
path.isAbsolute('/foo')
path.isAbsolute('c:/foo')
//true true 绝对路径
path.isAbsolute('c:\\foo')
//true linux环境下会false
path.join('foo/', '/bar/', '../baz')
//   foo/baz 可以接相对路径 可以化简 把重复的/ 或缺失的/ 拼接成正确路径
path.normalize('foo/bar/abz/a/../.././../aabbc')
// foo/aabbc
path.relative('/foo/bar', '/foo/baz/baa')
// 算出两个路径间的相对值
// '../baz/baa'
// '/foo/bar'+'../baz/baa' = /foo/baz/baa
```

#### path.join and path.resolve

```javascript
//resolve 把/作为根目录
path.resolve('/b')
//'C:\\b'
path.resolve('b')
//'C:\\Users\\荆纬宸\\Desktop\\今日\\start\\b'
//resolve在传入非/路径时，会自动加上当前目录形成一个绝对路径，而join仅仅用于路径拼接

path.join('a/b','c')
//'a\\b\\c'
path.join('a/b','/c')
// 'a\\b\\c'
path.join('a/b/','/c')
// 'a\\b\\c'
path.join('a/b/','c')
// 'a\\b\\c'
path.join('/a/b/','c')
//'\\a\\b\\c'



console.log(path.join('foo/', '/bar/', '../baz', 'hehe'))
//foo\baz\hehe
 path.resolve('foo/')
// 'C:\\Users\\荆纬宸\\Desktop\\今日\\start\\foo'
 path.resolve('foo/', '/bar/')
// 'C:\\bar'  前面非/路径 遇见第一个/路径 归根目录 
 path.resolve('foo/', '/bar/baz/', '../bam', 'hehe')
// 'C:\\bar\\bam\\hehe'


path.parse('/foo/bar/baz/aaa.png')
// {
//   root: '/',
//   dir: '/foo/bar/baz',
//   base: 'aaa.png',
//   ext: '.png',
//   name: 'aaa'
// }
let a = path.parse('/foo/bar/baz/aaa.png')
path.format(path.parse('/foo/bar/a.png'))
//'/foo/bar\\a.png'
path.format(path.parse('/foo/bar/../a.png'))
//'/foo/bar/..\\a.png'
//parse分割也带着.. 不会合并
```

```javascript
url.parse('http://www.baidu.com:8800/foo/baz.html?foo=1&bar=2&baz=3#ccdde')
Url {
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'www.baidu.com:8800',
  port: '8800',
  hostname: 'www.baidu.com',
  hash: '#ccdde',
  search: '?foo=1&bar=2&baz=3',
  query: 'foo=1&bar=2&baz=3',
  pathname: '/foo/baz.html',
  path: '/foo/baz.html?foo=1&bar=2&baz=3',
  href: 'http://www.baidu.com:8800/foo/baz.html?foo=1&bar=2&baz=3#ccdde'
}

//auth 
url.parse('ftp:/ /user:pass@www.baidu.com:8800/foo/baz.html?foo=1&bar=2&baz=3#c
cdde')
Url {
  protocol: 'ftp:',
  slashes: true,
  auth: 'user:pass',
  host: 'www.baidu.com:8800',
  port: '8800',
  hostname: 'www.baidu.com',
  hash: '#ccdde',
  search: '?foo=1&bar=2&baz=3',
  query: 'foo=1&bar=2&baz=3',
  pathname: '/foo/baz.html',
  path: '/foo/baz.html?foo=1&bar=2&baz=3',
  href: 'ftp://user:pass@www.baidu.com:8800/foo/baz.html?foo=1&bar=2&baz=3#ccdde
'
}

//query 解析为对象
url.parse('ftp://user:pass@www.baidu.com:8800/foo/baz.html?foo=1&bar=2&baz=3#c
cdde',true)
Url {
  protocol: 'ftp:',
  slashes: true,
  auth: 'user:pass',
  host: 'www.baidu.com:8800',
  port: '8800',
  hostname: 'www.baidu.com',
  hash: '#ccdde',
  search: '?foo=1&bar=2&baz=3',
  query: [Object: null prototype] { foo: '1', bar: '2', baz: '3' },
  pathname: '/foo/baz.html',
  path: '/foo/baz.html?foo=1&bar=2&baz=3',
  href: 'ftp://user:pass@www.baidu.com:8800/foo/baz.html?foo=1&bar=2&baz=3#ccdde
'
}

myurl =new url.URL('https://a:b@github.com:4433/foo/bar.html?a=1&b=2#foiwef')
URL {
  href: 'https://a:b@github.com:4433/foo/bar.html?a=1&b=2#foiwef',
  origin: 'https://github.com:4433',
  protocol: 'https:',
  username: 'a',
  password: 'b',
  host: 'github.com:4433',
  hostname: 'github.com',
  port: '4433',
  pathname: '/foo/bar.html',
  search: '?a=1&b=2',
  searchParams: URLSearchParams { 'a' => '1', 'b' => '2' }, //不是对象 类似map
  hash: '#foiwef'
}

myurl.searchParams.append('c', 333)
myurl.toString()

url.resolve('http://www.baidu.com/foo/bar/baz','../images/static/bg.png')
//'http://www.baidu.com/foo/images/static/bg.png'
//在参数一路径 访问参数二 访问的地址是
```

#### querystring 模块

```javascript
querystring.parse('foo=1&bar=2')
//[Object: null prototype] { foo: '1', bar: '2' }
querystring.parse('foo=1; bar=2; baz=3','; ') //设定分隔符
//[Object: null prototype] { foo: '1', bar: '2', baz: '3' }
querystring.parse('foo:1, bar:2, baz:3',', ',':')
//[Object: null prototype] { foo: '1', bar: '2', baz: '3' }

querystring.parse('foo:1, bar:2, baz:%e6%88%91',', ',':') //:是key和value分隔符
//[Object: null prototype] { foo: '1', bar: '2', baz: '我' }
//默认解码

querystring.escape     //编码
querystring.unescape 	 //解码

 querystring.stringify({a:1,b:2})
'a=1&b=2'
querystring.stringify({a:1,b:2},',',':')
'a:1,b:2'

//npm i qs
qs = require('qs')

qs.parse('foo[bar]=8')
//{ foo: { bar: '8' } }
 qs.parse('foo[bar]=8&foo[baz]=9')
{ foo: { bar: '8', baz: '9' } } 
//拓展url编码
```

#### OS模块

```javascript
os.uptime()/86400
//0.5070601851851851 系统启动天数
os.EOL
//'\r\n' 换行符
os.signals 
//给进程发信号

os.version()
os.userInfo()

os.type()
//'Windows_NT'
os.totalmem()
//17054289920  内存
os.networkInterfaces()
//网卡信息
os.hostname() //计算机名
os.cpus()
os.freemem()
//可用内存

 os.endianness()
//'LE'
//little ended 内存编号小是末尾 每一部分倒着存

 os.loadavg()
//[ 0, 0, 0 ]
//平均负载 最高 平均 最低
```

![image-20200804200022158](23%20Node.assets/image-20200804200022158.png)

#### modules 模块

* 后缀名改为mjs 可以用import
* 后缀js type字段要加module

#### Global模块

* node中的timer与unref

```javascript
id = setTimeout(()=>console.log(1),5000)
//Timeout {
// _idleTimeout: 5000,
// _idlePrev: [TimersList],
// _idleNext: [TimersList],
// _idleStart: 1331849,
// _onTimeout: [Function(anonymous)],
// _timerArgs: undefined,
// _repeat: null,
// _destroyed: false,
// [Symbol(refed)]: true,
// [Symbol(asyncId)]: 709,
// [Symbol(triggerId)]: 5
// }
//返回Timeout 对象

clearTimeout(id)



var net = require('net')
var count = 0
var id = setInterval(() => {
  console.log(count)
}, 1000)
//server 关闭 count还是照样输出

id.unref() 
//只剩下timer id运行 就直接退出

setTimeout(() => {
  server.close()
}, 10000)
var server = net.createServer(conn => {
  count++
  console.log('some one coms...')
})
server.listen(9090, () => {
  console.log('listening on port', 9090)
})
```
#### 作业

* common

```javascript
let fs = require('fs')
let fsp = fs.promises
let path = require('path')
```

* 同步版本

  ```javascript
  function listFiles(dirPath) {
    var result = []
    var fullDirPath = path.resolve(dirPath) //相对路径 会相对于工作目录变成绝对路径
    // var fullDirPath = path.join(process.cwd(),dirPath)
    var fileNames = fs.readdirSync(fullDirPath)
    for (var fileName of fileNames) {
      var fullName = path.join(fullDirPath, fileName)
      var stat = fs.statSync(fullName)
      if (stat.isFile()) {
        result.push(fullName)
      } else if (stat.isDirectory()) {
        result.push(...listFiles(fullName))
      }
    }
    return result
  }
  function listFiles2(dirPath) {
    var result = []
    var fullDirPath = path.resolve(dirPath)
    var fileInfos = fs.readdirSync(fullDirPath, { withFileTypes: true })
    for (var fileInfo of fileInfos) {
      var fullName = path.join(fullDirPath, fileInfo.name)
      if (fileInfo.isFile()) {
        result.push(fullName)
      } else if (fileInfo.isDirectory()) {
        result.push(...listFiles2(fullName))
      }
    }
    return result
  }
  var files = listFiles2('./test2')
  console.log(files)
  ```

* 异步回调

```javascript
function listFilesCB(dirPath, cb) {
  let result = []
  let count = 0
  let workPath = path.resolve(dirPath)
  fs.readdir(workPath, (err, names) => {
    if (err) {
      cb(err)
      return
    }
    if (names.length == 0) {
      cb(null, [])    //如果文件夹里没有文件 cb告诉外层函数执行完了 push[...files] flies为空
    }
    for (let name of names) {
      let filePath = path.join(workPath, name)
      fs.stat(filePath, (err, stat) => {
        if (err) {
      		cb(err)
      		return
    		}
        if (stat.isFile()) {
          result.push(filePath)
          count++
          if (count == names.length) {
            cb(null, result)//忽略错误 这里调用 给files传入的是result
          }
        } else if (stat.isDirectory()) {
          listFilesCB(filePath, (err, files) => { //回调这里定义 调用时文件夹里所有文件都在result里了
            result.push(...files)
            count++
            if (count == names.length)
              cb(null, result)
          })
        }
      })
    }
  })
}

listFilesCB('./test2', (err, files) => {
  if(err){
    console.log(err)
  }
  console.log(files)
})


function listFilesCB2(dirpath, cb) {
  let count = 0
  let result = []
  let workpath = path.resolve(dirpath)
  fs.readdir(workpath, { withFileTypes: true }, (err, infos) => {
    if (err) {
      cb(err)
    } else if (infos.length == 0) {
      cb(null, result)
    } else {
      for (let info of infos) {
        let fileName = path.join(workpath, info.name)
        if (info.isFile()) {
          result.push(fileName)
          count++
          if (count == infos.length) {
            cb(null, result)
          }
        } else if (info.isDirectory()) {
          listFiles(fileName, (err, innerfiles) => {
            if (err) {
              cb(err)
            } else {
              result.push(...innerfiles)
              count++
              if (count == infos.length) {
                cb(null, result)
              }
            }
          })
        }
      }
    }
  })
}

listFilesCB2('vue', (err, result) => {
  if (err) {
    console.log('ERROR', err)
  } else {
    console.log(result)
  }
})
```

* promise版本

  ```javascript
  function listFilesP(dirPath, cb) {
    let fullDirPath = path.resolve(dirPath)
    var fullNames
    return fsp.readdir(fullDirPath)
      .then(names => {
        fullNames = names.map(it => path.join(fullDirPath, it))
        return Promise.all(fullNames.map(fsp.stat))
      })
      .then(infos => {
        var ary = infos.map((info, i) => {
          if (info.isFile()) {
            return fullNames[i]
          } else if (info.isDirectory()) {
            return listFilesP(fullNames[i])
          }
        })
        return Promise.all(ary)
      })
      .then(filesArr => {
        return [].concat(...filesArr)
      })
  }
  listFilesP('./test2').then(files => {
    console.log(files)
  }).catch(e => {
    console.log(e)
  })
  
  
  function listFilesP2(dirPath, cb) {
    let fullDirPath = path.resolve(dirPath)
    return fsp.readdir(fullDirPath, { withFileTypes: true })
      .then(infos => {
        var ary = infos.map(info => {
          if (info.isFile()) {
            return path.join(fullDirPath, info.name)
          } else if (info.isDirectory()) {
            return listFilesP2(path.join(fullDirPath, info.name))
          }
        })
        return Promise.all(ary)
      })
      .then(filesArr => {
        return [].concat(...filesArr)
      })
  }
  listFilesP2('./test2').then(files => {
    console.log(files)
  }).catch(e => {
    console.log(e)
  })
  ```

* async 版本

```javascript
async function listFilesA(dirPath) {
  let result = []
  var fullDirPath = path.resolve(dirPath)
  var fileNames = await fsp.readdir(fullDirPath)
  for (var fileName of fileNames) {
    var fullName = path.join(fullDirPath, fileName)
    var stat = await fsp.stat(fullName)
    if (stat.isFile()) {
      result.push(fullName)
    } else if (stat.isDirectory()) {
      result.push(...await listFilesA(fullName))
    }
  }
  return result
}

async function a() {
  let result = await listFilesA('./test2')
  console.log(result)
}
a()

async function listFilesA(dirPath) {
  var result = []
  var fullDirPath = path.resolve(dirPath)
  var fileNames = await fsp.readdir(fullDirPath)
  //fsp.readdir Promise({x.txt,a.png....})
  //fullNames [x.txt,a.png....]
  var fullNames = fileNames.map(fileName => path.join(fullDirPath, fileName))
  var statPromises = fullNames.map(fsp.stat)

  for (var i in statPromises) {
    var statPromise = statPromises[i]
    var fullName = fullNames[i]

    var stat = await statPromise
    if (stat.isFile()) {
      result.push(fullName)
    } else if (stat.isDirectory()) {
      result.push(...(await listFilesA(fullName)))
    }
  }
  return result
}
listFilesA('./test2').then(result => {
  console.log(result)
}).catch(e => {
  console.log(e)
})
```

```javascript
let a =[1,2,3,4,5,6]
for(var i in a){
console.log(a[i])
}
```

### The HTTP module

```javascript
var PORT = 8080
var http = require('http')
var count = 0
// var server  = new http.Server()
var server = http.createServer((req, res) => {
  count++
  console.log(req.method, req.url)
  console.log(req.headers['user-agent'])
  res.writeHead(200, { "Content-Type": 'text / html;charset=UTF-8 ' })

  res.write('<h1>It works!</h1>')
  res.write(`You are the ${count}th visitor of this site`)
  res.end('hello')
})
server.listen(PORT, () => {
  console.log('server listening on port', PORT)
})
```

```javascript
var PORT = 8080
var http = require('http')
var count = 0
// var server  = new http.Server()
var server = http.createServer()


server.on('request', (req, res) => {
  count++
  console.log(req.method, req.url)
  console.log(req.headers['user-agent'])
  res.writeHead(200, { "Content-Type": 'text / html;charset=UTF-8 ' })

  res.write('<h1>It works!</h1>')
  res.write(`You are the ${count}th visitor of this site`)
  res.end('hello')
})
server.listen(PORT, () => {
  console.log('server listening on port', PORT)
})
```

* nodemon 命令 文件一改变保存 就重启

#### 静态文件服务器

```javascript
var fs = require('fs')
var path = require('path')
var PORT = 80
var http = require('http')

var baseDir = path.resolve('./test2')

var server = http.createServer((req, res) => {
  console.log(req.method, req.url)

  var targetPath = path.join(baseDir, decodeURIComponent(req.url)) //中文url

  fs.stat(targetPath, (err, stat) => {
    if (err) {//用户乱填地址 会出错
      res.writeHead(400)
      res.end('File Not Found')
    } else {
      if (stat.isFile()) {
        fs.readFile(targetPath, (err, content) => { //content是字节流
          if (err) {
            res.end(error)
          } else {
            res.writeHead(200, {
              'Content-Type': 'text/html;charset=UTF-8'
            })
            res.end(content) //写回去content浏览器自动变字符串
          }
        })
      } else if (stat.isDirectory()) {
        res.writeHead(200, {
          'Content-Type': 'text/html;charset=UTF-8'
        })
        fs.readdir(targetPath, { withFileTypes: true }, (err, entries) => {
          // res.write(entries.map(entry => `<div><a href="${entry}">${entry.name}</a></div>`).join(''))
          var html = entries.map(entry => {
            var slash = entry.isDirectory() ? '/' : ''
            var stat = fs.statSync(path.join(targetPath, entry.name))
            return `
              <tr>
                <td style="text-align:right">${stat.size}B</td>
                <td><a href="${entry.name + slash}">${entry.name + slash}</a></td>
              </tr>
            `
          }).join('')//join('') 转换成字符串
          html = `
          <h1>Index of ${decodeURIComponent(req.url)}</h1>
          <table>${html}</table>
          <footer>Node.js ${process.version} / My <a href="https://github.com/nuibility/server">Nuibility</a> Server Running</footer>
          `
          res.write(html)
          res.end()
        })
      }
    }
  })


})

server.listen(PORT, '127.0.0.1', () => {
  console.log('server listening on port', PORT)
})
```

* 自动进入index.html

  ```javascript
  var fs = require('fs')
  var path = require('path')
  var PORT = 80
  var http = require('http')
  
  var baseDir = path.resolve('./test2')
  
  var server = http.createServer((req, res) => {
    console.log(req.method, req.url)
    let url = decodeURIComponent(req.url)
    var targetPath = path.join(baseDir, url) //中文url
  
    fs.stat(targetPath, (err, stat) => {
      if (err) {//用户乱填地址 会出错
        res.writeHead(400)
        res.end('File Not Found')
      } else {
        if (stat.isFile()) {
          fs.readFile(targetPath, (err, content) => { //content是字节流
            if (err) {
              res.end(error)
            } else {
              res.writeHead(200, {
                'Content-Type': 'text/html;charset=UTF-8'
              })
              res.end(content) //写回去content浏览器自动变字符串
            }
          })
        } else if (stat.isDirectory()) {
          var indexPath = path.join(targetPath, 'index.html')
          fs.readFile(indexPath, (err, content) => {
            if (err && err.code == 'ENOENT') { //ERROR NO ENTRY err&& 是err不存在的话 err是null err.code是错的
              res.writeHead(200, {
                'Content-Type': 'text/html;charset=UTF-8'
              })
              fs.readdir(targetPath, { withFileTypes: true }, (err, entries) => {
                // res.write(entries.map(entry => `<div><a href="${entry}">${entry.name}</a></div>`).join(''))
                var html = entries.length ? entries.map(entry => {
                  var slash = entry.isDirectory() ? '/' : ''
                  var stat = fs.statSync(path.join(targetPath, entry.name))
                  return `
                <tr>
                  <td style="text-align:right">${stat.size}B</td>
                  <td><a href="${entry.name + slash}">${entry.name + slash}</a></td>
                </tr>
              `
                }).join('') : 'nothing in this directory'//join('') 转换成字符串
                html = `
                  <h1>Index of ${url}</h1>
                  <table>${html}</table>
                  <footer>Node.js ${process.version} / My <a href="https://github.com/nuibility/server">Nuibility</a> Server Running</footer>
                `
                res.write(html)
                res.end()
              })
            } else {
              res.writeHead(200, {
                'Content-Type': 'text/html;charset=UTF-8'
              })
              res.end(content)
            }
          })
        }
      }
    })
  
  
  })
  
  server.listen(PORT, '127.0.0.1', () => {
    console.log('server listening on port', PORT)
  })
  ```

* 同步和异步

  ```javascript
  try{
    var stat = fs.statSync()
    if(stat.xxx()){
      fs.readFileSync()
    }
  }.catch(e){
    
  }
  
  fs.stat(xxx,(err,stat)=>{
    if(err){
  
    }else{
      if(stat.isFile()){
        fs.readFile(yyy,(err,content)=>{
          if(err){
  
          }else{
            
          }
        })
      }
    }
  })
  ```

  ```javascript
  path.resolve('foo')
  // C:\\x\\xx\\foo
  path.resolve('foo','/bar')
  //C:\\bar  因为/是绝对路径
  ```

* 安全和用户地址没输入/
```javascript
var fs = require('fs')
var path = require('path')
var PORT = 80
var http = require('http')

var baseDir = path.resolve(__dirname, './test2')
//dirname 当前文件所在文件夹名字
//不然在C:\Users\荆纬宸\Desktop\目录下执行 node ./新建文件夹.test.js 就不对了

//安全问题 http://localhost:8080/../../../

var server = http.createServer((req, res) => {
  console.log(req.method, req.url)
  let url = decodeURIComponent(req.url)
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
        fs.readFile(targetPath, (err, content) => { //content是字节流
          if (err) {
            res.end(error)
          } else {
            res.writeHead(200, {
              'Content-Type': 'text/html;charset=UTF-8'
            })
            res.end(content) //写回去content浏览器自动变字符串
          }
        })
      } else if (stat.isDirectory()) {
        var indexPath = path.join(targetPath, 'index.html')
        fs.readFile(indexPath, (err, content) => {
          if (err && err.code == 'ENOENT') { //ERROR NO ENTRY err&& 是err不存在的话 err是null err.code是错的
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
              // res.write(entries.map(entry => `<div><a href="${entry}">${entry.name}</a></div>`).join(''))
              var html = entries.length ? entries.map(entry => {
                var slash = entry.isDirectory() ? '/' : ''
                var stat = fs.statSync(path.join(targetPath, entry.name))
                return `
              <tr>
                <td style="text-align:right">${stat.size}B</td>
                <td><a href="${entry.name + slash}">${entry.name + slash}</a></td>
              </tr>
            `
              }).join('') : 'nothing in this directory'//join('') 转换成字符串
              html = `
                <h1>Index of ${url}</h1>
                <table>${html}</table>
                <footer>Node.js ${process.version} / My <a href="https://github.com/nuibility/server">Nuibility</a> Server Running</footer>
              `
              res.write(html)
              res.end()
            })
          } else {
            res.writeHead(200, {
              'Content-Type': 'text/html;charset=UTF-8'
            })
            res.end(content)
          }
        })
      }
    }
  })


})

server.listen(PORT, '127.0.0.1', () => {
  console.log('server listening on port', PORT)
})
```

* 模板引擎
  * npm i lodash
  * npm i filesize      human readable

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
  let url = decodeURIComponent(req.url)
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
        fs.readFile(targetPath, (err, content) => { //content是字节流
          if (err) {
            res.end(error)
          } else {
            res.writeHead(200, {
              'Content-Type': 'text/html;charset=UTF-8'
            })
            res.end(content) //写回去content浏览器自动变字符串
          }
        })
      } else if (stat.isDirectory()) {
        var indexPath = path.join(targetPath, 'index.html')
        fs.readFile(indexPath, (err, content) => {
          if (err && err.code == 'ENOENT') { //ERROR NO ENTRY err&& 是err不存在的话 err是null err.code是错的
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
            res.end(content)
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
          <td><a href="<%= entry.name %><%= slash%>"><%= entry.name %><%= slash%></a></td>
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

* 观察大文件请求占用服务器的内存 在test2路径下运行

  ```javascript
  var fs = require('fs')
  console.log('pid', process.pid)
  console.log('reading...')
  fs.readFile('2020-07-17 15-31-03-跨域方式总结：JSONP.mkv', (err, data) => {
    if (err) {
      console.log(err)
    } else {
      setInterval(() => {
        console.log(data.length)
      }, 1000)
      console.log('writing...')
      fs.writeFile('看任务管理器.mkv', data, () => {
        console.log('done...')
      })
    }
  })
  ```

  