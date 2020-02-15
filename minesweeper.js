let restartBtn = document.querySelector("#restart");
let mineNum = document.querySelector(".minenum");
let time = document.querySelector(".time");
let row;//行数
let col;//列数
let mNum;//雷数
let mCount;//剩余雷数计算
let mineSweeperIndex = null;
let sec = 0;
let stop;//保存间隔
let clickTimes = 0;
let clickTimeOut;
//扫雷类
class mineSweeper {
    constructor(id, rowCount, colCount, mineCount) {
        if (!(this instanceof mineSweeper))
            return new mineSweeper(id, rowCount, colCount, mineCount);
        this.id = id;
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.mineCount = mineCount;//雷数
        this.table = document.querySelector("#" + id);
        this.cells = this.table.querySelector("td");
        this.markedMineCount = 0;//标记的雷数
        this.landArrs = [];//地图格子数组
        this.currentCellCount = 0;//当前打开的非雷格子数
        document.oncontextmenu = function () {
            return false;
        };//禁用右键菜单
        this.drawMap();
    };
}
//只能分开写，不能写成x.prototype ={a:function,b:function,....}
/**
 * 绘制地图表格及初始化
 */
//绘制地图
mineSweeper.prototype.drawMap = function () {
    let tds = [];
    /*
    // 为了兼容浏览器
    if (window.ActiveXObject && parseInt(navigator.userAgent.match(/msie ([\d.]+)/i)[1]) < 8) {
        // 创建引入新的 css 样式文件
        var css = '#JMS_main table td{background-color:#888;}',
            // 获取 head 标签
            head = this.doc.getElementsByTagName("head")[0],
            // 创建 style 标签
            style = this.doc.createElement("style");
        style.type = "text/css";
        if (style.styleSheet) {
            // 将 css 样式赋给 style 标签
            style.styleSheet.cssText = css;
        } else {
            // 在 style 标签中创建节点
            style.appendChild(this.doc.createTextNode(css));
        }
        // 再将 style 标签创建为 head 标签的子标签
        head.appendChild(style);
    } */

    //创建表格
    for (var i = 0; i < this.rowCount; i++) {
        tds.push("<tr>");
        for (var j = 0; j < this.colCount; j++) {
            tds.push("<td id='m_" + i + "_" + j + "'></td>");
        }
        tds.push("</tr>");
    }
    this.table.innerHTML = tds.join("");
};
//初始化格子数字
mineSweeper.prototype.initLand = function () {//
    for (var i = 0; i < this.rowCount; i++) {
        this.landArrs[i] = [];
        for (var j = 0; j < this.colCount; j++) {
            this.landArrs[i][j] = 0;//设置格子初始化为0
        }
    }
};
//随机放置地雷，即将地雷处设置为9
mineSweeper.prototype.landMine = function () {
    var tempArr = {};//记录已放置的地雷，防止重复放置
    for (var i = 0; i < this.mineCount; i++) {
        //随机数a-b：Math.floor(Math.random() * (max - min)) + min
        var randomNum = Math.floor(Math.random() * (this.rowCount * this.colCount));
        var rNum = parseInt(randomNum / this.colCount);//随机数所在的格子行数
        var cNum = parseInt(randomNum % this.colCount);//随机数所在的格子列数
        if (randomNum in tempArr) {//若所放位置已经有雷，则回退重新放置
            i--;
            continue;
        }
        this.landArrs[rNum][cNum] = 9;//放置地雷
        document.querySelector("#m_" + rNum + "_" + cNum).className = "mine";
        tempArr[randomNum] = randomNum;//记录位置
    }
};
//围绕雷放置其他数字
mineSweeper.prototype.noLandMine = function () {
    for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
            if (this.landArrs[i][j] == 9) {//雷位置
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
};
mineSweeper.prototype.calculateNoLandMine = function (array, x, y) {
    if (x >= 0 && x < this.rowCount && y >= 0 && y < this.colCount) {
        if (array[x][y] != 9) {
            array[x][y]++;
        }
    }
};
/**
 * 格子点击事件
 */
//绑定点击事件
mineSweeper.prototype.bindCells = function () {
    for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
            console.log("bindCells");
            this.clickCells(i, j);
            // this.dbclickCells(i, j);
        }
    }
};
mineSweeper.prototype.clickCells = function (row, col) {
    let clickedCell = this;
    document.querySelector("#m_" + row + "_" + col).onmousedown = function (e) {
        clearTimeout(clickTimeOut);
        // clickTimeOut = setTimeout(function () {//初始化一个延时
        //     console.log("clickCells");//单击
        // }, 250)
        if (clickTimes == 0) {
            //开始计时
            stop = setInterval(displayTime, 1000);
        }
        //events.button==0  鼠标左键 events.button==2  鼠标右键 events.button==2  鼠标左右键同时按下
        var mouseNum = e.button;
        console.log("clickCells:mouseNum:" + mouseNum);
        console.log("this:");
        console.log(this);
        if (mouseNum == 0) {//左击-->展开格子
            if (this.className != "flag") {//此处没有旗子则可以打开，否则无法打开
                //self.openBlock.call(self, this, row, col);--疑惑
                clickedCell.openBlock(this, row, col);
            }
        } else if (mouseNum == 2) {//右击-->设旗子或取消旗子
            if (this.className == "flag") {
                this.className = "";//取消旗子
                clickedCell.markedMineCount--;
                mCount++;//剩余雷数+1
                mineNum.textContent = "剩余雷数：" + mCount;
            }
            else {
                this.className = "flag";//设旗子
                clickedCell.markedMineCount++;
                mCount--;//剩余雷数-1
                mineNum.textContent = "剩余雷数：" + mCount;
            }
        }

        clickTimes++;
    }
};
// mineSweeper.prototype.dbclickCells = function (x, y) {
//     let clickedCell = this;
//     document.querySelector("#m_" + x + "_" + y).ondblclick = function (e) {
//         clearTimeout(clickTimeOut);//双击
//         console.log("dbClickEvent");
//         if (this.className == "normal") {
//             clickedCell.autoOpenBlock(this, x, y);
//         }
//     }
// }
//打开格子
mineSweeper.prototype.openBlock = function (obj, x, y) {
    console.log("openBlock:landArrs[x][y]:" + this.landArrs[x][y]);
    if (this.landArrs[x][y] == 9) {//点中雷，则游戏失败
        this.fail();
    } else {
        console.log(this.currentCellCount);
        console.log(obj.onmousedown);
        this.currentCellCount++;

        if (this.landArrs[x][y] != 0) {
            obj.innerHTML = this.landArrs[x][y];//若非空格，则显示其数字
            console.log(obj);
        }
        obj.className = "normal";//标识此格已被打开
        console.log(obj);
        if (parseInt(this.currentCellCount) + parseInt(this.mineCount) == this.rowCount * this.colCount) {//打开的无雷格子数加格子数==总格子数则为胜利
            this.success();
        }
        obj.onmousedown = null;//被打开格子取消点击
        if (this.landArrs[x][y] == 0) {//若为空格，则自动打开以其为中心的九宫格地图
            console.log("xy:" + x + "," + y);
            this.autoNoMindBlock(x, y);
        }
        console.log(obj.onmousedown);
    }
};
//双击时自动打开格子
// mineSweeper.prototype.autoOpenBlock = function (obj, x, y) {
//     for (var i = x - 1; i < x + 2; i++) {//以传入的格为中心查询打开其九宫格其他8格可自动打开的部分
//         for (var j = y - 1; j < y + 2; j++) {
//             var tempCell = document.querySelector("#m_" + i + "_" + j);
//             if (i >= 0 && i < this.rowCount && j >= 0 && j < this.colCount && tempCell.className != "normal") {
//                 var tempFlagNum = this.landArrs[x][y];
//                 var tempFlagCount = 0;
//                 console.log("该双击的格子数字为:" + tempFlagNum);
//                 console.log("autoNoMindBlock:tempCell:");
//                 console.log(tempCell);
//                 if (!(i == x && j == y)) {
//                     if (tempCell.className == "flag" && this.checkMine(i.j)) {
//                         tempCell.textContent = "X";
//                         tempCell.style.color = "red";
//                         tempCell.style.font = "20px";
//                         this.fail();
//                         break;
//                     }
//                     tempFlagCount = this.checkFlag(i, j);
//                     if (tempFlagCount >= tempFlagNum) {//该中心格附近有多于等于其数字的旗子
//                         this.autoNoMindBlock(i, j);//打开格子
//                         tempCell.ondblclick = null;
//                     } else {
//                         continue;
//                     }
//                 }
//             }
//         }
//     }
// };
// //检查标记为旗子的格是否有雷
// mineSweeper.prototype.checkMine = function (x, y) {
//     console.log("检查附近未插旗的地方是否有雷");
//     for (var i = x - 1; i < x + 2; i++) {//以传入的格为中心查询打开其九宫格其他8格可自动打开的部分
//         for (var j = y - 1; j < y + 2; j++) {
//             if (i >= 0 && i < this.rowCount && j >= 0 && j < this.colCount) {
//                 var tempCell = document.querySelector("#m_" + i + "_" + j);
//                 console.log("autoNoMindBlock:tempCell:");
//                 console.log(tempCell);
//                 if (!(i == x && j == y) && tempCell && tempCell.className != "flag" && this.landArrs[i][j] == 9) {
//                     return true;
//                 }
//             }
//         }
//     }
//     return false;
// }
// //查询该格附近有几面旗
// mineSweeper.prototype.checkFlag = function (x, y) {
//     var tempFlagCount = 0;
//     console.log("查询该格附近有几面旗");
//     for (var i = x - 1; i < x + 2; i++) {//以传入的格为中心查询打开其九宫格其他8格可自动打开的部分
//         for (var j = y - 1; j < y + 2; j++) {
//             if (i >= 0 && i < this.rowCount && j >= 0 && j < this.colCount) {
//                 var tempCell = document.querySelector("#m_" + i + "_" + j);
//                 if (!(i == x && j == y) && tempCell && tempCell.className == "flag") {
//                     tempFlagCount++;
//                 }
//             }
//         }
//     }
//     return tempFlagCount;
// }
//点击时自动打开无雷无数字的格子
mineSweeper.prototype.autoNoMindBlock = function (x, y) {
    console.log("进入autoNoMine");
    for (var i = x - 1; i < x + 2; i++) {//以传入的格为中心查询打开其九宫格其他8格可自动打开的部分
        for (var j = y - 1; j < y + 2; j++) {
            if (i >= 0 && i < this.rowCount && j >= 0 && j < this.colCount) {
                var tempCell = document.querySelector("#m_" + i + "_" + j);
                console.log("autoNoMindBlock:tempCell:");
                console.log(tempCell);
                if (!(i == x && j == y) && tempCell && tempCell.className == "") {//中心格不查看，其他格若未被打开过，则打开格子
                    this.openBlock(tempCell, i, j);//打开格子
                }
            }
        }
    }
};
//游戏失败显示全部格子信息
mineSweeper.prototype.showAll = function () {
    for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
            if (this.landArrs[i][j] == 9) {
                document.querySelector("#m_" + i + "_" + j).className = "mine";
            } else {
                if (this.landArrs[i][j] != 0) {
                    document.querySelector("#m_" + i + "_" + j).innerHTML = this.landArrs[i][j];
                }
                document.querySelector("#m_" + i + "_" + j).className = "normal";
            }

        }
    }
}
//游戏重开前清除所有格子信息
mineSweeper.prototype.clearAll = function () {
    for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
            document.querySelector("#m_" + i + "_" + j).innerHTML = "";
            document.querySelector("#m_" + i + "_" + j).className = "";
        }
    }
}
//清除所有格子绑定信息
mineSweeper.prototype.clearBind = function () {
    for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
            document.querySelector("#m_" + i + "_" + j).onmousedown = null;
        }
    }
}
/**
 * 游戏设计
 */
