//归并排序
// 数组一分为二 分别排序 然后合并
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

//链表归并排序
// 分隔环节 从链表中点将链表断开 找中点 快慢双指针法
// 合并 建立辅助结点h作为头部 left right 指向两链表头部 合并 返回h.next

function mergeSort(head) {
  if (head == null || head.next == null) {
    return head
  }
  let middle = findMiddle(head)
  let left = head
  let right = middle.next
  middle.next = null

  left = mergeSort(left)
  right = mergeSort(right)

  return mergeList(left, right)

}

function findMiddle(head) {
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
    if (l1.val < l2.val) {
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

//快速排序
function sortArray(ary, start = 0, end = ary.length - 1) {
  if (start >= end) {
    return ary
  }

  let pivot = Math.random() * (end - start + 1) + start | 0
  swap(ary, pivot, end)

  let j = start - 1
  for (let i = start; i < end; i++) {
    if (ary[i] < ary[end]) {
      swap(ary, ++j, i)
    }
  }
  swap(ary, ++j, end)
  sortArray(ary, start, j - 1)
  sortArray(ary, j + 1, end)
  return ary
}

function swap(ary, i, j) {
  let temp = ary[i]
  ary[i] = ary[j]
  ary[j] = temp
}

//数组第k大的数
function largestk(ary, start = 0, end = ary.length - 1, k) {
  if (end - start + 1 < k || k < 1) {
    return -1
  }
  let pivotIdx = Math.random() * (end - start + 1) + start | 0
  let pivot = ary[pivotIdx]
  swap(ary, pivotIdx, end)
  let j = start
  for (let i = start; i < end; i++) {
    if (ary[i] < pivot) {
      swap(ary, i, j++)
    }
  }
  swap(ary, end, j)
  if (j == end - k + 1) {
    return pivot
  } else if (j > end - k + 1) {
    return largestk(ary, start, j - 1, k - (end - j + 1))
  } else if (j < end - k + 1) {
    return largestk(ary, j + 1, end, k)
  }
}

function swap(ary, a, b) {
  let temp = ary[a]
  ary[a] = ary[b]
  ary[b] = temp
}
