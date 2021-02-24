```javascript
// KOA 官网上有很多middleware
let Koa = require('koa')
let http = require('http')
const { resolve } = require('path')
let app = new Koa() //这里app不是函数


//next执行完可以回来 同级request在服务器的时间
app.use(async (ctx, next) => {   //必须是异步函数 只有use一个方法 没有其他中间件方法 next也是异步函数
  // ctx.cookies.userid
  // ctx.body = 'foo'
  let start = Date.now()
  await next()
  let time = Date.mow() - start
  console.log('this request task', time, 'ms ')
})

app.use(async (ctx, next) => {
  await delay(3000)
})

http.createServer(app.callback())

function compose(middlewares) {
  return middlewares.reduceRight((next, mw) => {
    return async (req, res) => {
      await mw(req, res, async () => {
        await next(req, res)
      })
    }
  }, async () => { })
}

function delay(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  })
}

var f = compose([
  async (req, res, next) => {
    console.log(1)
    await next()
    console.log(2)
  },
  async (req, res, next) => {
    await delay(3000)
  }
])
```

```javascript
const Koa = require('koa');
const app = new Koa()

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(3000)
// Http.createServer(app.callback()).listen(3000)
```

```javascript
const Koa = require('koa');
const app = new Koa()

//加密 用于sign cookie 
app.keys = ['im a newer secret', 'i like turtle']
app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256')

//给客户端下发cookie
ctx.cookies.set('name', 'tobi', { signed: true })

//ctx 对象的原型 app.context
//希望在每个ctx访问到一些东西 可以挂在app.context上
app.context.db = db()

//错误处理
app.on('error', err => {
  log.error('server error', err)
})

app.use(async ctx => {
  ctx.body = 'Hello World'
})

//Context 对象
app.use(async ctx => {
  ctx;  // is the Context
  ctx.request; // is a Koa Request
  ctx.response;// is a Koa Response
})

//命名空间
ctx.state

//抛错
ctx.throw()

app.listen(3000)
```

