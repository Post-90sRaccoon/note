> 静态类型 变量的类型在运行之前就确定，且不能改（c，java，ts）
>
> 动态类型 变量指向的值的类型能否在运行中改变（js，python）
>
> 强类型 永远不会发生自动类型转换（py）
>
> 弱类型 运算是否会发生隐式类型转换（js，c，java）

### Strict Mode

```javascript
function canYouSpotTheProblem() {
  "use strict";
  for (counter = 0; counter < 10; counter++)
    console.log("Happy happy")
}
//报错 counter is not defined 必须先声明 再使用

function Person(name) {
  this.name = name
  var ferdinand = Person("Ferdinand") //没有new this是window
  console.log(name)
}

function A() {
  if (!(a instanceof A))
    return new A()

  if (new.target !== A)
    return new A()
}
```

```javascript
"use strict"
function Person(name) {
  this.name = name
  var ferdinand = Person("Ferdinand")
  console.log(name)
}
//报错 this是undefined
//严格模式 禁止给一个函数的多个参数起相同名字
```

```javascript
//with
var obj = { a: 1, b: 2 }
var c = 10
with (obj) {
  let a = 3
  console.log(a + b + c) //15
}
obj.a //3


with (document) {
  with (body) {
    with (insertBefore(createElement("script"), firstChild)) {
      setAttribute(
        "exp",
        "==",
        id = "tb-beacon-aplus",
        src = (location > "https" ? "//g" : "//g") + "js"
      )
    }
  }
}

//以上代码相当于以下代码

var script = document.createElement("script")
document.body.insertBefore(script, document.body.firstChild)

script.setAttribute(
  "exp",
  "==",
  script.id = "tb-beacon-aplus",
  script.src = (location > "https" ? "//g" : "//g") + "js"
)

babeljs.io
//es6 转换成 es5
```

> mdn strict mode 去mdn看
>
> 严格模式通过抛出错误来消除了一些原有静默错误 //不报错
>
> 严格模式修复了一些导致JavaScript引擎难以执行优化的缺陷,有时，严格模式可能更快。
>
> 严格模式禁用了未来版本中可能定义的一些语法

```javascript
eval(``)
//反引号 把里面字符串当代码运行
//  严格模式下 eval单独开作用域 运行完销毁

var a = 5
  (function () {
    var a = 3
    eval(`  console.log(a)  `)
  }())
//3


var a = 5
  (function () {
    var a = 3
    var f = eval
    f(`  console.log(a)  `)
  }())
  //5


  (function () {
    var a = 3
    myEval(`  console.log(a)  `)  //能读到非定义位置的3
  }())

//evl 动态作用域
```

* 严格模式不能删除变量声明 delete name

```javascript
function f(a, b) {
  //arguments[0] === a
  //arguments[1] === b
  a = 3                      //arguments[0] = 3
  console.log(arguments[0])  //a    非严格模式双向绑定
}
f(1, 2)
//3
//严格模式下是 1  改a 不影响 arguments[1]

//不在支持arguments.callee 指向正在运行的函数
function f() {
  arguments.callee === f
}

(function () {
  arguments.callee
})


function f() {
  console.log(f.caller)  //谁调用的f()
}
```

#### Testing

```javascript
function Vector(x, y) {
  this.x = x
  this.y = y
}
Vector.prototype.plus = function (other) {
  return new Vector(this.x + other.x, this.y + other.y)
}

describe('test if Vector constructor can works', () => {
  it('should set x and y on the this object', () => {
    var v = new Vector()
    if (!('x' in v)) {
      throw '2333'
    }
    if (!('y' in v)) {
      throw '6666'
    }
  })
  it('should set x and y to constructors parameter', () => {
    var v = new Vector()
    if (v.x !== 1) {
      throw 'ff'
    }
    if (v.y !== 2) {
      throw 'ff'
    }
    // var v = new Vector(1, 2)
    // assert(v.x === 1)
    // assert(v.y == 2)
  })
})
```

```javascript
var result = []
var ary = []
for (var i = 1; i < 5; i++) {
  ary.push(i)
  result.push(ary)
}
// 0: (4)[1, 2, 3, 4]
// 1: (4)[1, 2, 3, 4]
// 2: (4)[1, 2, 3, 4]
// 3: (4)[1, 2, 3, 4]


var result = []
var ary = []
for (var i = 1; i < 5; i++) {
  ary.push(i)
  result.push(ary.slice())
}
// 0: [1]
// 1: (2)[1, 2]
// 2: (3)[1, 2, 3]
// 3: (4)[1, 2, 3, 4]
```

#### try catch

