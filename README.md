# 扫雷---minesweeper

## 使用语言

Html + CSS + JavaScript

该半个月在[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web)网站学习网页开发，在学完HTML、CSS、JavaScript相关内容以后，决定用项目练练手，在[实验楼Web开发](https://www.shiyanlou.com/courses/?tag=%E5%85%A8%E9%83%A8&fee=all&sort=default&category=Web%20%E5%89%8D%E7%AB%AF&page=2)找到仅有的几个纯Html + CSS + JavaScript项目作为练习，首先即为网页版扫雷游戏实现。

## 实现效果

### 首页


### 游戏页


## 实现功能


### 选择游戏难度

1. 游戏难度参照win10自带扫雷设置：

- 初级 9\*9 雷：10
- 中级 16\*16 雷：40
- 高级 30\*16 雷：99

2. 选择游戏难度后，点击开始游戏按钮跳转进入游戏页面。

3. 游戏难度自带参数通过url传递


### 左键点击格子显示数字/雷

1. 为每个格子绑定onmousedown事件，通过其event.button值确定点击左键

2. 初始化时，设定扫雷mineSweeper类，其中，地图格子以二维数组形式landArrs存在
```
//由于扫雷每个格子中的内容为数字或雷。数字表示以其为中心的九宫格内雷的数量，故以九宫格中数字1~8表示，0为空格，9为雷
landArrs[i][j]=0;//空格
landArrs[i][j]=1;//数字1~8
landArrs[i][j]=9;//雷
```

3. 游戏开始前，按所选难度的雷数，将各雷随机放在地图内，再根据雷的位置计算雷周围数字的设置
```
//1.初始化所有格子为0
landArrs[i][j]=0;

//2.按雷数随机放置雷位置
//随机数a-b：Math.floor(Math.random() * (max - min)) + min
var randomNum = Math.floor(Math.random() * (row * col - 0) + 0);
var rNum = parseInt(randomNum / this.colCount);//随机数所在的格子行数
var cNum = parseInt(randomNum % this.colCount);//随机数所在的格子列数
//判断该位置是否已放置雷（省略）
landArrs[rNum][cNum] = 9;//放置雷

//3.按雷位置，计算其周边数字
//算法：遍历每个雷，将每个雷上下左右8格均+1
```
4. 点中雷，游戏失败

### 右键点击插旗或取消旗子

1. 为每个格子绑定onmousedown事件，通过其event.button值确定点击右键

2. 点击右键则将此格的class设置为flag，按CSS样式放置旗子背景图---->插旗

3. 再次点击右键则将已插旗的格子class设置为空字符串，取消CSS样式---->拔旗

### 点击格子为空值无数字时，自动连续展开其周边格子

> 算法：
> 1. 点击格子值为0，则以该格为中心查看其周围8个格
> 2. 若其周围格为被打开过，则打开该格。
> 3. 若其周围格再次遇到0，自动循环查找

### 花费时间即剩余雷数计算

1. 花费时间

> 采用JS异步时间间隔setInterval()算法，每1s更新一次时间
> setInterval(displayTime, 1000);

2. 剩余雷数
> 每标记一处，html更新一次内容

## 待实现功能

1. 双击设定

同时按下左键和右键完成双击。当双击位置周围已标记雷数等于该位置数字时操作有效，相当于对该数字周围未打开的方块均进行一次左键单击操作。地雷未标记完全时使用双击无效。若数字周围有标错的地雷，则游戏结束，标错的地雷上会显示一个“×”

## 参考内容

1. 实验楼扫雷实现教程

https://www.shiyanlou.com/courses/144

2. MDN Web Docs

https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps

