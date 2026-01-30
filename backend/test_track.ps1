try {
    $response = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/tracks" -ContentType "application/json" -InFile "payload.json"
    Write-Host "Success!"
    $response
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $body = $reader.ReadToEnd()
        try {
            $json = $body | ConvertFrom-Json
            $json.message | Out-File -FilePath msg.txt -Encoding utf8
            Write-Host "Message returned"
        } catch {
            $body | Out-File -FilePath msg.txt -Encoding utf8
        }
    }
}
