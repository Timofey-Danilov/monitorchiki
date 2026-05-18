       // === ПОЛНОЭКРАННЫЙ РЕЖИМ ===
       const gameContainer = document.getElementById('gameContainer');
       const gameWrapper = document.getElementById('gameWrapper');
   
       function toggleFullscreen() {
           if (!document.fullscreenElement) {
               gameContainer.requestFullscreen().catch(err => {
                   alert(`Ошибка: ${err.message}`);
               });
           } else {
               document.exitFullscreen();
           }
       }
   
       // Обработка нажатий только внутри игровой области
       gameWrapper.addEventListener('click', (e) => {
           e.stopPropagation();
           // Фокусируемся на игре для захвата клавиш
           gameWrapper.focus();
       });
   
       // Предотвращаем всплытие событий от кнопок
       const buttons = document.querySelectorAll('button');
       buttons.forEach(btn => {
           btn.addEventListener('click', (e) => {
               e.stopPropagation();
           });
       });
   
       // === ИГРОВАЯ ЛОГИКА (адаптированная) ===
       const canvas = document.getElementById("game");
       const ctx = canvas.getContext("2d");
   
       function resize() {
           canvas.width = Math.min(window.innerWidth * 0.9, 800);
           canvas.height = 260;
       }
   
       resize();
       window.addEventListener("resize", resize);
   
       const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя!@#$%^&*()-_=+[]{}|;:,.<>?/\\~`";
   
       let password = "";
       let hackArray = [];
       let hackIndex = 0;
       let charIndexArray = [];
       let score1 = 0;
       let speed = 6;
       let gravity = 0.6;
       let gameRunning = false;
   
       const dino = {
           x: 80,
           y: 200,
           vy: 0,
           jump: false,
           duck: false
       };
   
       let obstacles = [];
   
       function log(text) {
           const logDiv = document.getElementById("log");
           logDiv.innerHTML += "<div>> " + text + "</div>";
           logDiv.scrollTop = logDiv.scrollHeight;
       }
   
       function startGame() {
           password = document.getElementById("passwordInput").value;
           if (password.length === 0) {
               alert("Введите пароль!");
               return;
           }
   
           document.getElementById("startScreen").style.display = "none";
           document.getElementById("terminal").style.display = "block";
           canvas.style.display = "block";
           document.getElementById("gameControls").style.display = "block";
           
           document.getElementById("password").innerText = password;
           hackArray = new Array(password.length).fill("#");
           charIndexArray = new Array(password.length).fill(0);
           document.getElementById("hack").innerText = hackArray.join("");
           log("🚀 Запуск подбора пароля...");
           log("📏 Длина пароля: " + password.length);
           gameRunning = true;
           
           setInterval(spawnObstacle, 1200);
           gameLoop();
       }
   
       function restartGame() {
           score1 = 0;
           speed = 6;
           gameRunning = true;
           hackArray = new Array(password.length).fill("#");
           hackIndex = 0;
           charIndexArray = new Array(password.length).fill(0);
           document.getElementById("hack").innerText = hackArray.join("");
           document.getElementById("score").innerText = 0;
           obstacles = [];
           document.getElementById("restartBtn").style.display = "none";
           log("🔄 Игра перезапущена!");
       }
   
       function resetGame() {
           location.reload();
       }
   
       function spawnObstacle() {
           if (!gameRunning) return;
           let bird = Math.random() > 0.7;
           obstacles.push({
               x: canvas.width,
               y: bird ? canvas.height - 60 : canvas.height - 40,
               w: bird ? 40 : 20,
               h: bird ? 25 : 40
           });
       }
   
       function jump() {
           if (!dino.jump && gameRunning) {
               dino.vy = -12;
               dino.jump = true;
           }
       }
   
       function duck(v) {
           if (gameRunning) dino.duck = v;
       }
   
       // Управление с клавиатуры (только когда игра активна)
       document.addEventListener("keydown", (e) => {
           if (!gameRunning) return;
           if (e.code === "Space" || e.code === "KeyW" || e.code === "ArrowUp") {
            e.preventDefault();
            jump();
        }
        if ( e.code === "KeyS" ||e.code === "ArrowDown") {
            e.preventDefault();
            duck(true);
        }
       });
   
       document.addEventListener("keyup", (e) => {
           if (e.code === "ArrowDown" || e.code === "KeyS" ) duck(false);
       });
   
       function bruteForce() {
           if (hackIndex >= password.length) return;
           let charPos = charIndexArray[hackIndex];
           hackArray[hackIndex] = charset[charPos];
           if (charset[charPos] === password[hackIndex]) {
               log("🔓 Найден символ: " + password[hackIndex]);
               hackIndex++;
           } else {
               charIndexArray[hackIndex]++;
               if (charIndexArray[hackIndex] >= charset.length)
                   charIndexArray[hackIndex] = 0;
           }
           document.getElementById("hack").innerText = hackArray.join("");
       }
   
       function update() {
           if (!gameRunning) return;
           score1++;
           document.getElementById("score").innerText = score1;
           speed += 0.002;
           dino.vy += gravity;
           dino.y += dino.vy;
           if (dino.y > canvas.height - 40) {
               dino.y = canvas.height - 40;
               dino.jump = false;
           }
           obstacles.forEach(o => o.x -= speed);
           obstacles = obstacles.filter(o => o.x > -50);
           const h = dino.duck ? 20 : 40;
           const y = dino.duck ? dino.y + 20 : dino.y;
           for (let o of obstacles) {
               if (dino.x < o.x + o.w && dino.x + 30 > o.x && y < o.y + o.h && y + h > o.y) {
                   gameRunning = false;
                   log("💥 Столкновение! Система взломана...");
                   document.getElementById("restartBtn").style.display = "inline-block";
               }
           }
           if (Math.random() < 0.1) bruteForce();
           if (hackIndex >= password.length) {
               log("🔑 Пароль взломан!");
               alert("😈 Пароль взломан! Хакер получил доступ!");
               gameRunning = false;
           }
           if (score1 >= 3600) {
               log("✅ Brute force не удался! Пароль надёжен!");
               alert("🎉 Поздравляем! Пароль не удалось взломать!");
               gameRunning = false;
           }
       }
   
       function draw() {
           ctx.clearRect(0, 0, canvas.width, canvas.height);
           ctx.fillStyle = "black";
           const h = dino.duck ? 20 : 40;
           const y = dino.duck ? dino.y + 20 : dino.y;
           ctx.fillRect(dino.x, y, 30, h);
           ctx.fillRect(dino.x + 30, y - 10, 20, 20);
           ctx.fillStyle = "green";
           for (let o of obstacles) {
               ctx.fillRect(o.x, o.y, o.w, o.h);
           }
       }
   
       function gameLoop() {
           update();
           draw();
           if (gameRunning) requestAnimationFrame(gameLoop);
       }