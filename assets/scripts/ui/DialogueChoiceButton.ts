import {
  _decorator,
  Button,
  Component,
  Graphics,
  Label,
  Sprite,
  UITransform,
} from 'cc';
import {
  colorFromHex,
  DialogueThemeData,
  DEFAULT_DIALOGUE_THEME,
} from './DialogueTheme';

const { ccclass, property } = _decorator;

@ccclass('DialogueChoiceButton')
export class DialogueChoiceButton extends Component {
  @property(Button)
  public button: Button | null = null;

  @property(Label)
  public label: Label | null = null;

  @property(Sprite)
  public backgroundSprite: Sprite | null = null;

  @property(Graphics)
  public backgroundGraphics: Graphics | null = null;

  private choiceIndex = -1;
  private onSelect: ((choiceIndex: number) => void) | null = null;
  private eventBound = false;

  protected onLoad(): void {
    this.ensureReferences();
    this.bindClick();
  }

  protected onDestroy(): void {
    if (this.eventBound && this.button) {
      this.button.node.off(Button.EventType.CLICK, this.handleClick, this);
    }
  }

  public configure(
    choiceIndex: number,
    text: string,
    onSelect: (choiceIndex: number) => void,
    theme: DialogueThemeData = DEFAULT_DIALOGUE_THEME,
  ): void {
    this.choiceIndex = choiceIndex;
    this.onSelect = onSelect;
    this.ensureReferences();
    this.bindClick();

    if (this.label) {
      this.label.string = text;
      this.label.color = colorFromHex(theme.choiceTextColor);
    }
    if (this.backgroundSprite) {
      this.backgroundSprite.color = colorFromHex(theme.choiceColor);
    }
    this.drawFallbackBackground(theme);
  }

  private ensureReferences(): void {
    this.button =
      this.button ??
      this.node.getComponent(Button) ??
      this.node.addComponent(Button);
    this.label = this.label ?? this.node.getComponentInChildren(Label);
    this.backgroundSprite =
      this.backgroundSprite ?? this.node.getComponent(Sprite);
    this.backgroundGraphics =
      this.backgroundGraphics ?? this.node.getComponent(Graphics);
  }

  private bindClick(): void {
    if (!this.button || this.eventBound) {
      return;
    }
    this.button.node.on(Button.EventType.CLICK, this.handleClick, this);
    this.eventBound = true;
  }

  private handleClick(): void {
    if (this.choiceIndex >= 0) {
      this.onSelect?.(this.choiceIndex);
    }
  }

  private drawFallbackBackground(theme: DialogueThemeData): void {
    if (!this.backgroundGraphics) {
      return;
    }

    const transform = this.node.getComponent(UITransform);
    if (!transform) {
      return;
    }

    const { width, height } = transform.contentSize;
    const notch = Math.min(6, height * 0.12);
    const graphics = this.backgroundGraphics;
    graphics.clear();
    graphics.fillColor = colorFromHex(theme.choiceColor);
    graphics.strokeColor = colorFromHex(theme.panelEdgeColor);
    graphics.lineWidth = 1;
    graphics.moveTo(-width / 2 + notch, -height / 2);
    graphics.lineTo(width / 2 - 2, -height / 2 + 2);
    graphics.lineTo(width / 2, height / 2 - notch);
    graphics.lineTo(-width / 2 + 2, height / 2);
    graphics.close();
    graphics.fill();
    graphics.stroke();
  }
}
