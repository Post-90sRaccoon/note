

# Values,Types,AND Operators

### Numbers

* 用64位存储number类型
* Number.toString(2)   转换为2进制

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

### Unary operator

* typeof

### Boolean value

![image-20200107213723110](001%20Values%20Types,and%20Operators.assets/image-20200107213723110.png)

![image-20200108080957494](001%20Values%20Types,and%20Operators.assets/image-20200108080957494.png)

![image-20200108081057905](001%20Values%20Types,and%20Operators.assets/image-20200108081057905.png)

![image-20200108081625935](001%20Values%20Types,and%20Operators.assets/image-20200108081625935.png)

![image-20200108081127189](001%20Values%20Types,and%20Operators.assets/image-20200108081127189.png) 



#### Comparisons

*  'five' >4 false      'five' 转变成了NaN

* 字符字符串按ascii码比较大小    str.charCodeAt()   String.fromCharCode(num)

* NaN == NaN   false

#### logical operator

* && 与

  || 或

  ！ 非

* ||优先级最低 小于 &&

#### Undefined Values

* null   类型object
* undefined  类型undefined
* null ==  ‘’   //false

### Automatic Type Conversion

==5 * null==              0

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
2 && 3 && 4 && 5
//5  没有false 返回最后一个
2 || 3 || 4 || 5

//2
// 只在必要的时候计算 否则右面的表达式不会运行 条件运算符也是这样
```



* 支持自动/隐式类型转化的语言 弱类型语言  js c

  不支持的 强类型语言 python

```javascript
[right, p, short] = cut(p, cutLength);
[mergePoint.next, mergePoint] = mergeList(left, right, cutLength, cutLength - short)
```

* ==大坑点：这里必须加分号 不然和后面连在一起了 引起错误==

#### js传递复杂类型参数

> **将参数的地址复制一份，按值传递地址，即引用复制（reference-copy）传递**
>
> **特征：对于变量的成员进行修改时，会直接影响原变量；而如果对传递过来的变量进行重新赋值，则不会影响原变量，并且此后再修改变量的成员，也不会影响原变量。**
>
> 复杂类型会在内存中占据一定的空间，而变量的值实际上是该空间的内存地址；在进行参数传递的时候，是将 dict1 的地址值复制了一份传给 dict。这样在修改该复杂对象（这里是一个字典）的成员的时候，因为 dict 和 dict1 指向内存的同一个空间，因此对于dict的成员的修改是直接作用在这个内存空间上，dict1的成员值自然也就随之变化了。但如果对 dict 重新赋一个字典变量，会在内存里开一个新的空间用于存储新的字典，同时将该空间的地址赋给 dict，但 dict1 的地址值不变，还是指向旧的字典，两个变量之间的联系就被切断了。

#### 调试技巧

![image-20201120210902347](001%20Values%20Types,and%20Operators.assets/image-20201120210902347.png)

#### 归并排序

> 数组一分为二，分别排序
>
> 将两个有序的数组组合合并回去

```javascript
function mergeSort(ary) {
  if (ary.length == 0 || ary.length == 1) {
    return ary
  }

  let mid = ary.length >> 1
  let left = ary.slice(0, mid)
  let right = ary.slice(mid)

  left = mergeSort(left)
  right = mergeSort(right)

  let i = 0
  let j = 0
  let k = 0
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      ary[k++] = left[i++]
    } else {
      ary[k++] = right[j++]
    }
  }
  while (i < left.length) {
    ary[k++] = left[i++]
  }
  while (j < right.length) {
    ary[k++] = right[j++]
  }
  return ary
}
```

#### 链表排序

```javascript
// 归并递归
// 分隔环节 从链表中点将链表断开 找中点 快慢双指针法
// 合并 建立辅助结点h作为头部 left right 指向两链表头部 合并 返回h.next
var sortList = function (head) {
  if (head == null || head.next == null) {
    return head
  }

  let middle = findListMiddle(head)
  let temp = middle.next
  middle.next = null

  let left = sortList(head)
  let right = sortList(temp)

  return mergeList(left, right)
};


function findListMiddle(head) {
  let low = head
  let fast = head.next
  while (fast && fast.next) {
    low = low.next
    fast = fast.next.next
  }
  return low
}

function mergeList(l1, l2) {
  let dummy = new ListNode(0)
  let p = dummy
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      p.next = l1
      l1 = l1.next
    } else {
      p.next = l2
      l2 = l2.next
    }
    p = p.next
  }
  p.next = l1 || l2
  return dummy.next
}





// 归并排序（从底至顶直接排序）
// dummy 空头结点
// i     每次切的大小 1 2 4 8 ...
// mergepoint 1(left) mp 1(right) mp 1(left) mp 1(right)
// mp 2(left) mp 2(right)

let sortList = function (head) {
  let dummy = new ListNode()
  dummy.next = head

  let length = listLength(head)
  for (let i = 1; i < length; i <<= 1) {
    let mergePoint = dummy
    let cut = dummy.next
    while (cut) {
      let left = cut
      let right = split(left, i)
      cut = split(right, i)
      mergePoint = mergeList(mergePoint, left, right)
    }
  }
  return dummy.next
}

// 连接链表并且返回下一个连接点
// pre.next = xx影响外面 pre=pre.next 不改变外面
function mergeList(pre, l1, l2) {
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      pre.next = l1
      l1 = l1.next
    } else {
      pre.next = l2
      l2 = l2.next
    }
    pre = pre.next
  }
  pre.next = l1 || l2
  while (pre.next) pre = pre.next
  return pre
}

// node 从哪里开始切 length 切多长
// 切开链表 rest切开位置的下一个位置 用于标记下一次切的位置
function split(node, length) {
  while (length != 1 && node) {
    node = node.next
    length--
  }
  let rest = node ? node.next : null
  if (node) node.next = null
  return rest
}

// 计算链表长度
function listLength(head) {
  let length = 0
  while (head) {
    head = head.next
    length++
  }
  return length
}
```

#### 快速排序

```javascript
// 快速排序
function quickSort(ary) {
  if (ary.length == 0 || ary.length == 1) {
    return ary.slice()
    // 返回新数组
  }
  let randIdx = Math.random() * ary.length | 0

  let left = []
  let middle = []
  let right = []

  for (let i = 0; i < ary.length; i++) {
    if (ary[i] < ary[randIdx]) {
      left.push(ary[i])
    } else if (ary[i] > ary[randIdx]) {
      right.push(ary[i])
    } else {
      middle.push(ary[i])
    }
  }

  left = quickSort(left)
  right = quickSort(right)

  return left.concat(middle, right)
  // 返回新数组
}

// 哨兵元素放到末尾 i = -1 j从0到倒数第二遍历数组
// ary[j] < 哨兵元素 i++ i与j指向元素交换位置
// start 和 end 都包含
function quickSort(ary, start = 0, end = ary.length - 1) {
  if (end - start < 1) {
    return ary
  }
  let pivotIdx = Math.random() * (end - start + 1) + start | 0
  let pivot = ary[pivotIdx]

  swap(ary, pivotIdx, end)

  let i = start
  for (let j = start; j < end; j++) {
    if (ary[j] < pivot) {
      swap(ary, i++, j)
    }
  }
  swap(ary, i, end)

  quickSort(ary, start, i - 1)
  quickSort(ary, i + 1, end)

  return ary
}

function swap(ary, i, j) {
  let t = ary[i]
  ary[i] = ary[j]
  ary[j] = t
}
```

* 快速排序应用  找第k大数  中位数