import './PersonaCanvas.css';
import { useEffect } from 'react';


const LINE_HEIGHT = 50;
const V_MARGIN = 10;
const WORD_SIZE = 50;


/**
 * 文字容器 黑底白色边框
 * 1. 首字：叠加一个红色方框，随机略微倾斜但不超出容器，白色文字
 * 2. 小概率字：红色字
 * 3. 大概率字：白色字
 */

function drawBackground(canvas){
  // 背景由一堆同心圆组成，圆心在canvas中心，每个圆的半径为等差数列，从最大半径开始，每个圆的背景颜色有红黑交替
  let ctx = canvas.getContext('2d');
  let circlesCount = 9;
  let maxRadius = Math.min(canvas.width, canvas.height);
  let commonDifference = maxRadius / circlesCount;
  let offset = () => Math.random() * commonDifference * 0.5
  for (let i = circlesCount; i > 0; i--) {
      let radius = maxRadius - (circlesCount - i) * commonDifference;
      ctx.beginPath();
      ctx.arc(canvas.width / 2 + offset(), canvas.height / 2 + offset(), radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 1 ? '#ff3333': "#111";
      ctx.fill();
  }
}


function drawWord(ctx, word, isfirstword){
  ctx.font = "30px Arial";

  ctx.fillStyle = "black";
  ctx.fillRect(10, 10, 50, 50)

  if (isfirstword){
    ctx.fillStyle = "red";
    ctx.fillRect(13, 13, 44, 44)
  }

  ctx.strokeStyle = "white";
  ctx.strokeRect(10, 10, 50, 50);

  ctx.fillStyle = "white";
  // 判断word是全角字符还是半角字符
  ctx.save()
  if(word.charCodeAt(0) > 255){
    ctx.translate(10, -5)
  }else{
    ctx.translate(15, -5)
  }
  ctx.fillText(word, 10, 50);
  ctx.restore()
}

function drawLine(ctx, content){
  let words = content.trim().split('');
  let all_width = WORD_SIZE * words.length;
  let left = -all_width / 2;

  for(let i = 0; i < words.length; i++){
    ctx.save()
    ctx.translate(left + i * WORD_SIZE, 0);
    ctx.rotate((Math.random() - 0.5) * 0.25);
    drawWord(ctx, content[i], i==0);
    ctx.restore()
  }
}

function drawContent(ctx, content){
  let lst = content.split('\n');
  lst = lst.filter((line) => line.trim() !== '')
  let top = -(LINE_HEIGHT + V_MARGIN) * (lst.length / 2 + 1);
  for(let line of lst){
    top += LINE_HEIGHT + V_MARGIN;
    ctx.save()
    ctx.translate(0, top);
    drawLine(ctx, line);
    ctx.restore()
  };
}

function draw(canvas, content){
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  drawBackground(canvas)

  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2);
  drawContent(ctx, content);
  ctx.restore()
}

function PersonaCanvas({ content }) {
  useEffect(() => {
    let canvas = document.getElementById('drawpanel');
    draw(canvas, content);
  }, [content]);

  return (
    <div className="App">
      <canvas id="drawpanel" width="800px" height="500px"/>
    </div>
  );
}

export default PersonaCanvas;
