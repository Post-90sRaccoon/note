# Values,Types,and Operators

## numbers

* javascript 用64位bit存储数字类型值。一位表示正负号。

有些位要存十进制小数点。

* 表示指数    2.998e8
* 小数计算不能精确

* ‘%’，取模，求余数

### 特殊数字

* Infinity
* -Infinity
* NaN  类型是number 代表不是数字（0/0,Infinity-Infinity）

## 字符串

‘Down on the sea’

“Lie on the ocean”

\`Float on the ocean\`(反引号，tab上面的键)

* 转义字符\    \n  newline   \t tab 
* 每个字符占用16位，一些字符占用两倍
* 反引号字符串叫做模板文字，可以嵌入其他值。
* 模板文字里${}的结果将被计算并转换成字符串。

```javascript
console.log(`half of 100 is ${100 / 2}`);
```

## 一元运算符

```javascript
console.log(typeof 4.5);
console.log(typeof "x");
// number
// string
```

##Boolean

### 比较符

`console.log("Aardvark" < "Zoroaster")`

* 大写字母小于小写字母，然后大略按照字母表顺序
* 唯一不等于自己的值 NaN

### 逻辑运算符

*  &&   and
*  ||     or
*  !       not

* 运算优先级  其他（比较符）、 &&、||

```javascript
console.log(true ? 1 : 2);
console.log(false ? 1 : 2);
// 1
// 2   
//条件运算符 ？前为true 选择左面   ？前为false  选择右面
```

## 空值

* null    类型object
* undefined 类型undefined

## 自动类型转换

```javascript
console.log(8 * null);
// 0   是null转换的
console.log("5" - 1);
// 4
console.log("5" + 1);
// 51
console.log("five" * 2);
// NaN  不能转换成数字 就变成Na
console.log(false == 0)
// true
```

```javascript
console.log(null == undefined);
//true
console.log(null == 0);
//false
```

* null和undefined只能和null或undefined相等。想测试一个数是real value还是null或undefined，只需要和null比一比。

* 测试一个值是否是false。使用‘’==\=''和‘’!\==‘’,可以防止类型转换。

### 逻辑运算符的短路

* 对于|| 如果左边的值能转换成true 就返回左边的值，否则返回右边。

```javascript
console.log(null || "user");
console.log("Agnes" || "user");
// user
// Agnes
```

* 可以利用这个返回一个默认值。可能是empty的值||default value。0，NaN,和空“ ”字符串被转换成false，其他都是true。
* 对于&&  如果左面为false返回左面，否则返回右面
* 只有有必要时才考虑右边，否则即使有错也无所谓，条件运算符也是这样。

## 总结

* 四种类型：数字，字符串，布尔，空值。



# 编程结构

## 表达式和语句

### 变量

* `let caught =5 ，two=2;`
* 如果没对一个变量赋值，将得到undefined
* var也可以声明变量
* const 声明不变的量

### 变量名

* 数字不能开头，可以包含$和_

### 环境

* bindings和他们的值存在的时间叫做环境。当程序开始，环境不为空。

### 方法

### 返回值

* `console.log(Math.max(2,4));`

### 控制流

Number()\String()\Boolean()   转换

### 条件执行

```javascript
    let theNumber = Number(prompt("Pick a number"));
    if (!Number.isNaN(theNumber))
    console.log("Your number is the suqare root of " + theNumber * theNumber);
		else{
    console.log("Hey.Why didn't you give me a number?");
      }
```



### while 循环

```javascript
    let yourName;
    do {
      yourName = prompt("Who are you?");
    } while (!yourName);
    console.log(yourName);
```
###for 循环

```javascript
for(let number=0;number<=12;number =number+2){
  console.log(number);
}
```

### 跳出循环

```javascript
for (let current = 20; ; current = current + 1) {
  if (current % 7 == 0) {
    console.log(current);
    break;
    // 21
  }
}

