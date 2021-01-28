# BOM

* Browser Object Model
* Dom 一般指document上提供的相关api
* API Application Programming Interface 应用编程接口
* BOM 一般来说泛指那些浏览器里提供的除js内置api 
  * 如alert/prompt/confirm   
  * worker  
  * blob

#### srceen

![image-20200716113429132](16%20BOM.assets/image-20200716113429132.png)

#### navigator

* userAgent 可以识别操作系统  手机模式选择可以改变
* Accept-Language

#### location

![image-20200716114103302](16%20BOM.assets/image-20200716114103302.png)

* `location.reload()` 刷新
* `location.assign('http://www.jd.com')` 相当于 `location.href = 'http://www.jd.com'` 相当于`location = 'http://www.jd.com'`
* `location.replace()`与assign差不多，区别是不可以后退

* 利用a标签解析url

  ```javascript
  function parseURL(url){
    //http://www.jd.com/foo/bar/baz.././../a/b/c
    // /.相当于没有
    var a = document.createElement('a')
    a.href = url
    return {
      href: a.href,
      search:a.search,
      origin:a.origin,
      protocol:a.protocol,
      pathname:a.pathname
    }
  }
  ```

  ![image-20200716115651339](16%20BOM.assets/image-20200716115651339.png)

* hash改变会触发window.onhashchange事件

![image-20200716135633093](16%20BOM.assets/image-20200716135633093.png)

* hash的内容是不会主动被浏览器发往服务器的
* origin 域  location.origin  协议 域名 端口

> 简单的hashchange事件

```javascript
var lastHash = location.hash
setInterval(function () {
  if (lastHash != location.hash) {
    console.log('hash has changed')
    if (typeof window.onhashchange === 'function') {
      window.onhashchange()
    }
  }
  lastHash = location.hash
}, 50)
```

* 如果hash对应于页面某元素的id或name的值，页面也会跳转到哪个元素的位置。
* :target 选择器 选中的是id的值为hash内容的元素

#### history 重要

`history.go(-4)` 后退4步

```javascript
history.back()
history.forward()
// 后退前进

//pushState重要 参数data title url 不想刷新页面 又想改变页面地址 配合ajax
//url可以不写 不写就不在地址栏里 防止分享 
history.pushState({ foo: 1, bar: 2 }, 'HELLO', '/foo/bar')
//改变了地址 但是不刷新
history.state
//{foo: 1, bar: 2} 和地址绑定的数据
//history.state不能直接赋值
//pushState页面不刷新 浏览器前进后退pushState的页面依然不刷新

window.onpopstate = console.log
//事件 由pushState 传入的url 前进或后退触发 注意是window.add
```

#### pushState例子 用网站形式打开

> hs -o

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  XXX 网站
  <div id="main">
    首页
  </div>
  <a href="/about">关于</a>
  <a href="/links">友情链接</a>
  <script>
    var pages = {
      '/about': '关于我们网站：xxx; 电话：1234567',
      '/links': 'https://www.jd.com  https://www.mi.com',
      '/': '首页'
    }
    var main = document.querySelector('#main')

    document.addEventListener('click', e => {
      if (e.target.matches('a')) {
        e.preventDefault()
        var path = e.target.getAttribute('href') //a.href拿的是完整地址 这里要相对地址
        history.pushState(path, '', path)
        main.innerHTML = pages[path]
      }
    })

    window.addEventListener('popstate', e => { //注意是window.addEventListener
      if (e.state == null) {  //退回到起始页
        main.innerHTML = pages['/']
      } else {
        main.innerHTML = pages[e.state]
      }
    })//实现后退
  </script>
</body>

</html>
```

* pjpx => pushState + ajax
* replaceState 把当前状态替换掉

#### Window

```javascript
window.name
// var name = xx  xx会被转换成字符串 并且挂到window上 let name 就不会

// 窗口不变 就算跳转（不开启新窗口 只是连接变了） window.name前面是不变的 新信息会加到后面 可以用来在两个页面传递信息

// 用来跨域请求 a.com 请求 b.com
// a.com 里面套iframe a.com 
//iframe window.name存请求b的什么资源 然后跳到b.com
//b.com读取window.name 知道请求什么资源 把请求的数据放到window.name  后退 给到外层页面

window.top
//指向顶层窗口的window代理对象 依然不能跨域
window.parent 

var a = window.open('https://www.jd.com/') //打开新窗口
a.close()
//只能关闭他自己open的


win = window.open('https://www.jd.com/')
window.opener() //谁打开的 点连接也可以 不是同域 所以是代理对象 只能访问到一部分

w2 = open(url, frameName)
//在frame里打开url

w3 = open(url, null, "popup=yes,width=800,height=600,top=50,left=100")
//打开弹窗 距离左上角50 100  宽高 800 600
w4 = open(url, null, "modal=yes,width=800,height=600,top=50,left=100")
//打开模态窗口 不关闭现在的窗口 回不去
```

![image-20200716170715493](16%20BOM.assets/image-20200716170715493.png)

* 盗图

![image-20200716171519056](16%20BOM.assets/image-20200716171519056.png)

* parent 父窗体（frame）

* top 顶层窗体（frame）

* status 状态栏 屏幕左下角

* document.title 设置网页的标题

* blur/focus()

  让窗体获取或者失去焦点

  * on blur/focus 事件 考试系统

* getComputedStyle 获取所有计算属性

  * $0.style.top = ‘2px’ 
  * $0.style.top 只能获取内联样式·
  * getComputedStyle($0).color  

* stop() 停止加载页面

#### Base64 编码

* 编码解码  atob base64解码成2进制   btoa 二进制编码成base64

  ![image-20200716172021532](16%20BOM.assets/image-20200716172021532.png)


* base64存图片 不用发特意http请求 存在字符里 和html一起来快

> 用文本的形式表达一份二进制原始信息
>
> 0-9 a-z A-Z + / 64   
>
> 64进制
>
> BASE64 4AAQ 四个字符表示三个字节 一个字符六个比特   2^^6 =64
>
> 数据量是原始数据大小的1.33倍 4/3
>
> 
>
> dateURI
>
> data:img/jpeg;base64,xxxxxxxxx
>
> data:text/html;base64,xxxxxxxxx

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <ul id="test">
    <li>这是第一条</li>
    <li>这是第二条</li>
    <li>这是第<span>三</span>条</li>
  </ul>
  <script>
    let test = document.querySelector('#test')
    let li = Array.from(document.querySelectorAll('li'))
    test.addEventListener('click', e => {
      let p = e.target
      while (p.tagName !== 'LI' || !li.includes(p)) {
        p = p.parentNode
      }
      let idx = li.indexOf(p)
      alert(idx + 1)
    })
  </script>
</body>

</html>
```

