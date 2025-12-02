# Demo MVP di GCP - Quick Start Guide

## Scenario Demo

Anda akan menunjukkan aplikasi Inventori yang running di cloud (Google Cloud Platform) bukan localhost.

---

## Pre-Setup (Sekali saja)

Pastikan terinstall:
- ✅ Docker Desktop (sudah terinstall)
- ✅ Git (sudah terinstall)
- ⏳ Google Cloud SDK (sedang diinstall)

---

## Setup untuk Demo (5 menit)

### 1. Setelah Google Cloud SDK terinstall

Buka PowerShell baru dan verify:

```powershell
gcloud --version
```

### 2. Login ke GCP

```powershell
gcloud auth login
```

Ini akan membuka browser untuk login. Setelah selesai, kembali ke PowerShell.

### 3. Buat atau Gunakan GCP Project

**Opsi A: Gunakan project existing**
```powershell
gcloud config set project YOUR_PROJECT_ID
```

**Opsi B: Buat project baru**
```powershell
# Set nama project
$PROJECT_NAME = "inventori-demo"
$PROJECT_ID = "inventori-demo-$(Get-Random -Minimum 10000 -Maximum 99999)"

# Buat project
gcloud projects create $PROJECT_ID --name=$PROJECT_NAME

# Set sebagai active project
gcloud config set project $PROJECT_ID

Write-Host "Project ID: $PROJECT_ID" -ForegroundColor Green
```

### 4. Enable Required APIs

```powershell
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 5. Configure Docker

```powershell
gcloud auth configure-docker gcr.io
```

---

## Deploy untuk Demo (10 menit)

### 1. Navigate ke Project

```powershell
cd c:\Users\Lenovo\Downloads\Koma\inventori-project
```

### 2. Build & Push Docker Image

```powershell
# Set variables
$PROJECT_ID = "YOUR_PROJECT_ID"
$SERVICE_NAME = "inventori-frontend"
$IMAGE = "gcr.io/$PROJECT_ID/$SERVICE_NAME:latest"

# Build
Write-Host "Building Docker image..." -ForegroundColor Cyan
docker build -t $IMAGE .

# Push ke GCP Container Registry
Write-Host "Pushing to GCP..." -ForegroundColor Cyan
docker push $IMAGE
```

### 3. Deploy ke Cloud Run

```powershell
$REGION = "asia-southeast1"

gcloud run deploy $SERVICE_NAME `
  --image $IMAGE `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1 `
  --max-instances 5 `
  --no-traffic
```

### 4. Get Service URL

```powershell
gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)'
```

Copy URL ini, buka di browser untuk verifikasi aplikasi running.

---

## For Demo Presentation

### Siapkan:

1. **GCP Console** - Open https://console.cloud.google.com
   - Tunjukkan Cloud Run services
   - Tunjukkan Container Registry images
   - Tunjukkan metrics/logs

2. **Browser Tab 1** - URL dari aplikasi yang sudah deployed
   - Test login/register
   - Test fitur-fitur inventory
   - Show responsiveness

3. **Terminal** - Show live logs
   ```powershell
   gcloud run logs read $SERVICE_NAME --region=$REGION --follow
   ```

---

## Demo Flow

### 1. Setup Phase (2 menit)
```
"Kita akan deploy aplikasi ini ke cloud tanpa setup kompleks..."
→ Show Docker image yang sudah siap
→ Show Dockerfile approach
```

### 2. Deployment Phase (5 menit)
```
"Cloud Run akan automatically handle scaling, networking, dan deployment..."
→ Run docker build (explain what happens)
→ Run docker push (show image upload)
→ Run gcloud run deploy (show deployment progress)
```

### 3. Demo Phase (5+ menit)
```
"Aplikasi sudah live di cloud..."
→ Open application URL
→ Show working features:
  - Authentication
  - Inventory management
  - Real-time updates
  - Responsive design
```

### 4. Infrastructure Phase (3 menit)
```
"Mari lihat di GCP Console..."
→ Show Cloud Run service details
→ Show metrics (requests, latency, errors)
→ Show container logs
→ Show cost estimation
```

---

## Commands Quick Reference

```powershell
# Check if running
gcloud run services describe inventori-frontend --region=asia-southeast1

# View logs
gcloud run logs read inventori-frontend --region=asia-southeast1 --limit=50
gcloud run logs read inventori-frontend --region=asia-southeast1 --follow

# Restart service
gcloud run deploy inventori-frontend `
  --image gcr.io/$PROJECT_ID/inventori-frontend:latest `
  --region=asia-southeast1

# Check resource usage
gcloud run services describe inventori-frontend --region=asia-southeast1 --format='yaml'

# List all revisions
gcloud run revisions list --service=inventori-frontend --region=asia-southeast1
```

---

## Troubleshooting untuk Demo

### Image tidak found
```powershell
# Pastikan sudah push
docker push gcr.io/$PROJECT_ID/inventori-frontend:latest

# List images
gcloud container images list
```

### Service tidak accessible
```powershell
# Check service status
gcloud run services describe inventori-frontend --region=asia-southeast1

# Check if public
gcloud run services get-iam-policy inventori-frontend --region=asia-southeast1
```

### Deployment timeout
```powershell
# Check cloud build logs
gcloud builds log

# Increase timeout
gcloud run deploy inventori-frontend `
  --timeout 3600 `
  --region=asia-southeast1
```

---

## Pro Tips untuk Demo

1. **Pre-build image** - Build sebelum demo, jadi saat demo cukup push & deploy
   ```powershell
   docker build -t gcr.io/$PROJECT_ID/inventori-frontend:latest .
   ```

2. **Keep terminal ready** - Buka 2 terminal:
   - Terminal 1: untuk commands
   - Terminal 2: untuk `gcloud run logs read ... --follow`

3. **Have backup URLs** - Jika ada issue, siapkan pre-deployed instance

4. **Test koneksi internet** - Cloud Run needs internet untuk build dari image

5. **Demo dari incognito browser** - Untuk test fresh session tanpa cache

---

## Estimated Timeline

| Phase | Time |
|-------|------|
| Setup (one-time) | 5 min |
| Build Docker | 5-10 min |
| Push image | 2-5 min |
| Deploy | 2-3 min |
| **Demo features** | 10+ min |
| **Total** | 25-35 min |

---

## Cost for Demo

- **Free tier**: 2 juta requests/bulan gratis
- **Demo load**: ~100 requests = $0.00
- **Expected cost**: ~$0 untuk demo 1x

---

## After Demo

```powershell
# Option 1: Keep running (for testing)
# Keep service as-is

# Option 2: Pause (stop billing)
gcloud run services delete inventori-frontend --region=asia-southeast1

# Option 3: Keep for production
# Setup custom domain, monitoring, CI/CD
```

---

Done! Siap untuk demo? Hubungi saya jika ada yang perlu difix sebelum demo.