```

* countine关键字。跳出循环体内剩下的语句，直接进行下一次迭代。

### 用switch分配值

```javascript
switch (prompt("What is the weather like?")) {
  case "rainy":
    console.log("Remember to bring an umbrella.");
    break;
  case "summy":
    console.log("Dress lightly.");
  case "cloudy":
    console.log("Go outside.");
    break;
  default:
    console.log("Unknow weather type!");
    break;
}
```

* 没有匹配进入default。

### exercise

```javascript
let str = "";
for (let i = 0; i < 7; ++i) {
  str += "#";
  console.log(str);
}

str = "";
let count = 7;
for (let i = 0; i < count; i++) {
  for (let k = 0; k < count - i; ++k) {
    str += "#";
  }
  str += "\n";
}
console.log(str);

for (let i = 1; i <= 100; ++i) {
  if (i % 15 == 0) {
    console.log("FizzBuzz");
  }
  else if (i % 3 == 0) {
    console.log("Fizz");
  }
  else if (i % 5 == 0) {
    console.log("Buzz");
  }
  else console.log(i);
}


let height = 10;
let width = 8;
str = "";
for (let i = 1; i <= height; ++i) {
  for (let j = 1; j <= width; ++j) {
    if ((i + j) % 2 == 0) {
      str += "#";
    }
    else {
      str += " ";
    }
  }
  str += "\n";
}
console.log("");


```



## 方法

### 定义一个方法

```javascript
const square = function (x) {
  return x * x;
}
console.log(square(12));
//144

const makeNoise = function () {
  console.log("Pling");
};
makeNoise();
// Pling

const power = function (base, exponent) {
  let result = 1;
  for (let count = 0; count < exponent; count++) {
    result *= base;
  }
  return result;
};
console.log(power(2, 10));
//1024;

```

* return后面没有值或者没有return语句，返回undefined。

## Bindings and scopes

* 变量在方法和块外声明。范围是整个程序。叫做global。
* 变量声明在方法参数或者在方法里面就只能在方法里面使用，叫做local变量。
* 每次方法调用，这些变量的新实体将被创建。
* var声明的变量如果不在方法里，就是global。

```javascript
let x = 10;
if (true) {
  let y = 20;
  var z = 30;
}
console.log(x + " " + z + " ");
// 10 30
console.log(x + " " + y + " " + z + " ");
// ReferenceError: y is not defined
```

* 变量名相同，方法会根据方法里面的值而不是global。

  ```javascript
  const halve = function (n) {
    return n / 2;
  };
  let n = 10;
  console.log(halve(100));      //50
  console.log(n);               //10
  ```

  

### 嵌套范围

* 外部的方法看不到嵌套在里面的方法声明的变量

### 方法作为值

### 声明方法

* 可以在后面声明

  ```javascript
  console.log("The future says:", future());
  function future() {
    return "You'll never have flying cars.";
  }   //不需要分号
  ```

### 箭头方法

```javascript
const power =(base,exponent) =>{
  let result = 1;
  for (let count =0; count<exponent;count++){
    result *=base;
  }
  return result;
};
```

* 如果只有一个参数，可以省略圆括号，如果表达式只有一个，可以省略花括号。

```javascript
const square = x => x * x;
const horn = () => console.log("Toot");
horn();
```

### 调用栈

### 可选择参数

* 这段代码可以无错运行

  ```javascript
  function square(x) {
    return x * x;
  }
  console.log(square(4, true, "hedgehog"));
  //16    程序忽略了多余的参数，如果参数少了会填上undefined
  ```
   ```javascript
  function minus(a, b) {
  if (b == undefined) return -a;
  else return a - b;
  }
  console.log(minus(10));
  console.log(minus(10, 5));
   ```

* 如果你不想传undefined，可以给参数默认值，不填是就是默认值

```javascript
function power(base, exponet = 2) {
  let result = 1;
  for (let count = 0; count < exponet; count++) {
    result *= base;
  }
  return result;
}
console.log(power(4));
// 16
```

### CLOSURE

* 能把方法当做value，因为local变量在方法调用时都会重新创建。

```javascript
function wrapValue(n) {
  let local = n;
  return () => local;          //返回的是一个方法
}
let wrap1 = wrapValue(1);
let wrap2 = wrapValue(2);

