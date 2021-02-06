#  Promise

* 一个promise代表一个异步操作的结果 

```javascript
var p = new Promise(function executor(resolve, reject) { //成功和失败分别对应一个回调函数
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'a.txt')

  xhr.onload = function (e) {
    if (xhr.status < 400) {
      resolve(xhr.responseText)
    } else {
      reject({
        errno: xhr.status,
        response: xhr.responseText
      })
    }
  }

  xhr.onerror = function (e) {
    reject(e)
  }

  xhr.send()
})
```

```javascript
class Promise {
  constructor(executor) {
    function res() {

    }
    function rej() {

    }
    try {
      executor(res, rej) //executor 在promise构造时立刻执行了
    } catch (e) {

    }
  }
}
```

```javascript
p.then(f1, f2)
//then方法在promise结果被确定后 传入一个onResolve 一个onReject
//this 被强行设置为window 严格模式下是undefined

p.then(value => {

}, error => {

})
p.then(null, error => {

})
p.then(value => {

})
```

```javascript
var p2 = p.then(f1, f2) 
//then 返回一个promise p2由f1或f2的返回结果来确定
//如果f1 f2 返回了除promise以外正常的值 没throw错误 为成功

var p = new Promise(function (resolve, reject) {
  resolve()// p成功
})
// Promise {<resolved>: undefined}
//   __proto__: Promise
//   [[PromiseStatus]]: "resolved"
//   [[PromiseValue]]: undefined
var p2 = p.then(value => {//p2 运行throw8 失败
  throw 8
}, reason => {
  return 999
})
//Promise {<rejected>: 8}
// __proto__: Promise
// [[PromiseStatus]]: "rejected"
// [[PromiseValue]]: 8
var p3 = p2.then(value => {
  console.log(value)
}, reason => {
  console.log(reason)
})
//打印8
// Promise {<resolved>: undefined}
//   __proto__: Promise
//   [[PromiseStatus]]: "resolved"
// [[PromiseValue]]: undefined



var p = new Promise(function (resolve, reject) {
  reject()
})
var p2 = p.then(value => {
  throw 8
}, reason => {
  return 999
})
var p3 = p2.then(value => {
  console.log(value)
}, reason => {
  console.log(reason)
})
//打印999
```

```javascript
var p = new Promise(function (resolve, reject) {
  reject()
})
var p2 = p.then(value => {
  throw 8
})
var p2 = p.then(null, null)
var p2 = p.then()
//没有对应的失败函数 p2取p的状态


var p = new Promise(function (resolve, reject) {
  resolve()
})
var p2 = p.then(value => {
  return p5
}, reason => {
  return p6
})
//p2 取p5 的状态
```

```javascript
var p = new Promise(function (resolve, reject) {
  resolve() //p的状态已经确定
  throw 8   //再throw不改变状态 这里就不执行了
})
var p2 = p.then(value => {
  console.log('resolve: ' + value)
}, reason => {
  console.log('reject: ' + reason)
})
//resolve: undefined
```

#### 链式调用

```javascript
var p2 = p.then(value => {

}, reason => {

}).then(f3, f4) //不是挂在p上 而是p.then返回的新的promise
  .then(f5, f6)

//从前往后运行
p.then(f1, f2)
  .then(f3, f4)
  .then(f5, f6)
```

```javascript
// p success
p.then(value => {
  console.log(1)
  throw 5                   // 打印1  失败  value 5
}, reason => {
  console.log(reason)
  return 8
})
  .then(value => {
    console.log(value)
    return 7
  }, reason => {
    console.log(reason)      //  打印5   成功     undefined
  })
  .then(value => {
    return value * value    // undefined * undefined    成功     NaN
  }, reason => {
    console.log(reason)
    return 9
  })
```

