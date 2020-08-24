var board = new Array();
var added = new Array();
var score = 0;
var top = 240;
$(document).ready(function (e) {
    newgame();
});

function newgame() {
    // 初始化棋盘格
    inti();
    // 在随机两个各自生成的数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    score = 0;
    document.getElementById("score").innerHTML = score;
    $("#gameover").css('display','none');
    for (var i = 0; i < 4;i++){
        for(var j = 0; j < 4; j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css("top",getPosTop(i,j));
            gridCell.css("left",getPosLeft(i,j));
        }
    }

    for(var i = 0; i < 4; i++){
        board[i] = new Array();
        for(var j = 0; j < 4; j++){
            board[i][j] = 0;
        }
    }

    for(var i = 0; i < 4; i++){  // 初始化绑定合并的数组
        added[i] = new Array();
        for(var j = 0; j < 4; j++){
            added[i][j] = 0;
        }
    }

    updateBoardView();
}

function updateBoardView() {
    $(".number-cell").remove();
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);
            if(board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j));
            }else{
                theNumberCell.css('width','100px');
                theNumberCell.css('height','100px');
                theNumberCell.css('top',getPosTop(i,j));
                // NumberCell覆盖
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j])); // 返回背景色
                theNumberCell.css('color',getNumberColor(board[i][j])); // 返回背景色
                theNumberCell.text(board[i][j]);
            }
        }
    }
}

function generateOneNumber() { // 生成随机的格子
    if(onspace(board))
        return false;
        // 随机位置
        var randx = parseInt(Math.floor(Math.random()*4));
        var randy = parseInt(Math.floor(Math.random()*4));
        while (true){
            if(board[randx][randy] == 0)
                break;
            randx = parseInt(Math.floor(Math.random()*4));
            randy = parseInt(Math.floor(Math.random()*4));
        }
        // 随机一个数字
        var randNumber = Math.random()<0.5 ? 2 : 4;
        // 在随机位置显示随机数字
        board[randx][randy] = randNumber;
        showNumberWithAnimation(randx,randy,randNumber);
        return true;
}
function showNumberWithAnimation(i,j,randNumber) { // 实现随机数字的样式变动
    var numberCell = $('#number-cell-'+i+'-'+j);
    numberCell.css("background-color",getNumberBackgroundColor(randNumber));
    numberCell.css("color",getNumberColor(randNumber));
    numberCell.text(randNumber);

    numberCell.animate({
        width:"100px",
        height:"100px",
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    },50)
}

function getPosTop(i,j) {
    return 20 + i * 120;
}

function getPosLeft(i,j) {
    return 20 + j * 120;
}

function getNumberBackgroundColor(number) {
    switch (number) {
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#eee4da";
            break;
        case 8:
            return "#f26179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e36";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#3365a5";
            break;
        case 2048:
            return "#09c";
            break;
        case 4096:
            return "#a5bc";
            break;
        case 8192:
            return "#93c";
            break;
    }
    return "black";
}

function getNumberColor(number) {
    if(number <= 4){
        return "#776e65";
    }
    return  "white";
}

function isaddedArray() { // 将判断能否合并的数组值置为0
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            added[i][j] = 0;
        }
    }
}

function canMoveLeft(board) { // 判断能否左移
    for(var i = 0; i < 4; i++)
        for(var j = 0; j < 4; j++)
            if(board[i][j] !=0 && j != 0)
                if(board[i][j-1] == 0 || board[i][j-1] == board[i][j])
                    return  true;
    return false;
}
// 在随机生成数字的时候判断16宫格是否还有空间
function nospace(board) {
    for(var i = 0; i < 4; i++)
        for(var j = 0; j < 4; j++)
            if(board[i][j] == 0)
                return false;
    return true;
}

// 判断水平方向是否有障碍物
function noBlockHorizontal(row,col1,col2,board) {
    for(var i = col1 +1; i < col2; i++)
        if(board[row][i]!=0)
            return  false;
    return true;
}

// 判断竖直方向是否有障碍物
function noBlockVertical(col,row1,row2,board) {
    for(var i = row1 + 1; i < row2; i++)
        if(board[row][i]!=0)
            return  false;
    return  true;
}

// 实现移动格子的样式变动
function showMoveAnimation(fromx,fromy,tox,toy) {
    var numberCell = $('#number-cell-'+fromx+'-'+fromy);
    numberCell.animate({top:getPosTop(tox,toy),left:getPosLeft(tox,toy)},200);
}

function moveLeft() {
    // 判断格子是否能够向左移动
    if(!canMoveLeft(board))
        return false;

    isaddedArray(); // 每次循环判断前调用
    //真正的moveLeft函数 // 标准
    for (var i = 0; i<4; i++)
        for(var j = 1; j<4;j++) //每一列的数字不可能向左移动
            if(board[i][j] !=0){
                //(i,j)左侧的元素
                for (var k = 0; k<j; k++){
                    // 落脚位置的是否为空 && 中间没有障碍物
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        // move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    // 落脚位置的数字和本来的数据相等 && 中间没有障碍物
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board)){
                        // move
                        showMoveAnimation(i,j,i,k);
                        // add
                        if(added[i][k]!=0){ // 目标落脚点是否完成过合并
                            board[i][k+1] = board[i][j];
                            board[i][j] = 0;
                        }else{
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            added[i][k] = 1;
                            score += board[i][k]; // 分数变更
                        }
                        continue;
                    }
                }
            }
    setTimeout("updateBoardView()",200);
    return true;
}
// 事件响应循环
$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37://left
            if(moveLeft()){
                // setTimeout("generateOneNumber()",210);
                getScore();
                generateOneNumber();//每次新增一个数字就可能出现游戏结束
                setTimeout("isgameover()",400);//400毫秒
            }
            break;
        case 38: //up
            if(moveUp()){
                getScore();
                generateOneNumber();// 每次新增一个数字就可能出现游戏结束
                setTimeout("isgameover()",400);//400毫秒
            }
            break;
        case 39:
            if(moveRight()){
                getScore();
                generateOneNumber();// 每次新增一个数字就可能出现游戏结束
                setTimeout("isgameover()",400);//400毫秒
            }
            break;
        case 40:
            if(moveDown()){
                getScore();
                generateOneNumber();// 每次新增一个数字就可能出现游戏结束
                setTimeout("isgameover()",400);//400毫秒
            }
            break;
    }
});

// 分数的变更
function getScore() {
    document.getElementById("score").innerHTML = score;
}

//判断游戏结束
// 在随机生成数字的时候判断16宫格中是否还有空间
function nospace(board) {
    for (var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}
//收尾
function nomove(board) {
    if(canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board)){
        return false;
    }
    return true
}
function isgameover() {
    if(onspace(board)&&nomove(board)){
        gameover();
    }
}
function gameover() {
    $("#gameover").css('display','block');
}