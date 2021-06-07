## Concurrent 模式介绍(文档)

* fiber架构 分开渲染 空闲时间相应操作 中间交互取消显示 后面就不渲染了 

* 抛出错误，react卸载组件树。
* suspense 没获取到数据就抛出promise
* 没卸载 suspense 里面有componentDidcatch 判断抛出的是promise对象 显示callback 当这个promise状态完成 显示组件

#### suspense大致实现

```javascript
class MySuspense extends React.Component {  
      state = {
        loading: false
      }
      componentDidCatch(e) {
        if (e instanceof Promise) {
          this.setState({
            loading: true
          })
          e.then(() => {
            this.setState({
              loading: false
            })
          })
        }
      }
      render() {
        if(this.state.loading){
          return this.props.fallback
        }else{
          return this.props.children
        }
      }
    }
```

```jsx
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

> https://codesandbox.io/s/frosty-hermann-bztrp

#### useTransition()

#### suspenseList  

## Vuex 与 Redux

* 数据放在单独一个地方，所有组件与之通信

```jsx
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/immer@7.0.8/dist/immer.umd.development.js"></script>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState } = React
    function TodoApp() {
      let [todos, setTodos] = useState([{ content: 'eat', completed: true }, { content: 'drink', completed: false }, { content: 'sleep', completed: true }])
      let [category, setCategory] = useState('all')
      let [editingIdx, setEditingIdx] = useState(-1)

      function toggleTodoStatus(todo) {
        debugger
      }

      return (
        <div>
          <TodoHeader />
          <TodoList todos={todos} toggleTodoStatus={toggleTodoStatus} />
          <TodoFooter />
        </div>
      )
    }
    function TodoHeader() {
      return <div>
        <input type="checkbox" />
        <input type="text" />
      </div>
    }

    function TodoFooter() {
      return <div>todo footer</div>
    }

    function TodoList(props) {
      return (
        <div>
          {
            props.todos.map((todo, idx) => {
              return <TodoItem key={idx} todo={todo} toggleTodoStatus={props.toggleTodoStatus} />
            })
          }
        </div>
      )
    }

    function TodoItem(props) {
      return (
        <div>
          <input type="checkbox" checked={props.todo.completed} onChange={props.toggleTodoStatus} />
          <span>{props.todo.content}</span>
          <button>&times;</button>
        </div>
      )
    }

    ReactDOM.render(
      <TodoApp />,
      document.getElementById('root')
    )
  </script>
</body>

</html>
```

> npm i redux react-redux
>
> npm i immer

```javascript
function todoReducer(state, action/*{type:'toggleTodoStatus',todo:{}}*/) {
  switch (action.type) {
    case 'setEditingIdx':
      return {
        ...state,
        editingIdx: action.index
      }
    default:
      return state
  }
}
store = Redux.createStore(todoReducer, {
  editingIdx: -1,
  category: 'all',
  todos: [
    {
      content: 'eat',
      completed: true
    },
    {
      content: 'eat',
      completed: true
    },
    {
      content: 'eat',
      completed: false
    },
  ]
})
```

> `store.getState()`
>
> `store.dispatch({'setEditingIdx',2})`
>
> `store.subscribe(()=>{console.log('data change')})`

### 自己写store

```javascript
class Store{
  constructor(reducer,initState){
    this.reducer = reducer
    this.state = initState
    this.subscribes = []
  } 

  getState()=>{
    return this.state
  }
  dispatch(action)=>{
    this.state = this.reducer(this.state,action)
    for(let f of this.subscribes){
      f()
    }
    return action
  }
  subscribe=(f)=>{
    this.subscribes.push(f)
    let  unsubscribe = ()=>{
      this.subscribes = this.subscribes.filter(it=>it!==f)
    }
    return unsubscribe
  }
}
```

```jsx
import React, { createContext, useContext, useEffect } from 'react'

let StoreContext = createContext()

export function Provider({ store, children }) {
  let [ctxValue, setCtxValue] = useState({ getState: store.getState, dispatch: store.dispatch })
  useEffect(() => {
    store.subscribe(() => {
      setCtxValue({ getState: store.getState, dispatch: store.dispatch })
    })
  }) //触发更新
  return (
    <StoreContext.Provider value={ctxValue}>
      {children}
    </StoreContext.Provider>
  )
}

export function useSelector(f) {
  let store = useContext(StoreContext)
  return f(store.getState())
}

