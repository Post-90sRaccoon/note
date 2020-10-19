#     第一周

## 快捷键

* 双击左上角 关闭
* shift+右键打开命令行
* 拖动 +control    复制
* 拖动 + shift    移动
* 拖动 + control shift  创建快捷方式



* crtl+enter     下一行
* crtl+shift+enter  上一行



* control + left / right         向左或向右移动一个词
* control +  up/ down        向上或向下移动一个段落
* control+home/end         移动到文本的开头/结尾



* control backspace   删除鼠标指针左侧的整个词
* control +y 重新执行最近撤销的命令
* control +d 
* shift +f10 显示菜单 效果与单击右键相同。

##  vscode 快捷键

* **重新打开 关闭的编辑页面**

  Windows: Ctrl + Shift + T Mac: command + Shift + T  
  
*  **逐个选择文本**
  可以通过快捷键Ctrl + Shift +右箭头(Mac: option + Shift +右箭头)和Ctrl + Shift +左箭头(Mac: option + Shift +左箭头)逐个选择文本。

* **重复的行**
  一个非常强大和已知的功能是复制行。只需按 Shift + Alt + 向下箭头 (Mac: command + Shift + 向下箭头)

* **向上/向下移动一行**
  按Alt + 向上箭头(Mac: command+ 向上箭头)当前行向上移动，按Alt + 向下箭头(Mac: command+ 向下箭头))当前行向下移动。

* **删除一行**
  有两种方法可以立即删除一行。
  使用Ctrl + X剪切命令(Mac：command + X)来删除一行。

* **在 VsCode 中复制游标可以证明是最节省时间的特性。**
  按Ctrl + Alt +向上箭头(Mac: Control + Option +向上箭头)将光标添加到上面，按Ctrl + Alt +向下箭头(Mac: Control + Option + 向下箭头)将光标添加到下面。

* **将编辑器向左或向右移动**
  想要在一个组中重新排列选项卡，其中选项卡相互关联，左边的选项卡是比较重要文件，而右边的选项卡是相对不重要的文件。 通过 Ctrl+Shift+PgUp/PgDown(command + +Shift+PgUp/PgDown)向左/向右移动编辑器。

* 在一对{}之间跳转

  Ctrl + Shift + \

* 撤销光标移动和选择 ctrl+u

* 定位行 crtl+g

* 重命名变量f2






## 十进制转换进制的原理

a=b\*2^0^+c\*2^1^+d\*2^2^

 =b+ 2(c+d\*2^1^)    可以判断b为0或1   小数用乘2

##字

word一般叫做字。word的大小与系统硬件有关，数据总线为16位，则1word为2Byte；32位时，1word为4Byte。

32位cpu和64位cpu代表计算机一次能读取多少位bit（寻址能力）。



## 图片格式

### jpg  jepg

* 以8*8个像素点为单位转换。
* 有损压缩，压缩率高，颜色会变化，一般能压倒原始数据量的十分之一。
* 质量越差，体积越小。
* 多用于现实世界的照片，颜色渐变不突兀。
* 有约1670万种颜色
  * R(0-255),G(0-255),B(0-255)   每种颜色256个数字，用8位表示，一个字节。一个像素点用三个字节表示。

###  png  portable network graphic

*  无损 压缩

* 适合存储大片相同颜色的照片，如软件截图

* 支持透明色（Alpha通道)

* 每个点四个字节组成 R  G B Alpha

### gif

* 只有256种颜色，从颜色表种抽取出来。

* 当原始图片颜色不足256时，无损压缩。

* 并没有存储每张图的所有像素点，只存储了变化的点，第一帧存储肯定是完整的。

* 支持透明，但是要么完全透明，要么完全不透明。

### webp

* 有损压缩，支持alpha通道，适合移动端使用，优于jpg。

###  bmp bit map

* 无压缩，无损

* 每个点占三个字节（取决于保存格式：1670万色/24位--rgb，单色/1bit--黑白01，256色/8bit，65536色/16bit)

* 体积巨大，不适合放在网页里

