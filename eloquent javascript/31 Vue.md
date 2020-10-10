#### vue检测数据变化

```html
<script src="https://unpkg.com/lodash@4.17.20/lodash.min.js"></script>
<script>
  //如何检测对象内容的变化
  function f(data) {
    let copy = _.cloneDeep(data)
    setInterval(() => {
      if (!_.isEqual(copy, data)) {
        console.log('data changed')
        copy = _.cloneDeep(data)
      }
    }, 50)
  }



  //把对象所有属性变成getter and setter 没考虑对象带环
  let ARRAY = function() { }
  ARRAY.prototype = {
    __proto__: Array.prototype,
    push() { },
    pop() { },
    shift() { },
    unshift() { },
    sort() { },
    reverse() { },
    splice() { }
  }
  function observe(data, onchange) {
    if (Array.isArray(data)) {
      data.__proto__=ARRAY.prototype
    } else {
      for (let key in data) {
        let val = data[key]
        if (val && typeof val === 'object') {
          observe(val, onchange)
          //递归深层次监听对象
        }
        Object.defineProperty(data, key, { //这段逻辑一定要走 监控这种{a:{},b:1} 改为data.a = 8
          get: function () {
            return val
          },
          set: function (value) {
            observe(value, onchange)  //data.a={q:1,p:2} 为了赋值对象时 对象里的属性也监控到
            if (value !== val) {
              val = value
              onchange()
            }
          }
        })
      }
    }
    return data
  }

  let d = { a: 1, b: [1, 2, 3, 4], c: { f: 3, e: 4 } }
  observe(d, () => {
    console.log('data changed')
  })
  //d.eflkjajk = 0 监控不到了 原来没这个属性
  //d.push(5)  监测不到
  d.todos[2] = { content: 'hello', completed: true }
  // 监控不到 数组下标不能变成getter setter

  //vue 劫持了push方法  修改现有数组的方法都被劫持了
  data.todos[2] = {}
  // 没有劫持数组下标 太长了 没必要
  data.todos[2].content = 'xxx'
  // 可以监测到 是getter setter
  data.todos.splice(2, 1, { content: 'a', completed: true })
  // 可以这样更改下标2 从第二项开始的1项换成
  Vue.set(data.todos, 3, { content: 'jdfsja', completed: true })
  //改第三项
</script>
```

#### 框架原理

```javascript
//框架得到虚拟dom
app._render() //得到VNode
//模板函数
//模板编译出的函数
app.$options.render
app._renderProxy
app._vnode //上一次的状态
app._render() //新的状态
```

#### mvvm   模型

> 设计模式  代码特定书写模式
>
> 前端常见的设计模式：
>
> 单例模式：某种东西只有一份。不像另一些类型一样有很多个实例。
>
> Math
>
> 观察者模式：由一方专门观察另一方的活动，然后在特定活动发生时通知第三方
>
> ​        事件监听与触发
>
> MVC ： Model，View，Controller 三层分离模式
>
> 纯原生前端：HTML - M, CSS - View, JS - Controller
>
> 对整个网站：Model - 数据库及对数据的定义，View - 网站的模板，C - 网站的后端业务逻辑
>
> Vue：Model - data字段，View - 模板，Controller - 事件
>
> MVVM:
>
> Model-View-View-Model,
>
> 单向数据流：数据的流向是单一方向的
>
> React/Vue：由数据得到视图，由视图中的交互得到具体的操作，由操作来改变数据，数据变化又重新得新的视图
>
> 发布/订阅模式：事件监听与触发
>
> dataSource.subscribe(function() {
>
> console.log('data changed')
>
> })

#### 组件

```html
<div></div>
<player src="xxx.mp4"></palyer>
<slider></slider>
web components
```

* 模块化：代码拆到不同文件
* 组件化：自定义标签

### Vue

```javascript
app.todos.push({content:'fdlsak',completed:true})
//响应式
app.todos[5] = {content:'jfdksl',completed:false}
//非响应式

//只有当实例被创建时就已经存在于data的property 才是响应式的
app.b = 'hi'  //非响应

//freeze() 也无法响应系统追踪变化
//浅层次的freeze 如果被freeze对象的属性指向更深层对象 那个对象不会freeze
```

* mustache.js 模板引擎

```html
<span v-once>{{msg}}</span>  <!--msg只会第一次读取 后面变了也不会读了-->
<span v-html="msg" :title="true"></span> 
<!--不转义-->
msg:"<strong>fdslkjjkflsak</strong>"
<!--布尔true不加引号-->
```

#### 动态参数

```html
<a v-bind:[attributeName]="url"></a>

<div v-bind:['foo' + 'bar']="'999'">
$0.getAttributeNames()
[":titile","v-bind:['foo'","+","'bar']"]
  
<div v-bind:['foo'+'bar']="'999'">
还是不行不能有‘+’
  
直接在html文件写模板 要避免用大写字母命名键名 浏览器会把attribute名全部强制转换为小写
```

#### 修饰符

```html
<form v-on:submit.prevent="onSubmit">...</form>
keyup.enter preventDefault
```

#### 计算属性和侦听器

```html
<span>{{countLeftItems}}</span>
```

```javascript
data{},
computed:{ //写在这里变成getter 由现有数据推导出来的数据 todos没变化 函数不需要重新运行
  countLeftItems(){  //第一次运行记录下结果取决于哪些值 那些值不变 就不会变化
    return this.$data.todos.fileter(todo=>!todo.completed).length
  }
  countLeftItems1(){
    console.log('run')
    if(this.foo=='typex'){
      return this.$data.todos.filter(todo=>!todo.completed).length
    }else{
      return this.msg
    }
  }
  countLeft(){
    return new Date() //永远第一次结果不变 发现不依赖自己的任何东西 Date.now 不是响应式依赖
  }
}

app.msg ="wjoeif"
//没有run 
app.foo ='fdsa'
run
知道了依赖msg
5 items left 变成了 wjoeif

app.todos[3].completed = false //改成相反状态
//?items left 不改变 因为以为他依赖msg 不会来计算todo.completed
```

* 计算属性是有缓存的
* 相关依赖改变时才会重新求值
* 不希望缓存 用方法替代

#### 侦听属性 watch

```javascript
data:{
  letfCount = 0
},
watch{
  todos:function(){
    this.leftCount = this.todos.filter(it=>!=it.completed).length
  }
}
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>

<body>
  <div class="container">
    数量：<input type="text" v-model="amount" /><br>
    <!-- 双向绑定 -->
    价格：<input type="text" v-model="price" /><br>
    总价：<input type="text" v-model="total" /><br>
  </div>
  <script>
    let app = new Vue({
      el: '.container',
      data: {
        price: 5,
        amount: 100,
        // total: 500
      },
      computed: {
        total: {
          get: function () {
            return this.price * this.amount
          },
          set: function (total) {
            this.amount = total / this.price
          }
        }
      }
    })
    let app = new Vue({
      el: '.container',
      data: {
        price: 5,
        amount: 100,
        total: 500
      },
      watch: {
        price: function () {
          this.total = this.price * this.amount
        },
        amount: function () {
          this.total = this.price * this.amount
        },
        total: function () {
          this.amount = this.total / this.price
        }
      }
    })

    //深层次watch
    app.$watch('todos',function(){

    },{
      deep:true,
    })
  </script>
</body>

</html>
```

#### 绑定html class

```html
<h3 :class="foobar"></h3>
```

```javascript
computed:{
  foobar(){
    return {
      aa:true,
      bb:true,
      cc:false,
    }
  }
}
//h3 class="aa" "bb"
```

##### 也可以就地书写

```html
<h3 :class="{aa:true,bb:false}"></h3>
<li :class="{'todo-item':true,computed:todo.completed,active:!todo.completed}"></li>
<!-- 有中划线要加引号 -->

<h3 :class="['foo','barrr']">todos</h3>
<!-- 数组每一项都会成为类名 数组里可以套数组 数组里面还可以套对象-->

<h3 :class="[{a:this.length>10,b:true:c:false},'foo','barrr']">todos</h3>
<!-- 表达式 -->
```

#### 绑定内联样式 一般不建议绑定内联样式

```html
<h3 :style="{border:'2px solid green',color:'red'}"></h3>
<h3 :style="{boxSizing:'border-box',color:'red'}"></h3>
会自动分成box-sizing
<div :style="{display:['-webkit-box','-ms-flexbox','flex']}"></div>
渲染数组中最后一个被浏览器支持的值
```

