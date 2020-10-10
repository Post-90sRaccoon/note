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

$.get('a.json').then(data => { })
$.getJSON('a.json')   //直接把请求到的数据转换为JSON

$.getScript('a.js')//加载线上js运行


$.camelCase('foo-bar-baz')
//foobarbaz
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
$('div>p>span,em').css('border', '8px solid red')
$('div>p>span,em').append('FOOFOFOFOFOFO')
let a = $('div>p>span,em').parent()
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
```

