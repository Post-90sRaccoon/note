#  The Secret Life of Objects

## 方法

* 方法是指向了函数的普通属性

  ```javascript
  var rabbit = {}
  rabbit.speak = function (line) {
    console.log("The rabbit says '" + line + "'")
  }
  rabbit.speak("I'm alive.")
  ```

* 当一个函数以方法形式被调用时 有一个特殊变量this指向方法被调用时所属对象 

  ==this不能赋值==  this.xxx可以

```javascript
obj = {}
obj.c = 8
obj.f = function (a, b) {
  console.log(a + b + this.c)
}
obj.f(1, 2)
//11
```

```javascript
var aryLike = {
  0: 1,
  1: 2,
  length: 2
}

aryLike.push = function (val) {
  this[this.length] = val
  this.length++
  return this.length
}

aryLike.push(3)
console.log(aryLike)
```

```javascript
var ary = [1, 2, 3]
ary.push2 = function (val) {
  this[this.length] = val
  return this.length
}
//数组length会自动增加
```

```javascript
var ary = []
ary[8] = 0
console.log(ary.length)
//9
```

```javascript
function speak(line) {
  console.log("The" + this.type + " rabbit says '" + line + "'")
}
var whiteRabbit = { type: "white", speak: speak }
var fatRabbit = { type: "fat", speak: speak }

whiteRabbit.speak('ha')
```

* bind和apply 的 第一个参数 this

  `xxx.f(a, b) 等价于  f.apply(xxx, [a, b])`

```javascript
function add(a){
  return a +this[0]
}
add.apply([3],[5])
//8
```

* call函数 和apply函数一样 区别是正常传入参数 而非以数组形式

```javascript
f.apply(xx, [1, 2, 3])
f.call(xx, 1, 2, 3)
f.call(xx, ...[1, 2, 3]) //spread
function add(a, b, ...args) { } //rest paramater
```

```javascript
var f = function () { return this.val }
var obj = {
  val: 3,
  f: f
}
var obj = {
  val: 3,
  f: function () { return this.val }
}
obj.f()
//3
obj2 = {
  val: 4, 
  f: obj.f
}
obj2.f()
//4
//f函数不属于任何一个对象 obj和obj2对于f的关系是对等的
f = obj.f  //把f函数读出来
f()        //单独的函数调用
// undefined  this是window window没有val属性 undefined
```

#### this的指向

* this 指向什么取决于函数的调用形式 不取决于函数的定义位置 调用位置

* 函数能访问到的非形参变量 取决于函数在哪定义 以及他在哪个作用域  形参优先

```javascript
f() //全局变量window
obj.f() // obj
f.call(o)
f.apply(o) //第一个参数o
```

```javascript
var a = 1
console.log(this.a)
//window

function f() {
  console.log(this, a)
}

function add() {
  var a = 5
  f() //this window
  var obj = {
    f: f
  }
  obj.f() // this obj
  f.call([1, 2, 3])// this [1,2,3]
}
```

* 如果一个函数中有this，**这个函数中包含多个对象，尽管这个函数是被最外层的对象所调用，this指向的也只是它上一级的对象**

  ```javascript
  var o = {
      a:10,
      b:{
          // a:12,
          fn:function(){
              console.log(this.a); //undefined
          }
      }
  }
  o.b.fn()
  ```

  * 尽管对象b中没有属性a，这个this指向的也是对象b，因为this只会指向它的上一级对象，不管这个对象中有没有this要的东西
```javascript
var o = {
    a:10,
    b:{
        a:12,
        fn:function(){
            console.log(this.a); //undefined
            console.log(this); //window
        }
    }
}
var j = o.b.fn;
j()
```
* this永远指向的是最后调用它的对象，也就是看它执行的时候是谁调用的

* 构造函数版this

  ```javascript
  function Fn(){
      this.user = "哈哈";
  }
  var a = new Fn();
  console.log(a.user); //哈哈
  ```

  * a是对象，因为用了new关键字就是创建一个对象实例，相当于复制了一份Fn到对象a里面，调用这个函数Fn的是对象a，那么this指向的自然是对象a。new关键字会创建一个空的对象，将this指向这个空对象。
  
