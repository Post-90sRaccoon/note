## 深入JSX

* ​	JSX仅仅只是React.createElement(component,props,…children)函数的语法糖

```html
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

> 编译为

```react
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
//回车空格都会取消
```

* 如果没有子节点，你还可以使用自闭合的标签形式
```html
<div className="sidebar" />
```

```react
React.createElement(
  'div',
  {className: 'sidebar'}
)
```

* 单文件组件

```javascript
import React,{Component} from 'react'
import Foo from ./foo.js

export default class Foo extends Component{
  render(){
    // return <div></div>
    return React.createElement('div')
    //<FOO>
    //React.createElement(Foo)
  }
}
//react自定义标签首字母必须大写 原生必须小写 
```

* vue中单文件组件

```vue
<template>
	<div>
  	<div>{{msg}}</div>
  	<Foo></Foo>
	</div>
</template>
<script>
import Foo from './components/Foo.vue'
export default {
  data(){
    return{
      msg:'hello'
    }
  },
  components:{
    Foo,//要局部注册
  }
}
</script>
```

![image-20200906141400491](33%20React2.assets/image-20200906141400491.png)

### 指定React元素类型

> JSX 标签的第一部分指定了 React 元素的类型。大写字母开头的 JSX 标签意味着它们是 React 组件。当你使用 JSX `<Foo />` 表达式时，`Foo` 必须包含在作用域内。

#### React必须在作用域内

```javascript
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

> 如果你不使用 JavaScript 打包工具而是直接通过 `<script>` 标签加载 React，则必须将 `React` 挂载到全局变量中

#### 在JSX类型中使用点语法

> 在一个模块中导出许多React组件时，会非常方便

```javascript
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
  //这里只能写静态表达式 不能写动态
  //<Foo[x+1] /> 是不行的
}
```

#### 在运行时选择类型

```javascript
function Story(props) {
  // 错误！JSX 类型不能是一个表达式。
  return <components[props.storyType] story={props.story} />;
}


//正确实例
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 正确！JSX 类型可以是大写字母开头的变量。
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

### JSX中的Props

```javascript
<MyComponent foo={1 + 2 + 3 + 4} />
```

* `if` 语句以及 `for` 循环不是 JavaScript 表达式，所以不能在 JSX 中直接使用。但是，你可以用在 JSX 以外的代码中

```javascript
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

#### 字符串字面量

```html
<MyComponent message="hello world" />
<MyComponent message={'hello world'} />
<!--等价-->

<!--字符串字面量赋值给 prop 时，它的值是未转义的-->
<MyComponent message="&lt;3" />
<MyComponent message={'<3'} />
<!--等价-->

<!--如果你没给 prop 赋值，它的默认值是 true-->
<MyTextBox autocomplete />
<MyTextBox autocomplete={true} />
```

#### 属性展开

```jsx
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}

//可以选择只保留当前组件需要接收的 props，并使用展开运算符将其他 props 传递下去
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

```javascript
obj = {
a:1,
b:2,
c:3,
d:4,
e:5
}

const {c,...other} = obj
c // 3
other //{a: 1, b: 2, d: 4, e: 5}
```

### JSX中的子元素

> 包含在开始和结束标签之间的 JSX 表达式内容将作为特定属性 `props.children` 传递给外层组件。

#### 字符串字面量

```jsx
<MyComponent>Hello world!</MyComponent>
//此时 props.children 就只是该字符串
//MyComponent 中的 props.children 是一个简单的未转义字符串
```

> JSX 会移除行首尾的空格以及空行。与标签相邻的空行均会被删除，文本字符串之间的新行会被压缩为一个空格

#### javaScript表达式作为子元素

```jsx
//JavaScript 表达式可以被包裹在 {} 中作为子元素
<MyComponent>foo</MyComponent>
<MyComponent>{'foo'}</MyComponent>
```

#### 函数作为子元素

```jsx
// 调用子元素回调 numTimes 次，来重复生成组件
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

#### 布尔类型，Null以及Undefined将会忽略

> 0会被渲染

```jsx
import React,{Component, Children} from 'react'
export default class Foo extends Component{
  constructor(props){
    // props:{
    //   id:'aaa',
    //   className:'bbb',
    //   children: [<div></div>, <span></span>, <button></button>]
    // }
  }
  render(){
    return <div>
      {this.props.children}
    </div>
  }
}

<Foo id="aaa" className="bbb">
  <div></div>
  <span></span>
  <button></button>
</Foo>

Foo.defaultProps={
  name:'Mary' //声明默认属性
}
```

> jsx 中style要写成对象
>
> ` < main style = {{ border: '5px solid violet', margin: '10px' }}></main >`
>
> 坑点：子元素多于一个children是一个数组   子元素是一个children 不是数组 直接指向子元素
>
> React.Children 提供了一组函数 处理的是真正的JSX子元素
>
> React.Children.count(prop.children) 返回组件总数量 传入的函数作为子元素会被忽略 forEach map only toArray



## 协调 reconciliation

> 在某一时间节点调用 React 的 `render()` 方法，会创建一棵由 React 元素组成的树

![image-20210225213056756](33%20React2.assets/image-20210225213056756.png)

### Diffing算法

#### 对比不同类型的元素

> 当根节点为不同类型的元素时，React 会拆卸原有的树并且建立起新的树。
>
> 当拆卸一棵树时，对应的 DOM 节点也会被销毁。组件实例将执行 `componentWillUnmount()` 方法。当建立一棵新的树时，对应的 DOM 节点会被创建以及插入到 DOM 中。组件实例将执行 `componentWillMount()` 方法，紧接着 `componentDidMount()` 方法。所有跟之前的树所关联的 state 也会被销毁。
>
> 在根节点以下的组件也会被卸载，它们的状态会被销毁。

#### 对比同一类型的元素

> React 会保留 DOM 节点，仅比对及更新有改变的属性。
>
> 在处理完当前节点之后，React 继续对子节点进行递归。

#### 对比同类型的组件元素

