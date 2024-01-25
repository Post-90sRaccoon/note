# Handling Events

###  event handlers

```javascript
window.addEventListener("click", function () {
 console.log("you clicked")
})
```

### Events and DOM nodes

```html
<button>Click me</button>
<p>No handler here</p>
```

```javascript
var button = document.querySelector("button")
button.addEventListener('click', () => {
  console.log(this) //[object HTMLButtonElement] 不用匿名函数是button 不然是window
  console.log("button clicked")
})
```

* `document.querySelector()` 返回文档中与指定选择器或选择器组匹配的第一个 `html` 元素[`Element`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)。 如果找不到匹配项，则返回`null`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

```javascript
var button = document.querySelector("button")
button.onclick = function () {
  console.log('button clicked')
}
```

* `onclick` 属性只有一个 可以变成 `set`

```javascript
let a = []
Object.defineProperty(a, "foo", {
  set: function (val) {
    this.push(val)
  }
})

a.foo = 5
a.foo = 8
//赋值就会增加
```

```javascript
if (a == 1 && a == 2 && a == 3) {
  console.log(true)
}
// 有无可能让上面 if 条件成立 a 是 getter 就可以了 第一调用返回 1 第二次返回 2

var i = 1
Object.defineProperty(window, 'a', {
  get: function () {
    return i++
  }
})
```

```html
<button onclick="foo()">Click me</button>
<p>No handler here</p>
```

```javascript
var button = document.querySelector("button")
function foo() {  //必须在全局
  console.log(2)
}

button.onclick = function () { //只能一次
  console.log(3)
}

button.addEventListener('click', function () { //也能全局 也能多次
  console.log('1')
})
// 3 1
```

#### 删除监听方法

```javascript
button.onclick = null

var button = document.querySelector("button")
function once() {
  console.log("Done.")
  button.removeEventListener("click", once)
}
button.addEventListener("click", once)
//传入同一个函数once才能删
```

```javascript
 var button = document.querySelector("button")
button.addEventListener("click", function(){
  console.log(1)
})
button.removeEventListener("click", function(){
  console.log(1)
})
//不能删除 不是同一个函数
```

```javascript
var button = document.querySelector("button")
button.addEventListener('click',function(){
  button.removeEventListener('click',arguments.callee) //调用函数自己
})
```

### Event objects

```javascript
var button = document.querySelector("button")
button.addEventListener('click', function (e) {
  console.log(e)
  console.log('1')
})

//MouseEvent
//mousedown(按下去不松手) click
```

> event 对象属性
>
> altKey boolean 是否同时按下alt
>
> ctrlKey
>
> detail  连续快速点击中的第几次

* 早期版本IE浏览器不会以参数形式传 而是在时间发生的过程中将事件对象存储在一个名为event的全局变量中。运行过程中有events，运行结束销毁

```javascript
var button = document.querySelector("button")
    button.addEventListener("mousedown", function (event) {
      if (event.which == 1)
        console.log('Left button')
      else if (event.which == 2)
        console.log('middle button')
      else if (event.which == 3)
        console.log('Right button')
    })

// 在事件运行的过程中获取鼠标相对于node的位置
    function mouse(node) {
      var e = window.event
      var elPos = node.getBoundingClientRect()
      var x = e.clientX
      var y = e.clientY
      return {
        x: x - elPos.left,
        y: y - elPos.top,
      }
    }
```

* getBoundingClientRect()返回一个DOMRect对象 。包括bottom，height，left，right，top，width，x（left），y（top）

#### 关于position

* **pageX/pageY:**
  鼠标相对于整个页面的 X/Y 坐标。
  整个页面就是整个网页的全部，比如说网页宽2000px，高3000px，那 `pageX,pageY` 的最大值就是它们了。
  特别说明：IE不支持！

* **clientX/clientY**
  事件发生时鼠标在浏览器内容区域的X/Y坐标（不包含滚动条）。
  浏览器内容区域即浏览器窗口中用来显示网页的可视区域，注意这个可视，也就是说需要拖动滚动条才能看到的区域不算。
  当你将浏览器窗口缩小时，clientX/clientY的最大值也会缩小，但始终，它们的最大值不会超过你浏览器可视区域。
  特别说明：IE下此属性不规范，它们的最小值不是0而是2，也就是说IE下的clientX/clientY比火狐下始终大2px。

* **screenX/screenY**
  鼠标在屏幕上的坐标。screenX,screenY的最大值不会超过屏幕分辨率。

