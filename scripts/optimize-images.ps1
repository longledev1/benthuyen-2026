Add-Type -AssemblyName System.Drawing

function Compress-Jpeg($file, $maxWidth, $quality = 82) {
    if (-not (Test-Path $file)) { return }
    $bytesOriginal = (Get-Item $file).Length
    $img = [System.Drawing.Image]::FromFile((Convert-Path $file))
    $w = $img.Width
    $h = $img.Height
    if ($w -gt $maxWidth) {
        $h = [int]($h * ($maxWidth / $w))
        $w = $maxWidth
    }
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()
    $img.Dispose()

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)

    $tempFile = $file + ".tmp.jpg"
    $bmp.Save($tempFile, $codec, $encoderParams)
    $bmp.Dispose()

    $bytesNew = (Get-Item $tempFile).Length
    if ($bytesNew -lt $bytesOriginal) {
        Remove-Item $file
        Move-Item $tempFile $file
        Write-Host "Compressed $file : $([math]::Round($bytesOriginal/1KB))KB -> $([math]::Round($bytesNew/1KB))KB"
    } else {
        Remove-Item $tempFile
        Write-Host "Skipped $file : already optimal"
    }
}

function Resize-Png($file, $maxWidth) {
    if (-not (Test-Path $file)) { return }
    $bytesOriginal = (Get-Item $file).Length
    $img = [System.Drawing.Image]::FromFile((Convert-Path $file))
    $w = $img.Width
    $h = $img.Height
    if ($w -gt $maxWidth) {
        $h = [int]($h * ($maxWidth / $w))
        $w = $maxWidth
    }
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()
    $img.Dispose()

    $tempFile = $file + ".tmp.png"
    $bmp.Save($tempFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    $bytesNew = (Get-Item $tempFile).Length
    if ($bytesNew -lt $bytesOriginal) {
        Remove-Item $file
        Move-Item $tempFile $file
        Write-Host "Resized $file : $([math]::Round($bytesOriginal/1KB))KB -> $([math]::Round($bytesNew/1KB))KB"
    } else {
        Remove-Item $tempFile
        Write-Host "Skipped $file : already optimal"
    }
}

# 1. Tối ưu ảnh trang trí sao biển/san hô (hiển thị 300px)
Resize-Png "public/images/decorations/sanho.png" 480

# 2. Tối ưu ảnh chiếc thuyền (hiển thị 256px - 320px)
Resize-Png "public/images/home/boat.png" 600
Resize-Png "public/images/home/boat2.png" 600

# 3. Tối ưu banner1 (hiển thị trong grid 800px)
Resize-Png "public/images/banner/banner1.png" 1200

# 4. Tối ưu startup PNGs (hiển thị 600px)
Resize-Png "public/images/home/startup-1.png" 800
Resize-Png "public/images/home/startup-2.png" 800
Resize-Png "public/images/home/startup-3.png" 800
Resize-Png "public/images/home/startup-4.png" 800

# 5. Tối ưu food JPEGs
Compress-Jpeg "public/images/home/food-small-5.jpg" 800 82
Compress-Jpeg "public/images/home/food-small-3.jpg" 800 82
Compress-Jpeg "public/images/home/food-small-1.jpg" 800 82
Compress-Jpeg "public/images/home/food-small-2.jpg" 800 82
Compress-Jpeg "public/images/home/food-small-4.jpg" 800 82
Compress-Jpeg "public/images/home/food-small-6.jpg" 800 82
Compress-Jpeg "public/images/home/food-small-7.jpg" 800 82
Compress-Jpeg "public/images/home/food-small-8.jpg" 800 82
