import './PersonaCanvas.css';
import { useEffect } from 'react';


function getWordWidth(word){
  const HALF_WIDTH = 30;
  const WIDTH = 50;
  const SPECIAL_SYMBOL = "‘’\“\”】」：；，。》/？！¥）·、｜";

  let base_size = WIDTH;
  if(word.charCodeAt(0) <= 255 || SPECIAL_SYMBOL.indexOf(word) !== -1){
    base_size = HALF_WIDTH;
  }

  return base_size;
}

function getWordHeight(word){
  return getWordWidth("字");
}

const RANDOM_WITH_RANGE = 20;
const DEFAULT_FONT_NAME = "sans-serif";

class Word{
  constructor(word, isfirstword){
    this.word = word;
    this.isfirstword = isfirstword;

    this.randomWidth = Math.random() * RANDOM_WITH_RANGE - RANDOM_WITH_RANGE/2;
    if(isfirstword){this.randomWidth = Math.abs(this.randomWidth) * 1.5;}

    this.width = getWordWidth(word) + this.randomWidth;
    this.height = getWordHeight(word) + this.randomWidth;
    this.border = this.height * 0.05;
    this.font = "bold " + (this.height * 0.7) + "px " + DEFAULT_FONT_NAME;
  }
  getWidth(){
    return this.width;
  }
  getHeight(){
    return this.height;
  }
  draw(ctx){
    this.drawBorder(ctx);
    this.drawWord(ctx);
  }
  drawBorder(ctx){
    ctx.save()
    ctx.fillStyle = "white";
    let half_w = this.width / 2;
    let half_h = this.height / 2;
    ctx.fillRect(-half_w, -half_h, this.width, this.height);
    ctx.fillStyle = "black";
    ctx.fillRect(
      -half_w + this.border, -half_h + this.border, 
      this.width - 2 * this.border, this.height - 2 * this.border
    );
    if(this.isfirstword){
      this.drawFirstWordBorder(ctx)
    }
    ctx.restore()
  }
  drawFirstWordBorder(ctx){
    let half_w = this.width / 2;
    let half_h = this.height / 2;
    ctx.save()
    ctx.rotate((Math.random() - 0.5) * 0.1);
    ctx.fillStyle = "red";
    let left = -half_w + this.border * 2;
    let top = -half_h + this.border * 2;
    let _width = this.width - 4 * this.border;
    let _height = this.height - 4 * this.border;
    ctx.fillRect(left, top, _width, _height)
    ctx.restore()
  }
  drawWord(ctx){
    ctx.save()
    ctx.font = this.font;

    ctx.fillStyle = "white";
    if(!this.isfirstword && Math.random() < 0.15){
      ctx.fillStyle = "red";
    }

    ctx.translate(-this.width / 2 + this.border * 3, this.border * 5)
    ctx.fillText(this.word, 0, 0);
    ctx.restore()
  }
}

class LineText{
  constructor(content){
    this.content = content;
    this.words = content.split('');
    this.words = this.words.map((word, index) => new Word(word, index === 0));
  }
  getWidth(){
    return this.words.reduce((acc, word) => acc + word.getWidth(), 0) + (this.words.length - 1);
  }
  getHeight(){
    return this.words.reduce((acc, word) => Math.max(acc, word.getHeight()), 0);
  }
  draw(ctx){
    let all_width = this.getWidth();
    let left = -all_width / 2;
    for(let i = 0; i < this.words.length; i++){
      let word = this.words[i];
      left += word.getWidth() + 1;
      ctx.save()
      ctx.translate(left, 0);
      ctx.rotate((Math.random() - 0.5) * 0.3);
      word.draw(ctx);
      ctx.restore();
    }
  }
}

class Content{
  constructor(content){
    this.content = content;
    this.lines = content.split('\n');
    this.lines = this.lines.filter((line) => line.trim() !== '');
    this.lines = this.lines.map((line) => new LineText(line));
  }
  draw(ctx){
    let all_height = this.lines.reduce((acc, line) => acc + line.getHeight(), 0);
    let top = -all_height / 2;
    for(let i = 0; i < this.lines.length; i++){
      ctx.save()
      ctx.translate(0, top);
      let line = this.lines[i];
      line.draw(ctx);
      ctx.restore();
      top += line.getHeight() * 1.2;
    }
  }

}

function drawBackground(canvas){
  // 背景由一堆同心圆组成，圆心在canvas中心，每个圆的半径为等差数列，从最大半径开始，每个圆的背景颜色有红黑交替
  let ctx = canvas.getContext('2d');
  let circlesCount = canvas.width / getWordWidth("字");
  let maxRadius = Math.max(canvas.width, canvas.height);
  let commonDifference = maxRadius / circlesCount;
  let offset = () => Math.random() * commonDifference * 0.53;
  for (let i = circlesCount; i > 0; i--) {
      let radius = maxRadius - (circlesCount - i) * commonDifference;
      ctx.beginPath();
      ctx.arc(canvas.width / 2 + offset(), canvas.height / 2 + offset(), radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 1 ? '#ff3333': "#111";
      ctx.fill();
  }
}

function draw(canvas, content){
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  drawBackground(canvas)

  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2);
  new Content(content).draw(ctx);
  ctx.restore()
}

function PersonaCanvas({ content }) {
  useEffect(() => {
    let canvas = document.getElementById('drawpanel');
    draw(canvas, content);
  }, [content]);

  return (
    <div className="App">
      <canvas id="drawpanel" width="1200px" height="800px"/>
    </div>
  );
}

export default PersonaCanvas;
