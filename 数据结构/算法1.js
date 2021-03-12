//最大公约数
function largestCommonFactor(m, n) {
  let t = 1;
  while (t != 0) {
    t = m % n
    m = n
    n = t
  }
  return m
}

//斐波那契数列
function fibb(n, a = 0, b = 1) {
  if (n == 0) {
    return a
  } else {
    return fibb(n - 1, b, a + b)
  }
}
var fib = function (N) {
  var a = 0
  var b = 1

  while (N--) {
    b = b + a
    a = b - a
  }

  return a
}

//判断是否为2的幂
var isPowerOfTwo = function (n) {
  if (n <= 0) {
    return false
  }
  return (n & (n - 1)) == 0
};
//考虑2进制

//判断是否为3的幂
1162261467 % n == 0
// 3的19次方 整形能表示的最大的3的幂 只能模3为0

//判断完全平方数
var isPerfectSquare = function (num) {
  if (num == 1) return num
  let low = 1
  let high = num
  let middle
  while (high - low > 1) {
    middle = (high + low) / 2 | 0
    if (middle * middle == num) {
      return true
    }
    else {
      (middle * middle > num) ? high = middle : low = middle
    }
  }
  return false
};

//hamming distance
var hammingDistance = function (x, y) {
  var z = x ^ y
  var count = 0
  while (z) {
    z &= z - 1
    //每次去掉最右面的一个1
    count++
  }
  return count
};

//只出现一次的数字
//给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素
var singleNumber = function (nums) {
  var sum = 0
  for (var i = 0; i < nums.length; i++) {
    sum ^= nums[i]
  }
  return sum
};

//比特位计数
//给定一个非负整数 num。对于 0 ≤ i ≤ num 范围中的每个数字 i ，计算其二进制数中的 1 的数目并将它们作为数组返回。
var countBits = function (num) {
  var result = [0]

  if (num == 0) {
    return result
  }

  //去掉最后一个1 [i&(i-1) 永远比 i小1 以小推大]  求i时 比i小的所有值都全部知道 i&(i-1)去掉最后一个1
  for (var i = 1; i <= num; i++) {
    result[i] = 1 + result[i & (i - 1)]
  }

  return result
};

//去重数组
var removeDuplicates = function (nums) {
  let i = 0
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] != nums[i]) {
      nums[++i] = nums[j]
    }
  }
  nums.length = i + 1
  return i + 1
};

//数组乱序去重
//1 排序后去重
//2 Set return [...new Set(arr)] return Array.from(new Set(arr))


//棋盘
//6 *3 棋盘 从 （0,0）到（6,3）
function find(x, y, howDidGetHere) {
  if (x == 6 && y == 3) {
    console.log(howDidGetHere)
  }
  if (x > 6 || y > 3) {
    return
  } else {
    find(x + 1, y, howDidGetHere + '>')
    find(x, y + 1, howDidGetHere + 'v')
  }
}
find(0, 0, '')

//合并两个有序数组
//给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中 *，* 使 nums1 成为一个有序数组。
//从尾部插入最大的
var merge = function (nums1, m, nums2, n) {
  let p1 = m - 1
  let p2 = n - 1
  let p = m + n - 1
  while (p1 >= 0 && p2 >= 0) {
    nums1[p--] = nums2[p2] >= nums1[p1] ? nums2[p2--] : nums1[p1--]
  }
  while (p2 >= 0) {
    nums1[p--] = nums2[p2--]
  }
};

//最小移动次数使数组元素相等
//给定一个长度为 n 的非空整数数组，找到让数组所有元素相等的最小移动次数。每次移动将会使 n - 1 个元素增加 1。
//数学法 关心的其实只是相对大下 一次move操作将最大值外所有数加1，相当于最大值-1，所以只要计算多少次move能把所有数都减成最小值即可
var minMoves = function (nums) {
  let min = nums[0]
  let sum = nums[0]
  for (let i = 1; i < nums.length; ++i) {
    sum += nums[i]
    if (nums[i] < min) {
      min = nums[i]
    }
  }
  return sum - min * nums.length
}

