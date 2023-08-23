import { c } from "./data";
import { Coordinates } from "./types";

export class Sprite {
  public height = 60;
  public width = 30;
  public image;
  public currentFrame;

  constructor(
    public position: Coordinates,

    public imageSrc: string[],
    public scale = 1,
    public animationSpeed = 1000
  ) {
    this.image = new Image();
    this.image.src = imageSrc[0];
    this.currentFrame = 0;
    if (imageSrc.length > 1)
      this.preloadImages(() => {
        this.animate();
      });
  }

  preloadImages(callback: () => void) {
    let loadedCount = 0;
    const totalImages = this.imageSrc.length;

    const checkAllImagesLoaded = () => {
      if (++loadedCount === totalImages) {
        callback();
      }
    };

    this.imageSrc.forEach((src) => {
      const img = new Image();
      img.onload = checkAllImagesLoaded;
      img.src = src;
    });
  }

  animate() {
    setTimeout(this.animate.bind(this), this.animationSpeed);
    if (this.currentFrame < this.imageSrc.length - 1) this.currentFrame++;
    else this.currentFrame = 0;
    this.image.src = this.imageSrc[this.currentFrame];
  }

  draw() {
    if (c != null) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.image.width * this.scale,
        this.image.height * this.scale
      );
    }
  }

  update() {
    this.draw();
  }
}
