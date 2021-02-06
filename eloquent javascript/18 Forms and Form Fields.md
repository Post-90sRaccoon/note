### Fields

#### change事件

* 表单内容发生变化 会触发change事件

* `$0.onchange`

* 文本输入框 只有光标离开输入框 且输入内容改变 才能触发change

#### input事件

* oninput
* 输入就就触发
* 输入汉语 要用触发输入法事件

```javascript
document.addEventListener('compositionstart', () => {
  console.log('c start')
})
```

* $0.value 被js改变不会触发事件

#### 获取与失去焦点

* focus blur

* autofocus 页面加载自动聚焦在这里

* document.activeElement

* document.anchors   页面里所有的链接组成的类数组 链接要有name才可以

* document.forms

  ```html
  <input type="text">
  <script>
    var text = document.querySelector('input').focus()
    console.log(document.activeElement.tagName)
  //input
    setTimeout(() => {
      document.querySelector('input').blur()
      console.log(document.activeElement.tagName)
    }, 5000);
    //body
  </script>
  ```

##### 加载后聚焦

```javascript
window.onload = function () {
  document.querySelector('#search').focus()
}

 document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#search').focus()
  })
```

* 页面加载完成前用户聚焦 浏览器就不会再自动聚焦
* tabindex = -1 按tab聚焦会被跳过

### Disabled fields

* attribute 指的是html标签
* property 指的是DOMobject的属性
* `$0.removeAttribute('disabled')`

##### 不会实时更新的属性

```javascript
$0.value //28
$0.value = 29 //29
$0.value //29 页面上显示29 但是html的源码里还是28
$0.getAttribute('value') // 28


draggable = "true" 元素被拖拽
disabled fields不能被聚焦或改变
```

```css
[disabled],: disabled{
  color: grey;
  cursor: not - allowed;
}
```

##### 按钮请求发送中不能再点

```javascript
btn.onclick = () => {
  btn.disabled = true

  post('/user/register', {
    username: 'xx',
    password: 'yy',
  }).then(userInfo => {

  }).catch(err => {

  }).then(() => {
    btn.disabled = false
  })
}

a++      //执行两次不一样 非幂等操作
a = 1    //执行多次也一样 幂等操作
```

### The form as a whole

```html
<form></form>
$0.form 指向form的dom结点  表单内部dom元素有一个form属性指向其所在的form结点
$0.elements 指向form里面所有的表单元素

  < form id = f>
   <input id = a>
   <input id = b>
  </form >
a.form === f
b.form === f 

<form action="example/submit.html">
  Value:<input type="text" name="value">
  <button type="submit">Save</button>
</form>
<script>
  var form = document.querySelector('form')
  form.addEventListener('submit', function (event) {
    console.log('Saving value', form.elements.value.value)
    event.preventDefault()
  })
</script>
```

##### 将一个表单内容转换为query string

```javascript
function normalizeForm(form) {
  var result = ''
  for (var i = 0; i < form.elements.length; i++) {
    var el = form.elements[i]
    if (el.name) {
      result += el.name + '=' + el.value
      if (i < form.elements.length - 1) {
        result += '&'
      }
    }
  }
  return result
}
//还要没考虑的情况 button radio checkbox select input textarea
//jQuery里 $('form').serialize()
```

##### extended url encode 扩展url编码

```html
  <input type="radio" name="type[]" value="a">
  <input type="radio" name="type[]" value="b">
  <input type="radio" name="type[]" value="c">
  
  <input type="checkbox" name="color['foo'][]" value="red">
  <input type="checkbox" name="color['foo'][]" value="green">
  <input type="checkbox" name="color['foo'][]" value="blue">
//序列化之后是这样的
  {
  color: {
		foo:['red', 'green', 'blue']
		}
  }
//冗余多 不太常用
```

### Text fields

* `selectionStart selectionEnd`

  光标在哪里 以及选区在哪里 从0开始 表示在第n个字符之后 和value一样 可以被写入

* `$0.value.slice($0.selectionStart, $0.selectionEnd)`

  返回选中选区
* `$0.selectionDirection`
  forward or backward

```html
<textarea></textarea>
<script>
  var textarea = document.querySelector('textarea')
  textarea.addEventListener('keydown', function (event) {
    if (event.keyCode == 113) { //f2
      replaceSelection(textarea, "Khasekhemwy")
      event.preventDefault()
    }
  })

  function replaceSelection(textarea, string) {
    var start = textarea.selectionStart
    var end = textarea.selectionEnd
    var value = textarea.value
    textarea.value = value.slice(0, start) + string + value.slice(end)
    textarea.selectionStart = textarea.selectionEnd = start + string.length
  }
</script>
```

* ==`document.getSelection()`==返回选择的内容 用来做富文本编辑器

```html
<textarea name="" id="" cols="30" rows="10"></textarea>
<script>
  var text = document.querySelector('textarea')
  text.addEventListener('copy', e => {
    var start = text.selectionStart
    var end = text.selectionEnd
    var value = text.value.slice(start, end)
    e.clipboardData.setData('text/plain', value + '\ncopyright:神枪第一，大刀步鹰')
    e.preventDefault()
  })
</script>
```

* onpaste

* oncut

* `$0.oncontextmenu` 上下文 右键菜单

