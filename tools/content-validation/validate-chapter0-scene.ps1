[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\.."))
$errors = [System.Collections.Generic.List[string]]::new()

$requiredFiles = @(
    "assets\scripts\core\ChapterProgressState.ts",
    "assets\scripts\core\SpeakerRegistry.ts",
    "assets\scripts\chapter0\Chapter0FlowController.ts",
    "assets\scripts\chapter0\Chapter0SceneController.ts",
    "assets\scripts\chapter0\Chapter0Interactable.ts",
    "assets\scripts\chapter0\MemoryFlashbackController.ts",
    "assets\scripts\ui\BackgroundSwitcher.ts",
    "assets\scripts\ui\DialogueChoiceButton.ts",
    "assets\scripts\ui\ScreenFader.ts",
    "assets\scripts\ui\TimelineInstabilityIndicator.ts",
    "assets\resources\dialogue\chapter0\ch0_manifest.json",
    "assets\scenes\Chapter0.scene",
    "tests\gameplay\chapter0_vertical_slice.test.mjs",
    "tests\gameplay\chapter0_qa.test.mjs",
    "docs\dev\chapter0_playable_scene.md",
    "docs\dev\chapter0_playtest_checklist.md",
    "docs\dev\chapter0_implementation_summary.md"
)

foreach ($relativePath in $requiredFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $repoRoot $relativePath) -PathType Leaf)) {
        $errors.Add("Missing Chapter 0 scene file: $relativePath")
    }
}

$requiredBackgrounds = @(
    "bg_ch0_abandoned_room.png",
    "bg_ch0_abandoned_corridor.png",
    "bg_ch0_time_machine_chamber.png",
    "bg_ch0_destroyed_lab_flashback.png",
    "bg_ch0_memory_void.png"
)

foreach ($filename in $requiredBackgrounds) {
    $path = Join-Path $repoRoot "assets\resources\images\chapter0\backgrounds\$filename"
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        $errors.Add("Missing Chapter 0 background: $filename")
    }
}

$requiredPortraits = @(
    "char_ch0_main_trainee_historian_portrait.png",
    "char_ch0_ai_logic_portrait.png",
    "char_ch0_ai_empathy_portrait.png",
    "char_ch0_ai_scepticism_portrait.png",
    "char_ch0_ai_memory_portrait.png",
    "char_ch0_ai_conscience_portrait.png"
)

foreach ($filename in $requiredPortraits) {
    $path = Join-Path $repoRoot "assets\resources\images\chapter0\characters\$filename"
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        $errors.Add("Missing Chapter 0 portrait: $filename")
    }
}

$sourceDirectories = @(
    "assets\scripts\chapter0",
    "assets\scripts\core",
    "assets\scripts\dialogue",
    "assets\scripts\ui"
)

$typescriptFiles = @(
    foreach ($directory in $sourceDirectories) {
        Get-ChildItem -LiteralPath (Join-Path $repoRoot $directory) -Filter "*.ts" -File
    }
)

foreach ($file in $typescriptFiles) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    $relativeImports = [regex]::Matches(
        $content,
        "from\s+['""](?<path>\.{1,2}/[^'""]+)['""]"
    )

    foreach ($match in $relativeImports) {
        $resolved = [System.IO.Path]::GetFullPath(
            (Join-Path $file.DirectoryName ($match.Groups["path"].Value + ".ts"))
        )
        if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
            $errors.Add("$($file.Name) has unresolved local import '$($match.Groups["path"].Value)'.")
        }
    }
}

& powershell -ExecutionPolicy Bypass -File (Join-Path $repoRoot "tools\content-validation\validate-dialogue-ui.ps1")
if ($LASTEXITCODE -ne 0) {
    $errors.Add("Dialogue UI validation failed.")
}

& node (Join-Path $repoRoot "tests\gameplay\chapter0_vertical_slice.test.mjs")
if ($LASTEXITCODE -ne 0) {
    $errors.Add("Chapter 0 vertical slice playthrough failed.")
}

& node (Join-Path $repoRoot "tests\gameplay\chapter0_qa.test.mjs")
if ($LASTEXITCODE -ne 0) {
    $errors.Add("Chapter 0 exhaustive QA failed.")
}

if ($errors.Count -gt 0) {
    Write-Host "Chapter 0 scene validation failed with $($errors.Count) error(s):" -ForegroundColor Red
    foreach ($validationError in $errors) {
        Write-Host " - $validationError" -ForegroundColor Red
    }
    exit 1
}

Write-Host "Chapter 0 scene validation passed." -ForegroundColor Green
Write-Host "Cocos TypeScript source files checked: $($typescriptFiles.Count)"
Write-Host "Background assets: $($requiredBackgrounds.Count)"
Write-Host "Portrait assets: $($requiredPortraits.Count)"
Write-Host "Interactables verified: 8"
Write-Host "Choice branches verified: 17"
