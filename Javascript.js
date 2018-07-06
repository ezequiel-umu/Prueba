    const brickColours = {
      1: "#FF0040",
      2: "#0000FF",
      3: "#000000",
    };

    const angulo = Math.random() * Math.PI/4 + Math.PI/4;
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width/2;
    var y = canvas.height-30;
    var dx = Math.cos(angulo)*7;
    var dy = Math.sin(angulo)*-7;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width-paddleWidth)/2;
    const paddleY = canvas.height-paddleHeight;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 5;
    var brickColumnCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var lives = 3;
    var bricks = [];
    var dead = false;
    var cambio = false;

    for(var c=0; c<brickColumnCount; c++) {
      bricks[c] = [];
      for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 3 };
      }
    }
    
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener("click", mouseClickHandler, false);
    document.addEventListener("touchmove", handleMove, false);

    function keyDownHandler(e) {
      if(e.keyCode == 39) {
        rightPressed = true;
      }
      else if(e.keyCode == 37) {
        leftPressed = true;
      }
    }
    function keyUpHandler(e) {
      if(e.keyCode == 39) {
        rightPressed = false;
      }
      else if(e.keyCode == 37) {
        leftPressed = false;
      }
    }
    function mouseMoveHandler(e) {
      let relativeX = e.clientX - canvas.offsetLeft;
      if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
      }
    }


    function handleMove(evt){
      const primerDedo = evt.touches[0];
      let relativeX = primerDedo.clientX - canvas.offsetLeft;
      if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
      }
    }

    function mouseClickHandler(e) {
        const angulo = Math.random() * Math.PI/4 + Math.PI/4; 
      if (dead) {
        click = true;
        x = canvas.width/2;
        y = canvas.height-30;
        dx = Math.cos(angulo)*7 ;
        dy = Math.sin(angulo)*-7 ;
        paddleX = (canvas.width-paddleWidth)/2;
        dead = false;
      }
    }
    function collisionDetection() {
      for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
          let b = bricks[c][r];
          if(b.status >= 1) {
            if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
              dy = -dy;
              b.status -= 1;
              score++;
              if(score == (brickRowCount*brickColumnCount)*3) {
                alert("Has ganado consiguiendo "+score+" puntos, Felicidades!");
                document.location.reload();
              }
            }
          }
        }
      }
    }
    
    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI*2);
      ctx.fillStyle = "#FF00FF";
      ctx.fill();
      ctx.closePath();
    }
    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#000000";
      ctx.fill();
      ctx.closePath();
    }
    function drawBricks() {
      for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
          const brick = bricks[c][r];
          if(brick.status >= 1) {
            let brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
            let brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = brickColours[brick.status];
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }
    function drawScore() {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#0095DD";
      ctx.fillText("Score: "+score, 8, 20);
    }
    function drawLives() {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#0095DD";
      ctx.fillText("Lives: "+lives, canvas.width-65, 20);
    }
   
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      drawLives();
      collisionDetection();
    
      if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if(y + dy < ballRadius) {
        dy = -dy;
      }
      else if(y> paddleY - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
          const hipotenusa = Math.hypot((x - paddleX - paddleWidth/2), y - paddleY);
          dy = ((y - paddleY) / hipotenusa)*7;
          dx = ((x - paddleX - paddleWidth/2) / hipotenusa)*7;
        }
        else {
          dead = true;
          lives--;
            x = canvas.width/2;
            y = canvas.height-50;
            dx = 0;
            dy = 0;
          if(!lives) {
            alert("Unlucky Busta");
            document.location.reload();
        }
      }
    }
    
    
      if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 10;
      }
      else if(leftPressed && paddleX > 0) {
        paddleX -= 10;
      }
    
      x += dx;
      y += dy;
      requestAnimationFrame(draw);
    }
    
    draw();