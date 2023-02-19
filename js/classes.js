class Sprite {
  constructor({
    pos,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
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

    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.frames.current * this.frames.width,
      0,
      this.frames.width,
      this.frames.height,
      this.pos.x - this.offset.x,
      this.pos.y - this.offset.y,
      this.frames.width * this.scale,
      this.frames.height * this.scale
    );
  }

  animateFrame() {
    this.frames.elapsed++;
    if (this.frames.elapsed % this.frames.hold !== 0) return;

    if (this.frames.current < this.frames.max - 1) {
      ++this.frames.current;
    } else this.frames.current = 0;
  }

  update() {
    this.draw();
    this.animateFrame();
  }
}

class Fighter extends Sprite {
  constructor({
    pos,
    velocity,
    color,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
  }) {
    super({
      pos,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
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

    this.frames = {
      max: framesMax,
      width: this.image.width / framesMax,
      height: this.image.height,
      current: 0,
      elapsed: 0,
      hold: 5,
    };

    this.sprites = sprites;
    for (const i in this.sprites) {
      sprites[i].image = new Image();
      sprites[i].image.src = sprites[i].imageSrc;
    }
  }

  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack1.image &&
      this.frames.current < this.sprites.attack1.framesMax - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frames.max = this.sprites.idle.framesMax;
          this.frames.current = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frames.max = this.sprites.run.framesMax;
          this.frames.current = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frames.max = this.sprites.jump.framesMax;
          this.frames.current = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frames.max = this.sprites.fall.framesMax;
          this.frames.current = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.frames.max = this.sprites.attack1.framesMax;
          this.frames.current = 0;
        }
        break;
      default:
        break;
    }
  }

  update() {
    this.draw();
    this.animateFrame();
    this.attackBox.pos.x = this.pos.x + this.attackBox.offset.x;
    this.attackBox.pos.y = this.pos.y + this.attackBox.offset.y;

    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;

    // gravity function
    if (this.pos.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.pos.y = 330;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}
