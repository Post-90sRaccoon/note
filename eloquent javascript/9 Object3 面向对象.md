# 面向对象

*  面向对象三大概念   封装，继承，多态

* 把数据与操作这组数据的函数放在一起，称为对象。此过程叫做封装。

* 封装 将复杂操作或计算写成函数 调用时只需考虑高层概念 无需关心该操作的运作细节

* 多态 多个不同类型对象 拥有相同的一组接口（方法及方法签名及属性）

* this function's signature

  函数签名：函数名称 参数类型与顺序 返回值类型的集合

* 多态的代码：某段代码只期望对象们拥有这组接口即可正常工作，不期待对象的具体类型（由什么构造函数构造出来）

* 继承：当一个类型拥有另一个类型的所有或大部分特性时 可以让一个类型通过某种方式 直接获得该类型 所有属性和方法  被继承称为父类 继承者称为子类

#### keys

```javascript
function keys(obj) {
  var result = []
  for (var key in obj) {
    result.push(key)
  }
  return result
}

Object.values({ a: 1, b: 2 })
//[1, 2]
Object.keys({ a: 1, b: 2 })
//["a", "b"]

obj = { b: 1, a: 2, c: 3, d: 4, 1: 5, 2: 3, 0: 8, 3: 9, length: 4 }
for (var key in obj) { console.log(key) }
//0,1,2,3,b,a,c,d,length 数值key提前且排序
```

```javascript
var MOUNTAINS = [
  { name: "Kilimanjaro", height: 5895, country: "Tanzania" },
  { name: "Everest", height: 8848, country: "Nepal" },
  { name: "Mount Fuji", height: 3776, country: "Japan" },
  { name: "Mont Blanc", height: 4808, country: "Italy/France" },
  { name: "Vaalserberg", height: 323, country: "Netherlands" },
  { name: "Denali", height: 6168, country: "United States" },
  { name: "Popocatepetl", height: 5465, country: "Mexico" }
];
console.table(MOUNTAINS)
```

## Getter and Setters
* 设计接口的时候 可以仅用属性而不是方法来实现接口
```javascript
function slice(ary, start = 0, end = ary.length) {  //length属性
  for (var i = start; i < end; i++) {
  }
}
```

* 把方法的调用挂在对象属性上  别的属性表示可能变化内容 影响该方法的计算结果 但该方法不会重新计算。 

#### 新声明对象 get 和 set

```javascript
var obj = {
  firstName: 'lolo',
  lastName: 'Jim',
  get fullName() {
    return this.firstName + ' ' + this.lastName
  },
  set fullName(val) {
    var ary = val.split(' ')
    this.firstName = ary[0]
    this.LastName = ary[1]
  }
}
obj.fullName
obj.fullName = 'foo bar'

//get不能有参数 set至少一个参数
```

#### 为已经存在的对象增加get 和set

```javascript
var obj ={}
Object.defineProperty(obj, 'foo', {
  get: function () { },
  set: function (val) { } //可以不写参数 对象直接量必须写参数
})
obj.foo
obj.foo = 999

Object.defineProperties(Number.prototype, 'hex', {
  get: function () {
    return this.toString(16)
  }
})

TreeNode.prototype = {
  getVal: function () { },
  constructor: TreeNode,
  get pos() { return this },
  set pos(val) { },
}//此时prototype重新指向一个新的对象
```

```javascript
//面试题
var getProp = (function () {
  var obj = {
    a: 1,
    b: 2,
    name: 'foo'
  }
  return function (prop) {
    return obj[prop]
  }
}())

getProp('a')
//1
``
//getter 访问一个属性可以访问对象本身 getter里的this
//要求 调用getProp得到obj对象
Object.defineProperty(Object.prototype, 'getSelf', {
  get: function () { return this }
})

getProp('getSelf')
```

