# Document Object Model

*  文档对象模型

```html
< script >
  先执行 执行完 在运行下面div
</script >

<div>
    aaa
</div>
  
  
<script>
 console.log('</script>') //错误
console.log('<\/script>') 
</script>
```

* 全局变量document  访问对象
* document.documentElement 指向html的对象
* 程序的语法 整个构建
* 浏览器可以实时显示页面DOM结构的样子

![image-20200623201749651](11%20Dom.assets/image-20200623201749651.png)

### Trees 语法树

* https://esprima.org/demo/parse.html#

* 浏览器拿到语法树
* 普通元素 html标签 有子节点
* 文本结点 注释是叶子结点
* 每个dom结点都有一个nodeType属性 包含代表结点类型的数值

![image-20200625221003356](11%20Dom.assets/image-20200625221003356.png)

* 都是常量，大写，改不了

### 不可改属性

```javascript
Object.defineProperties()

obj = Object.freeze({ a: 1, b: 2 })
//不能增加 不能删除 修改没用
Object.seal({ a: 1, b: 2 })
//seal 可以修改属性 不能删除 不能增加

Object.preventExtensions({ a: 1, b: 2 })
//阻止增加属性 可以删除属性
```

### The Standard

####  childNodes

*  返回包含指定节点的子节点的集合，该集合为即时更新的集合。不是真正数组，NodeList类型。

![image-20200623204021130](11%20Dom.assets/image-20200623204021130.png)

![image-20200623204408538](11%20Dom.assets/image-20200623204408538.png)

###  Moving through the tree

![image-20200626080130069](11%20Dom.assets/image-20200626080130069.png) 

* DOM结点包含大量指针指向附近的结点 

```javascript
document.body.lastChild.previousSibling.firstChild 
//回车也是body里的文本结点 
//previousSibling 前一个子节点 文本也算
//previousElementSibling  前一个元素结点
```

* 返回node及其内中有没有出现过text

```javascript
function talksAbout(node, string) {
  if (node.nodeType == document.ELEMENT_NODE) {
    for (var i = 0; i < node.childNodes.length; i++) {
      if (talksAbout(node.childNodes[i], string))
        return true;
    }
    return false;
  } else if (node.nodeType == document.TEXT_NODE) {
    return node.nodeValue.indexOf(string) > -1;
  }
} 
```

### Finding element

![image-20200623211939333](11%20Dom.assets/image-20200623211939333.png)

```javascript
function getElementsByTagName(node, name) {
  var result = []
  for (var i = 0; i < node.children.length; i++) {
    var child = node.children[i]
    if (child.tagName === name) {
      result.push(child)
    }
    result.push(...getElementsByTagName(child, name))
  }
  return result
}//node.children 没有text标签
getElementsByTagName(document.body,'DIV')
//递归多少次 创建多少数组


function getElementsByTagName(node, name, result = []) {
  for (var i = 0; i < node.children.length; i++) {
    var child = node.children[i]
    if (child.tagName === name) {
      result.push(child)
    }
    getElementsByTagName(child, name, result)
  }
  return result
}
```

```javascript
//获取单个结点
function getElementById(id, node = document.documentElement) {
  if (node.id === id) {
    return node
  } else {
    for (var i = 0; i < node.children.length; i++) {
      var child = node.children[i]
      var result = getElementById(id, child)

      if (result) {
        return result
      }
    }
  }
  return null
}
```

![image-20200623214616472](11%20Dom.assets/image-20200623214616472.png)

* 类数组 映射

```javascript
function getById(id) {
  return document.all[id] || null
}

//class ='a b c'
document.getElementsByClassName('a')
//a b c任何一个就可以
```

###  Changing the document

```javascript
removeChild(chlidNode) //删除子节点
appendChild(childNode) //末尾添加子节点
insertBefore(newNode, baseNode) //在...之前插入子节点
                                //baseNode 必须是调用者的子节点
replaceChild(newNode, oldNode) //oldNode必须是调用结点的子节点
prepend('string', document.createElement('span'))
//添加string文本和span标签
//在调用节点的第一个子节点之前插入一系列Node对象或者DOMString对象。DOMString会被当作Text节点对待（也就是说插入的不是HTML代码）
```

