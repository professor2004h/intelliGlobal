# Test Contact Form API with SMTP Email System

Write-Host "Testing EventNext Contact Form API with SMTP Email System..." -ForegroundColor Green

$testData = @{
    name = "Test User"
    email = "test@example.com"
    subject = "SMTP Test Email"
    message = "This is a test message to verify the SMTP email system is working correctly. If you receive this email, the integration is successful!"
} | ConvertTo-Json

Write-Host "Sending test contact form submission..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/contact" -Method POST -ContentType "application/json" -Body $testData

    Write-Host "API Response:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor White

    if ($response.success) {
        Write-Host "Contact form submission successful!" -ForegroundColor Green
        Write-Host "Check the admin email inbox for the notification." -ForegroundColor Cyan
    } else {
        Write-Host "Contact form submission failed." -ForegroundColor Red
    }

} catch {
    Write-Host "Error testing contact form API:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red

    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Test completed." -ForegroundColor Green
