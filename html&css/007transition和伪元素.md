## transition

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
      background-color: rgba(0, 0, 0, 0.1);
      box-shadow: 0 0 1px red;
    }

    div {
      width: 100px;
      height: 100px;
      position: relative;
      transition: 5s;
      transition-property: all;
      /* 哪些属性要渐变 */
      transition-duration: 2s;
      transition-timing-function: ease;
      /*中间快 两边慢 linear匀速*/
      /* cubic曲线  step(num,start) */
      xtransition-timing-function: steps(5);
      /* 5步 */
      xtransition-timing-function: steps(5, start);
      /* 每一秒开始的时候发生变化 */
      transition-delay: 3s;
      xtransition-delay: -3s;
      /* 直接从动画播放第三秒的位置开始播放 */
      left: 0;
      /* 这里必须写left:0 不然就是auto 没法渐变*/
    }

    div:hover {
      left: 100px;
      width: 200px;
      transition: none;
      background-color: red;
    }

    /*依据选择器优先级 鼠标hover没有缓动 拿下来有缓动*/
  </style>
</head>

<body>
  <div></div>
</body>

</html>
```

* 一次性写

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
      width: 100px;
      height: 100px;
      background-color: red;
      transition-property: width, height;
      transition-duration: 2s, 4s;
      transition-timing-function: ease;
      transition-delay: 2s, 0s;
    }

    div:hover {
      width: 500px;
      height: 500px;
      transition-property: width, height;
      transition-duration: 4s, 2s;
      transition-timing-function: ease;
      transition-delay: 0s, 2s;
    }
  </style>
</head>

<body>
  <div></div>
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
    * {
      background-color: rgba(0, 0, 0, 0.1);
      box-shadow: 0 0 1px red;
    }

    div {
      width: 100px;
      height: 100px;
      transition: width linear 2s 1s, height 2s ease, background-color steps(5) 5s;
      /* 前一个时间是transition-duration 第二个是transition-delay */
    }

    div:hover {
      height: 300px;
      width: 200px;
      background-color: red;
    }
  </style>
</head>

<body>
  <div></div>
</body>

</html>

```

## border 边距

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
      padding: 20px;
    }

    section {
      border: 10px solid;
      border-color: red red aqua aqua;
    }

    main {
      border: 10px solid;
      border-color: aqua aqua red red;
    }

    div {
      border: 3px dashed #000;
      margin: auto;
      max-width: 700px;
      min-width: 400px;
      /* 用max和min 就不写width 否则冲突了 width为auto 计算出来 */
      max-height: 300px;
      overflow: auto;

    }
  </style>
</head>

<body>
  <section>
    <main></main>
  </section>
  <div>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, suscipit culpa ipsam non eos magnam
    exercitationem ipsum, in voluptate unde placeat debitis. Ratione, cupiditate quae? Suscipit, repellat blanditiis!
    Illo, illum?
  </div>
</body>

</html>
```

### width

* 初始值auto 

* 应用于块框(比如定位)和替换元素，不是行内元素

* 百分数是相当于包含块的content-box

### height

* 对于auto和百分数值，父元素必须指定长度。

### border-style

* groove 凸起
* double 双边框
* ridge     凹陷
* inset     左下方不一样
* outset   右下方不一样

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    section {
      border: 5px solid;
      border-color: red red maroon maroon;
    }

    main {
      border: 5px solid;
      border-color: maroon maroon red red;
    }
  </style>
</head>

<body>
  <section>
    <main>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus aliquam similique quos error, distinctio
      explicabo libero aliquid magnam atque et rem dolores? Temporibus explicabo aut numquam quidem, sequi placeat
      aspernatur.</main>
  </section>
</body>

</html>

```

* 按比例缩放

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
        background-color: rgba(0, 0, 0, 0.1);
        box-shadow: 0 0 1px red;
      }
  
      div section {
        padding-bottom: 61.8%;
        /* 高度是宽度的61.8% */
      }
    </style>
  </head>
  
  <body>
    <div>
      <section></section>
    </div>
  </body>
  </html>
  ```

  ### 伪元素

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
        background-color: rgba(0, 0, 0, 0.1);
      }
  
      /* .foo::before {
        content: 'hi';
        优先级高于div::before
      } */
      div {
        position: relative;
      }
  
      div::before {
        content: 'hello';
        background-color: red;
        position: absolute;
        top: 50%;
        /* 相对于最近的定位父元素的高或宽 */
      }
  
      div::after {
        content: 'world';
        position: absolute;
        background-color: olive;
        top: 100%;
        right: 99%;
      }
    </style>
  </head>
  
  <body>
    <div class="foo">foo</div>
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
      label {
        display: inline-block;
        width: 15px;
        height: 15px;
        border: 1px solid black;
      }
  
      input {
        display: none;
      }
  
      input:checked+label::before {
        content: '√ ';
      }
    </style>
  </head>
  
  <body>
    <div>
      <input type="checkbox" name="" id="hehe" value="Check">
      <label for="hehe"></label>
    </div>
  </body>
  
  </html>
  ```

* 伪元素相当于所属元素的第一个和最后一个子元素，所以替换元素一般没有伪元素。通过::before和::after选中
* 通过content属性激活：content属性可以写字符串，可以写attr(href)使其取父元素的属性值。
* 伪元素选择器与普通选择器不需要对比优先级，因为选中的一定不是相同的元素。伪元素无法交互，如hover，只能在父元素发生css交互时切换对应伪元素的样式。

```css
a::after{
      content: attr(title);
      display: inline-block;
    }
```

 