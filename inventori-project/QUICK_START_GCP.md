# Quick Start Script untuk Deploy ke GCP

## 1. Setup (Jalankan sekali saja)

```powershell
# Install Google Cloud SDK jika belum
# Download dari: https://cloud.google.com/sdk/docs/install-windows

# Login ke Google Cloud
gcloud auth login

# Set project ID (ganti YOUR_PROJECT_ID dengan project ID Anda)
$PROJECT_ID = "YOUR_PROJECT_ID"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Configure Docker authentication
gcloud auth configure-docker
```

## 2. Deploy (Jalankan setiap kali update)

```powershell
# Navigate ke project directory
cd c:\Users\Lenovo\Downloads\Koma\inventori-project

# Set variables
$PROJECT_ID = "YOUR_PROJECT_ID"
$SERVICE_NAME = "inventori-frontend"
$REGION = "asia-southeast1"

# Build and push image ke GCP
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest .
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

# Deploy ke Cloud Run
gcloud run deploy $SERVICE_NAME `
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1 `
  --max-instances 10

# Dapatkan URL service
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'
```

## 3. Update Environment Variables (jika diperlukan)

```powershell
gcloud run deploy $SERVICE_NAME `
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest `
  --update-env-vars "API_BASE_URL=https://your-api-url.com" `
  --region $REGION
```

## 4. View Logs

```powershell
gcloud run logs read $SERVICE_NAME --region $REGION --limit 50 --follow
```

## 5. Delete Service (jika diperlukan)

```powershell
gcloud run services delete $SERVICE_NAME --region $REGION
```

---

### Opsi Build Alternative: Gunakan Cloud Build

```powershell
# Build menggunakan GCP Cloud Build (lebih baik untuk CI/CD)
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME:latest --gcs-log-dir gs://$PROJECT_ID-build-logs

# Deploy dari image
gcloud run deploy $SERVICE_NAME `
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated
```

**Tips:**
- Ganti `YOUR_PROJECT_ID` dengan Project ID Anda dari GCP Console
- Region `asia-southeast1` untuk Indonesia. Pilihan lain: `us-central1`, `europe-west1`
- Biaya akan dihitung per request dan CPU time
