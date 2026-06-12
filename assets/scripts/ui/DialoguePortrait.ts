import { _decorator, Component, Sprite, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('DialoguePortraitEntry')
export class DialoguePortraitEntry {
  @property
  public assetId = '';

  @property(SpriteFrame)
  public spriteFrame: SpriteFrame | null = null;
}

@ccclass('DialoguePortrait')
export class DialoguePortrait extends Component {
  @property(Sprite)
  public portraitSprite: Sprite | null = null;

  @property([DialoguePortraitEntry])
  public portraits: DialoguePortraitEntry[] = [];

  public replacePortraits(
    portraits: readonly {
      assetId: string;
      spriteFrame: SpriteFrame;
    }[],
  ): void {
    this.portraits = portraits.map((portrait) => {
      const entry = new DialoguePortraitEntry();
      entry.assetId = portrait.assetId;
      entry.spriteFrame = portrait.spriteFrame;
      return entry;
    });
  }

  public show(assetId?: string): void {
    if (!assetId || !this.portraitSprite) {
      this.node.active = false;
      return;
    }

    const match = this.portraits.find((entry) => entry.assetId === assetId);
    if (!match?.spriteFrame) {
      this.node.active = false;
      return;
    }

    this.portraitSprite.spriteFrame = match.spriteFrame;
    this.node.active = true;
  }
}
