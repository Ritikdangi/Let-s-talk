param(
    [string]$Backend = "https://lets-talk-backend-dy3f.onrender.com",
    [string]$Email = "ritik1@gmail.com",
    [string]$Password = "password"
)

Write-Host "Smoke test against: $Backend" -ForegroundColor Cyan

$body = @{ email = $Email; password = $Password } | ConvertTo-Json
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

Write-Host "\n1) POST /api/auth/login" -ForegroundColor Yellow
try {
    $login = Invoke-WebRequest -Uri "$Backend/api/auth/login" -Method Post -Body $body -ContentType 'application/json' -WebSession $session -ErrorAction Stop
    Write-Host "Status:" $login.StatusCode
    Write-Host "Response headers:" 
    $login.Headers | Format-List
    $content = $login.Content | ConvertFrom-Json
    Write-Host "Response body:"; $content | Format-List
} catch {
    Write-Host "Login failed:" $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $resp = $_.Exception.Response
        $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
        $bodyText = $reader.ReadToEnd()
        Write-Host "Response body:"; Write-Host $bodyText
    }
}

Write-Host "\n2) GET /api/auth/me using cookie session" -ForegroundColor Yellow
try {
    $me = Invoke-RestMethod -Uri "$Backend/api/auth/me" -Method Get -WebSession $session -ErrorAction Stop
    Write-Host "Me response:"; $me | Format-List
} catch {
    Write-Host "Me call failed:" $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response body:"; Write-Host $reader.ReadToEnd()
    }
}

if ($null -ne $content -and $content.token) {
    Write-Host "\n3) GET /api/auth/me using Authorization: Bearer <token> fallback" -ForegroundColor Yellow
    $token = $content.token
    try {
        $me2 = Invoke-RestMethod -Uri "$Backend/api/auth/me" -Method Get -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
        Write-Host "Auth header me response:"; $me2 | Format-List
    } catch {
        Write-Host "Auth header me failed:" $_.Exception.Message -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Response body:"; Write-Host $reader.ReadToEnd()
        }
    }
} else {
    Write-Host "\nNo token found in login response; skipping Authorization fallback test." -ForegroundColor DarkYellow
}

Write-Host "\nSmoke test complete." -ForegroundColor Cyan
