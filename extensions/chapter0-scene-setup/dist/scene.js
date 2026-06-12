'use strict';

const { join } = require('path');
module.paths.push(join(Editor.App.path, 'node_modules'));

const MANAGED_ROOT_NAMES = [
  'BackgroundLayer',
  'InvestigationRoot',
  'FlashbackOverlay',
  'TimelineHud',
  'DialogueRoot',
  'FadeOverlay',
  'Chapter0Controller',
];

const INTERACTABLES = [
  {
    nodeName: 'BrokenTimeDevice',
    id: 'broken_time_device',
    displayName: 'Broken time device',
    position: [0, -160],
    size: [211, 90],
  },
  {
    nodeName: 'DamagedIdCard',
    id: 'damaged_id_card',
    displayName: 'Damaged ID card',
    position: [-221, -192],
    size: [154, 64],
  },
  {
    nodeName: 'ResearchNotes',
    id: 'research_notes',
    displayName: 'Research notes',
    position: [-288, -13],
    size: [173, 77],
  },
  {
    nodeName: 'OldNewspaper',
    id: 'old_newspaper',
    displayName: 'Old newspaper',
    position: [211, -192],
    size: [173, 70],
  },
  {
    nodeName: 'CrackedWatch',
    id: 'cracked_watch',
    displayName: 'Cracked watch',
    position: [-106, -237],
    size: [125, 58],
  },
  {
    nodeName: 'LabTerminal',
    id: 'lab_terminal',
    displayName: 'Lab terminal',
    position: [269, 19],
    size: [192, 102],
  },
  {
    nodeName: 'MemoryShard',
    id: 'memory_shard',
    displayName: 'Memory shard',
    position: [77, 51],
    size: [154, 102],
  },
  {
    nodeName: 'ExitDoor',
    id: 'exit_corridor',
    displayName: 'Exit door',
    position: [394, 0],
    size: [134, 179],
    showWhenLocked: true,
  },
];

const REQUIRED_NODE_PATHS = [
  'Camera',
  'Chapter0Controller',
  'BackgroundLayer',
  'BackgroundLayer/BackgroundPrimary',
  'BackgroundLayer/BackgroundTransition',
  'InvestigationRoot',
  ...INTERACTABLES.flatMap((entry) => [
    `InvestigationRoot/${entry.nodeName}`,
    `InvestigationRoot/${entry.nodeName}/Label`,
  ]),
  'FlashbackOverlay',
  'TimelineHud',
  'TimelineHud/StabilityBar',
  'TimelineHud/ValueLabel',
  'TimelineHud/Warning',
  'TimelineHud/Warning/WarningLabel',
  'DialogueRoot',
  'DialogueRoot/Panel',
  'DialogueRoot/Accent',
  'DialogueRoot/Portrait',
  'DialogueRoot/SpeakerName',
  'DialogueRoot/DialogueText',
  'DialogueRoot/Choices',
  'DialogueRoot/ContinueButton',
  'DialogueRoot/ContinueButton/Label',
  'DialogueRoot/PanelAdvanceButton',
  'FadeOverlay',
];

function engine() {
  return require('cc');
}

function classByName(name) {
  const { js } = engine();
  const constructor = js.getClassByName(name);
  if (!constructor) {
    throw new Error(
      `Project component '${name}' is unavailable. Wait for scripts to compile, then run the command again.`,
    );
  }
  return constructor;
}

function sceneId(scene) {
  return scene.uuid || scene._id || '';
}

function targetCanvas(expectedSceneUuid) {
  const { director } = engine();
  const scene = director.getScene();
  if (!scene) {
    throw new Error('No scene is currently open.');
  }
  if (sceneId(scene) !== expectedSceneUuid) {
    throw new Error(
      'Open assets/scenes/Chapter0.scene before running this command.',
    );
  }
  const canvas = scene.getChildByName('Canvas');
  if (!canvas) {
    throw new Error('Chapter0.scene does not contain the expected Canvas node.');
  }
  return { scene, canvas };
}