export function useDispatch() {
  let store = useContext(StoreContext)
  return store.dispatch
}

```

#### 实际使用

* store.js

```javascript
import { createStore } from 'redux'
import { produce, original } from 'immer'

let actions = {
  setEditingIdx(state, action) {
    state.editingIdx = action.index
  },
  addTodo(state, action) {
    state.todos.push({
      content: action.todoText,
      completed: false
    })
  },
  deleteTodo(state, action) {

  },
  setAllCompleted(state, action) {
    state.todos.forEach(it => {
      it.completed = true
    })
  },
  setAllActive(state, action) {
    state.todos.forEach(it => {
      it.completed = false
    })
  },
  toggleTodoStatus(state, action) {
    let oriTodos = original(state.todos)
    let idx = oriTodos.indexOf(action.todo)
    if (idx >= 0) {
      state.todos[idx].completed = !state.todos[idx].completed
    }
  }
}
function todoReducer(state, action) {
  let f = actions[action.type]
  if (f) {
    return produce(state, draft => {
      f(draft, action)
    })
    //return produce(f)(state,action)
  } else {
    return state
  }
}

export default createStore(todoReducer, {
  editingIdx: -1,
  category: 'all',
  todos: [{
    content: 'eat',
    completed: true,
  }, {
    content: 'drink',
    completed: true,
  }]
})


```

* app.js

  ```jsx
  import './App.css';
  import store from './store'
  import { Provider } from 'react-redux'
  
  function App() {
    return (
      <Provider store={store}>
        <TodoApp />
      </Provider>
    );
  }
  
  export default App;
  ```

* TodoHeader.js

  ```jsx
  import React from 'react'
  import { useDispatch, useSelector } from 'react-redux';
  
  export default function TodoHeader() {
    let isAllCompleted = useSelector(state => { //store里面getState传到这里了
      return state.todos.every(it => it.completed)
    })
    let dispatch = useDispatch() //为上层store dispatch
  
    function handle() {
      if (isAllCompleted) {
        dispatch({
          type: 'setAllActive'
        })
      } else {
        dispatch({
          type: 'setAllCompleted'
        })
      }
    }
  
    function addTodo(e) {
      if (e.key == 'Enter') {
        let todoText = e.target.value.trim()
        if (todoText) {
          dispatch({
            type: 'addTodo',
            todoText: todoText
          })
        }
        e.target.value = ''
      }
    }
    return (
      <div>
        <input type="checkbox" checked={isAllCompleted} onChange={handle} />
        <input type="text" onKeyUp={addTodo} />
      </div>
    )
  }
  ```

* class 用法

  ```javascript
  import React, { Component } from 'react'
  import { connect } from 'react-redux'
  
  class TodoFooter extends Component {
    render(){
      console.log(this.props)
      return <div>footer</div>
    }
  }
  
  //作用类似useSelector 将state中需要的值映射为组件props
  function mapStateToProps(state){
    return {
      leftCount: state.todos.filter(it =>!it.completed).length
    }
  }
  //作用类似useDispatch props里的某些属性是函数 函数调用disp  atch  
  function mapDispatchToProps(dispatch){
    return {
      setCategory(category){
        dispatch({
          type:'setCategory',
          category
        })
      }
    }
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(TodoFooter)
  ```

  * 实现connect

  ```javascript
  import React, { Component } from 'react'
  import { connect } from 'react-redux'
  
  class TodoFooter extends Component {
    render() {
      console.log(this.props)
      return <div>footer</div>
    }
  }
  
  //useSelector 映射为组件props
  function mapStateToProps(state) {
    return {
      leftCount: state.todos.filter(it => !it.completed).length
    }
  }
  //useDispatch
  function mapDispatchToProps(dispatch) {
    return {
      setCategory(category) {
        dispatch({
          type: 'setCategory',
          category
        })
      }
    }
  }
  
  function connext(mapState, mapDispatch) {
    return function (Comp) {
      return class extends React.PureComponent {
        static contextType = StoreContext
  
        render() { 
          let context = this.context
          let { children, ...props } = this.props
          let state = mapState(context.getState())
          let dispatchs = mapDispatch(context.dispatch)
          return <Comp {...props} {...state} {...dispatchs}>{children}</Comp>
        }
      }
    }
  }
  
  function createStore(reducer,init){
    return new Store(r)
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(TodoFooter)
  ```
  
  * redux 中间件

```javascript
s = Redex.createStore(function reducer() {

}, {},
  Redux.applyMiddleware(
    function a(store) {
      return function aa(d) { //这个d是下一个dispatch
        return function dispatch(action) {
          //最终拿到的是这个函数
          d(action)
        }
      }
    }, function b(store) {
      return function bb(d) { //这个d是redux原始dispatch
        return function dispatch(action) {
          d(action)
        }
      }
    }
  )
)

//往store里面dispatch一个promise
s = Redex.createStore(function reducer() {

}, {},
  Redux.applyMiddleware(
    function a(store) {
      return function aa(nextDispatch) {
        return function dispatch(action) {
          nextDispatch(action)
        }
      }
    }, function promiseDispatch(store) {
      return function bb(nextDispatch) {
        return function dispatch(action) {
          if (action instanceof Promise) {
            return action.then(value => {
              nextDispatch(value)
            })
          } else {
            return nextDispatch(action)
          }
        }
      }
    }
  )
)
```

* vuex  用use

  ```javascript
  let store = new store({
    state: {},
    mutations: {//数据变更}
      addTodo(state, payload) {//payload push的值
        stete.todos.push({
          content: payload.TodoText,
          completed: false
        })
      }
    }
  })
  
  //import store from './store'
  new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount('#app')
  
  this.$store.commit({ type: 'addTodo', todoText: this.todoText })
  ```

  * 组件可以通过this.$store.state 访问

  * 不要使用双向绑定 使用mutation改变数据

* 计算属性 mapState

```javascript
//import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState({
      todos: state => state.todos,
      isAllChecked: state=>state.todos.every(it=>it.completed)
    }),
    ...mapState(['todos','editingIdx'])
  }
}
```

* 实现mapState

```javascript
function mapState(ary) {
  let obj = {}
  for (let key of ary) {
    obj[key] = function () {
      return this.$store.state[ary]
    }
  }
  return obj
}

