## Polymorphim

```javascript
console.log(new String('woefj'))
//创建一个包装对象 [String: 'woefj']

String(2)
//转化成string 这样直接调用toString方法

function concatenate(a, b) {
  return a.concat(b)
}
//可以拼接数组 或者 字符串
```
* 多态可以和不同形态的值共同工作 只要他们支持多态代码所需要的接口

```javascript
console.log("abc\ndef\nghi".split("\n"))
//[ 'abc', 'def', 'ghi' ]
```
```javascript
//rows是一个二维数组 内部数组代表一行
var data = [
  ["foobar", "bar\nbarz", 'bazzzz\n1\n22222']
  ["foobar", "bar\nbarz", 'bazzzz\n1\n22222']
  ["foobar", "bar\nbarz", 'bazzzz\n1\n22222']
  ["foobar", "bar\nbarz", 'bazzzz\n1\n22222']
]

function Cell(str) {
  this.str = str
}

Cell.prototype.minWidth = function () {
  return this.str.split('\n').map(it => it.length).reduce((a, b) => Math.max(a, b))
  //reduce传多个参数 只要两个
}
// Cell.prototype.minWidth = function () {
//   return Math.max(...this.str.split('\n').map(it => it.length))
// }
Cell.prototype.minHeight = function () {
  return this.str.split('\n').length
}

// Cell.prototype.draw = function (width, height) {
//   var result = []
//   var lines = this.str.split('\n')
//   for (var i = 0; i < lines.length; i++) {
//     var line = lines[i]
//     while (line.length < width) {
//       line += ' '
//     }
//     result.push(result)
//   }
// }
Cell.prototype.draw = function (width, height) {
  if (width < this.minWidth() || height < this.minHeight) {
    throw new Error('Size not enough!!!')
  }
  var result = []
  var lines = this.str.split('\n')
  for (var i = 0; i < height; i++) {
    var line = lines[i] || ''
    result.push(line.padEnd(width, ' '))
  }
  return result
}


rows = data.map(rowStrs => {
  return rowStrs.map(str => new Cell(str))
})

function rowHeights(rows) {
  return rows.map(function (row) {
    return row.reduce(function (max, cell) {
      return Math.max(max, cell.minHeight)
    }, 0)
  })
}
function colWidths(rows) {
  return row[0].map(function (_, i) {//取列标
    return rows.reduce(function (max, row) {
      return Math.max(max, row[i].minWidth())
    }, 0)
  })
}

function drawTable(rows) {
  let heights = rowHeights(rows)
  let widths = colWidths(rows)

  function drawLine(blocks, lineNo) {
    return blocks.map(function (block) {
      return block[lineNo]
    }).join(" ")
  }
  function drwaRow(row, rowNum) {
    let blocks = row.map(function (cell, colNum) {
      return cell.draw(widths[colNum], heights[rowNum])
    })
    return blocks[0].map(function (_, lineNo) {
      return drawLine(blocks, lineNo)
    }).join('\n')
  }
  return rows.map(drwaRow).join('\n')
}
```

### 递归

> 一个函数用自己来定义时就是递归

#### 三角形的最小路径和

> ```javascript
> [
>      [2],
>     [3,4],
>    [6,5,7],
>   [4,1,8,3]
> ]
> 2 + 3 + 5 + 1 = 11
> F(n)为三角形以n为起点的最小路径和 F(2)=2+Math.min(F(3),F(4))
> ```