//游戏失败
mineSweeper.prototype.fail = function () {
    this.showAll();
    clearInterval(stop);
    alert("Game Over!!!");
};
//游戏成功
mineSweeper.prototype.success = function () {
    this.showAll();
    this.clearBind();
    clearInterval(stop);
    alert("Congratulation!!!");
};
restartBtn.addEventListener("click", function () {
    clearInterval(stop);
    sec = 0;
    window.location.href = "index.html";
});
//从url中获取首页选中的等级信息
function getCheckedLevel() {
    let chlevel = window.location.href.split("?")[1].split("&");
    row = chlevel[1].split("=")[1];
    col = chlevel[0].split("=")[1];
    mNum = chlevel[2].split("=")[1];
    console.log("width:" + col + " height:" + row + " mine:" + mNum);
}


window.addEventListener("load", function () {
    getCheckedLevel();
    init(row, col, mNum);
    this.document.querySelector(".gamearea").style.width = (Number(col) + 1) * 30 + 150 + 8 + "px";
    this.document.querySelector(".operation").style.height = (Number(row) - 2) * 30 + "px";
});
function init(rowN, colN, mineN) {
    mineSweeperIndex = new mineSweeper("landmine", row, col, mNum);
    mCount = mNum;
    mineNum.textContent = "剩余雷数：" + mCount;
    sec = 0;
    console.log(mineSweeperIndex);
    mineSweeperIndex.initLand();
    mineSweeperIndex.landMine();
    mineSweeperIndex.noLandMine();
    console.log(mineSweeperIndex.landArrs);
    displayTime();
    mineSweeperIndex.markedMineCount = 0;
    mineSweeperIndex.currentCellCount = 0;
    mineSweeperIndex.clearAll();
    mineSweeperIndex.bindCells();
}
function displayTime() {
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec % 3600) / 60);
    let seconds = Math.floor(sec % 60);

    //当为个数时，将其格式改为0开始
    let displayHours = (hours < 10) ? '0' + hours : hours;
    let displayMinutes = (minutes < 10) ? '0' + minutes : minutes;
    let displaySeconds = (seconds < 10) ? '0' + seconds : seconds;
    time.textContent = "Time：" + displayMinutes + ":" + displaySeconds;
    sec++;
}