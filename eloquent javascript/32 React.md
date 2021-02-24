```javascript
var a =<h1>aaa</h1>
var a = /*#__PURE__*/React.createElement("h1", null, "aaa");
```

```javascript
/* @jsx createElement */ 
var a =
    <h1 id="foo" class="aa bb">
      aaa
      <span>hello</span>
    </h1>

/* @jsx createElement */
var a = createElement("h1", {
  id: "foo",
  class: "aa bb"
}, "aaa", createElement("span", null, "hello"));
```

```javascript
/* @jsx createElement */ 
function createElement(tagName,attrs,...children){
	let node = document.createElement(tagName)
   if(attrs){
	  for(let key in attrs){
      let val = attrs[key]
      node.setAttribute(key,val)
      }
   }
  node.append(...children)
  return node
}
var a =<h1 id="foo" class="aa bb">
      aaa
      <span>hello</span>
    </h1>

<!--创建真实结点-->
/* @jsx createElement */
function createElement(tagName, attrs) {
  var node = document.createElement(tagName);

  if (attrs) {
    for (var key in attrs) {
      var val = attrs[key];
      node.setAttribute(key, val);
    }
  }

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  node.append.apply(node, children);
  return node;
}

var a = createElement("h1", {
  id: "foo",
  class: "aa bb"
}, "aaa", createElement("span", null, "hello"));  
```

```javascript
let d =(
  <main id="wrapper" class="foo bar">
  <ul class="list">
    <li><img src="foo.png" /></li>
    <li><img src="foo.png" /></li>
  </ul>
  </main>
)

var d = /*#__PURE__*/React.createElement("main", {
  id: "wrapper",
  class: "foo bar"
}, /*#__PURE__*/React.createElement("ul", {
  class: "list"
}, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("img", {
  src: "foo.png"
})), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("img", {
  src: "foo.png"
}))));
```

```javascript
obj = {
      a: 1,
      foo() {
        return this.a
      }
    }
obj.foo() //1

b=obj.foo
b() //undefined

class A{
  name = 8
}
a = new A()
//A {name: 8}
class A{
  constructor(){
    this.name = 8
  } 
}
//等价
```

### hello React

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <!-- 虚拟dom -->
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <!-- 虚拟dom 绘制到浏览器 -->


  <!-- Don't use this in production: -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    class ButtonCounter extends React.Component {
      constructor(props) {
        super(props)  //super 有一句 this.props = props
        //可以访问到this.props
        this.state = {
          name: 'xxx',
          age: 18,
          count: props.start || 0,
          step: props.step || 1
        }
        // this.dec = () => {
        //   this.setState({   //setState是从React.Component继承来的
        //     count: this.state.count - 1
        //   })
        // }
        // this.inc = () => {  //箭头函数this 只看在哪里声明 this看外面 是每次构造的新对象
        //   this.setState({
        //     count: this.state.count + 1
        //   })
        // }

      }
      dec = (e) => {
        this.setState({   //setState是从React.Component继承来的
          count: this.state.count - this.state.step
        })
      }
      inc = (e) => {  //箭头函数this 只看在哪里声明 this看外面 是每次构造的新对象
        this.setState({
          count: this.state.count + this.props.step
        })
      }
      render() {
        return (
          <div>
            <button onClick={this.dec}>-</button>
            <span title={this.state.count}>{this.state.count}</span>
            <button onClick={this.inc}>+</button>
          </div>
        )
      }
    }

    ReactDOM.render(
      <ButtonCounter start={2} step={2} />,
      document.getElementById('root')
    );
    //onDoubleClick={}
  </script>
</body>

