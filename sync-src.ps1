# 現在のパス（react-appフォルダ想定）
$currentDir = Get-Location

# 開発用src
$source = Join-Path $currentDir "src"

# 親フォルダ（react-appの一つ上のフォルダ）
$parentDir = Split-Path $currentDir -Parent

# 本番用src
$destination = Join-Path $parentDir "damage-calculator\src"

# コピー実行（差分・削除反映）
robocopy $source $destination /MIR

# 結果メッセージ
Write-Host "コピー完了: $source → $destination"