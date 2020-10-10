####      指定单个 box-shadow 的用法：

* 给出两个、三个或四个数字值的情况。
  * 如果只给出两个值, 这两个值将被浏览器解释为x轴上的偏移量和y轴上的偏移量 。
  * 如果给出了第三个值, 这第三个值将被解释为模糊半径的大小 。
  * 如果给出了第四个值, 这第四个值将被解释为扩展半径的大小 。
* 可选， 插页(阴影向内) `inset`。
* 可选， 颜色值 `color`。

#####参数：

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