```javascript
// p fail
p.then(value => {
  console.log(1)
  throw 5
}, reason => {
  console.log(reason)            //打印？？？  value8  成功
  return 8
})
  .then(value => {
    console.log(value)          //打印8  value7    成功
    return 7
  }, reason => {
    console.log(reason)
  })
  .then(value => {
    return value * value        //  value 49      成功
  }, reason => {
    console.log(reason)
    return 9
  })
```

```javascript
// p fail  5555
p.then(value => {
  console.log(1)
  throw 5
})                       //没有reject函数 取p的状态
  .then(value => {
    console.log(value)
    return 7
  }, reason => {
    console.log(reason)  //打印5555   失败   value 1
    throw 1
  })
  .then(value => {
    return value * value
  }, reason => {
    console.log(reason)     //打印 1   成功   value 9
    return 9
  })
  .then(value => {
    console.log(value)      //打印9     成功   value  undefined
  })
```

```javascript
//p resolve 666
p.then(value => {
  console.log(1)              //打印1   成功    value：5
  return 5
})
  .then(value => {
    console.log(value)        //打印5   失败    value:7
    throw 7
  })
  .then(value => {
    return value * value
  }, reason => {
    console.log(reason)                     //打印7   失败  value: promise
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(888)
      }, 1000)
    })
  })                            //一秒后以888失败
  .then(value => {              //没有reject函数  也以888失败
    console.log(value)
  })
  .then(null, reason => {          //打印888（一秒后）
    console.log(reason)
  })
```

```javascript
//p resolve 666
p.then(value => {
  console.log(1)                        //打印1
  return 5
})
  .then(value => {
    console.log(value)                  //打印5
    new Promise((resolve, reject) => {  //这里面没有return 返回undefined
      setTimeout(() => {
        reject(888)
      }, 1000)
    })
  })
  .then(value => {
    return value * value                 //返回NaN
  }, reason => {
    console.log(reason)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(888)
      }, 1000)
    })
  })
  .then(value => {                     //打印NaN
    console.log(value)
  })
  .then(null, reason => {
    console.log(reason)
  })
```

```javascript
p.then(a, b)
  .then(null, d)   //相当于.catch(d)
  .then(e, f)
  .then(g, h)


p.then(a, b)
  .then(d)
  .catch(c)
  .then(e)
  .then(g, i)
  .catch(h)
//then是立刻执行的 延迟按照次序运行的是里面的参数函数 即then执行 立刻返回（如果返回promise 可能是一个不确定状态的promise） 开始下一个then


p.then(value => {
  return p2.then(value => {
    return value * value
  })
})
//这里的then不是一个时机运行的 p2不一定什么时候确定状态
//p确定状态 then()才能执行 如果执行代码时p还没有确定状态 只能把then里面的先存起来 等到p确定状态才运行
```

```javascript
function getJSON(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = () => {
      if (xhr.status < 400) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(JSON.parse(xhr.responseText))
      }
    }
    xhr.onerror = (e) => {
      reject(e)
    }
    xhr.send()
  })
}


getJSON('a.json').then(data => {

}, reason => {

})
```

### Promise 构造函数上的函数

#### resolve()和reject()

```javascript
Promise.resolve(888)
Promise.reject(888)
//crateAResolvedPromiseWith(888) 返回一个promise 并且promise以888为成功的值
Promise.resolve = function (value) {
  return new Promise(resolve => {
    resolve(value)
  })
}
Promise.reject = function (reason) {
  return new Promise((_, reject) => {
    reject(reason)
  })
}
```

```javascript
Promise.resolve(Promise.resolve(1))
// Promise {<resolved>: 1}
//   __proto__: Promise
//   [[PromiseStatus]]: "resolved"
// [[PromiseValue]]: 1

Promise.resolve(Promise.reject(1))
// Promise {<rejected>: 1}
//   __proto__: Promise
//   [[PromiseStatus]]: "rejected"
//   [[PromiseValue]]: 1

Promise.reject(Promise.resolve(1))
// Promise {<rejected>: Promise}
//   __proto__: Promise
//   [[PromiseStatus]]: "rejected"
//   [[PromiseValue]]: Promise


Promise.reject(Promise.reject(1))
// Promise {<rejected>: Promise}
//   __proto__: Promise
//   [[PromiseStatus]]: "rejected"
// [[PromiseValue]]: Promise
```

