import {
  _decorator,
  Component,
  tween,
  Tween,
  UIOpacity,
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ScreenFader')
export class ScreenFader extends Component {
  @property
  public fadeSeconds = 1.1;

  private opacity: UIOpacity | null = null;

  protected onLoad(): void {
    this.opacity =
      this.node.getComponent(UIOpacity) ?? this.node.addComponent(UIOpacity);
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
}

