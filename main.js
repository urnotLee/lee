/**
 * Created by Administrator on 2016/9/18/018.
 */

var game={
    data:[],//单元格中的所有数字
    score:0,
    state:0,
    RUNNING:1,
    GAME_OVER:0,
    PLAYING:2,//动画正在播放中
    start:function(){//启动游戏时调用
        this.data=[ [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0]
                  ];
        //在两个随机位置生成2或4
        this.score=0;
        this.state=this.RUNNING;
        var div=document.getElementById("gameOver");
        div.style.display="none";
        this.randomNum();//随机产生2和4两个数
        this.randomNum();
        this.updateView();
    },
    isFull:function(){//判断是否已满
        /*遍历data数组，
         只要发现==0，就返回false
         如果退出循环，就返回true*/
        for(var row=0;row<4;row++){//this.data.length=4
            for(var col=0;col<4;col++){//this.data[row].length=4
                if(this.data[row][col]==0){
                    return false;
                }
            }
        }
        return true;
    },
    randomNum:function(){//在随机位置生成2或4
        /*随机在0到3行中生成一个行下标row
         随机在0到3列中生成一个列下标col
         如果该位置==0，随机选择2或4:如果Math.random()<0.7,选2，否则选4；放入该位置退出循环*/
        if(!this.isFull()){//如果不满就生成
            while(true){
                var row=Math.floor(Math.random()*4);
                var col=Math.floor(Math.random()*4);
                if(this.data[row][col]==0){
                    this.data[row][col]=Math.random()<0.7?2:4;
                    break;
                }
            }
        }
    },

    canLeft:function(){
        /*遍历每个元素（最左侧列除外），只要发现任意元素左侧数==0或者当前值==左侧值return true  如果循环正常结束，  return false*/
        for(var row=0;row<4;row++){
            for(var col=1;col<4;col++){//从左边第二列开始
                if(this.data[row][col]!=0){
                    if(this.data[row][col-1]==0||this.data[row][col]==this.data[row][col-1]){
                        return true;
                    }
                }
            }
        }
        return false;
    },
    moveLeft:function(){//实现左移所有行
        if(this.canLeft()){//先判断能否左移
            for(var row=0;row<4;row++){
                this.moveLeftInRow(row);
            }
            this.state=this.PLAYING;
            animation.start();
            setTimeout(function(){
                game.state=game.RUNNING;
                game.randomNum();
                game.updateView();

            },animation.times*animation.interval);

        }
    },
    moveLeftInRow:function(row){//左移一行
        /*从0位置开始到2结束遍历row行中的每个元素  获得一个下一个不为0的元素的nextCol下标
         如果nextCol==-1，break；
         否则，判断合并
         如果自己==0，用下一个元素的值替换自己，将下一个元素的值设为0，让col留在原地：col--
         如果自己==下一个元素 将自己*2； 将下一个元素设为0*/
        for(var col=0;col<=2;col++){
            var nextCol=this.getNextRight(row,col);
            if(nextCol==-1){
                break;
            }else{
                if(this.data[row][col]==0){
                    this.data[row][col]=this.data[row][nextCol];
                    this.data[row][nextCol]=0;
                    animation.addTask(""+row+nextCol,""+row+col);
                    col--;

                }else if(this.data[row][col]==this.data[row][nextCol]){
                    this.data[row][col]*=2;
                    this.score+=this.data[row][col];
                    this.data[row][nextCol]=0;
                    animation.addTask(""+row+nextCol,""+row+col);
                }
            }
        }
    },
    getNextRight:function(row,col){//获得当前行中，指定位置右侧第一个不为0的数，返回下一个为0的数的位置
        /*遍历当前位置右侧每个元素	只要发现！=0的，就返回其位置下标nextCol 退出循环，返回-1*/
        for(var i=col+1;i<4;i++){
            if(this.data[row][i]!=0){
                return i;
            }
        }
        return -1;
    },

    canRight:function(){//判断能否右移
        for(var row=0;row<4;row++){
            for(var col=2;col>=0;col--){
                if(this.data[row][col]!=0){
                    if(this.data[row][col+1]==0||this.data[row][col]==this.data[row][col+1]){
                        return true;
                    }
                }
            }
        }
        return false;
    },
    moveRight:function(){//向右移动所有行
        if(this.canRight()){
            for(var row=0;row<4;row++){
                this.moveRightInRow(row);
            }
            this.state=this.PLAYING;
            animation.start();
            setTimeout(function(){
                game.state=game.RUNNING;
                game.randomNum();
                game.updateView();

            },animation.times*animation.interval);
        }
    },
    moveRightInRow:function(row){//右移当前行
        /*从右向左遍历检查，（最左边元素除外）*/
        for(var col=3;col>0;col--){
            var nextCol=this.getNextLeft(row,col);
            if(nextCol==-1){
                break;
            }else{
                if(this.data[row][col]==0){
                    this.data[row][col]=this.data[row][nextCol];
                    this.data[row][nextCol]=0;
                    animation.addTask(""+row+nextCol,""+row+col);
                    col++;
                }else if(this.data[row][col]==this.data[row][nextCol]){
                    this.data[row][col]*=2;
                    this.score+=this.data[row][col];
                    this.data[row][nextCol]=0;
                    animation.addTask(""+row+nextCol,""+row+col);
                }
            }
        }
    },
    getNextLeft:function(row,col){
        /*从当前位置向左，找下一个不为0的数*/
        for(var i=col-1;i>=0;i--){
            if(this.data[row][i]!=0){
                return i;
            }
        }
        return -1;
    },

    canUp:function(){
        for(var row=1;row<4;row++){
            for(var col=0;col<4;col++){
                if(this.data[row][col]!=0){
                    if(this.data[row-1][col]==0||this.data[row][col]==this.data[row-1][col]){
                        return true;
                    }
                }
            }
        }
        return false;
    },
    moveUp:function(){
        if(this.canUp()){//先判断能否左移
            for(var col=0;col<4;col++){
                this.moveUpInCol(col);
            }
            this.state=this.PLAYING;
            animation.start();
            setTimeout(function(){
                game.state=game.RUNNING;
                game.randomNum();
                game.updateView();

            },animation.times*animation.interval);
        }
    },
    moveUpInCol:function(col){
        for(var row=0;row<3;row++){
            var nextRow=this.getNextDown(row,col);
            if(nextRow==-1){
                break;
            }else{
                if(this.data[row][col]==0){
                    this.data[row][col]=this.data[nextRow][col];
                    this.data[nextRow][col]=0;
                    animation.addTask(""+nextRow+col,""+row+col);
                    row--;
                }else if(this.data[row][col]==this.data[nextRow][col]){
                    this.data[row][col]*=2;
                    this.score+=this.data[row][col];
                    this.data[nextRow][col]=0;
                    animation.addTask(""+nextRow+col,""+row+col);
                }
            }
        }
    },
    getNextDown:function(row,col){
        for(var i=row+1;i<4;i++){
            if(this.data[i][col]!=0){
                return i;
            }
        }
        return -1;
    },

    canDown:function(){//判断能否右移
        for(var row=2;row>=0;row--){
            for(var col=0;col<4;col++){
                if(this.data[row][col]!=0){
                    if(this.data[row+1][col]==0||this.data[row][col]==this.data[row+1][col]){
                        return true;
                    }
                }
            }
        }
        return false;
    },
    moveDown:function(){//向右移动所有行
        if(this.canDown()){
            for(var col=0;col<4;col++){
                this.moveDownInCol(col);
            }
            this.state=this.PLAYING;
            animation.start();
            setTimeout(function(){
                game.state=game.RUNNING;
                game.randomNum();
                game.updateView();

            },animation.times*animation.interval);
        }
    },
    moveDownInCol:function(col){//右移当前行
        /*从右向左遍历检查，（最左边元素除外）*/
        for(var row=3;row>0;row--){
            var nextRow=this.getNextUp(row,col);
            if(nextRow==-1){
                break;
            }else{
                if(this.data[row][col]==0){
                    this.data[row][col]=this.data[nextRow][col];
                    this.data[nextRow][col]=0;
                    animation.addTask(""+nextRow+col,""+row+col);
                    row++;
                }else if(this.data[row][col]==this.data[nextRow][col]){
                    this.data[row][col]*=2;
                    this.score+=this.data[row][col];
                    this.data[nextRow][col]=0;
                    animation.addTask(""+nextRow+col,""+row+col);
                }
            }
        }
    },
    getNextUp:function(row,col){
        /*从当前位置向左，找下一个不为0的数*/
        for(var i=row-1;i>=0;i--){
            if(this.data[i][col]!=0){
                return i;
            }
        }
        return -1;
    },

    /*将游戏数据整体更新到页面上*/
    updateView:function(){
        /*step1.遍历二维数组中的每个元素
         step2：找到当前元素对应的div
         拼div的id：c+row+col
         var div=document.getElementById(id)；
         step3：将当前元素的值放入div中
         如果当前值==0，就放入“”，div.innerHTML=?
         否则放入当前值
         step4：根据当前元素值修改div样式类
         div.className="类名";
         如果当前值==0，className=“cell”；
         否则className=“cell n”+当前值*/
        for(var row=0;row<4;row++){
            for(var col=0;col<4;col++){
                var cell=document.getElementById("c"+row+col);
                cell.innerHTML=this.data[row][col]==0?"":this.data[row][col];
                cell.className=this.data[row][col]==0?"cell":"cell n"+this.data[row][col];
            }
        }
        /*将分数放入span*/
        var span=document.getElementById("score");
        span.innerHTML=this.score;
        /*判断游戏结束
         如果游戏结束，this.state=GAME_OVER
         显示游戏结束div
         找到gameOverdiv
         修改div的style.display*/
        if(this.isGameOver()){
            this.state=this.GAME_OVER;
            var div=document.getElementById("gameOver");
            var finalSocre=document.getElementById("finalScore");
            finalSocre.innerHTML=this.score;
            div.style.display="block";
        }
        /*if(this.state==this.RUNNING){
         var div=document.getElementById("gameOver");
         div.style.display="none";
         }*/
    },

    isGameOver:function(){//判断游戏是否结束
        /*能继续时返回false，否则返回true*/
        if(!this.isFull()){return false;}
        /*已经满了*/	/*if(this.canLeft()||this.canRight()||this.canUp()||this.canDown()){return false;}
         else{return ture;}*/
        for(var row=0;row<4;row++){
            for(var col=0;col<4;col++){
                //if(this.data[row][col==0]){return false;}
                if(col<3){/*检查右侧相邻*/
                    if(this.data[row][col]==this.data[row][col+1]){
                        return false;
                    }
                }
                if(row<3){/*检查下方相邻*/
                    if(this.data[row][col]==this.data[row+1][col]){
                        return false;
                    }
                }
            }
        }
        return true;
    }
};

