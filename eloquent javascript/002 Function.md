#### 问题回顾

* 'a'-'a' NaN    ==字符串转化为数NaN 转化为布尔 空0 非空1==

* ==\'' ''  0== 

    ```javascript
    console.log('aa' == true)
    //false
    console.log('true' == true)
    //false
    console.log('1' == true)
    //true
    //任何值和布尔等于 toNumber(boolean)
    
    //判断闰年
    (x % 400 == 0) ||((x % 4 == 0) && (x % 100 != 0))
    //判断100以内质数
    (x != 2 && x % 2 == 0)||(x != 3 && x % 3 == 0)||(x != 5 && x % 5 == 0)||(x != 7 && x % 7 == 0)
    
    NaN = 888
    undefined = 999
    //可以赋值 但值不变
    ```

#### Equality Comparison

* x==y

    ![image-20191227211433840](002%20Function.assets/image-20191227211433840.png)

![image-20191227210637999](002%20Function.assets/image-20191227210637999.png)

![image-20191227213630472](002%20Function.assets/image-20191227213630472.png)

* asi  auto semicolon insert
  * 当一行的第一个字符是+ - / [ (      这几个符号时 他前面一行必须加分号
  * 前置分号  foo  ;(2+3)

#### 变量声明及赋值语句

* 变量名不能包含空格 变量名不能以数字开头 不能包含标点符号 可以包含$和_

* function 的类型为function

  console.log

  获取console 变量的log属性

* Math.trunc()

  Math.floor()

  Math.ceil()

  Math.max(1,3,4)

  Math.round() 四舍五入

* confirm() 返回boolean
  prompt('您的年龄？'，"28")
  
* alert()
```javascript
var x = +prompt()
//将string 转换为 number
var a = 1,b=2,c=3;
var z=(a+1,b+2,a+b)
z=3 //a+1 b+2 语句也会执行
```

![image-20201027162542892](002%20Function.assets/image-20201027162542892.png)

![image-20201027163027228](002%20Function.assets/image-20201027163027228.png)



* Number() 把参数转换为数字并返回

  null 0

  undefined NaN

  ''      0

  'FADS'  NaN

  ```javascript
  console.log(a)
  //3.14
  console.log(typeof (a))
  //string
  ```

  

* isNaN() 是否是一个数值类型的值/不能被转换为数值 全局方法

  is Not a Number

  ‘fasa’  true

  
  
  NaN   true
  
  ‘ ’         false
  
  
  
  Number.isNaN()
  
  是否是NaN这个值

#### 整数在计算机中的表示

![image-20200603222149176](002%20Function.assets/image-20200603222149176.png)

* 方便计算减法

  5 -  3 = 5 + (-3)

  0101

  1101

  0010

* -1 +  1   -2+2  的反码都是全1 

* 整数运算会被转换为32位有符号数   -99 怎么表示    2 ^31^-99   因为-1 1…11+ 1 = 2<sup>31</sup>   2 ^31^-1-99 +1   取反加一

* 000 +8 =8  001+ 7 =8   010 +6 = 8



#### 位运算符

* 只支持整数  先被转换为32位整数 
  * 小数会舍掉小数部分
  * 超过32位 会保留右边32位 

  a|b   每一位对齐 或运算  只支持整数 转换成32位数 会把小数去掉 保留右边32个比特

  a&b

  ~a    取反 ==符号位也取反==

  a^b  异或 相同为0 不同为1

  a >> 2   保留符号位

  a << 2

  a >>> 2   （不保留符号位,右移左侧用0填充）

> **js** 进行位运算时，会将操作数转成带符号位的 32 位补码。运算结束后，再按照 64 位存储。这里肯定会精度丢失，超过 32 位的部分直接截断。
>
> 所以对一个非数值变量做取反操作，得到的一定是 -1，因为实际上等于对 0 做取反操作。

> 移位操作符在移位前做了两种转换，第一将不是`number`类型的数据转换为`number`，第二将`number`转换为无符号的`32bit`数据，也就是`Uint32`类型。
>
> * `Uint32`类型是如何转换的
>   1. 如果不能转换为`Number`，那就为`0`
>   2.  如果为非整数，先转换为整数，参考公式`sign(n) ⋅ floor(abs(n))`
>   3.  如果是正数，返回正数，如果是负数，返回负数 + 2的32次方，（原理符号位变0 再右移）

0b 二进制

a.toString(2) 数字转化为二进制

0x hex 

0o 八进制



任何数与自己按位异或都得到0

任何数与0按位异或都将得到自身



2147483649.5|0   取整 

0开头的数是八进制

```javascript
a = 2147483647
console.log(a.toString(2))
//111111111111111111111111111111  31位 前面隐藏了一位符号位
c = 2147483648
console.log(c | 0)
//- 2147483648

a = -5
console.log(a >> 2)
// -2
console.log(a >> 3)
// -1
console.log(a >> 32)
// -5   a>>32%32
console.log(a >> 35)
// -1   a>>35%32
console.log(a >>> 3)
//536870911

let a = 'aAcd'
console.log(a.charCodeAt(0))
//97
console.log(a.charCodeAt(1))
//65
```



continue 跳出循环体 进行下一次循环

for(fad;fa;跳到这里)



c++  会改变c的类型 转换成数值类型 

c+=1   不转换类型

parseInt('99 fafsdas',16)    153   ==99按照16进制解析成十进制数位153==



#### switch语句

```javascript
switch (4) {
  case 1:
    console.log('a')
    break
  default:
    console.log('d')
  case 2:
    console.log('b')
    break
  case 3:
    console.log('c')
    break
}
// d
// b

switch (4) {
  case 1:
    console.log('a')
    break
  default:
    console.log('d')
  case 2:
    console.log('b')
    break
  case 4:
    console.log('c')
    break
}
//c


switch (2) {
  case 1:
    console.log('a')
    break
  case '2':
    console.log('b')
    break
  case 3:
    console.log('c')
    break
  default:
    console.log('d')
}
// d  数字2和字符串2 switch用的是===

```

#### 牛顿法求根

![image-20200604181112757](002%20Function.assets/image-20200604181112757.png)

> x^2^= n   即 f(x) = x^2^ - n
>
> 当x= x0 时 切线斜率 k = f(‘x<sub>0</sub>) =2x<sub>0</sub>
>
> y = x<sub>0</sub>^2^ - n 
>
> k =( x<sub>0</sub>^2^ - n ) / ( x<sub>0</sub> - x1 )=2x<sub>0</sub>
>
> x<sub>1</sub> =  (x<sub>0</sub>^2^ + n) / 2x<sub>0</sub>
>
> ![image-20200604182105332](002%20Function.assets/image-20200604182105332.png)



通过不断迭代逼近根

```javascript
//使用牛顿法实现平方根的计算
function sqrt(n) {
  var r = n          
  //i是迭代次数 精确度
  for (var i = 0; i < 10; i++) {
    r = (r * r + n) / (2 * r)
  }
  return r
}
console.log(sqrt(20))

向下取整
var mySqrt = function(x) {
    var tmp = x;
    while (x * x > tmp)
        x = ((x + tmp / x) / 2) | 0;
    return x;  
};
```



#### 最大公约数

```javascript
//求最大公约数 辗转相除法
function largestCommonFactor(m, n) {
  while (m !== n) {
    if (m < n) {
      var t = m
      m = n
      n = t
    }
    m = m - n
  }
  return m
}


function largestCommonFactor(m, n) {
  let t = 1;
  while (t != 0) {
    t = m % n
    m = n
    n = t
  }
  return m
}

```



#### 函数声明

```js
var square = function (x) {
  return x * x;
}
//等号右面是一个表达式 有求值结果 求值结果就是函数自己
console.log(square(12))


var power = function (base, exponent) {
  var result = 1
  for (var count = 0; count < exponent; count++)
    result *= base;
  return result
}
console.log(power(2, 10))

var a = function() {
  console.log(x) //这里访问了全局的x
}

var a = function() {
  x = 10
  console.log(x) //这里访问了局部的x 屏蔽全局的x
}
```

* return 后面没有表达式 返回undefined

* result 变量在函数每次调用时重新创建

* 函数局部性 仅仅对参数和函数内部var定义的变量生效

* 判断2的方  2方2进制形如 10 100 1000 n&(n-1)

  #### 水仙花数

  ```javascript
  //水仙花数
  
  //求位宽
  var digitWidth = function (n) {
    let width = 0
    do {
      n = (n - n % 10) / 10
      width++
    } while (n != 0)
    return width
  }
  
  //求a的n次方
  var power = function (a, n) {
    var result = 1
    for (var i = 0; i < n; i++) {
      result *= a
    }
    return result
  }
  
  var isNarcissistic = function (n) {
    var width = digitWidth(n)
    var sum = 0
    var t = n
  
    do {
      var digit = t % 10
      sum += power(digit, width)
      t = (t - digit) / 10
    } while (t != 0)
  
    return (sum == n) ? true : false
  }
  
  //求1000以内的水仙花数
  
  for (var i = 1; i < 1000; i++) {
    if (isNarcissistic(i)) {
      console.log(i)
    }
  }
  
  ```

  ```javascript
  var x = 155
  digitWidth(x)//这里没有传递x进去 传递的是x的值155
  //3
  //x不变仍未155    
  ```

  ```javascript
  var isPrime = function (n) {
    let a = Math.sqrt(n)
    for (i = 2; i <= a; i++) {
      if (n % i == 0) {
        return false
      }
    }
    return true
  }
  
  
  //素数两性定理：大于3的素数只分布在6n+1和6n-1两数列中
  var isPrime = function (n) {
    if (n < 2) {
      return false
    }
    if (n == 2 || n == 3) {
      return true
    }
  
    if (n % 2 == 0) {
      return false
    }
    if (n % 6 !== 5 &&  n % 6 !== 1) {
      return false
    }
  
    let sqrt_n = Math.sqrt(n)
  
    for (let i = 3; i <= sqrt_n; i += 2) {
      if (n % i == 0) {
        return false
      }
    }
    return true
  }
  
  var countPrimes = function (n) {
    var count = 0
    for (let i = 2; i < n; i++) {
      if (isPrime(i)) {
        count++
      }
    }
    return count
  }
  
  //埃拉托斯特尼筛法 画图筛选去掉从2开始 找素数，先留2 然后2*2 去掉4 2*2+2去掉6 8,10 再找3 留3 去掉3*3 3*3+3
  //核心就是去掉2,3,5,7的倍数
  //let signs = new Uint8Array(n);
  //创建长度为n的数组 并且用0填充
  var countPrimes = function (n) {
    let count = 0;
    let signs = new Uint8Array(n);
    
    for (let i = 2; i <= n; i++) {
      if (!signs[i - 1]) {
        count++;
  
        for (let j = i * i; j <= n; j += i) {
          signs[j - 1] = true;
        }
      }
    }
    return count;
  };
  ```

  ```javascript
  //判断是否为2的幂
  var isPowerOfTwo = function(n) {
      if(n <= 0) {
          return false
      }
      return (n & (n - 1)) == 0 
  };
  //考虑2进制
  
  //判断是否为3的幂
  return 1162261467 % n == 0
  // 3的19次方 整形能表示的最大的3的幂 只能模3为0
  ```

  #### 回文数

  ![](002%20Function.assets/image-20200605103552287.png)
  
  ```html
  var isPalindrome = function (x) {
      if (x < 0) return false
      if (x < 10) return true
      let n = 10 ** ((Math.log10(x))|0)
      while (n > 1 && x > 0) {
          if (((x / n)|0) !== x % 10) return false
          x = ((x % n) / 10) | 0
          n /= 100
      }
      return true
  };
  ```
  
  

![image-20200605104755034](002%20Function.assets/image-20200605104755034.png)

#### 判断完全平方数

```javascript
//二分法
var isPerfectSquare = function(num) {
  if(num == 1) return num
  let low = 1
  let high = num
  let middle
  while(high - low > 1) {
      middle = (high + low) / 2 | 0
      if(middle * middle == num){
        return true    
      }
      else {
          (middle * middle > num)? high = middle : low = middle
      }
  }
  return false
};
```

#### 七进制

```javascript
var convertToBase7 = function(num) {
    let sum = 0
    let positive = 1
    let base = 1
    if (num < 0) {
        positive = 0
        num = -num
    }
    while(num > 0){
        digit = num % 7
        sum += digit * base
        num = (num - digit) / 7
        base *= 10
    }
    return positive ? sum : -sum
};
```



#### 判断weekday(某年某月第一天是星期几)

```js
 function isLeapYear(year) {
  if (year % 400 == 0) {
    return true
  }
  if (year % 100 == 0) {
    return false
  }
  if (year % 4 == 0) {
    return true
  }
  return false
}
function weekday(year, month) {
  //公元元年是1年
  var sum = 0
  var y = year - 1
  sum = y * 365 + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400)
  for (var m = 1; m < month; m++) {
    sum += getDayOfMonth(m, year)
  }

  return (sum + 1) % 7
}

function getDayOfMonth(m, y) {
  if (m == 2) {
    if (isLeapYear(y)) {
      return 29
    } else {
      return 28
    }
  } else {
    switch (m) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12: return 31
      default: return 30
    }
  }
}
```

#### 作用域

* 对于任何一个变量的访问，都从代码中书写该变量的位置开始查找，逐级往上层作用域查找。

```javascript
function foo() {
  var a = 8
  bar()
}

var a = 9

function bar() {
  console.log(a)
}

foo()
// 9 从bar定义的位置看
```

* ==var只有函数作用域== 单纯的{}括起来的不能算作用域  没有块级作用域
* let 声明的变量有块级作用域 es6

```javascript
声明提升 hoist
function f() {
  var x = 2
  var digit//提升到了这里
  var i    //提升了
  var x


  x = 2
  for(var i = 1;i < 10;i++) {
    var digit = 5
    // var定义的会提升 指定以一次 digit =5
  }
}


function f () {
  console.log(a)
  //undefined
  var a = 8
  console.log(a)
  //8
}


function f() {
  for (var i = 0; i < 4; i++) {
  }
  console.log(i)
}
f()
// 4

//let 声明的标量是块级作用域
var a = 8
if (true) {
  let a = 9
  a = 10
  console.log(a)
  //10
}
console.log(a)
//8

var a = 8
if (true) {
  a = 10
  console.log(a)
  //10
}
console.log(a)
//10



let a = 8
if (true) {
  var a = 9
  a = 10
  console.log(a)
}
console.log(a)
//会报错 let声明的变量不能再var


function f() {    //Temper Dead Zone  TDZ
  console.log(a)
  let a = 8
  console.log(a) 
}
//报错 不能在初始化变量前访问他


var a = 8
console.log(a * a)

var a = 8
console.log(a * a)

// 64 64 6

let a = 8
console.log(a * a)
let a = 8
console.log(a * a)
//报错 let变量不能重复定义
```

```javascript
a = function () {
  return 8
}
console.log(Math.max(a, 9))
// NaN a是函数不是返回值  函数可以作为值被传递

a = function () {
  return 8
}
console.log(Math.max(a(), 9))
//9
```



#### 函数声明

```javascript
var a = function(){
  //表达式 表达式的求值结果是函数
}

function a {
  //语句 没有求值结果
  // 定义变量a 变量a指向一个函数
  //这种方式定义的方法可以晚于调用 不在正常控制 流中
}

var a = function(){return 8}()
// a = 8 表达式后面() 调用这个函数


//函数声明不要写在if里 如果写 写成这种 不要写成直接声明的
if(true){
  a = function(){
    
  }
}
```

```javascript
var a = 8
function a(){
  return 0
}

//a ???

// var a  提升
// function a(){  提升
//   return 0
// }
// a = 8
// a为8
```

```javascript
var b = function c() {
  //c只能在这里使用 代表函数自己 递归
}

// 在这里只能使用 b
```



#### 调用栈

* 计算机存储上下文(执行环境的地方叫做调用栈)  函数执行完跳到那里去  2.函数间的关系

#### 可选参数值

* 传的参数多了，会被忽略，传的参数少了会被分配undefined

```javascript
function power(base, exponent) {
  if (exponent == undefined)
    exponent = 2;
  var result = 1;
  for (var count = 0; count < exponent; count++)
    result *= base;
  return result;
}
```

* ==所有参数被放在arguments 这个只能在函数内部访问的特殊变量中。arguments[0]表示第一个参数，arguements.length 表示实际传入的参数个数，它是一个类数组对象，array like object==

#### hamming距离

```java
var hammingDistance = function(x, y) {
    var z = x ^ y
    var count = 0
    while(z) {
       z &= z - 1
        //每次去掉最右面的一个1
        count++
      }
    return count
};
```

#### 判断4的幂

```javascript
// 数学方法 x=4的a次幂 a=log4X= 1/2log2X a是整数 所以log2X为偶数即可
var isPowerOfFour = function(num) {
    return  Math.log2(num)%2==0
};

//位运算法 先判断是否是2的幂  2的幂1在奇数位是4的幂 1在偶数位不是4的幂
//4的幂 & 10101010...10 为0
// var isPowerOfFour = function(num) {
//     return num > 0 && (num & (num-1)) == 0  && (num & 0xaaaaaaaa) == 0
// };
```

#### 颠倒给定的 32 位无符号整数的二进制位。

```javascript
var reverseBits = function(n) {
    var a = ((n & 0b10101010101010101010101010101010)>>>1)| ((n & 0b01010101010101010101010101010101)<<1)
    // n的偶数位右移  n的奇数位左移 相邻两位换
    var b =((a & 0b11001100110011001100110011001100)>>>2)|((a & 0b00110011001100110011001100110011)<<2)
    // 相邻4位换
    a =((b & 0b11110000111100001111000011110000)>>>4)|((b & 0b00001111000011110000111100001111)<<4)
    // 相邻8位换
    b =((a & 0b11111111000000001111111100000000)>>>8)|((a & 0b00000000111111110000000011111111)<<8)
    // 相邻16位换
    a =((b & 0b11111111111111110000000000000000)>>>16)|((b & 0b00000000000000001111111111111111)<<16)
    // 相邻32位换
  return a >>> 0
   //转换成无符号数   
};
```

#### Pow(x,n)

```javascript
// 使用递归
// function myPowCompute(x,n){
// if(n==0) return 1
// return n%2 == 0 ? myPowCompute(x,n/2) ** 2 : myPowCompute(x,n/2|0)** 2 * x
// }
// var myPow = function(x, n) {
//  return n<0? 1/myPowCompute(x,n):myPowCompute(x,n)
// };

// 不使用递归
// 用二进制表示n 拼出n
function myPowCompute(x,n){
    let ans = 1
    // 贡献初始值x
    let contribute = x
    while(n>0){
        if(n % 2==1){
            // 如果2进制末位为1，要记入贡献
            ans *= contribute
        }
        // 贡献不断平方
        contribute *=contribute
        // 去掉n二进制末位 每次判断最低位即可
        n = n/2|0
    }
    return ans
}

function myPow(x,n) {
    return n >= 0 ? myPowCompute(x, n) : 1.0 / myPowCompute(x, -n);
}

// var myPow = function(x, n, m = 0, h) {
//     return n === 0 ? 1 : n === 1 ? x : 
//     (n < 0 && (m = 1, n = -n), h = myPow(x, n >>> 1, 0), h *= h * (n & 1 ? x : 1), m ? 1 / h : h)
// };

// var myPow = function(x, n, sum = 1, m = 0) {
//     n < 0 && (n = -n, m = 1)
//     while (n) n & 1 && (sum *= x), x *= x, n >>>= 1
//     return m ? 1 / sum : sum
// }
```