* 当this遇到return

  ```javascript
  function fn()  
  {  
      this.user = 'haha';  
      return {};  
  }
  var a = new fn;  
  console.log(a.user); //undefined
  
  function fn()  
  {  
      this.user = 'haha';  
      return function(){};
  }
  var a = new fn;  
  console.log(a.user); //undefined
  
  function fn()  
  {  
      this.user = 'haha';  
      return 1;
  }
  var a = new fn;  
  console.log(a.user); //haha
  
  function fn()  
  {  
      this.user = 'haha';  
      return undefined;
  }
  var a = new fn;  
  console.log(a.user); //haha
  ```

  * **如果返回值是一个对象，那么this指向的就是那个返回的对象，如果返回值不是一个对象那么this还是指向函数的实例。** 

```javascript
function fn() {
  this.user = 'haha';
  return undefined;
}
var a = new fn();
console.log(a); //fn {user: "haha"}  fn类型
```
* 虽然null也是对象，但是在这里this还是指向那个函数的实例，因为null比较特殊

  ```javascript
  function fn() {
    this.user = 'haha';
    return null;
  }
  var a = new fn;
  console.log(a.user); //haha
  ```

* 在严格版中的默认的this不再是window，而是undefined

## Prototypes

```javascript
var empty = {}
console.log(empty.toString)
//[Function: toString] 没有打印undefined
console.log(empty.toString())
//[object Object]
```

* 对象除了有自己的属性外 几乎所有的对象还有一个原型

  当访问一个对象没有的属性时 会到他的原型上找 原型也是一个对象 然后原型的原型 

### 得到对象原型

```javascript
console.log(Object.getPrototypeOf({}) == Object.prototype)
//true getPrototypeof 返回的是__proto__
//是{}的原型 同时也被Object.prototype属性指向
console.log(Object.getPrototypeOf(Object.prototype))
//null
```

* Object   是一个函数 变成对象  `Object(2)`
* 是命名空间 `Object.keys({ a: 1, b: 2, c: 3 })["a", "b", "c"]`  获得对象的属性
* `Object.getPrototypeOf()` 获取对象原型
* `empty._proto_`  得到原型的另外一种方法

```javascript
p = { a: 1, b: 2 }
empty.__proto__ = p
//p所指的对象成了empty的原型
empty.a //1
empty.b //2

//p.__proto__ = null
//执行完上面操作会乱

empty.a = 8 //增加自己的a属性 不会修改原型上的
empty.__proto__.a = 9 //修改原型

Array.a = 1
var a = []
a.a
//undefined
Array.prototype.a = 1
a.a
//1
```

* 对象原型之间关系形成树状结构  不能有环   对象属性可以有环
* 树的根部是`Object.prototype`

 ```javascript
var obj = {}
obj.prototype = { x: 1, y: 2 }
console.log(obj.x)
//undefined obj 的真正原型是在_proto_  没有x 所以是undefined prototype就是个普通的属性名字
 ```

```javascript
ary = [] 
ary.__proto__ === Array.prototype   //ary的原型 恰好被Array的prototype属性指向而已
x =2
x.__proto__ === Number.prototype
x = 'fdas'
x.__proto__ === String.prototype
ary.push === Array.prototype.push
ary.__proto__.push === Array.prototype.push
```

```javascript
'FJSDAK'.__proto__ === String.prototype
// true
String.prototype.__proto__ === Object.prototype
// true

String.prototype.toString == Object.prototype.toString
// false



delete String.prototype.toString   //删除String的toString属性
'adsf'.toString === Object.prototype.toString
//删除后为true 
'FAS'.toString()
//"[object String]"

'a'.__proto__.__proto__.toString()
//这里this是Object.prototype


objToString = Object.prototype.toString

//调用Object.prototype的toString方法 
objoString.call('a')
//"[object String]"
Object.prototype.toString.call('c')
//"[object String]"


```

