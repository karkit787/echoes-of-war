import {
  _decorator,
  Button,
  Component,
  instantiate,
  Label,
  Layout,
  Node,
  Prefab,
  UITransform,
} from 'cc';
import { DialogueHistoryEntry } from '../dialogue/DialogueTypes';
import {
  colorFromHex,
  DialogueThemeData,
  DEFAULT_DIALOGUE_THEME,
} from './DialogueTheme';

const { ccclass, property } = _decorator;

@ccclass('DialogueHistoryPanel')
export class DialogueHistoryPanel extends Component {
  @property(Node)
  public panelRoot: Node | null = null;

  @property(Node)
  public content: Node | null = null;

  @property(Prefab)
  public entryPrefab: Prefab | null = null;

  @property(Button)
  public closeButton: Button | null = null;

  @property
  public maxEntries = 80;

  private theme: DialogueThemeData = DEFAULT_DIALOGUE_THEME;

  protected onLoad(): void {
    this.closeButton?.node.on(Button.EventType.CLICK, this.close, this);
    this.close();
  }

  protected onDestroy(): void {
    this.closeButton?.node.off(Button.EventType.CLICK, this.close, this);
  }

  public setTheme(theme: DialogueThemeData): void {
    this.theme = theme;
  }

  public open(entries: readonly DialogueHistoryEntry[]): void {
    const root = this.panelRoot ?? this.node;
    const content = this.content ?? root;
    content.removeAllChildren();

    entries.slice(-this.maxEntries).forEach((entry) => {
      const entryNode = this.entryPrefab
        ? instantiate(this.entryPrefab)
        : this.createFallbackEntry();
      entryNode.parent = content;

      const label = entryNode.getComponentInChildren(Label);
      if (label) {
        const style = this.theme.speakers[entry.speaker];
        label.string = `${style.displayName}: ${entry.text}`;
        label.color = colorFromHex(style.bodyColor);
      }
    });

    content.getComponent(Layout)?.updateLayout();
    root.active = true;
  }

  public close(): void {
    (this.panelRoot ?? this.node).active = false;
  }

  private createFallbackEntry(): Node {
    const entryNode = new Node('HistoryEntry');
    const transform = entryNode.addComponent(UITransform);
    transform.setContentSize(680, 72);

    const label = entryNode.addComponent(Label);
    label.fontSize = 18;
    label.lineHeight = 24;
    label.overflow = Label.Overflow.RESIZE_HEIGHT;
    return entryNode;
  }
}

