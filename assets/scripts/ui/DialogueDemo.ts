import { _decorator, Component, JsonAsset, resources } from 'cc';
import { DialogueManager } from '../dialogue/DialogueManager';
import { DialogueDocument } from '../dialogue/DialogueTypes';
import { DialogueBox } from './DialogueBox';

const { ccclass, property } = _decorator;

@ccclass('DialogueDemo')
export class DialogueDemo extends Component {
  @property(DialogueBox)
  public dialogueBox: DialogueBox | null = null;

  @property({ type: [JsonAsset] })
  public dialogueFiles: JsonAsset[] = [];

  @property
  public entryNodeId = 'ch0_intro_wake_001';

  @property
  public fallbackDemoResource = 'ui/dialogue/dialogue_ui_demo';

  private manager: DialogueManager | null = null;

  protected start(): void {
    if (!this.dialogueBox) {
      console.error(
        '[DialogueDemo] Assign a DialogueBox component before starting the demo.',
      );
      return;
    }

    if (this.dialogueFiles.length > 0) {
      this.startDocuments(this.dialogueFiles.map((asset) => asset.json));
      return;
    }

    resources.load(
      this.fallbackDemoResource,
      JsonAsset,
      (error, demoAsset) => {
        if (error || !demoAsset) {
          console.error(
            `[DialogueDemo] Could not load '${this.fallbackDemoResource}'.`,
            error,
          );
          return;
        }
        this.startDocuments([demoAsset.json]);
      },
    );
  }

  public getSnapshot() {
    return this.manager?.createSnapshot() ?? null;
  }

  private startDocuments(rawDocuments: readonly unknown[]): void {
    const documents = rawDocuments as DialogueDocument[];
    this.manager = new DialogueManager(documents);
    this.dialogueBox!.bind(this.manager);

    const entryId =
      documents.some((document) =>
        document.nodes.some((node) => node.id === this.entryNodeId),
      )
        ? this.entryNodeId
        : documents[0].entryId;

    this.manager.start(entryId);
  }
}