![image-20200611142552000](7%20Object.assets/image-20200611142552000.png)

```javascript
function(){}._proto_ === Function.prototype  //报错
(function () { }).__proto__ === Function.prototype // true

function getPrototypeOf(val){
  return val.__proto__
}
```

```javascript
console.log(String.prototype.__proto__ === Object.prototype
)
//true
console.log(String.__proto__ === Object.prototype
)
//false
console.log(String.__proto__ === Function.prototype
)
//true

Object.prototype.__proto__
//null
```



#### Object.create()

* 可以使用Object.create()来创建一个被指定了特定原型的对象

```javascript
let obj = Object.create({a:1,b:2})
//返回一个对象{} obj以{a:1,b:2} 为原型

obj.__proto__ === {a:1,b:2}
//false 这里的{a:1,b:2} 不是create里面的对象了 
```

```javascript
function speak(line) {
  console.log(this.type, line)
}
var rabbiteProto = {
  speak: speak
}

r1 = { type: 'fat' }
Object.setPrototypeOf(r1, rabbiteProto)


r2 = Object.create(rabbiteProto)
r2.type = 'fat'


r3 = { type: 'killer' }
r3.__proto__ = rabbiteProto

r0 = Object.create(rabbiteProto, {
  type: { value: 'killer' },
  age: { value: 18 },
  gender: { value: 'boy' }
})

//{type: "killer", age: 18, gender: "boy"}
```

#### 创建一系列以相同对象为原型的对象

```javascript
proto = { speak: function () { } }
r1 = Object.create(proto, { type: { value: 'killer', writable: false, enumerable: true } })
//writable不可修改  enumerable 可枚举性 for in 不会遍历到这个属性
r1.type = 999 //赋值   type还是killer

r3 = { type: 'fat' }
r3.__proto__ = proto

r4 = {
  type: 'four',
  __proto__: proto
}

r5 ={type:'five'}
Object.setPrototypeOf(r5,proto)
```

## 构造函数

* 创建共享原型对象（用于访问公共属性）更方便的方法是使用构造函数
* ==当一个函数调用前面带有一个new关键字的时候==，这个函数就被当做一个构造函数  new function a(){}
* ==构造函数的this指向全新的空对象==  new f() 指向新对象  f()指向window
* 除非明确的返回另一个对象值，这个this指向的新的对象就会被返回，return 2  2会被忽略

```javascript
function TreeNode(val) {
  this.val = val
  this.left = null
  this.right = null
}

var a = new TreeNode(2)
console.log(a)
//TreeNode { val: 2, left: null, right: null }
```

* 一个用new创建出来的对象一般被称做这个函数的实例
* 所有function都有prototype属性（ 箭头函数没有）  
* 这个属性默认指向空对象  里面有consrtructor 属性指向函数自己   TreeNode.prototype  一般都以Object.prototype为原型
* 每一个被这个函数创建出来的实例都将以这个对象的prototype作为其原型对象

```javascript
function TreeNode(val) {
  this.val = val
  this.left = null
  this.right = null
}

var a = new TreeNode(1)
var b = new TreeNode(2)
var c = new TreeNode(3)
//他们都以TreeNode.prototype 为原型

console.log(TreeNode.prototype)
//TreeNode {}
console.log(a.__proto__ === TreeNode.prototype)
//true

//给对象添加一个属性(方法)
TreeNode.prototype.getValue = function () {
  return this.val
}

a.getValue()
//1
b.getValue()
//2
c.getValue()
//3
```

* \__proto\_\_属性 null 和undefined 没有 

```javascript
Rabbit.prototype.speak = function(line){
  console.log(line)
}
blackRabbit.speak("Doom")
```

* ==函数有prototype属性==

  ==对象有\_\_proto\_\_原型==

  ==构造函数自己的原型是 Function.prototype==

* TreeNode.prototype === a.\_\_proto\_\_

