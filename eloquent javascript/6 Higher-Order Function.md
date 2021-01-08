# 6 Higher-Order Function

   ```javascript
//self-contained 自包含的 自解释的 不调用额外函数
var total = 0, count = 1
while (count <= 10) {
  total += count
  count += 1
}
console.log(total)

//依赖两个外部的函数
console.log(sum(range(1, 10)))

function range(start, end) {
  var result = []
  for (var i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
   ```

### Abstraction

* 抽象隐藏细节

* 高阶函数核心函数可以被传递

```javascript
function f(x) {
  var a = 8
  x()
  console.log(x + 'xxx')
}
var a = 2
f(function () {
  console.log(a)
})
// 括号不代表作用域 function 的作用域是全局 不能读到a = 8
// 函数在哪里声明 就在那里找 打印出
// 2
// function () {
//   console.log(a)
// } xxx
// 函数和字符串拼接 打印出源码加字符串
```
```javascript
function f() {
  return function add(a, b) {
    return a + b
  }
}

var g = f()
// 右面运行f 返回一个函数add g指向函数add
console.log(g(1, 2))
//3 
```



###  Abstracting array  traversal

```javascript
//兜圈子的方式 遍历数组
var array = [1, 2, 3]
for (var i = 0; i < array.length; i++) {
  var current = array[i]
  console.log(current)
}
// 把遍历数组抽象
function logEach(array) {
  for (var i = 0; i < array.length; i++) {
    console.log(array[i])
  }
}
// 如果想对数组做其他的事情而不是打印
function forEach(array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i])
  }
}

var sum = 0
forEach([1, 2, 3, 4], function (value) {
  sum = sum + value
})
// function里面的value作为形参 为了让function能访问到array[i]
console.log(sum)
//10
```

```javascript
var sum = 0
function forEach(array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i])
  }
}
function addToSum(value) {
  sum = sum + value
}
forEach([1, 2, 3, 4], addToSum)
console.log(sum)
```

#### 数组的forEach 方法

```javascript
[1, 2, 3, 4].forEach(function (val) {
  console.log(val)
})
// 1 2 3 4
[1, 2, 3, 4].forEach(function (val, index, thearray) {
  console.log(val, index, thearray)
})

//自己实现
function forEach(array, action) {
  for (let i = 0; i < array.length; i++) {
    action(array[i], i, array)
  }
}

forEach([1, 2, 3, 4], console.log)
```

```javascript
//数组或对象使用
function forEach(obj, action) {
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      action(obj[i], i, obj)
    }
  } else {
    for (var key in obj) {
      action(obj[key], key, obj)
    }
  }
}

forEach({
  a: 1,
  b: 2,
  c: 3,
}, function (val, propName) {
  console.log(val, propName)
})

// 1 a
// 2 b
// 3 c

```

![image-20200606212617515](6%20Higher-Order%20Function.assets/image-20200606212617515.png)

#### Higher-order functions

* 当一个函数操作其他函数时，(不管那他们当参数，还是返回一个函数)。这个函数就被称为高阶函数。
* 高阶函数对动作进行抽象，普通函数对数据进行抽象
*  高阶函数有几种形式 
  * 创建一个返回新函数的函数

```javascript
//返回一个判断其唯一参数是否大于n的函数
function greaterThan(n) { 
  return function (m) { return m > n }
}
var greaterThan5 = greaterThan(5)
var greaterThan10 = greaterThan(10)
console.log(greaterThan10(11))
//true
```

* greaterThan5 == greaterThan10 false

* greaterThan5.toString() === greaterThan10.toString() true 源代码相同

  ![image-20200606221314623](6%20Higher-Order%20Function.assets/image-20200606221314623.png)

  * 用一个函数改变其他函数的行为

```javascript
function noisy(f) {
  return function (arg) {
    console.log('valling with', arg)
    var val = f(arg)
    console.log('called with', arg, '- got', val)
    return val
  }
}
//为函数f添加一点噪音
// 返回一个函数 跟原来对比 参数相同 返回的值相同 但是多了两个console.log
console.log(noisy(Boolean)(0))
// valling with 0
// called with,0,-got,false
// false
```

