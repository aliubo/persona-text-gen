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
    return this.width + this.border;
  }
  getHeight(){
    return this.height;
  }
  drawBorder(ctx){
    ctx.save()
    ctx.fillStyle = "white";
    let half_w = this.width / 2;
    let half_h = this.height / 2;
    ctx.fillRect(-half_w, -half_h, this.width, this.height);
    ctx.restore()
  }
  drawContainer(ctx){
    ctx.save()
    ctx.fillStyle = "black";
    let half_w = this.width / 2;
    let half_h = this.height / 2;
    ctx.fillRect(
      -half_w + this.border, -half_h + this.border, 
      this.width - 2 * this.border, this.height - 2 * this.border
    );
    ctx.restore()
    if (this.isfirstword){
      this.drawFirstWordContainer(ctx);
    }
  }
  drawFirstWordContainer(ctx){
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
    return this.words.reduce((acc, word) => acc + word.getWidth(), 0)// + (this.words.length - 1);
  }
  getHeight(){
    return this.words.reduce((acc, word) => Math.max(acc, word.getHeight()), 0);
  }
  draw(ctx){
    let all_width = this.getWidth();
    let left = -all_width / 2;

    let lefts = this.words.map((word) => word.getWidth());
    lefts = lefts.map((width, index) => lefts.slice(0, index).reduce((acc, w) => acc + w, 0));

    let rotates = this.words.map((word) => (Math.random() - 0.5) * 0.3);

    let wordmap = (fn, is_reverse)=>{
      let actions = (i) => {
        let word = this.words[i];
        ctx.save()
        ctx.translate(left + lefts[i], 0);
        ctx.rotate(rotates[i]);
        fn(word, i);
        ctx.restore();
      }
      if(!is_reverse){
        for(let i=0; i<this.words.length; i++) actions(i);
      }else{
        for(let i=this.words.length-1; i>=0; i--) actions(i);
      }
    }
    wordmap((word, i)=>{
      word.drawBorder(ctx);
      word.drawContainer(ctx);
      word.drawWord(ctx);
    }, false);
  }
}

class Content{
  constructor(content){
    this.content = content;
    this.lines = content.split('\n');
    this.lines = this.lines.filter((line) => line.trim() !== '');
    this.lines = this.lines.map((line) => new LineText(line));
  }
  getWidth(){
    return this.lines.reduce((acc, line) => Math.max(acc, line.getWidth()), 0);
  }
  getHeight(){
    return this.lines.reduce((acc, line) => acc + line.getHeight() * 1.2, 0);
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
  for (let i = parseInt(circlesCount); i > 0; i--) {
      let radius = maxRadius - (circlesCount - i) * commonDifference;
      let x = canvas.width / 2 + offset();
      let y = canvas.height / 2 + offset();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 1 ? '#ff3333': "#111";
      ctx.fill();
  }
}

function draw(canvas, content){
  let content_obj = new Content(content)
  let width = content_obj.getWidth() * 1.2;
  let height = content_obj.getHeight() * 1.2;
  canvas.width = Math.max(500, parseInt(width));
  canvas.height = Math.max(500, parseInt(height));
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  drawBackground(canvas)

  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2);
  content_obj.draw(ctx);
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