```html
<p>One</p>
<p>Two</p>
<p>Three</p>

<script>
    var ph = document.body.getElementsByTagName('p')
    document.body.insertBefore(ph[2], ph[0])
</script>
//Three One Two 
```

* 一个结点在文档中只能出现一次，不能在两个地方同时出现。Three One Two

### Create nodes

```html
 <p> The <img src=" img/cat.png" alt=" Cat"> in the
    <img src=" img/hat.png" alt=" Hat ">.
  </p>
  <p>
    <button onclick=" replaceImages ()"> Replace </button>
  </p>

<script>
  var imgs = document.getElementsByTagName('img') //返回动态集合 一开始length为2 for循环替换掉一个后 length变为一

for (var i = 0; i < imgs.length; i++) {
  var img = imgs[i]
  var textNode = document.createTextNode(img.alt)
  img.parentNode.replaceChild(textNode, img)
}
document.createTextNode('创建文本结点')
</script>


< script >
  function replaceImages() {
    var images = document.body.getElementsByTagName(" img ");
    for (var i = images.length - 1; i >= 0; i--) {
      var image = images[i];
      if (image.alt) {
        var text = document.createTextNode(image.alt);
        image.parentNode.replaceChild(text, image);
      }
    }
  }
</script>



< script >
function replaceImages() {
  var images = document.body.getElementsByTagName(" img ");
  var imgAry = Array.from(imgs)       //img标签会从images里消失 不会从imgAry里消失

  for (let i = 0; i <= imgAry.length; i++) {
    var img = imgs[i]
    var textNode = document.createTextNode(img.alt)
    img.parentNode.replaceChild(textNode, img)
  }
}
</script>
```

```javascript
var arrayish = { 0: "one", 1: "two", length: 2 };
var real = Array.prototype.slice.call(arrayish, 0); //转化成数组
console.log(arrayish.length)
//2 根据arrayish里面的length来的 如果改为3 real=[one,two,empty]
real.forEach(function (elt) { console.log(elt); });
// one two

Array.prototype.slice = function (start = 0, end = this.length) {
  var result = []
  for (let i = start; i < end; i++) {
    result.push(this[i])
  }
  return result
}
```

#### 创建元素结点

```javascript
div = document.createElement('div')
//createElement 不能增加属性 孩子之类

//elt('div','lorem',elt('span'))

function elt(tagName, attrs, ...children) {
  var node = document.createElement(tagName)
  if (attrs) {
    for (var key in attrs) {
      var val = attrs[key]
      node.setAttribute(key, val)
    }
  }
  for (var child of children) {
    if (typeof child === 'string') {
      node.appendChild(document.createTextNode(child))
    } else {
      node.appendChild(child)
    }
  }
  return node
}
```

### JSON解析器

```javascript
var str = '[111,222,{"a":3},{"b":true,"c":"fooobar","d":[1,false,[null,4,{"x":1,"y":2}]]}]'


let parseJSON = (function () {
  let i = 0 //指向当前正在解析的值
  let str
  //递归下降 ','都是在数组和对象里出现的 所以交给他们处理

  return function parseJSON(input) {
    str = input
    i = 0 //每次调用都把i置为0
    return parseValue()
  }
  function parseValue() {
    if (str[i] === '[') {
      return parseArray()
    }
    if (str[i] === '{') {
      return parseObject()
    }
    if (str[i] === '"') {
      return parseString()
    }
    if (str[i] === 't') {
      return parseTrue()
    }
    if (str[i] === 'f') {
      return parseFalse()
    }
    if (str[i] === 'n') {
      return parseNull()
    }
    return parseNumber() //不考虑传入的值有错有错 没有任何额外空白 剩下的都是数
  }

  function parseArray() {
    let result = []
    i++
    while (str[i] !== ']') {
      result.push(parseValue())
      if (str[i] === ',') {
        i++
      }
    }
    i++
    return result
  }

  function parseObject() {
    let obj = {}
    i++
    while (str[i] !== '}') {
      let key = parseString()
      i++ //skip :
      let value = parseValue()
      obj[key] = value
      if (str[i] === ',') {
        i++
      }
    }
    i++
    return obj
  }

  function parseString() {
    let result = ''
    i++
    while (str[i] !== '"') {
      result += str[i++]
    }
    i++
    return result
  }

  function parseNumber() {
    let result = ''
    while (isNumDigit(str[i])) {
      result += str[i++]
    }
    return parseInt(result)
  }

  function isNumDigit(char) {
    let code = char.charCodeAt(0)
    let char0 = '0'.charCodeAt(0)
    let char9 = '9'.charCodeAt(0)
    return code >= char0 && code <= char9
  }

  function parseTrue() {
    i += 4
    return true
  }
  function parseFalse() {
    i += 5
    return false
  }
  function parseNull() {
    i += 4
    return null
  }

})()


//"3+(2*5)" 树
function calc(root) {
  if (root.val === '+') {
    return calc(root.left) + calc(root.right)
  }
  else if (root.val === '-') {
    return calc(root.left) - calc(root.right)
  }
  else if (typeof root.val === 'number') {
    return root.val
  }
}
```