* 可以通过函数提供新型的控制流 高阶函数里套函数

  ```java
  function unless(test, then) {
    if (!test) then()
  }
  
  function repeat(times, body) {
    for (var i = 0; i < times; i++) {
      body(i)
    }
  }
  
  repeat(3, function (n) {
    unless(n % 2, function () {
      console.log(n, 'is even')
    })
  })
  // 0 is even
  // 2 is even
  ```

  ####  lexical scoping rules 词法作用域规则
  
  *  内部函数定义的变量并不会在外面被访问

### 

#### Passing alone arguments

* 可变参数

* 没有...时 es5

  ```javascript
  function f() {
    var args = Array.from(arguments)
    //把f所有参数变成数组
    return g.apply(null,args)
    //apply 把args的每一个元素 抽出来 作为参数 返回函数的运行结果
  }
  ```

  ```javascript
  function f(a, b, c, d) {
    console.log(a + b + c + d)
  }
  
  f(1, 2, 3, 4)
  // 此时 a=1 b=2 c=3 d=4
  f(...[5, 1, 8])
  //...把数组展开 a=5 b=1 c=8 d=undefined
  f.apply(null, [1, 2, 3, 4, 5, 6, 7])
  //传七个参数 a=1 b=2 c=3 d=4 可通过argument使用后面多余的参数
  
  ```

  ```javascript
  function transparentWrapping(f) {
    return function(){
      return f.apply(null，arguments)
    }
  }
  // 一个不多一个不少的传递所有参数 也仅仅只有这些参数
  ```

  

#### JSON

```json
  [
    { "name": "Emma", "sex": "f", "born": "1876", "died": "1956", "father": "Petrus", "mother": "Sophia",},
    { "name": "Carolus", "sex": "m", "born": "1832", "died": "1905", "father": "Carel", "mother": "Maria", },...
    and so on 
  ]
```

* 所有属性必须双引号包裹，而且只能简单数据表达式(直接量)，不能有运算。双引号内部不能出现明文tab符，不能出现任意多余符号，没有undefined和NaN 只有null

```javascript
var jsonString = `
[{
    "name": "Lily",
    "born": "1890",
    "died": "1965"
},{
    "name": "Jim",
    "born": "1790",
    "died": "1865"
}]`

var ary = JSON.parse(jsonString)
//JSON 转化成数组
console.log(ary)
// [
//   { name: 'Lily', born: '1890', died: '1965' },
//   { name: 'Jim', born: '1790', died: '1865' }
// ]
console.log(JSON.stringify(ary))
//字符串化
// [{ "name": "Lily", "born": "1890", "died": "1965" }, { "name": "Jim", "born": "1790", "died": "1865" }]

JSON.stringify(ary, null, 2)
//缩进两个空格 遇到} ] , 就回车
//第二个参数是函数 该函数参数(key,value) 如果返回undefined 这一项不会添加到json里
console.log(JSON.parse(`{"a":"1"}`))
//{ a: '1' }
```

* JSON.stringify  把js的值转换为JSON编码的字符串   序列化      seriallize

* JSON.parse  把JSON的string转化为js的数据            反序列化

#### Filtering an array

```javascript
function filter(ary, test) {
  var result = []
  // for (var i = 0; i < ary.length; i++) {
  //   if (test(ary[i])) {
  //     result.push(ary[i])
  //   }
  // }
  ary.forEach(function (p) {
    if (test(p)) {
      result.push(p)
    }
  })
  return result
}

console.log(
  filter(ancestry, function (p) {
    if (p.sex == 'f') {
      return true //返回到if(test(p))
    }
  })
)

//filter的使用
console.log(ancestry.filter(function(person){
  return person.father == "Carel Haverbeke"
}))

//filter里面的函数 返回boolean  
```

#### Transforming with map

 ```javascript
function map(ary, mapper) {
  var result = []
  for (var i = 0; i < ary.length; i++) {
    result.push(mapper(ary[i], i, ary))
  }
  return result
}

ancestry.map(function (p, idx) {
  return p.name
})

//fliter返回选出的整个数组 map返回数组里的值
//链式调用
ancestry.filter(function (p, idx) {
  return p.died - p.born > 50
}).map(function (p) {
  return p.name
})
//map 里的函数 返回数组想要的值
 ```

