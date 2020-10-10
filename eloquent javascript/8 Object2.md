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