function mapState(obj) {
  let result = {}
  for (let key in obj) {
    let val = obj[key]
    result[key] = function () {
      return val(this.$store.state)
    }
  }
  return result
}
```

* getter计算属性

```javascript
import store from "./store";

export default new store({
  getter: {
    showingTodos(state, getters) {

    },
    isAllCompleted(state,getters){
      
    }
  }
})

//xxx.vue
import { mapGetters } from 'vuex'
export default {
  computed: { ...mapGetters(['isAllCompleted']) }
} 
```

其实mapState和mapGetters的真正区别在于：

* mapState在组件层，整合组件资源，进行个性化操作，也就是某个.vue。适用于获取纯状态树上的原始数据，可能在每个页面都要再进行计算。
* mapGetters在store层，整合store层资源，进行个性化操作，也就是getters.js。适于获取状态树上的处理后的数据，不需要在每个页面进行计算，store层直接算好了。多个组件都需要的数据。



####  异步操作 使用action

```javascript
//store.js
export default new store({
  actions: {
    getInitialTodos({ commit }) {
      setTimeout(() => {
        commit('addTodo', { todoText: 'foo' })
      }, 5000);
    }
  }
})
```

* action store.dispatch(actionName,payload)触发
* mutations store.commit(mutationName,payload)触发

#### module

```javascript
//把store 拆分成更小的模块

const moduleA = { state: () => { } }
const moduleB = { 
  state: () => { },
  getters:{
    seta(state,getters,rootState){
      //state是局部state rootState是全局state
    }
  } 
}

const store = new Vuex.Store({
  modlues: {
    a: moduleA,
    b: moduleB,
  }
})

store.commit('a/addTodo')
store.commit('b/isAllSelected')
```

vue但文件组件css scoped 只对单文件组件内的生效 通过加data-属性

```css
<style scoped>
  div{
    border:8px solid red;
  }
</style>
//局部生效
```

#### react css

```javascript
//css module
import xxx from 'yy.css'
<div className={xxx.foo}></div>
```



React 构造函数里不要执行副作用 比如subscribe 开发环境下 运行两次 只挂载一个组件 就会出现问题



### websocket

```javascript
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8085 })
//浏览器不对ws跨域限制 服务器可以限制
//ws协议相当于tcp上实现了消息机制 解决了粘包
//相当于tcp字节流中放了消息中的隔板
//ws协议使用http协议进行握手 tcp连接建立成功后先发http报文进行协议升级的协商 成功后tcp连接上就发ws报文
//ws服务器一般是集成到http服务器上的 接管node http server的upgrade事件
//只能发字符串或者二进制数据
//没有断开重连机制
//socket.io 可以支持低版本降级为长轮询 自动重连 自动序列化反序列化 ws抽象成了一个基于事件的