#### 箭头函数

```javascript
var f = function (a, b) { return a + b }
var f = (a, b) => { return a + b }

//函数体只有一句return的时候
var f = (a, b) => a + b

var f = (a) => a * a
//当函数参数只有一个
var f = a => a * a

ancestry.filter(p => p.died - p.born > 50).map(p => p.name)

let transWrap = f => (...args) => f(...args)
```

* 箭头函数没有arguments

```javascript
function f(){
  var g = () => {
    console.log(arguments)
  }
  g()
}

f(1, 23, 4, 5)

//这里的arguments是普通变量 f函数传进来的 不是匿名function的
```

```javascript
var a = { "foo.bar" : 3 }
 a.foo.bar
 //错误 找a的foo属性 但a没有
a["foo.bar"]
```

* 序列化：对象 等等 内存里不是连续空间存储

  用字符串表示分散的信息表达成连续的东西

#### 自写forEach的break与continue

```javascript
// forEach不能随时break 找到想要的值后也停不了 一定要全部遍历

function forEach(ary, action) {
  for (var i = 0; i < ary.length; i++) {
    var x = action(ary[i], i)
    if (x === false) {
      break
    }
  }
  return ary //有返回值 不再是undefined 可以链式调用
}

var target = 3
var targetIndex = -1

forEach([1, 2, 3, 4], function (aryItem, idx) {
  if (xx) {
    return
  }//相当于continue
  if (aryItem == target) {
    targetIndex = idx
    return false
  }//相当于break
}).map()
```

#### reduce

```javascript
function reduce(ary, reducer, initial) {
  let start = 0
  if (arguments.length == 2) {
    initial = ary[0]
    start = 1
  }//没有initial ary[0]做初始值
  for (let i = start; i < ary.length; ++i) {
    initial = reducer(initial, ary[i], i, ary)//这里initial位置要和后面对应
  }
  return initial
}

let result = reduce([1, 2, 3, 4], (previous, present) => previous + present)
console.log(result)

let all = ['foo', 'bar', 'zzz'].reduce((result, item) => {
  result[item] = true
  return result
}, {})
console.log(all)
// { foo: true, bar: true, zzz: true }
```

#### Composability

```javascript
console.log(average(ancestry.filter(male).map(age)))
//ancestry.filter(male) 选出所有男性信息
//(......)map(age) 再选出他们的年龄
console.log(ancestry.filter((person => person.sex == 'm')).map(person => person.died - person.born))
```

#### the cost

> 效率会低一些 
>
> 会产生临时数组      空间消耗
>
> 函数调用时间比普通循环慢  时间消耗
>
> 函数运行 调用栈 jump 

#### keyBy

```javascript
//假设祖先名字全不相同
var byName = {}

ancestry.forEach((p) =>
  byName[p.name] = p)

var byName2 = ancestry.reduce((obj, item) => {
  obj[item.name] = item
  return obj
}, {})
```

```javascript
function keyBy(ary, key) {
  let result = {}
  // for (let i = 0; i < ary.length; ++i) {
  //   result[ary[i][key]] = ary[i]
  // }
  ary.forEach(item => {
    result[item[key]] = item
  })
  return result
}

function keyBy(ary, key) {
  return ary.reduce(function (obj, item) {
    obj[item[key]] = item
    return obj
  }, {})
}

var byName = keyBy(ancestry, 'name')

var byName2 = (ary, key) => ary.reduce((obj, item) => ((obj[item[key]] = item), obj), {})

//逗号表达式返回右面的obj
```

#### groupBy

```javascript
function groupby(ary, property) {
  var result = {}
  ary.forEach(item => {
    var key = item[property]
    if (!(key in result)) {
      result[key] = [] // 下面是push 所以这里是[] 数组
    }
    result[key].push(item)
  })
  return result
}

var grouped = groupBy(ancestry, 'sex')
```

```javascript
function groupBy(ary, f) {
  var result = {}
  ary.forEach(item => {
    var key = f(item)
    if (!(key in result)) {
      result[key] = []
    }
    result[key].push(item)
  })
  return result
}

console.log(groupBy(ancestry, p => p.died - p.born))
```