##### 创建一个promise对象又不想new

```javascript
Promise.resolve().then(() => {

})
// Promise {<resolved>: undefined}
//   __proto__: Promise
//   [[PromiseStatus]]: "resolved"
// [[PromiseValue]]: undefined
```

#### all()

```javascript
Promise.all([p1, p2, p3, p4, p5]).then()
//接收Promise的数组 返回promise
//如果里面所有promise都成功了 返回成功promise 值为所有promise值的数组

Promise.all([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])
  .then(values => {
    console.log(values)
  })
//[1,2,3]

Promise.all([1, 2, Promise.resolve(3)])
  .then(values => {
    console.log(values)
  })
//[1,2,3]

Promise.all([1, Promise.resolve(2), Promise.reject(3), Promise.reject(4)])
  .then(values => {
    console.log(values)
  }, reason => {
    console.log(reason)
  })
//3 如果不是成功 返回第一个reject的值
```

```javascript
function getValue(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value)
    }, 3000 + Math.random() * 2000)
  })
}
```

```javascript
Promise.all([getValue(1), getValue(2), getValue(3)])
  .then(values => {
    console.log(values)
  })

// Promise {<pending>}
//   __proto__: Promise
//   [[PromiseStatus]]: "resolved"
// [[PromiseValue]]: undefined

//[1,2,3] 大概3~5s之后 等getValue全部运行完
```

> 下面 then函数里面的函数如果异步 抽象为promise 

```javascript
p2 = p.then(value => {
  get('a.json', data => {
    //异步 计算的值返回不给p2 只能返回undefined
  })
}, f2)

p2 = p.then(value => {
  return get('a.json')  //想要返回 把其抽象为promise版本 不回调
}, f2)
```

```javascript
function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)       //注意这里传的是函数 不是resolve()的调用
    //_.bind(setTimeout,null,_,time) // this为null 占位 绑定第二个参数
  })
}

sleep(5000).then(() => {
  console.log(1)
})


Promise.resolve()
  .then(() => {
    console.log(1)
    return sleep(1000)
  })
  .then(() => {
    console.log(1)
    return sleep(1000)
  })
  .then(() => {
    console.log(1)
    return sleep(1000)
  })
  .then(() => {
    console.log(1)
    return sleep(1000)
  })
  .then(() => {
    console.log(1)
    return sleep(1000)
  })
//第一个1立刻打 一秒钟打印一个1
```

```javascript
Promise.all2 = function all(promises) {
  return new Promise((resolve, reject) => {
    var result = new Array(promises.length)
    var count = 0
    if (promises.length) {
      for (let i = 0; i < promises.length; i++) {
        var promise = promises[i]

        Promise.resolve(promise).then(value => {  //包一层让数字也可以
          result[i] = value
          count++

          if (count == promises.length) {
            resolve(result)
          }
        }, reason => {
          reject(reason)
        })
      }
    } else {
      resolve(result)
    }
  })
}
```

```javascript
Promise.all2([
  getValue(1),
  getValue(2),
  getValue(3).then(value => { throw 4 })
])
  .then(console.log)
//Uncaught(in promise) 4
//rejected 4
```

#### race()

```javascript
  p2 = Promise.race([
  getValue(1),
  getValue(2),
  getValue(3).then(v => { throw v })
]).then(
  v => console.log('resolve', v),
  r => console.log('reject', r),
)
//返回一个promise 谁先确定结果 谁的结果就是race返回的promise的结果
```

```javascript
function race(promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject)
    }
  })
}
```