> 当一个组件更新(接收的props变化)时，组件实例保持不变，这样 state 在跨越不同的渲染时保持一致。React 将更新该组件实例的 props 以跟最新的元素保持一致，并且调用该实例的 `componentWillReceiveProps()`（现在是static getDerivedStateFromProps(props){return {//return 的对象 合并到state上}}） 和 `componentWillUpdate()` 方法。
>
> 下一步，调用 `render()` 方法，diff 算法将在之前的结果以及新的结果中进行递归。

#### 对子节点进行递归

> 在默认条件下，当递归 DOM 节点的子元素时，React 会同时遍历两个子元素的列表；当产生差异时，生成一个 mutation。
>
> 在子元素列表末尾新增元素时，更新开销比较小。比如：

```html
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

> React 会先匹配两个 `<li>first</li>` 对应的树，然后匹配第二个元素 `<li>second</li>` 对应的树，最后插入第三个元素的 `<li>third</li>` 树。
>
> 如果只是简单的将新增元素插入到表头，那么更新开销会比较大,会重建每一个子元素 。

#### Keys

> 当子元素拥有 key 时，React 使用 key 来匹配原有树上的子元素以及最新树上的子元素。这个 key 不需要全局唯一，但在列表中需要保持唯一。
>
> 也可以使用元素在数组中的下标作为 key。这个策略在元素不进行重新排序时比较合适，如果有顺序修改，diff 就会变得慢。

### 权衡

> 请谨记协调算法是一个实现细节。React 可以在每个 action 之后对整个应用进行重新渲染，得到的最终结果也会是一样的。在此情境下，重新渲染表示在所有组件内调用 `render` 方法，这不代表 React 会卸载或装载它们。React 只会基于以上提到的规则来决定如何进行差异的合并。

```jsx
render(){
  return <div>
    <Counter start={this.state.number} />
  </div>
}
render(){
  return <div>
    <Counter start={this.state.number} />
  </div>
}

//state.number变了 复用Counter实例 调用counter生命周期函数 刷新一次ComponentWillUpdate ComponentDidUpdate
//为组件传入新的属性 static getDerivedStateFromProps() 
//结构对上 更新 对不上 卸载

static getDerivedStateFromProps(prpos) { //静态 组件调用而不是组件的实例 访问不到this
  return {
    foo:1
  }
} //由props推导出来的状态
//返回的对象会被合到 state来
```

## Fragments

> React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。

#### 短语法

```jsx
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

#### 带key的Fragment

> 使用显式 `<React.Fragment>` 语法声明的片段可能具有 key。一个使用场景是将一个集合映射到一个 Fragments 数组

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // 没有`key`，React 会发出一个关键警告
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

```jsx
<div id="root"></div>
  <script type="text/babel">
    // function Foo() {
    //   return [
    //     <li>1</li>,
    //     <li>2</li>,
    //     <li>3</li>,
    //   ]
    // }
    function Foo() {
      return <React.Fragment>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </React.Fragment>
    }

    ReactDOM.render(
      <ul><Foo></Foo></ul>,
      document.getElementById('root')
    )
```

#### dom原生 fragment

```javascript
let frag = document.createDocumentFragment()
//表达连续多个并列的元素
frag.append(document.createElement('span'))
frag.append(document.createElement('div'))
frag.append(document.createElement('button'))
```

## 使用PropTypes进行类型检查

```javascript
import PropTypes from 'prop-types';
//官方的包

class Greeting extends React.Component {
  static defaultProps = {
  	start : 2
	}
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // 你可以将属性声明为 JS 原生类型，默认情况下
  // 这些属性都是可选的。
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // 任何可被渲染的元素（包括数字、字符串、元素或数组）
  // (或 Fragment) 也包含这些类型。
  optionalNode: PropTypes.node,

  // 一个 React 元素。
  optionalElement: PropTypes.element,

  // 一个 React 元素类型（即，MyComponent）。
  optionalElementType: PropTypes.elementType,

  // 你也可以声明 prop 为类的实例，这里使用
  // JS 的 instanceof 操作符。
  optionalMessage: PropTypes.instanceOf(Message),

  // 你可以让你的 prop 只能是特定的值，指定它为
  // 枚举类型。
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // 一个对象可以是几种类型中的任意一个类型
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // 可以指定一个数组由某一类型的元素组成
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // 可以指定一个对象由某一类型的值组成
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // 可以指定一个对象由特定的类型值组成
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),
  
  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),   

  // 你可以在任何 PropTypes 属性后面加上 `isRequired` ，确保
  // 这个 prop 没有被提供时，会打印警告信息。
  requiredFunc: PropTypes.func.isRequired,

  // 任意类型的数据
  requiredAny: PropTypes.any.isRequired,

  // 你可以指定一个自定义验证器。它在验证失败时应返回一个 Error 对象。
  // 请不要使用 `console.warn` 或抛出异常，因为这在 `onOfType` 中不会起作用。
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // 你也可以提供一个自定义的 `arrayOf` 或 `objectOf` 验证器。
  // 它应该在验证失败时返回一个 Error 对象。
  // 验证器将验证数组或对象中的每个值。验证器的前两个参数
  // 第一个是数组或对象本身
  // 第二个是他们当前的键。
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### 限制单个元素

* 你可以通过 `PropTypes.element` 来确保传递给组件的 children 中只包含一个元素。

```jsx
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // 这必须只有一个元素，否则控制台会打印警告。
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### 默认Prop值

```jsx
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// 指定 props 的默认值：
Greeting.defaultProps = {
  name: 'Stranger'
};

// 渲染出 "Hello, Stranger"：
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

```jsx
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

## Refs and the DOM

> 管理焦点 文本选择 媒体播放
>
> 强者触发动画
>
> 集成第三方DOM库

```jsx
 class DatePicker extends React.Component {
      componentDidMount() {
        new Pikaday(this.refs.pickerField)  //this.refs指向真实DOM
      }
      //第一种用法 不推荐 实现复杂
      render() {
        return <input ref="pickerField" type="text" /> //返回的一瞬间真实dom还没创建出来 等到真实dom出来后
      }
      //第二种用法
      render() { //这个函数渲染到Dom里调用 el就是div的实例自己 就把dom挂在this.myDiv上了
        return <div ref={el => { this.myDiv = el }}>
          <input ref="pickerField" type="text" />
        </div>
      }
    }

    class Foo {
      constructor() {
        this.refs = {}
      }
      method() {
        console.log(this.refs.myObj)    //期望运行完 这个指向myObj 需要拿到foo实例才能挂上去
      }
      getObj() {
        return {
          x: 1,
          y: 2,
          ref: 'myObj',
          children: {
            pos: 1, value: 3,
            ref: 'myObj2'
          }
        }
      }
    }

    let fo = new Foo()
    let objs = fo.getObj()

    traverse(objs, obj => {
      if (obj.ref) {
        fo.refs[obj.ref] = obj
      }
    })

    function traverse(obj, action) {
      if (typeof obj === 'object') {
        action(obj)
        for (var key in obj) {
          let val = obj[key]
          action(val, action) 
        }
      }
    }
```

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
    class DatePicker extends React.Component {
      state = {
        msg: 'foo',
      }
      setMsg = () => {
        this.setState({
          msg: Math.random().toString()
        })
      }
      render() {
        console.log(this)

        //第一种 实现复杂
        return <div ref="myDiv">
          <input ref="myInput" type="text" />
        </div>

        //第二种
        return <div ref={el => this.myDiv = el}>
          <input ref="myInput" type="text" />
        </div>


        return <div ref={el => {
          console.log('running ref func')
          this.refs.myDiv = el
        }}>
          <input ref="myInput" type="text" />
          <span onClick={this.setMsg}>{this.state.msg}</span>
        </div>
        //创建了太多函数 每次render创建一次新的函数
        //run两次 开发者模式下 确保这个函数是一个纯函数 不管执行多少次都一样
        
       setDivRef = el => {
        console.log('running ref func')
        this.refs.myDiv = el
     	 }
      render(){
        console.log(this)
        return <div ref={this.setDivRef}>
          <input ref="myInput" type="text" />
          <span onClick={this.setMsg}>{this.state.msg}</span>
        </div>
      }//这样每次传入的都是同一个函数
      }
  </script>
</body>

</html>
```

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
    class DatePicker extends React.Component {
      state = {
        msg: 'foo',
      }
      setMsg = () => {
        this.setState({
          msg: Math.random().toString()
        })
      }

      setDivRef = el => {
        console.log('running ref func')
        this.refs.myDiv = el
      }
      //didMount 以后能通过这个表达式拿到这个组件
      render() {
        console.log(this)
        if (this.state.msg > 0.5) {
          console.log(1)
          return <div ref={this.setDivRef}>
            <input ref="myInput" type="text" />
            <span onClick={this.setMsg}>{this.state.msg}</span>
          </div>
        } else {
          console.log(2)
          return <section ref={this.setDivRef}>
            <input ref="myInput" type="text" />
            <span onClick={this.setMsg}>{this.state.msg}</span>
          </section>
        }
      }

    }
    ReactDOM.render(
      <DatePicker />,
      document.getElementById('root')
    )
  </script>
</body>

</html>
```

* 第三种方法

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
    class Foo extends React.Component {
      render() {
        return <div />
      }
    }
    class DatePicker extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          msg: 'foo',
        }
        this.myRef = React.createRef() //创建一个ref对象 {current:null}
      }
      //控制台里 ref= React.createRef ref.foo = 8  ref 没有用
      // Object.isExtensible(ref) false
      // Object.isSealed(ref)  true
      // 被封装了 封闭了 不能添加属性 也不能删除属性
      //Object.isFrozen(ref)  false 没有被冻结

      setMsg = () => {
        console.log(this.myRef.current) //指向foo组件的实例 DatePicker想要拿到Foo里面的div
        this.setState({                 //ref和key作为一个特殊属性 不会以props传入Foo的构造函数
          msg: Math.random().toString() //控制台 React.createElement('div',{ref:'foo'})
        })                              //这样create的element里面是有ref的 这个东西并不是组件实例 是react.element
      }                                 //a = React.createElement('DatePicker',{ref:'foo'})
                                        //相当于<DatePicker ref='foo' />  
   

      render() {
        console.log(this)
        console.log(1)
        return <div>
          <input ref="myInput" type="text" />
          <span onClick={this.setMsg}>{this.state.msg}</span>
          <Foo ref={this.myRef} />
        </div>
      } //React会把实例挂在current上面 ref用在自定义组件指向组件实例 用在原生对象 指向原生dom对象
    }
    ReactDOM.render(
      <DatePicker />, //ref不能在这里用 必须在组件内部用
      document.getElementById('root')
    )
  </script>
</body>

</html>
```

> 为了拿到Foo里的div

```jsx
<Foo ref={this.myRef} /> //变为
<Foo theRef={this.myRef} /> //随便起个属性名


class Foo extends React.Component {
  render() {
    return <div ref={this.props.theRef}/>
  }
}
```
https://zh-hans.reactjs.org/docs/refs-and-the-dom.html

## Ref转发

```jsx
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取 DOM button 的 ref：
// 被forwardRef返回的组件的ref属性不是一个特殊属性 不会指向实例 可以穿到内部 不能接收class 只能是函数
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

## 严格模式

> `StrictMode` 是一个用来突出显示应用程序中潜在问题的工具。与 `Fragment` 一样，`StrictMode` 不会渲染任何可见的 UI。它为其后代元素触发额外的检查和警告。
>
> 严格模式检查仅在开发模式下运行；*它们不会影响生产构建*。

```jsx
import React from 'react';

function ExampleApplication() {
  return (
    <div>
      <Header />
      <React.StrictMode>
        <div>
          <ComponentOne />
          <ComponentTwo />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  );
}
```