```javascript
function groupBy(ary, by) {
  var f = by
  if (typeof by == 'string') {
    f = item => item[by]
  }

  var result = {}
  ary.forEach(item => {
    var key = f(item)
    if (!(key in result)) {
      result[key] = []
    }
    result[key].push(item)
  })
  return result
}
```

####  递归计算dna

![image-20200608164629799](6%20Higher-Order%20Function.assets/image-20200608164629799.png)

```javascript
var byName = {}
ancestry.forEach(p => {
  byName[p.name] = p
})


function shareDNA(person) {
  if (person.name == 'Pauwels van Haverbeke') {
    return 1
  }
  var father = byName[person.father]
  if (!father) {
    a = 0
  } else {
    var a = shareDNA(father)
  }
  if (person.name == '') {
    return 1
  }
  var mother = byName[person.mother]
  if (!mother) {
    b = 0
  } else {
    var b = shareDNA(mother)
  }
  return (a + b) / 2
}

console.log(shareDNA(byName['Philibert Haverbeke']))
```

```javascript
var byName = {}
ancestry.forEach(p => {
  byName[p.name] = p
})


function shareDNA(name) {
  if (name == 'Pauwels van Haverbeke') {
    return 1
  }
  var person = byName[name]
  if (!person) {
    return 0
  }

  var a = shareDNA(person.father)
  var b = shareDNA(person.mother)
  return (a + b) / 2
}

console.log(shareDNA('Philibert Haverbeke'))
```

```javascript
var byName = {};
ancestry.forEach(function (person) {
  byName[person.name] = person;
})


function reduceAncestors(person, f, defaultValue) {
  function valueFor(person) {
    if (person == null)
      return defaultValue;
    else
      return f(person, valueFor(byName[person.mother]),
        valueFor(byName[person.father]));
  }
  return valueFor(person);
}


function sharedDNA(person, fromMother, fromFather) {
  if (person.name == " Pauwels van Haverbeke ")
    return 1;
  else
    return (fromMother + fromFather) / 2;
}


var ph = byName[" Philibert Haverbeke "];
console.log(reduceAncestors(ph, sharedDNA, 0) / 4)
```

#### 祖先活过70岁以上人数

```javascript
function countAncestors(person, test) {
  function combine(current, fromMother, fromFather) {
    var thisOneCounts = current != person && test(current);
    return fromMother + fromFather + (thisOneCounts ? 1 : 0);
  }
  return reduceAncestors(person, combine, 0);
}
function longLivingPercentage(person) {
  var all = countAncestors(person, function (person) {
    return true;
  });
  var longLiving = countAncestors(person, function (person) {
    return (person.died - person.born) >= 70;
  });
  return longLiving / all;
}
console.log(longLivingPercentage(byName[" Emile Haverbeke "]))
```



```javascript
function olderThan70(name) {
  var person = byName[name]
  if (!person) {
    return 0
  }
  var count = 0
  if (person.died - person.born > 70) {
    count++
  }
  var a = olderThan70(person.mother)
  var b = olderThan70(person.father)

  return count + a + b
}

function countPerson(name) {
  var person = byName[name]
  if (!person) {
    return 0
  }
  return 1 + countPerson(person.father) + countPerson(person.mother)
}
```

 ```javascript
function reduceAncestors(person, f, defaultValue) {
  function valueFor(person) {
    if (person == null)
      return defaultValue;
    else
      return f(person, valueFor(byName[person.mother]),
        valueFor(byName[person.father]));
  }
  return valueFor(person);
}

reduceAncestors(byName['emily'],(person,mother,father)=>{
  return(person.died - person.born > 70 ? 1 : 0) +
  mother + father
},0)

 ```

