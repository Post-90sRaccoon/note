# asyncjs

```javascript
async.series([ //done之后结束 然后开始下一个
  function (done) {
    console.log(1)   // T时间打印
    done()  //函数 告知完成
  },
  function (done) {
    console.log(2)   //T
    setTimeout(() => {
      done()
    }, 2000)
  },
  // function (done) {
  //   try{

  //   } catch(e){
  //     done(e)
  //   }
  //  },
  function (done) {
    console.log(3)  //T+2000
    done()
    //done(err)
    //done(null,555)
  }
], function () {
  console.log('all tasks completed') //T+2000
})
```

```javascript
function series(tasks, cb) {
  let i = 0
  one()
  function one() {
    if (i < tasks.length) {
      tasks[i++](() => {
        one()
      })
    }
    else {
      cb()
    }
  }
}
```

```javascript
async.parallel([ //全部并行开始
  function (done) {
    console.log(1)   // T时间打印
    done()
  },
  function (done) {
    console.log(2)  //T
    setTimeout(() => {
      done()
    }, 2000)
  },
  function (done) {
    console.log(3)  //T
    setTimeout(() => {
      done()
    }, 3000)
  }
], function () {
  console.log('all tasks completed') //T+3000
})
```

```javascript
function parallel(tasks, cb) {
  var completedCount = 0
  for (var i = 0 i < tasks.length i++) {
    var task = tasks[i]

    task(() => {
      completedCount++
      if (completedCount == tasks.length) {
        cb()
      }
    })

  }
}
```

```javascript
async.parallelLimit([ //限制个数并行
  function (done) {
    console.log(1)   // T时间打印
    setTimeout(() => {
      done()
    }, 1000)
  },
  function (done) {
    console.log(2)  //T
    setTimeout(() => {
      done()
    }, 2000)
  },
  function (done) {
    console.log(3)  //T+1
    setTimeout(() => {
      done()
    }, 3000)
  }
], 2, function () {
  console.log('all tasks completed') //T+4000
})

```

```javascript
function parallelLimit(tasks, limit, cb) {
  var i = 0
  var completedCount = 0

  for (var j = 0 j < limit j++) {
    one()
  }

  function one() {
    if (i < tasks.length) { //不进入只是代表没有任务启动了 不代表任务都完成了 
      tasks[i++](() => {
        completedCount++

        if (completedCount == tasks.length) {
          cb()
        } else {
          one()
        }

      })
    }
  }
}
```

```javascript
tasks[i]()  
//数组去除属性调用 this是task所在的数组
task(()=>{})
//this 是window

foo.bar()
foo['bar']()
//this foo
```

 ```javascript
function f(a, b) {
  arguments[1]() //这样调用 arguments
}

f(1, function () {
  console.log(this) //看调用方式
})
 ```

```javascript
async.map([1, 2, 3, 4], function (it, cb) {
  setTimeout(() => {
    cb(null, it * it)
  }, 100)
}, function (err, mapped) {
  console.log(mapped)
})

async.filter([1, 2, 3, 4, 5], function test(it, cb) {
  setTimeout(() => {
    cb(null, it % 2 == 1)
  }, 200)
}, function (err, filtered) {
  console.log(filtered)
})
```

```javascript
function asyncMap(ary, mapper, cb) {
  var result = []
  var count = 0
  for (let i = 0; i < ary.length; i++) {
    mapper(ary[i], (err, value) => {
      result[i] = value  //push不保证顺序
      count++

      if (count == ary.length) {
        cb(null, result)
      }
    })
  }
}

function asyncFilter(ary, test, cb) {
  var result = new Array(ary.length).fill(false)
  var count = 0
  for (let i = 0; i < ary.length; i++) {
    test(ary[i], (err, pass => {
      if(pass){
        result[i] = true
      }
      count++
      if (count == ary.length) {
        var filtered = ary.filter((_,idx)=>{
          return result[idx]
        })
        cb(null,filtered)
      }
    })
  }
}
```

