import { DialogueSpeaker } from '../dialogue/DialogueTypes';

export interface SpeakerProfile {
  speaker: DialogueSpeaker;
  displayName: string;
  accent: string;
  portraitAssetId?: string;
  portraitResource?: string;
}

export const DEFAULT_SPEAKER_PROFILES: readonly SpeakerProfile[] = [
  {
    speaker: 'Narration',
    displayName: 'Narration',
    accent: '#777B80FF',
  },
  {
    speaker: 'Player',
    displayName: 'Trainee Historian',
    accent: '#9AA0A5FF',
    portraitAssetId: 'char_ch0_main_trainee_historian_portrait',
    portraitResource:
      'images/chapter0/characters/char_ch0_main_trainee_historian_portrait/spriteFrame',
  },
  {
    speaker: 'Logic',
    displayName: 'Logic',
    accent: '#7891A6FF',
    portraitAssetId: 'char_ch0_ai_logic_portrait',
    portraitResource:
      'images/chapter0/characters/char_ch0_ai_logic_portrait/spriteFrame',
  },
  {
    speaker: 'Empathy',
    displayName: 'Empathy',
    accent: '#8F799BFF',
    portraitAssetId: 'char_ch0_ai_empathy_portrait',
    portraitResource:
      'images/chapter0/characters/char_ch0_ai_empathy_portrait/spriteFrame',
  },
  {
    speaker: 'Scepticism',
    displayName: 'Scepticism',
    accent: '#4E506FFF',
    portraitAssetId: 'char_ch0_ai_scepticism_portrait',
    portraitResource:
      'images/chapter0/characters/char_ch0_ai_scepticism_portrait/spriteFrame',
  },
  {
    speaker: 'Memory',
    displayName: 'Memory',
    accent: '#697F8FFF',
    portraitAssetId: 'char_ch0_ai_memory_portrait',
    portraitResource:
      'images/chapter0/characters/char_ch0_ai_memory_portrait/spriteFrame',
  },
  {
    speaker: 'Conscience',
    displayName: 'Conscience',
    accent: '#A18E64FF',
    portraitAssetId: 'char_ch0_ai_conscience_portrait',
    portraitResource:
      'images/chapter0/characters/char_ch0_ai_conscience_portrait/spriteFrame',
  },
  {
    speaker: 'System',
    displayName: 'Objective',
    accent: '#8D846EFF',
  },
];

export class SpeakerRegistry {
  private readonly profiles = new Map<DialogueSpeaker, SpeakerProfile>();

  public constructor(
    profiles: readonly SpeakerProfile[] = DEFAULT_SPEAKER_PROFILES,
  ) {
    this.replace(profiles);
  }

  public replace(profiles: readonly SpeakerProfile[]): void {
    this.profiles.clear();
    for (const profile of profiles) {
      this.profiles.set(profile.speaker, { ...profile });
    }
  }

  public get(speaker: DialogueSpeaker): SpeakerProfile {
    return (
      this.profiles.get(speaker) ??
      DEFAULT_SPEAKER_PROFILES.find(
        (profile) => profile.speaker === speaker,
      ) ?? {
        speaker,
        displayName: speaker,
        accent: '#8D846EFF',
      }
    );
  }

  public getAll(): SpeakerProfile[] {
    return [...this.profiles.values()].map((profile) => ({ ...profile }));
  }
}