//当窗口加载后，调用game对象的start方法
window.onload=function(){//事件处理函数
    game.start();
    document.onkeydown=function(){
        /*step1：先获得事件对象！
         所有事件发生时，都自动创建一个event对象
         event对象中封装了事件信息，比如：鼠标的坐标，触发事件的元素，按键的编号
         step2：获得事件对象中的按键编号
         如果是37号，就调用moveLeft
         */
        if(game.state!=game.PLAYING){
            var event=window.event||arguments[0];//||经常用于解决浏览器兼容性问题
            if(game.state==game.RUNNING){
                if(event.keyCode==37){
                    game.moveLeft();
                }else if(event.keyCode==39){
                    game.moveRight();
                }
                else if(event.keyCode==38){
                    game.moveUp();
                }
                else if(event.keyCode==40){
                    game.moveDown();
                }
            }else if(event.keyCode==13){
                game.start();
            }
        }
    }
};

// animation
function Task(obj,topStep,leftStep){
    this.obj=obj;
    this.topStep=topStep;
    this.leftStep=leftStep;
}
/*moveStep方法将当前元素对象移动一步*/
Task.prototype.moveStep=function(){
    var style=getComputedStyle(this.obj,null);
    var top=parseInt(style.top);
    var left=parseInt(style.left);
    this.obj.style.top=top+this.topStep+"px";
    this.obj.style.left=left+this.leftStep+"px";
};
/*清楚元素对象的样式，使其返回原地*/
Task.prototype.clear=function(){
    this.obj.style.left="";
    this.obj.style.top="";
};
var animation={
    times:10,//每个动画10步完成
    interval:10,//10毫秒迈一步
    timer:null,//保存定时器id的属性
    tasks:[],//保存每次需要移动的任务

    addTask:function(source,target){
        console.log(source+","+target);
        var sourceDiv=document.getElementById("c"+source);
        var targetDiv=document.getElementById("c"+target);
        var sourceStyle=getComputedStyle(sourceDiv);
        var targetStyle=getComputedStyle(targetDiv);
        var topStep=(parseInt(targetStyle.top)-parseInt(sourceStyle.top))/this.times;
        var leftStep=(parseInt(targetStyle.left)-parseInt(sourceStyle.left))/this.times;
        var task=new Task(sourceDiv,topStep,leftStep);
        this.tasks.push(task);
    },

    start:function(){
        this.timer=setInterval(function(){
            for(var i=0;i<animation.tasks.length;i++){
                animation.tasks[i].moveStep();
            }
            animation.times--;
            if(animation.times==0){
                for(var i=0;i<animation.tasks.length;i++){
                    animation.tasks[i].clear();
                }
                clearInterval(animation.timer);
                animation.timer=null;
                animation.tasks=[];
                animation.times=10;
            }
        },this.interval);
    }
};