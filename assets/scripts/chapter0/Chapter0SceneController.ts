import {
  _decorator,
  Component,
  JsonAsset,
  Label,
  Node,
  resources,
  SpriteFrame,
  UITransform,
  Vec3,
} from 'cc';
import {
  ChapterProgressState,
  createChapter0Progress,
  createInitialChapter0DialogueState,
} from '../core/ChapterProgressState';
import { SpeakerProfile } from '../core/SpeakerRegistry';
import { DialogueManager } from '../dialogue/DialogueManager';
import {
  DIALOGUE_SPEAKERS,
  DialogueDocument,
} from '../dialogue/DialogueTypes';
import { BackgroundSwitcher } from '../ui/BackgroundSwitcher';
import { DialogueBox } from '../ui/DialogueBox';
import { ScreenFader } from '../ui/ScreenFader';
import { TimelineInstabilityIndicator } from '../ui/TimelineInstabilityIndicator';
import {
  CHAPTER0_INTERACTABLES,
  Chapter0FlowController,
  Chapter0FlowViewState,
} from './Chapter0FlowController';
import {
  Chapter0Interactable,
  NormalizedHotspotRect,
} from './Chapter0Interactable';
import { MemoryFlashbackController } from './MemoryFlashbackController';

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

interface Chapter0ResourceEntry {
  assetId: string;
  resource: string;
}

interface Chapter0DialogueResource {
  fileId: string;
  resource: string;
}

interface Chapter0Manifest {
  schemaVersion: number;
  chapterId: string;
  entryNodeId: string;
  dialogueDocuments: Chapter0DialogueResource[];
  backgrounds: Chapter0ResourceEntry[];
  speakers: SpeakerProfile[];
}

@ccclass('Chapter0SceneController')
export class Chapter0SceneController extends Component {
  @property(DialogueBox)
  public dialogueBox: DialogueBox | null = null;

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

  @property([Chapter0Interactable])
  public interactables: Chapter0Interactable[] = [];

  @property
  public autoCreateMissingHotspots = true;

  @property
  public manifestResource = 'dialogue/chapter0/ch0_manifest';

  @property
  public entryNodeIdOverride = '';

  private dialogueManager: DialogueManager | null = null;
  private flowController: Chapter0FlowController | null = null;
  private unsubscribeFlow: (() => void) | null = null;
  private completionEmitted = false;
  private lastInvestigationWidth = -1;
  private lastInvestigationHeight = -1;

  protected start(): void {
    void this.initialize();
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

  private async initialize(): Promise<void> {
    if (!this.dialogueBox) {
      console.error('[Chapter0SceneController] DialogueBox is not assigned.');
      return;
    }

    try {
      const manifest = await this.loadManifest();
      const entryNodeId =
        this.entryNodeIdOverride.trim() || manifest.entryNodeId;
      const [documents, backgrounds, portraits] = await Promise.all([
        this.loadDialogueDocuments(manifest),
        this.loadBackgrounds(manifest),
        this.loadPortraits(manifest),
      ]);

      this.assertDialogueDocuments(documents, entryNodeId);
      this.backgroundSwitcher?.replaceBackgrounds(backgrounds);
      this.dialogueBox.setSpeakerProfiles(manifest.speakers);
      this.dialogueBox.replacePortraits(portraits);
      this.dialogueManager = new DialogueManager(
        documents,
        createInitialChapter0DialogueState(),
      );
      this.flowController = new Chapter0FlowController(this.dialogueManager);
      this.dialogueBox.bind(this.dialogueManager);

      this.prepareInteractables();
      this.unsubscribeFlow = this.flowController.subscribe((viewState) =>
        this.renderScene(viewState),
      );
      this.backgroundSwitcher?.show('bg_ch0_abandoned_room', true);
      this.dialogueManager.start(entryNodeId);
      this.screenFader?.fadeInFromBlack();
    } catch (error) {
      console.error(
        '[Chapter0SceneController] Chapter 0 could not start.',
        error,
      );
    }
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
        .concat(root.getComponentsInChildren(Chapter0Interactable))
        .filter((interactable) => interactable.interactableId)
        .map((interactable) => [interactable.interactableId, interactable]),
    );

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

        const interactable =
          hotspotNode.addComponent(Chapter0Interactable);
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
      (interactable): interactable is Chapter0Interactable =>
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
    entryNodeId: string,
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
    if (
      !documents.some((document) =>
        document.nodes.some((node) => node.id === entryNodeId),
      )
    ) {
      throw new Error(`Entry node '${entryNodeId}' is not loaded.`);
    }
  }

