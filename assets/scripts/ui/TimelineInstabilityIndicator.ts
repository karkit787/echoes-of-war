import {
  _decorator,
  Component,
  Label,
  Node,
  ProgressBar,
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TimelineInstabilityIndicator')
export class TimelineInstabilityIndicator extends Component {
  @property(Label)
  public valueLabel: Label | null = null;

  @property(ProgressBar)
  public stabilityBar: ProgressBar | null = null;

  @property(Node)
  public warningNode: Node | null = null;

  public render(stability: number, warning: boolean): void {
    const clamped = Math.max(0, Math.min(100, stability));
    if (this.valueLabel) {
      this.valueLabel.string = warning
        ? `TIMELINE INSTABILITY DETECTED / stability ${Math.round(clamped)}%`
        : `Timeline stability ${Math.round(clamped)}%`;
    }
    if (this.stabilityBar) {
      this.stabilityBar.progress = clamped / 100;
    }
    if (this.warningNode) {
      this.warningNode.active = warning;
    }
  }
}