* 16==色==位图（固定的16种颜色，gif是从颜色表抽取颜色），24==位==位图，一个像素24位。

  

  ![image-20191116102432252](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116102432252.png)

  ![image-20191116102530199](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116102530199.png)

  >  FF FF FF  16进制代表  24个二进制位，         2^8^*2^8^*2^8^ ,(R,G,B)各代表一个点。然后修改  

  

  

![image-20191116103145439](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116103145439.png)

![image-20191116103155415](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116103155415.png)

  >   文件头，存储图片大小长宽高等信息  

  


![image-20191116103310626](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116103310626.png)

## 文件簇——文件占用空间比实际大小要大

* 数据存储在硬盘的时候都是以簇为单位，所以无论文件大小是多少，除非正好是簇大小倍数，否则文件所占用的最后一个簇或多或少都会产生一些剩余的空间，这些剩余空间有不能给其它文件使用，即使这个文件只有0字节，也不允许两个文件或两个以上的文件共用一个簇，不然会数据混乱。

* 簇（cluster），一组扇区，因为扇区的单位太小，把它捆在一起，组成一个更大的单位更方便进行灵活管理。簇的大小是可以变化的，是由操作系统在所谓“（高级）格式化“时规定的，因此管理更加灵活。

## 命令行

* WSL子系统目录  `C:\Users\荆纬宸\AppData\Local\Packages\CanonicalGroupLimited.UbuntuonWindows_79rhkp1fndgsc\LocalState\rootfs`

* ls 查看当前目录中的文件

  * ls -l 详细 

  *  ls -l -h 把字节转换为更大的单位 

  * ls-a 显示隐藏文件

  * pwd查看当前工作路径

    ![image-20191116111105826](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116111105826.png)

* touch 创建新文件或更新文件修改时间

* rm   删除文件

* mv  a b  移动文件 如果b名字的文件存在，则覆盖，不存在，则改名

* mkdir  rmdir 创建文件夹 删除文件夹

* **==rmdir只能删除空文件夹==**

* `rm-r` 删除文件夹及其内容

![image-20191116114004459](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116114004459.png)

* date 显示日期

* cal 显示日历 只有linux可以

  ![image-20191116114619851](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116114619851.png)

* top linux 查看进程

* htop linux任务管理器

  ![image-20191116141742500](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116141742500.png)

![image-20191116141807721](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116141807721.png)

* echo $PATH 显示环境变量

  ![image-20191116142322329](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116142322329.png)

* cd ..是回到上一级目录

* cd . 是当前目录

* cd / 是回到根目录

* cd  回到用户主目录(我的文档)  linux里是进入用户主目录 
 ![image-20191116144142170](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116144142170.png)

* **cd/mnt/c  访问windows文件系统c盘**


* \>和\>\> 

  * \>将命令输出到文件
  * \>>将命令追加到文件
  
  ![image-20191116150647147](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116150647147.png)
  
  
  
  命令创建了haha.txt,并且把ls输入 进去。
  
*  
  
  ![image-20191116152055474](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116152055474.png)
  
  ==不是所有命令都支持管道符 rm不可以==

* sudo 超级管理员权限 sudo apt install/ sudo apt update

* cat 显示 拼接

![image-20191116153512770](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116153512770.png)

![image-20191116154413051](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116154413051.png)

**cat图片和exe成一个png，将png后缀名改为rar，可以解压缩出exe**

*  `$ split -b 256000 cat.mp4`  把cat.mp4分成256000bit大小的文件
![image-20191116165023779](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116165023779.png)

* `$ cat xa* >cat.txt` 合并xa开头的文件

* `cp a.txt b.txt`  如果b存在 覆盖

* `time ping` `time ls` 测试命令的执行时间

* `alias foo=ll` 使foo和ll等效。我的文档创建.bashrc  写入起别名，每次打开gitbash都会执行这个文件的代码。

* `ping http://baidu.com`  测试与目标ip的连通性

* `md5sum`     生成独一无二的码 可以检验内容是否一致

  ![image-20191116172501589](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116172501589.png)