* **offsetX/offsetY:**获取到是触发点相对被触发dom的左上角距离，不过左上角基准点在不同浏览器中有区别，其中在IE中以内容区左上角为基准点不包括边框，如果触发点在边框上会返回负值，而chrome中以边框左上角为基准点。

  ![a](13%20Handing%20Events.assets/a.png)

  

* `Event objects` 的 `type` 属性总是表示事件类型

```javascript
var button = document.querySelector("button")
    button.addEventListener("click", function (e) {
      console.log(1)
      var start = Date.now()
      while (Date.now() - start < 1000) {

      }
    })

    button.addEventListener('dblclick', function (e) {
      console.log(2)
    })
//双击打印1 1 2 不会两个函数同时运行
//第一下 第一个click运行 第二下点击 第一个click运行完毕 发现第二个点击 运行第二个click 结束后运行dblclick
```

### Propagation

* 事件冒泡
* 注册在祖先元素上的处理程序在后代元素发生相应事件时也会被调用。比如p标签内的一个button按钮被点击时，也会触发p元素的click事件
```html
<p>
  <button>Click me</button>
  Handler here
</p>
```

```javascript
 var p = document.querySelector('p')
    document.body.addEventListener('click', () => {
      console.log('body click')
    })

    p.addEventListener('click', () => {
      console.log(1)
    })
//点击p 打印1 click  冒泡只会向祖先元素冒泡 给head加listener不会触发
```

```javascript
    var p = document.querySelector('p')
    var button = document.querySelector('button')

    button.addEventListener('click', (e) => {
      console.log('btn click')
    })
    //不写箭头的话this是button 写箭头是window 全局变量
    //e.currentTarget 是button

    document.body.addEventListener('click', (e) => {
      console.log('body click')
    })
    //this是body
    //e.currentTarget 是body

    p.addEventListener('click', (e) => {
      e.stopPropagation() //事件不会往更外一层传递了
      console.log('p click')
    })
    //this是p
    //e.currentTarget 是p

//三个e是同一个事件对象
```

```javascript
p.addEventListener('click', (e) => {
      e.stopImmediatePropagation()//阻止时间向外扩散 且阻止当前元素对当前事件的后序函数的调用
      console.log('p click')      //会执行
    })
    p.addEventListener('click',function(e){  //不会传递了 不会执行
      console.log('jfjkld') 
    })
```

#### 让a和里面的button互不干扰

```html
<a href="https://www.jd.com" target="_blank">foo <button class="btn-in-a">btn</button>bar</a>
```

```javascript
    var btn = document.querySelector('.btn-in-a')
    var a = document.querySelector('a')

    a.addEventListener('click', function (e) {
      console.log('a click')//点击不会打印a click 但会因为默认行为打开jd
    })


    btn.addEventListener('click', function (e) {
      console.log('btn click')
      e.stopPropagation()
      e.preventDefault()
      //阻止默认行为
    })
```

* 大多数事件对象的target属性指向了事件发生时最原始发生的元素。

```html
<!-- 只想处理里面class为foo的元素被点击 -->
<div>
    <form action="">
      <div>
        <span>姓名</span><input class="foo fob" type="text">
        <span>性别</span><input class="bar" type="text">
        <span>姓名</span><input class="foo foz col-md-3" type="text">
        <span>性别</span><input class="bar" type="text">
        <span>姓名</span><input class="foo" type="text">
        <span>性别</span><input class="bar" type="text">
      </div>
    </form>
  </div>
```

```javascript
var form = document.querySelector('form')
    form.addEventListener('click', function (e) {
      if (e.target.classList.contains('foo')) {
        console.log('INPUT IN ME is clicked')
      }
      if (e.target.matches('form input.foo')) {//matches 参数为selector 选择器}
      }
    })
```

* 事件代理 事件委托 Event Delegate  事件绑定在公共父元素  通过e.target判断来源

```javascript
//实现jQuery的委托函数 node.on(eventName,target,handler)

 Element.prototype.on = function (eventName, selector, handler) {
      this.addEventListener(eventName, function (e) {
        if (e.target.matches(selector)) {
          handler.call(e.target, e)
        }
      })
    }
```

```html
<div>
    <button>1</button>
    <button>2</button>
    <button>3</button>
    <button>4</button>
    <button>5</button>
  </div>
```