#### v-if

```html
v-if 先要操作多个dom

<template v-if='ok'>
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>

<div></div>

上面三个与div 同级的 template 相当于不存在
```

* v-else-if

* v-if 与 v-show

  > v-if 真正条件渲染 条件块内事件监听器和子组件销毁 重建
  >
  > v-if 惰性 初始渲染条件为假 直到第一次渲染条件为真时 才会开始渲染条件块
  >
  > 
  >
  > v-show 总会渲染 简单基于css切换
  >
  > 
  >
  > v-if 开销高 v-show初始开销高 频繁切换v-show好 运行时条件少v-if 比较好

#### 用key管理可复用的元素

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your name">
</template>

<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>

不改变输入的内容 只改变化的


<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```

* 虚拟dom对比 从根节点开始 标签不同直接完全放弃之前的 标签相同才会更改
* 按层对比 广度优先
* 元素有key key相同的元素一定会做对比 位置不同也会做对比 key不相同 位置相同也不会对比

```javascript
div = {
label：，
input：key a
}

div = {
label：，
input：key b
}
```

* input 两个key不同 不对比
* 新dom 没有 key a直接去掉key a
* 新dom 有 key b input 直接写上
* input就不是原来的input了 原来输入的就没有了



* 列表渲染v-for 建议一定要有v-key

```html
<li v-for ='(item,idx) in itmes' :key="item.message">
  {{item.message}}
</li>
```

* 编译结果 item idx将会是一个形参 li的vdom是在函数里被返回的
* app.$options.render
* 调出函数



* v-for='value in object'

  ```javascript
  object:{
    title:'a',
    author:'b',
    p:'c'
  }
  //a
  //b
  //c
  
  v-for='(vaule,name) in object'
  //第一个是value 第二个是key
  
  v-for='(vaule,name,idx) in object'
  //第三个参数index
  
  遍历顺序是Object.keys的顺序
  ```

  

```html
<div v-for="item in items" v-bind:key="item.id">
  为了性能 比如一共四个 删第三个 没key 第三个和第四个比 更改 第四个没的比 删除
  有key 第三个没的比 删除 第四个相同
</div>
```

* 不要使用对象和数组的非基本类型值作为v-for的key 请用基本类型

#### v-if 和v-for 一起用 不建议这么做 可以v-for filter

```html
<li v-if="todo.completed" v-for="(todo,index) in todos"></li>
v-for 优先级更高 先看v-for 再根据v-if显示或者不显示
```

#### 数组更新方法

#####   变更检测

>  push()
>
>  pop()
>
>  shift()
>
>  unshift()
>
>  splice()
>
>  sort()
>
>  reverse()

* 触发视图更新

##### 替换数组

> filter concat slice



* v-for可以嵌套 解析二维数组
* 计算属性getter 不能传参 要传参只能写函数
* v-for ='n in 10' 整数 1,2,3,4,5,6,7,8,9,10
* template与v-for一起使用



#### 问题解析

```html
<div class="container">
    <span v-if="s" @click="s=false">foo</span>
    <input type="text" value="jfowef">
    <button>owiejfd</button>
  </div>
<script>
    let app = new Vue({
      el: '.container',
      data: {
        s: true
      }
    })
  </script>
```

> input里面输入文字 点击span删除自己  按照根节点对比  span 对比input  span换成input 但里面输入的字应该消失重置为默认值，但实际上却不是这样。输入的字没有消失。因为浏览器用一行<!----> 占位了 span与<!----> 比 input与input比 所以输入的字没有消失 button 依然与button 对比

```javascript
//点击前
app._vnode
//点击后
app._vnode  //代码意思是上一个vnode 实际上是已经渲染后的vnode 与上一个vode对比后把当前vnode赋给了app._vnode

v-if 为假
实际上补位了一个 Comment结点 与原来的vnode对比

v-if
v-else
就不会用comment结点占位了
```

```html
 <div class="container" @click="s=false">
    <template v-if="s">
      <span>jwoe</span>
      <em>woeifj</em>
    </template>
    <template v-else>
      <em>woeifj</em>
      <span>jwoe</span>
    </template>
  </div>
  <script>
    let app = new Vue({
      el: '.container',
      data: {
        s: true
      }
    })
  </script>
```

* 只是交换了顺序，并不是改变了结点。点击之后的em和span还是等于原来的em和span
* em不闪 只是span放到了后面
* 在开发工具吧span删除 点击em span又被添加到了后面
* 把em删除  点击span  span会闪 被添加到后面 em不会出现 因为em本来应该不变的
* 不看此时此刻真实dom  只对比vnode结果修改真实dom

[vue diff](https://www.cnblogs.com/wind-lanyan/p/9061684.html)

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <style>
  </style>
</head>
<div id="container">
  <div>
    <input type="checkbox" :checked="selectAll" @click="selectToggleAll" v-show="todos.length">
    <input type="text" v-model.trim.lazy="todoText" @keyup.enter="addTodo">
  </div>
  <ul>
    <li v-for="(todo,idx) of showingTodos" :key="todo.content"
      :class="[{completed:todo.completed,active:!todo.completed}]">
      <input type="checkbox" v-model="todo.completed">
      <span v-if="selectIdx != idx" @dblclick="selectTodo(idx)">{{todo.content}}</span>
      <input v-else type="text" v-model.lazy="todo.content" @keyup.enter="selectIdx=-1" @blur="selectIdx=-1"
        class='edit-box'>
      <button @click="deleteTodo(todo)">&times;</button>
    </li>
  </ul>
  <div v-show="todos.length">
    <span>{{leftCount}} items left</span>
    <label><input type="radio" value="all" v-model="selectCategory">All</label>
    <label><input type="radio" value="active" v-model="selectCategory">Active</label>
    <label><input type="radio" value="completed" v-model="selectCategory">Completed</label>
  </div>
  <button @click="deleteCompleted" v-show='showClear'>Clear Completed</button>
</div>

<body>
  <script>
    let app = new Vue({
      befoeCreate() {
        debugger
      },
      el: '#container',
      data: {
        todoText: '',
        selectCategory: 'all',
        selectIdx: -1,
        todos: [
          {
            content: 'eat',
            completed: true
          },
          {
            content: 'drink',
            completed: false
          },
          {
            content: 'sleep',
            completed: true
          }
        ]
      },
      computed: {
        showingTodos() {
          return this.todos.filter(todo => this.selectCategory == 'all' ? true : this.selectCategory == "active" ? !todo.completed : todo.completed)
        },
        selectAll: {
          get: function () {
            return this.todos.every(todo => todo.completed) && this.todos.length
          }
        },
        leftCount: {
          get: function () {
            return this.todos.filter(todo => !todo.completed).length
          }
        },
        showClear: {
          get: function () {
            return this.todos.some(todo => todo.completed)
          }
        }
      },
      // watch: {

      // },
      methods: {
        addTodo(e) {
          if (this.todoText) {
            app.todos.push({
              content: this.todoText,
              completed: false
            })
            this.todoText = ''
          }
        },
        deleteTodo(todo) {
          app.todos = app.todos.filter(it => it !== todo)
        },
        selectTodo(idx) {
          app.selectIdx = idx
          setTimeout(() => {
            let editbox = document.querySelector('.edit-box')
            console.log(editbox)
            editbox && editbox.focus()//?
          })
        },
        selectToggleAll() {
          if (app.todos.every(todo => todo.completed)) {
            app.todos.forEach(todo => todo.completed = false)
          } else {
            app.todos.forEach(todo => todo.completed = true)
          }
        },
        deleteCompleted() {
          app.todos = app.todos.filter(todo => !todo.completed)
        }
      }
    })

  </script>
</body>

</html>
```

#### 生命周期

* Vue程序在创建 运行 销毁 过程中经历一系列步骤 叫做生命周期
* 每个步骤的前后叫做生命周期钩子

![Vue 实例生命周期](31%20Vue%E2%80%98.assets/lifecycle.png)

* init events and lifecycle

  ```javascript
  let app = new Vue()
  //把自己变成事件监听触发器
  ```

* 进入到beforeCreate 时 就已经可以监听事件了

```javascript
let app = new Vue({
      befoeCreate(){
        debugger
      }
})
this.$on('foo',function(){console.log(1)})
this.$emit('foo')
```