*  快捷键
  * control + L =clear    清楚屏幕上的信息 不清空 可以滚轮回去
  * control +a/e 光标跳到开始或结束
  * control + r   搜索输入过的命令
  * 键盘的上，可以找最近输入的命令
  * 按tab键可以自动补全
  * control +c 强行退出  q退出 esc 退出
  * control +d 读取一段
  * 写一些命令行保存为.sh格式，双击会在工作目录执行

## vi编辑器

* `vi+文件名`

* 按i进入编辑模式，esc退出进入标准模式。:w保存q退出，！强行退出。

* :q！不保存退出

* 删除一行dd，复制一行yyp

* hjkl上下左右

* vimtour看教程

##  ascii与unicode

* ascii 美国编码，Unicode 涵盖全球语言

* linux下输入 `man ascii`可以查看 ascii码表

* 空格32，0是48，A65，a97

* 不同操作系统的回车

  * Windows 0D0A
  
* Linux 0A
  
* Mac 0D
  
* 切黄金

  ​        ![img](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/clip_image002.jpg)  

​         ![img](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/clip_image002.png)  

## git

* `git config --global user.name`

* `git config --global user.email`

* `git config --global alias.st status` 起别名

* 以上信息存储在.gitconfig

* `git init` 初始化 建立.git 文件夹

* `git add xxx.xx`   添加要记录的文件到缓冲区

* `git status`    查看状态

* `git commit -m"描述信息"` 把刚刚添加的文件存成固定的版本

* `git diff` 查看工作目录和暂存区的差别，如果还没add进缓存区，查看文件自身修改前后的差别。

* ` git diff --cached` 比较暂存区尚未commit的内容同最新版本内容的差异

* `git diff head` 查看工作区和最新版本的差别

* `git add.` 添加文件夹内所有文件

* `git log` 查看版本记录 

  * `$ git log --pretty=oneline ` 每个记录一行输出

* `git  checkout xxxxxxx` 查看以前版本，会让head定位到xxxx。

  * git中用HEAD表示当前版本，上一个版本HEAD^。上一百个版本Head~100。
  * `git reset --hard HEAD^(或者版本号)`回退的另一种方法
  * `git reflog` 查看历史的版本记录
    * `git checkout 文件名` 撤销工作区的修改。一种是`readme.txt`自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态；一种是`readme.txt`已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态。
    * 场景1：当你改乱了工作区某个文件的内容，想直接丢弃工作区的修改时，用命令`git checkout -- file`。场景2：当你不但改乱了工作区某个文件的内容，还添加到了暂存区时，想丢弃修改，分两步，第一步用命令`git reset HEAD `，就回到了场景1，第二步按场景1操作。

  ​         ![img](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/clip_image002-1573901750451.png)  

* `git commit -a -m` 不需要add，直接commit。

* 查看软件Source tree

​           ![img](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/clip_image002-1573901901661.jpg)  

* 工作区修改 add到暂存区 暂存区Commit 后 暂存区的内容生成版本二

* `git remote add origin [git@github.com:Post-90sRaccoon/testmarkdown.git]` 操作远程仓库

* `git push -u origin master`      把master分支和远程origin关联起来

* `git remote`  查看远程仓库

* `git remote -v` 多显示一些信息

* `git commit` 没加m 会进入vi编辑器

* 文件名里的 - 要用\\-\来写 

* git 删除文件后git add被删除的文件名或者直接add.

  * 从版本库删除文件`git rm `+`git commit`
  * 误删git checkout --文件名

* git密码配置 `ssh-keygen` 然后一直回车.我的文档.ssh文件里id_rsa.pub内容复制到网页github的settings->ssh and gpg keys

  ![img](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/clip_image002-1573904426726.jpg)

## VScode 的配置

* control shift + p 搜索format 找自动缩进
* 搜space 找到空格加点         !
* tab 2缩进
* trim 多余空格

## HTML介绍

* HTML Hyper Text Markup Language

* html5中，不需要给自闭和标签打结束符。但不推荐。