```javascript
var div = document.querySelector('div')
  div.addEventListener('click', e => {
    if (e.target.matches('button')) {
      var btn = e.target//实际上用户点击的元素
      console.log(btn)
      var idx = Array.prototype.indexOf.call(div.children, btn)
      // var idx = Array.from(div.children).indexOf(btn)
      console.log(idx)
      console.log(btn.textContent)
    }
  })
```

```javascript
 var btns = document.querySelectorAll('button') //拿到所有button
    for (var i = 0; i < btns.length; i++) {
      let btn = btns[i]
      btn.addEventListener('click', function (e) {
        var parent = btn.parentNode
        var idx = Array.from(parent.children).indexOf(btn)//用var btn 这里的btn一直指向5 因为代码执行完 btn = 5
        console.log(idx)
      })
    }
```

```javascript
var btns = document.querySelectorAll('button') //拿到所有button
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        console.log(i)
      })
    }
```

```javascript
 var btns = document.querySelectorAll('button') //拿到所有button
    for (var i = 0; i < btns.length; i++) {
      (function (i) {
        btns[i].addEventListener('click', function (e) {
          console.log(i)
        })
      }(i))
    }
```

### 捕获阶段

```html
<div>
    <button>Button</button>
  </div>
```

```javascript
var button = document.querySelector('button')
    var div = document.querySelector('div')

    button.addEventListener('click', e => {
      console.log('button click non capture') //冒泡阶段
    })
    button.addEventListener('click', e => {
      console.log('button click capture')
    }, true) //isCapture 是否是捕获阶段


    div.addEventListener('click', e => {
      console.log('div click non capture')
    })
    div.addEventListener('click', e => {
      console.log('div click capture')
    }, true)


    document.body.addEventListener('click', e => {
      console.log('body click non capture')
    })
    document.body.addEventListener('click', e => {
      console.log('body click capture')
    }, true)

// body click capture             捕获阶段
// div click capture              捕获阶段
// button click non capture       目标阶段  目标阶段stop 目标阶段的捕获冒泡都能执行完
// button click capture           目标阶段  按照绑定顺序 不区分捕获 冒泡  
// div click non capture          冒泡阶段
// body click non capture         冒泡阶段
//stopPorpagation 也能阻止向下捕获
```

### Default actions

* a标签点击会自动打开页面 滚轮会自动滚动网页 表单里按tab会自动跳到下一项 点击表单提交/重置将会提交/重置表单

* 对大多数事件处理程序在默认行为之前

  ```html
  <body>
    <a href="https://www.jd.coom">aaaaaa</a>
  
    <script>
      var a = document.querySelector('a')
      a.addEventListener('click', e => {
        e.preventDefault()
      })
    </script>
  </body>
  ```

  ```javascript
  window.onbeforeunload = function(){
  return '马保国'
  }
  //页面关闭前
  window.open('https://www.jd.com/')
  ```
  
  

### Key events

```html
<body>
  <p>This page turns violet when you hold the V key.</p>

  <script>
    addEventListener('keydown', function (e) {
      if (e.keyCode == 86)
        document.body.style.background = "#" + Math.random().toString(16).substr(2, 3)
      //生成随机颜色 从[2]截3位
    });
    addEventListener('keyup', function (e) {
      if (e.keyCode == 86)
        document.body.style.background = ""
    })
  </script>
</body>
```

```html
<body>
  <p>This page turns violet when you hold the V key.</p>

  <script>
    var color = null

    addEventListener('keydown', function (e) {
      if (e.keyCode == 86) {
        if (!color) {
          color = "#" + Math.random().toString(16).substr(2, 3)
          document.body.style.background = color
        }
      }
    });
    addEventListener('keyup', function (e) {
      if (e.keyCode == 86) {
        color = ""
        document.body.style.background = color
      }
    })
  </script>
</body>
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .car {
      width: 50px;
      height: 50px;
      background-color: red;
      position: fixed;
    }
  </style>
</head>

<body>
  <div class="car" style="top:0px;left:0px;">Car</div>

  <script>
    var car = document.querySelector('.car')

    window.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowUp':
          car.style.top = parseInt(car.style.top) - 1 + 'px'
          break
        case 'ArrowDown':
          car.style.top = parseInt(car.style.top) + 1 + 'px'
          break
        case 'ArrowLeft':
          car.style.left = parseInt(car.style.left) - 1 + 'px'
          break
        case 'ArrowRight':
          car.style.left = parseInt(car.style.left) + 1 + 'px'
          break
      }
    })

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
  <style>
    .car {
      width: 50px;
      height: 50px;
      background-color: red;
      position: fixed;
    }
  </style>
</head>

<body>
  <div class="car" style="top:0px;left:0px;">Car</div>

  <script>
    var car = document.querySelector('.car')

    var vx = 2
    var vy = 2

    var lastTime = null

    requestAnimationFrame(function c(time) {
      if (lastTime !== null) {
        var timeDiff = time - lastTime
        var dx = timeDiff * vx / 1000
        var dy = timeDiff * vy / 1000
        car.style.left = parseFloat(car.style.left) + dx + "px"
        car.style.top = parseFloat(car.style.top) + dy + "px"
      }
      lastTime = time
      requestAnimationFrame(c)
    })

    window.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowUp':
          vy--
          break
        case 'ArrowDown':
          vy++
          break
        case 'ArrowLeft':
          vx--
          break
        case 'ArrowRight':
          vx++
          break
      }
    })
  </script>
</body>

</html>
```

