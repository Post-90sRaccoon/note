#### 指定单个 box-shadow 的用法：

* 给出两个、三个或四个数字值的情况。
  * 如果只给出两个值, 这两个值将被浏览器解释为x轴上的偏移量和y轴上的偏移量 。
  * 如果给出了第三个值, 这第三个值将被解释为模糊半径的大小 。
  * 如果给出了第四个值, 这第四个值将被解释为扩展半径的大小 。
* 可选， 插页(阴影向内) `inset`。
* 可选， 颜色值 `color`。

##### 参数：

* 设置水平偏移量，如果是负值则阴影位于元素左边。 

* 设置垂直偏移量，如果是负值则阴影位于元素上面。如果两者都是0，那么阴影位于元素后面。

* 模糊半径值越大，模糊面积越大，阴影就越大越淡。 不能为负值。默认为0，此时阴影边缘锐利。

* 扩展半径取正值时，阴影扩大；取负值时，阴影收缩。默认为0，此时阴影与元素同样大。如果没有指定，则由浏览器决定——通常是color的值，不过目前Safari取透明。

* 使用 inset 后，阴影在边框内（即使是透明边框），背景之上内容之下。

```css
.shadow {
      width: 40px;
      height: 40px;
      margin: 100px auto;
      border: 2px solid #000;
      box-shadow: 50px 50px 0px 0px #00ff00;
    }
```

![image-20191212141211783](012%20box-shadow.assets/image-20191212141211783.png)

* 模糊半径不影响阴影大小

```css
.shadow1 {
      width: 40px;
      height: 40px;
      margin: 100px auto;
      border: 2px solid #000;
      box-shadow: 50px 50px 10px 0px #00ff00;
    }
```

![image-20191212142605999](012%20box-shadow.assets/image-20191212142605999.png)

* 扩展半径

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
      .shadow {
        width: 40px;
        height: 40px;
        margin: 100px auto;
        border: 2px solid orange;
        box-shadow: 60px 60px 0 10px #00ff00;
      }
  
      .shadow1 {
        width: 40px;
        height: 40px;
        margin: 100px auto;
        border: 2px solid orange;
        box-shadow: 60px 60px 0 -10px #00ff00;
      }    
    </style>
  </head>
  
  <body>
    <div class="shadow"></div>
    <div class="shadow1"></div>
  </body>
  
  </html>
  ```

  * 先x，y水平移动，再扩展       40+10+10+2+2       40-10-10+2+2

![image-20191213074822621](012%20box-shadow.assets/image-20191213074822621.png) 

### media queries 

```html
  <link rel="stylesheet" href="" media='logic media and (expression)'>
  <!-- logic:not media screen print-->
  @import url('file') logic media and (expression)
  @media logic media and (expression) {rules}
```

### 选择器

```css
p:only-of-type{}
p:onlu-child{}

:checked{}
:diabled{}
:enabled{}

::first-line{}
::first-letter{}
```

```css
div{
  pointer-events:none;
    /*点穿下面的元素*/
}
```

####  字体

```css
@font-face{
  font-family:FontName;
  font-weight:bold;
  font-variant:small-caps;
  src:local('fontname'),url('/path/filename.otf')format('opentype');
}
```

> google fonts 复制字体
>
> 只用几个字可以 缩小至这些字 加快在线字体加载 font-subset
>
> 字蛛网 

#### FoUC Flash of Unstyled Content

> 解决方案把首屏样式放在页面的style里 把link标签页放在页面上方 不要把他们import

```css
p{
  font-size-adjust:0.5;
    /*x字符的高度一定会渲染成font-size的0.5倍*/
   font-stretch:condensed
     /*字体的胖瘦*/
}
```

* 张鑫旭 font-face

#### 字体图标

```css
 @font-face {
      font-family: MyFont;
      src: url(my-font.woff2);
    }

    .icon {
      font-family: MyFont;
    }

    .icon-star::before {
      content: '\f001';
    }
    .icon-qq::before {
      content: '\f002';
    }
```

> fontawesome.com
>
> icomoon.io
>
> iconfont

```css
   .fa-fw {
      /* 等宽图标 */
      width: 1.3em;
      /* 为了应对font-size改变 */
      display: inline-block;
      /* 为了让宽度生效 */
    } 
```

>  图标方案对比：
>
>  css sprite
>
>  彩色
>
>  不好维护
>
> 
>
>  icon font
>
>  单个图标单色 有了emoji后可以为彩色
>
>  矢量图 无限放大不降低质量
>
>  一个字体图标包含非常多图标，体积很小
>
>  字体文件不好维护

#### css3文本排版属性

* text-shadow
* text-overflow  clip ellipsis省略号

```css
div {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* 文字超出显示省略号 必须三个属性连用 */
  }