```javascript
//不包括自己
function olderThan70(name) {
  var person = byName[name]
  if (!person) {
    return 0
  }

  var father = byName[person.father]
  var mother = byName[person.mother]

  var fatherCount = (father && father.died - father.born >= 70)?1:0
  var motherCount = (mother && mother.died - mother.born >= 70)?1:0 
  //father mother没有返回undefined 

  var a = olderThan70(person.mother)
  var b = olderThan70(person.father)

  return fatherCount + motherCount + a + b
}

function countPerson(name) {
  var person = byName[name]
  if (!person) {
    return 0
  }
  return 1 + countPerson(person.father) + countPerson(person.mother)
}






function countPerson(name) {
  var person = byName[name]
  if (!person) {
    return 0
  }
  var father = byName[person.father]
  var mother = byName[person.mother]
  var a = countPerson[person.father]
  var b = countPerson[person.mother]

  return (father ? 1 : 0) + (mother ? 1 : 0) + a + b
}

```



#### 回顾

![image-20200608193106130](6%20Higher-Order%20Function.assets/image-20200608193106130.png)

```javascript
var a = function () {
  var array = []
  //var i
  for (var i = 1; i < 10; i++) {//var i提升
    array.push(function () {
      return i * i
    })
  }
  return array
}

var c = a() //array被push了9个函数 function(){return i * i} 运行到i=10

var num1 = c[0]
var num2 = c[1]
var num3 = c[2]
console.log(num1(), num2(), num3())
//100 100 100 形成了闭包 访问没有没销毁的作用域 i =10 10*10=100
//var 改成 let 1,4,9   let i = 1 每次循环都会产生一个作用域 会产生十个作用域 数组里的函数指向不同的作用域
```

```javascript
var a = function () {
  var array = []
  for (var i = 1; i < 10; i++) {
    (() => {
      var j = i
      function f() {
        return j * j
      }
      array.push(f)
    })()//强行创建作用域
  }
  return array
}

var c = a()

var num1 = c[0]
var num2 = c[1]
var num3 = c[2]
console.log(num1(), num2(), num3())
//1,4,9
```

```javascript
var a = function () {
  var array = []
  for (var i = 1; i < 10; i++) {
    ((i) => {
      function f() {
        return i * i
      }
      array.push(f)
    })(i)//强行创建作用域
  }
  return array
}

```

## Binding

```javascript
function f(a, b, c) {
  return a + b + c
}
var f2 = f.bind(null, 1, 2)
//a和b被固定成了1,2
console.log(f2(3))
//6

console.log(f2())
//NaN

var f3 = f2.bind(null, 5)
console.log(f3())
//8

//apply 接收参数数组 返回函数执行值
//bing  接收参数     返回参数值绑定的函数
```

#### 名字返回人

```javascript
var result = ["Carel Haverbeke", "Maria van Brussel", "Donald Duck"].map(name => byName[name])

console.log(result)

// function f(name) {
//   return byName[name]
// }
// var a = f("Carel Haverbeke")
// console.log(a)
//效率3
```

```javascript
var nameSet = ["Carel Haverbeke", "Maria van Brussel", "Donald Duck"]

var nameSet = ancestry.filter(p => {
   return (nameSet.includes(p.name)) {     
  }
})

console.log(person)
//效率3n


function isInSet(set, person) {
  return set.includes(person.name)
}

//ancestry.filter(isInSet)
//直接写不行 filter3个参数 p p下标 数组

var f = isInSet.bind(null,nameSet) 
// 绑定了第一个参数 nameSet 这样filter就只能传一个参数p
ancestry.filter(f)
```

```javascript
console.log(ancestry.filter(function (person) {
  return isInSet(theSet, person)
}))

//filter每次调用theSet都是固定的 可以绑定

var f = isInSet.bind(null.theSet)
console.log(ancestry.filter(function (person) {
  return f(person)
}))
//function 把person 传给 f 并且把f原样返回 fillter出来的person调用function function相当于 f

var f = isInSet.bind(null.theSet)
console.log(ancestry.filter(f)
)

console.log(ancestry.filter(isInSet.bind(null.theSet))) 
```

#### bind实现

```javascript
function bind(f, ...fixedArgs) {
  return function (...args) {
    return  f(...fixedArgs, ...args)
  }
}

function add(a, b, c) {
  return a + b + c
}
f2 = bind(add, 1)

//没有...
function bind(f ) {
  var fixedArgs = Array.from(arguments).slice(1)
  return function () {
    var args = Array.from(arguments)
    return  f.apply(null,fixedArgs.concat(args))
  }
}
```

#### reduce写map