#### 键盘无冲

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .car {
      width: 50px;
      height: 50px;
      background-color: red;
      position: fixed;
    }
  </style>
</head>

<body>
  <div class="car" style="top:0px;left:0px;">Car</div>

  <script>
    var car = document.querySelector('.car')

    var vx = 0
    var vy = 0

    var lastTime = null

    requestAnimationFrame(function c(time) {
      if (lastTime !== null) {
        var timeDiff = time - lastTime
        var dx = timeDiff * vx / 1000
        var dy = timeDiff * vy / 1000
        car.style.left = parseFloat(car.style.left) + dx + "px"
        car.style.top = parseFloat(car.style.top) + dy + "px"
      }
      lastTime = time
      requestAnimationFrame(c)
    })

    window.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowUp':
          vy = -15
          break
        case 'ArrowDown':
          vy = 15
          break
        case 'ArrowLeft':
          vx = -15
          break
        case 'ArrowRight':
          vx = 15
          break
      }
    })

    window.addEventListener('keyup', e => {
      switch (e.key) {
        case 'ArrowUp':
          vy = 0
          break
        case 'ArrowDown':
          vy = 0
          break
        case 'ArrowLeft':
          vx = 0
          break
        case 'ArrowRight':
          vx = 0
          break
      }
    })

  </script>
</body>

</html>
```

 ```html
<body>
  <p>Press Crtl-Space to continue</p>
  <script>
    addEventListener("keydown", function (e) {
      if (e.ctrlKey && e.keyCode == 32)
        console.log("Countinuing")
    })
  </script>
</body>
 ```

```javascript
    //在keydown之后触发  按产生字符的键才能触发
    window.addEventListener('keypress', e => {
      console.log(String.fromCharCode(e.charCode))
    })
```

* 被focus才能触发键盘事件。没有任何focus，键盘事件在document.body上触发。

### Mouse clicks

* 点击事件在mouse up后触发

![image-20200701204726237](13%20Handing%20Events.assets/image-20200701204726237.png)

* 点击可以获得pageX  pageY 相当于文档左上角
* clientX clientY相当于浏览器左上角
* getBoundingClientRect 元素位置

#### 点点

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<style>
  body {
    height: 200px;
    background: beige;
  }

  .dot {
    height: 8px;
    width: 8px;
    border-radius: 4px;
    background: blue;
    position: absolute;
  }
</style>

<body>

  <script>
    window.addEventListener("click", function (event) {
      var dot = document.createElement("div")
      dot.className = "dot"
      dot.style.left = (event.pageX - 4) + "px"
      dot.style.top = (event.pageY - 4) + "px" //-4 不然对准的是鼠标的中间 不是箭头 而是div左上角对准了点 不是中心
      document.body.appendChild(dot)
    })
  </script>
</body>

</html>
```

```javascript
var shouldDraw = false
    window.addEventListener("mousedown", e => {
      shouldDraw = true
    })
    window.addEventListener("mouseup", e => {
      shouldDraw = false
    })

    window.addEventListener("mousemove", function (event) {
      if (shouldDraw) {
        var dot = document.createElement("div")
        dot.className = "dot"
        dot.style.left = (event.pageX - 4) + "px"
        dot.style.top = (event.pageY - 4) + "px"
        document.body.appendChild(dot)
      }
    })//mousemove函数一直在执行
```

```javascript
var draw//draw必须声明在外面 不然remove读取不到draw
    window.addEventListener("mousedown", e => {
      window.addEventListener("mousemove", draw = e => {
        var dot = document.createElement("div")
        dot.className = "dot"
        dot.style.left = (event.pageX - 4) + "px"
        dot.style.top = (event.pageY - 4) + "px"
        document.body.appendChild(dot)
      })
    })


    window.addEventListener("mouseup", e => {
      removeEventListener('mousemove', draw)
    })
```

