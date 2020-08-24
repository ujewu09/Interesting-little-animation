//自调用函数   初始化食物
(function() {
    var elements = [];

    function Food(x, y, width, height, color) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 20;
        this.height = height || 20;
        this.color = color || "black";
    }
    Food.prototype.init = function(map) {
        remove();
        //创建div
        var div = document.createElement("div");
        map.appendChild(div);
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = this.color;
        div.style.position = "absolute";
        this.x = parseInt(Math.random() * (map.offsetWidth / this.width)) * this.width;
        this.y = parseInt(Math.random() * (map.offsetHeight / this.height)) * this.height;
        div.style.left = this.x + "px";
        div.style.top = this.y + "px";
        elements.push(div);
    }

    function remove(map) {
        for (var i = 0; i < elements.length; i++) {
            var div = elements[i];
            div.parentNode.removeChild(div);
            //移除第i除的1个元素
            elements.splice(i, 1);
        }
    }
    window.Food = Food;
}());
//自调用函数  小蛇
(function() {
    function Snake(width, height, direction) {
        this.width = width || 20;
        this.height = height || 20;
        this.direction = direction || "right";
        this.body = [{
            x: 2,
            y: 0,
            color: "red"
        }, {
            x: 1,
            y: 0,
            color: "orange"
        }, {
            x: 0,
            y: 0,
            color: "orange"
        }];
        that = this;
    }
    var snElements = [];
    Snake.prototype.init = function(map) {
        //添加前先移除已经存在的内容
        var j = snElements.length - 1;
        for (; j >= 0; j--) {
            var div = snElements[j];
            div.parentNode.removeChild(div);
            snElements.splice(j, 1)
        }
        //添加内容
        for (var i = 0; i < this.body.length; i++) {
            var div = document.createElement("div");
            div.style.width = this.width + "px";
            div.style.height = this.height + "px";
            div.style.position = "absolute";
            div.style.backgroundColor = this.body[i].color;
            //设置横纵坐标
            div.style.left = this.body[i].x * this.width + "px";
            div.style.top = this.body[i].y * this.height + "px";
            map.appendChild(div);
            snElements.push(div);
        }

    };
    /**
     * 蛇移动与吃食物
     **/
    Snake.prototype.move = function(food) {
        //是否吃到食物
        var isNeedAdd = false;
        //用于存储body边之前的内容，便于body的增减
        var bodye = copy(this.body, true);
        //蛇头
        switch (this.direction) {
            case "right":
                this.body[0].x = this.body[0].x + 1;
                break;
            case "left":
                this.body[0].x = this.body[0].x - 1;
                break;
            case "top":
                this.body[0].y = this.body[0].y - 1;
                break;
            case "bottom":
                this.body[0].y = this.body[0].y + 1;
                break;
        }
        //蛇头已经位移后判断是否吃到食物
        if ((this.body[0].x) * this.width == food.x && (this.body[0].y) * this.height == food.y) {
            //吃到了食物
            var addObj = {
                x: bodye[0].x,
                y: bodye[0].y,
                color: bodye[1].color
            }
            this.body.splice(1, 0, addObj);
            isNeedAdd = true;
            console.log(this.body);
        } else {
            //移动
            //蛇身
            var i = this.body.length - 1;
            for (; i > 0; i--) {
                this.body[i].x = bodye[i - 1].x;
                this.body[i].y = bodye[i - 1].y;
            };
        }
        return isNeedAdd;
    }
    window.Snake = Snake;
}());
//游戏对象
(function() {
    var timer;

    function Game(map) {
        this.map = map;
        this.food = new Food();
        this.snake = new Snake();
        that = this;
        this.timer = undefined;
    }

    Game.prototype.init = function() {
        this.snake.init(this.map);
        this.getFood();
        this.run();
        this.keyDown();
    }

    Game.prototype.run = function() {
        this.timer = setInterval(function() {
            //移动 并判断是否吃到了食物
            if (this.snake.move(this.food)) {
                //吃到了刷新内容
                this.getFood();
            }
            //超出map范围，输了
            if ((this.snake.body[0].x + 1) * this.snake.width > parseInt(getStyle(this.map, "width")) ||
                (this.snake.body[0].x) * this.snake.width < 0 ||
                (this.snake.body[0].y + 1) * this.snake.height > parseInt(getStyle(this.map, "height")) ||
                (this.snake.body[0].y) * this.snake.height < 0) {
                clearTimeout(this.timer);
                alert("你输了");
            } else {
                this.snake.init(this.map);
            }

        }.bind(that), 150);
    }

    Game.prototype.keyDown = function() {
        addEventListener("keydown", function() {
            var keyCode = arguments[0].keyCode;

            if (keyCode == 40 || keyCode == 38) {
                if (this.snake.direction == "bottom" || this.snake.direction == "top") {
                    return;
                }
            } else if (keyCode == 37 || keyCode == 39) {
                if (this.snake.direction == "left" || this.snake.direction == "right") {
                    return;
                }
            } else if (keyCode == 32) {
                //暂停
                console.dir(this.timer);
            }

            switch (arguments[0].keyCode) {
                //下
                case 40:
                    this.snake.direction = "bottom";
                    break;
                //上
                case 38:
                    this.snake.direction = "top";
                    break;
                //左
                case 37:
                    this.snake.direction = "left";
                    break;
                case 39:
                    this.snake.direction = "right";
                    break;
            }
        }.bind(that), false);
    }

    /**
     * 作用 获取/生成食物
     *  要求：获取或生成时蛇与食物的位置不覆盖
     * **/
    Game.prototype.getFood = function() {
        this.food.init(this.map);
        var body = this.snake.body;
        for (var i = 0; i < body.length; i++) {
            if (this.food.x == body.x * body.width && this.food.y == body.height * body.y) {
                this.getFood();
            }
        }

    }
    window.Game = Game;
}());

var game = new Game(document.querySelector(".bg"));
game.init();