```javascript
//递归 上到下
var minimumTotal = function (triangle) {
  let map = {}
  function compute(x, y) {
    let key = x + "," + y
    if(key in map){
      return map[key]
    }
    if (x == triangle.length - 1) {
      return triangle[x][y]
    }else{
      map[key] = triangle[x][y] + Math.min(compute(x + 1, y), compute(x + 1, y + 1))
      return key[map]
    }
  }
  return compute(0, 0)
};

//线性规划
// 从下向上 f[i][j]表示从三角形顶部走到位置(i,j) 的最小路径和
// 状态转移方程 f[i][j]=min(f[i−1][j−1],f[i−1][j])+c[i][j]
// j=0 时，f[i-1][j-1] 没有意义 因此状态转移方程为: f[i][0]=f[i−1][0]+c[i][0]
// j=i 时，f[i - 1][j] 没有意义，因此状态转移方程为：f[i][i] = f[i - 1][i - 1] + c[i][i]
// 最左和最右侧只能走一条线路
// 边界条件 去除了没有意义的状态 边界条件可以定为 f[0][0] = c[0][0]
// 顶部最小路径和等于对应位置的元素值

var minimumTotal = function (triangle) {
  let n = triangle.length
  let f = new Array(n)
  for (let i = 0; i < n; i++) {
    f[i] = new Array(n)
  }

  f[0][0] = triangle[0][0]

  for (let i = 1; i < n; ++i) {
    f[i][0] = f[i - 1][0] + triangle[i][0]
    for (let j = 1; j < i; ++j) {
      f[i][j] = Math.min(f[i - 1][j - 1], f[i - 1][j]) + triangle[i][j]
    }
    f[i][i] = f[i - 1][i - 1] + triangle[i][i]
  }

  let minTotal = f[n - 1][0]
  for (let i = 1; i < n; ++i) {
    minTotal = Math.min(minTotal, f[n - 1][i])
  }
  return minTotal
};

//空间优化
//f[i][j] 只与 f[i-1][..] 有关，而与 f[i-2][..] 及之前的状态无关，因此不必存储这些无关的状态。
//使用两个长度为n的一维数组进行转移，将i根据奇偶性映射到其中一个一维数组，那么i−1就映射到了另一个一维数组。
var minimumTotal = function (triangle) {
  let n = triangle.length
  let f = new Array(2)
  for (let i = 0; i < 2; i++) {
    f[i] = new Array(n)
  }

  f[0][0] = triangle[0][0]

  for (let i = 1; i < n; ++i) {
    let curr = i % 2
    let prev = 1 - curr
    // curr为1时 prev 0 prev0时 curr为1 curr i  prev i- 1
    f[curr][0] = f[prev][0] + triangle[i][0]
    for (let j = 1; j < i; ++j) {
      f[curr][j] = Math.min(f[prev][j - 1], f[prev][j]) + triangle[i][j]
    }
    f[curr][i] = f[prev][i - 1] + triangle[i][i]
  }

  let minTotal = f[(n - 1) % 2][0]
  for (let i = 1; i < n; ++i) {
    minTotal = Math.min(minTotal, f[(n - 1) % 2][i])
  }
  return minTotal
};


//从i到0递减地枚举j，这样只需要一个长度为n的一维数组f，就可以完成状态转移。
var minimumTotal = function (triangle) {
  let n = triangle.length
  let f = new Array(n)

  f[0] = triangle[0][0]

  for (let i = 1; i < n; ++i) {
    f[i] = f[i - 1] + triangle[i][i]
    for (let j = i - 1; j > 0; --j) {
      f[j] = Math.min(f[j - 1], f[j]) + triangle[i][j]
    }
    f[0] += triangle[i][0]
  }

  let minTotal = f[0]
  for (let i = 1; i < n; ++i) {
    minTotal = Math.min(minTotal, f[i])
  }
  return minTotal
};

//自底向上
var minimumTotal = function (triangle) {
  let n = triangle.length
  let arr = new Array(n+1).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      arr[j] = triangle[i][j] + Math.min(arr[j], arr[j + 1])
    }
  }
  return arr[0]
};
```

####  最大子序和

> ```
> [-2,1,-3,4,-1,2,1,-5,4]
> ```

