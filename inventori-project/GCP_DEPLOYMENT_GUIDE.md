# GCP Deployment Guide untuk Inventori Project

## Prerequisites

Sebelum melakukan deployment, pastikan Anda sudah memiliki:

1. **Google Cloud Account** - Buat akun di [cloud.google.com](https://cloud.google.com)
2. **GCP Project** - Buat project baru di GCP Console
3. **Billing Account** - Setup billing untuk project
4. **Google Cloud SDK** - Install dari [cloud.google.com/sdk](https://cloud.google.com/sdk)
5. **Docker** - Install dari [docker.com](https://docker.com)
6. **Git** - Untuk push ke Cloud Source Repositories (optional)

## Step 1: Install Google Cloud SDK

### Di Windows:
```powershell
# Download dan install dari https://cloud.google.com/sdk/docs/install-windows
# Atau gunakan Chocolatey
choco install google-cloud-sdk
```

Setelah instalasi, verifikasi:
```powershell
gcloud --version
```

## Step 2: Initialize GCP

```powershell
# Login ke Google Account
gcloud auth login

# Set project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Step 3: Build Docker Image

### Option A: Build Locally dan Push ke Google Container Registry

```powershell
# Build image
docker build -t gcr.io/YOUR_PROJECT_ID/inventori-frontend:latest .

# Push ke GCR
docker push gcr.io/YOUR_PROJECT_ID/inventori-frontend:latest
```

### Option B: Build menggunakan Cloud Build (Recommended)

```powershell
# Cloud Build akan build otomatis dari source code
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/inventori-frontend:latest
```

## Step 4: Deploy ke Cloud Run

```powershell
# Deploy image
gcloud run deploy inventori-frontend `
  --image gcr.io/YOUR_PROJECT_ID/inventori-frontend:latest `
  --platform managed `
  --region asia-southeast1 `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1 `
  --max-instances 10
```

### Penjelasan parameter:
- `inventori-frontend` - Nama service
- `--platform managed` - Managed Cloud Run
- `--region asia-southeast1` - Region (bisa diubah: us-central1, europe-west1, dll)
- `--allow-unauthenticated` - Akses publik
- `--memory 512Mi` - RAM allocation
- `--cpu 1` - CPU allocation
- `--max-instances 10` - Max instances untuk auto-scaling

## Step 5: Konfigurasi Environment Variables (jika diperlukan)

Jika aplikasi memerlukan environment variables:

```powershell
gcloud run deploy inventori-frontend `
  --image gcr.io/YOUR_PROJECT_ID/inventori-frontend:latest `
  --platform managed `
  --region asia-southeast1 `
  --set-env-vars "API_BASE_URL=https://your-backend-url.com" `
  --allow-unauthenticated
```

## Step 6: Setup Custom Domain (Optional)

```powershell
# Assign custom domain
gcloud run domain-mappings create --service=inventori-frontend --domain=yourdomain.com
```

## Step 7: Monitoring dan Logging

```powershell
# View logs
gcloud run logs read inventori-frontend --region=asia-southeast1

# View metrics
gcloud monitoring timeseries list --filter='resource.type="cloud_run_revision"'
```

## Troubleshooting

### Error: "Image not found"
```powershell
# Pastikan image sudah di push ke GCR
docker push gcr.io/YOUR_PROJECT_ID/inventori-frontend:latest
```

### Error: "Permission denied"
```powershell
# Configure Docker authentication
gcloud auth configure-docker

# Retry push
docker push gcr.io/YOUR_PROJECT_ID/inventori-frontend:latest
```

### Error: Port tidak ter-expose
```powershell
# Pastikan Dockerfile expose port 3000
# dan entrypoint command menggunakan port 3000
```

## Cost Optimization

1. **Use Cloud Build** - Lebih murah daripada build lokal
2. **Set Min Instances to 0** - Jangan ada cost ketika tidak ada traffic
3. **Adjust Memory/CPU** - 256Mi memory dan 0.25 CPU mungkin cukup untuk frontend
4. **Use CDN** - Integrate dengan Cloud CDN untuk caching

## Continuous Deployment (Optional)

Untuk auto-deploy setiap kali ada push ke GitHub:

```powershell
# Setup Cloud Build trigger dari GitHub repository
gcloud builds triggers create github `
  --name=inventori-deploy `
  --repo-name=inventori-project `
  --repo-owner=YOUR_GITHUB_USERNAME `
  --branch-pattern="^main$"
```

## Checklist Deployment

- [ ] Google Cloud Account created
- [ ] GCP Project created
- [ ] Billing enabled
- [ ] Google Cloud SDK installed
- [ ] Docker installed
- [ ] APIs enabled (Cloud Build, Cloud Run)
- [ ] Docker image built
- [ ] Image pushed to GCR
- [ ] Cloud Run service deployed
- [ ] Application accessible
- [ ] Environment variables configured
- [ ] Monitoring setup

## Useful Links

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Container Registry Documentation](https://cloud.google.com/container-registry/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)

---
Untuk bantuan lebih lanjut, silakan konsultasikan dengan GCP documentation atau hubungi GCP support.