```javascript
function f(a) {
  g(b, a)
}
//相当于
f1 = g.bind(b)
//f1(a) -------> g(b,a)
 
function f(done){
  getImg(url,done)
}
getImg.bind(url)

async.series(_.chunk(cats, 2).map(urls => {
  return async.parallel.bind([   //load two img
    getImg.bind(urls[0]),
    getImg.bind(urls[1])
  ])
}), () => {
  //
})
```

```javascript
var a = $('body').queue(function (next) {
  console.log(1)
  setTimeout(next, 1000)
}).queue(function (next) {
  console.log(2)
  setTimeout(next, 5000)
}).queue(function (next) {
  console.log(3)
  setTimeout(next, 2000)
})

//可以随时添加任务
a.queue(function (next) {
  console.log(5)
  setTimeout(next, 2000)
})


for (var i = 0; i < cats.length; i++) {
  a.queue(done => {
    getImg(cats[i].fullUrl, img => {
      document.body.appendChild()
      done()
    })
  })
}

cats.reduce((a, cat) => {
  return a.queue(done => {
    getImg(cats[i].fullUrl, img => {
      document.body.appendChild()
      done()
    })
  })
}, a)
```

```javascript
class TaskQueue {
  constructor() {
    this.tasks = []
    this.hasTaskRunning = false
    // this.next = () => {
    //   if (this.tasks.length) {
    //     let task = this.tasks.shift()
    //     task(this.next)
    //   } else {
    //     this.hasTaskRunning = false
    //   }
    // } 相当于下面
  }
  next = () => {
    if (this.tasks.length) {
      let task = this.tasks.shift()
      task(this.next)
    } else {
      this.hasTaskRunning = false
    }
  }
  addTask(task) {
    if (this.hasTaskRunning) {
      this.tasks.push(task)
    } else {
      this.hasTaskRunning = true
      task(this.next)
    }

    return this
  }
}


class TaskQueue {
  constructor() {
    this.tasks = []
    this.hasTaskRunning = false
  }

  addTask(task) {
    if (this.hasTaskRunning) {
      this.tasks.push(task)
    } else {
      this.hasTaskRunning = true
      let next;
      task(next = () => {
        if (this.tasks.length) {
          let task = this.tasks.shift()
          task(next)
        } else {
          this.hasTaskRunning = false
        }
      })
    }

    return this
  }
}

class TaskQueue {
  constructor() {
    this.tasks = []
    this.hasTaskRunning = false
  }

  addTask(task) {
    if (this.hasTaskRunning) {
      this.tasks.push(task)
    } else {
      this.hasTaskRunning = true
      let that = this
      task(function next() {
        if (that.tasks.length) {
          let task = that.tasks.shift()
          task(next)
        } else {
          that.hasTaskRunning = false
        }
      })
    }

    return this
  }
}


class TaskQueue {
  constructor() {
    this.tasks = []
    this.hasTaskRunning = false
  }

  addTask(task) {
    if (this.hasTaskRunning) {
      this.tasks.push(task)
    } else {
      this.hasTaskRunning = true

      task(function next() {
        if (this.tasks.length) {
          let task = this.tasks.shift()
          task(next.bind(this))
        } else {
          this.hasTaskRunning = false
        }
      }.bind(this))
    }

    return this
  }
}

class TaskQueue {
  constructor() {
    this.tasks = []
    this.hasTaskRunning = false
  }
  next() {
    if (this.tasks.length) {
      let task = this.tasks.shift()
      task(this.next.bind(this))
    } else {
      this.hasTaskRunning = false
    }
  }
  addTask(task) {
    if (this.hasTaskRunning) {
      this.tasks.push(task)
    } else {
      this.hasTaskRunning = true

      task(this.next.bind(this))
    }

    return this
  }
}
```