#### Mouse motion

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
  </style>
</head>

<body>
  <p>Drag the bar to change its width</p>
  <div style="background:orange;width:60px;height:20px"></div>
  <script>
    var lastX
    var div = document.querySelector('div')
    addEventListener('mousedown', function (e) {
      if (e.which == 1) {
        lastX = e.pageX
        addEventListener('mousemove', moved)
        e.preventDefault()//鼠标拖动默认行为 选中文字
      }
    })

    function buttonPressed(e) {
      if (e.buttons == null)
        return e.which != 0
      else
        return e.buttons != 0
    }

    function moved(e) {
      if (!buttonPressed(e)) {
        removeEventListener('mousemove', moved)
      } else {
        var dx = e.pageX - lastX
        var newWidth = Math.max(10, div.offsetWidth + dx)
        div.style.width = newWidth + 'px'
        lastX = e.pageX
      }
    }
  </script>
</body>

</html>
```

* which  最后按下的键位
* buttons   0 0 0 三位二进制数 代表 中 右 左  这样可以支持同时按鼠标左中右键 4 2 1 通过或运算判断

#### 拖拽方块

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      div {
        position: absolute;
        width: 200px;
        height: 100px;
        user-select:none; /*不会选中 就不需要的阻止默认行为了*/
      }
    </style>
  </head>

  <body>
    <div style="background-color:red;left: 0px;top: 0px;z-index: 0;"></div>
    <div style="background-color:blue;left: 0px;top: 0px;z-index: 0;"></div>
    <div style="background-color:orange;left: 0px;top: 0px;z-index: 0;"></div>
    <script>
      let drag
      let baseZ = 0
      addEventListener('mousedown', (e) => {
        let target = e.target
        if (target.tagName == 'DIV') {
          let lastX = e.pageX
          let lastY = e.pageY
          target.style["z-index"] = baseZ + 1
          baseZ += 1
          addEventListener('mousemove', drag = e => {
            e.preventDefault()
            target.style.left = parseFloat(target.style.left) + e.pageX - lastX + 'px'
            target.style.top = parseFloat(target.style.top) + e.pageY - lastY + 'px'
            lastX = e.pageX
            lastY = e.pageY
          })
        }
      })

      addEventListener('mouseup', (e) => {
        removeEventListener('mousemove', drag)
        if (parseFloat(e.target.style.left) < 200) {
          e.target.style.left = 0
        }
      })
		//改进 不一定mouseup解绑 mouseup有时候捕获不到 比如拖拽文字松手时 所以在mousemove是解绑mousemove 
    //判断左键是否按下 如果没按下 解绑
    </script>
  </body>
  </html>
</body>

</html>
```

#### 不松手磁吸方块

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .dragRect {
      width: 200px;
      height: 200px;
      position: fixed;
    }
  </style>
</head>

<body>
  <div class="dragRect" style="left: 0;top: 0;background-color:orange;"></div>
  <div class="dragRect" style="left: 0;top: 0;background-color:red;"></div>
  <div class="dragRect" style="left: 0;top: 0;background-color:blue;"></div>

  <script>
    let baseZ = 0
    let startX
    let startY
    let elStartX
    let elStartY
    let elem
    addEventListener('mousedown', (e) => {
      if (e.target.matches('.dragRect')) {
        elem = e.target
        elem.style.zIndex = baseZ++
        if (event.which == 1) {
          startX = e.pageX
          startY = e.pageY //鼠标开始位置
          elStartX = parseFloat(elem.style.left)
          elStartY = parseFloat(elem.style.top) //元素开始位置
          addEventListener('mousemove', drag)
        }
      }
    })

    function drag(e) {
      e.preventDefault()
      if (e.which == 0) {
        removeEventListener('mousemove', drag)
      }
      let dx = e.pageX - startX
      let dy = e.pageY - startY

      let left = elStartX + dx
      let top = elStartY + dy

      // target.style.left = parseFloat(target.style.left) + e.pageX - lastX + 'px'
      // 这样吸住时 parseFloat(target.style.left) 是 0
      // dx 是很小的值 除非瞬间拉开50px 否则一直吸死
      // 记录元素初始位置可以慢慢拉

      if (left < 50) {
        left = 0
      }
      if (left > innerWidth - elem.offsetWidth - 50) {
        left = innerWidth - elem.offsetWidth
      }
      if (top < 50) {
        top = 0
      }
      if (top > innerHeight - elem.offsetHeight - 50) {
        top = innerHeight - elem.offsetHeight
      }

      elem.style.left = left + 'px'
      elem.style.top = top + 'px'
    }
  </script>