function removeManagedRoots(canvas) {
  for (const name of MANAGED_ROOT_NAMES) {
    const child = canvas.getChildByName(name);
    if (child) {
      child.removeFromParent();
      child.destroy();
    }
  }
}

function createNode(name, parent, size, position) {
  const { Layers, Node, UITransform } = engine();
  const node = new Node(name);
  node.layer = Layers.Enum.UI_2D;
  node.parent = parent;
  const transform = node.addComponent(UITransform);
  transform.setContentSize(size[0], size[1]);
  if (position) {
    node.setPosition(position[0], position[1], position[2] || 0);
  }
  return node;
}

function addFullScreenWidget(node) {
  const { Widget } = engine();
  const widget = node.addComponent(Widget);
  widget.isAlignTop = true;
  widget.isAlignBottom = true;
  widget.isAlignLeft = true;
  widget.isAlignRight = true;
  widget.top = 0;
  widget.bottom = 0;
  widget.left = 0;
  widget.right = 0;
  widget.alignMode = Widget.AlignMode.ALWAYS;
  return widget;
}

function addLabel(node, text, fontSize, lineHeight, color) {
  const { Label } = engine();
  const label = node.addComponent(Label);
  label.string = text;
  label.fontSize = fontSize;
  label.lineHeight = lineHeight;
  label.overflow = Label.Overflow.SHRINK;
  label.enableWrapText = true;
  if (color) {
    label.color = color;
  }
  return label;
}

function addButton(node) {
  const { Button } = engine();
  const button = node.addComponent(Button);
  button.transition = Button.Transition.NONE;
  return button;
}

function findNode(canvas, relativePath) {
  return relativePath
    .split('/')
    .filter(Boolean)
    .reduce(
      (current, segment) => current && current.getChildByName(segment),
      canvas,
    );
}

function getComponent(node, typeName) {
  if (!node) {
    return null;
  }
  if (typeName.startsWith('cc.')) {
    const constructor = engine()[typeName.slice(3)];
    return constructor ? node.getComponent(constructor) : null;
  }
  const constructor = engine().js.getClassByName(typeName);
  return constructor ? node.getComponent(constructor) : null;
}

function loadAsset(uuid) {
  const { assetManager } = engine();
  return new Promise((resolve, reject) => {
    assetManager.loadAny(uuid, (error, asset) => {
      if (error || !asset) {
        reject(
          new Error(
            `Could not load editor asset '${uuid}': ${error?.message || 'unknown error'}`,
          ),
        );
        return;
      }
      resolve(asset);
    });
  });
}

