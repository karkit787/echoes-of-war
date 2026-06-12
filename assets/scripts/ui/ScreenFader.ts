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

@ccclass('ScreenFader')
export class ScreenFader extends Component {
  @property
  public fadeSeconds = 1.1;

  @property(Graphics)
  public overlayGraphics: Graphics | null = null;

  private opacity: UIOpacity | null = null;

  protected onLoad(): void {
    this.opacity =
      this.node.getComponent(UIOpacity) ?? this.node.addComponent(UIOpacity);
    this.drawOverlay();
  }

  public fadeInFromBlack(): void {
    if (!this.opacity) {
      return;
    }

    this.node.active = true;
    Tween.stopAllByTarget(this.opacity);
    this.opacity.opacity = 255;
    tween(this.opacity)
      .to(this.fadeSeconds, { opacity: 0 })
      .call(() => {
        this.node.active = false;
      })
      .start();
  }

  private drawOverlay(): void {
    if (!this.overlayGraphics) {
      return;
    }

    const transform = this.node.getComponent(UITransform);
    if (!transform) {
      return;
    }

    const { width, height } = transform.contentSize;
    this.overlayGraphics.clear();
    this.overlayGraphics.fillColor = Color.BLACK;
    this.overlayGraphics.rect(-width / 2, -height / 2, width, height);
    this.overlayGraphics.fill();
  }
}