* init injections & reactivity 

  > 数据部分 计算属性部分全部改为getter和setter 挂在$data 和自己上面(this)

```javascript
let app = new Vue({
      befoeCreate(){
        debugger
      },
  		created(){
        debugger
      }
})
```

* 有没有el元素

* 如果没有el元素  等待`vm.$mount(el)`调用  挂载 把vue实例最终渲染结果替换掉某个元素 如果不调用 那就结束了



* 有没有template选项 没有 拿挂载点所对应的元素的outerHtml 作为他的模板
* 有template 就把template编译为render 函数  用了构建步骤的话提前编译

```javascript
let app = new Vue({
  el:`#container`,
  template:`
	<div>{{msg}}</div>
`
  //或者
  render(createElement){
  return createElement('div',{id:this.foo},['hello'])
}
})
```



* 进入beforeMount

  ```javascript
  let app = new Vue({
        befoeCreate(){
          debugger
        },
    		created(){
          debugger
        },
    		beforeMount(){
          debugger
        }
  })
  
  app.$mount('#container')
  app.$el //是死结点
  ```

  

* 挂载完成后创建了一个名为 vm.$el（由虚拟dom创建的真实dom）的元素 替换掉el

* 进入mounted钩子函数

  ```javascript
  let app = new Vue({
        befoeCreate(){
          debugger
        },
    		created(){
          debugger
        },
    		beforeMount(){
          debugger
        },
    		mounted(){
          debugger
  			}
  })
  app.$el //是活结点
  ```

  

* 进入mounted阶段 交互 修改

> data change -> before update   -> 重新拿到虚拟dom 给真实dom打补丁 然后update

```javascript
let app = new Vue({
      befoeCreate(){
        debugger
      },
  		created(){
        debugger
      },
  		beforeMount(){
        debugger
      },
  		mounted(){
        debugger
			},
  		beforeUpdate(){
        debugger
			},
  		updated(){
        debugger
      }
})
```

* 一直在mounted阶段 循环

* 当vm.$destroy()调用
* beforeDestroy
* 删掉watchers child components event listeners 防止内存泄漏
* 进入Destroyed 状态
* destroyed 钩子函数

#### 事件处理

#### 看函数如何编译

```javascript
Vue.compile('<div :id="foo" @click="foo" @dblclick="foo()"></div>')
```

* 事件修饰符

```javascript
event.preventDefault()
event.stopPropagation()
.stop
.prevent
.capture
.self
.once      点击事件只会触发一次
.passive   
click.self 点击来源于自己


@click.prevent.self 阻止所有点击
@click.self.prevent 只会阻止元素自身的点击

passive
div.addEventlistener('scroll',function(e){},{passive:true}) 不会调用preventDefault

keyup.page-down
keyup.13 
keyup.enter 
keyup.tab
keyup.delete del/backspace 
keyup.esc
keyup.space 
keyup.up 
keyup.down 
keyup.left 
keyup.right

系统修饰符
.ctrl
.alt
.shift
.meta  win

keyup.alt.67
click.ctrl

click.ctrl
只有在按住 ctrl 的情况下释放其它按键，才能触发 keyup.ctrl。而单单释放 ctrl 也不会触发事件。如果你想要这样的行为，请为 ctrl 换用 keyCode：keyup.17。

click.ctrl.exact 有且只有ctrl按下的时候才触发 
click.exact        没有任何系统修饰符按下的时候才会触发 
```

#### 表单输入绑定

* v-model 双向绑定 

> v-model 内部为不同的输入元素使用不同的property并抛出不同的时间
>
> text和textarea元素使用value property和input事件
>
> checkbox和radio使用cheacked property和change是阿金
>
> select字段 将value作为prop并将change作为事件

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>

<body>
  <div id="container">
    <select multiple v-model="city">
      <option value="0571">杭州</option>
      <option value="0572">温州</option>
      <option value="0573">宁波</option>
    </select>
    <input type="number" v-model.number="age">
    <!-- 转化为数字 -->
    <input type="checkbox" v-model='remember'><br>
    <input type="checkbox" true-value="foo" false-value="bar" v-model='remember1'><br>
    <!-- app.remember foo bar -->
    <input type="radio" v-model="gender" value="male">male  
    <input type="radio" v-model="gender" value="female">female  
    <!-- 多个checkbox也可以绑定到同一个数组 v-model相同即可 -->
  </div>
  <script>
    let app = new Vue({
      el: '#container',
      data: {
        gender: 'null',
        remember: true,
        remember1: "foo",
        age: 28,
        city: ['0571']
      }
    })
  </script>
</body>

</html>
```

* v-model.trim 输入的首尾空白字符
* v-model.lazy 在每次input事件出发后将输入框的值与数据进行同步 用lazy转为在change事件之后同步
* v-model.number 如果想自动将用户的输入值转为数值类型，

#### 组件

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>

<body>
  <div id="container">
    <p>{{msg}}</p>
    <button-counter title="hello component" :start="10" :step="2"></button-counter>
    <button-counter></button-counter>
  </div>
  <script>
    Vue.component('button-counter', {
      props: ['start', 'step'], //属性不声明 会转移到div上（title）
      template: `
       <div>
          <button @click="dec">-</button>
          <span>{{count}}</span>
          <button @click="inc">+</button>
        </div>
      `,
      data() { //函数返回 保证每个实例数据不共享
        return {
          count: this.start,
        }
      },
      methods: {
        inc() {
          this.count += this.step  //不能在这里直接使用start 不要直接修改原始属性
        },                         //msg改变 会重新渲染整个container 到时候重新赋值10给start 就乱了
        dec() {
          this.count -= this.step
        },
      }
    })
    let app = new Vue({
      el: '#container',
      data: {
        msg: 'test message',
      }
    })
  </script>
</body>

</html>
```

* 在组件最外层的元素上保存了组件实例的引用自身

  $0.\__vue\_\_

  $0.\__vue\_\_.__render

* 上层元素引用了好几个组件 上层元素更新

  会给组件传入新的属性集合 组件重新调用render

  得到新的结构



* 组件的组织

```html
<div id="container">只留下这个挂载点就好</div>
  <script>
    Vue.component('foo-bar', { //组件全局注册

    })
    Vue.component('button-counter', {
      template: `
       <div>
          <foo-bar></foo-bar>
          <button @click="dec">-</button>
          <span>{{count}}</span>
          <button @click="inc">+</button>
        </div>
      `,
      data() { },
      methods: {},
      components:{
        "foo-bar":{ //局部注册组件 只能在button counteer里面用 还可以再往里面嵌套
          template:xxx,
          data(){

          },
          methods:{

          }
        }
      }
    })
    let app = new Vue({
      el: '#container',
      template: `
      <div id="container">
        <p>{{msg}}</p>
        <button-counter title="hello component" :start="10" :step="2"></button-counter>
        <button-counter></button-counter>
      </div>
      `
    })
  </script>
```

* 子组件 Vue实例是根组件 他用到的（上例是template里所有的标签）都是他的子组件

  foobar 不是vue根组件子组件 因为template里面没用到他 但他是button-counter的子组件

* 组件包在一个标签中，不要并列，或者这样也是可以当

  ```javascript
  Vue.component('foo-bar',{
        template:`
        <span v-if="xxx"></span>
        <button v-else></button>
        `
      })
  ```

  

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>

<body>
  <div id="container"></div>
  <script>
    Vue.component('foo-bar', {
      template: `
      <span @click="xxx" v-if="xxx"></span>
      <button v-else></button>
      `
    })
    Vue.component('button-counter', {
      props: {
        start: {
          default: 0,
          type: Number,
        },
        step: {
          default: 1,
          type: Number,
        }
      },
      template: `
       <div>
          <button @click="dec">-</button>
          <span>{{count}}</span>
          <button @click="inc">+</button>
        </div>
      `,
      data() {
        return {
          count: this.start,
        }
      },
      methods: {
        inc() {
          this.count += this.step
          this.$emit('increment', this.count) //传参 新的count 监听子组件事件 子组件事件触发 触发一个外面的事件 传出一个参数
        },
        dec() {
          this.count -= this.step
          this.$emit('decrement', this.count)
        },
      }
    })
    let app = new Vue({
      el: '#container',
      template: `
      <div id="container">
        <p>{{msg}}</p>
        <button-counter @increment="xxx" @decrement="yyy" title="hello component" :start="10" :step="2"></button-counter>
        <button-counter></button-counter>
      </div>
      `,
      data: {
        msg: 'test message',
      },
      methods: {
        xxx(c) {
          console.log('counter increment: ', c)
        },
        yyy(c) {
          console.log('counter decrement: ', c)
        },
      }
    })
  </script>
</body>

</html>
```

