import {
  _decorator,
  Button,
  Color,
  Component,
  Graphics,
  Label,
  UITransform,
  Vec3,
} from 'cc';

const { ccclass, property } = _decorator;

export interface NormalizedHotspotRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

@ccclass('Chapter0Interactable')
export class Chapter0Interactable extends Component {
  @property
  public interactableId = '';

  @property
  public displayName = '';

  @property
  public showWhenLocked = false;

  @property(Button)
  public button: Button | null = null;

  @property(Label)
  public label: Label | null = null;

  @property(Graphics)
  public marker: Graphics | null = null;

  private onActivate: ((interactableId: string) => void) | null = null;
  private normalizedRect: NormalizedHotspotRect | null = null;
  private available = false;

  protected onLoad(): void {
    this.ensureVisuals();
    this.button?.node.on(Button.EventType.CLICK, this.handleClick, this);
  }

  protected onDestroy(): void {
    this.button?.node.off(Button.EventType.CLICK, this.handleClick, this);
  }

  public configure(
    interactableId: string,
    displayName: string,
    normalizedRect?: NormalizedHotspotRect,
  ): void {
    this.interactableId = interactableId;
    this.displayName = displayName;
    this.normalizedRect = normalizedRect ?? this.normalizedRect;
    this.ensureVisuals();
    if (this.label) {
      this.label.string = displayName;
    }
  }

  public bind(onActivate: (interactableId: string) => void): void {
    this.onActivate = onActivate;
  }

  public setAvailable(available: boolean): void {
    this.available = available;
    this.node.active = available || this.showWhenLocked;
    if (this.button) {
      this.button.interactable = available;
    }
    if (this.label) {
      this.label.color = available
        ? new Color(233, 228, 216, 255)
        : new Color(150, 146, 137, 150);
    }
    this.redrawMarker();
  }

  public layoutWithin(parentTransform: UITransform): void {
    if (!this.normalizedRect) {
      return;
    }

    const ownTransform =
      this.node.getComponent(UITransform) ?? this.node.addComponent(UITransform);
    const parentSize = parentTransform.contentSize;
    ownTransform.setContentSize(
      parentSize.width * this.normalizedRect.width,
      parentSize.height * this.normalizedRect.height,
    );
    this.node.setPosition(
      new Vec3(
        (this.normalizedRect.x - 0.5) * parentSize.width,
        (this.normalizedRect.y - 0.5) * parentSize.height,
        0,
      ),
    );
    this.redrawMarker();
  }

  private handleClick(): void {
    if (this.available) {
      this.onActivate?.(this.interactableId);
    }
  }

  private ensureVisuals(): void {
    if (!this.node.getComponent(UITransform)) {
      this.node.addComponent(UITransform).setContentSize(160, 64);
    }

    if (!this.button) {
      this.button = this.node.getComponent(Button) ?? this.node.addComponent(Button);
    }

    if (!this.marker) {
      this.marker =
        this.node.getComponent(Graphics) ?? this.node.addComponent(Graphics);
    }

    if (!this.label) {
      this.label = this.node.getComponentInChildren(Label);
    }

    this.redrawMarker();
  }

  private redrawMarker(): void {
    if (!this.marker) {
      return;
    }

    const transform = this.node.getComponent(UITransform);
    if (!transform) {
      return;
    }

    const width = transform.contentSize.width;
    const height = transform.contentSize.height;
    const marker = this.marker;
    marker.clear();
    marker.fillColor = this.available
      ? new Color(18, 24, 31, 145)
      : new Color(18, 20, 24, 80);
    marker.strokeColor = this.available
      ? new Color(190, 185, 171, 170)
      : new Color(110, 108, 103, 80);
    marker.lineWidth = 2;
    marker.rect(-width / 2, -height / 2, width, height);
    marker.fill();
    marker.stroke();
  }
}
