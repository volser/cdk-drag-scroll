type ScrollCallback = (event: { x: number; y: number }) => void;

export class AutoScroll {
  margin = 30;
  maxSpeed = 25;
  animationFrame: any;
  boundaryRect: ClientRect;
  point: { x: number; y: number } = { x: 0, y: 0 };

  constructor(
    private container: HTMLElement,
    private scrollCallback?: ScrollCallback
  ) {
    this.boundaryRect = this.container.getBoundingClientRect();
  }

  onMove(point: { x: number; y: number }) {
    this.point = point;
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = requestAnimationFrame(() => this.scrollTick());
  }

  scrollTick() {
    cancelAnimationFrame(this.animationFrame);
    if (this.autoScroll()) {
      this.animationFrame = requestAnimationFrame(() => this.scrollTick());
    }
  }

  autoScroll(): boolean {
    let scrollx, scrolly;

    if (this.point.x < this.boundaryRect.left + this.margin) {
      scrollx = Math.floor(
        Math.max(
          -1,
          (this.point.x - this.boundaryRect.left) / this.margin - 1
        ) * this.maxSpeed
      );
    } else if (this.point.x > this.boundaryRect.right - this.margin) {
      scrollx = Math.ceil(
        Math.min(
          1,
          (this.point.x - this.boundaryRect.right) / this.margin + 1
        ) * this.maxSpeed
      );
    } else {
      scrollx = 0;
    }

    if (this.point.y < this.boundaryRect.top + this.margin) {
      scrolly = Math.floor(
        Math.max(-1, (this.point.y - this.boundaryRect.top) / this.margin - 1) *
          this.maxSpeed
      );
    } else if (this.point.y > this.boundaryRect.bottom - this.margin) {
      scrolly = Math.ceil(
        Math.min(
          1,
          (this.point.y - this.boundaryRect.bottom) / this.margin + 1
        ) * this.maxSpeed
      );
    } else {
      scrolly = 0;
    }

    setTimeout(() => {
      if (scrolly) {
        this.scrollY(scrolly);
      }

      if (scrollx) {
        this.scrollX(scrollx);
      }
    });

    return scrollx || scrolly;
  }

  scrollY(amount: number) {
    // ToDo for window: window.scrollTo(window.pageXOffset, window.pageYOffset + amount);
    this.container.scrollTop += amount;
    if (this.scrollCallback) {
      this.scrollCallback({ x: 0, y: amount });
    }
  }

  scrollX(amount) {
    // ToDo for window: window.scrollTo(window.pageXOffset + amount, window.pageYOffset);
    this.container.scrollLeft += amount;
    if (this.scrollCallback) {
      this.scrollCallback({
        x: amount,
        y: 0
      });
    }
  }

  destroy() {
    cancelAnimationFrame(this.animationFrame);
  }
}
