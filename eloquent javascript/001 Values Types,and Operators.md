

# Values,Types,AND Operators

### Numbers

* 用64位存储number类型
* console.log(1..toString(2))    转换为2进制

#### Special Number

* Infinity -Infinity

  * Infinity - 1 still Infinity

  * 1/0 Infinity  1/-0 -Infinity

       0 === -0 true

* NaN
  * 类型是number Not a Number 
  * 0/0    ==Infinity-Infinity==
  * NaN==NaN  false

### String

* 引号里面不能出现明文回车 shift+enter

* ==反引号==里面可以出现明文回车==``==

* \n 换行

  \\"   "

  \t  tab

  \\\   \

*  字符串可以用 + 拼接

### Unary operator

* typeof

###Boolean value

* true and false

  ![image-20200107213723110](001%20Values%20Types,and%20Operators.assets/image-20200107213723110.png)
  
  ![image-20200108080957494](001%20Values%20Types,and%20Operators.assets/image-20200108080957494.png)
  
  ![image-20200108081057905](001%20Values%20Types,and%20Operators.assets/image-20200108081057905.png)
  
  ![image-20200108081625935](001%20Values%20Types,and%20Operators.assets/image-20200108081625935.png)
  
  ![image-20200108081127189](001%20Values%20Types,and%20Operators.assets/image-20200108081127189.png) 

> 不同类型用 == 比
>
> 数字和字符串   字符串转换成数
>
> 布尔值和任何类型比较 布尔值都变成数字
>
> 对象和 字符串或数比   对象valueOf 或者 toString

#### Comparisons

*  'five' >4 false      'five' 转变成了NaN

* 字符字符串按ascii码比较大小    str.charCodeAt()   String.fromCharCode(num)

* console.log(NaN == NaN)   false

#### logical operator

* && 与

  || 或

  ！ 非

* ||优先级最低 小于 &&

* ternary 三元运算符 条件运算符  true?1:2

#### Undefined Values

* null   类型object
*  undefined  类型undefined
* undefined == null    true
* 自身也相等

### Automatic Type Conversion

==5 * nul==l               0

5* undefined    NaN

'5'+1 ="51"

'5'-1=4

“five”*2                NaN

#### Short-Circuiting of Logical Operators

* a||b    左面可以转换为true 返回左面的表达式  左边false 返回右面
* a&&b   左面可转换为false 返回左面的表达式   左边true  返回右面
* A||B||C||D 返回左面第一个为true的 
* A&&B&&C&&D 返回左面第一个为false的
* ==字符串转换为数 空0 非空NaN 转换为布尔 空0 非空1==

```javascript
console.log(2 && 3 && 4 && 5)
//5  没有false 返回最后一个
console.log(2 || 3 || 4 || 5)
//2
// 只在必要的时候计算 否则右面的表达式不会运行 条件运算符也是这样
```



* 支持自动/隐式类型转化的语言 弱类型语言  js c

  不支持的 强类型语言 python