#### allSettled

```javascript
//要Promise全部有结果
Promise.allSettled([
  getValue(3),
  getValue(4).then(v => { throw v })
]).then(
  results => console.log(results)
)
//返回[{},{}] 每个promise的最终状态
//   (2)[{ … }, { … }]
// 0: { status: "fulfilled", value: 3 }
// 1: { status: "rejected", reason: 4 }
// length: 2
// __proto__: Array(0)
```

```javascript
Promise.allSettled = function (promises) {
  return new Promise(resolve => {
    var results = []
    var count = 0

    if (promises.length) {
      for (let i = 0; i < promises.length; i++) {
        var promise = promises[i]
        promise.then(value => {
          results[i] = {
            status: 'fulfilled',
            value,
          }
          count++
          if (count == promises.length) {
            resolve(results)
          }
        }, reason => {
          results[i] = {
            status: 'rejected',
            reason,
          }
          count++
          if (count == promises.length) {
            resolve(results)
          }
        })
      }
    } else {
      resolve(results)
    }
  })
}
```

#### 如果不用promise，处理错误很麻烦

```javascript
get('foo.json', (err, data) => {
  if (err) {

  } else {
    //use data
    get('bar.json', (err1, data1) => {
      if (err1) {

      } else {
        //use data1
      }
    })
  }
})
```

* Promise 把一个异步过程包装在一个对象里，这个表达异步操作的对象可以被传递并且可以在这个异步操作成功或失败时执行特定的操作

##### promise异步处理异常

```javascript
function getJSON(url) {
  return get(url).then(JSON.parse)
}
getJSON('a.json')
  .then(data => {

  }).catch(err => {

  })
//调用链最后挂catch就好
```

##### 同步处理异常

```javascript
function getJSON(url) {
  return JSON.parse(get(url))
}
try {
  getJSON('a.json')
} catch (e) {

}
//try catch就好
```

```javascript
get('bert.json', (err, data) => {
  if (err) {
    showError(String(err))
  } else {
    get('data.spouse', (err, data) => {
      if (err) {
        showError(String(err))
      } else {
        get('data.mother', (err, data) => {
          if (err) {
            showError(String(err))
          } else {
            showMessage(data.name)
          }
        })
      }
    })
  }
})
//回调地狱
```

```javascript
function showMessage(msg) {
  var elt = document.createElement(" div ")
  elt.textContent = msg
  return document.body.appendChild(elt)
}
var loading = showMessage(" Loading ...")
getJSON(" example / bert . json ").then(function (bert) {
  return getJSON(bert.spouse)
}).then(function (spouse) {
  return getJSON(spouse.mother)
}).then(function (mother) {
  showMessage(" The name is " + mother.name)
}).catch(function (error) {
  showMessage(String(error))
}).then(function () {
  document.body.removeChild(loading)
})
```

##### 回顾

```javascript
p2=p.then()
//等价于
p2=p.then(value=>value,reason=>{throw reason})
```

> https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html

#### 比较四段代码的异同

```javascript
//dosomething 返回promise
doSomething().then(function () {
  return doSomethingElse()
})//取doSomethingElse()返回的promise为自己的状态
//如果doSomethingElse()5s后返回promise return会等待5s 

doSomething().then(function () {
  doSomethingElse()
})//直接返回undefined 不会等dosomethingElse执行完

doSomething().then(doSomethingElse())
//then只接函数 里面不是函数就忽略掉 相当于没有参数 doSomething和doSomethingElse的时机非常近
//dosomthing启动一瞬间结束 他启动的promise晚执行
doSomething().then(doSomethingElse)
```

![image-20200722201509187](17%20Promise.assets/image-20200722201509187.png)

