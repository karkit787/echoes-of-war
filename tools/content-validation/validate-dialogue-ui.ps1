[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\.."))
$errors = [System.Collections.Generic.List[string]]::new()

$requiredFiles = @(
    "assets\scripts\dialogue\DialogueTypes.ts",
    "assets\scripts\dialogue\DialogueManager.ts",
    "assets\scripts\ui\DialogueTheme.ts",
    "assets\scripts\ui\DialoguePortrait.ts",
    "assets\scripts\ui\DialogueChoiceButton.ts",
    "assets\scripts\ui\DialogueChoiceList.ts",
    "assets\scripts\ui\DialogueHistoryPanel.ts",
    "assets\scripts\ui\DialogueBox.ts",
    "assets\scripts\ui\DialogueDemo.ts",
    "assets\resources\ui\dialogue\dialogue_theme.json",
    "assets\resources\ui\dialogue\dialogue_ui_demo.json",
    "assets\resources\images\chapter0\ui\dialogue_panel_rough.svg",
    "assets\resources\images\chapter0\ui\dialogue_choice_rough.svg",
    "tests\dialogue\dialogue_manager.test.mjs",
    "docs\dev\chapter0_dialogue_ui.md"
)

foreach ($relativePath in $requiredFiles) {
    $fullPath = Join-Path $repoRoot $relativePath
    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        $errors.Add("Missing required dialogue UI file: $relativePath")
    }
}

$themePath = Join-Path $repoRoot "assets\resources\ui\dialogue\dialogue_theme.json"
$demoPath = Join-Path $repoRoot "assets\resources\ui\dialogue\dialogue_ui_demo.json"

try {
    $theme = Get-Content -LiteralPath $themePath -Raw | ConvertFrom-Json
}
catch {
    $errors.Add("Invalid dialogue theme JSON: $($_.Exception.Message)")
}

try {
    $demo = Get-Content -LiteralPath $demoPath -Raw | ConvertFrom-Json
}
catch {
    $errors.Add("Invalid dialogue demo JSON: $($_.Exception.Message)")
}

$requiredSpeakers = @(
    "Narration",
    "Player",
    "Logic",
    "Empathy",
    "Scepticism",
    "Memory",
    "Conscience",
    "System"
)

if ($null -ne $theme) {
    foreach ($speaker in $requiredSpeakers) {
        if (-not ($theme.speakers.PSObject.Properties.Name -contains $speaker)) {
            $errors.Add("Dialogue theme has no style for speaker '$speaker'.")
        }
    }
}

if ($null -ne $demo) {
    $demoIds = @{}
    foreach ($node in @($demo.nodes)) {
        if ($demoIds.ContainsKey([string]$node.id)) {
            $errors.Add("Duplicate demo node id '$($node.id)'.")
        }
        else {
            $demoIds[[string]$node.id] = $true
        }
    }

    if (-not $demoIds.ContainsKey([string]$demo.entryId)) {
        $errors.Add("Demo entryId '$($demo.entryId)' does not resolve.")
    }

    foreach ($node in @($demo.nodes)) {
        $targets = @()
        if ($node.PSObject.Properties.Name -contains "next") {
            $targets += [string]$node.next
        }
        if ($node.PSObject.Properties.Name -contains "choices") {
            $targets += @($node.choices | ForEach-Object { [string]$_.next })
        }
        foreach ($target in $targets) {
            if (-not $demoIds.ContainsKey($target)) {
                $errors.Add("Demo node '$($node.id)' references missing target '$target'.")
            }
        }
    }
}

$typescriptFiles = @(
    Get-ChildItem -LiteralPath (Join-Path $repoRoot "assets\scripts\dialogue") -Filter "*.ts" -File
    Get-ChildItem -LiteralPath (Join-Path $repoRoot "assets\scripts\ui") -Filter "*.ts" -File
)

foreach ($file in $typescriptFiles) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    $relativeImports = [regex]::Matches(
        $content,
        "from\s+['""](?<path>\.{1,2}/[^'""]+)['""]"
    )

    foreach ($match in $relativeImports) {
        $importPath = $match.Groups["path"].Value
        $resolved = [System.IO.Path]::GetFullPath(
            (Join-Path $file.DirectoryName ($importPath + ".ts"))
        )
        if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
            $errors.Add("$($file.Name) has unresolved local import '$importPath'.")
        }
    }
}

$dialogueValidator = Join-Path $repoRoot "tools\content-validation\validate-chapter0-dialogue.ps1"
& powershell -ExecutionPolicy Bypass -File $dialogueValidator
if ($LASTEXITCODE -ne 0) {
    $errors.Add("Chapter 0 dialogue validation failed.")
}

if ($errors.Count -gt 0) {
    Write-Host "Dialogue UI validation failed with $($errors.Count) error(s):" -ForegroundColor Red
    foreach ($validationError in $errors) {
        Write-Host " - $validationError" -ForegroundColor Red
    }
    exit 1
}

Write-Host "Dialogue UI validation passed." -ForegroundColor Green
Write-Host "TypeScript source files: $($typescriptFiles.Count)"
Write-Host "Theme speaker styles: $($requiredSpeakers.Count)"
Write-Host "Demo nodes: $(@($demo.nodes).Count)"
