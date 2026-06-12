import {
  _decorator,
  Button,
  Component,
  Graphics,
  JsonAsset,
  Label,
  Sprite,
  SpriteFrame,
  UITransform,
} from 'cc';
import { DialogueManager } from '../dialogue/DialogueManager';
import {
  SpeakerProfile,
  SpeakerRegistry,
} from '../core/SpeakerRegistry';
import {
  DialogueSpeaker,
  DialogueViewState,
} from '../dialogue/DialogueTypes';
import { DialogueChoiceList } from './DialogueChoiceList';
import { DialogueHistoryPanel } from './DialogueHistoryPanel';
import { DialoguePortrait } from './DialoguePortrait';
import {
  colorFromHex,
  DialogueThemeData,
  DEFAULT_DIALOGUE_THEME,
  mergeDialogueTheme,
} from './DialogueTheme';

const { ccclass, property } = _decorator;

@ccclass('DialogueBox')
export class DialogueBox extends Component {
  @property(Label)
  public speakerLabel: Label | null = null;

  @property(Label)
  public dialogueLabel: Label | null = null;

  @property(DialoguePortrait)
  public portrait: DialoguePortrait | null = null;

  @property(DialogueChoiceList)
  public choiceList: DialogueChoiceList | null = null;

  @property(DialogueHistoryPanel)
  public historyPanel: DialogueHistoryPanel | null = null;

  @property(Button)
  public continueButton: Button | null = null;

  @property(Label)
  public continueButtonLabel: Label | null = null;

  @property(Button)
  public panelAdvanceButton: Button | null = null;

  @property(Button)
  public historyButton: Button | null = null;

  @property(Sprite)
  public panelSprite: Sprite | null = null;

  @property(Sprite)
  public accentSprite: Sprite | null = null;

  @property(Graphics)
  public panelGraphics: Graphics | null = null;

  @property(Graphics)
  public accentGraphics: Graphics | null = null;

  @property(JsonAsset)
  public themeAsset: JsonAsset | null = null;

  @property
  public typewriterEnabled = true;

  @property
  public charactersPerSecond = 42;

  @property
  public revealButtonText = 'Reveal';

  @property
  public continueButtonText = 'Continue';

  private manager: DialogueManager | null = null;
  private readonly speakerRegistry = new SpeakerRegistry();
  private unsubscribe: (() => void) | null = null;
  private theme: DialogueThemeData = DEFAULT_DIALOGUE_THEME;
  private currentViewState: DialogueViewState | null = null;
  private currentCharacters: string[] = [];
  private revealedCharacterCount = 0;
  private isRevealing = false;
  private lastChromeWidth = -1;
  private lastChromeHeight = -1;

  protected onLoad(): void {
    const override = this.themeAsset?.json as
      | Partial<DialogueThemeData>
      | undefined;
    this.setTheme(mergeDialogueTheme(override));

    this.continueButton?.node.on(
      Button.EventType.CLICK,
      this.onAdvancePressed,
      this,
    );
    this.panelAdvanceButton?.node.on(
      Button.EventType.CLICK,
      this.onAdvancePressed,
      this,
    );
    this.historyButton?.node.on(
      Button.EventType.CLICK,
      this.onHistoryPressed,
      this,
    );
  }

  protected onDestroy(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.unschedule(this.revealNextCharacter);
    this.continueButton?.node.off(
      Button.EventType.CLICK,
      this.onAdvancePressed,
      this,
    );
    this.panelAdvanceButton?.node.off(
      Button.EventType.CLICK,
      this.onAdvancePressed,
      this,
    );
    this.historyButton?.node.off(
      Button.EventType.CLICK,
      this.onHistoryPressed,
      this,
    );
  }

  protected lateUpdate(): void {
    this.redrawChromeIfNeeded();
  }

  public bind(manager: DialogueManager): void {
    this.unsubscribe?.();
    this.manager = manager;
    this.unsubscribe = manager.subscribe((viewState) =>
      this.render(viewState),
    );
  }

