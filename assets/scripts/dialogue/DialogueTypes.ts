export const DIALOGUE_SPEAKERS = [
  'Narration',
  'Player',
  'Logic',
  'Empathy',
  'Scepticism',
  'Memory',
  'Conscience',
  'System',
] as const;

export type DialogueSpeaker = (typeof DIALOGUE_SPEAKERS)[number];
export type DialogueScalar = string | number | boolean;
export type DialogueStateValue = DialogueScalar | DialogueScalar[];
export type DialogueState = Record<string, DialogueStateValue>;

export type DialogueConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'gte'
  | 'lte'
  | 'contains'
  | 'exists';

export interface DialogueCondition {
  key: string;
  operator: DialogueConditionOperator;
  value?: DialogueScalar;
}

export interface DialogueConditions {
  all?: DialogueCondition[];
  any?: DialogueCondition[];
}

export interface DialogueEffects {
  set?: Record<string, DialogueStateValue>;
  setIfAbsent?: Record<string, DialogueStateValue>;
  increment?: Record<string, number>;
  appendUnique?: Record<string, DialogueScalar[]>;
}

export interface DialogueChoice {
  id?: string;
  label: string;
  next: string;
  conditions?: DialogueConditions;
  effects?: DialogueEffects;
}

export interface DialogueHint {
  level: 1 | 2 | 3 | 4 | 5;
  trait: string;
  text: string;
}

export interface DialogueNode {
  id: string;
  speaker: DialogueSpeaker;
  portrait?: string;
  text: string;
  next?: string;
  choices?: DialogueChoice[];
  conditions?: DialogueConditions;
  effects?: DialogueEffects;
  background?: string;
  decisionId?: string;
  objectId?: string;
  flashbackId?: string;
  hints?: DialogueHint[];
}

export interface DialogueDocument {
  schemaVersion: number;
  fileId: string;
  chapter: string;
  entryId: string;
  nodes: DialogueNode[];
}

export interface DialogueHistoryEntry {
  nodeId: string;
  speaker: DialogueSpeaker;
  text: string;
}

export interface DialogueSnapshot {
  currentNodeId: string | null;
  state: DialogueState;
  history: DialogueHistoryEntry[];
}

export interface DialogueViewState {
  node: DialogueNode | null;
  choices: DialogueChoice[];
  history: readonly DialogueHistoryEntry[];
  state: Readonly<DialogueState>;
  isComplete: boolean;
}

export type DialogueListener = (viewState: DialogueViewState) => void;