#### 回顾

* document.write 和document.createElement的区别

```javascript
document.write('<span></span>')
//解析流里写入字符串 解析结束后（</html>）再写无意义 。 解析完成后再write就会重新开启一个解析流，相当于把DOM树中的所有内容冲掉。会重新开启一个解析流。

document.close()
document.open() 
//开启解析流 关闭解析流 


document.createElement('span')
//创建出DOM对象.创建之初不在DOM树里的，需要添加到DOM树里才能显示出来 不会因为创建或添加而影响DOM树的其他部分。
```

* 类数组

![image-20200624170229487](11%20Dom.assets/image-20200624170229487.png)

![image-20200624170526340](11%20Dom.assets/image-20200624170526340.png)

```javascript
var aryLike = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  __proto__: Array.prototype,
  get length() {
    var l = 0
    for (var key in this) {
      if (key == parseInt(key)) {
        l = key
      }
    }
    return parseInt(l) + 1
  },
  set length(l) {
    if (l > this.length) {
      this.length = l
    }
    if (l < this.length) {
      for (var i = l; i < this.length; i++) {
        delete this[i]
      }
      this.length = l
    }
  }
}

Array.isArray(aryLike)
//false
aryLike instanceof Array
//true
```

### Attributes

* 有些html属性可以直接通过DOM Object的property访问

```javascript
.src
.alt
.className
.htmlFor  //label 里面的for
.classList //有多个类名
.classList.add
.classList.remove


.getAttribute(‘xxx’) //可以访问所有属性 包括自定义
```
```html
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <p data-classified="secret">The launch code is 00000000. </p>
  <p data-classified="unclassified">I have two feet .</p>
</body>
<script>
  var paras = document.body.getElementsByTagName("p");
  Array.prototype.forEach.call(paras, function (para) {
    if (para.getAttribute("data-classified") == "secret")
      para.parentNode.removeChild(para);
  })
  //类数组不能直接使用forEach方法 原型不是Array.prototype 所以找不到forEach 
</script>

</html>
```
```html
<div class="product" data-foo="1234" data-info="{price:3233,id:392493490}" data-foo-bar="true"></div>
<pre data-language="javascript">
  function isPrime() {
    return 8
  }
  <!--加高亮-->
</pre>

<script>
  $0.dataset.foo
  //1234
  $0.dataset.info
  //{price:3233,id:392493490}
  $0.dataset.fooBar
  //true
  $0.dataset.fooBar = false
  $0.dataset.zoo = '888'
  //888
  $0.textContent 
  //可读可写 不包括标签
  $0.innerText
  //返回的形态受css影响
  // $0.textContent返回的结点文字内容不受css影响，完全是由所有文本结点的内容拼接而成
  // $0.innerText返回的内容受css影响，会触发回流，如多个空格及回车会被合并成一个空格
  
//https://www.zhangxinxu.com/wordpress/2019/09/js-dom-innertext-textcontent/
</script>
```

