class Sprite {
  constructor({ pos, imageSrc, scale = 1, framesMax = 1 }) {
    this.pos = pos;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;

    this.frames = {
      max: framesMax,
      width: this.image.width / framesMax,
      height: this.image.height,
      current: 0,
      elapsed: 0,
      hold: 5,
    };
  }

  draw() {
    c.drawImage(
      this.image,
      this.frames.current * this.frames.width,
      0,
      this.frames.width,
      this.frames.height,
      this.pos.x,
      this.pos.y,
      this.frames.width * this.scale,
      this.frames.height * this.scale
    );
  }

  update() {
    this.draw();
    this.frames.elapsed++;
    if (this.frames.elapsed % this.frames.hold !== 0) return;

    if (this.frames.current < this.frames.max - 1) {
      ++this.frames.current;
    } else this.frames.current = 0;
  }
}

class Fighter extends Sprite {
  constructor({
    pos,
    velocity,
    color,
    offset,
    imageSrc,
    scale = 1,
    framesMax = 1,
    sprites
  }) {
    super({
        pos,
        imageSrc,
        scale, 
        framesMax
    })
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      pos: {
        x: this.pos.x,
        y: this.pos.y,
      },
      offset: offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
  }


  update() {
    this.draw();
    this.attackBox.pos.x = this.pos.x + this.attackBox.offset.x;
    this.attackBox.pos.y = this.pos.y + this.attackBox.offset.y;

    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;

    if (this.pos.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}