wss.on('connection', function connection(ws, req/*该ws握手阶段的http请求对象*/) {
  ws.on('message', function imcoming(message) {
    console.log('received: %s', message)
    ws.send(message.toString().toUpperCase())
  })

  let i = 0
  setInterval(() => {
    ws.send(i++ + '')
  }, 2000)
  ws.send('something')
})

// ws = new WebSocket('ws://localhost:8085/foo')
// ws.send('hello')
// ws.onmessage = e => {
//   console.log(e.data)
// }


const http = require('http')
const WebSocket = reuqire('ws')
const app = express()

const server = http.createServer(app)
const wss = new WebSocket.Server({server})

wss.on('connection',(ws,req)=>{

})

useEffect(() => {
  let ws = new WebSocket(`/vote/${id}`)
  return () => ws.close()
}, [id])
```

#### 上线

> npm run bulid
>
> build文件夹 放到后端文件夹里面 加中间件 app.use(express.static(__dirname+‘/build’))

### TypeScript

> TS 是 JS 的超集
>
> TS 静态类型语言 
>
> ts允许为一份已经存在的由原神js编写的代码增加一份类型声明文件
>
> 静态类型由于书写时就能确定所有变量的类型，带来的好处是编辑器及相关的语法检查

```typescript
function add(a:number,b:number):number{
  return a+b
}

var ary:Array<number> = [1,2,3]

let obj:object = ary.push({})
//错误ary.push返回数字 ary里面只能放数字

class People extends Array{
  x:number 
  y:number
  constructor(name:string,age:number){
    super(age) //数组只接一个name时 接数字
    this.x=1
    this.y =2
  }
  foo(a:string,b:number):People{
    let r =new People(a,b)
    return r
  }
  bar():void{

  }
}

let a:Array<number>=[1,2,3] 

//没确定具体类型
class PriorityQueue<T>{
  elements:T[]
  //elements Array<T>
  constructor(predicate:(T)=>number){
    this.elements = []
  }
  push(el:T){
    this.elements.push(EL)
  }
}
```

#### webpack

> 打包：将代码从入口文件开始打包为一个单一的文件
>
> 转换：将不是js的文件通过loader转换为等价js文件
>
> TreeShaking：摇树优化 没有直接间接使用的函数 类 value 不会打包 减少打包文件体积 需要es module书写 因为es module是静态的
>
> Code Spliting 代码分割
>
>  打包所有业务逻辑和框架打包到单一文件 太大
>
>  打包到一个文件所有功能不会都被用户使用
>
>  用户打开页面只加载入口功能 

```javascript
window.onresize = async function(e){
  let {default:Layout,foo} = await import('./layout.js')
  Layout.default//默认导出
  Layout.foo //具名导出 
}
let Clock =React.lazy(()=>import('./Clock.js'))
function App(){
  return (
    {
      showClock && <Clock />
    }
  )
}

//a.js 
window.onClick = async function(e){
  let modB = await import('./b.js')
  console.log(modB)
}
//b.js
export var a = 8
export var b = 9

//webpack a.js
//创建一个html文件 把main.js加载进来
<script src="main.js"></script>
//vue 异步组件webpack用法
```

> loader与plugin的区别
>
>  loader用来转换非js文件
>
>  css-loader,eslint-loader,babel-loader,image-loader,file-loader,style-loader 
>
>  根据不同拓展名 转换为js
>
>  plugin 用来增强webpack功能的
>
>   common-chunk-plugin
>
>    将第三方代码与自己写的代码分开打包 第三方代码的打包结果会比较容易不变化
>
>   webpack-html-plugin 
>
>    自动吧打包结果嵌入html文件

> npm run eject 弹出配置文件
>
> HotModuleReplacementPlugin 
>
> 模块热重载 页面不重新加载的情况下 模块的新代码就能在浏览器生效 并不是所有模块都可以这么用 css可以
>
> MiniCssExtractPlugin
>
>  将所有的css文件从依赖树中提取出来，放入单独的css文件而不打包在js里
>
> GenerateSw
>
>  生成 service worker 

> babel 
>
>  js语言高版本到低版本的编译器
>
>  plugin:针对某一个语法的转换用的功能插件
>
>  preset:一系列plugin的集合