```javascript
p.then(value => {
  foo().then(bar => {
    baz().then(baa => {
//这样成回调了
    })
  })
})

p.then(value => {
  return foo()
}).then(bar => {
  return baz()
}).then(baa => {

})

//p失败
p.then(value => {
  foo().then(c, d)
})
//p失败
p.then(value => {
  return foo()
}).then(c, d)

//两种是不同的 全成功才相同
```

#### 分析函数的调用时机

```javascript
//a() b() 都返回promise
a().then1(function f1() {
  b() //没有return 直接返回undefined 然后直接then(f2)
}).then2(f2)
```

![image-20200722204553258](17%20Promise.assets/image-20200722204553258.png)

```javascript
a.then1(b()).then2(f)
//f等 then1 但是 返回promise 相当于空 所以取决于a
JSON.parse(a+b) //a+b先运行 先把参数计算出来
```

![image-20200722205257945](17%20Promise.assets/image-20200722205257945.png)

```javascript
a().then1(function f1(){
  return b()
}).then2(f2)
```

![image-20200722205631719](17%20Promise.assets/image-20200722205631719.png)

```javascript
a().then1(b).then2(f)
```

![image-20200722205840191](17%20Promise.assets/image-20200722205840191.png)

```javascript
db.allDocs({ include_docs: true }).then(function (result) {
  //result.rows.forEach(function (row) {
  db.remove(row1.doc);
  db.remove(row2.doc);
  db.remove(row3.doc);
  db.remove(row4.doc);
  db.remove(row5.doc);
  // });    //直接返回undefined 然后执行下一个then 这里只是刚开始执行删除文档
}).then(function () {
  // I naively believe all docs have been removed() now!
})



db.allDocs({ include_docs: true }).then(function (result) {
  return Promise.all(result.rows.map(function (row) {
    return db.remove(row.doc) //map得到5个promise的数组
  }))
}).then(function () {
  // I naively believe all docs have been removed() now!
})
```

```javascript
Promise.resolve().then()
  .then(value => {
    setTimeout(() => {
      throw 8
    }, 500)
   // return sleep(500).then(()=>{throw 8})  //这样写可以被catch
  })//返回undefined
  .then()
  .then()
  .then()
  .catch()//catch 不到

function sleep(time) {
  return new Promise(setTimeout(resolve, time))
}
```

```javascript
class Q { }
class BlueBird { }
p1 = new Q(f1)
p2 = new BlueBird(f2)

p1.then(value => {
  return p2   //发现p2有then方法 q和bluebird也可以交互
})
```

#### Promise一个一个运行

```javascript
function executeSequentially(promises) {
  var result = Promise.resolve();
  promises.forEach(function (promise) {
    result = result.then(promise); //then接的是函数 不是promise
  });
  return result;
}

executeSequentially([
  db.remove(1), //只要promise函数创建出来就会执行异步操作
  db.remove(2),
  db.remove(3)
])

//promise工厂
function executeSequentially(promiseFactories) {
  return Promise.resolve()
    .then(promiseFactories[0])
    .then(promiseFactories[1])
    .then(promiseFactories[2])
    .then(promiseFactories[3])

  return  promises.reduce(function(result,promise){
    return result.then(()=>promise)
  },Promise.resolve())
}

function executeSequentially(promiseFactories) {
  var result = Promise.resolve();
  promiseFactories.forEach(function (promiseFactory) {
    result = result.then(promiseFactory);
  });
  return result;
}

executeSequentially([
  () => db.remove(1),
  () => db.remove(2),
  () => db.remove(3)  //三个函数 不调用 promise就不会创建出来 就不会进行异步操作
])
```

```javascript
//两个promise串行执行
getUserByName('nolan').then(function (user) {
  return getUserAccountById(user.id);
}).then(function (userAccount) {
  // dangit, I need the "user" object too! 
});//访问不到user


var user;
getUserByName('nolan').then(function (result) {
  user = result;
  return getUserAccountById(user.id);
}).then(function (userAccount) {
  // okay, I have both the "user" and the "userAccount"
});


getUserByName('nolan').then(function (user) {
  return getUserAccountById(user.id).then(function (userAccount) {
    // okay, I have both the "user" and the "userAccount"
  });
});
```

