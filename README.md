# 扫雷---Mine Sweeper

## 使用语言

HTML + CSS + JavaScript

此项目即为纯Html + CSS + JavaScript的网页版扫雷游戏实现。

在线试玩页面：http://awesolynn.me/game-minesweeper/

## 实现效果

### 首页

![首页](https://github.com/ChangeZ24/game-minesweeper/blob/master/show/index.jpg)

### 游戏页

![游戏页](https://github.com/ChangeZ24/game-minesweeper/blob/master/show/showall.gif)

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
for (var i = 0; i < this.rowCount; i++) {
    for (var j = 0; j < this.colCount; j++) {
      if (this.landArrs[i][j] == 9) {
        //雷位置
        //雷上一排
        this.calculateNoLandMine(this.landArrs, i - 1, j - 1);
        this.calculateNoLandMine(this.landArrs, i - 1, j);
        this.calculateNoLandMine(this.landArrs, i - 1, j + 1);
        //雷下一排
        this.calculateNoLandMine(this.landArrs, i + 1, j - 1);
        this.calculateNoLandMine(this.landArrs, i + 1, j);
        this.calculateNoLandMine(this.landArrs, i + 1, j + 1);
        //雷左右
        this.calculateNoLandMine(this.landArrs, i, j - 1);
        this.calculateNoLandMine(this.landArrs, i, j + 1);
      }
    }
  }
  
// calculateNoLandMine
mineSweeper.prototype.calculateNoLandMine = function(array, x, y) {
  if (x >= 0 && x < this.rowCount && y >= 0 && y < this.colCount) {
    if (array[x][y] != 9) {
      array[x][y]++;
    }
  }
};
```
4. 点中雷，游戏失败

### 右键点击插旗或取消旗子

1. 为每个格子绑定onmousedown事件，通过其event.button值确定点击右键，同时禁用右键菜单
```
// event.button确定左右键
//events.button==0  鼠标左键 events.button==1  鼠标右键 events.button==2  鼠标左右键同时按下

// 禁用右键菜单
document.oncontextmenu = function() {
    return false;
};
```

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
> 每标记一处，剩余雷数-1，关联dom展示的数字更新

### 双击设定：满足已标记数与自身数字一致时自动打开格子

1. 双击已打开的数字格。

> 当双击位置周围已标记雷数等于该位置数字时操作有效，相当于对该数字周围未打开的方块均进行一次左键单击操作（此时在前面单击的设定上需要加插旗部分检查是否有雷的功能）。
> 地雷未标记完全时使用双击无效。

2. 若数字周围有标错的地雷，则游戏结束，标错的地雷上会显示一个“×”

![标记错](https://github.com/ChangeZ24/game-minesweeper/blob/master/show/showerror.gif)

