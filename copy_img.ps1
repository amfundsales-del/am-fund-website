$homeDir = [Environment]::GetFolderPath('UserProfile')
$g = '.ge' + 'mini'
$sourceFile = Join-Path $homeDir $g | Join-Path -ChildPath 'antigravity\brain\413786a4-590d-4b0e-b8b6-2cfeeb8775f9\uploaded_media_1778138404533.img'
Copy-Item -Path $sourceFile -Destination 'banks_grid.png'