```javascript
function getTextContentOfNode(node) {
    var result = ''
    for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i]
        if (child.nodeType === document.TEXT_NODE) {
            result += child.nodeValue
        } else if (child.nodeType === document.ELEMENT_NODE) {
            result += getTextContentOfNode(child)
        }
    }
    return result
}
```

####  高亮代码

* highlight js
* prism js 

* 要pre标签里面套code

```javascript
offsetWidth
offsetHeight
//元素占用的像素
clientWidth
clientHeight
//忽略border及以外的像素 也就是padding box


//获取位置
getBoundingClientRect() 
//返回一个DOMReact对象 top bottom left right x(right-left) y(bottom-top)距离左上角的位置 

//<p><span></span></p>
getClientRects() 
//拿到生成的多个矩形盒子  
//Element.getClientRects() 方法返回一个指向客户端中每一个盒子的边界矩形的矩形集合


window.pageXOffset
window.pageYOffset
//获得滚动的位置 可以赋值 但页面不会随之滚动

window.scrollX
window.scrollY

window.scrollBy(50,100) //滚动多少个像素
window.scrollTo(100,100)//滚动到

window.innerHeight
window.innerWidth //得到窗口的宽高

window.outerHeight

//获得元素的滚动
$0.scrollTop
$0.scrollLeft
//可以赋值 位置改变
```

#### 回顾

```javascript
周围元素的指针：
el.parentNode
el.firstChild / firstElementChild
el.lastChild / lastElementChild
el.previousSibiling / previousElementSibiling
el.nextSibiling / nextElementSibiling
el.childNodes 所有子结点，包含文本结点
el.children 所有元素子结点
document.all 所有元素
document.all[id] 取到特定id的元素

元素的操作：
document.createElement('div')
document.createTextNode('foobar')
el.appendChild(node)
el.append(...nodes) //支持文本
el.prepend(...nodes)
el.removeChild(child)
el.insertBefore(newNode, child)
el.replaceChild(newNode, child)

元素的获取
document.all[id]
document.getElementById
el.getElementsByTagName
el.getElementsByClassName
el.getElementsByName

属性操作：
标准属性可以通过同名html属性直接访问到
如
el.id / className / htmlFor / title / tabindex
a.href
img.src / alt
iframe.src
script.src
el.classList.add / remove / has
el.dataset.fooBar = 'xxx'
el.getAttribute(name)
el.setAttribute(name, val)

尺寸与位置：
el.offsetWidth / Height
el.clientWidth / Height
el.getBoundingClientRect()包裹着元素所有区域的最小矩形
el.getClientRects()获取元素布局生成的所有矩形
window.pageX / YOffset页面滚动位置
el.scrollTop / Left元素的滚动位置
el.scrollTop / Left = num设定元素的滚动位置
el.scrollTo(x, y)
el.scrollBy(x, y)
window.scrollTo(x, y)
window.scrollBy(x, y)
window.innerWidth / Height窗口内部宽高（css像素）
```

### DOM的改变并不会立刻渲染

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <p>0</p>
  <p>1</p>
  <p>2</p>
  <p>3</p>
  <p>4</p>
  <button onclick="remove()">remove</button>
  <script>
    function remove() {
      var ps = document.getElementsByTagName('p')

      ps[4].parentNode.removeChild(ps[4])

      var a = prompt('are you ok?')//这里停住 并没有立刻渲染
      console.log(ps.length)

      ps[3].parentNode.removeChild(ps[3])
      ps[2].parentNode.removeChild(ps[2])
      ps[1].parentNode.removeChild(ps[1])
      ps[0].parentNode.removeChild(ps[0])
    }
    //函数执行完才画

  </script>
  
  <script>
    //当程序要求位置或者大小像offsetHeight 或 getBoundingClientRect
    function remove() {
      var ps = document.getElementsByTagName('p')

      ps[0].parentNode.removeChild(ps[0])

      console.time('get size of element')
      console.log(ps[0].getBoundingClientRect())
      //这行代码运行时会暂停js 计算新布局返回 但不会渲染
      console.timeEnd('get size of element')

      ps[3].parentNode.removeChild(ps[3])
      ps[2].parentNode.removeChild(ps[2])
      ps[1].parentNode.removeChild(ps[1])
      ps[0].parentNode.removeChild(ps[0])
    }
  </script>