</html>
```

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    class ButtonCounter extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          showingCategory: 'all',
          editingIdx: -1,
          todos: [{
            content: 'eat',
            completed: true
          }, {
            content: 'drink',
            completed: false
          }, {
            content: 'sleep',
            completed: true
          }]
        }
      }
      setShowingCategory(catetory) {
        this.setState({
          showingCategory: catetory
        })
      }
      isAllCompleted() {
        return this.state.todos.every(todo => todo.completed) && this.state.todos.length
      }
      leftCount() {
        return this.state.todos.filter(it => !it.completed).length
      }
      deleteTodo(todo) {
        let idx = this.state.todos.indexOf(todo)
        this.setState({
          todos: this.state.todos.filter(it => it !== todo)
        })
      }

      getShowingTodos() {
        if (this.state.showingCategory == "all") {
          return this.state.todos
        } else if (this.state.showingCategory == "active") {
          return this.state.todos.filter(todo => !todo.completed)
        } else {
          return this.state.todos.filter(todo => todo.completed)
        }
      }

      hasCompleted() {
        return this.state.todos.some(it => it.completed)
      }
      toggleTodoState(todo) {
        // todo.completed = !todo.completed
        // // this.setState({})
        // this.forceUpdate()
				//setState构建新对象
        this.setState({
          todos: this.state.todos.map(it => {
            if (it == todo) {
              return {
                ...todo,
                completed: !todo.completed
              }
            } else {
              return it
            }
          })
        })
      }
      clearCompleted() {
        this.setState({
          todos: this.state.todos.filter(todo => !todo.completed)
        })
      }
      toggleSelectAll = () => {
        if (this.isAllCompleted()) {
          this.setState({
            todos: this.state.todos.map(it => {
              return {
                ...it,
                completed: false
              }
            })
          })
        } else {
          this.setState({
            todos: this.state.todos.map(it => {
              if (it.completed) {
                return it
              } else {
                return {
                  ...it,
                  completed: true
                }
              }
            })
          })
        }
        // if (this.isAllCompleted()) {
        //   this.state.todos.forEach(it => {
        //     it.completed = false
        //   })
        // } else {
        //   this.state.todos.forEach(it => {
        //     it.completed = true
        //   })
        // }
        // this.setState({}) //刷新数据
      }
      addTodo = (e) => {
        if (e.key == 'Enter') {
          let todoText = e.target.value.trim()
          if (todoText) {
            this.setState({
              todos: [...this.state.todos, { content: todoText, completed: false }]
            })
          }
          e.target.value = ''
        }
      }
      render() {
        return (
          <div>
            <div>
              <input type="checkbox" onChange={this.toggleSelectAll} checked={this.isAllCompleted()} />
              <input type="text" onKeyUp={this.addTodo} />
            </div>
            <ul>
              {
                this.getShowingTodos().map(todo => (
                  <li key={todo.content}>
                    <input type="checkbox" onChange={() => this.toggleTodoState(todo)} checked={todo.completed} />
                    <span>{todo.content}</span>
                    <button onClick={() => this.deleteTodo(todo)}>&times;</button>
                  </li>
                ))
              }
            </ul>
            <div>
              {true}{false}{undefined}{null}{'会被忽略'}
              <span>{this.leftCount()}items left</span>
              <div>
                <label><input type="radio" onChange={() => this.setShowingCategory('all')} checked={this.state.showingCategory == 'all'} />All</label>
                <label><input type="radio" onChange={() => this.setShowingCategory('active')} checked={this.state.showingCategory == 'active'} />Active</label>
                <label><input type="radio" onChange={() => this.setShowingCategory('completed')} checked={this.state.showingCategory == 'completed'} />Completed</label>
              </div>
              {this.hasCompleted() &&
                <button onClick={() => this.clearCompleted()}>Clear completed</button>
              }
            </div>
          </div>
        )
      }
    }

     ReactDOM.render(
      <ButtonCounter start={2} step={2} />,
      document.getElementById('root')
    );
  </script>
</body>

</html>
```

```javascript
var obj = {
  bar: 1,
  baz: {
    baa: 2,
    bad: {
      x: 1
    }
  }
}

obj2 = {
  ...obj,
  baz: {
    ...obj.baz,
    bad: {
      ...obj.baz.bad,
      x: obj.baz.bad.x + 1
    }
  }
}
```

* react double render

* ### `_.throttle(func, [wait=0], [options={}])`

* 创建一个节流函数，在 wait 秒内最多执行 `func` 一次的函数。 该函数提供一个 `cancel` 方法取消延迟的函数调用以及 `flush` 方法立即调用。 可以提供一个 options 对象决定如何调用 `func` 方法， options.leading 与|或 options.trailing 决定 wait 前后如何触发。 `func` 会传入最后一次传入的参数给这个函数。 随后调用的函数返回是最后一次 `func` 调用的结果。

* 节流不能直接写在事件触发那里，每次创建新函数。写在构造函数那里，只运行一次。

* React.Children 处理自定义组件嵌套子元素的情况