* TreeNode.\_\_proto\_\_ === Function.prototype  

* ==Function.\_\_proto\_\_  \=\=\= Function.prototype==     前一个Function是函数的构造函数 后一个是函数的构造函数的protoype属性

* Function.prototype.\_\_proto\_\_ === Object.prototype

```javascript
d ={}
d.__proto__ = TreeNode.prototype //核心 仅仅是原型指向构造函数的原型属性 就会判定是TreeNode 不管是不是new创建的
// d TreeNode{}
```

### Overriding derived properties

* 对衍生属性（即原形中的属性）的覆盖

* 当你给一个对象增加一个属性时，不管属性是否存在于原型中，新属性都会增加到对象自己上。

  ```javascript
  function TreeNode(val) {
    this.val = val 
    this.left = null
    this.right = null
  }
  TreeNode.prototype.getValue = function () {
    return this.val
  }
  var a = new TreeNode(1)
  
  Object.prototype.toString.call(a)
  //[object Object]
  
  a.getValue = 8 //给对象a添加了属性
  a.getValue() //报错 不是方法
  
  a.__proto__.getValue()
  //不行 成了a.__proto__.的getValue this不是a了 是a.__proto__
  a.__proto__.getValue.call(a)
  //1 
  ```

  ```javascript
  function Rabbit(type) {
    this.type = type
  }
  
  Rabbit.prototype.toString = function () {
    return '兔子'
  }
  
  killerRabbit = new Rabbit('killer')
  console.log(killerRabbit.toString())
  //兔子
  
  console.log([1, 2, 3].toString())
  //1,2,3
  Array.prototype.toString = function () {
    return '[' + this.join(',') + ']'
  }
  console.log([1, 2, 3].toString())
  //[1,2,3]
  
  Object.prototype.toString.call(1)
  //"[object Number]"
  Object.prototype.toString.call(true)
  //"[object Boolean]"
  Object.prototype.toString.call("fdsfd")
  //"[object String]"
  Object.prototype.toString.call(null)
  //"[object Null]"
  Object.prototype.toString.call(undefined)
  //"[object Undefined]"
  Object.prototype.toString.call(() => 1)
  //"[object Function]"
  
  function isNumber(val){
    return Object.prototype.toString.call(val) === '[object Number]'
  }
  function isBoolean(val) {
    return Object.prototype.toString.call(val) === '[object Boolean]'
  }
  function isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]'
  }
  //只能判断内置类型
  ```

  ### Prototype interference

* 原型可以随时给基于它的对象新增方法和属性

  ```javascript
  TreeNode.prototype ={
    constructor:TreeNode
    setValue:function(val){
      this.val = val
    },
    setLeft:function(leftTree){
      this.left = leftTree
    },
    setRight:function(rightTree){
      this.rightTree = rightTree
    },
  }
  //new之前可以 但也会覆盖原来的prototype属性   new之后没用 因为实例已经指向原来的prototype属性了
  
  
  TreeNode.prototype.setValue = function(val){
    this.val = val
  }//这里不能用箭头函数 箭头函数没有this
  TreeNode.prototype.setLeft = function(leftTree){
    this.left = leftTree
  }
  TreeNode.prototype.setValue = function(val){
    this.right= rightTree
  }
  //可以new之后写
  ```

  

 ```javascript
function People() {
}
a = new People()
People.prototype = {}
b = new People()

// a 和 b 原型不一样 a原型{constructor: ƒ} b原型{}
 ```

 #### 原型产生的问题 

```javascript
var map = {}
function storePhi(event, phi) {
  map[event] = phi
}

storePhi("pizza", 0.069)
storePhi("touched tree", -0.081)
//用for/in loop 填值  用in运算符查看是否在map里


Object.prototype.nonsense = 'hi'
for (var name in map) {
  console.log(name)
}

// pizza
// touched tree
// nonsense

toString in map
//true
'foo' in map 
//true 自己有或原型链上有都返回真
```

#### 创建不可枚举属性

* js区分可枚举和不可枚举属性

