## less

* Use with Node.js:`npm install -g less`,` lessc styles.less styles.css`。
* Use  with browser:`<link rel="stylesheet/less" type="text/css" href="styles.less" />`,`<script src="https://cdnjs.cloudflare.com/ajax/libs/less.js/3.9.0/less.min.js" ></script>`。 

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style type="text/less">
    div{
      width: 100px;
      height: 200px;
      border: 5px solid red;
      a{
        text-decoration: none;
      }
    }
  </style>
</head>

<body>
  <div>
    <a href="">foo</a>
  </div>
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/less.js/3.9.0/less.min.js"></script>
</html>
```

```less
   @width:100px;
   div{
      width: 200px-@width;
      >a{
        text-decoration: none;
        >img{
          width: 100px;
        }
      }
      :hover{
        width: 100px;
      }
      &:hover{
        height: 100px;
      }
      +.foo{
        font-display: swap;
      }
    }
```

```css
div {
  width: 100px;
}
div > a {
  text-decoration: none;
}
div > a > img {
  width: 100px;
}
div :hover {
  width: 100px;
}
div:hover {
  height: 100px;
}
div + .foo {
  font-display: swap;
}
```

## 列表

* list-style-type：可以为每一个li指定不同样式
* list-style-position inside|outside 前面的点会进来

#### 引号

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <style>
    div {
      quotes: '<''>''['']''('')'"'""'"'"''"';
      /* 单引号包双引号 双引号包单引号 */
    }

    div::before {
      content: open-quote;
    }

    div::after {
      content: close-quote;
    }

    span::before {
      content: open-quote;
    }

    span::after {
      content: close-quote;
    }

    em::before {
      content: open-quote;
    }

    em::after {
      content: close-quote;
    }
  </style>
  <title>Document</title>
</head>

<body>
  <div>
    Lorem ipsum dolor sit, amet consectetur <span> adipisicing <em>elit</em>. Nobis eveniet</span> iusto sunt eligendi
    modi facilis maxime omnis accusamus possimus fuga doloribus et, aliquid suscipit iste dignissimos! Fuga dolorum
    dolor deserunt.
  </div>
</body>

</html>
```

* 小说样式的

  ```CSS
     p::before{
       content: open-quote;
       font-size:50px;
       /*把引号变大*/
     }
     p::after{
       content: close-quote;
     }
     p:not(:last-child)::after{
       content: no-close-quote;
     }
  ```

  

#### 计数器  

````html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    body {
      counter-reset: allp 20;
      /* 重置为20 默认重置为0 */
      /* 为了让span在div外面使用 body影响allp */
    }

    p {
      counter-increment: para -1 allp 2;
      /* 计数器的名字para */
      /* 每次加负一 每次加二 默认每次加一*/

    }

    p::before {
      content: counter(para) ".";
    }

    h1 {
      counter-reset: para;
    }

    em::after {
      content: counter(allp);
    }
  </style>
</head>

<body>
  <div>
    <h1>第一章</h1>
    <p>Lorem ipsum dolor sit amet.</p>
    <p>Totam unde accusantium quaerat in?</p>
    <p>Praesentium quaerat harum dignissimos pariatur!</p>
    <p>Sapiente vel nisi adipisci quaerat.</p>
    <p>Corporis aut ipsum amet necessitatibus!</p>
    <h1>第二章</h1>
    <p>Lorem ipsum dolor sit amet.</p>
    <p>Totam unde accusantium quaerat in?</p>
    <p>Praesentium quaerat harum dignissimos pariatur!</p>
  </div>
  <span>本文共<em></em>个段落</span>
  <!-- 计数器是有作用域的 取决于哪些元素影响它 所有影响它的元素的外层的包裹元素就是他的作用域-->
</body>

</html>
````

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    [name="d"]:checked {
      counter-increment: bin 1;
    }

    [name="c"]:checked {
      counter-increment: bin 2;
    }

    [name="b"]:checked {
      counter-increment: bin 4;
    }

    [name="a"]:checked {
      counter-increment: bin 8;
    }

    div span::before {
      content: counter(bin);
    }
  </style>
</head>

<body>
  <div>
    <input type="checkbox" name="a" id="">
    <input type="checkbox" name="b" id="">
    <input type="checkbox" name="c" id="">
    <input type="checkbox" name="d" id="">
    <span></span>
  </div>