* 只要拿到组件实例 就能调用上面methods里面的方法

```javascript
<div title="hello component"></div>
$0.__vue__.inc()
```

```javascript
<button @click="$emit('enlarge-text',0.2)">
<blog-post @enlarge-text="postFontSize += $event"></blog-post>
```

* $event 编译等价于0.2

  #### 模板轮播图

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <style>
    .indicators {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      padding: 0;
      margin: 0;
      text-align: center;
    }

    .indicators>li {
      width: 15px;
      height: 15px;
      border: 3px solid grey;
      border-radius: 999px;
      display: inline-block;
      cursor: pointer;
    }

    .indicators>li.active {
      border-color: red;
    }
  </style>
</head>

<body>
  <div class="container">
    <slider :imgs='cats' :indicators="true" :autoplay-duration="1000"></slider>
  </div>
  <script>
    Vue.component('slider', {
      // props: ['width', 'height', 'imgs', 'buttons', 'indicators', 'autoplay', 'autoplay-duration'],
      props: {
        width: { default: 400, type: Number },
        height: { default: 300, type: Number },
        imgs: { required: true, type: Array }, //这个属性必须传 而且是个数组
        buttons: { default: true, type: Boolean },
        indicators: { default: false, type: Boolean },
        autoplay: { default: true, type: Boolean },
        autoplayDuration: { default: 3000, type: Number }, //注意这里的大写代表中划线
      },
      // <div :style="{position:'relative',border:'1px solid black',width:width+'px',height:height+'px'}">
      // <button style="position: absolute;top:0;bottom:0;height:30px;margin:auto;" @click="prev">prev</button>
      template: `
       <div :style="wrapperStyle" @mouseenter="pause" @mouseleave="resume">
          <img style="width: 100%;height:100%;" :src="imgs[currentIdx]">
          
          <button v-if="buttons" style="left:0" :style="btnStyle" @click="prev">prev</button>
          <button v-if="buttons" style="right:0" :style="btnStyle" @click="next">next</button>
          <ul v-if="indicators" class="indicators">
            <li v-for="(img,index) of imgs" @click="currentIdx = index" :class="{active:currentIdx == index}"></li>
          </ul>
        </div>
      `,
      data() {
        return {
          intervalId: -1,
          currentIdx: 0,
          wrapperStyle: {
            position: 'relative',
            border: '1px solid black',
            width: this.width + 'px',
            height: this.height + 'px'
          },
          btnStyle: {
            position: 'absolute',
            top: '0',
            bottom: '0',
            height: '30px',
            margin: 'auto',

          }
        }
      },
      methods: {
        prev() {
          console.log('before', this.currentIdx)
          if (this.currentIdx == 0) {
            this.currentIdx = this.imgs.length - 1
          } else {
            this.currentIdx--
          }
        },
        next() {
          if (this.currentIdx == this.imgs.length - 1) {
            this.currentIdx = 0
          } else {
            this.currentIdx++
          }
        },
        pause() {
          clearInterval(this.intervalId)
        },
        resume() {
          if (this.autoplay) {
            this.intervalId = setInterval(() => {
              this.next()
            }, this.autoplayDuration)
          }
        }
      },
      mounted() {
        this.resume()
      }
    })

    let app = new Vue({
      el: '.container',
      data: {
        cats: [
          'https://xieranmaya.github.io/images/cats/stock-photo-135626379.jpg',
          'https://xieranmaya.github.io/images/cats/stock-photo-79250373.jpg',
          'https://xieranmaya.github.io/images/cats/stock-photo-147969173.jpg',
          'https://xieranmaya.github.io/images/cats/stock-photo-138378295.jpg',
        ]
      }
    })
  </script>
</body>

</html>
```

#### 滚动

```javascript
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <style>
    .indicators {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      padding: 0;
      margin: 0;
      text-align: center;
    }

    .indicators>li {
      width: 15px;
      height: 15px;
      border: 3px solid grey;
      border-radius: 999px;
      display: inline-block;
      cursor: pointer;
    }

    .indicators>li.active {
      border-color: red;
    }

    .slider-imgs {
      height: 100%;
      width: 9999px;
      position: absolute;
      margin: 0;
      padding: 0;
      list-style-type: none;
      transition: 1s;
    }

    .slider-imgs li {
      float: left;
    }
  </style>
</head>

<body>
  <div class="container">
    <slider :imgs='cats' :indicators="true" :autoplay-duration="1000"></slider>
  </div>
  <script>
    Vue.component('slider', {
      // props: ['width', 'height', 'imgs', 'buttons', 'indicators', 'autoplay', 'autoplay-duration'],
      props: {
        width: { default: 400, type: Number },
        height: { default: 300, type: Number },
        imgs: { required: true, type: Array }, //这个属性必须传 而且是个数组
        buttons: { default: true, type: Boolean },
        indicators: { default: false, type: Boolean },
        autoplay: { default: true, type: Boolean },
        autoplayDuration: { default: 3000, type: Number }, //注意这里的大写代表中划线
      },
      // <div :style="{position:'relative',border:'1px solid black',width:width+'px',height:height+'px'}">
      // <button style="position: absolute;top:0;bottom:0;height:30px;margin:auto;" @click="prev">prev</button>
      template: `
       <div :style="wrapperStyle" @mouseenter="pause" @mouseleave="resume">
          <ul :style="{left:-currentIdx * width +'px'}" class="slider-imgs">
            <li v-for="img of imgs">
              <img :width="width" :height="height" :src="img">
            </li>
          </ul>
          <button v-if="buttons" style="left:0" :style="btnStyle" @click="prev">prev</button>
          <button v-if="buttons" style="right:0" :style="btnStyle" @click="next">next</button>
          <ul v-if="indicators" class="indicators">
            <li v-for="(img,index) of imgs" @click="currentIdx = index" :class="{active:currentIdx == index}"></li>
          </ul>
        </div>
      `,
      data() {
        return {
          intervalId: -1,
          currentIdx: 0,
          wrapperStyle: {
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid black',
            width: this.width + 'px',
            height: this.height + 'px'
          },
          btnStyle: {
            position: 'absolute',
            top: '0',
            bottom: '0',
            height: '30px',
            margin: 'auto',

          }
        }
      },
      methods: {
        prev() {
          console.log('before', this.currentIdx)
          if (this.currentIdx == 0) {
            this.currentIdx = this.imgs.length - 1
          } else {
            this.currentIdx--
          }
        },
        next() {
          if (this.currentIdx == this.imgs.length - 1) {
            this.currentIdx = 0
          } else {
            this.currentIdx++
          }
        },
        pause() {
          clearInterval(this.intervalId)
        },
        resume() {
          if (this.autoplay) {
            this.intervalId = setInterval(() => {
              this.next()
            }, this.autoplayDuration)
          }
        }
      },
      mounted() {
        this.resume()
      }
    })

    let app = new Vue({
      el: '.container',
      data: {
        cats: [
          'https://xieranmaya.github.io/images/cats/stock-photo-135626379.jpg',
          'https://xieranmaya.github.io/images/cats/stock-photo-79250373.jpg',
          'https://xieranmaya.github.io/images/cats/stock-photo-147969173.jpg',
          'https://xieranmaya.github.io/images/cats/stock-photo-138378295.jpg',
        ]
      }
    })
  </script>
</body>

