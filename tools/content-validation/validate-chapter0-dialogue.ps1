[CmdletBinding()]
param(
    [string]$DialogueDirectory
)

$ErrorActionPreference = "Stop"
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\.."))

if ([string]::IsNullOrWhiteSpace($DialogueDirectory)) {
    $DialogueDirectory = Join-Path $repoRoot "assets\resources\dialogue\chapter0"
}

$DialogueDirectory = [System.IO.Path]::GetFullPath($DialogueDirectory)
$errors = [System.Collections.Generic.List[string]]::new()
$nodesById = @{}
$fileEntries = @{}
$allNodes = [System.Collections.Generic.List[object]]::new()

$expectedFiles = @(
    "ch0_intro.json",
    "ch0_room_inspections.json",
    "ch0_flashbacks.json",
    "ch0_ai_fragments.json",
    "ch0_choices.json"
)

$allowedSpeakers = @(
    "Narration",
    "Player",
    "Logic",
    "Empathy",
    "Scepticism",
    "Memory",
    "Conscience",
    "System"
)

$fragmentSpeakers = @(
    "Logic",
    "Empathy",
    "Scepticism",
    "Memory",
    "Conscience"
)

$requiredObjects = @(
    "broken_time_device",
    "damaged_id_card",
    "research_notes",
    "old_newspaper",
    "cracked_watch",
    "lab_terminal",
    "memory_shard"
)

foreach ($expectedFile in $expectedFiles) {
    $expectedPath = Join-Path $DialogueDirectory $expectedFile
    if (-not (Test-Path -LiteralPath $expectedPath -PathType Leaf)) {
        $errors.Add("Missing expected dialogue file: $expectedFile")
    }
}

$jsonFiles = @(
    foreach ($expectedFile in $expectedFiles) {
        $expectedPath = Join-Path $DialogueDirectory $expectedFile
        if (Test-Path -LiteralPath $expectedPath -PathType Leaf) {
            Get-Item -LiteralPath $expectedPath
        }
    }
)

