window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 60, // 再次增大球的半径
        dx: 0,
        dy: 0
    };
    let gameOver = false;
    let score = 0;
    let interval;
    
    // 加速度传感器事件
    window.addEventListener("deviceorientation", handleOrientation, true);

    function handleOrientation(event) {
        let gamma = event.gamma; // 左右倾斜
        let beta = event.beta; // 前后倾斜
        ball.dx = gamma / 1.25; // 再次加快移动速度
        ball.dy = beta / 1.25; // 再次加快移动速度
    }

    function drawBall() {
        // 绘制有重量感的黑色钢球
        let gradient = ctx.createRadialGradient(ball.x - 20, ball.y - 20, ball.radius - 20, ball.x, ball.y, ball.radius);
        gradient.addColorStop(0, "#000000");
        gradient.addColorStop(1, "#333333");

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    }

    function drawScore() {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 20);
    }

    function draw() {
        if (gameOver) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawScore();

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0 ||
            ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            gameOver = true;
            clearInterval(interval);
            alert("Game Over! Your score: " + score);
        } else {
            score++;
        }
    }

    function startGame() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = 0;
        ball.dy = 0;
        score = 0;
        gameOver = false;
        interval = setInterval(draw, 25); // 再次减少间隔时间以加快速度
    }

    canvas.addEventListener('click', function() {
        if (gameOver) {
            startGame();
        }
    });

    startGame();
};