```

* overflow-wrap:normal|break-world 长单词折行
* hyphens ：manual（html出现\&shy;才折行）auto  none    自动的在指定lang=才生效 连字符

#### resize element

``` 
p{
  resize:both; /*vertical horizontal*/
  overflow:hidden
    /*必须一起用*/
}
```

#### 多列布局

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    div {
      border: 1px solid #000;
      column-count: 3;
      /* 三列 最多三列 */
      xcolumn-width: 100px;
      /* 列的宽度 最小宽度*/
      xcolumn-fill: auto;
      /* 先填满第一列 */
      xcolumn-fill: balance;
      xcolumn-gap: 10px;
      /* 两列间隙 */
      column-rule: 2px solid red;
      /* 每列一条线 */
    }

    span {
      break-inside: avoid-column;
      /* 块级元素不折断 */
      display: block;
      border: 1px solid #000;
    }

    h1 {
      column-span: all;
      /* 跨越所有行 */
      text-align: center;
    }
  </style>
</head>

<body>
  <div>
    <h1>hello</h1>
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis aliquid laborum libero non! Voluptas illum
    excepturi<h1>world</h1> tempore iusto eligendi ut, dolore commodi id veniam perferendis velit animi perspiciatis
    nulla inventore!
  </div>
</body>

</html>
```

* dl列表特殊布局 2019-12-16 10-22-01

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      * {
        background-color: rgba(0, 0, 0, 0.1);
      }
  
      dd {
        display: inline-block;
        margin-left: 0;
        vertical-align: top;
        margin-top: -21px;
      }
  
      dd::after {
        content: ','
      }
  
      dt+dd {
        margin-left: 55px;
      }
  
      dt {
        width: 50px;
        text-align: right;
      }
  
      dt:not(:first-child) {
        margin-top: -21px;
        /* dd的匿名文本上移21px  不然行之间有匿名文本的行高*/
      }
  
      dt::after {
        content: ':';
      }
  
      dl::after {
        /* 去掉最后一行行高 */
        content: 'x';
        font-size: 0;
        display: block;
        margin-top: -21px;
        height: 0;
      }
    </style>
  </head>
  
  <body>
    <dl>
      <dt>6666</dt>
      <dd>haha</dd>
      <dd>haha</dd>
      <dd>haha</dd>
      <dt>66</dt>
      <dd>haha</dd>
      <dd>haha</dd>
      <dd>haha</dd>
      <dt>6</dt>
      <dd>haha</dd>
      <dd>haha</dd>
      <dd>haha</dd>
    </dl>
  </body>
  
  </html>
  ```

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      * {
        background-color: rgba(0, 0, 0, 0.1);
      }
  
      dt {
        float: left;
        width: 50px;
        text-align: right;
        clear: both;
        height: 21px;
        /* 多一个像素 视觉上看不出来 但是只能第二行有效*/
      }
  
      dd {
        display: inline;
        margin-left: 0;
        float: left;
        margin-right: 5px;
      }
    </style>
  </head>
  
  <body>
    <dl>
      <dt>6666</dt>
      <dd>haha</dd>
      <dd>haha</dd>
      <dd>h范德萨</dd>
      <dt>66</dt>
      <dd>haha</dd>
      <dd>haha</dd>
      <dd>haha</dd>
      <dt>6</dt>
      <dd>haha</dd>
      <dd>haha</dd>
      <dd>haha</dd>
    </dl>
  </body>
  
  </html>
  ```

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      * {
        background-color: rgba(0, 0, 0, 0.1);
      }
  
      dl {
        padding-left: 50px;
      }
  
      dt {
        width: 45px;
        text-align: right;
        margin-left: -50px;
        margin-bottom: -21px;
      }
  
      dt::after {
        content: ':'
      }
  
      dd {
        margin-left: 0;
        display: inline-block;
      }
  
      dd::after {
        content: ','
      }
    </style>
  </head>
  
  
  
  <body>
    <dl>
      <dt>6666</dt>
      <dd>haha</dd>
      <dd>haha</dd>
      <dd>h范德萨</dd>
      <dt>66</dt>
      <dd>haha</dd>
      <dd>haha</dd>
      <dd>haha</dd>
      <dt>6</dt>
      <dd>haha</dd>
      <dd>haha</dd>
      <dd>haha</dd>
    </dl>
  </body>
  
  </html>
  ```
  
  