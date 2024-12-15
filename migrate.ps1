# Migration script for reorganizing the procedural tower generator codebase
Write-Host "Starting codebase reorganization..."

# Verify all source files exist first
$requiredFiles = @(
    "src/main.ts",
    "src/controllers/SceneControls.ts",
    "src/controllers/ParameterController.ts",
    "src/generators/NodeGenerator.ts",
    "src/generators/DecorationGenerator.ts",
    "src/generators/MaterialFactory.ts",
    "src/config/parameters.ts",
    "src/config/towers/index.ts",
    "src/types/parameters.ts",
    "src/types/nodes.ts"
)

$missingFiles = $requiredFiles | Where-Object { -not (Test-Path $_) }
if ($missingFiles) {
    Write-Error "Missing required files:`n$($missingFiles -join "`n")"
    exit 1
}

# Create backup of current src directory
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "src_backup_$timestamp"
Write-Host "Creating backup in $backupDir..."
Copy-Item -Path "src" -Destination $backupDir -Recurse

# Create new directory structure
$directories = @(
    "src/core/scene",
    "src/core/physics",
    "src/core/saving",
    "src/generators/base",
    "src/generators/structure",
    "src/generators/crown",
    "src/generators/decoration",
    "src/materials/base",
    "src/materials/effects",
    "src/materials/textures",
    "src/biomes/desert",
    "src/biomes/forest",
    "src/biomes/shared",
    "src/components/structural",
    "src/components/decorative",
    "src/components/interactive",
    "src/utils/geometry",
    "src/utils/math",
    "src/utils/helpers",
    "src/config/towers",
    "src/config/materials",
    "src/config/parameters"
)

Write-Host "Creating new directory structure..."
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created directory: $dir"
    }
}

# Function to safely move files
function Move-FileWithBackup {
    param (
        [string]$source,
        [string]$destination
    )
    
    if (Test-Path $source) {
        $destDir = Split-Path -Parent $destination
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force
        }
        
        Write-Host "Moving $source to $destination"
        Copy-Item -Path $source -Destination $destination -Force
        Remove-Item -Path $source
    }
}

# Create new entry point
$entryPointContent = @"
/**
 * @file src/index.ts
 * @description Entry point for the procedural tower generator
 */

import { ProceduralScene } from './core/scene/ProceduralScene';

// Initialize the scene
const scene = new ProceduralScene();
"@

Set-Content -Path "src/index.ts" -Value $entryPointContent
Write-Host "Created new entry point: src/index.ts"

# Move existing files to their new locations
# Order matters due to dependencies
$fileMoves = [ordered]@{
    # Move type definitions first
    "src/types/nodes.ts" = "src/components/structural/NodeTypes.ts"
    "src/types/parameters.ts" = "src/config/parameters/ParameterTypes.ts"
    
    # Move config files next
    "src/config/parameters.ts" = "src/config/parameters/GenerationParameters.ts"
    "src/config/towers/index.ts" = "src/config/towers/TowerTypes.ts"
    
    # Move generators
    "src/generators/MaterialFactory.ts" = "src/materials/base/MaterialFactory.ts"
    "src/generators/NodeGenerator.ts" = "src/generators/structure/NodeGenerator.ts"
    "src/generators/DecorationGenerator.ts" = "src/generators/decoration/DecorationGenerator.ts"
    
    # Move controllers
    "src/controllers/ParameterController.ts" = "src/config/parameters/ParameterController.ts"
    "src/controllers/SceneControls.ts" = "src/core/scene/SceneSetup.ts"
    
    # Move main scene last
    "src/main.ts" = "src/core/scene/ProceduralScene.ts"
}

Write-Host "Moving existing files to new locations..."
foreach ($move in $fileMoves.GetEnumerator()) {
    Move-FileWithBackup -source $move.Key -destination $move.Value
}

# Create placeholder files for new structure
$placeholderFiles = @(
    "src/core/physics/CollisionSystem.ts",
    "src/core/physics/WeatheringSystem.ts",
    "src/core/saving/TowerBlueprint.ts",
    "src/core/saving/SaveManager.ts",
    "src/generators/base/BaseGenerator.ts",
    "src/generators/crown/DomeGenerator.ts",
    "src/materials/effects/WeatheringEffect.ts",
    "src/biomes/desert/DesertTowerConfig.ts",
    "src/biomes/forest/ForestTowerConfig.ts",
    "src/components/interactive/Beacon.ts",
    "src/utils/geometry/TaperUtils.ts",
    "src/utils/math/RandomGenerator.ts"
)

Write-Host "Creating placeholder files..."
foreach ($file in $placeholderFiles) {
    if (-not (Test-Path $file)) {
        $content = @"
/**
 * @file $file
 * @description Placeholder file for the new codebase structure.
 * TODO: Implement this module according to the architecture design.
 */

export {}; // Placeholder export to satisfy TypeScript module requirements
"@
        Set-Content -Path $file -Value $content
        Write-Host "Created placeholder: $file"
    }
}

# Update import paths in all TypeScript files
Write-Host "Updating import paths..."
$tsFiles = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse
foreach ($file in $tsFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Update import paths
    $content = $content -replace '@/types/nodes', '@/components/structural/NodeTypes'
    $content = $content -replace '@/types/parameters', '@/config/parameters/ParameterTypes'
    $content = $content -replace '@/config/parameters', '@/config/parameters/GenerationParameters'
    $content = $content -replace '@/config/towers', '@/config/towers/TowerTypes'
    $content = $content -replace '@/generators/MaterialFactory', '@/materials/base/MaterialFactory'
    $content = $content -replace '@/generators/', '@/generators/structure/'
    $content = $content -replace '@/controllers/', '@/core/scene/'
    
    Set-Content -Path $file.FullName -Value $content
}

# Update vite.config.ts path aliases
Write-Host "Updating Vite config..."
$viteConfig = Get-Content "vite.config.ts" -Raw
$viteConfig = $viteConfig -replace "src/\*", "src/*"
Set-Content -Path "vite.config.ts" -Value $viteConfig

Write-Host "Migration complete!"
Write-Host "Backup of original files is stored in: $backupDir"
Write-Host @"
Next steps:
1. Run 'npm install' to ensure dependencies are up to date
2. Review the changes in your IDE
3. Run 'npm run dev' to test the application
4. If everything works, commit the changes
5. If there are issues, you can restore from the backup in $backupDir
"@ 