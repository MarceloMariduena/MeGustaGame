let myGamePiece;
let myObstacles = []; 
let myGameArea = {
	canvas: document.getElementById("canvas"),
	start(){
    	this.canvas.width = 750;
        this.canvas.height = 550;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        this.frameNo = 0;
    },
    clear(){
    	this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    },
    stop(){
    	clearInterval(this.interval);
    }
}

function startGame() {
	myGameArea.start();
    myGamePiece = new component(40, 40, "meGusta1.png",10,120, "image");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
}

function component(width, height, color, x, y, type){
	this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.type = type;
    
    if (type == "image"){
    	this.image = new Image();
        this.image.src = color;
    }
    
    this.newPos = () => {
    	this.x += this.speedX;
        this.y += this.speedY;
    };
    
    this.update = () => {
    	ctx = myGameArea.context;
        ctx.fillStyle = color;
        if (type == "text"){
        	ctx.font = this.width + " " + this.height;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (type == "image")
        	ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        else 
        	ctx.fillRect(this.x, this.y, this.width, this.height);
    };    
    
    this.crash = (otherobj) => {
    	let myleft = this.x;
        let myright = this.x + this.width;
        let mytop = this.y;
        let mybottom = this.y + this.height;
        let otherleft = otherobj.x;
        let otherright = otherobj.x + otherobj.width;
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + otherobj.height;
        let crashed = true;
        if ((mybottom < othertop) || (mytop > otherbottom) ||(myright < otherleft) || (myleft > otherright))
        	crashed = false;
        return crashed;
    };
}

function updateGameArea(){
	for (i = 0; i < myObstacles.length; i += 1){
    	if (myGamePiece.crash(myObstacles[i])){
        	myGameArea.stop();
            let ok = confirm("Try again?");
            if (ok){
            	myGamePiece.x = 10;
                myGamePiece.y = 120;
                myGamePiece.speedX = 0;
                myGamePiece.speedY = 0;
                myGameArea.frameNo = 0;
                myGameArea.interval = setInterval(updateGameArea, 20);
                myObstacles = [];
            }
            else
            	return;
        }
    }
    
    myGameArea.clear();
    
    myGameArea.frameNo += 1;
    let x = myGameArea.canvas.width;
    if (myGameArea.frameNo == 1 || everyInterval(150)){
    	minHeight = 20;
        maxHeight = 200;
        height = Math.floor((Math.random()*(maxHeight - minHeight + 1)) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor((Math.random()*(maxGap - minGap + 1)) + minGap);
        myObstacles.push(new component(10, height, "blue", x, 0));
        myObstacles.push(new component(10, x-height-gap, "blue", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1){
    	myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    
    myGamePiece.newPos();
    myGamePiece.update();
    
    myScore.text = "SCORE: " + Math.floor(myGameArea.frameNo/10);
    myScore.update();
}

function everyInterval(n){
	if((myGameArea.frameNo % n) == 0)
    	return true;
    return false;
}

function moveUp(){
	myGamePiece.speedY -= 1;
}

function moveDown(){
	myGamePiece.speedY += 1;
}

function moveLeft(){
	myGamePiece.speedX -= 1;
    myGamePiece.image.src = "meGusta2.png";
}

function moveRight(){
	myGamePiece.speedX += 1;
    myGamePiece.image.src = "meGusta1.png";
}

function clearMove(){
    myGamePiece.speedY = 0;
	myGamePiece.speedX = 0;
}