> * [识别不安全的生命周期](https://zh-hans.reactjs.org/docs/strict-mode.html#identifying-unsafe-lifecycles)
> * [关于使用过时字符串 ref API 的警告](https://zh-hans.reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)
> * [关于使用废弃的 findDOMNode 方法的警告](https://zh-hans.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
> * [检测意外的副作用](https://zh-hans.reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)
> * [检测过时的 context API](https://zh-hans.reactjs.org/docs/strict-mode.html#detecting-legacy-context-api)

## Web Component

## Render Props

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

    function Foo(props) {
      return <h1>{props.render()}</h1>
    }

    ReactDOM.render(
      <Foo render={() => <div>hello</div>} />,
      document.getElementById('root')
    )
  </script>
</body>

</html>
```

### Render Props解决横切关注点问题

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

    function Repeat(props) {
      let child = []
      for (let i = 0; i < props.times; i++) {
        child.push(props.children(i))
      }
      return <div>{child}</div>
    }

    ReactDOM.render(
      <Repeat times={10}>
        {
          (index) => <div>hello {index}</div>
        }
      </Repeat>,
      document.getElementById('root')
    )
  </script>
</body>

</html>
```

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

    class MouseTracker extends React.Component {
      constructor(prpos) {
        super(prpos)
        this.state = {
          pos: {
            x: 0,
            y: 0,
          }
        }
      }
      updateMousePos = e => {
        this.setState({
          pos: {
            x: e.clientX,
            y: e.clientY,
          }
        })
      }

      componentDidMount() {
        window.addEventListener('mousemove', this.updateMousePos)
      }
      componentWillUnmount() {
        window.removeEventListener('mousemove', this.updateMousePos)
      }
      render() {
        return this.props.render(this.state.pos)
      }
    }



    ReactDOM.render(
      <MouseTracker render={(pos) => <div>hello {pos.x},{pos.y}</div>}></MouseTracker>,
      document.getElementById('root')
    )
  </script>
</body>

</html>
```

## 高阶组件 HOC（文档有例子）

> 用于复用组件逻辑的一种高级技巧

```javascript
const EnhancedComponent = higherOrderComponent(WrappedComponent);
//高阶组件是参数为组件，返回值为新组件的函数
```

### 使用HOC解决横切关注点问题（解耦，只关注一件事）

> HOC 不会修改传入的组件，也不会使用继承来复制其行为。相反，HOC 通过将组件*包装*在容器组件中来*组成*新组件。HOC 是纯函数，没有副作用。

### 不要改变原始组件，使用组合

### 约定：将不相关的 props 传递给被包裹的组件

> HOC 应该透传与自身无关的 props

```jsx
render() {
  // 过滤掉非此 HOC 额外的 props，且不要进行透传
  const { extraProp, ...passThroughProps } = this.props;

  // 将 props 注入到被包装的组件中。
  // 通常为 state 的值或者实例方法。
  const injectedProp = someStateOrInstanceMethod;

  // 将 props 传递给被包装组件
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

```jsx
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);

// connect 是一个函数，它的返回值为另外一个函数。
const enhance = connect(commentListSelector, commentListActions);
// 返回值为 HOC，它会返回已经连接 Redux store 的组件
const ConnectedComment = enhance(CommentList)
```

### 约定：包装显示名称以便轻松调试

### 注意事项

#### 不要在 render 方法中使用 HOC

```jsx
render() {
  // 每次调用 render 函数都会创建一个新的 EnhancedComponent
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // 这将导致子树每次渲染都会进行卸载，和重新挂载的操作！
  return <EnhancedComponent />;
}
```

#### 务必复制静态方法

```jsx
//务必复制静态方法 静态属性
    class Foo extends React.Component {
      static propTypes ={

      }
      static getDerivedStateFromProps() {

      }
    }

    function enhance(Comp) {
       class EnhancesFoo extends React.Component {}
       EnhancesFoo.staticMethod = WrappedCoponent.staticMethod
      	return EnhancesFoo
    }
```

#### Refs不会被传递

```jsx
let EnhancesFoo = enhance(Foo)
    let a = <EnhancesFoo ref={someRef}/> //这么写不行 指向了增强的foo
    let a = <EnhancesFoo fooRef={someRef}/> //高阶组件没办法把ref透传到里面去
```

```jsx
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      const {forwardedRef, ...rest} = this.props;

      // 将自定义的 prop 属性 “forwardedRef” 定义为 ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // 注意 React.forwardRef 回调的第二个参数 “ref”。
  // 我们可以将其作为常规 prop 属性传递给 LogProps，例如 “forwardedRef”
  // 然后它就可以被挂载到被 LogProps 包裹的子组件上。
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
```

```javascript
var a = class{}
a.name //"a"
var a = function(){return class{}}()
a.name //""
```

```javascript
class A{
  static xxx(){}   //A.xxx()
  static yyy = 33  //A.yyy

  a=3  //this.a =3 in constructor

  foo(){ //A.prototype.foo this.foo(  )

  }
}
```

## Portals

> Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案(比如知乎长答案的收起渲染在答案之外)

```jsx
ReactDOM.createPortal(child, container)
```

> 第一个参数（`child`）是任何[可渲染的 React 子元素](https://zh-hans.reactjs.org/docs/react-component.html#render)，例如一个元素，字符串或 fragment。第二个参数（`container`）是一个 DOM 元素。

```jsx
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
    class PortalTest extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          count: 0,
          step: 1
        }
      }
      dec = () => {
        this.setState({
          count: this.state.count - this.state.step
        })
      }
      inc = () => {
        this.setState({
          count: this.state.count + this.state.step
        })
      }
      reset = () => {
        this.setState({
          count: 0
        })
      }
      resetButtonPortal() {
        return ReactDOM.createPortal(<button onClick={this.reset}>Reset</button>, document.body)
      }
      render() {
        return (
          <div>
            <button onClick={this.dec}>-</button>
            <span title={this.state.count}>{this.state.count}</span>
            <button onClick={this.inc}>+</button>
            {this.state.count < 5 &&
              <section onClick={() => console.log('portal button clicked')}>
                {
                  this.resetButtonPortal()
                }
              </section>
            }
          </div>
        )
      }
    }
    //this.resetButtonPortal从虚拟dom来说是section里的子元素 实际上是body的子元素 div被卸载 reset也会在body上被卸载
    //reset button 点击冒泡还是会到section上
    ReactDOM.render(
      <PortalTest />,
      document.getElementById('root')
    );
  </script>
</body>

</html>
```

> 一个 portal 的典型用例是当父组件有 `overflow: hidden` 或 `z-index` 样式时，但你需要子组件能够在视觉上“跳出”其容器。例如，对话框、悬浮卡以及提示框

## 错误边界

> 部分 UI 的 JavaScript 错误不应该导致整个应用崩溃，为了解决这个问题，React 16 引入了一个新的概念 —— 错误边界。
>
> 错误边界是一种 React 组件，这种组件**可以捕获并打印发生在其子组件树任何位置的 JavaScript 错误，并且，它会渲染出备用 UI**，而不是渲染那些崩溃了的子组件树。错误边界在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误。

> 错误边界**无法**捕获以下场景中产生的错误：
>
> * 事件处理（[了解更多](https://zh-hans.reactjs.org/docs/error-boundaries.html#how-about-event-handlers)）
> * 异步代码（例如 `setTimeout` 或 `requestAnimationFrame` 回调函数）
> * 服务端渲染
> * 它自身抛出来的错误（并非它的子组件）

> 如果一个 class 组件中定义了 [`static getDerivedStateFromError()`](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromerror) 或 [`componentDidCatch()`](https://zh-hans.reactjs.org/docs/react-component.html#componentdidcatch) 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。当抛出错误后，请使用 `static getDerivedStateFromError()` 渲染备用 UI ，使用 `componentDidCatch()` 打印错误信息。

```jsx
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
    class ErrorBoundryTest extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          count: 0,
          step: 1
        }
      }
      dec = () => {
        this.setState({
          count: this.state.count - this.state.step
        })
      }
      inc = () => {
        this.setState({
          count: this.state.count + this.state.step
        })
      }
      resetButtonPortal() {
        return ReactDOM.createPortal(<button onClick={this.reset}>Reset</button>, document.body)
      }
      render() {
        return (
          <div>
            <button onClick={this.dec}>-</button>
            <span title={this.state.count}>{this.state.count}</span>
            <button onClick={this.inc}>+</button>
            <Foo />
          </div>
        )
      }
    }

    class Foo extends React.Component {
      state = {
        showNormalContent: true
      }
      componentDidCatch(e) { //错误边界
        console.log(e)
        this.setState({
          showNormalContent: false
        })
      }
      render() {
        if (this.state.showNormalContent) {
          return <div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, totam?</p>
            <Bar />
          </div>
        } else {
          return <div>something error </div>
        }
      }
    }

    class Bar extends React.Component {
      componentDidMount() {
        return aaa
      } 
      render() {
        return <div onClick={this.setMsg}>click will error</div>
      }
    }

    ReactDOM.render(
      <ErrorBoundryTest />,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

### 未捕获错误的新行为

> **任何未被错误边界捕获的错误将会导致整个 React 组件树被卸载。**

## Context  文档

> Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。
>
> Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据
```jsx
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
// 为当前的 theme 创建一个 context（“light”为默认值）。
const ThemeContext = React.createContext('light');
class App extends React.Component {
  render() {
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

#### React.createContext

```javascript
const MyContext = React.createContext(defaultValue);
```

> 创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 context 值。
>
> **只有**当组件所处的树中没有匹配到 Provider 时，其 `defaultValue` 参数才会生效。这有助于在不使用 Provider 包装组件的情况下对组件进行测试。注意：将 `undefined` 传递给 Provider 的 value 时，消费组件的 `defaultValue` 不会生效。

#### Context.Provider

```jsx
<MyContext.Provider value={/* 某个值 */}>
```

> 每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。
>
> Provider 接收一个 `value` 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。
>
> 当 Provider 的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 `shouldComponentUpdate` 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

#### Class.contextType

> 这种方式好 但是只能接收上层的一个provider

```jsx
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* 在组件挂载完成后，使用 MyContext 组件的值来执行一些有副作用的操作 */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* 基于 MyContext 组件的值进行渲染 */
  }
}
MyClass.contextType = MyContext;

class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* 基于这个值进行渲染工作 */
  }
}
```

> 挂载在 class 上的 `contextType` 属性会被重赋值为一个由 [`React.createContext()`](https://zh-hans.reactjs.org/docs/context.html#reactcreatecontext) 创建的 Context 对象。这能让你使用 `this.context` 来消费最近 Context 上的那个值。你可以在任何生命周期中访问到它，包括 render 函数中。

#### Context.Consumer

```jsx
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```

> 一个 React 组件可以订阅 context 的变更，这让你在[函数式组件](https://zh-hans.reactjs.org/docs/components-and-props.html#function-and-class-components)中可以订阅 context。
>
> 这种方法需要一个[函数作为子元素（function as a child）](https://zh-hans.reactjs.org/docs/render-props.html#using-props-other-than-render)。这个函数接收当前的 context 值，并返回一个 React 节点。传递给函数的 `value` 值等等价于组件树上方离这个 context 最近的 Provider 提供的 `value` 值。如果没有对应的 Provider，`value` 参数等同于传递给 `createContext()` 的 `defaultValue`。

#### Context.displayName

> context 对象接受一个名为 `displayName` 的 property，类型为字符串。React DevTools 使用该字符串来确定 context 要显示的内容。

```jsx
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" 在 DevTools 中
<MyContext.Consumer> // "MyDisplayName.Consumer" 在 DevTools 中
```



```jsx
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    div {
      border: 2px solid #000;
      margin: 10px;
      padding: 10px;
    }
  </style>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">

    class Foo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          count: 0,
          step: 1
        }
      }
      yyy = (e) => {
        console.log(1)
      }
      render() {
        return (
          <div>
            <p>Lorem ipsum dolor sit amet.</p>
            <Bar a='aA' b='b' f={this.yyy} />
          </div>
        ) //<Bar><Baz/><Bar/> 这样是foo直接使用baz
      }   //<Bar /> 这样就是不是了Foo不知道Bar里面是什么结构
    }

    class Bar extends React.Component {
      render() {
        return (
          <div>
            <p>i'm Bar Component</p>
            <Baz a={this.props.a} onClick={this.props.f} />
          </div>
        )
      }
    }

    class Baz extends React.Component {
      render() {
        return <div onClick={this.props.onClick}> I'm Baz Component {this.props.a}</div>
      }
    }

    ReactDOM.render(
      <Foo />,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

```jsx
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    div {
      border: 2px solid #000;
      margin: 10px;
      padding: 10px;
    }
  </style>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    let DisableContext = React.createContext()
    //创建一个context对象

    class Foo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          count: 0,
          step: 1
        }
      }
      yyy = (e) => {
        console.log(1)
      }
      render() {
        return (
          <DisableContext.Provider value={this.yyy}>
            <div>
              <p>Lorem ipsum dolor sit amet.</p>
              <Bar a='aA' b='b' f={this.yyy} />
            </div>
          </DisableContext.Provider>
        )
      }
    }

    class Bar extends React.Component {
      render() {
        return (
          <div>
            <p>i'm Bar Component</p>
            <Baz a={this.props.a} onClick={this.props.f} />
          </div>
        )
      }
    }

    class Baz extends React.Component {
      render() {
        return (
          <DisableContext.Consumer>
            {
              value => <div onClick={value}> I'm Baz Component {this.props.a}</div>
            }
          </DisableContext.Consumer>
        )
      }
    }



    const FieldSetDisable = React.createContext()
    FieldSetDisable.displayName = 'FieldSetDisableCtx'
    const ObjCtx = React.createContext()
    ObjCtx.displayName = 'ObjCtx'
    const AryCtx = React.createContext()
    AryCtx.displayName = 'AryCtx'
    class FieldSet extends React.Component {
      render() {
        return (
          <FieldSetDisable.Provider value={this.props.disabled}>
            <Fields>
              <Input />
              <Input />
              <Input />
              <Input2 />
              <Input2 />
              <Input2 />
            </Fields>
          </FieldSetDisable.Provider>
        )
      }
    }
    class Fields extends React.Component {
      render() {
        return <AryCtx.Provider value="ary">
          <div>{this.props.children} </div>
        </AryCtx.Provider>
      }
    }
    class Input extends React.Component {
      render() {
        return (
          <FieldSetDisable.Consumer>
            {
              isDisabled => {
                return <input disabled={isDisabled} />
              }
            }
          </FieldSetDisable.Consumer>
        )
      }
    }

    class Input2 extends React.Component {
      static contextType = FieldSetDisable //Input2.contextType = FieldSetDisable
      render() {
        let isDisabled = this.context
        return <ObjCtx.Consumer>
          {
            obj => {
              return <AryCtx.Consumer>
                {
                  ary => {
                    return <div>
                      <input disabled={isDisabled} />
                      {obj},{ary}
                    </div>
                  }
                }
              </AryCtx.Consumer>
            }
          }
        </ObjCtx.Consumer>
      }
    }
    ReactDOM.render(
      <ObjCtx.Provider value='obj'>
        <FieldSet disabled>
          <div>
            <Fields />
          </div>
        </FieldSet>
      </ObjCtx.Provider>,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

#### 动态Context

> theme-context.js

```javascript
export const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};

export const ThemeContext = React.createContext(
  themes.dark // 默认值
);
```

> themed-button.js

```jsx
import {ThemeContext} from './theme-context';

class ThemedButton extends React.Component {
  render() {
    let props = this.props;
    let theme = this.context;
    return (
      <button
        {...props}
        style={{backgroundColor: theme.background}}
      />
    );
  }
}
ThemedButton.contextType = ThemeContext;

export default ThemedButton;
```

> app.js

```jsx
import {ThemeContext, themes} from './theme-context';
import ThemedButton from './themed-button';

// 一个使用 ThemedButton 的中间组件
function Toolbar(props) {
  return (
    <ThemedButton onClick={props.changeTheme}>
      Change Theme
    </ThemedButton>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themes.light,
    };

    this.toggleTheme = () => {
      this.setState(state => ({
        theme:
          state.theme === themes.dark
            ? themes.light
            : themes.dark,
      }));
    };
  }

  render() {
    // 在 ThemeProvider 内部的 ThemedButton 按钮组件使用 state 中的 theme 值，
    // 而外部的组件使用默认的 theme 值
    return (
      <Page>
        <ThemeContext.Provider value={this.state.theme}>
          <Toolbar changeTheme={this.toggleTheme} />
        </ThemeContext.Provider>
        <Section>
          <ThemedButton />
        </Section>
      </Page>
    );
  }
}

ReactDOM.render(<App />, document.root);
```

#### 在嵌套组件中更新Context

> theme-context.js

```javascript
// 确保传递给 createContext 的默认值数据结构是调用的组件（consumers）所能匹配的！
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {}, //传一个默认值而已
});
```

> theme-toggler-button.js

```jsx
import {ThemeContext} from './theme-context';

function ThemeTogglerButton() {
  // Theme Toggler 按钮不仅仅只获取 theme 值，它也从 context 中获取到一个 toggleTheme 函数
  return (
    <ThemeContext.Consumer>
      {({theme, toggleTheme}) => (
        <button 
          onClick={toggleTheme}
          style={{backgroundColor: theme.background}}>
          Toggle Theme
        </button>
      )}
    </ThemeContext.Consumer>
  );
}

export default ThemeTogglerButton;
```

> app.js

```jsx
import {ThemeContext, themes} from './theme-context';
import ThemeTogglerButton from './theme-toggler-button';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTheme = () => {
      this.setState(state => ({
        theme:
          state.theme === themes.dark
            ? themes.light
            : themes.dark,
      }));
    };

    // State 也包含了更新函数，因此它会被传递进 context provider。
    this.state = {
      theme: themes.light,
      toggleTheme: this.toggleTheme,
    };
  }

  render() {
    // 整个 state 都被传递进 provider
    return (
      <ThemeContext.Provider value={this.state}>
        <Content />
      </ThemeContext.Provider>
    );
  }
}

function Content() {
  return (
    <div>
      <ThemeTogglerButton />
    </div>
  );
}

ReactDOM.render(<App />, document.root);
```

#### 消费多个Context

### 注意事项

> 因为 context 会使用参考标识（reference identity）来决定何时进行渲染，这里可能会有一些陷阱，当 provider 的父组件进行重渲染时，可能会在 consumers 组件中触发意外的渲染。举个例子，当每一次 Provider 重渲染时，以下的代码会重渲染所有下面的 consumers 组件，因为 `value` 属性总是被赋值为新的对象：

```jsx
class App extends React.Component {
  render() {
    return (
      <MyContext.Provider value={{something: 'something'}}> //换一个对象传进来 下层重新渲染
        <Toolbar />
      </MyContext.Provider>
    );
  }
}
```

> 为了防止这种情况，将 value 状态提升到父节点的 state 里：

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {something: 'something'},
    };
  }

  render() {
    return (
      <Provider value={this.state.value}>
        <Toolbar />
      </Provider>
    );
  }
}
```

```jsx
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    div {
      border: 2px solid #000;
      margin: 10px;
      padding: 10px;
    }
  </style>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    class App extends React.Component {
      state = {
        ctx: { something: 'something' }
      }
      setMsg = () => {
        this.setState({
          msg: Math.random()
        })
      }
      render() {
        console.log(this)
        return (
          <MyContext.Provider value={this.state.ctx}>
            <button onClick={this.setMsg}>set msg{this.state.msg}</button>
            <Toolbar />
          </MyContext.Provider>
        )
      }
    } 

    function Toolbar() {
      return (
        <MyContext.Consumer>{
          value => {
            console.log('consumer running', value)
            return <div>{value.something}</div>
          }
        }
        </MyContext.Consumer>
      )
    }

    ReactDOM.render(
      <App />,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

## Optimizing Performance

### 使用生产版本（看文档）

> 当你需要对你的 React 应用进行 benchmark，或者遇到了性能问题，请确保你正在使用压缩后的生产版本。

### 使用Chrome Performance 标签分析组件

1. 临时**禁用所有的 Chrome 扩展，尤其是 React 开发者工具**。他们会严重干扰度量结果！
2. 确保你是在 React 的开发模式下运行应用。
3. 打开 Chrome 开发者工具的 **[Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)** 标签并按下 **Record**。
4. 对你想分析的行为进行复现。尽量在 20 秒内完成以避免 Chrome 卡住。
5. 停止记录。
6. 在 **User Timing** 标签下会显示 React 归类好的事件

win+R   chrome.exe --user-data-dir=c:/foo/bar  //在该路径下创建一个新的实例 不用禁用拓展了

### 避免调停

> 可以通过覆盖生命周期方法 `shouldComponentUpdate` 来进行提速。该方法会在重新渲染前被触发。其默认实现总是返回 `true`，让 React 执行更新：

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

> 如果你知道在什么情况下你的组件不需要更新，你可以在 `shouldComponentUpdate` 中返回 `false` 来跳过整个渲染过程。其包括该组件的 `render` 调用以及之后的操作。
>
> 可以继承 [`React.PureComponent`](https://zh-hans.reactjs.org/docs/react-api.html#reactpurecomponent) 以代替手写 `shouldComponentUpdate()`。它用当前与之前 props 和 state 的浅比较覆写了 `shouldComponentUpdate()` 的实现。

### shouldComponentUpdate的作用

```jsx
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    div {
      border: 2px solid black;
      margin: 5px;
    }
  </style>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    class App extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          msg: 'App',
        }
      }
      setMsg = () => {
        this.setState({
          msg: Math.random().toString()
        })
      }

      render() {
        //顶层组件刷新会导致内部组件Foo 全部刷新
        return (
          <div>
            <p onClick={this.setMsg}>Lorem ipsum dolor sit amet.{this.state.msg}</p>
            <Foo />
            <Foo />
            <Bar />
          </div>
        )
      }
    }

    class Foo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          msg: 'Foo',
        }
      }
      setMsg = () => {
        this.setState({
          msg: Math.random().toString()
        })
      }
      // UNSAFE_componentWillReceiveProps() {
      //   console.log('foo will receive props')
      //   //实际上foo没有接收新属性 不需要刷新
      //   //已经被废弃了
      // }
      static getDerivedStateFromProps(props, state) { //接收两个参数 props和state
        console.log('foo getDerivedStateFromProps')
        //构造时也会调用
        return {}
      }
      shouldComponentUpdate(nextProps, nextState) {
        console.log('foo should component update')
        for (let key in nextProps) {
          if (nextProps[key] !== this.props[key]) {
            return true
          }
        }//浅对比 所以props更新需要setState创建新对象 而不是修改 修改没法在这里做性能优化
        for (let key in nextState) {
          if (nextState[key] !== this.state[key]) {
            return true
          }
        }
        return false
      }
      render() {
        return (
          <div>
            <p onClick={this.setMsg}>Lorem ipsum dolor sit amet.{this.state.msg}</p>
            <Baz />
          </div>
        )
      }
    }

    class Bar extends React.Component {
      constructor(props) {
        super(props)
      }
      render() {
        return (
          <div>
            <p>Lorem ipsum dolor sit amet.</p>
            <Baz />
          </div>
        )
      }
    }

    class Baz extends React.Component {
      constructor(props) {
        super(props)
      }
      render() {
        return (
          <div>
            <p>I'm BAZ</p>
          </div>
        )
      }
    }

    ReactDOM.render(
      <App />,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

```jsx
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    div {
      border: 2px solid black;
      margin: 5px;
    }
  </style>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    class App extends React.PureComponent { //只进行浅比较
      constructor(props) {
        super(props)
        this.state = {
          msg: 'App',
          list: [1, 2, 3],
        }
      }
      setMsg = () => {
        // this.setState({
        //   list: [...this.state.list, Math.random()],
        //   msg: Math.random().toString()
        // })
        this.state.list.push(5)
        this.setState({
          list: this.state.list,
        })
      }

      render() {
        console.log('app render')
        return (
          <div>
            <p onClick={this.setMsg}>Lorem ipsum dolor sit amet.{this.state.list.toString()}</p>
          </div>
        )
      }
    }

    ReactDOM.render(
      <App />,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

## 与第三方库协同

> 使用ref

```jsx
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <link href="https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css" rel="stylesheet" type="text/css" />
  <script src="https://code.jquery.com/jquery-3.1.0.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

  <script src="https://codemirror.net/lib/codemirror.js"></script>
  <link rel="stylesheet" href="https://codemirror.net/lib/codemirror.css">
  <script src="https://codemirror.net/mode/javascript/javascript.js"></script>

  <link rel="stylesheet" href="https://harvesthq.github.io/chosen/chosen.css">
  <script src="https://harvesthq.github.io/chosen/chosen.jquery.js"></script>
  <style>
    #codemirror {
      border: 2px solid black
    }
  </style>
</head>

<body>
  <div id="root"></div>
  <div>
    <select name="" id="">
      <option value="a">aa</option>
      <option value="b">bb</option>
      <option value="c">cc</option>
    </select>
    <!-- $($0).chosen() -->
    <!-- $($0).chosen('destroy') -->
  </div>
  <script type="text/babel">
    class DatePicker extends React.Component {
      inputRef = React.createRef()
      componentDidMount() {
        $(this.inputRef.current).datepicker()
      }
      render() {
        return <input type="text" ref={this.inputRef} />
      }
    }

    class CodeMirrorComp extends React.Component {
      divRef = React.createRef()
      state = {
        title: 'hello codemirror'
      }
      setTitle = () => {
        this.setState({
          title: Math.random().toString()
        })
      }
      componentDidMount() {
        this.editor = CodeMirror(this.divRef.current, {
          lineNumbers: true
        })
        this.editor.setSize(400, 400)
        this.editor.setValue(this.props.value)
        this.editor.on('change', e => {
          this.props.onChange(this.editor.getValue())
        })
      }
      render() {
        console.log(this)
        return <div onDoubleClick={this.setTitle} id="codemirror" title={this.state.title} ref={this.divRef} style={{ width: '500px', height: '500px' }}></div>
      }
      //双击里面输入的内容不刷新 两次都是返回空div 差异只有title属性 改title就好了
      //只看虚拟dom差异 虚拟dom没有差异 就不会改变真实dom
    }

    ReactDOM.render(
      <div>
        <DatePicker />
        <CodeMirrorComp onChange={(content) => console.log(content)} value="console.log(2)" />
      </div>,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

## 函数组件

```jsx
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
    class App extends React.Component {
      state = {
        msg: 'aaa'
      }
      setMsg = () => {
        this.setState({
          msg: Math.random().toString()
        })
      }
      render() {
        console.log('App render')
        return (
          <div>
            <p>Lorem ipsum dolor sit amet.</p>
            <MsgBox title="Dialog" msg={this.state.msg} onOk={this.setMsg} />
          </div>
        )
      }
    }

    function MsgBox(props) {
      console.log('MsgBox render')
      return (
        <div style={{ border: '1px solid red' }}>
          <h3>{props.title}</h3>
          <div onClick={props.onOk}>{props.msg}</div>
        </div>
      )
    }
    const MsgBox2 = ({ title, onOk, msg }) => {
      console.log('MsgBox2 render')
      return (
        <div style={{ border: '1px solid red' }}>
          <h3>{title}</h3>
          <div onClick={onOk}>{msg}</div>
        </div>
      )
    }

    //函数组件不是class，不会被new出来，所以也没有实例，更节省内存
    //以前的时候，由于不是class，也无法添加生命周期函数
    function ButtonCounter(props) {
      console.log(props)
      function handleClick(e) {
        console.log(1)
      }
      return (
        <div>
          <button onClick={handleClick}>Inc</button>
          <ul>
            {props.b.map(it => <li key={it}>{it}</li>)}
          </ul>
        </div>
      )
    }
    ReactDOM.render(
      <div>
        <App />
        <ButtonCounter a="1" b={[1, 2, 3]} />
      </div>,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

## Hook

> *Hook* 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

### 动机

#### 在组件之间复用状态逻辑很难

**Hook 使你在无需修改组件结构的情况下复用状态逻辑。**

#### 复杂组件难以理解

> 组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。每个生命周期常常包含一些不相关的逻辑。例如，组件常常在 `componentDidMount` 和 `componentDidUpdate` 中获取数据。但是，同一个 `componentDidMount` 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 `componentWillUnmount` 中清除。相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致。

**Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）**，而并非强制按照生命周期划分。

#### 难以理解的class

> 必须去理解 JavaScript 中 `this` 的工作方式。还不能忘记绑定事件处理器。这些代码非常冗余。

**Hook 使你在非 class 的情况下可以使用更多的 React 特性。**

> `useEffect` 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API。

### Effect Hook

> 当你调用 `useEffect` 时，就是在告诉 React 在完成对 DOM 的更改后运行你的“副作用”函数。
>
> 副作用函数还可以通过返回一个函数来指定如何“清除”副作用。

```jsx
useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

### Hook使用规则

> 只能在**函数最外层**调用 Hook。不要在循环、条件判断或者子函数中调用。
>
> 只能在 **React 的函数组件**中调用 Hook。不要在其他 JavaScript 函数中调用。（还有一个地方可以调用 Hook —— 就是自定义的 Hook 中，我们稍后会学习到。）

### 自定义hook

> 有时候我们会想要在组件之间重用一些状态逻辑。目前为止，有两种主流方案来解决这个问题：[高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html)和 [render props](https://zh-hans.reactjs.org/docs/render-props.html)。自定义 Hook 可以让你在不增加组件的情况下达到同样的目的。
>
> 每个组件间的 state 是完全独立的。Hook 是一种复用*状态逻辑*的方式，它不复用 state 本身。事实上 Hook 的每次*调用*都有一个完全独立的 state。因此你可以在单个组件中多次调用同一个自定义 Hook。

### 其他Hook

* useContext

* useReducer

## 使用State Hook

> **`调用 useState` 方法的时候做了什么?** 它定义一个 “state 变量”。我们的变量叫 `count`， 但是我们可以叫他任何名字，比如 `banana`。这是一种在函数调用时保存变量的方式 —— `useState` 是一种新方法，它与 class 里面的 `this.state` 提供的功能完全相同。一般来说，在函数退出后变量就会”消失”，而 state 中的变量会被 React 保留。
>
> **`useState` 需要哪些参数？** `useState()` 方法里面唯一的参数就是初始 state。不同于 class 的是，我们可以按照需要使用数字或字符串对其进行赋值，而不一定是对象。在示例中，只需使用数字来记录用户点击次数，所以我们传了 `0` 作为变量的初始 state。（如果我们想要在 state 中存储两个不同的变量，只需调用 `useState()` 两次即可。）
>
> **`useState` 方法的返回值是什么？** 返回值为：当前 state 以及更新 state 的函数。这就是我们写 `const [count, setCount] = useState()` 的原因。这与 class 里面 `this.state.count` 和 `this.setState` 类似，唯一区别就是你需要成对的获取它们。

## 使用Effect Hook

> *Effect Hook* 可以让你在函数组件中执行副作用操作

### 无需清除的effect

> 我们只想**在 React 更新 DOM 之后运行一些额外的代码。**比如发送网络请求，手动变更 DOM，记录日志，这些都是常见的无需清除的操作。
>
> **`useEffect` 做了什么？** 通过使用这个 Hook，你可以告诉 React 组件需要在渲染后执行某些操作。React 会保存你传递的函数（我们将它称之为 “effect”），并且在执行 DOM 更新之后调用它。
>
> **为什么在组件内部调用 `useEffect`？** 将 `useEffect` 放在组件内部让我们可以在 effect 中直接访问 `count` state 变量（或其他 props）。我们不需要特殊的 API 来读取它 —— 它已经保存在函数作用域中。Hook 使用了 JavaScript 的闭包机制。
>
> **`useEffect` 会在每次渲染后都执行吗？** 是的，默认情况下，它在第一次渲染之后*和*每次更新之后都会执行。
>
> 传递给 `useEffect` 的函数在每次渲染中都会有所不同，这是刻意为之的。事实上这正是我们可以在 effect 中获取最新的 `count` 的值，而不用担心其过期的原因。每次我们重新渲染，都会生成*新的* effect，替换掉之前的。

### 需要清除的effect

> 如**订阅外部数据源**。这种情况下，清除工作是非常重要的，可以防止引起内存泄露
>
> 如果你的 effect 返回一个函数，React 将会在执行清除操作时调用它
>
> **React 何时清除 effect？** React 会在组件卸载的时候执行清除操作。正如之前学到的，effect 在每次渲染的时候都会执行。这就是为什么 React *会*在执行当前 effect 之前对上一个 effect 进行清除

#### 使用多个Effect实现关注点分离

#### 通过跳过Effect进行性能优化

> 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（`[]`）

## Hook规则

### 只在最顶层使用Hook

> **不要在循环，条件或嵌套函数中调用 Hook，** 确保总是在你的 React 函数的最顶层调用他们。遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。

### 只在React函数中调用Hook

> 你可以
>
> 在 React 的函数组件中调用 Hook
>
> 在自定义 Hook 中调用其他 Hook

> state 对应哪个 `useState`？答案是 React 靠的是 Hook 调用的顺序。因为我们的示例中，Hook 的调用顺序在每次渲染中都是相同的，所以它能够正常工作：
>
> **这就是为什么 Hook 需要在我们组件的最顶层调用。**如果我们想要有条件地执行一个 effect，可以将判断放到 Hook 的*内部*：

```javascript
useEffect(function persistForm() {
    // 👍 将条件判断放置在 effect 中
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
```

## 自定义Hook

### 提取自定义Hook

> **自定义 Hook 是一个函数，其名称以 “`use`” 开头，函数内部可以调用其他的 Hook。**

### 使用自定义Hook

#### 可以在多个Hook之间传递信息

* 运行机制

  ```jsx
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
      const { useState, Component, createRef, createContext } = React
      //就可以省略React.useState的React
      // import React, { useState, Component, createRef, createContext } from 'react'
      function ButtonCounter(props) {
        console.log('ButtonCounter render')
        let [count, setCount] = useState(0)
        //setCount这个函数与上一次运行时的setCount是同一个值
        //useState是react 16.8 才加入的
        let [msg, setMsg] = useState("hello world")
        console.log('count after render', count)
  
        function dec() {
          setCount(count - 1)
          //setCount ButtonCounter组件重新运行
          //setCount 不能给count赋值 因为setCount无法访问这个变量
          //count只是把值返回了 可以理解为值是在useState里面声明的
          //传入count-1是计算结果 而不是count这个变量
        }
        function inc() {
          setCount(count + 1)
          console.log('count after inc', count) //这里还是之前一行代码的运行 还没重新运行这个组件
        }
        return (
          <div>
            <span onClick={() => setMsg(Math.random().toString())}>{msg}</span>
            <button onClick={dec}>-</button>
            <span>{count}</span>
            <button onClick={inc}>+</button>
          </div>
        )
      }
      ReactDOM.render(
        <ButtonCounter />,
        document.getElementById('root')
      );
  
    </script>
  </body>
  
  </html>
  ```

* useState 与fiberNode 

![image-20200905093112064](33%20React2.assets/image-20200905093112064.png)

* 函数组件实例 `$0.__reactInternalInstance`

* useState即使记录自己的顺序

  ```jsx
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
      const { useState, Component, createRef, createContext } = React
  
      function ButtonCounter(props) {
        if (window.x) {
          var [count, setCount] = useState(0)
          var [msg, setMsg] = useState("hello world") //第二次调用就不会再初始化了
        } else {
          var [msg, setMsg] = useState("hello world")
          var [count, setCount] = useState(0)
        } //只记录state的顺序 不记录把值赋给了谁 window.x = true
        //inc重刷 useState(0) 以为自己是第一个 值为hello world
  
  
        function dec() {
          setCount(count - 1)
        }
        function inc() {
          setCount(count + 1)
        }
        return (
          <div>
            <span onClick={() => setMsg(Math.random().toString())}>{msg}</span>
            <button onClick={dec}>-</button>
            <span>{count}</span>
            <button onClick={inc}>+</button>
          </div>
        )
      }
      ReactDOM.render(
        <div>
          <ButtonCounter />
          <ButtonCounter />
        </div>,
        document.getElementById('root')
      );
  
    </script>
  </body>
  
  </html>
  ```

* useState原理

  组件React调用 知道组件对应的实例是谁 useState就对哪个实例服务就ok

```jsx
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
  <!-- hooks形式的调用原理模拟 -->
  <div id="root"></div>
  <script type="text/babel">
    /* @jsx createElement*/
    let invokeCallstack = []
    let stateMap = new Map()


    function f() {
      let [a, setA] = useState(0)
      window.setA = setA
      console.log('setA', setA)
      invoke(g)
      let [d, setD] = useState(5)
      window.setD = setD
      console.log(a, d)
    }

    function g() {
      let [b, setB] = useState(1)
      let [c, setC] = useState(2)
      window.setB = setB
      window.setC = setC
      console.log('setC', setC)
      console.log(b, c)
    }




    // useState服务于最近的被invoke调用的函数

    function useState(init) {
      let currentFunc = invokeCallstack[invokeCallstack.length - 1]
      //当前服务的函数在栈顶
      let callCount = currentFunc.stateCount
      currentFunc.stateCount++
      if (!stateMap.has(currentFunc)) {
        stateMap.set(currentFunc, [])
      }

      let state = stateMap.get(currentFunc)

      if (!(callCount in state)) { //不存在把初始值写进去
        state[callCount] = init
      }

      return [state[callCount], function (val) {
        state[callCount] = val
        invoke(currentFunc)
      }]
    }

    function invoke(f) {
      invokeCallstack.push(f)
      f.stateCount = 0 
      f()
      invokeCallstack.pop()
    }

    debugger
    invoke(f) //invoke调用f


    // function Test() {
    //   return (
    //     <div>
    //       <span></span>
    //       <button>aaa</button>
    //       <Button />
    //     </div>
    //   )
    // }

    // function Button() {
    //   return <button>hello</button>
    // }

    // renderDOM(
    //   <div>
    //     <Test />
    //   </div>,
    //   document.querySelector('#root')
    // )

    // function useState(init){

    // }

    // function createElement(tagName, attrs = {}, ...children) { //返回真实dom
    //   let node
    //   if (typeof tagName === 'string') {
    //     node = document.createElement(tagName)
    //     node.append(...children)
    //     return node
    //   } else if (typeof tagName === 'function') {
    //     return tagName(attrs, children)
    //   }
    // }



    // function renderDOM(jsx, element) {
    //   element.innerHtml = ""
    //   element.append(jsx)
    // }


  </script>
</body>

</html>
```

* useCallback and useEffect

  ```jsx
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
      const { useState, useCallback, useRef, useContext, useEffect, useReducer,
        Component, createRef, createContext } = React
  
      function ButtonCounter(props) {
        var [msg, setMsg] = useState("hello world")
        var [count, setCount] = useState(0)
        var [imgs, setImgs] = useState(['a.png', 'b.png'])
        //setCount setMsg这样的函数每次重运行 不会重新创建
  
        function dec() { //这些函数重新创建
          setCount(count - 1)
        }
        function inc() {
          setCount(count + 1)
        }
        // function f() {
        //   //setCount 创建新的f 传入Slider 虽然什么也没变 但是Slider内部会重新渲染
        // }
        //<Slider onNext={f} imgs={imgs}></Slider>
  
  
        // let f = useCallback(function () { }, [msg, count]/*deps*/)
        //依赖不变 返回的是上一次的函数
  
        // let f = useCallback(function () {
        //   console.log(count)
        // }, [])
        //依赖没变 传入的还是原来的函数 但是那个函数的作用域也是原来的那个 打印出0
        //闭包陷阱 返回上一个作用域
        let f = useCallback(function () {
          console.log(count)
        }, [count])
        //依赖不一样 返回最新传入的函数
  
  
        useEffect(() => { //DidMount DidUpdate
          console.log('mounted or updated')
        })
        return (
          <div>
            <span onClick={() => setMsg(Math.random().toString())}>{msg}</span>
            <button onClick={dec}>-</button>
            <span onClick={f}>{count}</span>
            <button onClick={inc}>+</button>
          </div>
        )
      }
  
     
      function Clock() {
        let [time, setTime] = useState(new Date())
        setTimeout(() => {
          console.log('setting time...')
          setTime(new Date())
        }, 1000)
        return <div>{time.toLocaleString()}</div>
      }
  
      function Clock2() {
        let [time, setTime] = useState(new Date())
        // useEffect(() => {
        //   setInterval(() => {
        //     console.log(1)
        //   }, 1000)
        // }, []) //[] 是依赖 不传每超出都更新
        useEffect(() => {
          let id = setInterval(() => {
            console.log(1)
          }, 1000)
  
          return () => clearInterval(id) //清除函数
        })
  
        useEffect(() => {
  
        }, [b, c]) //effect副作用可以拆分成多份
        return <div onClick={() => setTime(new Date())}>{time.toLocaleString()}</div>
      }
  
      ReactDOM.render(
        <div>
          <Clock />
          <Clock2 />
          <ButtonCounter />
          <ButtonCounter />
        </div>,
        document.getElementById('root')
      );
  
    </script>
  </body>
  
  </html>
  ```

  * useRef

  ```jsx
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
      const { useState, useCallback, useRef, useContext, useEffect, useReducer,
        Component, createRef, createContext } = React
  
  
      function Clock2() {
        let [time, setTime] = useState(new Date())
        let [msg, setMsg] = useState('hello world')
        const btnRef = useRef(3)
        // console.log(btnRef) 刷新也能返回同一个对象 React.createRef返回新ref
  
        useEffect(() => {
          btnRef.current.style.border = '2px solid red'
        })
  
        useEffect(() => {
          console.log('start timer')
          let id = setInterval(() => {
            console.log(1)
          }, 1000)
  
          return () => {
            console.log('clear timer')
            clearInterval(id)         //清除函数
          }
          //不会立刻清空 下一次运行时发现依赖不一样 不写就是每次都运行清空
        }, [time]) //不写依赖 组件重刷的时候清除函数运行
        					//[] 就只有挂载是运行一次
        //添加依赖time后 更新word timer不变 更新时间变
        return <div>
          <button ref={btnRef} onClick={() => setMsg(msg + '!')}>{msg}</button>
          <span onClick={() => setTime(new Date())}>{time.toLocaleString()}</span>
        </div>
      }
  
      ReactDOM.render(
        <div>
          <Clock2 />
        </div>,
        document.getElementById('root')
      );
  
    </script>
  </body>
  
  </html>
  ```
  * useContext
```jsx
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
      const { useState, useCallback, useRef, useContext, useEffect, useReducer,
        Component, createRef, createContext } = React
  
      let Context1 = React.createContext()
      let Context2 = React.createContext()
      let Context3 = React.createContext()
  
      function App() {
        return (
          <Context1.Provider value={[1, 2, 3]}>
            <Context2.Provider value={['a', 'b', 'c']}>
              <Context3.Provider value={{ x: 1, y: 2 }}>
                <ClassComp1 />
                <FuncComp2 />
              </Context3.Provider>
            </Context2.Provider>
          </Context1.Provider>
        )
      }
  
      function FuncComp2() {
        let ary1 = useContext(Context1)
        let ary2 = useContext(Context2)
        let obj = useContext(Context3)
        return <div>{ary1.join()},{ary2.join()},{JSON.stringify(obj)}</div>
      }
      //只取一个
      // class ClassComp1 extends Component {
      //   static contextType = Context2
      //   render() {
      //     let ary = this.context
      //     return (
      //       <div>{ary.join()}</div>
      //     )
      //   }
      // }
  
      //取两个
      class ClassComp1 extends Component {
        static contextType = Context1
        render() {
          let ary1 = this.context
          return (
            <Context2.Consumer>
              {
                ary => <Context3.Consumer>
                  {
                    obj => {
                      return <div>{ary1.join()},{ary.join()},{JSON.stringify(obj)}</div>
                    }
                  }
                </Context3.Consumer>
              }
            </Context2.Consumer>
          )
        }
      }
  
      ReactDOM.render(
        <div>
          <App />
        </div>,
        document.getElementById('root')
      );
  
    </script>
  </body>
  
  </html>
```

* hooks带来的好处和自定义hooks 

  ```jsx
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
      const { useState, useCallback, useRef, useContext, useEffect, useReducer,
        Component, createRef, createContext } = React
  
      class Foo extends Component {
        state = {
          pos: { x: 0, y: 0 }
        }
  
        componentDidMount() {
          window.addEventListener("mousemove", this.moveHandler = e => {
            this.setState({
              pos: {
                x: e.clientX,
                y: e.clientY,
              }
            })
          })
        }
  
        componentWillUnmount() {
          window.removeEventListener("mousemove", this.moveHandler)
        }
  
        render() {
          return <div>
            <p>Lorem ipsum dolor sit amet.</p>
            <span>{this.state.pos.x},{this.state.pos.y}</span>
          </div>
        }
      }
  
      function useMousePosition() {
        let [pos, setPos] = useState({ x: 0, y: 0 })
        useEffect(() => {
          let moveHandler
          window.addEventListener("mousemove", moveHandler = e => {
            setPos({
              x: e.clientX,
              y: e.clientY,
            })
          })
          return () => {
            window.removeEventListener("mousemove", moveHandler)
          }
        })
        return pos
      }
  
      function useCurrentTime() {
        let [time, setTime] = useState(new Date())
        useEffect(() => {
          let id = setTimeout(() => {
            setTime(new Date())
          }, 1000)
          return () => clearTimeout(id)
          //当没加依赖time是
          //return 不动鼠标可以正常 动鼠标 还没到一秒 就重新渲染 原来的timer就被清了 挂新的上去
        }, [time])
        return time
      }
  
      function Foo2() {
        let pos = useMousePosition()
        let time = useCurrentTime()
  
        return <div>
          <p>Lorem ipsum dolor sit amet.</p>
          <span>{time.toLocaleString()}</span>
          <hr />
          <span>{pos.x},{pos.y}</span>
        </div>
      }
  
  
      function Bar() {
        let pos = useMousePosition() //能感知到自己被那个组件用 useState
        return <div>{JSON.stringify(pos)}</div>
      }
  
      ReactDOM.render(
        <div>
          <Foo2 />
          <Bar />
        </div>,
        document.getElementById('root')
      );
  
    </script>
  </body>
  
  </html>
  ```

## 问题

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">

    class App extends React.Component {
      state = {
        msg: 'hello'
      }
      setMsg = () => {
        this.setState({
          msg: Math.random()
        })
      }
      render() {
        return <div onClick={this.setMsg}>
          {this.state.msg}
          <input ref={el => { debugger; el.focus() }} />
        </div>
      }
      //为什么setMsg后 el为空
      //一般传入 <input ref={el => {this.el=el}} />
      //有可能 第一次this.a = el  第二次this.b =el 
      //取消第一次运行的效果 传空
    }

    ReactDOM.render(
      <div>
        <App />
      </div>,
      document.getElementById('root')
    )
  </script>
</body>

</html>
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">

    class App extends React.Component {
      state = {
        msg: 'hello'
      }
      setMsg = () => {
        this.setState({
          msg: Math.random()
        })
      }
      ref1 = el => {
        debugger
        this.a = el
      }
      ref2 = el => {
        debugger
        this.b = el
      }

      // ref1 = React.createRef() //这个函数实际上就是执行 ref1.current = xxx
      // ref2 = React.createRef()

      //调试createRef 也是一样 会把之前的置空
      // ref1 = { set current(val) { debugger; console.log(val) } }
      // ref2 = { set current(val) { debugger; console.log(val) } }

      render() {
        console.log(this)
        return <div onClick={this.setMsg}>
          {this.state.msg}
          <input ref={this.state.msg.length ? this.ref1 : this.ref2} />
        </div>
      }//number是没有长度length的
      //函数型ref会执行两次 先把上一次置成空
    }

    ReactDOM.render(
      <div>
        <App />
      </div>,
      document.getElementById('root')
    )
  </script>
</body>

</html>
```

#### 在手机上调试

[chrome://inspect/#devices](chrome://inspect/#devices)

### 合成事件

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">

    class App extends React.Component {
      state = {
        msg: 'hello'
      }
      setMsg = (e) => { //并不是真的事件对象 是一个class 包装出来的事件对象 为了解决兼容性
        debugger      //合成事件对象 e是共享的 都是同一个对象 节约内存 用完就会清空
        e.persist()     //保持住 不清空  下一次调用的e就不是这次的了
        console.log(e.type)
        //打印出来了
        setTimeout(() => {
          console.log(e.type)
        })
        debugger
        this.setState({
          msg: Math.random()
        })
        //空的 不能异步调用
      }


      render() {
        console.log(this)
        return <div onClick={this.setMsg}>
          {this.state.msg}
        </div>
      }
    }

    ReactDOM.render(
      <div>
        <App />
      </div>,
      document.getElementById('root')
    )
  </script>
</body>

</html>
```

## 自定义Hook

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
    const { useState, useCallback, useRef, useContext, useEffect, useReducer,
      Component, createRef, createContext } = React

    function useWindowWidth() {
      let [width, setWidth] = useState(window.innerWidth)

      useEffect(() => {
        function handleResize(e) {
          setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)

        return (() => window.removeEventListener('resize', handleResize))
      }, [])

      return width
    }
    function useWindowHeight() {
      let [height, setHeight] = useState(window.innerHeight)

      useEffect(() => {
        function handleResize(e) {
          setHeight(window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        return (() => window.removeEventListener('resize', handleResize))
      }, [])

      return height
    }//set的值和原来一样不会更新

    function useWindowSize() {
      let width = useWindowWidth()
      let height = useWindowHeight()
      return [width, height]
    }

    function useFetch(url) {
      let [isLoading, setIsLoading] = useState(true)
      let [data, setData] = useState(null)

      useEffect(() => {
        setIsLoading(true)
        setData(null)

        fetch(url)
          .then(response => response.json())
          .then(json => {
            setData(json)
            setIsLoading(false)
          })
      }, [url])
      return [data, isLoading]
    }

    function useInput(initText) {
      let [text, setText] = useState(initText)

      let handle = useCallback(
        function handle(e) {
          setText(e.target.value)
        }, []//不需要访问闭包陷阱的变量text 所以没必要每次返回一个新的
      )

      return {
        value: text,
        onChange: handle
      }
    }

    function useLocalStorage() {
      let [data, setData] = useState(null)

      useEffect(() => {
        setData(Object.assign({}, localStorage))
      }, [])

      useEffect(() => {
        function handle(e) {
          setData(Object.assign({}, localStorage))
        }
        window.addEventListener('storage', handle)
        return () => window.addEventListener('storage', handle)
      }, [])
      return data
    }

    function Foo() {
      let [width, height] = useWindowSize()
      let [url, setUrl] = useState('https://xieranmaya.github.io/images/cats/cats.json')
      let [data, isLoading] = useFetch(url)
      let name = useInput('')
      let ls = useLocalStorage()

      console.log(ls)
      return (
        <div>
          <div>{width},{height}</div>
          <input type="text" value={name.value} onChange={name.onChange} />
          <div onClick={() => setUrl("https://api.github.com/repos/xieranmaya/blog")}>{isLoading ? 'loading' : JSON.stringify(data)}</div>
        </div>
      )
    }

    ReactDOM.render(
      <div>
        <Foo />
      </div>,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

### useMemo

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
    const { useState, useCallback, useRef, useContext, useEffect, useReducer,
      Component, createRef, createContext, useMemo } = React

    //useRef实现
    function useRef(val) {
      return useMemo(() => {
        let ref = React.createRef()
        ref.current = val
        return ref
      }, [])
    }

    function useLocalStorage() {
      let ls = useMemo(() => {
        return Object.assign({}, localStorage)
      }, [])
      //依赖不变 不再运行 返回上一次运行结果
      let [data, setData] = useState(ls)

      useEffect(() => {
        function handle(e) {
          setData(Object.assign({}, localStorage))
        }
        window.addEventListener('storage', handle)
        return () => window.addEventListener('storage', handle)
      }, [])
      return data
    }

    function Foo() {
      let ls = useLocalStorage()

      console.log(ls)
      return (
        <div>
        </div>
      )
    }

    ReactDOM.render(
      <div>
        <Foo />
      </div>,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

### useInterval

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
    const { useState, useCallback, useRef, useContext, useEffect, useReducer,
      Component, createRef, createContext, useMemo } = React

    function useWidth() {
      const [width, setWidth] = useState(window.innerWidth)
      useEffect(() => {
        let handler
        window.addEventListener('resize', handler = e => {
          setWidth(window.innerWidth)
        })
        return () => window.removeEventListener('resize', handler)
      }, [])
      return width
    }

    function Foo() {
      const width = useWidth()
      useInterval(() => {
        console.log(width)
      }, 2000)
      return (
        <div>
          width: {width}
        </div>
      )
    }

    function useInterval(f, time) {
      let ref = useRef(f)
      ref.current = f //指向最新传来的函数

      useEffect(() => {
        let id
        if (time != null) {
          id = setInterval(() => {
            ref.current()
            //ref永远是同一个ref
            //箭头函数是旧函数
            //time不变 interval不重新变 还能读到最新的f
          }, time)
          return () => clearTimeout(id)
        }
      }, [time])
    }



    ReactDOM.render(
      <div>
        <Foo />
      </div>,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

### 每分钟准时更新

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
    const { useState, useCallback, useRef, useContext, useEffect, useReducer,
      Component, createRef, createContext, useMemo } = React

    //每分钟更新一次
    function useCurrentTime() {
      let [time, setTime] = useState(new Date())

      useEffect(() => {
        let MIN = 60 * 1000
        let duration = MIN - Date.now() % MIN
        setTimeout(() => {
          setTime(new Date())
        }, duration);
      }, [time])
      return time
    }

    function Foo() {
      const time = useCurrentTime()
      return (
        <div>
          <div>{time.toLocaleString()}</div>
        </div>
      )
    }


    ReactDOM.render(
      <div>
        <Foo />
      </div>,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

### useReducer

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
    const { useState, useCallback, useRef, useContext, useEffect, useReducer,
      Component, createRef, createContext, useMemo } = React

    function reducer(oldState, action) {
      switch (action.type) {
        case 'addCount':
          return {
            count: oldState.count + action.amount
          }
        case 'subCount':
          return {
            count: oldState.count - action.amount
          }
        default:
          return oldState
      }
    }

    function Baz() {
      // const [state, dispatch] = useReducer(reducer, initialArg, init)
      // init惰性初始化 如果传了init 初始值是把initalArg 传给init函数 得到的
      const [state, dispatch] = useMyReducer(reducer, { count: 0 })

      return <div>
        <span>{state.count}</span>
        <button onClick={() => dispatch({ type: 'addCount', amount: 1 })}>add 1</button>
        <button onClick={() => dispatch({ type: 'addCount', amount: 2 })}>add 2</button>
      </div>
    }

    function useMyReducer(reducer, initState) {
      let [state, setState] = useState(initState)
      let ref = useRef()

      ref.current = function (action) {
        setState(reducer(state, action))
      }

      let dispatch = useCallback(function (action) {
        ref.current(action)
      }, [])

      return [state, dispatch]
    }

    // useCallback(f, deps)
    // useMemo(() => f, deps)

    ReactDOM.render(
      <div>
        <Baz />
      </div>,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

## 属性差异

* 2020-09-03  14  23分钟
* npm classNames

### PureComponent 与 Memo

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
    const { useState, useCallback, useRef, useContext, useEffect, useReducer,
      Component, createRef, createContext, useMemo } = React

    function reducer(oldState, action) {
      switch (action.type) {
        case 'addCount':
          return {
            count: oldState.count + action.amount
          }
        case 'subCount':
          return {
            count: oldState.count - action.amount
          }
        default:
          return oldState
      }
    }

    class Baa extends React.PureComponent {
      render() {
        console.log('Baa render')
        return <div>Baa</div>
      }
    }

    //函数组件还是会重新刷
    // function Bab() {
    //   console.log('Bab render')
    //   return <div>Baa</div>
    // }

    //这样就不会重刷
    let Bab = React.memo(function () {
      console.log('Bab render')
      return <div>Baa</div>
    })


    function Baz() {
      const [state, dispatch] = useMyReducer(reducer, { count: 0 })

      return <div>
        <span>{state.count}</span>
        <button onClick={() => dispatch({ type: 'addCount', amount: 1 })}>add 1</button>
        <button onClick={() => dispatch({ type: 'addCount', amount: 2 })}>add 2</button>
        <Baa a="foo" b="bar" />
        <Bab a="foo" b="bar" />
      </div>
    }

    function useMyReducer(reducer, initState) {
      let [state, setState] = useState(initState)
      let ref = useRef()

      ref.current = function (action) {
        setState(reducer(state, action))
      }

      let dispatch = useCallback(function (action) {
        ref.current(action)
      }, [])

      return [state, dispatch]
    }

    // useCallback(f, deps)
    // useMemo(() => f, deps)

    ReactDOM.render(
      <div>
        <Baz />
      </div>,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

### React.children

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
    const { useState, useCallback, useRef, useContext, useEffect, useReducer,
      Component, createRef, createContext, useMemo } = React


    function Baz(props) {
      console.log(props.children)
      return <div>

      </div>
    }


    ReactDOM.render(
      <div>
        <Baz>
          <div>aa</div>
          {2}
          {
            [<a></a>, <b></b>]
          }
        </Baz>
      </div>,
      document.getElementById('root')
    );

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
  <style>
    button.active {
      border: 1px solid red;
    }
  </style>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useCallback, useRef, useContext, useEffect, useReducer,
      Component, createRef, createContext, useMemo } = React

    //只有一个tab children不是数组 map报错

    function Tabs(props) {//props.children === [<Tabs/>,<Tabs/><Tabs/>]
      console.log(props)
      let [currIdx, setCurrIdx] = useState(0)
      let children = useMemo(() => {
        return React.Children.toArray(props.children)
      }, [props.children])
      return <div>
        <div className='tab-header'>
          {
            React.Children.map(props.children, (child, idx) => {
              return <button className={currIdx == idx ? 'active' : ''} onClick={() => setCurrIdx(idx)} key={idx}>{child.props.name}</button>
            })
          }
        </div>
        <div className="tabs-body">
          {children[currIdx]}
        </div>
      </div>
    }

    function Tab(props) {
      console.log(props)
      return (
        <div>
          {props.children}
        </div>
      )
    }

    function Comp(props) {
      console.log('comp props', props)
      return (
        <div>
          {React.Children.map(props.children, child => {
            return React.cloneElement(child, {
              onClick: function () {
                console.log(1)
              }
            })
          })}
        </div>
      )
      // {React.Children.map(props.children, child => {
      //   let ChildType = child.type //type是构造函数
      //   return <ChildType {...child.props} onClick={() => console.log(1)} />
      // })}
    }

    ReactDOM.render(
      <div>
        <Comp>
          <div>hello</div>
        </Comp>
        <Tabs>
          <Tab name="Home">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit facere itaque aliquam, quo quisquam accusantium!</p>
          </Tab>
          <Tab name="Profile">
            <dl>
              <dl>姓名</dl><dd>miao</dd>
              <dl>性别</dl><dd>miaao</dd>
              <dl>年龄</dl><dd>miaao</dd>
            </dl>
          </Tab>
          <Tab name="About">
            <div><a href="https://www.jd.com">jd</a></div>
            <div><a href="https://www.jd.com">jd</a></div>
            <div><a href="https://www.jd.com">jd</a></div>
            <div><a href="https://www.jd.com">jd</a></div>
          </Tab>
          {
            [1, 2, 3].map(it => {
              return <Tab name={it}>{it ** 8}</Tab>
            })
          }
        </Tabs>
      </div>,
      document.getElementById('root')
    );

  </script>
</body>

</html>
```

## Create React APP

`npm i -g create-react-app`

`create-react-app my-first-react-app`

`winpty npm.cmd start` 乱码就这样启动

npm i antd

> 看my-first-react-app