```javascript
var obj = {
  val: 3,
  get val() {
    return this.val
  },
  set val(val) {
    this.val = val
  }
}

obj.val
//读不到3  obj.val 进入 get val() => this.val this是object 无限递归
//一个属性是普通属性就不能是getter setter属性 val全替换成_val

//对象的属性是函数 可以把:function 省去
var obj = {
  getValue() {
    return this.getValue
  }
}




// (function(){
//   构造闭包
// })
obj = {};
(function () {
  var val = 3
  Object.defineProperty(obj, 'val', {
    get: function () {
      return val
    },
    set: function (value) {
      val = value
    }
  })
}())//就地运行

obj.val //3
obj.val = 9
obj.val //9
//把对象属性存在一个作用域
```

## Inheritance

```javascript
function TextCell(text) {
  this.text = text.split("\n")
}
function RTextCell(text) {
  TextCell.call(this, text)
}

RTextCell.prototype = Object.create(TextCell.prototype)
//rtc的prototype 等于一个以tc为原型的新的对象
//RTextCell的实例 以{__proto__:TextCell.prototype}为原型
//RTextCell prototype 以 TextCell.prototype为原型

RTextCell.prototype.draw = function (width, height) {
  var result = []
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || ""
    result.push = (repeat(" ", width - line.length) + line)
  }
  return result
}
```

```javascript
function Creature(type, place) {
  this.type = type
  this.place = place
}

function MovingCreature(type, place) {
  Creature.call(this, 'dongwu', place)
  this.canMove = true
}


function Dog(place, owner, name) {
  Creature.call(this, 'dongwu', place) //子类复用父类的构造函数

  //对已经成为生物的this对象继续加工,让其成为一个Dog
  this.owner = owner
  this.name = name
}

Dog.prototype.__proto__ = Creature.prototype
```

* 一个参数被new 没有参数 可以不写括号

  ```javascript
  new Tree
  
  new TreeNode().Foo().Bar()
  //new的是离new 最近的一对括号
  
  new (TreeNode()).Foo().Bar()
  //new foo
  ```

#### instance of operator

```javascript
Object.prototype.toString.call(new TreeNode)
//[object Object] 只能判断内置属性

//instance of  operator
//想要知道一个函数是不是某个构造函数的实例
console.log(new RTextCell("A") instanceof RTextCell)
//true
console.log(new RTextCell("A") instanceof TextCell)
//true
console.log(new TextCell("A") instanceof RTextCell)
//false
console.log([1] instanceof Array)
//true
2 instanceof Number
//false
new Number(2) instanceof Number
//true

Object(2)
//Number(2)
Object(2) instanceof Number
//true
Object(2) instanceof Object
//true js所有东西都是对象 

Function instanceof Function
//函数的构造函数     function类型 true
Object instanceof Function
// true
Object instanceof Object
//true
```

```javascript
obj = {}
obj.__proto__ = null
obj instanceof Object
//false
// instanceof 顺着原型链找

// [] instanceof Array true
// 因为[].__proto__.constructor === Array
// [].__proto__.__proto__.constructor === Object
function INSTANCEOF(obj, Cont) {
  while (obj) {
    if (!obj.__proto__) {
      return false
    }
    if (obj.__proto__.constructor === Cont) { //不严谨
      return true
    } else {
      obj = obj.__proto__
    }
  }
  return false
}

function Foo() { }
Foo.prototype = {}
a = new Foo

a instanceof Foo //true
a.__proto__.constructor === Foo // fasle
a.__proto__ === Foo.prototype  //true


function INSTANCEOF(obj, Cont) {
  if (obj) {
    if (!obj.__proto__) {
      return false
    }
    if (obj.__proto__ === Cont.prototype) { //不严谨
      return true
    } else {
      return INSTANCEOF(obj.__proto__, Cont)
    }
  }
  return false
}
```

```java
new Cont(...args)
NEW(Cont, ...args)
//不使用new

function NEW(Cont, ...args) {
  var obj = Object.create(Cont.prototype)
  var ret = Cont.call(obj, ...args)
  if (ret && typeof ret === 'object') { //ret防止typeof null 也== ‘object' 若果构造函数的this指向的返回对象
    return ret
  } else { //构造函数没有返回对象
    return obj
  }//构造函数返回对象 如果不是对象 返回new对象

//原始类型都不是 instanceof Object
```