```javascript
//动态规划 nums 长度为n 下标从0到n-1
// f(i) 表示第i个数结尾的 连续最大子数和 f(i) = max{f(i-1)+ai,ai}
// f(i) 只和f(i-1)相关 可以用一个变量pre 维护当前f(i-1)的值

var maxSubArray = function (nums) {
  let pre = 0
  let maxAns = nums[0]
  for (let i = 0; i < nums.length; i++) {
    pre = Math.max(pre + nums[i], nums[i])
    maxAns = Math.max(maxAns, pre)
  }
  return maxAns
}

// 分治
// 定义一个操作 get(nums,l,r) 表示查询nums序列[l,r]区间内最大子段和
// 对于[l,r] 取m= (l+r) >> 1 对区间[l,m] 和[m+1,r]  分治求解
// 递归逐层深入直到区间长度缩小为 1 的时候，递归「开始回升」
// lSum 表示以l为左端点的最大子段和
// rSum 表示以r为右端点的最大子段和
// mSum 表示[l,r]内最大子段和
// iSum 表示[l,r]的区间和
// [l,m]左子区间 [m+1,r]右子区间

// isum 等于左子区间iSum 加上右子区间iSum
// lsum 等于左子区间lsum与（左子区间iSum加上右子区间的rSum）的最大值
// rsum 等于右子区间iSum与（左子区间rSum加上右子区间的iSum）的最大值
// mSum 是否跨越m [l,r]的mSum可能是左子间的mSum和右子区间的mSum 或左子区间的rSum和右子区间lSum求和 三者取大

function Status(l, r, m, i) {
  this.lSum = l
  this.rSum = r
  this.mSum = m
  this.iSum = i
}

function pushUp(l, r) {
  const iSum = l.iSum + r.iSum
  const lSum = Math.max(l.lSum, l.iSum + r.lSum);
  const rSum = Math.max(r.rSum, r.iSum + l.rSum);
  const mSum = Math.max(Math.max(l.mSum, r.mSum), l.rSum + r.lSum);
  return new Status(lSum, rSum, mSum, iSum)
}

function getInfo(a, l, r) {
  if (l === r) {
    return new Status(a[l], a[l], a[l], a[l]);
  }
  const m = (l + r) >> 1;
  const lSub = getInfo(a, l, m);
  const rSub = getInfo(a, m + 1, r);
  return pushUp(lSub, rSub);
}

var maxSubArray = function (nums) {
  return getInfo(nums, 0, nums.length - 1).mSum
}

//简写
var maxSubArray = function (nums) {
  var s = (iSum, lSum, rSum, mSum) => ({ iSum, lSum, rSum, mSum }),
    q = (l, r) => s(l.iSum + r.iSum, Math.max(l.lSum, l.iSum + r.lSum), Math.max(r.rSum, r.iSum + l.rSum), Math.max(l.mSum, r.mSum, r.lSum + l.rSum)),
    f = (i, j, m, l, r) => i === j ? s(nums[i], nums[i], nums[i], nums[i]) : (m = (i + j) >> 1, l = f(i, m), r = f(m + 1, j), q(l, r))
  return f(0, nums.length - 1).mSum
};
```

#### 搜索插入位置

> 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
>
> 你可以假设数组中无重复元素。

```javascript
var searchInsert = function(nums, target) {
    let left = 0
    let right = nums.length-1
    while(left<=right){
        let mid = (right + left)>>1
        if(nums[mid] == target){
            return mid
        }else if(nums[mid]>target){
            right = mid - 1
        }else if(nums[mid]<target){
            left = mid + 1
        }
    }
    return left
};

var searchInsert = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] == target) {
      return i
    } else if (nums[i] > target) {
      return i
    }
  }
  return nums.length
};
```

#### 搜索旋转排序数组

> 数组本为升序排列，但在某个点进行了旋转 [0,1,2,4,5,6,7]=>[4,5,6,7,0,1,2]  数组中搜索target 返回索引 否则返回-1

```javascript
var search = function(nums, target) {
  let left = 0
  let right = nums.length - 1
  while(left <= right){
    let mid = (right + left) >> 1
    //(right - left ) >> 1+ left 
    if(nums[mid] == target){
        return mid
    }
    if(nums[left] <= nums [mid]){
    //[left,mid]是有序数组
      if(nums[left]<=target && target < nums[mid]){
          right = mid - 1
      }else{
          left = mid + 1
      }
    }else{
    //[mid+1,right]是有序数组
    if(nums[mid]<target && target<=nums[right]){
        left = mid +1
    }else{
        right = mid - 1
    }
    }
  }
  return -1
};


var search = function (nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    let mid = (left + right) >> 1;
    if ((nums[0] > target) ^ (nums[0] > nums[mid]) ^ (target > nums[mid]))
    // 不可能三项为真 两项为真结果为假 一项为真 结果为真
      left = mid + 1;
    else
      right = mid;
  }
  return left == right && nums[left] == target ? left : -1;
}
```

#### 升序二维数组找数

```javascript
var searchMatrix = function (matrix, target) {
  if (matrix.length == 0) return false
  let m = matrix.length
  let n = matrix[0].length
  let left = 0
  let right = m * n - 1
  while (left <= right) {
    let mid = (left + right) >> 1
    let row = mid / n | 0
    let col = mid - (row * n)
    if (matrix[row][col] == target) {
      return true
    } else if (matrix[row][col] > target) {
      right = mid - 1
    } else if (matrix[row][col] < target)
      left = mid + 1
  }
  return false
};
```

> [
>   [1,   4,  7, 11, 15],
>   [2,   5,  8, 12, 19],
>   [3,   6,  9, 16, 22],
>   [10, 13, 14, 17, 24],
>   [18, 21, 23, 26, 30]
> ]

