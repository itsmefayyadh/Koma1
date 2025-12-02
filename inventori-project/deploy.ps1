# Script untuk Deploy ke GCP (Windows PowerShell)
# Jalankan di PowerShell sebagai Administrator

# ============================================
# STEP 1: Setup (Jalankan sekali saja)
# ============================================

Write-Host "=== GCP Deployment Setup ===" -ForegroundColor Green

# Login ke GCP
Write-Host "1. Login ke Google Cloud Account..." -ForegroundColor Cyan
gcloud auth login

# Set Project ID
Write-Host "2. Set Project ID..." -ForegroundColor Cyan
$PROJECT_ID = Read-Host "Masukkan PROJECT_ID (cth: inventori-project-12345)"
gcloud config set project $PROJECT_ID

# Enable APIs
Write-Host "3. Enable Google Cloud APIs..." -ForegroundColor Cyan
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Configure Docker
Write-Host "4. Configure Docker..." -ForegroundColor Cyan
gcloud auth configure-docker

Write-Host "Setup selesai!" -ForegroundColor Green

# ============================================
# STEP 2: Build dan Deploy
# ============================================

Write-Host "`n=== Deploy ke Cloud Run ===" -ForegroundColor Green

# Navigate ke project
$PROJECT_PATH = "c:\Users\Lenovo\Downloads\Koma\inventori-project"
Set-Location $PROJECT_PATH
Write-Host "Working directory: $(Get-Location)" -ForegroundColor Cyan

# Build Docker image
Write-Host "1. Build Docker image..." -ForegroundColor Cyan
$SERVICE_NAME = "inventori-frontend"
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker build gagal!" -ForegroundColor Red
    exit 1
}

# Push ke GCP
Write-Host "2. Push image ke Google Container Registry..." -ForegroundColor Cyan
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker push gagal!" -ForegroundColor Red
    exit 1
}

# Deploy ke Cloud Run
Write-Host "3. Deploy ke Cloud Run..." -ForegroundColor Cyan
$REGION = "asia-southeast1"

gcloud run deploy $SERVICE_NAME `
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1 `
  --max-instances 10

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deploy berhasil!" -ForegroundColor Green
    Write-Host "Dapatkan URL service:" -ForegroundColor Cyan
    gcloud run services describe $SERVICE_NAME --region=$REGION --format 'value(status.url)'
} else {
    Write-Host "Error: Deploy gagal!" -ForegroundColor Red
    exit 1
}

# ============================================
# Cleanup dan Info
# ============================================

Write-Host "`n=== Useful Commands ===" -ForegroundColor Green
Write-Host "View logs:"
Write-Host "  gcloud run logs read $SERVICE_NAME --region=$REGION --follow"
Write-Host ""
Write-Host "View service details:"
Write-Host "  gcloud run services describe $SERVICE_NAME --region=$REGION"
Write-Host ""
Write-Host "Update environment variable:"
Write-Host "  gcloud run deploy $SERVICE_NAME --update-env-vars KEY=VALUE --region=$REGION"
Write-Host ""
Write-Host "Delete service:"
Write-Host "  gcloud run services delete $SERVICE_NAME --region=$REGION"
