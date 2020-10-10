# BOM

* Browser Object Model

* Dom 一般指document上提供的相关api

* API Application Programming Interface 应用编程接口

* BOM 一般来说泛指那些浏览器里提供的除js内置api
#### srceen

![image-20200716113429132](16%20BOM.assets/image-20200716113429132.png)

#### navigator

* userAgent

#### location

![image-20200716114103302](16%20BOM.assets/image-20200716114103302.png)

* `location.reload()` 刷新
* `location.assign('http://www.jd.com')` 相当于 `location.href = 'http://www.jd.com'` 相当于`location = 'http://www.jd.com'`
* `location.replace()`与assign差不多，区别是不可以后退

* 利用a标签解析url

  ```javascript
  function parseURL(url){
    //http://www.jd.com/foo/bar/baz.././../a/b/c
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

#### history

`history.go(-4)` 后退4步

```javascript
history.back()
history.forward()
// 后退前进
history.pushState({ foo: 1, bar: 2 }, 'HELLO', '/foo/bar')
//改变了地址 但是不刷新
history.state
//{foo: 1, bar: 2}
window.onpopstate = console.log
//事件 由pushState 传入的url 前进或后退触发
```

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
        var path = e.target.getAttribute('href')
        history.pushState(path, '', path)
        main.innerHTML = pages[path]
      }
    })

    window.addEventListener('popstate', e => {
      if (e.state == null) {
        main.innerHTML = pages['/']
      } else {
        main.innerHTML = pages[e.state]
      }
    })//实现后退
  </script>
</body>

</html>
//hs -o 打开
```

* pjpx => pushState + ajax
* replaceState 把当前状态替换掉

```javascript
window.name
// var name = xx  xx会被转换成字符串 并且挂到window上 let name 就不会
// 窗口不变 就算跳转（不开启新窗口 只是连接变了） window.name是不变的
// 用来跨域请求 a.com 里面套a.com 2号页面 window.name 放跳到b.com 要请求什么资源，做什么 跳转b.com  请求的数据放到window.name 后退 给到外层页面
window.top
var a = window.open('https://www.jd.com/')
a.close()
//只能关闭open的


win = window.open('https://www.jd.com/')
window.opener()

w2 = open(url, frameName)
//在frame里打开url

w3 = open(url, null, "popup=yes,width=800,height=600,top=50,left=100")
//打开弹窗 距离左上角50 100  宽高 800 600
w4 = open(url, null, "modal=yes,width=800,height=600,top=50,left=100")
//打开模态窗口 不关闭现在的窗口 回不去
```

![image-20200716170715493](16%20BOM.assets/image-20200716170715493.png)

![image-20200716171519056](16%20BOM.assets/image-20200716171519056.png)

* parent 父窗体（frame）
* top 顶层窗体（frame）
* status 状态栏
* document.title 设置网页的标题



* 编码解码

  ![image-20200716172021532](16%20BOM.assets/image-20200716172021532.png)* 

* blur/focus()

  让窗体获取或者失去焦点

  * on blur/focus 事件

* getComputedStyle 获取所有属性
  * $0.style.top = ‘2px’ 
  * $0.style.top 只能获取内联样式·
  * getComputedStyle($0).color  

* stop() 停止加载页面

#### base64编码 

> 用文本的形式表达一份二进制信息
>
> 0-9 a-z A-Z + / 64 
>
> BASE64 4AAQ 四个字符表示三个字节 一个字符六个比特 
>
> 
>
> dateURI
>
> data:img/jpeg;base64,xxxxxxxxx