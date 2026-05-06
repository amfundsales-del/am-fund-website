Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("c:\Users\HP\Downloads\am fund\logo_white.png")
$bmp = New-Object System.Drawing.Bitmap $img
$img.Dispose()

# Make white transparent
$bmp.MakeTransparent([System.Drawing.Color]::White)

$bmp.Save("c:\Users\HP\Downloads\am fund\logo_transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
