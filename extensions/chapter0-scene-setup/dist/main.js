'use strict';

const packageJSON = require('../package.json');
const {
  formatReport,
  readAssetUuid,
  validateProject,
} = require('./project-validation');

async function executeSceneMethod(method, args) {
  return Editor.Message.request('scene', 'execute-scene-script', {
    name: packageJSON.name,
    method,
    args,
  });
}

function projectOptions() {
  const projectRoot = Editor.Project.path;
  return {
    projectRoot,
    sceneUuid: readAssetUuid(projectRoot, 'assets/scenes/Chapter0.scene'),
    themeUuid: readAssetUuid(
      projectRoot,
      'assets/resources/ui/dialogue/dialogue_theme.json',
    ),
  };
}

function assertProjectResources(projectRoot) {
  const report = validateProject(projectRoot);
  console.log(formatReport('project resources and metadata', report));
  if (!report.ok) {
    throw new Error(
      'Chapter 0 project validation failed. See the Cocos Console for details.',
    );
  }
  return report;
}

async function validateChapter0Scene() {
  const options = projectOptions();
  const projectReport = assertProjectResources(options.projectRoot);
  const sceneReport = await executeSceneMethod('validateChapter0Scene', [
    options,
  ]);
  console.log(formatReport('live Chapter0.scene graph', sceneReport));
  if (!sceneReport.ok) {
    throw new Error(
      'Chapter0.scene validation failed. See the Cocos Console for details.',
    );
  }
  return {
    ok: true,
    project: projectReport,
    scene: sceneReport,
  };
}

async function buildChapter0Scene() {
  const options = projectOptions();
  assertProjectResources(options.projectRoot);

  const buildReport = await executeSceneMethod('buildChapter0Scene', [options]);
  console.log(formatReport('Chapter0.scene build', buildReport));
  if (!buildReport.ok) {
    throw new Error(
      'Chapter0.scene could not be built. See the Cocos Console for details.',
    );
  }

  const sceneReport = await executeSceneMethod('validateChapter0Scene', [
    options,
  ]);
  console.log(formatReport('live Chapter0.scene graph', sceneReport));
  if (!sceneReport.ok) {
    throw new Error(
      'Chapter0.scene was built but failed validation; it was not saved.',
    );
  }

  await Editor.Message.request('scene', 'save-scene');
  console.log(
    '[Chapter 0 Scene Setup] Chapter0.scene hierarchy, component bindings, and asset references were saved.',
  );
  return sceneReport;
}

exports.methods = {
  buildChapter0Scene,
  validateChapter0Scene,
};

function load() {}
function unload() {}

exports.load = load;
exports.unload = unload;
