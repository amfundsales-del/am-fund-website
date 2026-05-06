Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("c:\Users\HP\Downloads\am fund\logo.png")
$bmp = New-Object System.Drawing.Bitmap $img
$img.Dispose()

# Make black transparent
$bmp.MakeTransparent([System.Drawing.Color]::Black)

$x = [math]::Round($bmp.Width * 0.32)
$y = 0
$w = $bmp.Width - $x
$h = $bmp.Height

$rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)

$cropped.Save("c:\Users\HP\Downloads\am fund\logo_cropped.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$cropped.Dispose()
