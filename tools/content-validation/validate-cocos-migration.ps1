$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$repoRootPath = $repoRoot.Path
$issues = [System.Collections.Generic.List[string]]::new()

function Add-Issue {
    param([string]$Message)
    $issues.Add($Message)
}

$jsonRoots = @(
    (Join-Path $repoRootPath ".creator"),
    (Join-Path $repoRootPath "assets"),
    (Join-Path $repoRootPath "content"),
    (Join-Path $repoRootPath "settings")
)

$jsonFiles = @((Get-Item (Join-Path $repoRootPath "package.json"))) +
    @(Get-ChildItem -Path $jsonRoots -Recurse -File |
        Where-Object {
            $_.Extension -eq ".json" -or
            $_.Extension -eq ".meta" -or
            $_.Extension -eq ".scene"
        })

foreach ($file in $jsonFiles) {
    try {
        Get-Content -Raw -LiteralPath $file.FullName | ConvertFrom-Json | Out-Null
    }
    catch {
        Add-Issue "Invalid JSON: $($file.FullName) - $($_.Exception.Message)"
    }
}

$assetFiles = Get-ChildItem (Join-Path $repoRootPath "assets") -Recurse -File |
    Where-Object { $_.Name -notlike "*.meta" -and $_.Name -ne ".gitkeep" }

foreach ($file in $assetFiles) {
    if (-not (Test-Path -LiteralPath ($file.FullName + ".meta"))) {
        Add-Issue "Missing Cocos metadata for asset: $($file.FullName)"
    }
}

$metaFiles = Get-ChildItem (Join-Path $repoRootPath "assets") -Recurse -File -Filter "*.meta"
foreach ($metaFile in $metaFiles) {
    $assetPath = $metaFile.FullName.Substring(0, $metaFile.FullName.Length - 5)
    if (-not (Test-Path -LiteralPath $assetPath)) {
        Add-Issue "Orphaned Cocos metadata: $($metaFile.FullName)"
    }
}

$assetDirectories = Get-ChildItem (Join-Path $repoRootPath "assets") -Recurse -Directory
foreach ($directory in $assetDirectories) {
    if (-not (Test-Path -LiteralPath ($directory.FullName + ".meta"))) {
        Add-Issue "Missing Cocos metadata for directory: $($directory.FullName)"
    }
}

$package = Get-Content -Raw (Join-Path $repoRootPath "package.json") | ConvertFrom-Json
if ($package.creator.version -notmatch "^3\.8\.") {
    Add-Issue "Expected a Cocos Creator 3.8.x project, found '$($package.creator.version)'."
}

$dialogueDemo = Get-Content -Raw (Join-Path $repoRootPath "assets\scripts\ui\DialogueDemo.ts")
if ($dialogueDemo -notmatch "fallbackDemoResource\s*=\s*'ui/dialogue/dialogue_ui_demo'") {
    Add-Issue "DialogueDemo fallback resource path is missing or unexpected."
}
if (-not (Test-Path (Join-Path $repoRootPath "assets\resources\ui\dialogue\dialogue_ui_demo.json"))) {
    Add-Issue "The dynamically loaded dialogue demo JSON is outside assets/resources or missing."
}

$requiredRuntimePaths = @(
    "assets\scenes\Chapter0.scene",
    "assets\resources\dialogue\chapter0\ch0_manifest.json",
    "assets\resources\images\chapter0\backgrounds",
    "assets\resources\images\chapter0\characters",
    "assets\resources\images\chapter0\props",
    "assets\resources\images\chapter0\ui",
    "assets\scripts\chapter0\Chapter0SceneController.ts",
    "assets\scripts\chapter0\Chapter0Interactable.ts",
    "assets\scripts\chapter0\MemoryFlashbackController.ts",
    "assets\scripts\core\SpeakerRegistry.ts",
    "assets\scripts\ui\DialogueChoiceButton.ts"
)
foreach ($relativePath in $requiredRuntimePaths) {
    if (-not (Test-Path -LiteralPath (Join-Path $repoRootPath $relativePath))) {
        Add-Issue "Missing required Chapter 0 runtime path: $relativePath"
    }
}

$ignoredDirectories = @("build", "library", "temp", "local")
foreach ($directory in $ignoredDirectories) {
    $probe = "$directory/.codex-ignore-probe"
    $null = & git -c safe.directory=D:/FYP/echoes-of-war-cocos check-ignore --quiet --no-index $probe
    if ($LASTEXITCODE -ne 0) {
        Add-Issue "Generated directory '$directory/' is not ignored by Git."
    }

    $tracked = & git -c safe.directory=D:/FYP/echoes-of-war-cocos ls-files -- $directory
    if ($tracked) {
        Add-Issue "Generated directory '$directory/' contains tracked files."
    }
}

foreach ($metaFile in $metaFiles) {
    $relativePath = $metaFile.FullName.Substring($repoRootPath.Length + 1)
    $null = & git -c safe.directory=D:/FYP/echoes-of-war-cocos check-ignore --quiet --no-index $relativePath
    if ($LASTEXITCODE -eq 0) {
        Add-Issue "Cocos metadata is incorrectly ignored by Git: $relativePath"
    }
}

if ($issues.Count -gt 0) {
    $issues | ForEach-Object { Write-Host $_ -ForegroundColor Red }
    exit 1
}

Write-Host "Cocos migration validation passed."
Write-Host "JSON/meta files parsed: $($jsonFiles.Count)"
Write-Host "Runtime assets with metadata: $($assetFiles.Count)"
Write-Host "Asset directories with metadata: $($assetDirectories.Count)"
Write-Host "Generated directories ignored: $($ignoredDirectories.Count)"