$manifestPath = Join-Path $DialogueDirectory "ch0_manifest.json"
if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
    $errors.Add("Missing Chapter 0 manifest: ch0_manifest.json")
}
else {
    try {
        $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
        if ($manifest.schemaVersion -ne 1) {
            $errors.Add("ch0_manifest.json must declare schemaVersion 1.")
        }
        $manifestFileIds = @($manifest.dialogueDocuments | ForEach-Object { [string]$_.fileId })
        foreach ($expectedFile in $expectedFiles) {
            $expectedFileId = [System.IO.Path]::GetFileNameWithoutExtension($expectedFile)
            if ($manifestFileIds -notcontains $expectedFileId) {
                $errors.Add("ch0_manifest.json is missing dialogue fileId '$expectedFileId'.")
            }
        }
        foreach ($entry in @($manifest.dialogueDocuments)) {
            if (-not ([string]$entry.resource).StartsWith("dialogue/chapter0/")) {
                $errors.Add("Manifest dialogue resource '$($entry.resource)' is outside dialogue/chapter0.")
            }
            $resourceFile = Join-Path $repoRoot ("assets\resources\" + ([string]$entry.resource).Replace("/", "\") + ".json")
            if (-not (Test-Path -LiteralPath $resourceFile -PathType Leaf)) {
                $errors.Add("Manifest dialogue resource '$($entry.resource)' does not resolve.")
            }
        }
        foreach ($entry in @($manifest.backgrounds)) {
            if (-not ([string]$entry.resource).StartsWith("images/chapter0/backgrounds/")) {
                $errors.Add("Manifest background resource '$($entry.resource)' is outside images/chapter0/backgrounds.")
            }
            $imageResource = ([string]$entry.resource) -replace "/spriteFrame$", ""
            $resourceFile = Join-Path $repoRoot ("assets\resources\" + $imageResource.Replace("/", "\") + ".png")
            if (-not (Test-Path -LiteralPath $resourceFile -PathType Leaf)) {
                $errors.Add("Manifest background resource '$($entry.resource)' does not resolve.")
            }
        }
        foreach ($speaker in @($manifest.speakers)) {
            if ($speaker.portraitResource -and
                -not ([string]$speaker.portraitResource).StartsWith("images/chapter0/characters/")) {
                $errors.Add("Manifest portrait resource '$($speaker.portraitResource)' is outside images/chapter0/characters.")
            }
            if ($speaker.portraitResource) {
                $imageResource = ([string]$speaker.portraitResource) -replace "/spriteFrame$", ""
                $resourceFile = Join-Path $repoRoot ("assets\resources\" + $imageResource.Replace("/", "\") + ".png")
                if (-not (Test-Path -LiteralPath $resourceFile -PathType Leaf)) {
                    $errors.Add("Manifest portrait resource '$($speaker.portraitResource)' does not resolve.")
                }
            }
        }
    }
    catch {
        $errors.Add("Invalid JSON in ch0_manifest.json: $($_.Exception.Message)")
    }
}

foreach ($file in $jsonFiles) {
    try {
        $document = Get-Content -LiteralPath $file.FullName -Raw | ConvertFrom-Json
    }
    catch {
        $errors.Add("Invalid JSON in $($file.Name): $($_.Exception.Message)")
        continue
    }

    if (-not ($document.PSObject.Properties.Name -contains "schemaVersion") -or $document.schemaVersion -ne 1) {
        $errors.Add("$($file.Name) must declare schemaVersion 1.")
    }

    if (-not ($document.PSObject.Properties.Name -contains "entryId") -or
        [string]::IsNullOrWhiteSpace([string]$document.entryId)) {
        $errors.Add("$($file.Name) has no entryId.")
    }
    else {
        $fileEntries[$file.Name] = [string]$document.entryId
    }

    if (-not ($document.PSObject.Properties.Name -contains "nodes")) {
        $errors.Add("$($file.Name) has no nodes array.")
        continue
    }

    foreach ($node in @($document.nodes)) {
        $nodeId = if ($node.PSObject.Properties.Name -contains "id") { [string]$node.id } else { "" }
        if ([string]::IsNullOrWhiteSpace($nodeId)) {
            $errors.Add("$($file.Name) contains a node without an id.")
            continue
        }

        if ($nodesById.ContainsKey($nodeId)) {
            $errors.Add("Duplicate node id '$nodeId' in $($file.Name) and $($nodesById[$nodeId].File).")
            continue
        }

        $speaker = if ($node.PSObject.Properties.Name -contains "speaker") { [string]$node.speaker } else { "" }
        if ($allowedSpeakers -notcontains $speaker) {
            $errors.Add("Node '$nodeId' has missing or unsupported speaker '$speaker'.")
        }

        $text = if ($node.PSObject.Properties.Name -contains "text") { [string]$node.text } else { "" }
        if ([string]::IsNullOrWhiteSpace($text)) {
            $errors.Add("Node '$nodeId' has no text.")
        }

        $record = [PSCustomObject]@{
            Id = $nodeId
            Node = $node
            File = $file.Name
        }
        $nodesById[$nodeId] = $record
        $allNodes.Add($record)
    }
}

foreach ($entry in $fileEntries.GetEnumerator()) {
    if (-not $nodesById.ContainsKey($entry.Value)) {
        $errors.Add("$($entry.Key) entryId '$($entry.Value)' does not resolve.")
    }
}

$adjacency = @{}

foreach ($record in $allNodes) {
    $node = $record.Node
    $targets = [System.Collections.Generic.List[string]]::new()

    if ($node.PSObject.Properties.Name -contains "next") {
        $nextId = [string]$node.next
        if (-not [string]::IsNullOrWhiteSpace($nextId)) {
            $targets.Add($nextId)
        }
    }

    if ($node.PSObject.Properties.Name -contains "choices") {
        $choices = @($node.choices)
        if ($choices.Count -eq 0) {
            $errors.Add("Node '$($record.Id)' declares an empty choices array.")
        }

        foreach ($choice in $choices) {
            $label = if ($choice.PSObject.Properties.Name -contains "label") { [string]$choice.label } else { "" }
            $choiceNext = if ($choice.PSObject.Properties.Name -contains "next") { [string]$choice.next } else { "" }

            if ([string]::IsNullOrWhiteSpace($label)) {
                $errors.Add("Node '$($record.Id)' contains a choice without a label.")
            }
            if ([string]::IsNullOrWhiteSpace($choiceNext)) {
                $errors.Add("Node '$($record.Id)' contains a choice without a next target.")
            }
            else {
                $targets.Add($choiceNext)
            }
        }
    }

    $adjacency[$record.Id] = @($targets)

    foreach ($target in $targets) {
        if (-not $nodesById.ContainsKey($target)) {
            $errors.Add("Node '$($record.Id)' references missing target '$target'.")
        }
    }

    if ($node.PSObject.Properties.Name -contains "portrait") {
        $portraitId = [string]$node.portrait
        $portraitPath = Join-Path $repoRoot "assets\resources\images\chapter0\characters\$portraitId.png"
        if (-not (Test-Path -LiteralPath $portraitPath -PathType Leaf)) {
            $errors.Add("Node '$($record.Id)' references missing portrait '$portraitId'.")
        }
    }

    if ($node.PSObject.Properties.Name -contains "background") {
        $backgroundId = [string]$node.background
        $backgroundPath = Join-Path $repoRoot "assets\resources\images\chapter0\backgrounds\$backgroundId.png"
        if (-not (Test-Path -LiteralPath $backgroundPath -PathType Leaf)) {
            $errors.Add("Node '$($record.Id)' references missing background '$backgroundId'.")
        }
    }

    if ($node.PSObject.Properties.Name -contains "hints") {
        $levels = @($node.hints | ForEach-Object { [int]$_.level } | Sort-Object -Unique)
        if (($levels -join ",") -ne "1,2,3,4,5") {
            $errors.Add("Node '$($record.Id)' must provide hint levels 1 through 5.")
        }
    }
}

if ($nodesById.ContainsKey("ch0_intro_wake_001")) {
    $visited = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $queue = [System.Collections.Generic.Queue[string]]::new()
    $queue.Enqueue("ch0_intro_wake_001")

    while ($queue.Count -gt 0) {
        $current = $queue.Dequeue()
        if (-not $visited.Add($current)) {
            continue
        }

        foreach ($target in @($adjacency[$current])) {
            if ($nodesById.ContainsKey($target) -and -not $visited.Contains($target)) {
                $queue.Enqueue($target)
            }
        }
    }

    foreach ($nodeId in $nodesById.Keys) {
        if (-not $visited.Contains($nodeId)) {
            $errors.Add("Node '$nodeId' is unreachable from ch0_intro_wake_001.")
        }
    }
}
else {
    $errors.Add("Main chapter entry ch0_intro_wake_001 is missing.")
}

foreach ($speaker in $allowedSpeakers) {
    if (-not ($allNodes.Node.speaker -contains $speaker)) {
        $errors.Add("Required speaker '$speaker' has no dialogue node.")
    }
}

foreach ($objectId in $requiredObjects) {
    $responders = @(
        $allNodes |
            Where-Object {
                $_.Node.PSObject.Properties.Name -contains "objectId" -and
                [string]$_.Node.objectId -eq $objectId -and
                $fragmentSpeakers -contains [string]$_.Node.speaker
            } |
            ForEach-Object { [string]$_.Node.speaker } |
            Sort-Object -Unique
    )

    if ($responders.Count -lt 2) {
        $errors.Add("Inspection '$objectId' has only $($responders.Count) distinct AI fragment responder(s).")
    }
}

$flashbackIds = @(
    $allNodes |
        Where-Object { $_.Node.PSObject.Properties.Name -contains "flashbackId" } |
        ForEach-Object { [string]$_.Node.flashbackId } |
        Sort-Object -Unique
)

if ($flashbackIds.Count -lt 3) {
    $errors.Add("Expected at least 3 flashback sequences; found $($flashbackIds.Count).")
}

$decisionIds = @(
    $allNodes |
        Where-Object { $_.Node.PSObject.Properties.Name -contains "decisionId" } |
        ForEach-Object { [string]$_.Node.decisionId } |
        Sort-Object -Unique
)

if ($decisionIds.Count -lt 3) {
    $errors.Add("Expected at least 3 choice moments; found $($decisionIds.Count).")
}

if ($errors.Count -gt 0) {
    Write-Host "Chapter 0 dialogue validation failed with $($errors.Count) error(s):" -ForegroundColor Red
    foreach ($validationError in $errors) {
        Write-Host " - $validationError" -ForegroundColor Red
    }
    exit 1
}

Write-Host "Chapter 0 dialogue validation passed." -ForegroundColor Green
Write-Host "Files: $($jsonFiles.Count)"
Write-Host "Nodes: $($allNodes.Count)"
Write-Host "Decisions: $($decisionIds.Count)"
Write-Host "Flashbacks: $($flashbackIds.Count)"
Write-Host "Inspections with 2+ fragment responders: $($requiredObjects.Count)"
