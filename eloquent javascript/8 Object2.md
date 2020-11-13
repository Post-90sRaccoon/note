## Polymorphim

```javascript
console.log(new String('woefj'))
//创建一个包装对象 [String: 'woefj']

String(2)
//转化成string

function concatenate(a, b) {
  return a.concat(b)
}
//可以拼接数组 或者 字符串
```
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
//   return Math.max(this.str.split('\n').map(it => it.length))
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
//f[i][j]f[i][j] 只与 f[i-1][..]f[i−1][..] 有关，而与 f[i-2][..]f[i−2][..] 及之前的状态无关，因此不必存储这些无关的状态。
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