```javascript
  function TreeNode(val) {
    if (!(this instanceof TreeNode)) {//如果被new调用 this是TreeNode的实例 有缺陷
      return new TreeNode(val)
    }
    this.val = val
    this.left = this.right = null
  }

  var node = TreeNode(3) 
  //不写new
  var node = TreeNode.call(new TreeNode(2))
  //this 是new TreeNode(2) 会把新创建的对象的left right val重置


  //es6 方法
  function TreeNode(val) {
    if (new.target !== TreeNode) {//如果被new调用 this是TreeNode的实例
      return new TreeNode(val)
    }
    this.val = val
    this.left = this.right = null
  }
```

```javascript
s = new Set([1, 2, 2, 3, 4])
//只能接数组
set.add() set.size set.has() set.delete()
Math.max(...ary)
//接数

a = Array(2, 3)
//[2,3]
a = Array(3)
//[empty * 3]
a = Array({})
//[{}]

//es6
Array.of(1, 2, 3, 4, 5)
//[1,2,3,4,5]
Array.of(1)
//[1]
```

```javascript
function Set(init = []) {
  if (!(new.target === Set)) {
    return new Set(...Array.from(arguments))
  }
  this.elements = []
  this.initialize(init)
}

Set.prototype.initialize = function (init) {
  if (Array.isArray(init)) {
    for (var i = 0; i < init.length; ++i) {
      this.add(init[i])
    }
  } else {
    for (var i = 0; i < arguments.length; ++i) {
      this.add(arguments[i])
    }
  }
}
```

```javascript
function BTIterator(root) {
  this.traverseResult = []
  inorderTraverse(root, val => {
    this.traverseResult.push(val)
  })
}
BTIterator.prototype.next = function () {
  return this.traverseResult.shift()
}
BTIterator.prototype.hasNext = function () {
  return this.traverseResult.length >= 0
}

var tree = ary2tree([1, 2, 3, 4, 5, 6, 7])
var iterator = new BTIterator(tree)
var result = []
while (iterator.hasNext()) {
  rselut.push(iterator.next()) //按照中序遍历
}
```

#### 面向对象私有属性的实现

```javascript
function MySet() {
  var elements = []
  //没有挂到this上 函数外的方法访问不了
  //把方法全写在构造函数里面
  this.add = (value) => {
    if (!this.has(value)) {
      elements.push(value)
    }
  }
  this.has = (value) => {
    return elements.includes(value)
  }
  Object.defineProperty(this, 'size', {
  get: function () {
    return elements.length
  }
})
}
```

```javascript
var Person = (function () {
  var map = new Map() //new WeakMap() 弱引用映射，与Map的区别在于当一个对象仅被WeakMap以某形式指向/保存/引用时，而不再任何其它的变量或对象引用时，该对象会被销毁 es6
  function Person(name, age) {
    this.name = name
    var privateFields = {}
    privateFields.age = age
    map.set(this, privateFields)
  }
  Person.prototype.getAge = function () {
    var privateFields = map.get(this)
    return privateFields.age - 2
  }
  Person.prototype.destroy = function () {
    map.delete(this)
  }
  return Person
}())

var p = new Person('zs', 18)
p
//{'zs',18}
p = null //缺陷 p = null  不想用p了 但p没有销毁 在map里面 map不销毁 因为person没销毁 Person不销毁

p.destroy()
p = null
```

```javascript
a = new WeakMap()
b = {}
a.set(b, 5)
//WeakMap {{…} => 5}
b = null
//删掉
//WeakMap 没有size 不可数 随时可能被删掉
```

#### class语法介绍  

```javascript
class TreeNode extends Node {
  static of() { }
  static from() { }
  static isTreeNode() { }
  constructor(val) {
    super(val)       //必须先super 后this
    this.left = null
    this.right = null
  }
  foo(params) {
    super.xx() //调用父类原型上的方法
  }
  bar() { }
  get length() { }
  set length() { }
}

TreeNode.of
//这样方法不可枚举
```