* 缩进，非**块级元素**在内容不多的情况下可以选择不缩进。如

  ``` html
  <div>
    <p>点击打开<a href="http://jd.com">京东</a></p>
  </div>
  ```

* 语义化：有助于构架良好的html结构，有利于搜索引擎的建立索引、抓取；另外，亦有利于页面在不同的设备上显示尽可能相同；此外，有利于构建清晰的机构，有利于团队的开发、维护。（合适的内容用合适的标签）

### 属性

* 属性可以有值，也可以没有。
* 属性名不区分大小写，属性值区分大小写。
* 属性值一般用双引号括起来，也可以使用单引号。属性值没有空格，引号等特殊字符，属性值可以不用引号包起来
* id属性，不以数字开头，没有空格。
* name属性，标签的名字，主要用在表单类标签上面。可以重复。
* title属性，鼠标在上面时显示的tooltip文本
* alt属性，主要用在img标签，图片加载失败时替换文本。
* style属性，给标签指定内联样式
* `class="foo bar"` 类别，空格分隔的单词列表
* tabindex 按tab 跳转的顺序 从小到大 大小如果相同 按照源代码出现的顺序 不可交互元素加上 可交互 如div
* data-*   自定义属性，让标签记录额外的信息 data-sku 最小库存单位
* contenteditable （html5）加上可编辑

## 转义 escape

* html中叫实体，html entity

* 可以用unicode ascii码表达

* \&#number; 十进制数，我 \&#25105; 

* \&#xHHHH; 十六进制数(Hexdecimal),我 \&#x6211;

*   常见具名html实体：

    * \&nbsp; non-breaking space 160号空格

    * \&amp; &符

    * \&copy; 版权符

    * \&lt; 小于号

    * \&gt; 大于号

    * \&quot; 双引号 quote

    * \&apos; 单引号 

    * \&trade; TM 符号

      ![image-20191116212512529](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191116212512529.png)

      

* \&nbsp;(Non Breaking Space) ascii 160 和空格不一样，多于一个空格，换行符会被全部忽略。

* <pre>pre标签，不会合并空格，里面的内容都是等宽字体。</pre>

## HTML 标签介绍

* html 根元素

* head 头部标签，放一些与页面相关的原信息。比如页面编码方式。

* https://github.com/joshbuchea/HEAD

  `<meta charset="utf-8">`

  `<link rel="icon" href="https://www.baidu.com/img">`

    * 页面的标题，即为title标签

    * 页面标题栏左边显示的小图标

      ```html
      <link rel="icon" href="https://www.baidu.com/img/baidu_jgylogo3.gif">
      ```

  * 浏览器会取网址第一个斜杠 https://www.baidu.com/拼接favicon.ico来显示小图标

  * 可以取页面的样式表 `<link rel="stylesheet" href="a.css">`

  * 国产很多双核浏览器支持这种模式`<meta name="UA-X-Compatable" content="EDGE" />`edge是最新版的意思

  * 在移动端，还可以定义页面以多宽的尺寸渲染等 edge 最新版本的意思`<meta name="viewport" content="width=500" />`

  * head内容不会显示在页面上，不存在也会自动添加。

* body 没有html和body标签，浏览器会自动添加。浏览器同时也会将必须放在head里的标签放进head里面，比如title标签。如果在body或者html标签之后又出现了其他的标签，则之前的标签就会被认为无效，浏览器自动添加结束标签。

* title   页面标题，仅支持纯文本，不支持嵌套其他标签。出现多个，仅第一个生效。

* base 基准  <base href="页面中所有相对路径的基准地址" target="页面中所有链接的打开位置">

  * 一定要以/即目录结尾

     `<base href="https://www.baidu.com/abc/">`

  ​       `<base href="https://www.baidu.com/abc">`相当于`<base href="https://www.baidu.com/">`不会追加abc

  * 写在base里的target属性表示页面中**所有链接**的打开位置（_blank,_self）。当然，可以在页内的a标签中用它自己的target属性覆盖用base标签设置的全局打开位置
  