```javascript
//多个组件用一个div包起来
ReactDOM.render(
      <div>
        <one></one>
        <two></two>
        <ButtonCounter start={2} step={2} />
      </div>,
      document.getElementById('root')
    );
```

#### 修改复杂对象单个属性

* 结构共享 使用immer unpkg查找

* 坑点：immer 返回的对象是只读的

  `<script src="https://unpkg.com/immer@7.0.8/dist/immer.umd.development.js"></script>`

  ```html
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
      const { produce } = immer
      const { Component } = React
  
      class ButtonCounter extends Component {
        constructor(props) {
          super(props)
          this.state = {
            showingCategory: 'all',
            editingIdx: -1,
            todos: [{
              content: 'eat',
              completed: true
            }, {
              content: 'drink',
              completed: false
            }, {
              content: 'sleep',
              completed: true
            }]
          }
        }
        setShowingCategory(catetory) {
          this.setState({
            showingCategory: catetory
          })
        }
        isAllCompleted() {
          return this.state.todos.every(todo => todo.completed) && this.state.todos.length
        }
        leftCount() {
          return this.state.todos.filter(it => !it.completed).length
        }
        deleteTodo(todo) {
          let idx = this.state.todos.indexOf(todo)
          this.setState({
            todos: this.state.todos.filter(it => it !== todo)
          })
        }
  
        getShowingTodos() {
          if (this.state.showingCategory == "all") {
            return this.state.todos
          } else if (this.state.showingCategory == "active") {
            return this.state.todos.filter(todo => !todo.completed)
          } else {
            return this.state.todos.filter(todo => todo.completed)
          }
        }
  
        hasCompleted() {
          return this.state.todos.some(it => it.completed)
        }
        toggleTodoState(todo) {
          this.setState({
            todos: this.state.todos.map(it => {
              if (it == todo) {
                return {
                  ...todo,
                  completed: !todo.completed
                }
              } else {
                return it
              }
            })
          })
        }
        clearCompleted() {
          this.setState({
            todos: this.state.todos.filter(todo => !todo.completed)
          })
        }
        toggleSelectAll = () => {
          if (this.isAllCompleted()) {
            this.setState(produce(state => {
              state.todos.forEach(it => {
                it.completed = false
              })
            }))
          } else {
            this.setState(produce(state => {
              state.todos.forEach(it => {
                if (!it.completed) {
                  it.completed = true
                }
              })
            }))
          }
        }
        addTodo = (e) => {
          if (e.key == 'Enter') {
            let todoText = e.target.value.trim()
            if (todoText) {
              this.setState(produce(state => {
                state.todos.push({ content: todoText, completed: false })
              }))
            }
            e.target.value = ''
          }
        }
        setEditingIdx(idx) {
          this.setState({ editingIdx: idx }) //setState异步 editBox还没进dom
          setTimeout(() => {
            this.refs.editBox.focus()
          })
        }
        editTodoContent(e, todo) {
          //li 里的key不能用todo.content不然编辑一下 todo.content变了 会重绘整个li
          this.setState(produce(state => {
            //let idx = state.todos.indexOf(todo) //immer下 拿不到todo state是代理对象 不是真state
            let idx = this.state.todos.indexOf(todo) //读原始state
            // state.todos[idx].content = e.target.value.trim()
            // 不用ref写法
            state.todos[idx].content = this.refs.editBox.value.trim()
          }))
        }
        render() {
          return (
            <div>
              <div>
                <input type="checkbox" onChange={this.toggleSelectAll} checked={this.isAllCompleted()} />
                <input type="text" onKeyUp={this.addTodo} />
              </div>
              <ul>
                {
                  this.getShowingTodos().map((todo, idx) => (
                    <li key={idx}>
                      <input type="checkbox" onChange={() => this.toggleTodoState(todo)} checked={todo.completed} />
                      {this.state.editingIdx == idx
                        ? <input ref="editBox" type="text" onChange={(e) => this.editTodoContent(e, todo)} value={todo.content} />
                        : <span onDoubleClick={() => this.setEditingIdx(idx)}>{todo.content}</span>
                      }
                      <button onClick={() => this.deleteTodo(todo)}>&times;</button>
                    </li>
                  ))
                }
              </ul>
              <div>
                {true}{false}{undefined}{null}{'会被忽略'}
                <span>{this.leftCount()}items left</span>
                <div>
                  <label><input type="radio" onChange={() => this.setShowingCategory('all')} checked={this.state.showingCategory == 'all'} />All</label>
                  <label><input type="radio" onChange={() => this.setShowingCategory('active')} checked={this.state.showingCategory == 'active'} />Active</label>
                  <label><input type="radio" onChange={() => this.setShowingCategory('completed')} checked={this.state.showingCategory == 'completed'} />Completed</label>
                </div>
                {this.hasCompleted() &&
                  <button onClick={() => this.clearCompleted()}>Clear completed</button>
                }
              </div>
            </div>
          )
        }
      }
  
      ReactDOM.render(
        <ButtonCounter start={2} step={2} />,
        document.getElementById('root')
      );
    </script>
  </body>
  
  </html>
  ```
