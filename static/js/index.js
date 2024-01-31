let index = 0;
let attempts = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료되었습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; left:37vw; background-color:white; width:200px; heigth:100px";
    document.body.appendChild(div);
  };
  const nextLine = () => {
    attempts++;
    index = 0;
    if (attempts === 6) return gameover();
  };
  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;

    //서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer");
    const 정답 = await 응답.json();

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];
      if (입력한_글자 === 정답_글자) {
        맞은_갯수++;
        block.classList.add("correct"); //main.css의 correct 애니메이션 가져옴
        block.style.background = "#6AAA64";
      } else if (정답.includes(입력한_글자)) block.style.background = "#C9B458";
      else block.style.background = "#787C7E";

      block.style.color = "white";

      const keyboardkey = document.querySelector(
        `.keyboard-block[data-key='${정답_글자}']`
      ); //정답_글자와 일치하는 키보드 블럭을 가져와서 키보드키에 저장
      if (keyboardkey) {
        if (입력한_글자 === 정답_글자) {
          keyboardkey.style.background = "#6AAA64";
        } else if (정답.includes(입력한_글자))
          keyboardkey.style.background = "#C9B458";
        else keyboardkey.style.background = "#787C7E";

        keyboardkey.style.color = "white";
      } //여기까지 블럭 색 변경과 동일
    }

    if (맞은_갯수 === 5) gameover();
    else nextLine();
  };

  const handleBackSpace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index--;
  };

  const handleKeydown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") handleBackSpace();
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index++;
    }
  };

  const keyboardElements = document.querySelectorAll(".keyboard-block"); // 하단 키보드 배열 엘리먼트 선택

  // 하단 키보드 배열 엘리먼트에 클릭 이벤트 리스너 추가

  keyboardElements.forEach((keyboardElement) => {
    keyboardElement.addEventListener("click", () => {
      const 입력한_글자 = keyboardElement.innerText; // 클릭한 키보드 블럭의 내용 가져오기
      const thisBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index}']`
      );

      if (index < 5) {
        thisBlock.innerText = 입력한_글자; // 클릭한 키보드 블럭의 내용을 현재 입력 중인 board-block에 추가
        index++;
      }
    });
  });

  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${분}:${초}`;
    }

    timer = setInterval(setTime, 1000);
  };

  startTimer();
  window.addEventListener("keydown", handleKeydown);
}
appStart();
