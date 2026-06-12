import {
  _decorator,
  Component,
  Sprite,
  SpriteFrame,
  tween,
  Tween,
  UIOpacity,
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BackgroundEntry')
export class BackgroundEntry {
  @property
  public assetId = '';

  @property(SpriteFrame)
  public spriteFrame: SpriteFrame | null = null;
}

@ccclass('BackgroundSwitcher')
export class BackgroundSwitcher extends Component {
  @property(Sprite)
  public primarySprite: Sprite | null = null;

  @property(Sprite)
  public transitionSprite: Sprite | null = null;

  @property([BackgroundEntry])
  public backgrounds: BackgroundEntry[] = [];

  @property
  public transitionSeconds = 0.35;

  private visibleSprite: Sprite | null = null;
  private hiddenSprite: Sprite | null = null;
  private currentAssetId = '';

  protected onLoad(): void {
    this.visibleSprite = this.primarySprite;
    this.hiddenSprite = this.transitionSprite;
    this.setOpacity(this.visibleSprite, 255);
    this.setOpacity(this.hiddenSprite, 0);
  }

  public replaceBackgrounds(
    backgrounds: readonly {
      assetId: string;
      spriteFrame: SpriteFrame;
    }[],
  ): void {
    this.backgrounds = backgrounds.map((background) => {
      const entry = new BackgroundEntry();
      entry.assetId = background.assetId;
      entry.spriteFrame = background.spriteFrame;
      return entry;
    });
  }

  public show(assetId: string, immediate = false): boolean {
    if (!assetId || assetId === this.currentAssetId) {
      return true;
    }

    const entry = this.backgrounds.find(
      (candidate) => candidate.assetId === assetId,
    );
    if (!entry?.spriteFrame || !this.visibleSprite) {
      console.warn(`[BackgroundSwitcher] Missing background '${assetId}'.`);
      return false;
    }

    this.currentAssetId = assetId;
    if (immediate || !this.hiddenSprite || this.transitionSeconds <= 0) {
      this.visibleSprite.spriteFrame = entry.spriteFrame;
      this.setOpacity(this.visibleSprite, 255);
      return true;
    }

    const incoming = this.hiddenSprite;
    const outgoing = this.visibleSprite;
    incoming.spriteFrame = entry.spriteFrame;
    incoming.node.active = true;

    const incomingOpacity = this.getOpacity(incoming);
    const outgoingOpacity = this.getOpacity(outgoing);
    Tween.stopAllByTarget(incomingOpacity);
    Tween.stopAllByTarget(outgoingOpacity);
    incomingOpacity.opacity = 0;

    tween(incomingOpacity)
      .to(this.transitionSeconds, { opacity: 255 })
      .call(() => {
        this.visibleSprite = incoming;
        this.hiddenSprite = outgoing;
      })
      .start();
    tween(outgoingOpacity)
      .to(this.transitionSeconds, { opacity: 0 })
      .start();
    return true;
  }

  private getOpacity(sprite: Sprite): UIOpacity {
    return (
      sprite.node.getComponent(UIOpacity) ??
      sprite.node.addComponent(UIOpacity)
    );
  }

  private setOpacity(sprite: Sprite | null, opacity: number): void {
    if (sprite) {
      this.getOpacity(sprite).opacity = opacity;
    }
  }
}