```javascript
//迭代对角线 分别对行或者列进行二分查找
function binarySearch(matrix, target, start, vertical) {
  let low = start
  let high = vertical ? matrix.length - 1 : matrix[0].length - 1
  while (high >= low) {
    let mid = (high + low) / 2 | 0
    if (vertical) { // searching a column
      if (matrix[mid][start] < target) {
        low = mid + 1;
      } else if (matrix[mid][start] > target) {
        high = mid - 1;
      } else {
        return true;
      }
    } else { // searching a row
      if (matrix[start][mid] < target) {
        low = mid + 1;
      } else if (matrix[start][mid] > target) {
        high = mid - 1;
      } else {
        return true;
      }
    }
  }
  return false
}

function searchMatrix(matrix, target) {
  if (matrix == null || matrix.length == 0) {
    return false;
  }

  // iterate over matrix diagonals
  let shorterDim = Math.min(matrix.length, matrix[0].length);
  for (let i = 0; i < shorterDim; i++) {
    verticalFound = binarySearch(matrix, target, i, true);
    horizontalFound = binarySearch(matrix, target, i, false);
    if (verticalFound || horizontalFound) {
      return true;
    }
  }
  return false;
}


//从左下角向上 右遍历 
var searchMatrix = function(matrix, target) {
    if(matrix === null || matrix.length === 0 || matrix[0].length === 0) return false;
    let col = 0;
    let row = matrix[0].length - 1;
    while(col < matrix.length && row >=0) {
        if(matrix[col][row] > target) {
            row--;
        }  else if(matrix[col][row] < target) {
            col++
        } else {
            return true;
        }
    }
    return false;
}

// 搜索空间缩减 划分四个子矩阵 两个可能包含目标 两个不包含
// 两种方法可以确定一个任意元素目标是否可以用常数时间判断。第一，如果数组的区域为零，则它不包含元素，因此不能包含目标。其次，如果目标小于数组的最小值或大于数组的最大值，那么矩阵肯定不包含目标值
function searchRec(matrix, target, left, right, up, down) {
  //子矩阵没有高度 或者宽度
  if (left > right || up > down) {
    return false
  }
  //如果target大于子矩阵最大值或者小于子矩阵最小值
  else if (target < matrix[up][left] || target > matrix[down][right]) {
    return false
  }

  let mid = (left + right) / 2 | 0
  //定位row 使matrix[row-1][mid] < target < matrix[row][mid]
  let row = up
  while (row <= down && matrix[row][mid] <= target) {
    if (matrix[row][mid] == target) {
      return true
    }
    row++
  }
  return searchRec(matrix, target, left, mid - 1, row, down) || searchRec(matrix, target, mid + 1, right, up, row - 1)
  //如果row>down 左面false 右面扫描martix[row-1][mid]右面所有的
  //如果matrix[row][mid] > target  左面向左扫描  右面向前一行右面扫描
}

var searchMatrix = function (matrix, target) {
  if (matrix == null || matrix.length == 0) {
    return false
  }

  return searchRec(matrix, target, 0, matrix[0].length - 1, 0, matrix.length - 1)
}
```

#### 搜索旋转排序二叉树

> 有重复数字时

```javascript
// 11101
// left 1 right 1 mid 1 无法判断前面有序还是后面有序 left++
var search = function (nums, target) {
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    let mid = (left + right) >> 1
    if (nums[mid] == target) {
      return true
    } else if (nums[left] == nums[mid] && nums[right] == nums[mid]) {
      left++
      continue
    } else if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1
      } else {
        left = mid + 1
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
  }
  return false
};
```

#### 旋转数组

> ```
> 输入: [1,2,3,4,5,6,7] 和 k = 3
> 输出: [5,6,7,1,2,3,4]
> ```

```javascript
//使用额外数组 i放到新数组（i+k）%nums.length

//环状替代
// 把每一个数字放到它应该到的位置 被替换元素保存 被替换元素放到正确位置。
// 如果 n%k==0 其中 k=k%n (k大于n，移动k 相当于移动 k\%n 次) 没遍历所有数字就会会到出发数字
var rotate = function (nums, k) {
  let n = nums.length
  k = k % n
  let count = 0
  for (let start = 0; count < n; start++) {
    let currentIdx = start
    let currentValue = nums[start]
    do {
      let nextIdx = (currentIdx + k) % n
      let nextValue = nums[nextIdx]
      nums[nextIdx] = currentValue
      currentIdx = nextIdx
      currentValue = nextValue
      count++
    } while (currentIdx != start)
  }
};
  
// 反转法
var rotate = function (nums, k) {
  let n = nums.length
  k = k % n
  reverse(nums,0,n-1)
  reverse(nums,0,k-1)
  reverse(nums,k,n-1)
}
function reverse(nums, start, end) {
  while (start < end) {
    let temp = nums[start]
    nums[start] = nums[end]
    nums[end] = temp
    start++
    end--
  }
}
```

