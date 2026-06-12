import { DialogueManager } from '../dialogue/DialogueManager';
import {
  DialogueStateValue,
  DialogueViewState,
} from '../dialogue/DialogueTypes';

export type Chapter0SceneMode =
  | 'dialogue'
  | 'investigation'
  | 'flashback'
  | 'complete';

export interface Chapter0InteractableDefinition {
  id: string;
  displayName: string;
  targetNodeId: string;
}

export interface Chapter0FlowViewState {
  mode: Chapter0SceneMode;
  backgroundAssetId: string;
  flashbackId: string | null;
  availableInteractableIds: readonly string[];
  timelineStability: number;
  timelineWarning: boolean;
  chapterComplete: boolean;
  dialogue: DialogueViewState;
}

export type Chapter0FlowListener = (state: Chapter0FlowViewState) => void;

export const CHAPTER0_INTERACTABLES: readonly Chapter0InteractableDefinition[] =
  [
    {
      id: 'broken_time_device',
      displayName: 'Broken time device',
      targetNodeId: 'ch0_inspect_device_001',
    },
    {
      id: 'damaged_id_card',
      displayName: 'Damaged ID card',
      targetNodeId: 'ch0_inspect_id_card_001',
    },
    {
      id: 'research_notes',
      displayName: 'Research notes',
      targetNodeId: 'ch0_inspect_notes_001',
    },
    {
      id: 'old_newspaper',
      displayName: 'Old newspaper',
      targetNodeId: 'ch0_inspect_newspaper_001',
    },
    {
      id: 'cracked_watch',
      displayName: 'Cracked watch',
      targetNodeId: 'ch0_inspect_watch_001',
    },
    {
      id: 'lab_terminal',
      displayName: 'Lab terminal',
      targetNodeId: 'ch0_inspect_terminal_001',
    },
    {
      id: 'memory_shard',
      displayName: 'Memory shard',
      targetNodeId: 'ch0_inspect_shard_001',
    },
    {
      id: 'exit_corridor',
      displayName: 'Exit to corridor',
      targetNodeId: 'ch0_choice_trust_memory',
    },
  ];

const INSPECTION_HUB_ID = 'ch0_inspection_hub';
const DEFAULT_BACKGROUND = 'bg_ch0_abandoned_room';

export class Chapter0FlowController {
  private readonly listeners = new Set<Chapter0FlowListener>();
  private readonly interactables = new Map(
    CHAPTER0_INTERACTABLES.map((definition) => [definition.id, definition]),
  );
  private readonly unsubscribeDialogue: () => void;
  private backgroundAssetId = DEFAULT_BACKGROUND;
  private currentState: Chapter0FlowViewState;

  public constructor(private readonly dialogueManager: DialogueManager) {
    this.currentState = this.buildViewState(dialogueManager.getViewState());
    this.unsubscribeDialogue = dialogueManager.subscribe((viewState) => {
      this.currentState = this.buildViewState(viewState);
      this.emit();
    });
  }

  public dispose(): void {
    this.unsubscribeDialogue();
    this.listeners.clear();
  }

  public subscribe(listener: Chapter0FlowListener): () => void {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => this.listeners.delete(listener);
  }

  public getViewState(): Chapter0FlowViewState {
    return this.currentState;
  }

  public restoreBackground(backgroundAssetId: string): void {
    if (!backgroundAssetId) {
      return;
    }
    this.backgroundAssetId = backgroundAssetId;
    this.currentState = this.buildViewState(
      this.dialogueManager.getViewState(),
    );
    this.emit();
  }

  public activateInteractable(interactableId: string): DialogueViewState {
    const definition = this.interactables.get(interactableId);
    if (!definition) {
      throw new Error(`Unknown Chapter 0 interactable '${interactableId}'.`);
    }

    if (this.currentState.mode !== 'investigation') {
      throw new Error(
        `Interactable '${interactableId}' is unavailable outside investigation mode.`,
      );
    }

    if (!this.currentState.availableInteractableIds.includes(interactableId)) {
      throw new Error(`Interactable '${interactableId}' is currently locked.`);
    }

    return this.dialogueManager.goTo(definition.targetNodeId);
  }

  private buildViewState(dialogue: DialogueViewState): Chapter0FlowViewState {
    const node = dialogue.node;
    if (node?.background) {
      this.backgroundAssetId = node.background;
    } else if (node?.id === INSPECTION_HUB_ID) {
      this.backgroundAssetId = DEFAULT_BACKGROUND;
    }

    // The authored hub choices remain the source of truth for hotspot unlocks.
    const availableTargets = new Set(
      node?.id === INSPECTION_HUB_ID
        ? dialogue.choices.map((choice) => choice.next)
        : [],
    );
    const availableInteractableIds = CHAPTER0_INTERACTABLES.filter(
      (definition) => availableTargets.has(definition.targetNodeId),
    ).map((definition) => definition.id);

    const chapterComplete = this.readBoolean(
      dialogue.state.ch0_completed,
      false,
    );
    const flashbackId = node?.flashbackId ?? null;
    const mode: Chapter0SceneMode = chapterComplete
      ? 'complete'
      : flashbackId || this.isMemoryVisual(node?.background)
        ? 'flashback'
        : node?.id === INSPECTION_HUB_ID
          ? 'investigation'
          : 'dialogue';

    return {
      mode,
      backgroundAssetId: this.backgroundAssetId,
      flashbackId,
      availableInteractableIds,
      timelineStability: this.readNumber(
        dialogue.state.timeline_stability,
        50,
      ),
      timelineWarning:
        chapterComplete ||
        this.readBoolean(
          dialogue.state.ch0_timeline_displacement_confirmed,
          false,
        ) ||
        this.readBoolean(
          dialogue.state.timeline_instability_warning,
          false,
        ),
      chapterComplete,
      dialogue,
    };
  }

  private isMemoryVisual(backgroundAssetId?: string): boolean {
    return (
      backgroundAssetId === 'bg_ch0_memory_void' ||
      backgroundAssetId === 'bg_ch0_destroyed_lab_flashback' ||
      backgroundAssetId === 'bg_ch0_time_machine_chamber'
    );
  }

  private readBoolean(
    value: DialogueStateValue | undefined,
    fallback: boolean,
  ): boolean {
    return typeof value === 'boolean' ? value : fallback;
  }

  private readNumber(
    value: DialogueStateValue | undefined,
    fallback: number,
  ): number {
    return typeof value === 'number' ? value : fallback;
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener(this.currentState);
    }
  }
}