* 覆盖setState

  ```javascript
  setState(partialState,cb){
          if(typeof partialState === 'function'){
            return super.setState(produce(partialState),cb)
          }
          super.setState(partialState,cb)
        }
  ```

#### 生命周期方法

`componentDidMount()` 方法会在组件已经被渲染到 DOM 中后运行

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <!-- 虚拟dom -->
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <!-- 虚拟dom 绘制到浏览器 -->


  <!-- Don't use this in production: -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    class Clock extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          date: new Date()
        }
      }
      componentDidMount() {
        this.timerId = setInterval(() => {
          this.tick()
        }, 1000)
      }
      componentWillUnmount() {
        clearInterval(this.timerId)
      }
      tick() {
        this.setState({
          date: new Date()
        })
      }
      render() {
        return (<div>
          <h1>Hello World</h1>
          <h2>It is {this.state.date.toLocaleTimeString()}</h2>
        </div>)
      }
    }
    ReactDOM.render(
      <Clock />,
      document.getElementById('root')
    )
  </script>
</body>

</html>
```

> 1. 当 `<Clock />` 被传给 `ReactDOM.render()`的时候，React 会调用 `Clock` 组件的构造函数。因为 `Clock` 需要显示当前的时间，所以它会用一个包含当前时间的对象来初始化 `this.state`。我们会在之后更新 state。
> 2. 之后 React 会调用组件的 `render()` 方法。这就是 React 确定该在页面上展示什么的方式。然后 React 更新 DOM 来匹配 `Clock` 渲染的输出。
> 3. 当 `Clock` 的输出被插入到 DOM 中后，React 就会调用 `ComponentDidMount()` 生命周期方法。在这个方法中，`Clock` 组件向浏览器请求设置一个计时器来每秒调用一次组件的 `tick()` 方法。
> 4. 浏览器每秒都会调用一次 `tick()` 方法。 在这方法之中，`Clock` 组件会通过调用 `setState()` 来计划进行一次 UI 更新。得益于 `setState()` 的调用，React 能够知道 state 已经改变了，然后会重新调用 `render()` 方法来确定页面上该显示什么。这一次，`render()` 方法中的 `this.state.date` 就不一样了，如此以来就会渲染输出更新过的时间。React 也会相应的更新 DOM。
> 5. 一旦 `Clock` 组件从 DOM 中被移除，React 就会调用 `componentWillUnmount()` 生命周期方法，这样计时器就停止了。

  ```javascript
  class Clock extends React.Component {
        state = {
          time: new Date()
        }
        componentWillUnmount() {
          clearInterval(this.timerId)
        }
        componentDidMount() {
          this.timerId = setInterval(() => {
            this.setState({
              time: new Date()
            })
          }, 1000)
        }
        render() {
          return (
            <div>
              <h1>Hello World</h1>
              <h2>it is{this.state.time.toLocaleString()}</h2>
            </div>
          )
  
        }
      }
      class App extends React.Component {
        state = {
          showClock: true
        }
        toggleClock = () => {
          this.setState({
            showClock: !this.state.showClock
          })
        }
        render() {
          return (
            <div>
              <p onClick={this.toggleClock}>foo</p>
              {this.state.showClock &&
                <Clock />
              }
            </div>
          )
        }
      }
      ReactDOM.render(
        <App />,
        document.getElementById('root')
      )
  ```



* JSX 表示对象  Babel会把JSX 转义为React.createElement()函数的调用  创建出来的对象称为React元素，React通过读取这些对象，使用他们来构建DOM以及保持随时更新。

* 想要将一个 React 元素渲染到根 DOM 节点中，只需把它们一起传入 `ReactDOM.render()`

```javascript
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

