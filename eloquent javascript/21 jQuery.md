### jQuery

> jQuery 针对DOM API的一补充

> 用了jQuery以后可以极大的减少与DOM相关的代码的代码量
>
> jQuery提供了少部分Lodash的功能，即函数
>
> jQuery还提供了对AJAX的封装
>
> jQurey还提供了常见方法的封装。事件代理，ajax，jsonp，dom创建



> 对于早期浏览器来说，jQuery的一大功能就是解决各种兼容性问题
>
> 在jQuery中使用统一的写法，就能自动在所有浏览器中正常工作



> 事件对象不一致。which / buttons
>
> 整体数量不一样。不同浏览器事件并不完全一样，但jQuery中都有。类似模拟三击
>
> 事件绑定方式不一样 attahEvent addEventListener
>
> 事件对象读取方式不一样 IE是在全局读event变量 其他浏览器则会把事件对象作为参数传给事件处理函数
>
> ajax用法不一样 new XMLHttpRequest() new ActiveX('XMLHttpRequest')



> 为何jQurey 现在不行了
>
> 浏览器兼容性变好了
>
> 框架流行 不再需要人肉操作DOM
>
> jQuery提供的各大方面的功能有各自专门的其他库来解决，而且解决的更好
>
> 常用函数 由Lodash解决
>
> ajax封装 由axios解决

```javascript
fetch('a.json')
  .then(response => response.json()
    .then(data => {
    })
  )
```

```javascript
$.clone //克隆dom结点
$.clone($0)

$.proxy()  //bind 给函数绑定this

$.ajax(
  {
    url: '/register',
    method: 'post',
    type: 'jsonp',
    data: { username: 'xxx', password: 'yyy' },
    headers: {}
  }, function (data) { })
//现在ajax可以返回promise 可以then

$.get('a.json').then(data => { })
$.getJSON('a.json')   //直接把请求到的数据转换为JSON

$.getScript('a.js')//加载线上js运行


$.camelCase('foo-bar-baz')
//fooBarBaz
$.contains(['a', 'b', 'c'], b)
//false 不是判断数组的
$.contains(document.body, document.documentElement)
//false
$.contains(document.body, document.document.all[100])
//true

$.each([1, 2, 3, 4], function (idx, it) {
  console.log(idx, it)
})
//先传id 第二个参数才是遍历的元素

$.support
//当前浏览器支持什么  
$.parseHTML('<div><span class="foo">aaa</span>bbb</div>')[0]
//返回一个dom结构 放在一 个数组里
```

#### 选择元素 绑定事件 操作DOM

`$('div>p>span,em')` 和所有的em

* 返回类数组对象，叫做jQuery 实例 / 对象

```javascript
$('div>p>span,em').css('border', '8px solid red') //设置内联样式
$('div>p>span,em').append('FOOFOFOFOFOFO')
$('div>p>span,em').prepend('FOOFOFOFOFOFO')
let a = $('div>p>span,em').parent() //父元素的集合
a.addClass('foo')
let a = $('div>p>span,em').next()
```

```javascript
$('div>p').get()
//返回数组

$('div>p').get(5)
//$('div>p')[5]

$('div>p').index()
$($0).index() //元素在父元素中的下标 

//给jQuery添加方法
$.prototype.fooo
$.fn.fooo

$.noConflict() //$在jQuery加载之前指向的
```

```javascript
$('body').ajaxSend(function(){}) //body里有ajax请求发出后触发
$('body').load('a.html') //请求下载html放进body
$('<div></div>').load('www.a.html #main').appendTo(document.body)
//需要跨域

$('h1').hide()
$('h1').show()
$('h1').toggle(time,callback) //切换显隐状态

$($0).animate({width:100,height:100},time,callback)
$($0).slideToggle() //滑动显隐

$($0).slideUp().delay(1000).slideDown()
//依次执行
stop() //动画执行一半停止 
```

```javascript
//绑定事件
$('p').click(function(e){})
//blur focus mousemove
$('p').on('click',function(e){})
$('p').click()
//触发click事件

//事件代理
$('body').on('click dblclick mousemove','p.foo',function(e){})
```

```javascript
$('p').append(function(){return this.textContent.split(' ')[0]})
//接函数 添加返回结果

$('p').wrap('<div class="WWW"></div>')
//给每个p标签外 包裹
unwrap()
//去掉父元素标签
$('p').wrapAll('<div class="WWW"></div>')
//所有标签共用父元素

$('pre').wrapAll('<div></div>').parent().html()
//pre 标签 全放div里 再取div 的html

empty() //清空元素内容 
remove() //删除元素
detach() //元素脱离dom但还在返回变量里

$('p').eq(0)
//取集合的第0项元素
```

```javascript
class jQuery {
  static parseHTML(code) {
    var div = document.createElement('div')
    div.innerHTML = code
    return Array.form(div.childNodes)
  }
  constructor(selector) {
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
      this[i] = elements[i]
    }
    this.length = elements.length
  }
  on(eventName, selector, handler) {
    this.addEventListener(eventName, function (e) {
      if (e.target.matches(selector){
        handler.call(e.target, e)
      }
    })
  }
  each(func) {
    for (var i = 0; i < this.length; i++) {
      func.call(this[i], i, this[i])
    }
  }
  css(propName, propVal) {
    for (var i = 0; i < this.length; i++) {
      this[i].style[propName] = propVal
    }
    return this
  }
  html(val) {
    if (val === undefined) {
      return this[0].innerHTML
    } else {
      this[0].innerHTML = val
    }
  }
}
```