```javascript
Object.defineProperty(map, 'c', { value: 1, writable: false, enumerable: false, configurable: false })
//第三个参数属性描述符 不可改 不可枚举 定义不可改，不可以再配置了,比如将writable改为true是不可能的


//配置多个属性
a = {}
Object.defineProperties(a, {
  c: { value: 1, writable: false },
  d: { value: 1, writable: false }
})
//这样要现有一个对象

obj2 = Object.create(null, {
  a: { value: 1, writable: false, enumerable: true },
  b: { value: 8, writable: true }
})
//这样不需要有对象
```

* 所有直接赋值到对象上的属性都是可枚举的
* Object.prototype 上的标准属性不可枚举

#### 判断是否有某个自由属性

```javascript
a = { a: 1, b: 2 }
'a' in a //true
'toString' in a //true

a.hasOwnProperty('toString')
//false 
```

#####  只遍历自由属性

```javascript
var map = {
  x: 1,
  y: 2
}
for (var key in map) {
  if (map.hasOwnProperty(key)) {
    console.log(key)
  }
}
```

#### 保险做法

```javascript
var map = {
  x: 1,
  y: 2,
  hasOwnProperty: 8
}
//用属性把原型的方法替代了
// Object.setPrototypeOf(map, null) 设置原型
//map没有原型了 访问不到hasOwnPropert 或者属性重名
//不能够保证对象有hasOwnProperty属性 就把他读出来

hasOwn = Object.prototype.hasOwnProperty

for (var key in map) {
  if (hasOwn.call(map, key)) {
    console.log(key)
  }
}
```

```javascript
//遍历函数自由属性
function forOwn(obj, action) {
  var hasOwn = Object.prototype.hasOwnProperty
  for (var key in obj) {
    if (hasOwn.call(obj, key)) {
      action(obj[key], key, obj)
    }
  }
  return obj
}
```

## 回顾

```javascript
obj = {
  val: 1,
  a: 2
}

obj.f = function f() {
  function foo() {
    return this.val 
  }
  return this.a + foo()//window
}

obj.f()
//NaN

//obj是右面的函数 运行 this.a + foo()
//f()的this是obj this.a = 2 foo() 的this是window 没有val NaN




obj = {
  val: 1,
  a: 2
}
  (function g() {
    obj.bar = function () {
      console.log(this)
    }
  })()

obj.bar()
// 函数调用obj  {val: 1, a: 2, bar: ƒ}
```

```javascript
function f() {
  console.log(this)
}

f2 = f.bind(obj1, 1, 2)
f2()
//this是obj1 
f2.call(obj2)
//还是obj1  f2(){//this f()} f2里面this是obj2 但没用过this 直接调用了f() f的this绑定了obj1


function bind(f, thisArg, ...fixedArgs) {
  return function bound(...args) {
    return f.call(thisArg, ...fixedArgs,...args))
    //f.apply(thisArg, fixedArgs.concat(args))
    //apply 传入一个数组 不能分开
  }
}

//f2是 function bound f2里没用过this
f3 = f2.call(obj2)
f3()
//f2 this是obj2 但是f3运行调用f2 但f2没用this 没意义
//f3的this是window


a = new f()
//this 是新创建对象 对象以f的prototype为原型
//如果f不返回对象 会返回this
```

#### 箭头函数的不同

```javascript
af = (a) => { return a + b }
new af()
//错误 箭头函数不能做构造函数
//箭头函数里面没有this 箭头函数内部也没有arguments 词法作用域 找this往外看 
```

```javascript
f=()=>console.log(this)
//往外找 this是window
f.call([1,2,3])
//this 还是window 箭头函数的this没法绑定
```

```javascript
function f() {
  var af = () => {
    arguments
    return this.val * this.val
  }
  return af.call({ val: 8 })
}
obj = {
  val: 2,
  foo: f
}
obj.foo()
// this 是obj
```

