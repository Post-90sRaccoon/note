//转置矩阵
var transpose = function (A) {
  let B = []
  for (let i in A) {
    for (let j in A[i]) {
      if (!B[j]) {
        B[j] = []
      }
      B[j][i] = A[i][j]
    }
  }
  return B;
};

//字符串中的第一个唯一字符
//给定一个字符串，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回 - 1
var firstUniqChar = function (s) {
  let record = Array(26)
  record.fill(0)
  for (var i = 0; i < s.length; ++i) {
    record[s.charCodeAt(i) - 97]++
  }

  for (var j = 0; j < s.length; ++j) {
    if (record[s.charCodeAt(j) - 97] == 1) {
      return j
    }
  }

  return -1
};

//同构字符串
//输入: s = "egg", t = "add"
//输出: true
//根据每一个字母第一次出现位置 标号
//遍历两个字符串 一次对照每个字母的编号
var isIsomorphic = function (s, t) {
  if (s.length != t.length) return false
  if (s == t) return true
  let map1 = {}
  let map2 = {}
  for (let i = 0; i < s.length; ++i) {
    if (!(s[i] in map1)) {
      map1[s[i]] = i
    }
    console.log(map1)
  }
  for (let i = 0; i < t.length; ++i) {
    if (!(t[i] in map2)) {
      map2[t[i]] = i
    }
  }
  console.log(map2)
  for (let i = 0; i < s.length; i++) {
    if (map1[s[i]] != map2[t[i]]) {
      return false
    }
  }
  return true
};
//分糖果
//给定一个偶数长度的数组，其中不同的数字代表着不同种类的糖果，每一个数字代表一个糖果。你需要把这些糖果平均分给一个弟弟和一个妹妹。返回妹妹可以获得的最大糖果的种类数。
var distributeCandies = function (candies) {
  let map = {}
  let count = 0
  for (let i = 0; i < candies.length; i++) {
    if (candies[i] in map) {
      map[candies[i]]++
    } else {
      map[candies[i]] = 1
      count++
    }
  }
  return candies.length / 2 > count ? count : candies.length / 2
};

//无重复字符的最长字串
// 思路：滑动窗口 abcabcbb 为例
// 找出 从每一个字符开始的，不包含重复字符的最长子串，那么其中最长的那个字符串即为答案。
// 两个指针表示字符串中的某个子串（的左右边界），不断地向右移动右指针，但需要保证这两个指针对应的子串中没有重复的字符
// 移动结束后，这个子串就对应着 以左指针开始的，不包含重复字符的最长子串。我们记录下这个子串的长度。
// 在枚举结束后，我们找到的最长的子串的长度即为答案。
// 判断重复字符 利用set
var lengthOfLongestSubstring = function (s) {
  const occ = new Set()
  const n = s.length
  // 右指针-1 代表还没开始移动
  let rk = -1, ans = 0
  for (let i = 0; i < n; i++) {
    if (i != 0) {
      // 左指针向右移动一格(循环里的i++)，移除一个字符
      occ.delete(s.charAt(i - 1))
    }
    while (rk + 1 < n && !occ.has(s.charAt(rk + 1))) {
      // 不断的移动右指针
      occ.add(s.charAt(rk + 1))
      ++rk
    }
    // 第 i 到 rk 个字符是一个极长的无重复字符子串
    ans = Math.max(ans, rk - i + 1)
  }
  return ans
}