</html>
```

#### 深入了解组件

* 组件名

  ```javascript
  Vue.component('my-slider', {})
      Vue.component('MySlider', {}) //my-slider
      //写在template里面的话可以区分匹配大小写 不是交给浏览器 而是js
  ```

* 全局注册于局部注册

* 模块系统 在模块系统中局部注册

*   基础组件的自动化全局注册

* ==全局注册必须在vue实例生成前注册==

  #### 局部注册

  ```javascript
  var ComponentA = { /* ... */ }
  var ComponentB = { /* ... */ }
  var ComponentC = { /* ... */ }
  
  new Vue({
    el: '#app',
    components: {
      'component-a': ComponentA,
      'component-b': ComponentB
    }
  })
  //局部注册的组件在其子组件中不可用
  //如果你希望 ComponentA 在 ComponentB 中可用
  var ComponentA = { /* ... */ }
  
  var ComponentB = {
    components: {
      'component-a': ComponentA
    },
    // ...
  }
  ```

  

#### Prop

* 驼峰命名法等价短横线分隔命名，如果使用字符串模板，这个限制就不存在了

* 传递动态Prop

* prop可以通过 v-bind动态赋值

  ```html
  <blog-post v-bind:title="post.title"></blog-post>
  ```

* 传入值

  ```html
  <!-- 即便 `42` 是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
  <!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
  <blog-post v-bind:likes="42"></blog-post>
  
  <!-- 传入布尔 数组 对象也一样-->
  ```

* 传入一个对象的所有property作为prop而不是对象

  ```html
  <blog-post v-bind="post"></blog-post>
  <script>
    post: {
    id: 1,
    title: 'My Journey with Vue'
  }
  </script>
  ```

* 单向数据流

> 所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。
>
> 每次父级组件发生变更时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你**不**应该在一个子组件内部改变 prop。
>
> 注意在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变变更这个对象或数组本身**将会**影响到父组件的状态。

* **这个 prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用。**

  ```javascript
  props: ['initialCounter'],
  data: function () {
    return {
      counter: this.initialCounter
    }
  }
  ```

* **这个 prop 以一种原始的值传入且需要进行转换。**在这种情况下，最好使用这个 prop 的值来定义一个计算属性：

```javascript
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

* prop验证

  ```javascript
  Vue.component('my-component', {
    props: {
      // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
      propA: Number,
      // 多个可能的类型
      propB: [String, Number],
      // 必填的字符串
      propC: {
        type: String,
        required: true
      },
      // 带有默认值的数字
      propD: {
        type: Number,
        default: 100
      },
      // 带有默认值的对象
      propE: {
        type: Object,
        // 对象或数组默认值必须从一个工厂函数获取
        default: function () {
          return { message: 'hello' }
        }
      },
      // 自定义验证函数
      propF: {
        validator: function (value) {
          // 这个值必须匹配下列字符串中的一个
          return ['success', 'warning', 'danger'].indexOf(value) !== -1
        }
      }
    }
  })
  ```

* 注意那些 prop 会在一个组件实例创建**之前**进行验证，所以实例的 property (如 `data`、`computed` 等) 在 `default` 或 `validator` 函数中是不可用的。

* 类型检查 type可以是一个自定义的构造函数

```javascript
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}

Vue.component('blog-post', {
  props: {
    author: Person
  }
})
```

* 非 Prop 的 Attribute

> 这些 attribute 会被添加到这个组件的根元素上。

* 禁用attribute继承

  ```javascript
  Vue.component('my-component', {
    inheritAttrs: false,
    // ...
    data(){
      console.log(this.$attrs) //非prop的属性这里可以访问到
      return{
        
      }
    }
  })
  let app = new Vue({
    el:'',
    template:`
  	<my-component foo="a" bar="b">
  	
  	
  	`,
  })
  //可以和$attrs配合使用
  ```

* 注意 `inheritAttrs: false` 选项**不会**影响 `style` 和 `class` 的绑定。

#### 自定义事件

* 事件名

```html
    this.$emit('myEvent')
    //监听没有效果 监听的时候 不支持中划线
    <my-component v-on:my-event="doSomething"></my-component>
```