</body>

</html>
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
  <p><span id="one"></span></p>
  <p><span id="two"></span></p>
</body>
<script>
  function time(name, action) {
    var start = Date.now()
    action()
    console.log(name, " took ", Date.now() - start, "ms ")
  }
  time(" naive ", function () {
    var target = document.getElementById("one")
    while (target.offsetWidth < 2000)
      target.appendChild(document.createTextNode("X"))
  })//131ms

  time(" clever ", function () {
    var target = document.getElementById("two")
    target.appendChild(document.createTextNode(" XXXXX "))
    var total = Math.ceil(2000 / (target.offsetWidth / 5))
    for (var i = 5; i < total; i++)
      target.appendChild(document.createTextNode("X"))
  })//1ms
  //计算一个x的宽度 不用重复计算布局快
</script>

</html>
```

* node.normalize()

```javascript
// $0.normalize() //把元素里连续子文本结点合并成一个
function normalize(node) {
  if (node.nodeType === document.ELEMENT_NODE) {
    var childs = Array.from(node.childNodes) //静态 不然动态会乱
    var text = ''
    for (var i = 0; i < childs.length; i++) {
      var chlid = childs[i]
      if (childs.nodeType === document.TEXT_NODE) {
        text += child.nodeValue
        node.removeChild(child)
      } else if (child.nodeType != document.TEXT_NODE) { //连续的文本结束了
        if (text) {  //防止在连续非文本之间插入空text
          var textNode = document.createTextNode(text)
          node.insertBefore(textNode, child)
          text = ''
        }
      }
    }
    if (text) {
      var textNode = document.createTextNode(text)
      node.appendChild(textNode)                    //最后连续文本加上
    }
  }
}
```

### Query selectors

```javascript
document.querySelectorAll('div p') //根据css选择器 选择元素

返回selectAll的第一个元素
function querySelector(selector){
  return querySelectorAll(selector)[0]
}

//简写 只有浏览器能用
$('div p')  select
$$('div p') selectAll
```

1.选择器是在全局范围内match

2.可以选择一部分伪类

3.不能选择伪元素

4.返回静态集合，不会动态更新

5.返回后代元素 不包括自己 

#### 语法树 

```javascript
var expr = '|(&(t,f,t),!(t))'

var parseBoolExpr = function (expression) {
  expr = expression
  i = 0
  var syntaxTree = parseExpr()
  return runTree(syntaxTree)
}

function transformToCstyle(root) {
  if (root.type == 'fcall') {
    switch (root.name) {
      case "&":
        return 'and(' + root.params.map(transformToCstyle).join(',') + ')'
      case "|":
        return 'or(' + root.params.map(transformToCstyle).join(',') + ')'
      case "!":
        return 'not(' + root.params.map(transformToCstyle).join(',') + ')'
    }
  } else if (root.type === 'value') {
    return '' + root.value
  }
}

function transformToLispstyle(root) {
  if (root.type == 'fcall') {
    switch (root.name) {
      case "&":
        return '(and' + root.params.map(transformToLispstyle).join(' ') + ')'
      case "|":
        return '(or' + root.params.map(transformToLispstyle).join(' ') + ')'
      case "!":
        return '(not' + root.params.map(transformToLispstyle).join(' ') + ')'
    }
  } else if (root.type === 'value') {
    return '' + root.value
  }
}

function transformToMathstyle(root) {
  if (root.type == 'fcall') {
    switch (root.name) {
      case "&":
        return '(' + root.params.map(transformToMathstyle).join(' && ') + ')'
      case "|":
        return '(' + root.params.map(transformToMathstyle).join(' || ') + ')'
      case "!":
        return '!(' + root.params.map(transformToMathstyle).join('') + ')'
    }
  } else if (root.type === 'value') {
    return '' + root.value
  }
}
function runTree(root) {
  if (root.type == 'fcall') {
    switch (root.name) {
      case '&':
        var and = (...args) => args.reduce((a, b) => a && b)
        return and(...root.params.map(runTree))
      case '|':
        var and = (...args) => args.reduce((a, b) => a || b)
        return and(...root.params.map(runTree))
      case '!':
        return !runTree(root.params[0])
    }
  } else if (root.type == 'value') {
    return root.value
  }
}

