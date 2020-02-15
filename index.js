let startBtn = document.querySelector("#start");
let level = document.querySelectorAll(".level");
let width;
let height;
let mine;
for (var i = 0; i < level.length; i++) {
    level[i].addEventListener("click", function () {
        let checkedLevel = this.value;
        switch (checkedLevel) {
            case "9":
                width = 9;
                height = 9;
                mine = 10;
                break;
            case "16":
                width = 16;
                height = 16;
                mine = 40;
                break;
            case "30":
                width = 30;
                height = 16;
                mine = 99;
                break;
        }
        console.log("width:" + width + " height:" + height + " mine:" + mine);
    })
}
startBtn.addEventListener("click", function () {
    window.location.href = "minesweeper.html?width=" + width + "&height=" + height + "&mine=" + mine;
})
