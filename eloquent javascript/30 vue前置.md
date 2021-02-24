#### 打包

```javascript
//dict.js
#!/usr/bin/env node
let { argv } = require('yargs')
console.log(argv)

let dict = {
  'cat': '猫',
  'love': '爱',
  'node': '结点',
}

let word = process.argv[2]
console.log(dict[word])

//npm link
//mydict cat -p 2888 -s -d foobar -f=3300


npm 发布到服务器上
npm init
npm lodash mine  安装依赖

package.json 最后添加字段
"bin":{
"mydict":"./dict.js"
}

xxx.js 文件最上方加
#!/usr/bin/env node

2020-08-21 17
```

### package.json

```javascript
package JSON
main 如口文件 没有就是当前文件夹的index.js 作为如口文件
browser 给浏览器用就写这个字段 可能不需要main了 因为浏览器用不需要require
bin     包提供命令行工具
{ "bin": { "myapp": "./cli,js" } }
man     帮助文档
scripts  { "test": "echo \"Error: no test specified\" && exit 1" }
//npm run xxx 命令  这里的命令会现在当前文件的node_modules 里面找 如果找不到 再去全局找
//其中 npm run start 可以简写为 npm start
//     npm run test  npm test
config  可以存任何东西  可以require到
dependencies 你的项目运行时所依赖其他的包以及版本号
{
  "basic-auth": "^1.0.3" //1.0.4 1.0.5 1.0.6
}
devDependencies  开发的依赖
engines 当前包支持什么样的引擎
private:true 私有库

command line args 
yargs //解析命令行参数
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>

  <style>
    /* 隐藏编辑框 */
    .todo-item input[type="text"] {
      display: none;
    }

    /* 鼠标放上出现x */
    .todo-item button {
      display: none;
    }

    .todo-item:hover button {
      display: inline-block;
    }

    /* checkbox 选择划掉 */
    .todo-item.completed {
      text-decoration: line-through;
    }

    /* 双击隐藏span 显示input text */
    .todo-item.editing span {
      display: none;
    }

    .todo-item.editing input[type="text"] {
      display: inline-block;
    }
  </style>
</head>


<body>
  <div class="wrap">
    <h3>todos</h3>
    <div class="">
      <input type="checkbox" id="toggle-select-all">
      <input type="text" id="todo-input">
    </div>
    <ul id="todo-list">
    </ul>
  </div>

  <script>
    let toggleAllInput = document.querySelector('#toggle-select-all')
    let todoInput = document.querySelector('#todo-input')
    let todoList = document.querySelector('#todo-list')

    todoInput.onkeyup = function (e) {
      if (e.key === 'Enter') {
        let todoText = this.value
        if (todoText.trim() !== '') { //空格不触发
          let li = document.createElement('li')
          li.classList.add('todo-item')

          let checkbox = document.createElement('input')
          checkbox.type = 'checkbox'
          checkbox.onchange = e => {
            if (checkbox.checked) {
              li.classList.add('completed')
            } else {
              li.classList.remove('completed')
            }//勾选下划线
            setSelectAll() //全选勾上 非全选不勾
          }

          let span = document.createElement('span')
          span.textContent = todoText
          //不要写innerhtml 不然todoText写一段
          span.ondblclick = e => {
            li.classList.add('editing')
            editBox.focus() //双击光标过来
            // setTimeout(() => {
            //  editBox.focus()
            // })//以前浏览器要这样 加载前focus 宏任务 渲染后执行
          }//双击编辑

          let editBox = document.createElement('input')
          editBox.type = "text"
          editBox.value = todoText
          editBox.onkeyup = e => {
            if (e.key == 'Enter') {
              span.textContent = editBox.value
              li.classList.remove('editing')
            }
          }//enter 改变span的值  退出编辑状态
          editBox.onblur = e => {
            span.textContent = editBox.value
            li.classList.remove('editing')
          }//光标移开

          let deleteBtn = document.createElement('button')
          deleteBtn.textContent = 'x'

          deleteBtn.onclick = e => {
            todoList.removeChild(li)
          }//li是创建时对应的li

          li.append(checkbox, span, editBox, deleteBtn)

          todoList.append(li)
          setSelectAll() //添加新的之后 肯定不是全选的 要取消toggle的选择
          todoInput.value = ''
        }
      }
    }

    function setSelectAll() {
      if (todoList.querySelectorAll('input:first-child:not(:checked)').length) {
        toggleAllInput.checked = false
      } else {
        toggleAllInput.checked = true
      }
    }
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

  <style>
    .todo-item input[type="text"] {
      display: none;
    }

    .todo-item button {
      display: none;
    }

    .todo-item:hover button {
      display: inline-block;
    }

    .todo-item.completed {
      text-decoration: line-through;
    }

    .todo-item.editing span {
      display: none;
    }

    .todo-item.editing input[type="text"] {
      display: inline-block;
    }

    /* state 一开始是隐藏的 */
    .state {
      display: none;
    }

    /* 利用结构取巧 用css根据todo-list里面是否有元素选择是否显示state 这样todo-list里面空格也不能用 */
    /* #todo-list:empty+.state{
      display: none;
    } */

    /* 计数器count来计数 left-count 计数器名字 计数器有作用域 只在li里面*/
    /* 把作用域扩展到整个body  缺点 伪元素js是读不到的 */
    /* body {
      counter-reset: left-count;
    }

    .todo-item {
      counter-increment: left-count;
    }

    .todo-item.completed {
      counter-increment: none;
    }

    /* 伪元素放前面 */
    /* .left-count::before {
      content: counter(left-count);
    }  */

    ul.completed li:not(.completed) {
      display: none;
    }

    ul.active li.completed {
      display: none;
    }
  </style>
</head>


<body>
  <div class="wrap">
    <h3>todos</h3>
    <div class="">
      <input type="checkbox" id="toggle-select-all">
      <input type="text" id="todo-input">
    </div>

    <ul id="todo-list" class="all"></ul>

    <div class="state">
      <span class="left-count"> items left</span>
      <span id="category-select">
        <label><input type="radio" name="selected" value="all" checked>All</label>
        <label><input type="radio" name="selected" value="active">Active</label>
        <label><input type="radio" name="selected" value="completed">Completed</label>
      </span>
      <button id="clear-completed">Clear completed</button>
    </div>
  </div>

  <script>
    let toggleAllInput = document.querySelector('#toggle-select-all')
    let todoInput = document.querySelector('#todo-input')
    let todoList = document.querySelector('#todo-list')
    let stateWrap = document.querySelector('.state')
    let leftCount = document.querySelector('.left-count')
    let clearCompletedBtn = document.querySelector('#clear-completed')
    let categorySelect = document.querySelector('#category-select')

    categorySelect.onclick = e => {
      if (e.target.matches('input')) {  //检测点击的radio 而不是文字
        todoList.classList.remove('all', 'active', 'completed')
        todoList.classList.add(e.target.value)
      }
    }

    //toggle选择 全选
    toggleAllInput.onclick = e => {
      let completeds = document.querySelectorAll('li.completed')
      if (completeds.length == todoList.children.length) {
        Array.from(todoList.children).forEach(it => {
          it.classList.remove('completed')
          it.firstElementChild.checked = false
        })
      } else {
        Array.from(todoList.children).forEach(it => {
          it.classList.add('completed')
          it.firstElementChild.checked = true
        })
      }
      setSelectAllAndLeftCountClearBtn()
      save()
    }

    todoInput.onkeyup = function (e) {
      if (e.key === 'Enter') {
        let todoText = this.value
        addTodo({
          content: todoText.trim(),
          completed: false,
        })
        save()
      }
    }

    clearCompletedBtn.onclick = e => {
      let tobeDeleted = document.querySelectorAll('.completed')
      tobeDeleted.forEach(it => {
        todoList.removeChild(it)
      })
      setSelectAllAndLeftCountClearBtn() //隐藏自己
    }


    function setSelectAllAndLeftCountClearBtn() {
      let leftLength = todoList.querySelectorAll('input:first-child:not(:checked)').length
      let completedsLength = todoList.querySelectorAll('input:first-child:checked').length
      if (leftLength || todoList.children.length == 0) {
        //取消到没有子元素也取消选择
        toggleAllInput.checked = false
      } else {
        toggleAllInput.checked = true
      }
      leftCount.textContent = leftLength + ' items left'
      if (completedsLength) {
        clearCompletedBtn.style.display = 'inline-block'
      } else {
        clearCompletedBtn.style.display = 'none'
      }
    }

    let todos = JSON.parse(localStorage.todos) || [] //解析不出来给空数组

    todos.forEach(todo => {
      addTodo(todo)
    })

    function addTodo(todo) {
      let todoText = todo.content
      if (todoText.trim() !== '') {
        let li = document.createElement('li')
        li.classList.add('todo-item')
        todo.completed && li.classList.add('completed')

        let checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = todo.completed
        checkbox.onchange = e => {
          if (checkbox.checked) {
            li.classList.add('completed')
          } else {
            li.classList.remove('completed')
          }
          setSelectAllAndLeftCountClearBtn()
          save()
        }

        let span = document.createElement('span')
        span.textContent = todoText
        span.ondblclick = e => {
          li.classList.add('editing')
          editBox.focus()
        }

        let editBox = document.createElement('input')
        editBox.type = "text"
        editBox.value = todoText
        editBox.onkeyup = e => {
          if (e.key == 'Enter') {
            span.textContent = editBox.value
            li.classList.remove('editing')
            save()
          }
        }
        editBox.onblur = e => {
          span.textContent = editBox.value
          li.classList.remove('editing')
          save()
        }

        let deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'x'

        deleteBtn.onclick = e => {
          todoList.removeChild(li)
          setSelectAllAndLeftCountClearBtn() //有可能删除到todoli 全选
          if (todoList.children.length == 0) { //children 是元素结点
            stateWrap.style.display = '' //删除所有todoli 就删除state
          }
          save()
        }

        li.append(checkbox, span, editBox, deleteBtn)

        todoList.append(li)
        stateWrap.style.display = 'block'
        // 添加一个todoli state会显示
        setSelectAllAndLeftCountClearBtn()
        todoInput.value = ''
      }
    }

    function save() {
      let todos = Array.from(todoList.children).map(li => {
        return {
          completed: li.firstElementChild.checked,
          content: li.firstElementChild.nextSibling.textContent,
        }
      })
      localStorage.todos = JSON.stringify(todos)
    }
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
  <style>
    li button {
      display: none;
    }

    li:hover button {
      display: inline-block;
    }

    ul.active li.completed {
      display: none;
    }

    ul.completed li.active {
      display: none;
    }

    .completed {
      text-decoration: line-through;
    }
  </style>
</head>

<body>
  <div id="container"></div>
  <script src="lodash.min.js"></script>
  <script>
    let showingCategoty = "all"
    let editingIdx = -1

    let todos = [{
      content: 'eat',
      completed: true,
    }, {
      content: 'drink',
      completed: false,
    }, {
      content: 'sleep',
      completed: true,
    }, {
      content: 'get up',
      completed: false,
    }]

    container.addEventListener('dblclick', e => {
      if (e.target.matches('li span')) {
        let li = e.target.parentNode
        let ul = li.parentNode
        let idx = Array.from(ul.children).indexOf(li)
        editingIdx = idx
        render()
        let editBox = document.querySelector('.edit-box')
        editBox.focus()
        editBox.selectionStart = editBox.selectionEnd = 9999999
      }
    })

    container.addEventListener('click', e => {
      if (e.target.matches('.clear-completed')) {
        todos = todos.filter(it => !it.completed)
        render()
      }

      if (e.target.matches('.toggle-all-completed')) {
        if (todos.every(it => it.completed)) {
          todos.forEach(it => {
            it.completed = false
          })
        } else {
          todos.forEach(it => {
            it.completed = true
          })
        }
        render()
      }

      if (e.target.matches('.toggle-completed')) {
        let li = e.target.parentNode
        let ul = li.parentNode
        let idx = Array.from(ul.children).indexOf(li)
        todos[idx].completed = !todos[idx].completed
        render()
      }

      if (e.target.matches('.delete')) {
        let li = e.target.parentNode
        let ul = li.parentNode
        let idx = Array.from(ul.children).indexOf(li)
        todos.splice(idx, 1)
        render()
      }

      if (e.target.matches(['input[type="radio"]'])) {
        showingCategoty = e.target.value
        render()
      }
    })

    container.addEventListener('keyup', e => {
      if (e.key == 'Enter' && e.target.matches('.todo-input')) {
        let todoText = e.target.value.trim()
        if (todoText) {
          e.target.value = ""
          todos.push({
            content: todoText,
            completed: false
          })
        }
        render()
        document.querySelector('.todo-input').focus()  //哈哈
      }

      if (e.key == 'Enter' && e.target.matches('.edit-box')) {
        let todoText = e.target.value.trim()
        todos[editingIdx].content = todoText
        editingIdx = -1
        render()
      }
    })

    container.addEventListener('blur', e => {
      if (e.target.matches('.edit-box')) {
        let todoText = e.target.value.trim()
        todos[editingIdx].content = todoText
        editingIdx = -1
        render()
      }
    }, true) //blur事件不会冒泡 改为捕获

    function getPageContent() {
      let html = `
      <h3>todos</h3>
      <div>
        <input type="checkbox" class="toggle-all-completed" ${todos.every(todo => todo.completed) && todos.length ? 'checked' : ''}>
        <input type ="text" class="todo-input">
      </div>
      <ul class="todo-list ${showingCategoty}">
        ${
        todos.map((todo, idx) => {
          return `
            <li class="todo-item ${todo.completed ? 'completed' : 'active'}">
              <input type="checkbox" class="toggle-completed" ${todo.completed ? 'checked' : ''}>
              ${
            editingIdx == idx ?
              `<input type="text" class="edit-box" value="${todo.content}">`
              :
              `<span>${todo.content}</span>`
            }
              <button class="delete">&times;</button>
            </li>
            `
        }).join('\n')
        }
      </ul>
      ${
        todos.length ?
          `<div>
        <span>${todos.filter(it => !it.completed).length}items left</span>
        <div>
          <label><input type="radio" value="all" ${showingCategoty == "all" ? "checked" : ""}>All</label>
          <label><input type="radio" value="active" ${showingCategoty == "active" ? "checked" : ""}>Active</label>
          <label><input type="radio" value="completed" ${showingCategoty == "completed" ? "checked" : ""}>Completed</label>
        </div>
        ${
          todos.some(todo => todo.completed) ?
            `<button class="clear-completed">Clear completed</button>`
            : ''
          }
      </div>`: ''
        }
      `
      return html
    }



    function render() {
      container.innerHTML = getPageContent()
    }

    render()
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
  <style>
    li button {
      display: none;
    }

    li:hover button {
      display: inline-block;
    }

    li.completed span {
      text-decoration: line-through;
    }

    ul.active li.completed {
      display: none;
    }

    ul.completed li.active {
      display: none;
    }
  </style>
</head>

<body>
  <div id="container">
    <h3>todos</h3>
    <div>
      <input type="checkbox" @click="toggleSelectAll()" v-if="todos.length"
        :checked="todos.every(it=>it.completed) && todos.length">
      <input type="text" @keyup="addTodo">
      <!-- 接收事件对象就不要打括号了 -->
    </div>
    <ul :class="showingCategory + ' todo-list'">
      <li v-for="(todo,index) of todos" class="todo-item" :class="todo.completed ? 'completed' : 'active'">
        <!-- v-for循环 todo临时变量 data里的变量这里直接用-->
        <input type="checkbox" @click="todo.completed = !todo.completed" :checked="todo.completed">
        <!-- :checked 不加冒号 等号后面就是字符串 冒号是表达式-->
        <span v-if="editingIdx !== index" @dblclick="setEditIdx(index)">{{ todo.content }}</span>
        <input class="edit-box" v-else @keyup.enter="editTodo(index,$event)" @blur="editTodo(index,$event)" type="text"
          :value="todo.content">
        <!-- 传参 且 传事件对象 -->
        <button @click="deleteTodo(index)">&times;</button>
      </li>
    </ul>
    <div v-show="todos.length">
      <span>{{todos.filter(todo => !todo.completed).length}} items left</span>
      <div>
        <label><input type="radio" @click="showingCategory = 'all'" :checked="showingCategory == `all`"
            value="all">All</label>
        <label><input type="radio" @click="showingCategory = 'active'" :checked="showingCategory == `active`"
            value="active">Active</label>
        <label><input type="radio" @click="showingCategory = 'completed'" :checked="showingCategory == `completed`"
            value="completed">Completed</label>
      </div>
      <button @click="clearCompleted()" v-if="todos.some(it=>it.completed)">Clear completed</button>
      <!-- if表达式为真 标签出现 为假直接没了 v—show为假 还在dom里 是通过css隐藏了 -->
      <!-- <button v-else>兄弟元素中的一个出现</button> -->
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script>
    let app = new Vue({
      el: "#container",
      data: {
        showingCategory: 'all',
        editingIdx: -1,
        todos: localStorage.todos && JSON.parse(localStorage.todos) || [{ //防止json.parse(undefined) 报错
          content: 'eat',
          completed: true
        }, {
          content: 'drink',
          completed: false
        }, {
          content: 'sleep',
          completed: true
        }]
      },
      watch: {
        todos: { //模板自己处理的不用加this.$
          handler: function () {
            localStorage.todos = JSON.stringify(this.$data.todos)
          },
          deep: true,//深层次对象
        }
      },
      methods: {
        addTodo(e) {
          if (e.key == 'Enter') {
            let todoText = e.target.value.trim()
            if (todoText) {
              this.$data.todos.push({
                content: todoText,
                completed: false,
              })
              e.target.value = ''
            }
          }
        },
        deleteTodo(index) {
          this.$data.todos.splice(index, 1)
        },
        editTodo(index, e) {
          this.$data.todos[index].content = e.target.value.trim()
          this.$data.editingIdx = -1
        },
        setEditIdx(index) {
          this.$data.editingIdx = index
          setTimeout(() => {
            let box = document.querySelector('.edit-box')
            console.log(box)
            box && box.focus()
          }); //不然还没有渲染 query不到
        },
        clearCompleted() {
          //this 是new出来的Vue对象
          //this.$data
          //app就是this
          this.$data.todos = this.$data.todos.filter(it => !it.completed)
        },
        toggleSelectAll() {
          if (app.$data.todos.every(it => it.completed)) {
            app.$data.todos.forEach(it => {
              it.completed = false
            })
          } else {
            app.$data.todos.forEach(it => {
              it.completed = true
            })
          }
        }
      }
    })
  </script>
</body>

</html>
```