```javascript
//箭头函数不要写在原型链上
function TreeNode(val) {
  this.val = val
  this.left = this.right = null
}

TreeNode.prototype.getValue = () => {
  return this.val
}
a = new TreeNode(5)
b = new TreeNode(6)
a.getValue()
//this 箭头函数 往外看 是window 

a.getValue === b.getValue
//true a和b的this是一样的
```

```javascript
function TreeNode(val) {
  this.val = val
  this.left = this.right = null
  this.getValue = () => {
    return this.val
  }
}


a = new TreeNode(5)
a.getValue()
b = new TreeNode(6)
b.getValue()

a.getValue === b.getValue
//false  a和b的this不一样

```

```javascript
ary.push2 = function (val) {
  this[this.length] = val
  return this.length
}

function forEach(ary, action) {
  for (var i = 0; i < ary.length; i++) {
    action(ary[i], i, ary)
    //这里是函数调用 action的this 是window
  }
}

var ary = [1, 2, 3]
[4, 5].forEach(ary.push)
//push的this是undefined 不是ary
//can not convert undefined or null to object 
f()
//this是window 或undefined
//尝试把push(ary[i], i, ary) 的this undefined 转换为类  数组  


ary.push(4, 0, [4, 5])
 


p = ary.push
p(5) //this还是undefined
p.call(obj2={0:1,1:2,length:2}, 8)
//obj2 {0: 1, 1: 2, 2: 8, length: 3}

ary = [1,2,3]
[3.5].forEach(ary.push.bind(ary))
//[1,2,3,3,0,Array(2),5,1,Array(2)] 还push了3,5的下标和数组

[3.5].forEach(ary.push,[thisArgOfFirstArgument])
//ary.push的this 变成 指定参数
[3,5].forEach(ary.push,ary)  
//也会push3,5的下标和数组

[3,5].forEach(::ary.push) 
//语法可以还不支持  从对象取出函数时 保留当初的this

//ary[1,2,3]
p=ary.push.bind(ary)
p(5)
//[1,2,3,5]
p(6)
//[1,2,3,5,6]

function forEach(ary, action,thisArg=undefined) {
  for (var i = 0; i < ary.length; i++) {
    action.call(thisArg,ary[i], i, ary)
  }
}

```

![image-20201227225123445](7%20Object.assets/image-20201227225123445.png)

```javascript
var a = [1, 3, 4, 5, 2];
//这里一定要加分号 因为下一行是[]开头
[8, 9].forEach(a.push.bind(a))
//bind返回的是函数
console.log(a)
//[1, 3, 4, 5, 2, 8, 0, [8, 9], 9, 1, [8, 9]]

[1,2,3].forEach((it)=>a.push(it))
a.push(...[1,2,3])
```

> 每个对象都有原型，__proto__属性
>
> 当在一个对象上查找某个属性找不到时，会去其原型对象上找。还找不到，会去其原型的原型上找。 

```javascript
//伪代码
function getProperty(obj, p) {
  if (obj == null) {
    return Error('can not read property' + p + "of" + obj)
  }
  if (obj has own property p) {
    return obj[p]
  } else {
    return getProperty(obj.__proto__, p)
  }
}
```

* 原型继承 继承属性

#### 如果想要创建一批共享同一个原型对象

```javascript
var proto = {}
a = Object.create(proto)
b = Object.create(proto)

a = {}
a.__proto__ = proto
b = {}
b.__proto__ = proto


function TreeNode(val) {
  this.val = val
  this.left = null
  this.right = null
}
var a = new TreeNode(1)
var b = new TreeNode(2)
var c = new TreeNode(3)

// a.__proto__ 和 TreeNode.prototype 指向同一个对象
```

* 匿名函数、箭头函数的名字是第一次绑定的变量的变量名，`.name`调用

```javascript
Object.prototype.forOwn = function (action) {
  var hasOwn = Object.prototype.hasOwnProperty
  for (var key in this) {
    if (hasOwn.call(this, key)) {
      action(this[key], key, this)
    }
  }
}
obj.forOwn((val, key) => {
})
```