#### Promise A+标准

> https://promisesaplus.com/

#### 什么是promise

1. 是一个函数或者对象  有一个then方法 而且then的行为遵循文档
2. 有then方法
3. value是JS里合法的值 包括undefined then方法 和promise
4. exception是throw抛出来的值
5. reason是代表promise rejected的值

##### promise满足的状态

1. pending  可转为fulfilled或rejected
2. fulfilled     不能转换状态  必须有一个value 不能改变  所以只有resolve第一次有用
3. rejected    不能转换状态 必须有一个reason  不可变

* 不可变指的是指向不可变 指向的对象可以改动

##### then方法

`promise.then(onFulfilled,onRejected)`

1. 如果then里面的不是方法，会被忽略

2. 先执行平台代码，再执行异步函数

   ```javascript
   Promise.resolve().then(()=>console.log(1))
   console.log(2)
   //2
   //1
   ```

3. onFulifilled,onRejected必须当做函数调用而不是方法

   ```javascript
   onFUlfilled1()
   //而不是
   obj.onFulfilled()
   ```

   ```javascript
   class A{
     foo(){console.log(this)}
   }
   a = new A()
   b = a.foo
   b()
   //返回undefined es6 class会调用严格模式
   ```

   ```javascript
   var resolve, reject
   var pormise = new Promise((a, b) => {
     resolve = a
     reject = b
   })
   function ResolvePromise(promise, x, resolve, reject) {
     if (x === promise) {
       reject(new TypeError('xxxxx')) //不能根据自己确定自己的状态 p.then(()=>p)
       return
     }
     if (x instanceof MyPormise) { //不同类型的promise
       x.then(resolve, reject)
       return
     }
     if (x && (typeof x == 'function' || typeof x == 'object')) {
       try {
         var then = x.then  //可能是getter 要取出来 不然读两遍可能不一样
         var called = false
         if (typeof then === 'function') {
           //x.then(resolvePromise,rejectPromise)
           then.call(x, function (y) {
             caller = true
             ResolvePromise(promise, y, resolve, reject)
           }, function (r) {
             caller = true
             ResolvePromise(promise, r, resolve, reject)
           })
         } else {
           resolve(x)
         }
       } catch (e) {
         if (!called) {
           reject(e)
         }
       }
     } else {
       resolve(x)
     }
   }
   ```
   
> https://web.dev/promises/
   
```javascript
   img1.ready = function () {
     return new Promise((resolve, reject) => {
       if (this.isLoaded) {//isLoaded伪代码 假设图片早已加载完成了
         resolve()
       }
       if (this.isErrored) {
         reject()
       }
       this.onload = () => {
         resolve()
       }
       this.onerror = () => {
         reject()
       }
     })
   }
   ```
   
```javascript
   //jQuery 创建promise
   var dfd = $.dererred()
   // dfd.promise
   // dfd.resolve
   // dfd.reject
   
   function get(url) {
     var dfd = $.dererred()
     var xhr = new XMLHttpRequest()
     xhr.open('get', url)
     xhr.load = function () {
       dfd.resolve(xhr.responseText)
     }
     xhr.onerror = function () {
       dfd.reject(new Error('net work error'))
     }
     return dfd.promise
   }
   
   function deferred() {
     let dfd = {}
     dfd.promise = new Promise((resolve, reject) => {
       dfd.resolve = resolve
       dfd.reject = reject
     })//同步执行 promise创建出来 resolve和reject已经挂上了
     return dfd
   } 
   ```

   