* H标签

  * 默认情况下，标题上下有一定的空白，传统观点认为一个页面不能出现超过1个h1标签，原因是为了SEO。
  * seo：关键字，页面被引用次数——反向链接数量。使用https，使页面的html更符合语义。
  * html5 hgroup标签，放一组不同级别的h标签。

* p标签   段落,默认有上下边距。

* a标签 anchor。
  
    * 绝对网址，fullpath  `<a href="https://jd.com/">京东</a>`
    
*  页内特定位置跳转地址 `<a href="#pos1"></a>`
	
	* 其它页特定位置跳转地址 `<a href="http://jd.com/#footer"></a>`
	
* 相对路径  `<a href=".././../a/b/../index.html"></a>`
	
* 链接到电子邮件`<a href=“mailto:”></a>`

* 链接到电话号码

* QQ/taobao 临时会话

* 空的href页面刷新（对应当前地址），类似的，如果一个img标签的src属性为空，也将对应当前页面地址

* `href=.`  会拼接到上一个斜杠之前的内容

![image-20191117145720510](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191117145720510.png)

![image-20191117145735958](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191117145735958.png)

* target 属性
  * _blank 打开新窗口显示
  * _self  是默认值 在当前窗体打开
  * _parent 父窗体显示
  * _top   链接在顶层窗体显示

* html5中，还有一个download属性。点击这个链接将下载对应的文件，下载的文件名以download属性的值来命名。不适用与所有格式文件。

* image 标签

  ```html
  <img src="http://www.baidu.com/logo.png" alt="" title="tooltip">
   <img srcset="a.jpg 1x, b.jpg 2x, c.jpg 3x">
   				不同分辨率的屏幕
  ```

	* 可支持的文件格式：jpg/jpeg,png,bmp,gif,webp,svg,ico
	
	*  用width和height图片的宽和高，只写一个另一个会根据图片原始比例计算出来。图片加载需要时间，而图片在加载完成之前浏览器是不知道其宽高的，所以页面抖动。所以一般会在标签上把宽高写出来，这样图片加载过程中页面就不会抖动了

* span 行内标签

* div

* br标签  换行 自闭和标签

* hr 标签 horizontal 水平分割线 自闭和标签 写成闭合无效

* font/blink/marquee

		* `<font size="28" color="red" face="宋体">宋体</font>`
		* win+r+fonts 查看电脑安装的字体。安装字体，下载ttf文件，双击下载。
		* blink标签，闪烁，已弃用。
		* `<marquee behavior="" onmouseover="stop()"direction="left">滚动</marquee>`    滚动   已废弃
	
*  em，strong，b标签。b没有强调的意思，em和strong有强调的意思，读屏软件em语调强调，strong语调更加重

* u标签 underline

* i标签 italic  html5的语义：由于某些原因需要与普通文本区分的文本，不是强调。很多库和框架用i表示icon。

* 注释标签   <!-- 注释 --> 快捷键 control+/

* pre标签   常与code标签连用

* 列表

   * ol 无序列表

   * ul 有序列表

   * ul和ol直接只能套入li标签，但li标签里面可以嵌套别的标签

     ```html
     <ol>
         <li>范德萨</li>
         <li>
           <ol>
         		<li>范德萨</li>
         		<li>发斯蒂芬</li>
         		<li>范德萨</li>
       		</ol>
         </li>
         <li>范德萨</li>
      </ol>*
     ```

   * dl描述性列表

     ``` html
     <dl>
         <dt>导演</dt>
         <dd>张xx</dd>
         
         <dt>主演</dt>
         <dd>王xx</dd>
         
         <dt>演员</dt>
         <dd>周xx</dd>
         <dd>王xx</dd>
         <dd>李xx</dd>
         <dd>白xx</dd>
       </dl>
     ```

     ![image-20191118111833084](%E7%AC%AC%E4%B8%80%E5%91%A8.assets/image-20191118111833084.png)

* vscode 批量修改快捷键control+shift+L
* 搜索栏 任务计划程序