@echo off
REM Script Deploy ke GCP (Windows Command Prompt)
REM Jalankan sebagai Administrator

setlocal enabledelayedexpansion

echo.
echo =================================
echo GCP Cloud Run Deployment Script
echo =================================
echo.

REM Check if gcloud is installed
gcloud --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Google Cloud SDK tidak terinstall
    echo Download dari: https://cloud.google.com/sdk/docs/install-windows
    pause
    exit /b 1
)

REM Check if docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker tidak terinstall
    echo Download dari: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Set variables
set PROJECT_PATH=c:\Users\Lenovo\Downloads\Koma\inventori-project
set SERVICE_NAME=inventori-frontend
set REGION=asia-southeast1

REM Ask for Project ID
echo.
echo Step 1: Setup
echo ============
set /p PROJECT_ID="Masukkan GCP PROJECT_ID (cth: inventori-project-12345): "

REM Configure gcloud
echo.
echo Login ke Google Cloud...
gcloud auth login
if %errorlevel% neq 0 (
    echo Error: Login gagal
    pause
    exit /b 1
)

echo.
echo Set project ID...
gcloud config set project %PROJECT_ID%
if %errorlevel% neq 0 (
    echo Error: Set project gagal
    pause
    exit /b 1
)

echo.
echo Enable APIs...
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

echo.
echo Configure Docker...
gcloud auth configure-docker
if %errorlevel% neq 0 (
    echo Error: Docker config gagal
    pause
    exit /b 1
)

REM Deploy
echo.
echo Step 2: Build dan Deploy
echo =========================

cd /d %PROJECT_PATH%
echo Working directory: %cd%

echo.
echo Building Docker image...
docker build -t gcr.io/%PROJECT_ID%/%SERVICE_NAME%:latest .
if %errorlevel% neq 0 (
    echo Error: Docker build gagal
    pause
    exit /b 1
)

echo.
echo Pushing image to Google Container Registry...
docker push gcr.io/%PROJECT_ID%/%SERVICE_NAME%:latest
if %errorlevel% neq 0 (
    echo Error: Docker push gagal
    pause
    exit /b 1
)

echo.
echo Deploying to Cloud Run...
gcloud run deploy %SERVICE_NAME% ^
  --image gcr.io/%PROJECT_ID%/%SERVICE_NAME%:latest ^
  --platform managed ^
  --region %REGION% ^
  --allow-unauthenticated ^
  --memory 512Mi ^
  --cpu 1 ^
  --max-instances 10

if %errorlevel% neq 0 (
    echo Error: Deploy gagal
    pause
    exit /b 1
)

echo.
echo ==============================
echo Deploy Berhasil!
echo ==============================
echo.
gcloud run services describe %SERVICE_NAME% --region=%REGION%

echo.
echo Useful commands:
echo.
echo 1. View logs:
echo    gcloud run logs read %SERVICE_NAME% --region=%REGION% --follow
echo.
echo 2. View service details:
echo    gcloud run services describe %SERVICE_NAME% --region=%REGION%
echo.
echo 3. Update env vars:
echo    gcloud run deploy %SERVICE_NAME% --update-env-vars KEY=VALUE --region=%REGION%
echo.
echo 4. Delete service:
echo    gcloud run services delete %SERVICE_NAME% --region=%REGION%
echo.

pause
endlocal