async function buildScene(options) {
  const {
    Color,
    Graphics,
    Label,
    Layout,
    ProgressBar,
    Sprite,
    UIOpacity,
  } = engine();
  const { canvas } = targetCanvas(options.sceneUuid);

  const BackgroundSwitcher = classByName('BackgroundSwitcher');
  const Chapter0Interactable = classByName('Chapter0Interactable');
  const Chapter0SceneController = classByName('Chapter0SceneController');
  const DialogueBox = classByName('DialogueBox');
  const DialogueChoiceList = classByName('DialogueChoiceList');
  const DialoguePortrait = classByName('DialoguePortrait');
  const MemoryFlashbackController = classByName(
    'MemoryFlashbackController',
  );
  const ScreenFader = classByName('ScreenFader');
  const TimelineInstabilityIndicator = classByName(
    'TimelineInstabilityIndicator',
  );
  const themeAsset = await loadAsset(options.themeUuid);

  removeManagedRoots(canvas);

  const backgroundLayer = createNode('BackgroundLayer', canvas, [960, 640]);
  addFullScreenWidget(backgroundLayer);
  const backgroundPrimaryNode = createNode(
    'BackgroundPrimary',
    backgroundLayer,
    [960, 640],
  );
  addFullScreenWidget(backgroundPrimaryNode);
  const backgroundPrimary = backgroundPrimaryNode.addComponent(Sprite);
  backgroundPrimary.sizeMode = Sprite.SizeMode.CUSTOM;
  const backgroundTransitionNode = createNode(
    'BackgroundTransition',
    backgroundLayer,
    [960, 640],
  );
  addFullScreenWidget(backgroundTransitionNode);
  const backgroundTransition = backgroundTransitionNode.addComponent(Sprite);
  backgroundTransition.sizeMode = Sprite.SizeMode.CUSTOM;
  backgroundTransitionNode.addComponent(UIOpacity).opacity = 0;
  const backgroundSwitcher =
    backgroundLayer.addComponent(BackgroundSwitcher);
  backgroundSwitcher.primarySprite = backgroundPrimary;
  backgroundSwitcher.transitionSprite = backgroundTransition;
  backgroundSwitcher.backgrounds = [];
  backgroundSwitcher.transitionSeconds = 0.35;

  const investigationRoot = createNode(
    'InvestigationRoot',
    canvas,
    [960, 640],
  );
  addFullScreenWidget(investigationRoot);
  const interactables = [];
  for (const definition of INTERACTABLES) {
    const hotspotNode = createNode(
      definition.nodeName,
      investigationRoot,
      definition.size,
      definition.position,
    );
    const button = addButton(hotspotNode);
    const marker = hotspotNode.addComponent(Graphics);
    const labelNode = createNode('Label', hotspotNode, [
      Math.max(100, definition.size[0] - 12),
      Math.max(34, definition.size[1] - 12),
    ]);
    const label = addLabel(
      labelNode,
      definition.displayName,
      18,
      22,
      new Color(233, 228, 216, 255),
    );
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;

    const interactable = hotspotNode.addComponent(Chapter0Interactable);
    interactable.interactableId = definition.id;
    interactable.displayName = definition.displayName;
    interactable.showWhenLocked = Boolean(definition.showWhenLocked);
    interactable.button = button;
    interactable.label = label;
    interactable.marker = marker;
    interactables.push(interactable);
  }

  const flashbackOverlay = createNode(
    'FlashbackOverlay',
    canvas,
    [960, 640],
  );
  addFullScreenWidget(flashbackOverlay);
  const vignetteGraphics = flashbackOverlay.addComponent(Graphics);
  flashbackOverlay.addComponent(UIOpacity).opacity = 0;
  const flashbackController = flashbackOverlay.addComponent(
    MemoryFlashbackController,
  );
  flashbackController.flashInSeconds = 0.16;
  flashbackController.restingOpacity = 42;
  flashbackController.vignetteGraphics = vignetteGraphics;

  const timelineHud = createNode(
    'TimelineHud',
    canvas,
    [900, 74],
    [0, 266],
  );
  const stabilityBarNode = createNode(
    'StabilityBar',
    timelineHud,
    [260, 18],
    [-300, 12],
  );
  const stabilitySprite = stabilityBarNode.addComponent(Sprite);
  stabilitySprite.sizeMode = Sprite.SizeMode.CUSTOM;
  stabilitySprite.color = new Color(120, 145, 166, 220);
  const stabilityBar = stabilityBarNode.addComponent(ProgressBar);
  stabilityBar.mode = ProgressBar.Mode.HORIZONTAL;
  stabilityBar.barSprite = stabilitySprite;
  stabilityBar.totalLength = 260;
  stabilityBar.progress = 1;
  const valueLabelNode = createNode(
    'ValueLabel',
    timelineHud,
    [560, 30],
    [105, 12],
  );
  const valueLabel = addLabel(
    valueLabelNode,
    'Timeline stability 100%',
    20,
    26,
    new Color(222, 225, 222, 255),
  );
  valueLabel.horizontalAlign = Label.HorizontalAlign.LEFT;
  const warningNode = createNode(
    'Warning',
    timelineHud,
    [860, 30],
    [0, -24],
  );
  const warningLabelNode = createNode(
    'WarningLabel',
    warningNode,
    [860, 30],
  );
  const warningLabel = addLabel(
    warningLabelNode,
    'TIMELINE INSTABILITY DETECTED',
    20,
    26,
    new Color(207, 158, 107, 255),
  );
  warningLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
  warningNode.active = false;
  const timelineIndicator = timelineHud.addComponent(
    TimelineInstabilityIndicator,
  );
  timelineIndicator.valueLabel = valueLabel;
  timelineIndicator.stabilityBar = stabilityBar;
  timelineIndicator.warningNode = warningNode;

  const dialogueRoot = createNode(
    'DialogueRoot',
    canvas,
    [900, 240],
    [0, -184],
  );
  const panelNode = createNode('Panel', dialogueRoot, [900, 240]);
  const panelGraphics = panelNode.addComponent(Graphics);
  const panelAdvanceNode = createNode(
    'PanelAdvanceButton',
    dialogueRoot,
    [900, 240],
  );
  const panelAdvanceButton = addButton(panelAdvanceNode);
  const accentNode = createNode(
    'Accent',
    dialogueRoot,
    [8, 220],
    [-438, 0],
  );
  const accentGraphics = accentNode.addComponent(Graphics);
  const portraitNode = createNode(
    'Portrait',
    dialogueRoot,
    [150, 200],
    [-350, 0],
  );
  const portraitSprite = portraitNode.addComponent(Sprite);
  portraitSprite.sizeMode = Sprite.SizeMode.CUSTOM;
  const portrait = portraitNode.addComponent(DialoguePortrait);
  portrait.portraitSprite = portraitSprite;
  portrait.portraits = [];
  const speakerNameNode = createNode(
    'SpeakerName',
    dialogueRoot,
    [580, 34],
    [92, 86],
  );
  const speakerLabel = addLabel(
    speakerNameNode,
    '',
    24,
    30,
    new Color(227, 222, 210, 255),
  );
  speakerLabel.horizontalAlign = Label.HorizontalAlign.LEFT;
  const dialogueTextNode = createNode(
    'DialogueText',
    dialogueRoot,
    [580, 102],
    [92, 24],
  );
  const dialogueLabel = addLabel(
    dialogueTextNode,
    '',
    22,
    29,
    new Color(238, 233, 222, 255),
  );
  dialogueLabel.horizontalAlign = Label.HorizontalAlign.LEFT;
  dialogueLabel.verticalAlign = Label.VerticalAlign.TOP;
  const choicesNode = createNode(
    'Choices',
    dialogueRoot,
    [580, 96],
    [92, -70],
  );
  const choicesLayout = choicesNode.addComponent(Layout);
  choicesLayout.type = Layout.Type.VERTICAL;
  choicesLayout.resizeMode = Layout.ResizeMode.CONTAINER;
  choicesLayout.spacingY = 8;
  const choiceList = choicesNode.addComponent(DialogueChoiceList);
  choiceList.container = choicesNode;
  choiceList.choiceButtonPrefab = null;
  choiceList.fallbackButtonWidth = 580;
  choiceList.fallbackButtonHeight = 54;
  const continueNode = createNode(
    'ContinueButton',
    dialogueRoot,
    [142, 46],
    [354, -88],
  );
  const continueGraphics = continueNode.addComponent(Graphics);
  continueGraphics.fillColor = new Color(26, 32, 42, 239);
  continueGraphics.strokeColor = new Color(109, 110, 106, 112);
  continueGraphics.lineWidth = 1;
  continueGraphics.rect(-71, -23, 142, 46);
  continueGraphics.fill();
  continueGraphics.stroke();
  const continueButton = addButton(continueNode);
  const continueLabelNode = createNode(
    'Label',
    continueNode,
    [126, 38],
  );
  const continueLabel = addLabel(
    continueLabelNode,
    'Continue',
    19,
    25,
    new Color(207, 200, 185, 255),
  );
  continueLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
  continueLabel.verticalAlign = Label.VerticalAlign.CENTER;

  const dialogueBox = dialogueRoot.addComponent(DialogueBox);
  dialogueBox.speakerLabel = speakerLabel;
  dialogueBox.dialogueLabel = dialogueLabel;
  dialogueBox.portrait = portrait;
  dialogueBox.choiceList = choiceList;
  dialogueBox.continueButton = continueButton;
  dialogueBox.continueButtonLabel = continueLabel;
  dialogueBox.panelAdvanceButton = panelAdvanceButton;
  dialogueBox.panelGraphics = panelGraphics;
  dialogueBox.accentGraphics = accentGraphics;
  dialogueBox.themeAsset = themeAsset;
  dialogueBox.typewriterEnabled = true;
  dialogueBox.charactersPerSecond = 42;

  const fadeOverlay = createNode('FadeOverlay', canvas, [960, 640]);
  addFullScreenWidget(fadeOverlay);
  const fadeGraphics = fadeOverlay.addComponent(Graphics);
  fadeOverlay.addComponent(UIOpacity).opacity = 255;
  const screenFader = fadeOverlay.addComponent(ScreenFader);
  screenFader.fadeSeconds = 1.1;
  screenFader.overlayGraphics = fadeGraphics;

  const controllerNode = createNode(
    'Chapter0Controller',
    canvas,
    [1, 1],
  );
  const sceneController = controllerNode.addComponent(
    Chapter0SceneController,
  );
  sceneController.dialogueBox = dialogueBox;
  sceneController.backgroundSwitcher = backgroundSwitcher;
  sceneController.flashbackController = flashbackController;
  sceneController.timelineIndicator = timelineIndicator;
  sceneController.screenFader = screenFader;
  sceneController.investigationRoot = investigationRoot;
  sceneController.interactables = interactables;
  sceneController.autoCreateMissingHotspots = true;
  sceneController.manifestResource = 'dialogue/chapter0/ch0_manifest';
  sceneController.entryNodeIdOverride = '';

  return {
    ok: true,
    errors: [],
    warnings: [
      'The ProgressBar uses its generated Sprite as the bar; replace its SpriteFrame only if a custom HUD skin is desired.',
    ],
    createdNodeCount: REQUIRED_NODE_PATHS.length - 1,
  };
}