### 链表

```javascript
let list = {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: null
    }
  }
}
```

#### 数组转链表

```javascript
function arrayToList(ary) {
  if (ary.length == 0) {
    return null
  }

  let dummy = {}
  // 头结点
  let prev = dummy

  for (let i = 0; i < ary.length; i++) {
    let node = {
      val: ary[i],
      next: null,
    }
    prev.next = node
    prev = node
  }

  return dummy.next
}

function arrayToList3(ary) {
  if (ary.length == 0) {
    return null
  }
  let head = {
    value: ary[0],
    next: arrayToList3(ary.slice(1))
  }
  return head
}


// 将ary数组从start开始到结束的元素们转换链表
// 并返回转换好以后的头结点
function arrayToList4(ary, start = 0) {
  if (start == ary.length) {
    return null
  }

  let head = {
    value: ary[start],
    next: arrayToList4(ary, start + 1)
  }
  return head
}
```

#### 链表转换成数组

```javascript
function listToArray(head) {
  let ary = []
  if (head == null) {
    return ary
  }
  while (head) {
    ary.push(head.val)
    head = head.next
  }
  return ary
}

function listToArray2(head) {
  if (head == null) {
    return []
  }
  return [head.val].concat(listToArray2(head.next))
}
```

#### 链表头部/尾部/任意位置添加元素

```javascript
function prepend(val,head){
  let node ={
    val:val,
    next:head
  }
  return node
}

function append(val, head) {
  if (head == null) {
    return {
      val: val,
      next: null
    }
  }
  let p = head
  while (p.next) {
    p = p.next
  }
  p.next = {
    val: val,
    next: null,
  }
  return head
}

function append2(val, head) {
  if (head == null) {
    return {
      val: val,
      next: null
    }
  }
  head.next = append2(val, head.next)
  return head
}
```

#### 查询链表

```javascript
function nth(head, idx) {
  if (head == null || idx < 0) {
    return undefined
  }

  let i = 0
  let p = head

  while (p.next && i < idx) {
    p = p.next
    i++
  }

  if (i == idx) {
    return p.val
  } else {
    return undefined
  }
}

function nth2(head, idx) {
  if (head == null || idx < 0) {
    return undefined
  }
  if (idx == 0) {
    return head.val
  }
  return nth2(head.next, idx - 1)
}
```

#### 反转链表

```javascript
var reverseList = function(head) {
    let p = new ListNode()
    while(head){
        let q = head.next
        head.next = p.next
        p.next = head
        head = q
    }
    return p.next 
};

function reverseList(head) {
  if (head == null || head.next == null) {
    return head;
  }
  p = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return p;
}
```

#### 删除节点

```javascript
var deleteNode = function(node) {
  node.val = node.next.val
  node.next = node.next.next
};
```

#### 合并两个有序列表

```javascript
var mergeTwoLists = function (l1, l2) {
  if (!l1 && !l2) {
    return null
  }
  let head = new ListNode()
  let p = head
  let p1 = l1
  let p2 = l2
  while (p1 && p2) {
    if (p1.val <= p2.val) {
      p.next = new ListNode(p1.val)
      p = p.next
      p1 = p1.next
    }
    else {
      p.next = new ListNode(p2.val)
      p = p.next
      p2 = p2.next
    }
  }
  while (p1) {
    p.next = new ListNode(p1.val)
    p = p.next
    p1 = p1.next
  }
  while (p2) {
    p.next = new ListNode(p2.val)
    p = p.next
    p2 = p2.next
  }
  return head.next
};


//递归方法
var mergeTwoLists = function (l1, l2) {
  if (l1 === null) return l2;
  if (l2 === null) return l1;
  if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
}

//复用结点
var mergeTwoLists = function (l1, l2) {
  let preHead = new ListNode();
  let pre = preHead;
  while (l1 && l2) {
    if (l1.val < l2.val) {
      pre.next = l1;
      l1 = l1.next;
    } else {
      pre.next = l2;
      l2 = l2.next;
    }
    pre = pre.next;
  }
  pre.next = l1 ? l1 : l2;
  return preHead.next;
}
```

