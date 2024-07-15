window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 120, // 再次增大球的半径
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
        ball.dx = gamma / 0.625; // 再次加快移动速度
        ball.dy = beta / 0.625; // 再次加快移动速度
    }

    function drawBall() {
        // 绘制有重量感的黑色钢球，并增加金属光泽
        let gradient = ctx.createRadialGradient(ball.x - 40, ball.y - 40, ball.radius - 40, ball.x, ball.y, ball.radius);
        gradient.addColorStop(0, "#FFFFFF"); // 金属光泽
        gradient.addColorStop(0.2, "#AAAAAA"); // 过渡色
        gradient.addColorStop(1, "#000000"); // 黑色

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

    function explode() {
        let explosionRadius = ball.radius * 2;
        let explosionGradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, explosionRadius);
        explosionGradient.addColorStop(0, 'rgba(255, 69, 0, 1)'); // 内部为红色
        explosionGradient.addColorStop(0.3, 'rgba(255, 140, 0, 0.8)'); // 中间为橙色
        explosionGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.6)'); // 边缘为黄色
        explosionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // 最外层为透明

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, explosionRadius, 0, Math.PI * 2);
        ctx.fillStyle = explosionGradient;
        ctx.fill();
        ctx.closePath();
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
            explode();
            setTimeout(() => alert("Game Over! Your score: " + score), 200); // 延迟以显示爆炸效果
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
        interval = setInterval(draw, 12.5); // 再次减少间隔时间以加快速度
    }

    canvas.addEventListener('click', function() {
        if (gameOver) {
            startGame();
        }
    });

    startGame();
};
