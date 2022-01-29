let frames = 0;

const som_hit = new Audio();
som_hit.src = "./musics/hit.wav";

// Criando uma nova imagem via javascript
const sprites = new Image();
sprites.src = "./sprites.png";

// Pegando o canvas que contem no html
const canvas = document.querySelector("canvas");

// Pegando o contexto do canvas que será bidimensional
const contexto = canvas.getContext("2d");

const fazColisao = (flappyBird, chao) => {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = globais.chao.y;

  if (flappyBirdY >= chaoY) {
    return true;
  }

  return false;
};

const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = "#70c5ce";
    contexto.fillRect(0, 0, canvas.width, canvas.height);
    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX,
      planoDeFundo.spriteY,
      planoDeFundo.largura,
      planoDeFundo.altura,
      planoDeFundo.x,
      planoDeFundo.y,
      planoDeFundo.largura,
      planoDeFundo.altura
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX,
      planoDeFundo.spriteY,
      planoDeFundo.largura,
      planoDeFundo.altura,
      planoDeFundo.x + planoDeFundo.largura,
      planoDeFundo.y,
      planoDeFundo.largura,
      planoDeFundo.altura
    );
  },
};

const criaChao = () => {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX,
        chao.spriteY,
        chao.largura,
        chao.altura,
        chao.x,
        chao.y,
        chao.largura,
        chao.altura
      );
      contexto.drawImage(
        sprites,
        chao.spriteX,
        chao.spriteY,
        chao.largura,
        chao.altura,
        chao.x + chao.largura,
        chao.y,
        chao.largura,
        chao.altura
      );
    },
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = (chao.x = chao.x - movimentoDoChao);

      // Forma para perga o resto da divisão para sempre repetir o chão
      chao.x = movimentacao % repeteEm;
    },
  };

  return chao;
};

const criaFlappyBird = () => {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    velocidade: 0,
    gravidade: 0.25,
    pula() {
      // Toda vez que eu clickar ele deve diminuir a velocidade desse objeto
      flappyBird.velocidade = -flappyBird.pulo;
    },
    atualiza() {
      if (fazColisao(globais.flappyBird, globais.chao)) {
        som_hit.play();
        mudaParaTela(telas.inicio);
        return;
      }

      // Sempre aumentando a velocidade para simular a gravidade sempre que atualiza o frame da tela
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;

      // Fazendo o passaro cair
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    frameAtual: 0,
    atualizaFrameAtual() {
      const intervaloDeFrames = 10;
      const passouIntervalo = frames % intervaloDeFrames === 0;

      if (passouIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseDeRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseDeRepeticao;
      }
    },
    movimentos: [
      { spriteX: 0, spriteY: 0 }, //Asa para cima
      { spriteX: 0, spriteY: 26 }, // Asa do meio
      { spriteX: 0, spriteY: 52 }, // Asa para baixo
    ],
    desenha() {
      flappyBird.atualizaFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
      contexto.drawImage(
        sprites,
        spriteX,
        spriteY,
        flappyBird.largura,
        flappyBird.altura,
        flappyBird.x,
        flappyBird.y,
        flappyBird.largura,
        flappyBird.altura
      );
    },
  };

  return flappyBird;
};

const mensagemGetReady = {
  spriteX: 143,
  spriteY: 0,
  largura: 174,
  altura: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.spriteX,
      mensagemGetReady.spriteY,
      mensagemGetReady.largura,
      mensagemGetReady.altura,
      mensagemGetReady.x,
      mensagemGetReady.y,
      mensagemGetReady.largura,
      mensagemGetReady.altura
    );
  },
};

let globais = {};
let telaAtiva = {};

mudaParaTela = (novaTela) => {
  telaAtiva = novaTela;

  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
};

const telas = {
  inicio: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    atualiza() {
      globais.chao.atualiza();
    },
    click() {
      mudaParaTela(telas.jogo);
    },
  },
  jogo: {
    desenha() {
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
    },
    click() {
      globais.flappyBird.pula();
    },
    atualiza() {
      globais.flappyBird.atualiza();
    },
  },
};

const loop = () => {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames += 1;
  requestAnimationFrame(loop);
};

addEventListener("click", () => {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaParaTela(telas.inicio);
loop();