  public setSpeakerProfiles(profiles: readonly SpeakerProfile[]): void {
    this.speakerRegistry.replace(profiles);
  }

  public replacePortraits(
    portraits: readonly {
      assetId: string;
      spriteFrame: SpriteFrame;
    }[],
  ): void {
    this.portrait?.replacePortraits(portraits);
  }

  public setTheme(theme: DialogueThemeData): void {
    this.theme = theme;
    this.choiceList?.setTheme(theme);
    this.historyPanel?.setTheme(theme);

    if (this.panelSprite) {
      this.panelSprite.color = colorFromHex(theme.panelColor);
    }
    this.redrawChrome(true);
  }

  public revealAllText(): void {
    if (!this.isRevealing || !this.dialogueLabel) {
      return;
    }

    this.unschedule(this.revealNextCharacter);
    this.dialogueLabel.string = this.currentCharacters.join('');
    this.revealedCharacterCount = this.currentCharacters.length;
    this.isRevealing = false;
    this.updateActions();
  }

  private render(viewState: DialogueViewState): void {
    this.currentViewState = viewState;
    this.choiceList?.clear();

    if (!viewState.node) {
      this.unschedule(this.revealNextCharacter);
      this.isRevealing = false;
      this.portrait?.show();
      if (this.speakerLabel) {
        this.speakerLabel.string = '';
      }
      if (this.dialogueLabel) {
        this.dialogueLabel.string = '';
      }
      this.setButtonActive(this.continueButton, false);
      return;
    }

    const node = viewState.node;
    const style = this.theme.speakers[node.speaker];
    const speakerProfile = this.speakerRegistry.get(node.speaker);

    if (this.speakerLabel) {
      this.speakerLabel.string =
        speakerProfile.displayName || style.displayName;
      this.speakerLabel.color = colorFromHex(style.nameColor);
    }
    if (this.dialogueLabel) {
      this.dialogueLabel.color = colorFromHex(style.bodyColor);
    }

    this.applySpeakerChrome(node.speaker, speakerProfile.accent);
    this.portrait?.show(
      style.showPortrait
        ? node.portrait ?? speakerProfile.portraitAssetId
        : undefined,
    );
    this.beginTextReveal(node.text);
  }

  private beginTextReveal(text: string): void {
    this.unschedule(this.revealNextCharacter);
    this.currentCharacters = Array.from(text);
    this.revealedCharacterCount = 0;

    if (!this.dialogueLabel) {
      this.isRevealing = false;
      this.updateActions();
      return;
    }

    if (!this.typewriterEnabled || this.charactersPerSecond <= 0) {
      this.dialogueLabel.string = text;
      this.revealedCharacterCount = this.currentCharacters.length;
      this.isRevealing = false;
      this.updateActions();
      return;
    }

    this.dialogueLabel.string = '';
    this.isRevealing = true;
    this.updateActions();
    this.schedule(
      this.revealNextCharacter,
      1 / Math.max(1, this.charactersPerSecond),
    );
  }

  private revealNextCharacter(): void {
    if (!this.dialogueLabel || !this.isRevealing) {
      return;
    }

    this.revealedCharacterCount += 1;
    this.dialogueLabel.string = this.currentCharacters
      .slice(0, this.revealedCharacterCount)
      .join('');

    if (this.revealedCharacterCount >= this.currentCharacters.length) {
      this.unschedule(this.revealNextCharacter);
      this.isRevealing = false;
      this.updateActions();
    }
  }

