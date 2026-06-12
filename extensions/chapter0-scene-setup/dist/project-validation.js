'use strict';

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'assets/scenes/Chapter0.scene',
  'assets/scripts/chapter0/Chapter0SceneController.ts',
  'assets/scripts/chapter0/Chapter0Interactable.ts',
  'assets/scripts/chapter0/MemoryFlashbackController.ts',
  'assets/scripts/core/ChapterProgressState.ts',
  'assets/scripts/core/SpeakerRegistry.ts',
  'assets/scripts/dialogue/DialogueManager.ts',
  'assets/scripts/dialogue/DialogueTypes.ts',
  'assets/scripts/ui/BackgroundSwitcher.ts',
  'assets/scripts/ui/DialogueBox.ts',
  'assets/scripts/ui/DialogueChoiceButton.ts',
  'assets/scripts/ui/DialogueChoiceList.ts',
  'assets/scripts/ui/DialoguePortrait.ts',
  'assets/scripts/ui/ScreenFader.ts',
  'assets/scripts/ui/TimelineInstabilityIndicator.ts',
  'assets/resources/dialogue/chapter0/ch0_intro.json',
  'assets/resources/dialogue/chapter0/ch0_room_inspections.json',
  'assets/resources/dialogue/chapter0/ch0_flashbacks.json',
  'assets/resources/dialogue/chapter0/ch0_ai_fragments.json',
  'assets/resources/dialogue/chapter0/ch0_choices.json',
  'assets/resources/dialogue/chapter0/ch0_manifest.json',
  'assets/resources/ui/dialogue/dialogue_theme.json',
  'assets/resources/images/chapter0/ui/dialogue_panel_rough.svg',
  'assets/resources/images/chapter0/ui/dialogue_choice_rough.svg',
];

const REQUIRED_DIRECTORIES = [
  'assets/scenes',
  'assets/scripts',
  'assets/scripts/chapter0',
  'assets/scripts/core',
  'assets/scripts/dialogue',
  'assets/scripts/ui',
  'assets/resources',
  'assets/resources/dialogue',
  'assets/resources/dialogue/chapter0',
  'assets/resources/images',
  'assets/resources/images/chapter0',
  'assets/resources/images/chapter0/backgrounds',
  'assets/resources/images/chapter0/characters',
  'assets/resources/images/chapter0/props',
  'assets/resources/images/chapter0/ui',
  'assets/resources/ui',
  'assets/resources/ui/dialogue',
];

function readJson(filePath, errors) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    errors.push(`${relative(filePath)} is not valid JSON: ${error.message}`);
    return null;
  }
}

let validationRoot = process.cwd();

function relative(filePath) {
  return path.relative(validationRoot, filePath).replace(/\\/g, '/');
}

function validateMetaPair(targetPath, errors) {
  const metaPath = `${targetPath}.meta`;
  if (!fs.existsSync(metaPath)) {
    errors.push(`${relative(targetPath)} is missing ${relative(metaPath)}.`);
    return;
  }

  const meta = readJson(metaPath, errors);
  if (meta && typeof meta.uuid !== 'string') {
    errors.push(`${relative(metaPath)} does not contain a UUID.`);
  }
}