```javascript
function map(ary, transform) {
  return ary.reduce((result, item, idx, ary) => {
    result.push(transform(item, idx, ary))
    return result
  }, [])
}
```

#### reduce写filter

```javascript
function filter(ary, test) {
  return ary.reduce((result, item, idx, ary) => {
    if (test(item, idx, ary)) {
      result.push(item)
    }
    return result
  }, [])
}

```

#### reduce写forEach

```javascript
function forEach(ary, action) {
  ary.reduce((_, item, idx, ary) => {
    action(item, idx, ary)
  }, null)
}
//下划线占位 不需要参数
```

```javascript
function f(a, b, c, d) {
  a = 0
  return a + b + c + d
}

f1 = f.bind(null, 1, 2)

//相当于
// function f1(c,d){
//   var a = 1 , b = 2
//   a = 0
//   return a + b + c + d
// }
console.log(f1(1, 1))
//4 
```

```javascript
['1', '2', '3'].map(parseInt)
// 1 NaN NaN

parseInt('1', 0, ['1', '2', '3'])
// 1当十进制理解
parseInt('2', 1, ['1', '2', '3'])
// 2当做1进制 NaN
parseInt('3', 2, ['1', '2', '3'])
// 3当做2进制 NaN
```

#### flatten

```javascript
function flatten(ary) {
  let result = []
  for (let i = 0; i < ary.length; i++) {
    let item = ary[i]
    if (Array.isArray(item)) {
      result.push(...item)
    } else {
      result.push(item)
    }
  }
  return result
}

function flatten(ary) {
  return ary.reduce((result, item) => {
    if (Array.isArray(item)) {
      result.push(...item)
    } else {
      result.push(item)
    }
    return result
  }, [])
}

function flatten(ary) {
  return ary.reduce((result, item) => {
    return result.concat(item)
  }, [])
}

let flatten = ary => [].concat(...ary)
```

#### flattenDeep

```javascript
function flattenDeep(ary) {
  let result = []
  for (let i = 0; i < ary.length; i++) {
    let val = ary[i]
    if (Array.isArray(val)) {
      result.push(...flattenDeep(val))
    } else {
      result.push(val)
    }
  }
  return result
}

function flattenDeep(ary) {
  return ary.reduce((result, item) => {
    if (Array.isArray(item)) {
      result.push(...flattenDeep(item))
    } else {
      result.push(item)
    }
    return result
  }, [])
}

console.log(flattenDeep([1, 2, [3, 4], [[5]], [[[6, [7]]]]]))
```

#### flattenDepth

```javascript
function flattenDepth(ary, depth) {
  if (depth === 0) {
    return ary.slice()
  }
  let result = []
  for (let i = 0; i < ary.length; i++) {
    let val = ary[i]
    if (Array.isArray(val)) {
      result.push(...flattenDepth(val, depth - 1))
    } else {
      return result.push(val)
    }
  }
  return result
}

function flattenDepth(ary, depth) {
  if (depth === 0) {
    return ary.slice()
  }
  return ary.reduce((result, item) => {
    if (Array.isArray(item)) {
      result.push(...flattenDepth(item, depth - 1))
    } else {
      result.push(item)
    }
    return result
  }, [])
} 


function flatten(ary){
  return flattenDepth(ary,1)
}
function flattenDeep(ary){
  return flattenDepth(ary,Infinity)
  // 并不会无穷递归 item总有不是数组的时候
}

// 如果depth是第一个参数
let flatten = flattenDepth.bind(null,1)
let flattenDeep = flattenDepth.bind(null,Infinity)
```

#### every and some

```javascript
function every(ary, test) {
  for (let i = 0; i < ary.length; i++) {
    if (!test(ary[i], i, ary)) {
      return false
    }
  }
  return true
}

function some(ary, test) {
  for (let i = 0; i < ary.length; i++) {
    if (test(ary[i], i, ary)) {
      return true
    }
  }
  return false
}  


function every(ary, cond) {
  return ary.reduce((pass, item, idx, ary) => {
    return pass && cond(item, idx, ary)
  }, true)
}
function some(ary, cond) {
  return ary.reduce((pass, item, idx, ary) => {
    return pass || cond(item, idx, ary)
  }, false)
}

// a && b
// !(!a || !b)

function every(ary, test) {
  function notTest(...args) {
    return !test(...args)
  }
  return !some(ary, notTest)
}

function every(ary, test) {
  return !some(ary, (...args) => !test(...args))
}
function some(ary, test) {
  return !every(ary, (...args) => !test(...args))
}
```