console.log(wrap1());          //1  wrap1()相当于调用方法
console.log(wrap2());          //2
```

```javascript
function multiplier(factor) {
  return number => number * factor;
}
let twice = multiplier(2);
console.log(twice(5));      //10
```

### 递归

```javascript
function power(base, exponent) {
  if (exponent == 0) {
    return 1;
  } else {
    return base * power(base, exponent - 1);
  }
}
console.log(power(2,3));
```

```javascript
function findSolution(target) {
  function find(current, history) {
    console.log(current, history)
    if (current == target) {
      return history;
    } else if (current > target) {
      return null;
    } else {
      return find(current + 5, `(${history})+5`) ||
        find(current * 3, `(${history})*3`);
    }
  }
  return find(1, "1");
}
console.log(findSolution(24));
// (((1) * 3) + 5) * 3
```

### 增长的方法

```javascript
function print(count, width) {
  let i = String(count);
  while (i.length < width) {
    i = "0" + i;
  }
  return i;
}
function printall(cows, chickens, pigs) {
  console.log(`${print(cows, 3)} Cows`);
  console.log(`${print(chickens, 3)} Chickens`);
  console.log(`${print(pigs, 3)} Pigs`);
}
printall(7, 16, 3);
```

### exercise

```javascript
function compare(a, b) {
  return (a <= b ? a : b);
}
console.log(compare(12, 14));

function isEven(num) {
  if (num == 1) return false;
  else if (num == 0) return true;
  else if (num > 0) return isEven(num - 2);
  else return isEven(num + 2);
}
console.log(isEven(-10));

function countBs(str, par) {
  let count = 0;
  for (i = 0; i < str.length; ++i) {
    if (str[i] == par) count++;
  }
  return count;
}
console.log(countBs("打法BfBGDFGABdfasfdasggB", "B"));
```

#  数据结构对象和数组

## Data Sets

```javascript
let listOfNumbers = [2, 3, 5, 7, 11];
console.log(listOfNumbers[2]);
console.log(listOfNumbers[0]);
// 5
// 2
```

### 属性

* 几乎所有值都有属性，除了null和undefined
* .和[ ]的区别。value.x 取名字为x的属性的值。value[x]尝试计算x表达式的值，用x表达式的结果，转换成string，作为属性名。

```javascript
let listOfNumbers = [2, 3, 5, 7, 11];
console.log(listOfNumbers[2]);
console.log(listOfNumbers[0]);
console.log(listOfNumbers.length);
// 5
// 2
//5
```

### 方法

```javascript
let doh = "Doh";
console.log(typeof doh.toUpperCase);
console.log(doh.toUpperCase());
// function
//   DOH
```

```javascript
let sequence = [1, 2, 3];
sequence.push(4);
sequence.push(5);
console.log(sequence);
console.log(sequence.pop());
console.log(sequence);
// [1, 2, 3, 4, 5]
// 5
// [1, 2, 3, 4]
```

* push在数组后加value，pop()remove最后的值。

### object

* 一种方法是用括号包起来表达式

```javascript
let day1 = {
  squirrel: false,
  events: ["work", "touched tree", "pizza", "running"]
};
console.log(day1.squirrel);
console.log(day1.wolf);
day1.wolf = false;
console.log(day1.wolf);
// false
// undefined
// false
```

* 不合法的属性名字需要引号

  ```javascript
  console.log(Object.keys({ x: 0, y: 0, z: 2 }));
  // 查看对象有哪些属性['x', 'y', 'z']
  
  let objectA = { a: 1, b: 2 };
  Object.assign(objectA, { b: 3, c: 4 });
  console.log(objectA);
  // { a: 1, b: 3, c: 4 }   分配属性
  
  
  
  let journal = [
  {events: ["work", "touched tree", "pizza",
  "running", "television"],
  squirrel: false},
  {events: ["work", "ice cream", "cauliflower",
  "lasagna", "touched tree", "brushed teeth"],
  squirrel: false},
  {events: ["weekend", "cycling", "break", "peanuts",
  "beer"],
  squirrel: true},
  /* and so on... */
  ];
  ```

  