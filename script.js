
const player = document.getElementById("player");
const gameContainer = document.getElementById("game-container");
const colorInput = document.getElementById("colorInput");
const output = document.getElementById("output");
const borderLeft = 26;
const borderRight = 776;
const gameOverElement = document.getElementById("game-over");

const playerWidth = player.offsetWidth;
const playerHeight = player.offsetHeight;
const gameWidth = gameContainer.offsetWidth;
const gameHeight = gameContainer.offsetHeight;
const playableWidth = gameWidth - playerWidth;
const playableHeight = gameHeight - playerHeight;
let result = output;
let gameActive = true;
let playerPosition = 26;
player.style.left = `${playerPosition}px`;
let score = 10;

const startButton = document.getElementById("start-button");
gameContainer.style.display = "none";

// Função para iniciar o jogo
function startGame() {
  gameOver = false;
  gameOverElement.style.display = "none";
  startButton.style.display = "none";
  gameContainer.style.display = "block";
  enemyPosition = 700;
  playerPosition = 26;
  score = 10;
  updateScore();
  gameOverElement.classList.remove("game-over");
  gameLoop();
}

// Adicionar evento de clique para o botão "Start"
startButton.addEventListener("click", startGame);
const enemy = document.getElementById("enemy");
let enemyPosition = 700;
enemy.style.left = `${enemyPosition}px`;

function moveEnemy() {

  if (!gameOver) {
    const enemySpeed = 2; // Velocidade do inimigo
    const playerCenterX = playerPosition + playerWidth / 2;
    const enemyCenterX = enemyPosition + playerWidth / 2;

    if (playerCenterX < enemyCenterX) {
      enemyPosition -= enemySpeed;
    } else if (playerCenterX > enemyCenterX) {
      enemyPosition += enemySpeed;
    }

    if (enemyPosition < borderLeft - playerWidth) {
      enemyPosition = borderLeft + playerWidth; // Limitar o inimigo na borda esquerda
    } else if (enemyPosition > borderRight - playerWidth) {
      enemyPosition = borderRight - playerWidth; // Limitar o inimigo na borda direita
    }

    enemy.style.left = `${enemyPosition}px`;
  }
}


setInterval(moveEnemy, 20);


let gameOver = false;

function showGameOver() {

  gameOverElement.style.display = "block";
  startButton.style.display = "block";
  enemyPosition = 700;
  enemy.style.left = `${enemyPosition}px`;
  score = 10;
  updateScore();



}

function checkCollision() {
  if (!gameOver) {
    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    if (
      playerRect.left < enemyRect.right &&
      playerRect.right > enemyRect.left &&
      playerRect.top < enemyRect.bottom &&
      playerRect.bottom > enemyRect.top
    ) {
      const playerCenterX = playerRect.left + playerWidth / 2;
      const enemyCenterX = enemyRect.left + playerWidth / 2;

      if (playerCenterX < enemyCenterX) {
        playerPosition -= 50;
        if (playerPosition < borderLeft) {
          playerPosition = borderLeft;
        }
        player.style.left = `${playerPosition}px`;
      } else {
        playerPosition += 50;
        if (playerPosition > borderRight - playerWidth) {
          playerPosition = borderRight - playerWidth;
        }
        player.style.left = `${playerPosition}px`;
      }

      if (result.textContent !== "fogo") {
        score -= 1;
        updateScore();
        if (score <= 0) {
          gameOver = true;
          showGameOver();
        }
      }
    }
  }
}

// ... (seu código existente)


setInterval(moveEnemy, 50);

document.addEventListener("keydown", (event) => {
  if (!gameOver) {
    if (event.key === "ArrowLeft" && playerPosition > 0 && playerPosition > borderLeft) {
      playerPosition -= 10;
    } else if (event.key === "ArrowRight" && playerPosition < borderRight) {
      playerPosition += 10;
    }

    player.style.left = `${playerPosition}px`;
  }
});

document.addEventListener("keydown", (event) => {
  if (gameActive) {
    if (event.key === " ") {
      shoot();
    }
  }
});


function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = score; // Atualizar o conteúdo do elemento #score
}

