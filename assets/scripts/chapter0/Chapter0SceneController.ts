import {
  _decorator,
  Component,
  JsonAsset,
  Label,
  Node,
  UITransform,
  Vec3,
} from 'cc';
import {
  ChapterProgressState,
  createChapter0Progress,
  createInitialChapter0DialogueState,
} from '../core/ChapterProgressState';
import { DialogueManager } from '../dialogue/DialogueManager';
import {
  DialogueDocument,
} from '../dialogue/DialogueTypes';
import { BackgroundSwitcher } from '../ui/BackgroundSwitcher';
import { DialogueBox } from '../ui/DialogueBox';
import { MemoryFlashbackController } from '../ui/MemoryFlashbackController';
import { ScreenFader } from '../ui/ScreenFader';
import { TimelineInstabilityIndicator } from '../ui/TimelineInstabilityIndicator';
import {
  CHAPTER0_INTERACTABLES,
  Chapter0FlowController,
  Chapter0FlowViewState,
} from './Chapter0FlowController';
import {
  InteractableObject,
  NormalizedHotspotRect,
} from '../player/InteractableObject';

const { ccclass, property } = _decorator;

const REQUIRED_DIALOGUE_FILE_IDS = new Set([
  'ch0_intro',
  'ch0_room_inspections',
  'ch0_flashbacks',
  'ch0_ai_fragments',
  'ch0_choices',
]);

const DEFAULT_HOTSPOT_LAYOUTS: Record<string, NormalizedHotspotRect> = {
  broken_time_device: { x: 0.5, y: 0.25, width: 0.22, height: 0.14 },
  damaged_id_card: { x: 0.27, y: 0.2, width: 0.16, height: 0.1 },
  research_notes: { x: 0.2, y: 0.48, width: 0.18, height: 0.12 },
  old_newspaper: { x: 0.72, y: 0.2, width: 0.18, height: 0.11 },
  cracked_watch: { x: 0.39, y: 0.13, width: 0.13, height: 0.09 },
  lab_terminal: { x: 0.78, y: 0.53, width: 0.2, height: 0.16 },
  memory_shard: { x: 0.58, y: 0.58, width: 0.16, height: 0.16 },
  exit_corridor: { x: 0.91, y: 0.5, width: 0.14, height: 0.28 },
};

@ccclass('Chapter0SceneController')
export class Chapter0SceneController extends Component {
  @property(DialogueBox)
  public dialogueBox: DialogueBox | null = null;

  @property({ type: [JsonAsset] })
  public dialogueFiles: JsonAsset[] = [];

  @property(BackgroundSwitcher)
  public backgroundSwitcher: BackgroundSwitcher | null = null;

  @property(MemoryFlashbackController)
  public flashbackController: MemoryFlashbackController | null = null;

  @property(TimelineInstabilityIndicator)
  public timelineIndicator: TimelineInstabilityIndicator | null = null;

  @property(ScreenFader)
  public screenFader: ScreenFader | null = null;

  @property(Node)
  public investigationRoot: Node | null = null;

  @property([InteractableObject])
  public interactables: InteractableObject[] = [];

  @property
  public autoCreateMissingHotspots = true;

  @property
  public entryNodeId = 'ch0_intro_wake_001';

  private dialogueManager: DialogueManager | null = null;
  private flowController: Chapter0FlowController | null = null;
  private unsubscribeFlow: (() => void) | null = null;
  private completionEmitted = false;
  private lastInvestigationWidth = -1;
  private lastInvestigationHeight = -1;

  protected start(): void {
    if (!this.dialogueBox) {
      console.error('[Chapter0SceneController] DialogueBox is not assigned.');
      return;
    }
    if (this.dialogueFiles.length === 0) {
      console.error(
        '[Chapter0SceneController] Assign all five Chapter 0 dialogue JSON assets.',
      );
      return;
    }

    try {
      const documents = this.dialogueFiles.map(
        (asset) => asset.json as DialogueDocument,
      );
      this.assertDialogueDocuments(documents);
      this.dialogueManager = new DialogueManager(
        documents,
        createInitialChapter0DialogueState(),
      );
      this.flowController = new Chapter0FlowController(this.dialogueManager);
      this.dialogueBox.bind(this.dialogueManager);
    } catch (error) {
      console.error(
        '[Chapter0SceneController] Chapter 0 could not start.',
        error,
      );
      return;
    }

    this.prepareInteractables();
    this.unsubscribeFlow = this.flowController.subscribe((viewState) =>
      this.renderScene(viewState),
    );
    this.backgroundSwitcher?.show('bg_ch0_abandoned_room', true);
    this.dialogueManager.start(this.entryNodeId);
    this.screenFader?.fadeInFromBlack();
  }

  protected lateUpdate(): void {
    this.layoutInteractablesIfNeeded();
  }

  protected onDestroy(): void {
    this.unsubscribeFlow?.();
    this.unsubscribeFlow = null;
    this.flowController?.dispose();
    this.flowController = null;
  }

