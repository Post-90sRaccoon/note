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

  getState(){
    return this.state
  }
  dispatch(action){
    this.state = this.reducer(this.state,action)
    for(let f of this.subscribes){
      f()
    }
    return action
  }
  subscribe(f){
    this.subscribes.push(f)
    return function unsubscribe(){
      this.subscribes = this.subscribes.filter(it=>it!==f)
    }
  }
}
```

#### 实际使用

* store.js

```javascript
import { createStore } from 'redux'
import { produce } from 'immer'

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
  deleteTodo(state, actioin) {

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

export const store = createStore(todoReducer, {
  editingIdx: -1,
  category: 'all',
  todos: [{
    content: 'eat',
    completed: true,
  }, {
    content: 'drink',
    completed: false,
  }]
})

export default store
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

  