</body>

</html>
```

#### 鼠标移动

```html
<div id="div">
    <!-- 这里id合法 会创建全局变量 不需要querySelector了 -->
    fdlsjkaskdlkf
    <section>adslkfjaslk</section>
  </div>
  <script>
    div.addEventListener("mouseover", e => {
      div.style.background = "red"
    })
    div.addEventListener("mouseout", e => {
      div.style.background = ""
    })
    //鼠标从父元素移动到子元素 也会触发父元素mouseout事件 mouseout会冒泡
  </script>
```

* mouse从div 移动到section  触发div的mouseout事件，然后section触发mouseover，然后冒泡到div再次触发div的mouseover

#### relatedTarget

* mouseover e.relatedTarget告诉你鼠标从哪来
* mouseout  e.relatedTarget告诉鼠标去了哪 

```html
<p>Hover over this <strong>paragraph</strong></p>
  <script>
    var para = document.querySelector("p")
    function isInside(node, target) {
      for (; node != null; node = node.parentNode) {
        if (node == target) return true
      }
    }

    para.addEventListener("mouseover", function (event) {
      if (!isInside(event.relatedTarget, para)) {//判断鼠标是否从外面进来
        para.style.color = "red"
      }
    })
    para.addEventListener("mouseout", function (event) {
      if (!isInside(event.relatedTarget, para)) {//鼠标是否去了外面
        para.style.color = ""
      }
    })
  </script>
```

* 现代浏览器有mouseenter和mouseleave 不会冒泡

### Scroll events

* 元素有滚动条 而不是页面滚动

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<style>
  .progress {
    border: 1px solid blue;
    width: 100px;
    position: fixed;
    top: 10px;
    right: 10px;
  }

  .progress>div {
    height: 12px;
    background: blue;
    width: 0%;
  }

  body {
    height: 2000px;
  }
</style>

<body>
  <div class=" progress ">
    <div></div>
  </div>
  <p> Scroll me ... </p>
  <script>
    var bar = document.querySelector(".progress div ")
    addEventListener("scroll", function () {
      var max = document.body.scrollHeight - innerHeight //页面整体高度 - 窗体高度
      var percent = (pageYOffset / max) * 100  //pageYOffset 是scrollY的别名
      bar.style.width = percent + "%"
    })
  </script>
</body>

</html>
```

* 滚动事件没法阻止默认行为 
* 想要阻止，可以阻止mousewheel

```javascript
 addEventListener("mousewheel", e => {
      e.preventDefault()
    }, {
   		useCapture：true  //捕获阶段
      passive: false //可能调用
    })
```

>被动事件  大多数事件函数在默认行为发生前执行
>
>所以才可以在函数内调用 e.preventDefault()阻止默认行为
>
>但是，大多数事件处理函数并不会阻止默认行为发生
>
>即不会调用preventDefault() 函数
>
>但是，浏览器依然会先运行函数在执行默认行为
>
>然而运行函数有时间开销，而如果默认行为是诸如滚动页面等影响用户体验的交互
>
>那么时间开销将会让滚动有所延迟，即影响用户体验
>
>为了让滚动行为更加跟手，时间绑定的时候可以告诉浏览器改时间函数不会调用preventDefault() 这样一来浏览器可以在时间发生后立即执行默认行为而不必等待时间函数运行完才执行

### Focus events

* 获得焦点 focus
* 失去焦点 blur
* 这两个事件不冒泡
* foucusin/out 事件可冒泡

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <p>Name:<input type="text" data-help="Your full name"></p>
  <p>Age:<input type="text" data-help="Age in years"></p>
  <p id="help"></p>

  <script>
    var help = document.querySelector("#help")
    // var fields = document.querySelectorAll("input")
    // for (var i = 0; i < fields.length; ++i) {
    //   fields[i].addEventListener("focus", function (event) {
    //     var text = event.target.getAttribute("data-help")
    //     help.textContent = text
    //   })
    //   fields[i].addEventListener("blur", function (event) {
    //     help.textContent = ""
    //   })
    // }

    //事件代理写法 因为focus和blur不冒泡所以这里不能用
    // document.addEventListener('focusin', e => {
    //   help.textContent = e.target.dataset.help
    // })
    // document.addEventListener('focusout', e => {
    //   help.textContent = ""
    // })

    //捕获代理 不能冒泡 可以捕获
    document.addEventListener('focus', e => {
      help.textContent = e.target.dataset.help
    }, true)
    document.addEventListener('blur', e => {
      help.textContent = ""
    }, true)    
     document.addEventListener('mouseover', e => {
      if (e.target.matches('input')) {
        e.target.focus()
      }
    })
  </script>