* v-model

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </head>
  
  <body>
    <div class="container"></div>
    <script>
      Vue.component('JsonInput', {
        props: ['value'],
        template: `
        <textarea @input="parse" :value="jsonText"></textarea>
        `,
        data() {
          return {
            jsonText: JSON.stringify(this.value)
          }
        },
        watch: {
          value(newVal, oldVal) {     //直接给app.jsonData赋值 也要改变 用watch
            this.jsonText = JSON.stringify(newVal)
          }
        },
        methods: {
          parse(e) {
            let inputText = e.target.value
            try { //每次输入一个字符都会触发 如果不是json了会报错
              let result = JSON.parse(inputText)
              this.$emit('input', result) //emit出来的值赋到外面的app.jsonData来
            } catch (e) {
              console.log(e)
            }
          }
        }
      })
  
      Vue.component('ListInput', {
        props: {
          value: {
            required: true,
            type: Array,
          }
        },
        template: `<input v-model="listStr" />`,
        data() {
          return {
            listStr: this.value.join(', ')
          }
        },
        watch: {
          // value(newVal) {
          //   console.log('value change')
          //   this.listStr = newVal.join(', ')
          // },
          // listStr(newVal) {
          //   console.log('listStr change')
          //   let list = newVal.split(',').map(it => it.trim())
  
          //   this.$emit('input', list)
          // }, //触发两轮
          value(newVal) {
            console.log('value change')
            this.listStr = newVal.join(', ')
          },
          listStr(newVal) {
            newVal = newVal.trim()
            if (newVal.endsWith(',')) {
              return
            }
            console.log('listStr change')
            let list = newVal.split(',').map(it => it.trim())
            this.$emit('input', list) 
          }
        }
      })
  
      let app = new Vue({
        el: '.container',
        template: `
        <div class="container">
        <list-input v-model="fruits"></list-input>
        <json-input v-model="jsonData"></json-input>
        </div>
        `,
        data: {
          fruits: ['orange', 'apple', 'google'],
          jsonData: {
            a: 1,
            b: 2,
            c: [1, 2, 3]
          }
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
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>

<body>
  <div class="container"></div>
  <script>
    Vue.component('ListInput', {
      props: {
        value: {
          required: true,
          type: Array,
        }
      },
      template: `<input @input="parse" :value="listStr"/>`,
      data() {
        return {
          listStr: this.value.join(', ')
        }
      },
      methods: {
        parse(e) {
          newVal = e.target.value.trim()
          if (newVal.endsWith(',')) {
            return
          }
          let list = newVal.split(',').map(it => it.trim())
          this.$emit('input', list)
        }
      },
      watch: {
        value(newVal) {
          console.log('value change')
          this.listStr = newVal.join(', ')
        }
      }
    })

    let app = new Vue({
      el: '.container',
      template: `
      <div class="container">
      <list-input v-model="fruits"></list-input>
      </div>
      `,
      data: {
        fruits: ['orange', 'apple', 'google'],
      }
    })

  </script>

</body>

</html>
```

```javascript
    Vue.component('base-checkbox',{})
    //<base-checkbox :value="xxx" @input="xxx=$event" >
    //<base-checkbox :v-model="xxx">
    Vue.component('base-checkbox',{
      model:{
        prop:'checked',
        event:'change'
      },
    })
    //<base-checkbox :checked="xxx" @change="xxx=$event" >
```

* 原生事件绑定到组件

```html
<list-input @click ="yyy">
  <!-- 组件里实现click -->
<list-input @click.native ="yyy">
  <!-- 原生的click 原生标签不用加native-->
```

* $listeners

  ```html
  <base-input v-on:focus.native="onFocus"></base-input>
  
  base-input:
   <label>
    {{ label }}
    <input
      v-bind="$attrs"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  </label>
  
  根元素实际上是一个 <label> 元素
  这时，父级的 .native 监听器将静默失败。它不会产生任何报错，但是 onFocus 处理函数不会如你预期地被调用。
    
   Vue 提供了一个 $listeners property，它是一个对象，里面包含了作用在这个组件上的所有监听器。例如
   {
    focus: function (event) { /* ... */ }
    input: function (value) { /* ... */ },
  }
  ```

  ```javascript
  Vue.component('base-input', {
    inheritAttrs: false,
    props: ['label', 'value'],
    computed: {
      inputListeners: function () {
        var vm = this
        // `Object.assign` 将所有的对象合并为一个新对象
        return Object.assign({},
          // 我们从父级添加所有的监听器
          this.$listeners,
          // 然后我们添加自定义监听器，
          // 或覆写一些监听器的行为
          {
            // 这里确保组件配合 `v-model` 的工作
            input: function (event) {
              vm.$emit('input', event.target.value)
            }
          }
        )
      }
    },
    template: `
      <label>
        {{ label }}
        <input
          v-bind="$attrs"
          v-bind:value="value"
          v-on="inputListeners"
        >
      </label>
    `
  })
  现在 <base-input> 组件是一个完全透明的包裹器了，也就是说它可以完全像一个普通的 <input> 元素一样使用了：所有跟它相同的 attribute 和监听器都可以工作，不必再使用 .native 监听器。
  ```

  

.Sync 修饰符

#### 插槽

* slot将会替换为组件所有的子元素

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>

<body>
  <div class="container">
    <window name="VSCode">
      hahaha
      <ul>
        <li>{{msg}} 是使用不了的.</li>
        <li>Dolore aut pariatur minus aliquid.</li>
        <li>Ipsum nobis id dolore rerum!</li>
      </ul>
    </window>
  </div>
  <script>
    Vue.component('window', {
      props: ['name'],
      data() {
        return {
          msg: 'hello slot'
        }
      },
      template: `
      <div class="window-wrapper">
        <h3 class="window-header">{{name}}</h3>
        <section class="window-body">
          <slot>如果组件内没有子元素 用这里的内容替换</slot>
        </section>
        </h3>
      </div>
      `
    })

    new Vue({
      el: '.container'
    })
  </script>
</body>

</html>
```

* 具名插槽

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>

<body>
  <div class="container">
    <basic-layout>
      <p slot="header">标题</p>
      <p slot="sidebar">侧边</p>
      <ul>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Perspiciatis fuga vitae ullam voluptate?</li>
        <li>Voluptate quidem sequi optio ullam.</li>
      </ul>
    </basic-layout>
  </div>
  <script>
    Vue.component('BasicLayout', {
      template: `
      <div>
        <header>
          <slot name="header"></slot>
        </header>
        <aside>
          <slot name="sidebar"></slot>
        </aside>
        <main>
          <slot></slot>
        </main>
      </div>
      `
    })
    new Vue({
      el: '.container'
    })
  </script>
</body>

</html>
```

#### 作用域插槽

```javascript
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>

<body>
  <div class="container">
    <!-- <current-user>{{user.firstName}}</current-user> -->
    <!-- user.firstName不行 他是根组件的模板 根组件没有user.firstName -->
    <current-user>
      <template v-slot:default="slotProps">
        {{slotProps.user.firstName}}
      </template>
    </current-user>
  </div>
  <script>
    Vue.component('current-user', {
      template: `
    <span>
      <slot :user="user1" :foo="8" :bar="[1,2,3]">{{user1.lastName}}</slot>
    </span>
    `,
      data() {
        return {
          user1: {
            firstName: 'da',
            lastName: 'miao'
          }
        }
      }
    })
    new Vue({
      el: '.container'
    })
  </script>
</body>

</html>
```

#### 解构插槽Prop

```html
 <template v-slot:default="{user,foo}">
   {{user.firstName}}{{foo}}
 </template>
```

#### 动态插槽名

```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

* 插槽其他事例

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </head>
  
  <body>
    <div class="container">
      <for-each :list="[1,2,3,4,5]">
        <template v-slot:abc="info">
          <span>{{info.index}}:{{info.data*2}}</span>
        </template>
      </for-each>
    </div>
    <script>
      Vue.component("for-each", {
        props: ['list'],
        template: `
          <ul>
            <li v-for="(item,index) of list">
              <slot name="abc" :data='item' :index="index"></slot>
            </li>
          </ul>
        `
      })
      new Vue({
        el: '.container'
      })
    </script>
  </body>
  
  </html>
  ```

#### 动态组件 异步组件

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <style>
    .indicators {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      padding: 0;
      margin: 0;
      text-align: center;
    }

    .indicators>li {
      width: 15px;
      height: 15px;
      border: 3px solid grey;
      border-radius: 999px;
      display: inline-block;
      cursor: pointer;
    }

    .indicators>li.active {
      border-color: red;
    }

    .slider-imgs {
      height: 100%;
      width: 9999px;
      position: absolute;
      margin: 0;
      padding: 0;
      list-style-type: none;
      transition: 1s;
    }

    .slider-imgs li {
      float: left;
    }
  </style>
</head>

<body>
  <div class="container">
    <component :is="currentComp"></component>
    <keep-alive>
      <slider :imgs="['https://xieranmaya.github.io/images/cats/stock-photo-135626379.jpg',
          'https://xieranmaya.github.io/images/cats/stock-photo-79250373.jpg',
          'https://xieranmaya.github.io/images/cats/stock-photo-147969173.jpg',
          'https://xieranmaya.github.io/images/cats/stock-photo-138378295.jpg',]" indicators="true" v-if="s"></slider>
      <!-- 被keep alive 包裹 失活的组件将会被缓存 对组件实例有用 对原生标签没用-->
    </keep-alive>
  </div>
  <script>
    Vue.component('slider', {
      // props: ['width', 'height', 'imgs', 'buttons', 'indicators', 'autoplay', 'autoplay-duration'],
      props: {
        width: { default: 400, type: Number },
        height: { default: 300, type: Number },
        imgs: { required: true, type: Array }, //这个属性必须传 而且是个数组
        buttons: { default: true, type: Boolean },
        indicators: { default: false, type: Boolean },
        autoplay: { default: true, type: Boolean },
        autoplayDuration: { default: 3000, type: Number }, //注意这里的大写代表中划线
      },
      // <div :style="{position:'relative',border:'1px solid black',width:width+'px',height:height+'px'}">
      // <button style="position: absolute;top:0;bottom:0;height:30px;margin:auto;" @click="prev">prev</button>
      template: `
       <div :style="wrapperStyle" @mouseenter="pause" @mouseleave="resume">
          <ul :style="{left:-currentIdx * width +'px'}" class="slider-imgs">
            <li v-for="img of imgs">
              <img :width="width" :height="height" :src="img">
            </li>
          </ul>
          <button v-if="buttons" style="left:0" :style="btnStyle" @click="prev">prev</button>
          <button v-if="buttons" style="right:0" :style="btnStyle" @click="next">next</button>
          <ul v-if="indicators" class="indicators">
            <li v-for="(img,index) of imgs" @click="currentIdx = index" :class="{active:currentIdx == index}"></li>
          </ul>
        </div>
      `,
      data() {
        return {
          intervalId: -1,
          currentIdx: 0,
          wrapperStyle: {
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid black',
            width: this.width + 'px',
            height: this.height + 'px'
          },
          btnStyle: {
            position: 'absolute',
            top: '0',
            bottom: '0',
            height: '30px',
            margin: 'auto',

          }
        }
      },
      methods: {
        prev() {
          console.log('before', this.currentIdx)
          if (this.currentIdx == 0) {
            this.currentIdx = this.imgs.length - 1
          } else {
            this.currentIdx--
          }
        },
        next() {
          if (this.currentIdx == this.imgs.length - 1) {
            this.currentIdx = 0
          } else {
            this.currentIdx++
          }
        },
        pause() {
          clearInterval(this.intervalId)
        },
        resume() {
          if (this.autoplay) {
            this.intervalId = setInterval(() => {
              this.next()
            }, this.autoplayDuration)
          }
        }
      },
      mounted() {
        this.resume()
      }
    })
    Vue.component("for-each", {
      props: ['list'],
      template: `
        <ul>
          <li v-for="(item,index) of list">
            <slot name="abc" :data='item' :index="index"></slot>
          </li>
        </ul>
      `
    })
    Vue.component('window', {
      props: ['name'],
      data() {
        return {
          msg: 'hello slot'
        }
      },
      template: `
      <div class="window-wrapper">
        <h3 class="window-header">{{name}}</h3>
        <section class="window-body">
          <slot>如果组件内没有子元素 用这里的内容替换</slot>
        </section>
        </h3>
      </div>
      `
    })
    let app = new Vue({
      el: '.container',
      data: {
        s: true,
        currentComp: 'window'
      }
    })
    //执行app.currentComp ="for-each"

    //执行app.s = false
    //app.s = true
    //发现没有刷到第一章 还保持消失前的状态 说明组件没有消失 是被缓存了
  </script>
</body>

</html>
```

* 异步组件

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </head>
  
  <body>
    <div class="container">
      <component :is="currentComp"></component>
      <async-comp v-if="s"></async-comp>
    </div>
    <script>
      Vue.component('async-comp', (resolve, reject) => {
        console.log('loading async-comp')
        setTimeout(() => {
          resolve({
            template: '<div>ASYNC COMPONENT</div>'
          })
        }, 3000);
      })
  
      Vue.component('window', {
        props: ['name'],
        data() {
          return {
            msg: 'hello slot'
          }
        },
        template: `
        <div class="window-wrapper">
          <h3 class="window-header">{{name}}</h3>
          <section class="window-body">
            <slot>如果组件内没有子元素 用这里的内容替换</slot>
          </section>
          </h3>
        </div>
        `
      })
      let app = new Vue({
        el: '.container',
        data: {
          s: false,
          currentComp: 'window'
        }
      })
  
      //app.s =true 一开始不加载
    </script>
  </body>
  
  </html>
  ```

* 动态加载模块 

```javascript
//a.js
export default function () {
  return 8
}
//默认导出
//具名导出
export var x = { a: 1, b: 2 }
```

```html
<!-- hs-o打开-->
控制台
mod = await import('./a.js')
mod.default()
mod.x
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>

<body>
  <div class="container">
    <component :is="currentComp"></component>
    <async-comp v-if="s"></async-comp>
    <async-comp-2 v-if="s"></async-comp-2>
  </div>
  <script>
    Vue.component('async-comp-2', () => ({
      component: new Promise(resolve => {
        setTimeout(() => {
          resolve({
            template: '<div>real comp</div>'
          })
        }, 2500)//3500 error  //2.5s reject了还是error
      }),
      loading: { template: '<div>loading</div>' },
      error: { template: '<div>error</div>' },
      delay: 200,//展示加载时组件延时时间
      timeout: 3000 //三秒不加载成功就失败
    }))
    Vue.component('async-comp', (resolve, reject) => {
      console.log('loading async-comp')
      setTimeout(() => {
        resolve({
          template: '<div>ASYNC COMPONENT</div>'
        })
      }, 3000);
    })

    Vue.component('window', {
      props: ['name'],
      data() {
        return {
          msg: 'hello slot'
        }
      },
      template: `
      <div class="window-wrapper">
        <h3 class="window-header">{{name}}</h3>
        <section class="window-body">
          <slot>如果组件内没有子元素 用这里的内容替换</slot>
        </section>
        </h3>
      </div>
      `
    })
    let app = new Vue({
      el: '.container',
      data: {
        s: false,
        currentComp: 'window'
      }
    })

    //app.s =true 一开始不加载
  </script>
</body>

</html>
```

#### 处理边界情况

* 访问元素组件

* 访问根实例

  ```javascript
  new Vue({
    el: '.container',
    data: {
      s: false,
      currentComp: 'window'
    }
  })
  ```

  >  可以根据this.$root 调用根组件
  >
  > this.$el 组件指向组件渲染出来的根元素

* 访问父组件

> this.$parent 包裹该组件的组件

* 访问子组件

```html
<!-- 访问子组件-->
<base-input ref="usernameInput"></base-input>
this.$refs.usernameInput
访问的是base-input的实例

<base-input> 组件也可以使用一个类似的 ref 提供对内部这个指定元素的访问
  <input ref="input">
  
  
可以通过其父级组件定义方法
methods: {
  // 用来从父级组件聚焦输入框
  focus: function () {
    this.$refs.input.focus()
  }
}
这样就允许父级组件通过下面的代码聚焦 <base-input> 里的输入框
this.$refs.usernameInput.focus()
```

> this.$refs 指向原生组件（如ul ，div） 指向元素自己的dom元素
>
> 指向自定义组件  他的根组件.$resfs.xx 指向这个组件的组件实例 不指向这个组件根元素的dom元素

> ref类似于id 不能重名 重名指向后一个

* 依赖注入（看文档）
* 程序化的事件监听器(看文档)

> * 通过 `$on(eventName, eventHandler)` 侦听一个事件
> * 通过 `$once(eventName, eventHandler)` 一次性侦听一个事件
> * 通过 `$off(eventName, eventHandler)` 停止侦听一个事件

```javascript
// 一次性将这个日期选择器附加到一个输入框上
// 它会被挂载到 DOM 上。
mounted: function () {
  // Pikaday 是一个第三方日期选择器的库
  this.picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })
},
// 在组件被销毁之前，
// 也销毁这个日期选择器。
beforeDestroy: function () {
  this.picker.destroy()
}
```

```javascript
mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```

```javascript
mounted: function () {
  this.attachDatepicker('startDateInput')
  this.attachDatepicker('endDateInput')
},
methods: {
  attachDatepicker: function (refName) {
    var picker = new Pikaday({
      field: this.$refs[refName],
      format: 'YYYY-MM-DD'
    })

    this.$once('hook:beforeDestroy', function () {
      picker.destroy()
    })
  }
}
```

#### 循环引用

* 递归组件

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <style>
    .null {
      color: grey;
    }

    .number,
    .boolean {
      color: blue;
    }

    .string {
      color: red;
    }
  </style>
</head>

<body>
  <div class="container">
    <json-viewer :value="personInfo"></json-viewer>
  </div>
  <script>
    Vue.component('json-viewer', {
      props: ['value'],
      data() {
        return {
          collapse: false,
        }
      },
      computed: {
        length() {
          return Object.keys(this.value).length - 1
        }
      },
      template: `
       <span class="null" v-if="value === null">null</span>
       <span class="boolean" v-else-if="value === false">false</span>
       <span class="boolean" v-else-if="value === true">true</span>
       <span class="number" v-else-if="typeof value === 'number'">{{value}}</span>
       <span class="string" v-else-if="typeof value === 'string'">"{{value}}"</span>
        <span v-else-if="Array.isArray(value)">
          <span style="font-family: monospace;" @click="collapse =!collapse">{{collapse ? '-' : '+'}}</span>
          [
            <span v-show="!collapse">
            <div style="padding-left:20px;" v-for="(item,index) of value">
              <json-viewer :value="item"></json-viewer>{{index < length-1?',':''}}
            </div>
            </span>
            <span v-show="collapse">...</span>
          ]
        </span>
        <span v-else-if="typeof value == 'object'">
          <span style="font-family:monospace;" @click="collapse =!collapse">{{collapse ? '-' : '+'}}</span>
            {
              <span v-show="!collapse">
              <div style="padding-left:20px;" v-for="(item,key,index) of value">
                <span>{{key}}</span>: <span><json-viewer :value="item"></json-viewer></span>{{index < length?',':''}}
              </div>
              </span>
              <span v-show="collapse">...</span>
            }
        </span>
      `
    })
    let app = new Vue({
      el: '.container',
      data: {
        personInfo: {
          name: 'damiao',
          age: 18,
          fruits: ['orange', 'apple', null],
          father: {
            name: 'dadamiao',
            age: 22,
            fruits: ['orange', 'apple', 'google'],
          }
        }
      }
    })

  </script>
</body>

</html>
```

* 组件是可以在它们自己的模板中调用自身的。不过它们只能通过 `name` 选项来做这件事：
* 当你使用 `Vue.component` 全局注册一个组件时，这个全局的 ID 会自动设置为该组件的 `name` 选项。



* 组件间的循环引用
* 内联模板
* x-template

###

#### 控制更新

```javascript
app.$forceUpdate()
//比如todo[2] = {}
```

* 通过v-once 创建低开销的静态组件

#### 动画过渡（文档）

#### 总结

* ref（组件范围内的元素 不要query）

```javascript
this.$refs.viewer.value
this.$refs.viewer.nextImg()
this.$refs.viewer.$on('foo',e=>{})                    //监听事件
this.$refs.viewer.$watch('foo',(newVal,oldVal)=>{})   //watch 

this.$refs.viewer.$el //拿到组件实例对应的dom元素
this.$refs.viewer.$el.__vue__ //又拿到了组件实例
```

```html
obj={a:1,b:2}
<foo v-bind="obj"></foo>
相当于
<foo v-bind:a="obj.a" v-bind:b="obj.b"></foo>

<foo v-on="obj"></foo>
相当于
<foo v-on:a="obj.a" v-on:b="obj.b"></foo>
```

* 如何为一个组件实例的某事件绑定多个事件监听函数

  ```html
  <json-viewer @xxx="f" @xxx="g" ref="viewer">
    <ul ref="viewer">
    </ul>
  </json-viewer>
  <!-- 不能写第二遍 -->
  
  this.refs.list.addEventListener('xxx',f)
  this.refs.list.addEventListener('xxx',f)
  this.refs.list.addEventListener('xxx',f)
  this.refs.list.addEventListener('xxx',f)
  
  this.refs.viewer.$on('foo',e=>{})
  this.refs.viewer.$on('foo',e=>{})
  ```


* .sync修饰符的含义

  ```html
      <foo-bar :value.sync="msg"></foo-bar>
      <foo-bar :value="msg" @update:value="msg=$event"></foo-bar>
  ```

* this.$refs.editbox[0].focus()

#### checkbox组件实现

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

<body>
  <div id="container">
    <my-checkbox v-model="rememberLogin1" true-value="aaa" false-value='bbb'>记住登录</my-checkbox>
    <my-checkbox :checked='rememberLogin' @change="rememberLogin=$event">记住登录</my-checkbox>
  </div>
  <script>
    Vue.component('MyCheckbox', {
      model: {
        prop: 'checked',
        event: 'change'
      }, //自定义model绑定的属性和事件
      props: {
        checked: {
          default: false,
        },
        trueValue: {
          default: true,
        },
        falseValue: {
          default: false
        }
      },
      template: `
        <span @click="handleClick">
          <em :style="{backgroundColor:isCheck?'black':''}" style="display:inline-block;width:10px;height:10px;border:1px solid black;"></em>
          <slot></slot>
        </span>
      `,
      data() {
        return {
          isCheck: this.checked == this.trueValue
        }
      },
      watch: {
        checked() {
          this.isCheck = this.checked == this.trueValue
        }
      },
      methods: {
        handleClick() {
          if (this.isCheck) {
            this.$emit('change', this.falseValue)
          } else {
            this.$emit('change', this.trueValue)
          }
        }
      },
    })
    let app = new Vue({
      el: '#container',
      data: {
        rememberLogin: true,
        rememberLogin1: 'aaa',
      }
    })

  </script>
</body>

</html>
```

#### 批量事件

```javascript
foo(){//对数据做了多于一处的改变 只会触发一次虚拟dom对比 渲染 批量更新（foo运行完）
          this.todos[2].completed = false
          this.todos[3].completed = false
          this.todos[4].completed = false
          this.todos[5].completed = false
        }

//控制台里 也会批量更新 利用的事件循环
        debugger
        app.todos[0].completed = true //if(!未来的更新已安排){nextTick(()=>{update();未来的更新已安排 = false})未来的更新已安排 = true}
        app.todos[1].completed = true //if(!未来的更新已安排){nextTick(()=>{update();未来的更新已安排 = false})未来的更新已安排 = true}
```

#### 混入

* 分发组件中可复用功能

```javascript
// 定义一个混入对象 很多组件都需要定义hello方法
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
```

* 选项合并 看文档

#### 自定义指令

* v- 开头的都是指令

* https://jsbin.com/huribaqeyu/3/edit?html,js,output
  用指令包装传统方式实现的组件

* https://jsbin.com/bohapagifo/1/edit?html,js,output
  用组件包装传统组件

  #### 渲染函数和jsx

* https://unpkg.com/vue/   runtime vue 没有编译器 运行时版本

* 过滤器 |

#### 单文件组件 

```vue
//slider.vue
<template>
  <div class="slider" @click="foo" :bar="baz+1">
    <!-- <json-viewer/>  css只对看得见的生效 有一些属性json-viewer也不能继承-->
  </div>
</template>
<style scoped lang="scss">
/* scoped css不是对全局生效 只对template生效 */
.slider {
  width: 100px;
  height: 200px;
  ul {
    li {
      &:hover {
      }
    }
  }
}
// 支持css 还支持sass
</style>
<script>
import lodash from "lodash";
import Vue from "vue";
import moment from "moment";
import JsonViewer from "./JsonViewer.vue";
export default {
  components:{
    JsonViewer,
  },
  props: {
    foo: {},
    trueValue: {},
  },
  data() {
    return {};
  },
  methods: {},
  computed: {},
  mounted() {},
};
</script>
```

```bash
$winpty vue.cmd create my-first-vue-project
```

* 入口 src main.js

```javascript
import Vue from 'vue'
import App from './App.vue'
//vue格式写的文件会被import进来 成为一个组件了
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

// new Vue({ 
//   el:'#app',
//   render:function(createElement){
//     return createElement(App)
//   }
// })
```

### bug

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <style>
  </style>
</head>

<body>
  <div id="container">
    {{msg}}
    <input type="checkbox" @click="msg=Math.random()" :checked="rememberLogin">
  </div>
  <!-- dom rememberLogin没有变 但是点击checkbox会变  浏览器行为 react没有这个bug -->
  <script>
    let app = new Vue({
      el: '#container',
      data: {
        msg: 'hello',
        rememberLogin: true
      }
    })
  </script>
</body>

</html>
```

## vue composition

* https://unpkg.com/@vue/composition-api/

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="vue.js">Vue</script>
  <script src="vue-composition-api.js">VueCompsitionAPI</script>
</head>

<body>
  <div class="container">
    <h3>{{pos.x}} {{pos.y}} todos{{editingIdx}} 不写.value也会自动解引用 {{time.toLocaleString()}}</h3>
    <div>
      <input type="checkbox">
      <input type="text" @keyup.enter="addTodo">
    </div>
    <ul>
      <li v-for="todo in todos">
        <input type="checkbox" v-model="todo.completed">
        <span>{{todo.content}}</span>
        <button>&times;</button>
      </li>
    </ul>
    <div>
      <span>{{leftCount}} items left</span>
      <button v-if="hasCompleted" @click="clearCompleted">Clear Completed</button>
    </div>
  </div>
  <script>
    Vue.use(VueCompositionAPI)
    const { ref, reactive, computed, watchEffect, watch, onMounted, onBeforeUnmount } = VueCompositionAPI

    function useMousePosition() {
      let pos = reactive({ x: 0, y: 0 })
      function handler(e) {
        pos.x = e.clientX
        pos.y = e.clientY
      }
      onMounted(() => {
        window.addEventListener('mousemove', handler)
      })
      onBeforeUnmount(() => {
        window.removeEventListener('mousemove', handler)
      })
      return pos
    }

    function useCurrentTime() {
      let time = ref(new Date()) //2.x通过插件实现还是返回了getter和setter 3.x里面是Proxy对象
      watchEffect(async (onInvalidate) => {
        let id = setInterval(() => {
          time.value = new Date() 
        }, 1000)

        onInvalidate(() => { //取消
          clearInterval(id)
        })
      })
      return time
    }

    let app = new Vue({
      //每个组件实例 setup只执行一次
      setup() { //setup返回值从 app.$data里找到
        const editingIdx = ref(-1)
        //ref指向原始数据 创建ref对象 不然直接-1 原始数据类型无法修改
        //不能直接修改对象 修改对象的属性
        //{value:1}
        console.log(editingIdx)
        // editingIdx.value = -1  //赋值的时候要写.value
        const showingCategory = ref('all')
        const todos = ref([{
          content: 'eat',
          completed: true,
        }, {
          content: 'drink',
          completed: false
        }])

        function addTodo(e) {
          // todos=[
          //   ...todos,
          //   {
          //     content: e.target.value.trim(),
          //     completed: false,
          //   }
          // ]
          //上面的写法是不行的 改变的是todos这个局部变量
          //return返回的是局部变量 指向的对象 赋值是改了指向 没用

          todos.value.push({
            content: e.target.value.trim(),
            completed: false,
          })
          e.target.value = ''
        }

        let isAllCompleted = computed(() => todos.value.every(it => it.completed && todos.value.length))
        let hasCompleted = computed(() => todos.value.some(it => it.completed))
        let leftCount = computed(() => todos.value.filter(it => !it.completed).length)

        onMounted(() => {
          console.log('component mounted')
        })

        function clearCompleted() {
          todos.value = todos.value.filter(it => !it.completed)
        }

        watchEffect((onInvalidate) => {
          console.log(todos.value.length)
        })

        let time = useCurrentTime()

        watch(time, () => {
          console.log('time updated')
        })
        watch(() => {
          console.log('watch leftCount')
          return leftCount.value
        }, () => {
          console.log('letfCount changed')
        })

        return {
          pos: useMousePosition(),
          addTodo,
          editingIdx,
          showingCategory,
          todos,
          isAllCompleted,
          hasCompleted,
          leftCount,
          clearCompleted,
          time,
        }
      },
      el: '.container',
      data() {
        return {
          a: 1,
          b: 2,
        }
      },
      watch: {

      },
      methods: {
        foo() {

        }
      },
      computed: {
        bar() {

        }
      }
    })
  </script>
</body>

</html>
```

