let video;
let input, button, restartBtn;
let letters = []; 
let fontSize = 14; // 기존 10에서 4pt 키운 14로 설정
let gameState = 0; // 0: 입력 화면, 1: 아트 화면

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  createInputUI();
  
  textAlign(CENTER, CENTER);
  textFont('monospace');
}

function createInputUI() {
  // 입력창 스타일 (글래스모피즘 느낌)
  input = createInput(''); 
  input.attribute('placeholder', '이름을 입력하세요');
  input.position(width/2 - 100, height/2 - 50);
  input.style('width', '200px');
  input.style('padding', '15px');
  input.style('border', 'none');
  input.style('border-radius', '15px');
  input.style('background', 'rgba(255, 255, 255, 0.2)');
  input.style('backdrop-filter', 'blur(10px)');
  input.style('color', 'white');
  input.style('text-align', 'center');
  input.style('outline', 'none');
  
  // 시작 버튼 (글래스모피즘 스타일)
  button = createButton('START ART');
  button.position(width/2 - 60, height/2 + 30);
  styleGlassButton(button);
  button.mousePressed(startArt);

  // 하단 다시 입력하기 버튼 (처음엔 숨김)
  restartBtn = createButton('다시 입력하기');
  restartBtn.position(width/2 - 70, height - 80);
  styleGlassButton(restartBtn);
  restartBtn.hide(); 
  restartBtn.mousePressed(resetArt);
}

// 버튼에 글래스모피즘 스타일을 입히는 공통 함수
function styleGlassButton(btn) {
  btn.style('padding', '12px 25px');
  btn.style('border', '1px solid rgba(255, 255, 255, 0.3)');
  btn.style('border-radius', '12px');
  btn.style('background', 'rgba(255, 255, 255, 0.1)');
  btn.style('backdrop-filter', 'blur(5px)');
  btn.style('color', 'white');
  btn.style('cursor', 'pointer');
  btn.style('font-weight', 'bold');
}

function startArt() {
  decomposeHangul(); // 한글 쪼개기 실행
  gameState = 1;
  input.hide();
  button.hide();
  restartBtn.show(); // 아트 시작 시 하단 버튼 보이기
}

function resetArt() {
  gameState = 0;
  input.value('');
  input.show();
  button.show();
  restartBtn.hide();
}

// 한글 자모 분리 로직 (수정 버전)
function decomposeHangul() {
  let str = input.value();
  letters = [];
  
  const choList = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const jungList = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
  const jongList = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c >= 0xAC00 && c <= 0xD7A3) {
      let code = c - 0xAC00;
      let jong = code % 28;
      let jung = ((code - jong) / 28) % 21;
      let cho = (((code - jong) / 28) - jung) / 21;
      
      letters.push(choList[cho]);
      letters.push(jungList[jung]);
      if (jong !== 0) letters.push(jongList[jong]);
    } else {
      letters.push(str[i]);
    }
  }
  // 입력이 없을 경우 대비
  if (letters.length === 0) letters = ["?"];
}

function draw() {
  background(0);

  if (gameState === 0) {
    fill(255);
    textSize(20);
    text("당신의 이름을 입력하세요", width/2, height/2 - 100);
  } else if (gameState === 1) {
    video.loadPixels();
    let startX = (width - video.width) / 2;
    let startY = (height - video.height) / 2;

    for (let y = 0; y < video.height; y += fontSize) {
      for (let x = 0; x < video.width; x += fontSize) {
        let index = (x + y * video.width) * 4;
        let r = video.pixels[index];
        let g = video.pixels[index+1];
        let b = video.pixels[index+2];
        let bright = (r + g + b) / 3;

        if (bright > 50) {
          let char = random(letters);
          fill(255, bright); 
          textSize(fontSize);
          text(char, startX + x, startY + y);
          
          if (random(1) > 0.97) {
            stroke(255, 30);
            line(startX + x, startY + y, startX + x, startY + y + 80);
          }
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
