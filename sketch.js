let video;
let input, button;
let letters = []; 
let fontSize = 10;
let gameState = 0; // 0: 입력 화면, 1: 아트 화면

function setup() {
  createCanvas(windowWidth, windowHeight); // 화면 꽉 차게 설정
  
  // 카메라 초기화
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  // 입력 화면 UI 만들기
  createInputUI();
  
  textAlign(CENTER, CENTER);
  textFont('monospace');
}

function createInputUI() {
  // 입력창 위치 중앙으로 설정
  input = createInput(''); 
  input.attribute('placeholder', '이름을 입력하세요');
  input.position(width/2 - 80, height/2 - 40);
  input.style('padding', '10px');
  
  // 확인 버튼
  button = createButton('START ART');
  button.position(width/2 - 40, height/2 + 20);
  button.style('padding', '10px 20px');
  button.mousePressed(startArt); // 버튼 누르면 startArt 함수 실행
}

function startArt() {
  updateLetters(); // 한글 쪼개기 실행
  gameState = 1;   // 화면 상태 변경
  input.hide();    // 입력창 숨기기
  button.hide();   // 버튼 숨기기
}

function updateLetters() {
  let str = input.value();
  letters = [];
  
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c >= 0xAC00 && c <= 0xD7A3) {
      let code = c - 0xAC00;
      let jong = code % 28;
      let jung = ((code - jong) / 28) % 21;
      let cho = (((code - jong) / 28) - jung) / 21;
      const choList = ["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"]; // 간략화
      const jungList = ["ㅏ","ㅑ","ㅓ","ㅕ","ㅗ","ㅛ","ㅜ","ㅠ","ㅡ","ㅣ"];
      const jongList = ["","ㄱ","ㄴ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ","ㅈ"];
      
      letters.push(choList[cho % choList.length]);
      letters.push(jungList[jung % jungList.length]);
      if (jong !== 0) letters.push(jongList[jong % jongList.length]);
    } else {
      letters.push(str[i]);
    }
  }
}

function draw() {
  background(0);

  if (gameState === 0) {
    // [1번 화면: 이름 입력]
    fill(255);
    textSize(24);
    text("당신의 이름을 입력하고 시작하세요", width/2, height/2 - 100);
    
  } else if (gameState === 1) {
    // [2번 화면: 아스키 아트 등장]
    video.loadPixels();
    
    // 카메라 영상을 중앙에 배치하기 위한 계산
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
          
          if (random(1) > 0.98) {
            stroke(255, 40);
            line(startX + x, startY + y, startX + x, startY + y + 60);
          }
        }
      }
    }
    
    // 화면 하단에 안내 메시지 (작게)
    noStroke();
    fill(150);
    textSize(12);
    text("Press 'R' to Restart", width/2, height - 50);
  }
}

// 'R'키를 누르면 다시 입력 화면으로 돌아가는 기능
function keyPressed() {
  if (key === 'r' || key === 'R') {
    gameState = 0;
    input.show();
    button.show();
  }
}