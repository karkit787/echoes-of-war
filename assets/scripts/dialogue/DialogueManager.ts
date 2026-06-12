import {
  DIALOGUE_SPEAKERS,
  DialogueChoice,
  DialogueCondition,
  DialogueConditions,
  DialogueDocument,
  DialogueEffects,
  DialogueHistoryEntry,
  DialogueListener,
  DialogueNode,
  DialogueScalar,
  DialogueSnapshot,
  DialogueState,
  DialogueStateValue,
  DialogueViewState,
} from './DialogueTypes';

export class DialogueManager {
  private readonly nodes = new Map<string, DialogueNode>();
  private readonly listeners = new Set<DialogueListener>();
  private readonly state: DialogueState;
  private readonly history: DialogueHistoryEntry[] = [];
  private currentNode: DialogueNode | null = null;

  public constructor(
    documents: readonly DialogueDocument[],
    initialState: DialogueState = {},
  ) {
    this.state = this.cloneState(initialState);
    this.indexDocuments(documents);
  }

  public subscribe(listener: DialogueListener): () => void {
    this.listeners.add(listener);
    listener(this.getViewState());
    return () => this.listeners.delete(listener);
  }

  public start(entryId: string): DialogueViewState {
    this.history.length = 0;
    this.enter(entryId);
    return this.getViewState();
  }

  public restore(snapshot: DialogueSnapshot): DialogueViewState {
    this.replaceState(snapshot.state);
    this.history.length = 0;
    this.history.push(...snapshot.history.map((entry) => ({ ...entry })));

    if (snapshot.currentNodeId === null) {
      this.currentNode = null;
      this.emit();
      return this.getViewState();
    }

    const node = this.nodes.get(snapshot.currentNodeId);
    if (!node) {
      throw new Error(
        `Cannot restore missing dialogue node '${snapshot.currentNodeId}'.`,
      );
    }

    this.currentNode = node;
    this.emit();
    return this.getViewState();
  }

  public advance(): DialogueViewState {
    if (!this.currentNode) {
      return this.getViewState();
    }

    if (this.getAvailableChoices().length > 0) {
      return this.getViewState();
    }

    const nextId = this.currentNode.next;
    this.applyEffects(this.currentNode.effects);

    if (!nextId) {
      this.currentNode = null;
      this.emit();
      return this.getViewState();
    }

    this.enter(nextId);
    return this.getViewState();
  }

  public goTo(nodeId: string): DialogueViewState {
    this.enter(nodeId);
    return this.getViewState();
  }

  public hasNode(nodeId: string): boolean {
    return this.nodes.has(nodeId);
  }

  public selectChoice(visibleChoiceIndex: number): DialogueViewState {
    if (!this.currentNode) {
      throw new Error('Cannot select a choice after dialogue completion.');
    }

    const choices = this.getAvailableChoices();
    const choice = choices[visibleChoiceIndex];
    if (!choice) {
      throw new Error(
        `Choice index ${visibleChoiceIndex} is unavailable for node '${this.currentNode.id}'.`,
      );
    }

    this.applyEffects(this.currentNode.effects);
    this.applyEffects(choice.effects);
    this.enter(choice.next);
    return this.getViewState();
  }

  public getViewState(): DialogueViewState {
    return {
      node: this.currentNode,
      choices: this.getAvailableChoices(),
      history: this.history,
      state: this.state,
      isComplete: this.currentNode === null,
    };
  }

  public createSnapshot(): DialogueSnapshot {
    return {
      currentNodeId: this.currentNode?.id ?? null,
      state: this.cloneState(this.state),
      history: this.history.map((entry) => ({ ...entry })),
    };
  }

  private indexDocuments(documents: readonly DialogueDocument[]): void {
    if (documents.length === 0) {
      throw new Error('DialogueManager requires at least one dialogue document.');
    }

    for (const document of documents) {
      if (document.schemaVersion !== 1) {
        throw new Error(
          `Unsupported dialogue schema version ${document.schemaVersion} in '${document.fileId}'.`,
        );
      }

      for (const node of document.nodes) {
        if (!DIALOGUE_SPEAKERS.includes(node.speaker)) {
          throw new Error(
            `Dialogue node '${node.id}' has unsupported speaker '${node.speaker}'.`,
          );
        }
        if (this.nodes.has(node.id)) {
          throw new Error(`Duplicate dialogue node id '${node.id}'.`);
        }
        this.nodes.set(node.id, node);
      }
    }

    for (const node of this.nodes.values()) {
      this.assertTarget(node.id, node.next);
      for (const choice of node.choices ?? []) {
        this.assertTarget(node.id, choice.next);
      }
    }
  }

