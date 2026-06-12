import { Color } from 'cc';
import { DialogueSpeaker } from '../dialogue/DialogueTypes';

export interface DialogueSpeakerStyle {
  displayName: string;
  accent: string;
  nameColor: string;
  bodyColor: string;
  showPortrait: boolean;
  consciousness: boolean;
}

export interface DialogueThemeData {
  panelColor: string;
  panelEdgeColor: string;
  choiceColor: string;
  choiceHoverColor: string;
  choiceTextColor: string;
  continueTextColor: string;
  speakers: Record<DialogueSpeaker, DialogueSpeakerStyle>;
}

export const DEFAULT_DIALOGUE_THEME: DialogueThemeData = {
  panelColor: '#10141CEB',
  panelEdgeColor: '#6D6E6A70',
  choiceColor: '#1A202AEF',
  choiceHoverColor: '#293240F2',
  choiceTextColor: '#E9E4D8FF',
  continueTextColor: '#CFC8B9FF',
  speakers: {
    Narration: {
      displayName: 'Narration',
      accent: '#777B80FF',
      nameColor: '#B9B6AFFF',
      bodyColor: '#C8C5BCFF',
      showPortrait: false,
      consciousness: false,
    },
    Player: {
      displayName: 'Trainee Historian',
      accent: '#9AA0A5FF',
      nameColor: '#E3DED2FF',
      bodyColor: '#EEE9DEFF',
      showPortrait: true,
      consciousness: false,
    },
    Logic: {
      displayName: 'Logic',
      accent: '#7891A6FF',
      nameColor: '#AFC2D0FF',
      bodyColor: '#E0E6E7FF',
      showPortrait: true,
      consciousness: true,
    },
    Empathy: {
      displayName: 'Empathy',
      accent: '#8F799BFF',
      nameColor: '#C4ADC9FF',
      bodyColor: '#E9E0E7FF',
      showPortrait: true,
      consciousness: true,
    },
    Scepticism: {
      displayName: 'Scepticism',
      accent: '#4E506FFF',
      nameColor: '#9297BDFF',
      bodyColor: '#D5D7E2FF',
      showPortrait: true,
      consciousness: true,
    },
    Memory: {
      displayName: 'Memory',
      accent: '#697F8FFF',
      nameColor: '#A8B7C0FF',
      bodyColor: '#D9E0E1FF',
      showPortrait: true,
      consciousness: true,
    },
    Conscience: {
      displayName: 'Conscience',
      accent: '#A18E64FF',
      nameColor: '#D1C49FFF',
      bodyColor: '#EEE8D8FF',
      showPortrait: true,
      consciousness: true,
    },
    System: {
      displayName: 'Objective',
      accent: '#8D846EFF',
      nameColor: '#C9BFA9FF',
      bodyColor: '#E7E0D2FF',
      showPortrait: false,
      consciousness: false,
    },
  },
};

export function mergeDialogueTheme(
  override?: Partial<DialogueThemeData>,
): DialogueThemeData {
  if (!override) {
    return DEFAULT_DIALOGUE_THEME;
  }

  return {
    ...DEFAULT_DIALOGUE_THEME,
    ...override,
    speakers: {
      ...DEFAULT_DIALOGUE_THEME.speakers,
      ...(override.speakers ?? {}),
    },
  };
}

export function colorFromHex(hex: string, fallback = Color.WHITE): Color {
  const normalized = hex.trim().replace(/^#/, '');
  if (normalized.length !== 6 && normalized.length !== 8) {
    return new Color(fallback.r, fallback.g, fallback.b, fallback.a);
  }

  const parsed = Number.parseInt(normalized, 16);
  if (!Number.isFinite(parsed)) {
    return new Color(fallback.r, fallback.g, fallback.b, fallback.a);
  }

  if (normalized.length === 6) {
    return new Color(
      (parsed >> 16) & 0xff,
      (parsed >> 8) & 0xff,
      parsed & 0xff,
      255,
    );
  }

  return new Color(
    (parsed >> 24) & 0xff,
    (parsed >> 16) & 0xff,
    (parsed >> 8) & 0xff,
    parsed & 0xff,
  );
}
