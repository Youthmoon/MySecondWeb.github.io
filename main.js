const canvas = document.getElementById("treasureCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const storyBox = document.getElementById("storyBox");

// 小人对象
let player = { x: 80, y: 300, radius: 15, color: "blue" };

// 场景元素
const house = { x: 50, y: 260, w: 60, h: 60 };
const trap = { x: 350, y: 300, size: 30 };
const treasure = { x: 650, y: 280, w: 50, h: 50 };

// 动画控制
let animating = false;
let treasureGlow = false;

// 更新剧情文字
function updateStory(text) {
  storyBox.innerText = text;
}

// 绘制场景
function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 房子
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(house.x, house.y, house.w, house.h);
  ctx.fillStyle = "#a52a2a";
  ctx.beginPath();
  ctx.moveTo(house.x, house.y);
  ctx.lineTo(house.x + house.w / 2, house.y - 40);
  ctx.lineTo(house.x + house.w, house.y);
  ctx.closePath();
  ctx.fill();

  // 陷阱 (红色叉)
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(trap.x, trap.y);
  ctx.lineTo(trap.x + trap.size, trap.y - trap.size);
  ctx.moveTo(trap.x + trap.size, trap.y);
  ctx.lineTo(trap.x, trap.y - trap.size);
  ctx.stroke();

  // 宝藏 (金色方块)
  ctx.fillStyle = treasureGlow ? "#ffea00" : "#daa520";
  ctx.fillRect(treasure.x, treasure.y, treasure.w, treasure.h);

  // 小人
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
}

// 动画逻辑
async function startAdventure() {
  if (animating) return;
  animating = true;

  updateStory("🏠 探险者从小屋出发，开始踏上旅途...");
  await movePlayerTo(350, 300);

  updateStory("⚠️ 前方出现陷阱！探险者小心翼翼地躲避...");
  await encounterTrap();

  updateStory("✨ 前方出现了闪光！宝藏就在前面！");
  await movePlayerTo(650, 300);

  updateStory("🎉 宝藏找到了！探险者成功完成冒险！");
  await findTreasure();

  animating = false;
}

// 移动函数
function movePlayerTo(targetX, targetY) {
  return new Promise((resolve) => {
    function animate() {
      if (Math.abs(player.x - targetX) > 2) {
        player.x += (targetX - player.x) * 0.05;
      }
      if (Math.abs(player.y - targetY) > 2) {
        player.y += (targetY - player.y) * 0.05;
      }

      drawScene();

      if (Math.abs(player.x - targetX) < 2 && Math.abs(player.y - targetY) < 2) {
        player.x = targetX;
        player.y = targetY;
        drawScene();
        resolve();
      } else {
        requestAnimationFrame(animate);
      }
    }
    animate();
  });
}

// 陷阱事件
function encounterTrap() {
  return new Promise((resolve) => {
    let flashes = 0;
    function flash() {
      player.color = player.color === "blue" ? "red" : "blue";
      drawScene();
      flashes++;
      if (flashes < 6) {
        setTimeout(flash, 200);
      } else {
        player.color = "blue";
        resolve();
      }
    }
    flash();
  });
}

// 宝藏事件
function findTreasure() {
  return new Promise((resolve) => {
    let flashes = 0;
    function glow() {
      treasureGlow = !treasureGlow;
      drawScene();
      flashes++;
      if (flashes < 8) {
        setTimeout(glow, 300);
      } else {
        treasureGlow = true;
        drawScene();
        resolve();
      }
    }
    glow();
  });
}

// 初始绘制
drawScene();

startBtn.addEventListener("click", startAdventure);