*  **组件名称必须以大写字母开头。**

* ### Props 的只读性

#### 正确使用state

*不要直接修改state 而是应该使用setState() 

* state更新可能是异步的

* `this.props` 和 `this.state` 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。

  ```javascript
  this.setState({
    counter: this.state.counter + this.props.increment,
  });
  ```
  
* 要解决这个问题，可以让 `setState()` 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数：

* 改变太多 React拆成一部分一部分渲染 2020-08-28 14  8分左右

  ```javascript
  this.setState((state, props) => ({
    counter: state.counter + props.increment
  }));
  ```
  
  ```javascript
  <div id="root"></div>
    <script type="text/babel">
      class Clock extends React.Component {
        state = {
          time: new Date(),
          count: 0
        }
        componentWillUnmount() {
           clearInterval(this.timerId)
        }
        componentDidMount() {
          //有副作用初始化的地方
           this.timerId = setInterval(() => {
             this.setState({
               time: new Date()
             })
           }, 1000)
        }//这里时间更新是同步的Dom更新也同步
        inc = () => {
          this.setState({
            count: this.state.count + 1
          }) //把对象保存起来 没有立刻合并 count=0 计算后count = 1
          this.setState({
            count: this.state.count + 1
          }) //把对象保存起来 没有立刻合并 count=0  计算后 count = 1
          //构造出来的都是count为1 这里异步 
          console.log(this.state.count)
        }
        render() {
          return (
            <div>
              <h1 onClick={this.inc}>Hello World{this.state.count}</h1>
              <h2>it is{this.state.time.toLocaleString()}</h2>
            </div>
          )
  
        }
      }
      class App extends React.Component {
        state = {
          showClock: true
        }
        toggleClock = () => {
          this.setState({
            showClock: !this.state.showClock
          })
        }
        render() {
          return (
            <div>
              <p onClick={this.toggleClock}>foo</p>
              {this.state.showClock &&
                <Clock />
              }
            </div>
          )
      }
      }
      ReactDOM.render(
        <App />,
        document.getElementById('root')
      )
  ```
  
  ```html
  <!DOCTYPE html>
  <html>
  
  <head>
    <meta charset="UTF-8" />
    <title>Hello World</title>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <!-- 虚拟dom -->
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <!-- 虚拟dom 绘制到浏览器 -->
  
  
    <!-- Don't use this in production: -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  
  <body>
    <div id="root"></div>
    <script type="text/babel">
      class Clock extends React.Component {
        state = {
          time: new Date(),
          count: 0
        }
        componentWillUnmount() {
          clearInterval(this.timerId)
        }
        componentDidMount() {
          this.timerId = setInterval(() => {
            this.setState({
              time: new Date()
            })
          }, 1000)
        }
        inc = () => {
          this.setState(state => {  //传入的是this.state对象
            return {
              count: state.count + 1  //this.state 和 返回的这个对象合到一起成为一个新的对象
            }
          })//还是存起来没有立刻执行
          this.setState(state => {   //这里的state就是合到一起的新的对象 这里的state和this.state已经不是同一个对象了
            return {
              count: state.count + 1
            }
          })                          //所有的setState执行完把新对象state合到this.state上去
          // this.setState(state => ({ //简写 返回对象前面要加() 不然{}会被当成函数体
          //   count: state.count + 1
          // }))
          console.log(this.state.count) //打印出来的是0 显示2
        }
        render() {
          return (
            <div>
              <h1 onClick={this.inc}>Hello World{this.state.count}</h1>
              <h2>it is{this.state.time.toLocaleString()}</h2>
            </div>
          )
  
        }
      }
      class App extends React.Component {
        state = {
          showClock: true
        }
        toggleClock = () => {
          this.setState({
            showClock: !this.state.showClock
          })
        }
        render() {
          return (
            <div>
              <p onClick={this.toggleClock}>foo</p>
              {this.state.showClock &&
                <Clock />
              }
            </div>
          )
        }
      }
      ReactDOM.render(
        <App />,
        document.getElementById('root')
      )
    </script>
  </body>
  
  </html>
  ```
  
* setState函数什么时候是同步，什么时候是异步，为什么呢
  
  > 在事件处理函数里面是异步的，在类似timer环境下是同步的。同步调用setState是异步的，异步调用setState是同步的。
  >
  > 同步调用异步 批量合并效率高  没必要立刻更新dom
  >
  > 异步调用同步 调用栈最底层就是timer 如果不立刻更改dom 退出调用栈没机会更改了