  private assertTarget(sourceId: string, targetId?: string): void {
    if (targetId && !this.nodes.has(targetId)) {
      throw new Error(
        `Dialogue node '${sourceId}' references missing target '${targetId}'.`,
      );
    }
  }

  private enter(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Dialogue node '${nodeId}' does not exist.`);
    }
    if (!this.matchesConditions(node.conditions)) {
      throw new Error(`Dialogue node '${nodeId}' does not meet its conditions.`);
    }

    this.currentNode = node;
    this.history.push({
      nodeId: node.id,
      speaker: node.speaker,
      text: node.text,
    });
    this.emit();
  }

  private getAvailableChoices(): DialogueChoice[] {
    return (this.currentNode?.choices ?? []).filter((choice) =>
      this.matchesConditions(choice.conditions),
    );
  }

  private matchesConditions(conditions?: DialogueConditions): boolean {
    if (!conditions) {
      return true;
    }

    const allMatches = (conditions.all ?? []).every((condition) =>
      this.matchesCondition(condition),
    );
    const any = conditions.any ?? [];
    const anyMatches =
      any.length === 0 || any.some((condition) => this.matchesCondition(condition));

    return allMatches && anyMatches;
  }

  private matchesCondition(condition: DialogueCondition): boolean {
    const expected = condition.value;
    const stored = this.getStateValue(condition.key);
    const actual =
      stored ??
      (typeof expected === 'boolean'
        ? false
        : typeof expected === 'number'
          ? 0
          : undefined);

    switch (condition.operator) {
      case 'equals':
        return actual === expected;
      case 'not_equals':
        return actual !== expected;
      case 'gte':
        return (
          typeof actual === 'number' &&
          typeof expected === 'number' &&
          actual >= expected
        );
      case 'lte':
        return (
          typeof actual === 'number' &&
          typeof expected === 'number' &&
          actual <= expected
        );
      case 'contains':
        return (
          Array.isArray(actual) &&
          expected !== undefined &&
          actual.includes(expected)
        );
      case 'exists':
        return Object.prototype.hasOwnProperty.call(this.state, condition.key);
      default:
        return false;
    }
  }

  private getStateValue(key: string): DialogueStateValue | undefined {
    if (Object.prototype.hasOwnProperty.call(this.state, key)) {
      return this.state[key];
    }
    return undefined;
  }

  private applyEffects(effects?: DialogueEffects): void {
    if (!effects) {
      return;
    }

    for (const [key, value] of Object.entries(effects.set ?? {})) {
      this.state[key] = this.cloneStateValue(value);
    }

    for (const [key, value] of Object.entries(effects.setIfAbsent ?? {})) {
      if (!Object.prototype.hasOwnProperty.call(this.state, key)) {
        this.state[key] = this.cloneStateValue(value);
      }
    }

    for (const [key, amount] of Object.entries(effects.increment ?? {})) {
      const current = this.state[key];
      this.state[key] = (typeof current === 'number' ? current : 0) + amount;
    }

    for (const [key, values] of Object.entries(effects.appendUnique ?? {})) {
      const current = this.state[key];
      const list: DialogueScalar[] = Array.isArray(current) ? [...current] : [];
      for (const value of values) {
        if (!list.includes(value)) {
          list.push(value);
        }
      }
      this.state[key] = list;
    }
  }

  private replaceState(nextState: DialogueState): void {
    for (const key of Object.keys(this.state)) {
      delete this.state[key];
    }
    Object.assign(this.state, this.cloneState(nextState));
  }

  private cloneState(source: DialogueState): DialogueState {
    return Object.fromEntries(
      Object.entries(source).map(([key, value]) => [
        key,
        this.cloneStateValue(value),
      ]),
    );
  }

  private cloneStateValue(value: DialogueStateValue): DialogueStateValue {
    return Array.isArray(value) ? [...value] : value;
  }

  private emit(): void {
    const viewState = this.getViewState();
    for (const listener of this.listeners) {
      listener(viewState);
    }
  }
}