  private async loadManifest(): Promise<Chapter0Manifest> {
    const manifestAsset = await this.loadJsonAsset(this.manifestResource);
    const manifest = manifestAsset.json as Chapter0Manifest;
    this.assertManifest(manifest);
    return manifest;
  }

  private assertManifest(manifest: Chapter0Manifest): void {
    if (manifest.schemaVersion !== 1) {
      throw new Error(
        `Unsupported Chapter 0 manifest version '${manifest.schemaVersion}'.`,
      );
    }

    const dialogueIds = new Set(
      manifest.dialogueDocuments.map((entry) => entry.fileId),
    );
    const missingDialogue = [...REQUIRED_DIALOGUE_FILE_IDS].filter(
      (fileId) => !dialogueIds.has(fileId),
    );
    if (missingDialogue.length > 0) {
      throw new Error(
        `Manifest is missing dialogue files: ${missingDialogue.join(', ')}.`,
      );
    }

    for (const entry of manifest.dialogueDocuments) {
      if (!entry.resource.startsWith('dialogue/chapter0/')) {
        throw new Error(
          `Dialogue resource '${entry.resource}' is outside dialogue/chapter0.`,
        );
      }
    }
    for (const entry of manifest.backgrounds) {
      if (!entry.resource.startsWith('images/chapter0/backgrounds/')) {
        throw new Error(
          `Background resource '${entry.resource}' is outside images/chapter0/backgrounds.`,
        );
      }
    }

    const speakers = new Set(
      manifest.speakers.map((profile) => profile.speaker),
    );
    const missingSpeakers = DIALOGUE_SPEAKERS.filter(
      (speaker) => !speakers.has(speaker),
    );
    if (missingSpeakers.length > 0) {
      throw new Error(
        `Manifest is missing speakers: ${missingSpeakers.join(', ')}.`,
      );
    }
    for (const profile of manifest.speakers) {
      if (
        profile.portraitResource &&
        !profile.portraitResource.startsWith(
          'images/chapter0/characters/',
        )
      ) {
        throw new Error(
          `Portrait resource '${profile.portraitResource}' is outside images/chapter0/characters.`,
        );
      }
    }
  }

  private async loadDialogueDocuments(
    manifest: Chapter0Manifest,
  ): Promise<DialogueDocument[]> {
    return Promise.all(
      manifest.dialogueDocuments.map(async (entry) => {
        const asset = await this.loadJsonAsset(entry.resource);
        const document = asset.json as DialogueDocument;
        if (document.fileId !== entry.fileId) {
          throw new Error(
            `Dialogue resource '${entry.resource}' declared fileId '${document.fileId}', expected '${entry.fileId}'.`,
          );
        }
        return document;
      }),
    );
  }

  private async loadBackgrounds(
    manifest: Chapter0Manifest,
  ): Promise<{ assetId: string; spriteFrame: SpriteFrame }[]> {
    return Promise.all(
      manifest.backgrounds.map(async (entry) => ({
        assetId: entry.assetId,
        spriteFrame: await this.loadSpriteFrame(entry.resource),
      })),
    );
  }

  private async loadPortraits(
    manifest: Chapter0Manifest,
  ): Promise<{ assetId: string; spriteFrame: SpriteFrame }[]> {
    const profiles = manifest.speakers.filter(
      (profile) => profile.portraitAssetId && profile.portraitResource,
    );
    return Promise.all(
      profiles.map(async (profile) => ({
        assetId: profile.portraitAssetId!,
        spriteFrame: await this.loadSpriteFrame(profile.portraitResource!),
      })),
    );
  }

  private loadJsonAsset(resourcePath: string): Promise<JsonAsset> {
    return new Promise((resolve, reject) => {
      resources.load(resourcePath, JsonAsset, (error, asset) => {
        if (error || !asset) {
          reject(
            new Error(
              `Could not load JSON resource '${resourcePath}': ${error?.message ?? 'unknown error'}`,
            ),
          );
          return;
        }
        resolve(asset);
      });
    });
  }

  private loadSpriteFrame(resourcePath: string): Promise<SpriteFrame> {
    return new Promise((resolve, reject) => {
      resources.load(resourcePath, SpriteFrame, (error, asset) => {
        if (error || !asset) {
          reject(
            new Error(
              `Could not load SpriteFrame resource '${resourcePath}': ${error?.message ?? 'unknown error'}`,
            ),
          );
          return;
        }
        resolve(asset);
      });
    });
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
      interactable.setAvailable(
        available.has(interactable.interactableId),
      );
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
      this.node.emit('chapter0-complete', this.createProgressSnapshot());
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