* setState 浅合并

#### 事件处理

* React 事件的命名采用小驼峰式（camelCase），而不是纯小写
* 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串

```javascript
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 此语法确保 `handleClick` 内的 `this` 已被绑定。
    return (
      <button onClick={() => this.handleClick()}>
        Click me
      </button>
    );
  }
}
```

* 此语法问题在于每次渲染 `LoggingButton` 时都会创建不同的回调函数。在大多数情况下，这没什么问题，但如果该回调函数作为 prop 传入子组件时，这些组件可能会进行额外的重新渲染。我们通常建议在构造器中绑定或使用 class fields 语法来避免这类性能问题

* 向事件处理函数传递参数

  ```html
  <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
  <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
  ```

  > 在这两种情况下，React 的事件对象 `e` 会被作为第二个参数传递。如果通过箭头函数的方式，事件对象必须显式的进行传递，而通过 `bind` 的方式，事件对象以及更多的参数将会被隐式的进行传递。

#### 列表&Key

* 用key提取组件

```javascript
function ListItem(props) {
  const value = props.value;
  return (
    // 错误！你不需要在这里指定 key：
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 错误！元素的 key 应该在这里指定：
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

* ### key 只是在兄弟节点之间必须唯一

  > 数组元素中使用的 key 在其兄弟节点之间应该是独一无二的。然而，它们不需要是全局唯一的。当我们生成两个不同的数组时，我们可以使用相同的 key 值.

### 表单

*  受控组件

> 在 React 中，可变状态（mutable state）通常保存在组件的 state 属性中，并且只能通过使用 `setState()`来更新。使 React 的 state 成为“唯一数据源”。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”。

* textarea

  > React中 `<textarea value={} />`  而不同与html中是闭合标签

* select

  ```html
  <select value={this.state.value} onChange={this.handleChange}>
     <option value="grapefruit">葡萄柚</option>
     <option value="lime">酸橙</option>
     <option value="coconut">椰子</option>
     <option value="mango">芒果</option>
  </select>
  ```

  > React并不会使用selected属性，而是在根select标签上使用value属性。

* 总的来说，这使得 `<input type="text">`, `<textarea>` 和 `<select>` 之类的标签都非常相似—它们都接受一个 `value` 属性，你可以使用它来实现受控组件。你可以将数组传递到 `value` 属性中，以支持在 `select` 标签中选择多个选项。

```html
<select multiple={true} value={['B', 'C']}>
```

* 文件input标签

```html
<input type="file" />
```

> 它的value只读，它是React中的一个非受控组件。赋值只能赋值空

* 处理多个输入 添加name属性

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <!-- 虚拟dom -->
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <!-- 虚拟dom 绘制到浏览器 -->


  <!-- Don't use this in production: -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    class App extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          name: 'xxxx',
          isPrime: false,
          selected: 'b'
        }
      }
      setName = (e) => {
        this.setState({
          name: e.target.value
        })
      }
      setIsPrime = (e) => {
        this.setState({
          isPrime: e.target.checked
        })
      }
      setSelected = (e) => {
        this.setState({
          selected: e.target.value
        })
      }
      addTodo = (e) => {
        if (e.key === 'Enter') {
          console.log(e.target.value)
        }
      }
      setXXX = () => {
        this.setState({
          xxx: 'aaaaaaa'
        })
      }
      render() {
        return (
          <div onClick={this.setXXX}>
            div 点击非受控组件变为受控组件 报错
            {this.state.s
              ? <input type="text" />
              : <input type='text' value="foo" />
              //也会报受控非受控的错 可以加另个不同的key 就不会对比 会卸载一个挂载另一个
            }
            <input type="text" value={this.state.xxx} />
            //value 为undefined  也是非受控组件
            <input type="text" onKeyUp={this.addTodo} />
            //没有value 非受控组件
            <input type="text" onChange={this.setName} value={this.state.name} />
            <input type="checkbox" onChange={this.setIsPrime} checked={this.state.isPrime} />
            <select onChange={this.setSelected} value={this.state.selected}>
              <option value="a">aa</option>
              <option value="b">bb</option>
            </select>
          </div>
        )
      }
    }

    class Foo extends React.Component {
      state = {
        name: 'damiao',
        age: 18,
        email: 'miao@qq.com',
        isBig: true,
      }
      setField = e => {
        let target = e.target
        let fieldName = target.name
        let type = target.type

        if (type == 'text') {
          this.setState({
            [fieldName]: target.value
          })
        } else if (type == "checkbox" || type == "radio") {
          this.setState({
            [fieldName]: target.checked
          })
        }
      }
      render() {
        console.log(1)
        return (
          <div>
            <input type="checkbox" onChange={this.setField} name="isBig" checked={this.state.isBig} />
            <input type="text" onChange={this.setField} name='name' value={this.state.name} />
            <input type="text" onChange={this.setField} name='age' value={this.state.age} />
            <input type="text" onChange={this.setField} name='email' value={this.state.email} />
          </div>
        )
      }
    }

    ReactDOM.render(
      <Foo />,
      document.getElementById('root')
    )
  </script>
</body>

</html>
```

