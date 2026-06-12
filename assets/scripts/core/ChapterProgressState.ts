import {
  DialogueSnapshot,
  DialogueState,
} from '../dialogue/DialogueTypes';

export const CHAPTER0_ID = 'chapter0_prologue';

export interface ChapterProgressState {
  schemaVersion: 1;
  chapterId: string;
  currentSection: string;
  backgroundAssetId: string;
  dialogue: DialogueSnapshot;
  updatedAt: number;
}

export function createInitialChapter0DialogueState(): DialogueState {
  return {
    ch0_started: false,
    ch0_completed: false,
    ch0_inspection_count: 0,
    timeline_stability: 50,
    timeline_instability_warning: false,
  };
}

export function createChapter0Progress(
  dialogue: DialogueSnapshot,
  currentSection: string,
  backgroundAssetId: string,
  updatedAt = Date.now(),
): ChapterProgressState {
  return {
    schemaVersion: 1,
    chapterId: CHAPTER0_ID,
    currentSection,
    backgroundAssetId,
    dialogue,
    updatedAt,
  };
}