</body>

</html>
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    body {
      counter-reset: allp para;
    }

    p {
      counter-increment: para allp;
    }

    p::before {
      content: counter(chapter, cjk-ideographic) "."counter(para)".";
    }

    h1 {
      counter-reset: para;
      counter-increment: chapter;
    }

    em::after {
      content: counter(allp);
    }
  </style>
</head>

<body>
  <div>
    <h1>第一章</h1>
    <p>Lorem ipsum dolor sit amet.</p>
    <p>Totam unde accusantium quaerat in?</p>
    <p>Praesentium quaerat harum dignissimos pariatur!</p>
    <p>Sapiente vel nisi adipisci quaerat.</p>
    <p>Corporis aut ipsum amet necessitatibus!</p>
    <h1>第二章</h1>
    <p>Lorem ipsum dolor sit amet.</p>
    <p>Totam unde accusantium quaerat in?</p>
    <p>Praesentium quaerat harum dignissimos pariatur!</p>
  </div>
  <span>本文共<em></em>个段落</span>
</body>

</html>
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    /* ul {
      list-style: none;
    }

     ul li {
      counter-increment: a;
    }

    ul li::before {
      content: counter(a)'. ';
    }

    ul li li {
      counter-increment: b;
    }

    ul li li::before {
      content: counter(a)'. 'counter(b)'. ';
    }

    ul li li li {
      counter-increment: c;
    }

    ul li li li::before {
      content: counter(a)'. 'counter(b)'. 'counter(c)'. ';
    } */
    ul {
      list-style: none;
      counter-reset: a;
    }

    li {
      counter-increment: a;
    }

    li::before {
      content: counters(a, '.')'. ';
      /* 每一层的a.拼起来 最后加上.  */
    }
  </style>
</head>

<body>
  <ul>
    <li>a
      <ul>
        <li>a
          <ul>
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>04</li>
            <li>05</li>
          </ul>
        </li>
        <li>a
          <ul>
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>04</li>
            <li>05</li>
          </ul>
        </li>
        <li>a
          <ul>
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>04</li>
            <li>05</li>
          </ul>
        </li>
      </ul>
    </li>
    <li>a
      <ul>
        <li>a
          <ul>
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>04</li>
            <li>05</li>
          </ul>
        </li>
        <li>a
          <ul>
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>04</li>
            <li>05</li>
          </ul>
        </li>
        <li>a
          <ul>
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>04</li>
            <li>05</li>
          </ul>
        </li>
      </ul>
    </li>
    <li>a
      <ul>
        <li>a
          <ul>
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>04</li>
            <li>05</li>
          </ul>
        </li>
        <li>a
          <ul>
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>04</li>
            <li>05</li>
          </ul>
        </li>
        <li>a
          <ul>
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>04</li>
            <li>05</li>
          </ul>
        </li>
      </ul>
    </li>
    <li>a
      <ul>
        <li>a
          <ul>
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>04</li>
            <li>05</li>
          </ul>
        </li>
        <li>a
          <ul>
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>04</li>
            <li>05</li>
          </ul>
        </li>
        <li>a
          <ul>
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>04</li>
            <li>05</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</body>

</html>
```

### 用户界面样式

* 跟随当前系统字体和颜色

```css
input{
  outline:none;
  /*光标方式外面轮廓不显示*/
}
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    span {
      outline: 2px solid red;
      outline-width: 5px;
      /* 轮廓不能更改位置 */
    }

    div {
      outline: 8px solid blue;
      border-radius: 50%;
      border: 5px solid #000;
    }
  </style>
</head>

<body>
  <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. <span> Omnis provident atque maiores quam et. Recusandae
      commodi aspernatur placeat ex. Temporibus</span> quia doloremque eaque sunt eos cum enim, similique est pariatur.
  </div>
</body>

</html>
```

### 非屏幕媒体

* 打印时可以横向

```css
h1 {
      page-break-before: always;
      /* 遇见h1之前换页 */
      /* left是偶数页 */
    }

    /* pre code套入一段代码   */
    pre {
      page-break-inside: avoid;
    }
    /* 尽量不分行 */
```

#### 回流与重绘 relayout repaint

* 减少回流与重绘

#### ie hack

#### 条件注释