let isJumping = false;
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && !isJumping && !gameOver) {
    isJumping = true;
    const jumpHeight = playerHeight * 2.2; // Altura do salto
    const groundHeight = 24; // Altura do novo chão
    const maxJumpHeight = jumpHeight + groundHeight; // Altura máxima do salto
    let jumpStep = 0;
    score += 1;
    updateScore();

    const jumpInterval = setInterval(() => {
      jumpStep++;
      if (jumpStep <= maxJumpHeight) { // Verificar se ainda está dentro do salto
        player.style.bottom = `${jumpStep + groundHeight}px`; // Adicionar a altura do chão
      } else {
        clearInterval(jumpInterval);
        const fallInterval = setInterval(() => {
          if (jumpStep > 0) {
            jumpStep--;
            player.style.bottom = `${jumpStep + groundHeight}px`; // Adicionar a altura do chão
          } else {
            clearInterval(fallInterval);
            isJumping = false;
            player.style.bottom = `${groundHeight}px`; // Resetar a posição vertical do jogador para o chão
          }
        }, 8); // Aumentar a velocidade de queda
      }
    }, 5); // Aumentar a velocidade de subida
  }
});

var codeEditor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
  mode: 'javascript',
  lineNumbers: true,
  firstLineNumber: 1,
  theme: 'default',
  extraKeys: {
    'Ctrl-Space': 'autocomplete'
  }
});

codeEditor.on('keyup', function (cm, event) {
  if (!cm.state.completionActive && event.key.match(/^[a-zA-Z]$/)) {
    CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
  }
});

let runButton = document.getElementById('run-button');
let outputContainer = document.getElementById('output');

runButton.addEventListener('click', function () {
  outputContainer.innerHTML = ''; // Limpar o conteúdo da div de saída
  let code = codeEditor.getValue();
  try {
    let originalConsoleLog = console.log;
    console.log = function (message) {
      originalConsoleLog.apply(console, arguments);
      outputContainer.innerHTML = message + '<br>';
    };
    eval(code);
    if (result.textContent === "fogo") {
      player.style.backgroundColor = "red";
    } else {
      player.style.backgroundColor = "#007bff";
    }
  } catch (error) {
    outputContainer.textContent = 'Erro: ' + error.message;
  }
});

const projectile = document.getElementById("projectile");
let isProjectileActive = false; // Variável para controlar se o projétil está ativo

function shoot() {
  if (!isProjectileActive) {
    isProjectileActive = true;

    const projectileWidth = 12.5; // metade da largura do projétil
    const projectileHeight = 12.5; // metade da altura do projétil
    const playerBottomValue = parseInt(player.style.bottom);

    const playerCenterX = playerPosition + playerWidth / 2;
    let projectilePosition = playerCenterX - projectileWidth / 2; // Define a posição inicial do projétil
    projectile.style.left = `${projectilePosition}px`;
    projectile.style.bottom = `${playerBottomValue + 16}px`;

    if(projectile.style.bottom === ""){
      projectile.style.bottom = "40px"
    }

    projectile.style.display = "block"; // Exibe o projétil

    const shootInterval = setInterval(() => {
      projectilePosition += 5; // Ajuste a velocidade de movimento do projétil

      if (projectilePosition > gameWidth) {
        clearInterval(shootInterval);
        projectile.style.display = "none"; // Oculta o projétil quando atingir a borda
        isProjectileActive = false; // O projétil não está mais ativo
      }

      projectile.style.left = `${projectilePosition}px`;

      // Verificar colisão entre projetil e inimigo
      const projectileRect = projectile.getBoundingClientRect();
      const enemyRect = enemy.getBoundingClientRect();

      if (
        projectileRect.left < enemyRect.right &&
        projectileRect.right > enemyRect.left &&
        projectileRect.top < enemyRect.bottom &&
        projectileRect.bottom > enemyRect.top
      ) {
        clearInterval(shootInterval);
        projectile.style.display = "none"; // Oculta o projétil quando atingir o inimigo
        isProjectileActive = false; // O projétil não está mais ativo

        // "Matar" o inimigo
        enemy.style.display = "none";
      }
    }, 20); // Intervalo de atualização do movimento do projétil
  }
}


document.addEventListener("keydown", (event) => {
  if (event.key === " ") { // Espaço para atirar
    shoot();
  }
});


function gameLoop() {
  checkCollision();
  requestAnimationFrame(gameLoop);
}
gameLoop();
