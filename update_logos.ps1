$htmlFile = "index.html"
$logosDir = "LOGOS"

if (-Not (Test-Path $htmlFile)) {
    Write-Host "Error: index.html not found."
    exit
}

if (-Not (Test-Path $logosDir)) {
    Write-Host "Error: LOGOS directory not found."
    exit
}

# Read HTML content
$htmlContent = Get-Content -Raw -Path $htmlFile

# Get all files in LOGOS directory
$logoFiles = Get-ChildItem -Path $logosDir -File

# Function to normalize string
function Normalize-String($str) {
    if ($null -eq $str) { return "" }
    return ($str -replace "[^a-zA-Z0-9]", "").ToLower()
}

$fileMap = @{}
foreach ($file in $logoFiles) {
    # Remove extensions
    $baseName = $file.Name -replace '\.[^.]+$', ''
    $baseName = $baseName -replace '\.[^.]+$', ''
    $normName = Normalize-String $baseName
    if ($normName -ne "") {
        $fileMap[$normName] = $file.Name
    }
}

# Regex to match <img> tags with alt and src
$imgRegex = '(?i)<img[^>]+>'

$updatedCount = 0

$newHtml = [regex]::Replace($htmlContent, $imgRegex, {
    param($match)
    
    $fullTag = $match.Groups[0].Value
    
    $srcMatch = [regex]::Match($fullTag, '(?i)src=["'']([^"'']+)["'']')
    $altMatch = [regex]::Match($fullTag, '(?i)alt=["'']([^"'']+)["'']')
    
    if (-not $srcMatch.Success -or -not $altMatch.Success) {
        return $fullTag
    }
    
    $src = $srcMatch.Groups[1].Value
    $alt = $altMatch.Groups[1].Value
    
    $normAlt = Normalize-String $alt
    
    # Skip known non-bank logos
    if ($normAlt -match "preview|ecosystem|logo|illustration|workflow" -or $alt.Length -gt 30) {
        return $fullTag
    }
    
    $bestMatch = $null
    
    # Direct match
    if ($fileMap.ContainsKey($normAlt)) {
        $bestMatch = $fileMap[$normAlt]
    } else {
        # Partial match
        foreach ($key in $fileMap.Keys) {
            if ($key.Length -gt 2 -and ($normAlt.Contains($key) -or $key.Contains($normAlt))) {
                $bestMatch = $fileMap[$key]
                break
            }
        }
    }
    
    if ($null -ne $bestMatch) {
        $newSrc = "LOGOS/$bestMatch"
        $updatedTag = $fullTag -replace [regex]::Escape($src), $newSrc
        Write-Host "Matched: `"$alt`" -> $bestMatch"
        $script:updatedCount++
        return $updatedTag
    }
    
    Write-Host "No match found for: `"$alt`""
    return $fullTag
})

Set-Content -Path $htmlFile -Value $newHtml -Encoding UTF8
Write-Host "`nSuccessfully updated $script:updatedCount logo paths in $htmlFile."
Write-Host "Note: If any logos didn't match, rename the files in the LOGOS folder to match the 'alt' text."