function validateScene(options) {
  const errors = [];
  const warnings = [];
  let canvas;
  try {
    canvas = targetCanvas(options.sceneUuid).canvas;
  } catch (error) {
    return { ok: false, errors: [error.message], warnings };
  }

  for (const nodePath of REQUIRED_NODE_PATHS) {
    if (!findNode(canvas, nodePath)) {
      errors.push(`Missing node: Canvas/${nodePath}.`);
    }
  }
  if (errors.length > 0) {
    return { ok: false, errors, warnings };
  }

  const requiredComponents = [
    ['Camera', 'cc.Camera'],
    ['BackgroundLayer', 'BackgroundSwitcher'],
    ['BackgroundLayer/BackgroundPrimary', 'cc.Sprite'],
    ['BackgroundLayer/BackgroundTransition', 'cc.Sprite'],
    ['FlashbackOverlay', 'MemoryFlashbackController'],
    ['TimelineHud', 'TimelineInstabilityIndicator'],
    ['TimelineHud/StabilityBar', 'cc.ProgressBar'],
    ['TimelineHud/ValueLabel', 'cc.Label'],
    ['DialogueRoot', 'DialogueBox'],
    ['DialogueRoot/Panel', 'cc.Graphics'],
    ['DialogueRoot/Accent', 'cc.Graphics'],
    ['DialogueRoot/Portrait', 'DialoguePortrait'],
    ['DialogueRoot/Choices', 'DialogueChoiceList'],
    ['DialogueRoot/ContinueButton', 'cc.Button'],
    ['DialogueRoot/PanelAdvanceButton', 'cc.Button'],
    ['FadeOverlay', 'ScreenFader'],
    ['Chapter0Controller', 'Chapter0SceneController'],
  ];
  for (const definition of INTERACTABLES) {
    requiredComponents.push(
      [`InvestigationRoot/${definition.nodeName}`, 'Chapter0Interactable'],
      [`InvestigationRoot/${definition.nodeName}`, 'cc.Button'],
      [`InvestigationRoot/${definition.nodeName}`, 'cc.Graphics'],
    );
  }
  for (const [nodePath, typeName] of requiredComponents) {
    const node = findNode(canvas, nodePath);
    if (!getComponent(node, typeName)) {
      errors.push(`Canvas/${nodePath} is missing ${typeName}.`);
    }
  }

  const backgroundSwitcher = getComponent(
    findNode(canvas, 'BackgroundLayer'),
    'BackgroundSwitcher',
  );
  const primarySprite = getComponent(
    findNode(canvas, 'BackgroundLayer/BackgroundPrimary'),
    'cc.Sprite',
  );
  const transitionSprite = getComponent(
    findNode(canvas, 'BackgroundLayer/BackgroundTransition'),
    'cc.Sprite',
  );
  if (
    backgroundSwitcher &&
    (backgroundSwitcher.primarySprite !== primarySprite ||
      backgroundSwitcher.transitionSprite !== transitionSprite)
  ) {
    errors.push('BackgroundSwitcher Sprite references are not assigned.');
  }

  const flashbackController = getComponent(
    findNode(canvas, 'FlashbackOverlay'),
    'MemoryFlashbackController',
  );
  if (
    flashbackController &&
    flashbackController.vignetteGraphics !==
      getComponent(findNode(canvas, 'FlashbackOverlay'), 'cc.Graphics')
  ) {
    errors.push('MemoryFlashbackController.vignetteGraphics is not assigned.');
  }

  const timelineIndicator = getComponent(
    findNode(canvas, 'TimelineHud'),
    'TimelineInstabilityIndicator',
  );
  if (
    timelineIndicator &&
    (timelineIndicator.valueLabel !==
      getComponent(findNode(canvas, 'TimelineHud/ValueLabel'), 'cc.Label') ||
      timelineIndicator.stabilityBar !==
        getComponent(
          findNode(canvas, 'TimelineHud/StabilityBar'),
          'cc.ProgressBar',
        ) ||
      timelineIndicator.warningNode !==
        findNode(canvas, 'TimelineHud/Warning'))
  ) {
    errors.push('TimelineInstabilityIndicator references are not assigned.');
  }

  const portrait = getComponent(
    findNode(canvas, 'DialogueRoot/Portrait'),
    'DialoguePortrait',
  );
  if (
    portrait &&
    portrait.portraitSprite !==
      getComponent(findNode(canvas, 'DialogueRoot/Portrait'), 'cc.Sprite')
  ) {
    errors.push('DialoguePortrait.portraitSprite is not assigned.');
  }

  const choiceList = getComponent(
    findNode(canvas, 'DialogueRoot/Choices'),
    'DialogueChoiceList',
  );
  if (
    choiceList &&
    choiceList.container !== findNode(canvas, 'DialogueRoot/Choices')
  ) {
    errors.push('DialogueChoiceList.container is not assigned.');
  }

  const dialogueBox = getComponent(
    findNode(canvas, 'DialogueRoot'),
    'DialogueBox',
  );
  if (dialogueBox) {
    const expectedDialogueReferences = [
      ['speakerLabel', 'DialogueRoot/SpeakerName', 'cc.Label'],
      ['dialogueLabel', 'DialogueRoot/DialogueText', 'cc.Label'],
      ['portrait', 'DialogueRoot/Portrait', 'DialoguePortrait'],
      ['choiceList', 'DialogueRoot/Choices', 'DialogueChoiceList'],
      ['continueButton', 'DialogueRoot/ContinueButton', 'cc.Button'],
      ['continueButtonLabel', 'DialogueRoot/ContinueButton/Label', 'cc.Label'],
      ['panelAdvanceButton', 'DialogueRoot/PanelAdvanceButton', 'cc.Button'],
      ['panelGraphics', 'DialogueRoot/Panel', 'cc.Graphics'],
      ['accentGraphics', 'DialogueRoot/Accent', 'cc.Graphics'],
    ];
    for (const [property, nodePath, typeName] of expectedDialogueReferences) {
      if (
        dialogueBox[property] !==
        getComponent(findNode(canvas, nodePath), typeName)
      ) {
        errors.push(`DialogueBox.${property} is not assigned.`);
      }
    }
    if (!dialogueBox.themeAsset) {
      errors.push('DialogueBox.themeAsset is not assigned.');
    }
  }

  const screenFader = getComponent(
    findNode(canvas, 'FadeOverlay'),
    'ScreenFader',
  );
  if (
    screenFader &&
    screenFader.overlayGraphics !==
      getComponent(findNode(canvas, 'FadeOverlay'), 'cc.Graphics')
  ) {
    errors.push('ScreenFader.overlayGraphics is not assigned.');
  }

  const sceneController = getComponent(
    findNode(canvas, 'Chapter0Controller'),
    'Chapter0SceneController',
  );
  if (sceneController) {
    const expectedControllerReferences = [
      ['dialogueBox', 'DialogueRoot', 'DialogueBox'],
      ['backgroundSwitcher', 'BackgroundLayer', 'BackgroundSwitcher'],
      [
        'flashbackController',
        'FlashbackOverlay',
        'MemoryFlashbackController',
      ],
      [
        'timelineIndicator',
        'TimelineHud',
        'TimelineInstabilityIndicator',
      ],
      ['screenFader', 'FadeOverlay', 'ScreenFader'],
    ];
    for (const [property, nodePath, typeName] of expectedControllerReferences) {
      if (
        sceneController[property] !==
        getComponent(findNode(canvas, nodePath), typeName)
      ) {
        errors.push(`Chapter0SceneController.${property} is not assigned.`);
      }
    }
    if (
      sceneController.investigationRoot !==
      findNode(canvas, 'InvestigationRoot')
    ) {
      errors.push(
        'Chapter0SceneController.investigationRoot is not assigned.',
      );
    }
    if (
      sceneController.manifestResource !==
      'dialogue/chapter0/ch0_manifest'
    ) {
      errors.push('Chapter0SceneController.manifestResource is incorrect.');
    }
    if (sceneController.interactables.length !== INTERACTABLES.length) {
      errors.push(
        `Chapter0SceneController.interactables has ${sceneController.interactables.length} entries; expected ${INTERACTABLES.length}.`,
      );
    }
  }

  for (let index = 0; index < INTERACTABLES.length; index += 1) {
    const definition = INTERACTABLES[index];
    const node = findNode(
      canvas,
      `InvestigationRoot/${definition.nodeName}`,
    );
    const interactable = getComponent(node, 'Chapter0Interactable');
    if (!interactable) {
      continue;
    }
    if (
      interactable.interactableId !== definition.id ||
      interactable.displayName !== definition.displayName ||
      interactable.button !== getComponent(node, 'cc.Button') ||
      interactable.marker !== getComponent(node, 'cc.Graphics') ||
      interactable.label !==
        getComponent(node.getChildByName('Label'), 'cc.Label')
    ) {
      errors.push(
        `Chapter0Interactable bindings are incomplete on ${definition.nodeName}.`,
      );
    }
    if (
      sceneController &&
      sceneController.interactables[index] !== interactable
    ) {
      errors.push(
        `Chapter0SceneController.interactables[${index}] is not ${definition.nodeName}.`,
      );
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    checkedNodeCount: REQUIRED_NODE_PATHS.length,
    checkedComponentCount: requiredComponents.length,
  };
}

exports.methods = {
  async buildChapter0Scene(options) {
    try {
      return await buildScene(options);
    } catch (error) {
      return {
        ok: false,
        errors: [error.stack || error.message || String(error)],
        warnings: [],
      };
    }
  },

  validateChapter0Scene(options) {
    try {
      return validateScene(options);
    } catch (error) {
      return {
        ok: false,
        errors: [error.stack || error.message || String(error)],
        warnings: [],
      };
    }
  },
};

function load() {}
function unload() {}

exports.load = load;
exports.unload = unload;