> 在受控组件上指定 value 的 prop 会阻止用户更改输入。如果你指定了 `value`，但输入仍可编辑，则可能是你意外地将`value` 设置为 `undefined` 或 `null`。这样就是不受控组件了

### 状态提升

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    function BoilingVerdict(props) {
      if (props.celsius >= 100) {
        return <p>The water would boil</p>
      } else {
        return <p>The water not boil</p>
      }
    }
    class Calculator extends React.Component {
      constructor(props) {
        super(props)
        this.state = { temperature: '' }
      }
      handleChange = (e) => {
        this.setState({ temperature: e.target.value })
      }
      render() {
        const temperature = this.state.temperature
        return (
          <fieldset>
            <legend>Enter temperature in Celsius</legend>
            <input
              value={temperature}
              onChange={this.handleChange} />
            <BoilingVerdict
              celsius={parseFloat(temperature)} />
          </fieldset>
        )
      }
    }
    ReactDOM.render(
      <Calculator />,
      document.getElementById('root')
    )
  </script>
</body>

</html>
```

* 在已有摄氏温度输入框的基础上，我们提供华氏度的输入框，并保持两个输入框的数据同步。
* 先从 `Calculator` 组件中抽离出 `TemperatureInput` 组件，然后为其添加一个新的 `scale` prop，它可以是 `"c"` 或是 `"f"`：

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    const scaleNames = {
      c: 'Celsius',
      f: 'Fahrenheit'
    };

    function toCelsius(fahrenheit) {
      return (fahrenheit - 32) * 5 / 9;
    }

    function toFahrenheit(celsius) {
      return (celsius * 9 / 5) + 32;
    }

    function tryConvert(temperature, convert) {
      const input = parseFloat(temperature);
      if (Number.isNaN(input)) {
        return '';
      }
      const output = convert(input);
      const rounded = Math.round(output * 1000) / 1000;
      return rounded.toString();
    }

    function BoilingVerdict(props) {
      if (props.celsius >= 100) {
        return <p>The water would boil.</p>;
      }
      return <p>The water would not boil.</p>;
    }

    class TemperatureInput extends React.Component {
      handleChange = e => {
        this.props.onTemperatureChange(e.target.value)
        //父组件传递来的方法
      }

      render() {
        const temperature = this.props.temperature;
        const scale = this.props.scale;
        return (
          <fieldset>
            <legend>Enter temperature in {scaleNames[scale]}:</legend>
            <input value={temperature}
              onChange={this.handleChange} />
          </fieldset>
        );
      }
    }

    class Calculator extends React.Component {
      constructor(props) {
        super(props);
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        this.state = { temperature: '', scale: 'c' };
      }

      handleCelsiusChange(temperature) {
        this.setState({ scale: 'c', temperature });
      }

      handleFahrenheitChange(temperature) {
        this.setState({ scale: 'f', temperature });
      }

      render() {
        const scale = this.state.scale;
        const temperature = this.state.temperature;
        const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
        const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

        return (
          <div>
            <TemperatureInput
              scale="c"
              temperature={celsius}
              onTemperatureChange={this.handleCelsiusChange} />
            <TemperatureInput
              scale="f"
              temperature={fahrenheit}
              onTemperatureChange={this.handleFahrenheitChange} />
            <BoilingVerdict
              celsius={parseFloat(celsius)} />
          </div>
        );
      }
    }

    ReactDOM.render(
      <Calculator />,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

