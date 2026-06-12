import {
  _decorator,
  Color,
  Component,
  Graphics,
  tween,
  Tween,
  UIOpacity,
  UITransform,
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('MemoryFlashbackController')
export class MemoryFlashbackController extends Component {
  @property
  public flashInSeconds = 0.16;

  @property
  public restingOpacity = 42;

  @property(Graphics)
  public vignetteGraphics: Graphics | null = null;

  private opacity: UIOpacity | null = null;
  private currentFlashbackId: string | null = null;

  protected onLoad(): void {
    this.opacity =
      this.node.getComponent(UIOpacity) ?? this.node.addComponent(UIOpacity);
    this.drawVignette();
    this.setActive(false);
  }

  public setFlashback(flashbackId: string | null, active: boolean): void {
    if (!active) {
      this.currentFlashbackId = null;
      this.setActive(false);
      return;
    }

    const changed = flashbackId !== this.currentFlashbackId;
    this.currentFlashbackId = flashbackId;
    this.setActive(true);
    if (!this.opacity) {
      return;
    }

    Tween.stopAllByTarget(this.opacity);
    if (changed) {
      this.opacity.opacity = 210;
      tween(this.opacity)
        .to(this.flashInSeconds, { opacity: this.restingOpacity })
        .start();
    } else {
      this.opacity.opacity = this.restingOpacity;
    }
  }

  private setActive(active: boolean): void {
    this.node.active = active;
    if (this.opacity && !active) {
      this.opacity.opacity = 0;
    }
  }

  private drawVignette(): void {
    if (!this.vignetteGraphics) {
      return;
    }

    const transform = this.vignetteGraphics.node.getComponent(UITransform);
    if (!transform) {
      return;
    }

    const { width, height } = transform.contentSize;
    const graphics = this.vignetteGraphics;
    graphics.clear();
    graphics.fillColor = new Color(14, 18, 28, 165);
    graphics.rect(-width / 2, -height / 2, width, height);
    graphics.fill();
  }
}