function parseExpr() {
  if (expr[i] == '&') {
    return parseAnd()
  }
  if (expr[i] == '|') {
    return parseOr()
  }
  if (expr[i] == '!') {
    return parseNot()
  }
  if (expr[i] == 't') {
    return parseTrue()
  }
  if (expr[i] == 'f') {
    return parseFalse()
  }
}

function parseTrue() {
  i++
  return {
    type: 'value',
    name: 't',
    value: true
  }
}

function parseFalse() {
  i++
  return {
    type: 'value',
    name: 'f',
    value: false
  }
}

function parseAnd() {
  var node = {
    type: 'fcall',
    name: '&',
    params: []
  }
  // &(a,b,c)
  i += 2
  while (true) {
    node.params.push(parseExpr())
    if (expr[i] === ')') {
      break
    } else {
      i++
    }
  }
  i++
  return node
}

function parseOr() {
  var node = {
    type: 'fcall',
    name: '|',
    params: []
  }
  // |(a,b,c)
  i += 2
  while (true) {
    node.params.push(parseExpr())
    if (expr[i] === ')') {
      break
    } else {
      i++   //skip ,
    }
  }
  i++      //遇到反括号出来 skip )
  return node
}

function parseNot() {
  var node = {
    type: 'fcall',
    name: '!',
    params: []
  }
  // !(a,b,c)
  i += 2
  while (true) {
    node.params.push(parseExpr())
    if (expr[i] === ')') {
      break
    } else {
      i++
    }
  }
  i++
  return node
}
```

```html
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <p style="margin-top:200px;text-align: center;">
    <img src="" style="border: 2px solid red; position: relative" alt="cat">
  </p>
  <script>
    var cat = document.querySelector('img')
    var angle = 0
    var lastTime = null

    function animate(time) {
      if (lastTime != null) {
        angle += (time - lastTime) * 0.001
      }//按照时间 不同刷新率相同速度 离开也会运行 定死角度离开还在原地
      lastTime = time
      cat.style.top = Math.sin(angle) * 20 + 'px'
      cat.style.left = Math.cos(angle) * 200 + 'px'
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate) //让一个函数在未来某个时间点(下一帧之前)执行
  </script>
</body>

</html>
```

> $0.style.xxx  内联样式
>
> window.getComputedStyle()  获取计算样式

### DOM 补充

![image-20200630201754172](11%20Dom.assets/image-20200630201754172.png)

* innerText和outerText 相同 当做文本 不会当成html
* outerHTML  包含标签自身  innerHtml 子html  都是getter和setter
* outerHtml可以直接赋值

```javascript
innerHTMLDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype.__proto__,   'innerHTML')
innerHTMLDescriptor.get.call($0)
```

```javascript
function getOuterHTML(node) {
      var result = '<'
      result += node.tagName
      result += '>'
      for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i]
        if (child.nodeType == document.TEXT_NODE) {
          result += child.nodeValue
        } else if (child.nodeType == document.ELEMENT_NODE) {
          result += getOuterHTML(child)
        }
      }
      result += '</' + node.tagName + '>'
      return result
    }
```

```javascript
function JSONStringify(value) {
      if (Array.isArray(value)) {
        var result = '['
        for (var i = 0; i < value.length; i++) {
          result += JSONStringify(value[i])
          if (i < value.length - 1) {
            result += ','
          }
        }
        result += ']'
        return result
      }
      if (typeof value == 'string') {
        return '"' + value + '"'
      }
      if (typeof value == 'number') {
        return '' + value
      }
      if (typeof value === 'boolean') {
        return '' + value
      }
      if (value === null) {
        return 'null'
      }
      if (typeof value === 'object') {
        var result = '{'
        for (var key in value) {
          var val = value[key]
          result += '"' + key + '":'
          result += JSONStringify(val) + ','
        }
        result = result.slice(0, -1) //去掉最后一个逗号
        result += '}'
      }
    return result
    }
```

