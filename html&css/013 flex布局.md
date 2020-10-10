# flex 布局      

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    div {
      display: flex;
    }

    aside {
      background-color: red;
      height: 200px;
    }

    main {
      background-color: violet;
    }

    section {
      background-color: pink;
    }
  </style>
</head>

<body>
  <div>
    <aside>aaa</aside>
    <main>bbb</main>
    <section>ccc</section>
  </div>
</body>

</html>
```

* 由高度最高的撑起来（不给任何一个高度也是这样），剩下的height是auto，被拉伸到和最高的一样高。 

  ```HTML
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
      div {
        display: flex;
  
      }
  
      aside {
        background-color: red;
        height: 200px;
        width: 100px;
        flex-grow: 3;
        /* 剩余的空间分3+1份，加三份 */
      }
  
      main {
        background-color: violet;
        flex-grow: 1;
        /* 剩余的空间分3+1份，加一份 */
      }
  
      section {
        background-color: pink;
        width: 150px;
      }
    </style>
  </head>
  
  <body>
    <div>
      <aside>aaa </aside>
      <main>bbb</main>
      <section>ccc</section>
    </div>
  </body>
  </html>
  ```

  * flex-grow 的所有值加起来不足1，如0.1，0.2，0.3，剩余空间的0.6倍，按照1:2:3分配。
  
* flex-shrink  默认值是1

  * width与flex-shrink相乘得到收缩系数
  * 没有指定width  有字情况下，先不折行取宽度。
  * 收缩最窄窄不过它里面最长的单词
  * 收缩不够可能是被最长单词顶开了
  * 如果折行了，每一行单独计算收缩

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
      div {
        display: flex;
        height: 400px;
        border: 6px solid #000;
      }
  
      aside {
        background-color: red;
        flex-shrink: 1;
      }
  
      main {
        background-color: violet;
        flex-shrink: 1;
      }
  
      section {
        background-color: pink;
        flex-shrink: 1;
      }
    </style>
  </head>
  
  <body>
    <div>
      <aside>Lorem ipsum dolor sit amet consectetur, adipisicing elit.t saepe cumque nesciunt quiafuga voluptati Iure,
        eum? Deserunt repellendus corporis commodi iure.
      </aside>
      <main>uptatibus ad odit iste, est, praesentium odio. Iure, eum? Deserunt repellendus corporis commo</main>
      <section>ectetur, adipisicing elit. Repellat sit saepe cumque nesciunt quia deleniti fuga voluptatibus ad odit iste,
        est,
        praesentium odio. Iure, eum? Deserunt</section>
    </div>
  </body>
  </html>
  ```

* 设置flex的是flex container ，里面的是flex-item。

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
      * {
        background-color: rgb(0, 0, 0, 0.1);
      }
  
      ul {
        display: flex;
        padding: 0;
        flex-wrap: wrap;
        /* 折行排列 */
        flex-wrap: wrap-reverse;
        /* 向上折行 */
        flex-direction: row;
        /* 默认值是row，水平方向 */
        flex-direction: row-reverse;
        /* 水平方方向排列 */
        flex-direction: column;
        /* 垂直排列 */
        flex-direction: column-reverse;
        /* 垂直反向排列 */
        resize: both;
        /* 允许用户在水平和竖直方向调整元素大小 */
        overflow: hidden;
        list-style-type: none;
  
    
  
      }
  
      li {
        background-color: red;
        width: 50px;
        height: 50px;
        margin: 5px;
      }
    </style>
  </head>
  
  <body>
    <ul>
      <li>01</li>
      <li>02</li>
      <li>03</li>
      <li>04</li>
      <li>05</li>
      <li>06</li>
      <li>07</li>
      <li>08</li>
    </ul>
  </body>
  </html>
  ```
  
  * flex-direction确定主轴方向 flex-wrap确定交叉抽方向。主轴水平，交叉轴默认向下。主轴垂直，交叉轴垂直，交叉轴默认向右。
  
  * flex-flow可以一下写flex-direction和flex-wrap两个属性。

```html
<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
      <style>
        * {
          background-color: rgb(0, 0, 0, 0.1);
        }
    
        ul {
          display: flex;
          padding: 0;
          flex-wrap: wrap;
          height: 400px;
          list-style-type: none;
        }
    
        li {
          background-color: red;
          width: 50px;
          height: 50px;
          margin: 5px;
        }
      </style>
    </head>
    
    <body>
      <ul>
        <li>01</li>
        <li>02</li>
        <li>03</li>
        <li>04</li>
        <li>05</li>
        <li>06</li>
        <li>07</li>
        <li>08</li>
      </ul>
    </body>
    </html> 
```

   ![image-20191216213426600](013%20%E5%9B%9E%E9%A1%BE2.assets/image-20191216213426600.png)

   * flex-grow只能分配主轴剩余空间的大小。

#### justify-content 主轴上空间方式的分配

* 设置元素在主轴方向的摆放方式，设置flex-grow就无意义了。
*  justify-content: flex-start  从行首位置开始摆 
* justify-content: flex-end;   从行尾位置开始摆
* justify-content: space-between;  均匀排列每个元素，首个元素放在起点，末尾元素放在终点。元素个数-1，把空间分配在元素中间。不分配到元素两边，只分配到中间。
* justify-content：space-around 每个元素周围分配相同的空间 首尾前后都是一份，其余两份空间。
* justify-content：space-evenly  均匀排列每个元素，每个元素之间的间隔相等。只有一个元素居中。

#### align-items

* 元素在flex行（虚构的概念）中的定位，不改变空间分配。stretch仅在子元素高度为auto时生效。

* flex-start，flex-end，center，stretch，baseline。

  ```css
  li:nth-child(2){
    height: auto;
  }
  /* align-items stretch */
  ```

  ![image-20191218214458381](013%20flex%E5%B8%83%E5%B1%80.assets/image-20191218214458381.png)
  
#### align-content

* 分配cross axis的额外空间，默认均等分给每一行。

* 取值默认 

#### align-self

* flex子元素自身在cross axis中的摆放。

#### order属性

* 默认为0  值越大 往后排


```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document
  </title>
  <style>
    dd {
      display: inline-block;
      margin-left: 0;
    }

    dd::after {
      content: ',';
    }

    dt+dd {
      margin-left: 4em;
      margin-top: -1.2em;
    }
  </style>
</head>

<body>
  <dl>
    <dt>aaaaaa</dt>
    <dd>bbbbbbb</dd>
    <dd>ccc</dd>
    <dd>dddd</dd>
    <dt>aaaaaa</dt>
    <dd>bbbb</dd>
    <dd>ccc</dd>
    <dd>dddd</dd>
    <dt>aaaaaa</dt>
    <dd>b</dd>
    <dd>ccc</dd>
    <dd>dddd</dd>
  </dl>
</body>
</html>
```

* 此时dt+dd没有上去 因为是基线对齐，行框从上框到下，没有高度不框。

```css
* {
      background-color: rgba(0, 0, 0, 0.1);
    }
    dd {
      display: inline-block;
      margin-left: 0;
      margin-top: -1.2em;
      vertical-align: top;
    }
    dd::after {
      content: ',';
    }
    dt+dd {
      margin-left: 4em;
    }
```

​    ![image-20191216113943600](013%20%E5%9B%9E%E9%A1%BE2.assets/image-20191216113943600.png)          

* 文字上去，高度为0，行框不框,(此时因为有line-height，还是有高度的)匿名文本的行框留下。