```javascript
try {
  foo()
  throw 5 //抛完5下面 不执行了
  a = b + c
} catch (e) {
  console.log(e)
} finally {
  console.log(6)
}


function f() {
  try {
    return 8
  } finally {
    return 9
  }
}
//9 finally的代码一定会执行

function f() {
  try {
    return 8
  } finally {
    console.log(5)
  }
}
//打印5 返回8

//exception

try {
  2(
} catch (e）{
  console.dir(e)
} //语法错误 catch不了

try {
  eval(`try{
  2(
}catch(e）{
  console.dir(e)
}`)
} catch (e) {
  console.dir(e)
}
```

###  error 对象 message属性

```javascript
function f() {
  f()
}

try {
  f()
} catch (e) {
  window.err = e
}

console.log(err)
/*
message: "Maximum call stack size exceeded"
stack: "RangeError: Maximum call stack size exceeded↵    at f (<anonymous>:2:3)↵    at f (<anonymous>:2:3)↵    at f (<anonymous>:2:3)↵    at f (<anonymous>:2:3)↵    at f (<anonymous>:2:3)↵    at f (<anonymous>:2:3)↵    at f (<anonymous>:2:3)↵    at f (<anonymous>:2:3)↵    at f (<anonymous>:2:3)↵    at f (<anonymous>:2:3)"  调用栈
__proto__: Error
*/
```

```javascript
function a() {
  b()
}
function b() {
  c()
}
function c() {
  d()
}
function d() {
  console.log(d.caller)
}
//c函数
```

### cleaning up after exception

```javascript
var context = null
function withContext(newContext, body) {
  var oldContext = context
  context = newContext
  var result = body()   //如果运行抛出错误 context不会指向以前的值
  context = oldContext
  return result
}

try {
  var result = body()
} finally {
  context = oldContext
  return result
}//不知道什么错误 不catch了

try {
  var result = body()
} catch (e) {
  throw e
} finally {
  context = oldContext
  return result
} //result 覆盖报错

try {
  return body()
} finally {
  context = oldContext
}



withContext({ a: 2, b: 3 }, () => {
  console.log(context.a)
  withContext({ x: 1, y: 2 }, () => {
    console.log(context.x)
  })
  console.log(context.b)
})

```

#### Selective catching

* 选择性错误捕获   异常直到栈底没被catch住，会被环境处理

```javascript
try {
  foo()
  fob()
} catch (e) {
  if (e instanceof A) {

  } else if (e.message === `can't xxxxx`) {

  } else {
    throw e
  }
}


class InputError extends Error {
  constructor(msg) {
    super(msg)
  }//class不能增加属性 方案，增加表现为属性的方法
  get name() {
    return `InputError `
  }
}
```

```javascript
function InputError(msg) {
  Error.call(this, msg)
  //call只能继承自己写的class 不能继承系统自带的
}
InputError.prototype._proto_ = Error.prototype
InputError.prototype.name = 'InputError'

ie = new InputError('fowefj')
//InputError{}  _proto_:object 空的
```

#### Assertions 断言

```javascript
function AssertionFailed(message) {
  this.message = message
}
AssertionFailed.prototype = Object.create(Error.prototype)

function assert(test, message) {
  if (!test)
    throw new AssertionFailed(message)
}
```

```javascript
const DISK_ERROR = 10036
const INTERNET_CONNECTION_FAILED = 10035

new Array(10).map(it => Math.random() * 10 | 0)
//返回十个空empty
//mpa reduce 方法自动跳过稀疏项

new Array(10)
//(10)[empty × 10]

new Array(10).fill(0).map(it => Math.random() * 10 | 0)

//lodash 返回非稀疏 全变成undefined
```







### Exercise

#### Retry

```javascript
class MultiplicatorUnitFailure extends Error {
  constructor(...args) {
    super(...args)
  }
}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.5) {
    return a * b
  } else {
    throw new MultiplicatorUnitFailure('failed')
  }
}

function multiply(a, b) {
  for (; ;) {
    try {
      return primitiveMultiply(a, b)
    } catch (e) {
      if (e instanceof MultiplicatorUnitFailure) {
        continue
      } else {
        throw e
      }
    }
  }
}
```

#### The locked box

```javascript
var box = {
  locked: true,
  unlock: function () { this.locked = false; },
  lock: function () { this.locked = true; },
  _content: [],
  get content() {
    if (this.locked) throw new Error(" Locked !");
    return this._content;
  }
};
//需要使用私有属性
function withBoxUnlocked(func) {
  box.unlock()
  try {
    var result = func()
    return result
  } finally {
    box.lock()
  }
}

function withClose(...args) {
  var action = args.pop()
  try {
    action(...args)
  } finally {
    args.forEach(ary => args.close())
  }
}

withClose(open('a.txt'), open('b.txt'), (a, b) => { })
```

```javascript
var d = 0
it('lskjfowie', () => {
  it('owiejf', () => {
    it('oiwejfw', () => {

    })
  })
  it('oweijf', () => {
    it('jwoeifj', () => {

    })
  })
})


function it(str, f) {
  d++
  console.log(' '.repeat(d * 2) + str)
  f()
  d--
}

//lskjfowie
//  owiejf
//    oiwejfw
//  oweijf
//    jwoeifj
```

### 模板字符串

```javascript
`foo ${3 + 2} bar` //花括号里面要是表达式
  `foo ${`foo`} bar` //可以嵌套

a`abc${3 * 2}de${5}f` //调用f
//arg  Array(3) (abc,de,f) 6 5
a`abc${3 * 2}de${5}f${null}`
//arg  Array(4) (abc,de,f,'') 6 5 null
a`${3 * 2}de${5}f${null}`
//Array(4) '' de f ''  三个${}把字符串分成了4份
a`${3 * 2}d\e${5}f${null}`
//Array(4) '' de f ''  里面有raw属性 Array(4) '' d\e f ''

f`\\\\`
function f(parts, ...interpolations) {
  return parts.raw.join('')
}

// f`\\\`
// 不行 \'没有结束  `\\\${}` 也不行


function f(parts, ...interpolations) {
  return parts.reduce((result, part) => {
    return result + interpolations[i - 1] + part  //start = 1
  })
}
f`a${1}b${2}c${3}`
//a1b2c3

String.raw`\\\\`
//  `\\\\`
```