</body>

</html>
```

* window也有focus和blur

### Load event

* window.onload是在页面中所有的资源加载完成的时候触发的包括图片，脚本，css等等

```javascript
// document.addEventListener('readystatechange'){
    //    console.log(document.readyState)
    //}文档解析前是一个值 解析中是一个值 解析后又是一个值 解析过程事件触发两次

    document.addEventListener('DOMContentLoaded', e => {
      console.log('dom parse complete')
      //document.querySelector('img').addEventListener()
    })
    //绑定元素 写在DOM解析之后 如果绑定元素 不要写在html前面 dom解析之后写 也可以写在方法的里面
    // window.onload = function(){

    // }
    window.addEventListener('load', e => {
      console.log("all resource loaded")
    })
```

#### 延迟script的运行

```html
<script>console.log(1)</script>
<script src="aaa.js"></script> <!-- 假设aaajs 内容 console.log(2) -->
<script>console.log(3)</script>
<!--1 2 3-->
<script src="aaa.js" defer></script> <!-- 不等，向下运行 相对顺序不变 -->
<script src="aaa.js" async></script> <!-- 不等，向下运行 相对顺序可能变 谁先加载完成谁先 -->
```

* 加载外部资源（src ）的都有load事件 a标签没有 资源加载成功后触发
* 不冒泡 可以捕获

#### 图片渐现

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    img {
      transition: 5s;
    }
  </style>
</head>

<body>
  <img src="https://xieranmaya.github.io/images/cats/photo-103450229.jpg" alt="">
  <img src="https://xieranmaya.github.io/images/cats/photo-108273877.jpg" alt="">
  <img src="https://xieranmaya.github.io/images/cats/photo-115203323.jpg" alt="">
  <img src="https://xieranmaya.github.io/images/cats/photo-23583825.jpg" alt="">
  <img src="https://xieranmaya.github.io/images/cats/stock-photo-123942383.jpg" alt="">
  <img src="https://xieranmaya.github.io/images/cats/stock-photo-124559545.jpg" alt="">
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      var imgs = document.querySelectorAll('img')
      imgs.forEach(img => {
        document.body.removeChild(img)
        img.addEventListener('load', () => {
          document.body.append(img)
          img.style.opacity = '0'

          requestAnimationFrame(() => {
            img.style.opacity = '1'
          })
        })
      })
    })
  </script>
</body>

</html>
```

### Setting timers

* setTimeout  设置定时
* requestAnimationFrame 重新绘制时调用（下一帧）

```javascript
setTimeout(function () {
    console.log(1)
  }, 0) //先存起来 等浏览器空闲后执行
  console.log(2)
  // 2 1




setTimeout(function () {
  console.log(1)
}, 1000) //不是1秒后执行 而是至少等待1秒

var start = Date.now()
while (Date.now() - start < 1500) {

}  //+1.5s 然后打印2 然后打印1

console.log(2)
// 2 1
```

* 取消调用

  ```javascript
  a = setTimeout(()=>console.log(2),2000)
  clearTimeout(a)
  
  cancelAnimationFrame(id )
  ```

* 间歇性执行函数

```javascript
setInterval(()=>{
 console.log(1)
},1000)

 setTimeout(function foo(){
      console.log(1)
      setTimeout(foo,1000)
    },1000)

clearInterval(id)
```

* setInterval 里面有查了其他任务 执行完立刻补一次 

> 17  39.775  
>
> 18  41.775  
>
> 死循环  51.917  
>
> 19 51.918 
>
> 20 53.775
>
> 21 55.775 

### Debouncing

* 有些事件频繁执行，如mousemove，scroll。

* 运行JS，解析DOM,计算layout，paint在一个线程里，同一时间只能执行一个。

* 同时发生 1.JS和被动事件的滚动  2.JS 和css3的transform和animation

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    div {
      width: 50px;
      height: 50px;
      background-color: red;
      animation: spin 5s infinite linear;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }
  </style>
</head>

