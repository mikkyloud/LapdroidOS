# PowerShell startup script for LapdroidOS (Windows)
Write-Host "==============================" -ForegroundColor Green
Write-Host "   Starting LapdroidOS Host   " -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

Write-Host "[1/2] Verifying Python Flask dependency..." -ForegroundColor Cyan
pip install flask

Write-Host ""
Write-Host "[2/2] Starting local server at http://127.0.0.1:5000..." -ForegroundColor Cyan
Write-Host "Keep this terminal open, then double-click 'frontend/index.html' to open the app!" -ForegroundColor Yellow
Write-Host ""

cd backend
python app.py