```vue
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <style>
  </style>
</head>
<div id="container">
  <div>
    <input type="checkbox" :checked="selectAll" @click="selectToggleAll" v-show="todos.length">
    <input type="text" v-model.trim.lazy="todoText" @keyup.enter="addTodo">
  </div>
  <ul>
    <li v-for="(todo,idx) of showingTodos" :key="todo.content"
      :class="[{completed:todo.completed,active:!todo.completed}]">
      <input type="checkbox" v-model="todo.completed">
      <span v-if="selectIdx != idx" @dblclick="selectTodo(idx)">{{todo.content}}</span>
      <input v-else type="text" v-model.lazy="todo.content" @keyup.enter="selectIdx=-1" @blur="selectIdx=-1"
        ref='editBox'>
      <button @click="deleteTodo(todo)">&times;</button>
    </li>
  </ul>
  <div v-show="todos.length">
    <span>{{leftCount}} items left</span>
    <label><input type="radio" value="all" v-model="selectCategory">All</label>
    <label><input type="radio" value="active" v-model="selectCategory">Active</label>
    <label><input type="radio" value="completed" v-model="selectCategory">Completed</label>
  </div>
  <button @click="deleteCompleted" v-show='showClear'>Clear Completed</button>
</div>

<body>
  <script>
    let app = new Vue({
      befoeCreate() {
        debugger
      },
      el: '#container',
      data: {
        todoText: '',
        selectCategory: 'all',
        selectIdx: -1,
        todos: [
          {
            content: 'eat',
            completed: true
          },
          {
            content: 'drink',
            completed: false
          },
          {
            content: 'sleep',
            completed: true
          }
        ]
      },
      computed: {
        showingTodos() {
          return this.todos.filter(todo => this.selectCategory == 'all' ? true : this.selectCategory == "active" ? !todo.completed : todo.completed)
        },
        selectAll: {
          get: function () {
            return this.todos.every(todo => todo.completed) && this.todos.length
          }
        },
        leftCount: {
          get: function () {
            return this.todos.filter(todo => !todo.completed).length
          }
        },
        showClear: {
          get: function () {
            return this.todos.some(todo => todo.completed)
          }
        }
      },
      // watch: {

      // },
      methods: {
        addTodo(e) {
          if (this.todoText) {
            app.todos.push({
              content: this.todoText,
              completed: false
            })
            this.todoText = ''
          }
        },
        deleteTodo(todo) {
          app.todos = app.todos.filter(it => it !== todo)
        },
        selectTodo(idx) {
          app.selectIdx = idx
          setTimeout(() => {
            let editbox = document.querySelector('.edit-box')
            this.$refs.editBox[0].focus()
          })
        },
        selectToggleAll() {
          if (app.todos.every(todo => todo.completed)) {
            app.todos.forEach(todo => todo.completed = false)
          } else {
            app.todos.forEach(todo => todo.completed = true)
          }
        },
        deleteCompleted() {
          app.todos = app.todos.filter(todo => !todo.completed)
        }
      }
    })

  </script>
</body>

</html>
```