function resourceFileFromManifestPath(projectRoot, resourcePath) {
  const withoutSubAsset = resourcePath.replace(/\/spriteFrame$/, '');
  const base = path.join(projectRoot, 'assets', 'resources', withoutSubAsset);
  const candidates = [
    `${base}.png`,
    `${base}.jpg`,
    `${base}.jpeg`,
    `${base}.webp`,
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function validateManifest(projectRoot, errors) {
  const manifestPath = path.join(
    projectRoot,
    'assets',
    'resources',
    'dialogue',
    'chapter0',
    'ch0_manifest.json',
  );
  const manifest = readJson(manifestPath, errors);
  if (!manifest) {
    return;
  }

  if (manifest.schemaVersion !== 1 || manifest.chapterId !== 'chapter0_prologue') {
    errors.push('ch0_manifest.json has an unexpected schema or chapter ID.');
  }

  for (const entry of manifest.dialogueDocuments || []) {
    const filePath = path.join(
      projectRoot,
      'assets',
      'resources',
      `${entry.resource}.json`,
    );
    if (!fs.existsSync(filePath)) {
      errors.push(`Manifest dialogue resource is missing: ${entry.resource}.`);
      continue;
    }
    const document = readJson(filePath, errors);
    if (document && document.fileId !== entry.fileId) {
      errors.push(
        `Manifest fileId ${entry.fileId} does not match ${relative(filePath)}.`,
      );
    }
  }

  for (const entry of manifest.backgrounds || []) {
    if (!resourceFileFromManifestPath(projectRoot, entry.resource)) {
      errors.push(`Manifest background resource is missing: ${entry.resource}.`);
    }
  }

  for (const speaker of manifest.speakers || []) {
    if (
      speaker.portraitResource &&
      !resourceFileFromManifestPath(projectRoot, speaker.portraitResource)
    ) {
      errors.push(
        `Manifest portrait resource is missing: ${speaker.portraitResource}.`,
      );
    }
  }
}

function validateChapter0AssetTree(projectRoot, errors) {
  const roots = [
    path.join(projectRoot, 'assets', 'resources', 'dialogue', 'chapter0'),
    path.join(projectRoot, 'assets', 'resources', 'images', 'chapter0'),
  ];

  for (const root of roots) {
    if (!fs.existsSync(root)) {
      continue;
    }
    const pending = [root];
    while (pending.length > 0) {
      const current = pending.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        if (entry.name.endsWith('.meta') || entry.name === '.gitkeep') {
          continue;
        }
        const fullPath = path.join(current, entry.name);
        validateMetaPair(fullPath, errors);
        if (entry.isDirectory()) {
          pending.push(fullPath);
        } else if (entry.name.endsWith('.json')) {
          readJson(fullPath, errors);
        }
      }
    }
  }
}

function validateProject(projectRoot) {
  validationRoot = projectRoot;
  const errors = [];
  const warnings = [];

  for (const relativePath of REQUIRED_FILES) {
    const fullPath = path.join(projectRoot, relativePath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing required file: ${relativePath}.`);
      continue;
    }
    validateMetaPair(fullPath, errors);
    if (relativePath.endsWith('.json')) {
      readJson(fullPath, errors);
    }
  }

  for (const relativePath of REQUIRED_DIRECTORIES) {
    const fullPath = path.join(projectRoot, relativePath);
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
      errors.push(`Missing required directory: ${relativePath}.`);
      continue;
    }
    validateMetaPair(fullPath, errors);
  }

  validateManifest(projectRoot, errors);
  validateChapter0AssetTree(projectRoot, errors);

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    checkedFileCount: REQUIRED_FILES.length,
    checkedDirectoryCount: REQUIRED_DIRECTORIES.length,
  };
}

function readAssetUuid(projectRoot, relativePath) {
  const errors = [];
  validationRoot = projectRoot;
  const meta = readJson(path.join(projectRoot, `${relativePath}.meta`), errors);
  if (!meta || typeof meta.uuid !== 'string') {
    throw new Error(
      errors[0] || `${relativePath}.meta does not contain an asset UUID.`,
    );
  }
  return meta.uuid;
}

function formatReport(title, report) {
  const lines = [
    `[Chapter 0 Scene Setup] ${title}: ${report.ok ? 'PASS' : 'FAIL'}`,
  ];
  for (const error of report.errors || []) {
    lines.push(`  ERROR: ${error}`);
  }
  for (const warning of report.warnings || []) {
    lines.push(`  WARNING: ${warning}`);
  }
  return lines.join('\n');
}

module.exports = {
  formatReport,
  readAssetUuid,
  validateProject,
};

if (require.main === module) {
  const projectRoot = path.resolve(__dirname, '../../..');
  const report = validateProject(projectRoot);
  console.log(formatReport('project resources and metadata', report));
  process.exitCode = report.ok ? 0 : 1;
}
