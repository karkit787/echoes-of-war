import {
  _decorator,
  Button,
  Color,
  Component,
  Graphics,
  instantiate,
  Label,
  Layout,
  Node,
  Prefab,
  Sprite,
  UITransform,
} from 'cc';
import { DialogueChoice } from '../dialogue/DialogueTypes';
import {
  colorFromHex,
  DialogueThemeData,
  DEFAULT_DIALOGUE_THEME,
} from './DialogueTheme';

const { ccclass, property } = _decorator;

@ccclass('DialogueChoiceList')
export class DialogueChoiceList extends Component {
  @property(Node)
  public container: Node | null = null;

  @property(Prefab)
  public choiceButtonPrefab: Prefab | null = null;

  @property
  public fallbackButtonWidth = 640;

  @property
  public fallbackButtonHeight = 58;

  private theme: DialogueThemeData = DEFAULT_DIALOGUE_THEME;

  public setTheme(theme: DialogueThemeData): void {
    this.theme = theme;
  }

  public clear(): void {
    const container = this.container ?? this.node;
    container.removeAllChildren();
    container.active = false;
  }

  public show(
    choices: readonly DialogueChoice[],
    onSelect: (visibleChoiceIndex: number) => void,
  ): void {
    const container = this.container ?? this.node;
    container.removeAllChildren();

    choices.forEach((choice, index) => {
      const buttonNode = this.choiceButtonPrefab
        ? instantiate(this.choiceButtonPrefab)
        : this.createFallbackButton(index);

      buttonNode.name = `DialogueChoice_${index}`;
      buttonNode.parent = container;

      const label = buttonNode.getComponentInChildren(Label);
      if (label) {
        label.string = choice.label;
        label.color = colorFromHex(this.theme.choiceTextColor);
      }

      const sprite = buttonNode.getComponent(Sprite);
      if (sprite) {
        sprite.color = colorFromHex(this.theme.choiceColor);
      }

      const button =
        buttonNode.getComponent(Button) ?? buttonNode.addComponent(Button);
      buttonNode.on(
        Button.EventType.CLICK,
        () => onSelect(index),
        this,
      );
    });

    container.active = choices.length > 0;
    const layout = container.getComponent(Layout);
    if (layout) {
      layout.updateLayout();
    } else {
      container.children.forEach((child, index) => {
        child.setPosition(
          0,
          -index * (this.fallbackButtonHeight + 8),
          0,
        );
      });
    }
  }

  private createFallbackButton(index: number): Node {
    const buttonNode = new Node(`DialogueChoice_${index}`);
    const transform = buttonNode.addComponent(UITransform);
    transform.setContentSize(
      this.fallbackButtonWidth,
      this.fallbackButtonHeight,
    );

    const graphics = buttonNode.addComponent(Graphics);
    const width = this.fallbackButtonWidth;
    const height = this.fallbackButtonHeight;
    const notch = 5;
    graphics.fillColor = colorFromHex(this.theme.choiceColor);
    graphics.strokeColor = colorFromHex(this.theme.panelEdgeColor);
    graphics.lineWidth = 1;
    graphics.moveTo(-width / 2 + notch, -height / 2);
    graphics.lineTo(width / 2 - 2, -height / 2 + 2);
    graphics.lineTo(width / 2, height / 2 - notch);
    graphics.lineTo(-width / 2 + 2, height / 2);
    graphics.close();
    graphics.fill();
    graphics.stroke();

    const labelNode = new Node('Label');
    labelNode.parent = buttonNode;
    const labelTransform = labelNode.addComponent(UITransform);
    labelTransform.setContentSize(width - 36, height - 12);
    const label = labelNode.addComponent(Label);
    label.fontSize = 22;
    label.lineHeight = 28;
    label.overflow = Label.Overflow.SHRINK;
    label.color = colorFromHex(this.theme.choiceTextColor, Color.WHITE);

    return buttonNode;
  }
}