```javascript
//串行加载 慢
getJson('https://googlesamples.github.io/web-fundamentals/fundamentals/primers/story.json')
  .then(story => {
    var urls = story.chapterUrls
    get(urls[0]).then(chapter1 => {
      //showChapter(chapter1)
      return getJson(urls[1])
    }).then(chapter2 => {
      //showChapter(chapter1)
      return getJson(urls[2])
    }).then(chapter2 => {
      //showChapter(chapter1)
      return getJson(urls[3])
    }).then(chapter2 => {
      //showChapter(chapter1)
      return getJson(urls[4])
    }).then(chapter2 => {
      //showChapter(chapter1)
      return getJson(urls[5])
    })
  })


var sequence = Promise.resolve()

story.chapterUrls.forEach(function (chapterUrl) {
  sequence = sequence.then(function () {
    return getJSON(chapterUrl)
  }).then(function (chapter) {
    addHtmlToPage(chapter.html)
  })
})

story.chapterUrls.reduce(function (sequence, chapterUrl) {
  return sequence.then(function () {
    return getJSON(chapterUrl)
  }).then(function (chapter) {
    addHtmlToPage(chapter.html)
  })
}, Promise.resolve())
  .then(() => {
    console.log('all chapters shown')
  })

cats.reduce((seq, cat) => {
  return seq.then(() => {
    return getImgPromise(cat.fullUrl)
  })
}, Promise.resolve())
  .then(() => {
    console.log('all cats downloaded...')
  })
//同时加载
var story
story.chapterUrls.map(url => getJson(url)) 



Promise.all(
  story.chapterUrls.map(url=>{
    return getJson(url).then(c=>{
      addHtmlToPage(c.html)   //谁先加载 谁先上 但会乱序
    })
  })
)
.then(chapters=>{
  chapters.forEach(it=>addHtmlToPage(it.html)) //全加载后 才能加上
})
```

```javascript
//并行加载 串行显示
var chapterPromises = story.chapterUrls.map(url => {
  return getJson(url)  //所有章节开始加载了
})

Promise.resolve()
  .then(() => {
    return chapterPromises[0]   //等待加载完成开始显示
  }).then(chapter => {
    addHtmlToPage(chapter.html)
  }).then(() => {
    return chapterPromises[1]
  }).then(chapter => {
    addHtmlToPage(chapter.html)
  }).then(() => {
    return chapterPromises[2]
  }).then(chapter => {
    addHtmlToPage(chapter.html)
  }).then(() => {
    return chapterPromises[3]
  }).then(chapter => {
    addHtmlToPage(chapter.html)
  }).then(() => {
    return chapterPromises[4]
  }).then(chapter => {
    addHtmlToPage(chapter.html)
  })



var chapterPromises = story.chapterUrls.map(url => {
  return getJson(url)
}).reduce((seq,chapterPromise)=>{
  return seq.then(()=>{
    return chapterPromise
  }).then(chapter=>{
    addHtmlToPage(chapter.html)
  })
},Promise.resolve())
.then(()=>{
  removeLoading()
})



var chapterPromises = story.chapterUrls.map(url => {
  return getJson(url)
}).reduce((seq,chapterPromise)=>{
  return seq.then(()=>chapterPromise).then(chapter=>{
    addHtmlToPage(chapter.html)
  })
},Promise.resolve)
.then(()=>{
  removeLoading()
})
```

* http抽象方式 aria restful
* SNI

### run函数

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

  // g.next().value.then(value => {
  //   //这里getValue(5,2000) resolve了 完成
  //   g.next(value).value.then(value => {
  //     //这里的value 是resolve的5
  //     g.next(value).value.then(value => {
  //       g.next(value)
  //       //传入10
  //     })
  //   })
  // })

  // g.next().value.then(value => {
  //   g.next(value).value.then(value => {
  //     g.next(value).value.then(value => {
  //       g.next(value).value.then(value => {
  //         g.next(value)
  //       })
  //     })
  //   })
  // })

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

  console.log(1)
  //先打印1 上面异步调用 在所在调用栈都执行完执行

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

function loadStory(){
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