```javascript
class TextCell {
  static create(text) {
    return new TextCell(text)
  }
  constructor(text) {
    this.lines = text.split('\n')
  }
  get minWidth() { //TextCell 原型属性上的方法
    return Math.max(...this.lines.map(it => it.length))
  }
  get minHeight() {
    return this.lines.length
  }
  draw(width, height) {
    var result = []
    for (var i = 0; i < height; i++) {
      var line = this.lines[i] || ''
      result.push(line.padEnd(width, ' '))
    }
    return result
  }
}

class UnderlinedTextCell extends TextCell {
  constructor(text) {
    super(text)
  }
  get minHeight() {
    return super.minHeight + 1 //minHeight变成gatter 不用加括号
  }
  draw(width, height) {
    var result = super.draw(width, height - 1)
    result.push('-'.repeat(width))
    return result
  }
}

UnderlinedTextCell.prototype.__proto__ === TextCell.prototype
//true
UnderlinedTextCell.__proto__ === TextCell
//true  重点
TextCell.__proto__ === Function.prototype
//true
UnderlinedTextCell.create === TextCell.create
//true 继承来的
```

```javascript
class A {
  x = 8
  y = 5
}

a = new A()
//A{x:8,y:5} 空构造函数

class B extends A {
  x = 8
  y = 5
 //继承不写构造函数相当于写了这个
 // constructor(...args) {
 //   super(...args)
 //    this.x = 8
 //    this.y = 5
 // }
}


function A() {}
function B() {}
B.prototype = Object.create(A.prototype)
B.__proto__ == A
//false
B.prototype.__proto__ == A.prototype
//true

class A{}
class B extends A{}
B.prototype.__proto__ == A.prototype
//true
B.__proto__ == A
//true
A.__proto__ == Function.prototype
//true
```

```javascript
class Person {
  #age = null
  constructor(name, age) {
    this.name = name
    this.#age = age
  }
  getAge() {
    return this.#age - 2
  }
}

zs = new Person('zhangshan',18)
//#age 读不到 私有属性
```

```javascript
class MySet {
  constructor() {
    this.elements = []
  }
  _has(val) {
    return this.elements.includes(val)
  }
}


//私有属性 没挂在this 通过this访问不到
function Set() {
  var elements = []
  this.add = (val) => {
    elements.push(val)
  }
}

s = new Set()
s.add()
```

#### 链表相邻两个节点交换

```javascript
var swapPairs = function (head) {
  if (head === null || head.next === null) {
    return head
  }

  let p = head.next
  head.next = swapPairs(p.next)
  p.next = head
  return p
};

var swapPairs = function(head) {
    const dummyHead = new ListNode(0);
    dummyHead.next = head;
    let temp = dummyHead;
    while (temp.next !== null && temp.next.next !== null) {
        const node1 = temp.next;
        const node2 = temp.next.next;
        temp.next = node2;
        node1.next = node2.next;
        node2.next = node1;
        temp = node1;
    }
    return dummyHead.next;
};
```

#### 链表去重

```javascript
var deleteDuplicates = function(head) {
    let current = head;
    while (current != null && current.next != null) {
        if (current.next.val == current.val) {
            current.next = current.next.next;
        } else {
            current = current.next;
        }
    }
    return head;
};
```

#### 判断列表是否有环

```javascript
var hasCycle = function(head) {
    var a = head
    var b = head
    
    while(a && b) {
      a = a.next
      b = b.next
      if(!b) {
        return false
      }else {
        b = b.next
      }
      if(a == b) {
        return true
      }
    }
    // head为空
    return false
};
```

#### 环形链表进入点

![image-20201117201719211](9%20Object3%20%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1.assets/image-20201117201719211.png)

```javascript
var detectCycle = function(head) {
    let p = head
    let q = head 
    while(p&&q){
        p = p.next
        q = q.next
        if(q){
            q=q.next
        }else{
            return null
        }
        if(p == q){
            p = head
            while(p!=q){
                p = p.next
                q = q.next
            }
            return p
        }
    }
    return null
};
```