```html
<input type="text"> length：<span id="length">0</span>
<script>
  var text = document.querySelector('input')
  var output = document.querySelector('#length')
  text.addEventListener("input", function () {
    output.textContent = text.value.length
  })
</script>
```

### cheackboxes and radio buttons

* `$0.checked`  false true

```html
<input type="checkbox" id="purple">
<label for="purple">Make this page purple<label>

<script>
  var checkbox = document.querySelector('#purple')
  checkbox.addEventListener("change", function () {
    document.body.style.background =
      checkbox.checked ? "mediumpurple" : ""
   })
</script>
```

* change阻止不了checked click可以
* label如果绑事件 触发 会派发给被绑定的 再次触发
* `$0.dispatchEvent(new MouseEvent('click'))`  模拟被点

```html
 Color:
 <input type="radio" name="color" value="mediumpurple">Purple
 <input type="radio" name="color" value="lightgreen">Green
 <input type="radio" name="color" value="lightblue">Blue
<script>
         var buttons = document.getElementsByName('color')
   function setColor(event) {
           document.body.style.background = event.target.value
         }
   for (var i = 0; i < buttons.length;i++) {
           buttons[i].addEventListener("change", setColor)
         }
</script>
```

### Select fields

* `$('form').serialize()` //jQuery
* `<select size='2'> `  属性 显示两个项
* `$0.options[0].selected` 

```javascript
function getSelected(selectNode) {
  let result = []
  for (let i = 0; i < selectNode.options.length; ++i) {
    if (selectNode.options[i].selected) {
      result.push(option.value)
    }
  }
  return result
}
```

```html
<select multiple>
  <option value="1">0001</option>
  <option value="2">0010</option>
  <option value="4">0100</option>
  <option value="8">1000</option>
</select> = <span id="output">0</span>
<script>
  let select = document.querySelector('select')
  let output = document.querySelector('#output')
  select.addEventListener("change", function () {
    let number = 0
    for (var i = 0; i < select.options.length;i++) {
      let option = select.options[i]
      if(option.selected) {
      number += Number(option.value)
    }
    output.textContent = number
  }
    //Array.from(select.options).filter(it=>it.selected).map(it=>it.value).map(Number).reduce((a,b)=>a+b)
  })
</script>
```

### File fields

```html
<input type="file" >
<script>
  $0.value
  //"C:\fakepath\a.js"  永远是c盘 不能赋值
</script>
```

```html
<input type="file">
<script>
  var input = document.querySelector('input')
  input.addEventListener("change", function () {
    if (input.files.length > 0) {
      var file = input.files[0]
      console.log("You chose",file.name)
      if(file.type)
      console.log("It has type",file.type)
    }
  })
  //没有属性包含文件内容 
</script>
```

```javascript
file = $0.files[0]
fr = new FileReader()
fr.readAsText(file)
fr.readAsDataURL //data64
fr.readAsArrayBuffer //拿到内存片段
//异步的
fr.onload
fr.result
```

```javascript
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    var fr = new FileReader()
    fr.onload = () => {
      resolve(fr.result)
    }
    fr.onerror = e=> {
      reject(e)
    }
    fr.readAsText(file)
  })
}
```

```javascript
var input = document.querySelector('input')
var files = input.files
for (var i = 0; i < FileList.length; i++) {
  let file = files[i]
  let fr = new FileReader()
  fr.onload = function () {
    console.log(file.name, fr.result)
  }//异步的
  fr.readAsText(file) 
}
```

```html
<form action="" method="POST" enctype="application/x-www-form-urlencoded"></form>
//默认值

//传文件要用下面这个
<form action="" method="POST" enctype="multipart/form-data"></form>
```

```
POST / HTTP/1.1
Host: localhost:8080
Connection: keep-alive
Content-Length: 1338
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
Origin: null
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryEygnkIb3DWDW9tda
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: cross-site
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: iframe
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7
Cookie: io=D-fpxqwb-7sDYChpAAAA; _ga=GA1.1.1241039338.1591886539

------WebKitFormBoundaryEygnkIb3DWDW9tda
Content-Disposition: form-data; name="username"

sfwefwefw
------WebKitFormBoundaryEygnkIb3DWDW9tda
Content-Disposition: form-data; name="avatar"; filename="paint.html"
Content-Type: text/html
```

#### ajax提交文件 formdata

```javascript
var fd = new FormData()
 fd.append('user name','lily')
 fd.append('avatar',$0.files[0],'paint.html')

xhr = new XMLHttpRequest()
xhr.open('post','http://loaclhost:8080')
xhr.send(fd)
```

#### localstorage

* 数据存在浏览器里

```javascript
localStorage.foo = 8
localStorage.setItem('username', 'marijn')
console.log(localStorage.getItem('username'))
localStorage.removeItem('username')
//只能存字符串 所以不要
localStorage.fooo = { a: 1, b: 2 }
//要这样
localStorage.fooo = JSON.stringify({ a: 1, b: 2 })
```

* localStorage以站点为单位 不是页面
* 一般是5m 
* sessionstorage 只在当前页面有效 关了就没了
* window.onstorage 在localStorage变化时触发 同一个域的页面都可以感知



> aveIcon软件转换icon图标

#### 补充

> checkbox 第三种状态  $0.indeterminate = true 这时checked 是false
>
> 上传头像 要显示图片 filereader要读成base64 fr.readAsDataURL 还有URL.createObjectURL