#### 问题解析

```javascript
function flip(func) {
  return function (...args) {
    return func(...args.reverse())
  }
}

parseInt2 = flip(parseInt)
parseInt3 = parseInt2.bind(null, 16)
  ;['1', '2', 'a'].map(parseInt3)
//[1,NaN,1]

/*
  parseInt3('1',0,['1','2','3']) -> parseInt2(16,'1',0,['1','2','3']) -> parseInt(['1','2','3'],0,'1',16)

  parseInt(['1','2','3'],0,'1',16)
  // 1
  //parseInt 第一个参数必须是字符串 转换成字符串 "1,2,a"
  //不认逗号 "1" 0进制解析 0不认 作为10进制 1

  parseInt(['1','2','3'],1,'1',16)
  //NaN 1进制不存在

  parseInt(['1','2','3'],2,'1',16)
  // 1  2进制解析为1
*/



// 限制接收参数
function unary(func) {
  return function (arg) {
    return func(arg)
  }
}

parseInt2 = flip(parseInt)
parseInt3 = parseInt2.bind(null, 16)
  ;['1', '2', 'a'].map(unary(parseInt3))

```

### lodash中的bind

```javascript
function bind(f, ...fixedArgs) {
  return function (...args) {
    let newArgs = fixedArgs.slice()
    let index = 0
    for (let i = 0; i < newArgs.length; i++) {
      if (newArgs[i] == null) {
        newArgs[i] = args[index++]
      }
    }
    while (index < args.length) {
      newArgs.push(args[index++])
    }
    return f.apply(this , newArgs)
  }
}
```

#### lodash中的filter

```javascript
function filter(collection, predicate) {
  let test = predicate
  if (typeof predicate === 'string') {
    test = it => it[predicate]
  } else if (typeof predicate === 'object') { //{active:true,gender:'f}
    if (Array.isArray(predicate)) {//['active',true,'gender','f']
      predicate = fromPairs(chunk(predicate, 2))
    }
    test = it => {
      for (let key in predicate) {
        if (it[key] !== predicate[key]) {
          return false
        }
      }
      return true
    }
  } else if (typeof predicate === 'function') {
    test = predicate
  }

  let result = []
  if (Array.isArray(collection)) {
    for (let i = 0; i < collection.length; i++) {
      if (test(collection[i], i, collection)) {
        result.push(collection[i])
      }
    }
  } else {
    for (key in collection) {
      if (test(collection[key], key, collection)) {
        result.push(collection[key])
      }
    }
  }
  return result
}

let users = [
  { 'user': 'barney', 'age': 36, 'active': true },
  { 'user': 'fred', 'age': 40, 'active': false }
]

console.log(filter(users, function (o) { return !o.active; }))
console.log(filter(users, { 'age': 36, 'active': true }))
console.log(filter(users, ['active', false]))
console.log(filter(users, 'active'))

let users1 = {
  a: { 'user': 'barney', 'age': 36, 'active': true },
  b: { 'user': 'fred', 'age': 40, 'active': false }
}

console.log(filter(users1, function (o) { return !o.active; }))
console.log(filter(users1, { 'age': 36, 'active': true }))
console.log(filter(users1, ['active', false]))
console.log(filter(users1, 'active'))



function fromPairs(ary) {
  let result = {}
  let length = ary == null ? 0 : ary.length
  let index = -1
  while (++index < length) {
    let pair = ary[index]
    result[pair[0]] = pair[1]
  }
  return result
}

function chunk(ary, size = 1) {
  let length = ary == null ? 0 : ary.length
  if (!length || size < 1) {
    return []
  }
  let index = 0, resIndex = 0
  let result = new Array(Math.ceil(length / size))

  while (index < length) {
    result[resIndex++] = ary.slice(index, index += size)
  }
  return result
}
```