  public createProgressSnapshot(): ChapterProgressState | null {
    if (!this.dialogueManager || !this.flowController) {
      return null;
    }

    return createChapter0Progress(
      this.dialogueManager.createSnapshot(),
      this.flowController.getViewState().mode,
      this.flowController.getViewState().backgroundAssetId,
    );
  }

  public restoreProgress(progress: ChapterProgressState): void {
    if (!this.dialogueManager) {
      throw new Error('Chapter 0 has not started.');
    }
    this.dialogueManager.restore(progress.dialogue);
    this.flowController?.restoreBackground(progress.backgroundAssetId);
  }

  private prepareInteractables(): void {
    const root = this.investigationRoot;
    if (!root) {
      console.error(
        '[Chapter0SceneController] Investigation root is not assigned.',
      );
      return;
    }

    const existing = new Map(
      this.interactables
        .concat(root.getComponentsInChildren(InteractableObject))
        .filter((interactable) => interactable.interactableId)
        .map((interactable) => [interactable.interactableId, interactable]),
    );

    // Runtime generation keeps the vertical slice usable before prefab metadata exists.
    if (this.autoCreateMissingHotspots) {
      for (const definition of CHAPTER0_INTERACTABLES) {
        if (existing.has(definition.id)) {
          continue;
        }

        const hotspotNode = new Node(`Hotspot_${definition.id}`);
        hotspotNode.parent = root;
        hotspotNode.addComponent(UITransform);

        const labelNode = new Node('Label');
        labelNode.parent = hotspotNode;
        labelNode.setPosition(Vec3.ZERO);
        const labelTransform = labelNode.addComponent(UITransform);
        labelTransform.setContentSize(190, 50);
        const label = labelNode.addComponent(Label);
        label.fontSize = 18;
        label.lineHeight = 22;
        label.overflow = Label.Overflow.SHRINK;
        label.string = definition.displayName;

        const interactable = hotspotNode.addComponent(InteractableObject);
        interactable.label = label;
        interactable.showWhenLocked = definition.id === 'exit_corridor';
        interactable.configure(
          definition.id,
          definition.displayName,
          DEFAULT_HOTSPOT_LAYOUTS[definition.id],
        );
        existing.set(definition.id, interactable);
      }
    }

    this.interactables = CHAPTER0_INTERACTABLES.map((definition) =>
      existing.get(definition.id),
    ).filter(
      (interactable): interactable is InteractableObject =>
        interactable !== undefined,
    );

    for (const interactable of this.interactables) {
      interactable.bind((interactableId) =>
        this.flowController?.activateInteractable(interactableId),
      );
      interactable.setAvailable(false);
    }

    this.layoutInteractablesIfNeeded(true);
  }

  private assertDialogueDocuments(
    documents: readonly DialogueDocument[],
  ): void {
    const fileIds = new Set(documents.map((document) => document.fileId));
    const missing = [...REQUIRED_DIALOGUE_FILE_IDS].filter(
      (fileId) => !fileIds.has(fileId),
    );

    if (missing.length > 0) {
      throw new Error(
        `Missing required Chapter 0 dialogue files: ${missing.join(', ')}.`,
      );
    }
    if (!documents.some((document) =>
      document.nodes.some((node) => node.id === this.entryNodeId),
    )) {
      throw new Error(`Entry node '${this.entryNodeId}' is not loaded.`);
    }
  }

  private renderScene(viewState: Chapter0FlowViewState): void {
    this.backgroundSwitcher?.show(viewState.backgroundAssetId);

    const investigationActive = viewState.mode === 'investigation';
    if (this.investigationRoot) {
      this.investigationRoot.active = investigationActive;
    }
    if (this.dialogueBox) {
      this.dialogueBox.node.active = !investigationActive;
    }

    const available = new Set(viewState.availableInteractableIds);
    for (const interactable of this.interactables) {
      interactable.setAvailable(available.has(interactable.interactableId));
    }

    this.flashbackController?.setFlashback(
      viewState.flashbackId,
      viewState.mode === 'flashback',
    );
    this.timelineIndicator?.render(
      viewState.timelineStability,
      viewState.timelineWarning,
    );

    if (viewState.chapterComplete && !this.completionEmitted) {
      this.completionEmitted = true;
      this.node.emit(
        'chapter0-complete',
        this.createProgressSnapshot(),
      );
    }
  }

  private layoutInteractablesIfNeeded(force = false): void {
    if (!this.investigationRoot) {
      return;
    }

    const rootTransform = this.investigationRoot.getComponent(UITransform);
    if (!rootTransform) {
      return;
    }

    const { width, height } = rootTransform.contentSize;
    if (
      !force &&
      width === this.lastInvestigationWidth &&
      height === this.lastInvestigationHeight
    ) {
      return;
    }

    this.lastInvestigationWidth = width;
    this.lastInvestigationHeight = height;
    for (const interactable of this.interactables) {
      interactable.layoutWithin(rootTransform);
    }
  }
}