<body>
  <div></div>
  <script>
    //死循环 不影响转动
  </script>
</body>

</html>
```

* 防抖 ： 先不执行，到某时间执行，但某时间之前又要执行，前一次取消，执行这次。
* 节流：密集执行好多次  降频执行 

>  防抖例子 显示输入文字

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <input type="text"> 
</body>
<script>
  var input = document.querySelector('input')
  var id = null
  input.addEventListener('keypress', function (e) {
    clearTimeout(id)
    id = setTimeout(() => {
      showSuggestion(e)
    }, 500)
  })

  function showSuggestion(e) {
    console.log('show', input.value)
  }
</script>

</html>
```

> 节流例子 显示鼠标坐标

```javascript
 var lastTime = 0

  function displayCoords(event) {
    document.body.textContent = "Mouse at " + event.pageX + "," + event.pageY
  }

  window.addEventListener('mousemove', e => {
    var now = Date.now()
    if (now - lastTime > 250) {
      displayCoords(e)
      lastTime = Date.now()
    }
    //有问题  没到250ms  就停止mousemove  显示的坐标是上一个250ms的位置 不是最后停下的位置
  })
```

```javascript
a = 2
    setTimeout(() => {
      console.log(a)
    }, 5000)
//先执行上面   
//中间加上
a = 5
//5
```

```javascript
  function displayCoords(event) {
    document.body.textContent =
      " Mouse at " + event.pageX + ", " + event.pageY
  }
  var scheduled = false
  var lastEvent
  addEventListener("mousemove", function (event) {
    lastEvent = event //这行一直都会运行 会拿到最新的事件 mouse停止 才不运行
    if (!scheduled) {
      scheduled = true 
      setTimeout(function () {
        scheduled = false
        displayCoords(lastEvent)
      }, 250)
    }//这样会把最后一次安排上 (在停止move前 安排上) 读的lastEvent是最新的e
  })
//显示最后一次会有延迟 鼠标停下 距离上一次还是要过250ms才能显示
```

```javascript
 window.addEventListener('mousemove', throttle(function (event) {
    document.body.textContent = " Mouse at " + event.pageX + ", " + event.pageY
  }, 250))
//throttle里的this是上面的window window.addEventListener window调用的

  function throttle(f, time) {
    var lastEvent = null
    var scheduled = false
    return function (e) {
      lastEvent = e
      if (!scheduled) {
        scheduled = true
        setTimeout(() => {
          scheduled = false
          f.call(this, lastEvent)
        }, time)
      }
    }
  }

  function debounce(f, time) {
    var id = null
    return function (e) {
      clearTimeout(id)
      id = setTimeout(() => {
        f.call(this, e)
      }, time)
    }
  }
```

### Script execution timeline

```javascript
//worker.js
addEventListener('message', function (event) {
  var data = event.data
  var result = sqrt(data)
  postMessage(result)
})

function sqrt(num) {
  var start = Date.now()
  while (Date.now() - start < 5000) {

  }
  return Math.sqrt(num)
}

//另一个html文件 http打开 （hs-o）  //环境切换 top改成worker.js
var worker = new Worker('./worker.js') //创建worker worker里面的代码就执行了
 worker.postMessage(5)
worker.addEventListener('message', e => {
  console.log(e.data)
})

//worker.terminate() 关闭worker

//特殊对象 postMessage不是复制 而是把指针拿过去
 var sab = new SharedArrayBuffer(100) //连续100个字节空间
 int8 = new Int8Array(sab)  //把这片空间8个比特一个单位来理解
 //js进程共享一片内存
 worker.postMessage(int8)
```

* worker之间不能共享数据，只能通过时间与postMsg来发送消息所发送的消息是复制以后发送过去的，所以修改接收到手消息是不会改变源消息的。
* worker内不能访问dom，以及任何与UI相关的接口
* worker内只有this 没有window
* 进程与线程区别：不同进程之间不能共享内存。同一个进程的多个线程是可以共享这个进程的内存的。cpu的时间片轮转是以线程为单位

* postMessage(data) data是 深度克隆

#### 探测三击

```html
<script>
  let detail = 1
  let lastTime = 0
  addEventListener('click', (e) => {
    let time = Date.now()
    if (time - lastTime < 500) {
      detail++
    } else {
      detail = 1
    }
    if (detail == 3) {
      console.log('thrible click')
      // detail = 1 这样6击识别为2个三击
      //e.detail 记录点击次数
    }
    lastTime = time
  })
</script>
```