  private updateActions(): void {
    const viewState = this.currentViewState;
    const node = viewState?.node;
    if (!node) {
      return;
    }

    if (this.isRevealing) {
      if (this.continueButtonLabel) {
        this.continueButtonLabel.string = this.revealButtonText;
      }
      this.setButtonActive(this.continueButton, true);
      return;
    }

    if ((viewState?.choices.length ?? 0) > 0) {
      this.setButtonActive(this.continueButton, false);
      this.choiceList?.show(viewState!.choices, (choiceIndex) => {
        this.manager?.selectChoice(choiceIndex);
      });
      return;
    }

    if (this.continueButtonLabel) {
      this.continueButtonLabel.string = this.continueButtonText;
      this.continueButtonLabel.color = colorFromHex(
        this.theme.continueTextColor,
      );
    }
    this.setButtonActive(this.continueButton, Boolean(node.next));
  }

  private onAdvancePressed(): void {
    if (this.isRevealing) {
      this.revealAllText();
      return;
    }

    if ((this.currentViewState?.choices.length ?? 0) > 0) {
      return;
    }

    this.manager?.advance();
  }

  private onHistoryPressed(): void {
    if (!this.historyPanel || !this.currentViewState) {
      return;
    }
    this.historyPanel.open(this.currentViewState.history);
  }

  private applySpeakerChrome(
    speaker: DialogueSpeaker,
    registryAccent?: string,
  ): void {
    const style = this.theme.speakers[speaker];
    const accentColor = colorFromHex(registryAccent || style.accent);

    if (this.accentSprite) {
      this.accentSprite.color = accentColor;
    }

    if (this.accentGraphics) {
      const transform = this.accentGraphics.node.getComponent(UITransform);
      const width = transform?.contentSize.width ?? 8;
      const height = transform?.contentSize.height ?? 220;
      this.accentGraphics.clear();
      this.accentGraphics.fillColor = accentColor;
      this.accentGraphics.moveTo(-width / 2, -height / 2 + 3);
      this.accentGraphics.lineTo(width / 2, -height / 2);
      this.accentGraphics.lineTo(width / 2 - 1, height / 2 - 4);
      this.accentGraphics.lineTo(-width / 2 + 1, height / 2);
      this.accentGraphics.close();
      this.accentGraphics.fill();
    }
  }

  private redrawChromeIfNeeded(): void {
    const transform = this.panelGraphics?.node.getComponent(UITransform);
    if (!transform) {
      return;
    }

    const { width, height } = transform.contentSize;
    if (width !== this.lastChromeWidth || height !== this.lastChromeHeight) {
      this.redrawChrome(true);
    }
  }

  private redrawChrome(force = false): void {
    if (!this.panelGraphics) {
      return;
    }

    const transform = this.panelGraphics.node.getComponent(UITransform);
    if (!transform) {
      return;
    }

    const { width, height } = transform.contentSize;
    if (
      !force &&
      width === this.lastChromeWidth &&
      height === this.lastChromeHeight
    ) {
      return;
    }

    this.lastChromeWidth = width;
    this.lastChromeHeight = height;

    const graphics = this.panelGraphics;
    const roughness = Math.min(8, Math.max(3, height * 0.015));
    graphics.clear();
    graphics.fillColor = colorFromHex(this.theme.panelColor);
    graphics.strokeColor = colorFromHex(this.theme.panelEdgeColor);
    graphics.lineWidth = 1;
    graphics.moveTo(-width / 2 + roughness, -height / 2);
    graphics.lineTo(width / 2 - roughness * 0.5, -height / 2 + 2);
    graphics.lineTo(width / 2, -height / 2 + roughness);
    graphics.lineTo(width / 2 - 2, height / 2 - roughness * 0.7);
    graphics.lineTo(width / 2 - roughness, height / 2);
    graphics.lineTo(-width / 2 + roughness * 0.4, height / 2 - 2);
    graphics.lineTo(-width / 2, height / 2 - roughness);
    graphics.lineTo(-width / 2 + 2, -height / 2 + roughness * 0.6);
    graphics.close();
    graphics.fill();
    graphics.stroke();
  }

  private setButtonActive(button: Button | null, active: boolean): void {
    if (button) {
      button.node.active = active;
      button.interactable = active;
    }
  }
}
