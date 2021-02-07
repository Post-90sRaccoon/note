# asyncjs

* 核心 调用时done函数 放在所有异步操作执行完后执行

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
  for (var i = 0;i < tasks.length;i++) {
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

  for (var j = 0;j < limit;j++) {
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
//数组属性调用 this是task所在的数组
task(()=>{})
//this 是window

foo.bar()
foo['bar']()
//this foo
```

 ```javascript
function f(a, b) {
  arguments[1]() //这样调用 this是arguments
}

f(1, function () {
  console.log(this) //看调用方式 这里声明 没有调用
})
 ```

```javascript
async.map([1, 2, 3, 4], function mapper (it,cb) { //不即刻返回结果 因为是异步的 把异步结果返回给callback  
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
      document.body.appendChild(img)
      done()
    })
  })
}

cats.reduce((a, cat) => {
  return a.queue(done => {
    getImg(cat.fullUrl, img => {
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
    this.hasTaskRunning = false  //是否有任务正在执行 
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
      let task = this.tasks.shift() //执行下一个任务
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
        if (this.tasks.length) { //要保证this是taskqueue的实例
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

#### promise和生成器函数结合 实现复杂的异步

```javascript
function* f() {
  console.log('start')
  let a = yield getValue(5, 2000)
  console.log(2)
  yield delay(1000)
  let b = yield getValue(10, 3000)
}

let g = f()
g.next().value.then(value=>{
  g.next(value).value.then(value=>{
    g.next(value).value.then(value=>{
      g.next(value)
    })
  })
})
console.log(1)
//start 1 2  就算then前面的promise已经确认状态 也不会立即执行then里面的函数 异步

g.next().value.then(value => {
  g.next(value)
},reason=>{
  g.throw(reason)
})




function getValue(val, duration) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(val)
    }, duration);
  })
}

function delay(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}
function getJSON(url) {
  return get(url).then(JSON.parse)
}
function get(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('get', url)
    xhr.onload = () => {
      resolve(xhr.responseText)
    }
    xhr.onerror = e=>{
      reject(new Error('NETWORK ERROR'))
    }
    xhr.send()
  })
}
```

#### run函数

```javascript
 run(function* f() {
    console.log('start')


    var data = yield getJSON('https://xieranmaya.github.io/images/cats/cats.json')
    console.log(data)

    var a = yield getValue(5, 2000)
    console.log(a)
    yield delay(1000)
    console.log(a)
    var b = yield getValue(10, 3000)
    console.log(a + b)

    return 888
  }).then(value => {
    console.log(value)
    console.log('f run completed...')
  }).catch(e => {
    console.log('run failed', e)
  })



  function run(generatorFunction) {
    return new Promise((resolve, reject) => {
      var generator = generatorFunction()
      var generated
      try {
        generated = generator.next()
      } catch (e) {
        reject(e)
        return
      }

      step()

      function step() {
        if (!generated.done) {
          generated.value.then(val => {
            try {
              generated = generator.next(val)
            } catch (e) {
              reject(e)
              return
            }
            step()
          }, reason => {
            try {
              generated = generator.throw(reason)
            } catch (e) {
              reject(e)
              return
            }
            step()
          })
        } else {
          resolve(generated.value)
        }
      }
    })
  }
```

```javascript
  function *bar(){

  }
  run(function *(){
    console.log(1)
    yield run(bar)
    var myip = yield getMyIp()
  })
  //等待bar函数先运行 
```

### 异步函数

```javascript
 //异步函数
  async function foo() {
    var data = await getJSON('https://xieranmaya.github.io/images/cats/cats.json')
    console.log(data)
    await delay(2000)
    var a = await 2
    //Promise.resolve(2)
    console.log(data)
    return delay(2000) //return 888 //
  }
  //返回promise
  foo().then(val => {
    console.log(val)
  })

  //箭头函数也可以异步
  var a = async () => { }



  function getValue(val, duration) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(val)
      }, duration);
    })
  }

  function delay(duration) {
    return new Promise(resolve => {
      setTimeout(resolve, duration)
    })
  }

  function getJSON(url) {
    return get(url).then(JSON.parse)
  }

  function get(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()
      xhr.open('get', url)
      xhr.onload = function () {
        resolve(xhr.responseText)
      }
      xhr.onerror = function () {
        reject(new Error('Network Error'))
      }
      xhr.send()
    })
  }
```

```javascript
async function foo() {
    console.log(1)
    await 2
    console.log(3)
  }
  foo()
  console.log(4)

//1 4 3
```

```javascript
var div = document.querySelector('div')
getComputedStyle(div, 'div::after')
//选不到伪元素 纯粹装饰才用伪元素 但是能获取伪元素css样式

async function foo(){
  var a = await getJSON('a.json')
}

//并行加载 串行执行

async function loadStory(){
  var story = await getJSON('stroy.json') //里面有各个chapter的json 的url
  var chapterPromises = story.chapters.map(getJSON) //并行加载 创建5个promise

  for (var chapterPromise of chapterPromises){
    var chapter = await chapterPromise 
    addToPage(chapter) //串行 执行
  }
}





function makePizza(sauceType = 'red') {
// cheese 等待 sauce 
  let doughPromise = makeDough();
  let saucePromise = makeSauce(sauceType);
  let cheesePromise = saucePromise.then(sauce => {
    return grateCheese(sauce.determineCheese());
  });

  return Promise.all([doughPromise, saucePromise, cheesePromise])
    .then(([dough, sauce, cheese]) => {
      dough.add(sauce);
      dough.add(cheese);
      return dough;
    });
}
```

