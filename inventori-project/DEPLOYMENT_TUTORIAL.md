# Panduan Step-by-Step Deploy ke GCP

## Prasyarat yang Dibutuhkan

Sebelum menjalankan command di bawah, pastikan sudah install:

1. **Google Cloud SDK** - Download dari: https://cloud.google.com/sdk/docs/install-windows
2. **Docker Desktop** - Download dari: https://www.docker.com/products/docker-desktop
3. **Git** - Download dari: https://git-scm.com/download/win

### Cara Mengecek Instalasi:

```powershell
# Cek Google Cloud SDK
gcloud --version

# Cek Docker
docker --version

# Cek Git
git --version
```

---

## Step 1: Siapkan GCP Project

Anda perlu membuat GCP Project terlebih dahulu:

1. Buka https://console.cloud.google.com
2. Klik "Create Project"
3. Masukkan nama: "inventori-project"
4. Tunggu project dibuat (5-10 menit)
5. **Catat PROJECT_ID** (contoh: `inventori-project-12345`)

---

## Step 2: Setup Awal (Jalankan sekali saja)

Buka PowerShell dan jalankan:

```powershell
# Login ke Google Account
gcloud auth login
```

Ini akan membuka browser untuk login. Setelah login, kembali ke PowerShell.

```powershell
# Set Project ID (ganti YOUR_PROJECT_ID dengan Project ID Anda)
gcloud config set project YOUR_PROJECT_ID

# Contoh:
gcloud config set project inventori-project-12345

# Enable APIs yang diperlukan
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com  
gcloud services enable containerregistry.googleapis.com

# Configure Docker untuk GCP
gcloud auth configure-docker
```

Setelah ini selesai, setup hanya perlu dilakukan sekali saja.

---

## Step 3: Build dan Deploy (Jalankan setiap kali update)

### A. Navigate ke Project Directory

```powershell
cd c:\Users\Lenovo\Downloads\Koma\inventori-project
```

### B. Build Docker Image

```powershell
# Set variables (sesuaikan YOUR_PROJECT_ID)
$PROJECT_ID = "inventori-project-12345"

# Build image
docker build -t gcr.io/$PROJECT_ID/inventori-frontend:latest .

# Contoh output:
# Sending build context to Docker daemon  ...
# Step 1/12 : FROM node:18-alpine AS builder
# ...
# Successfully built abc123def456
```

**Apa yang terjadi:**
- Docker membaca Dockerfile
- Download base image node:18-alpine
- Install dependencies (npm install)
- Build project (npm run build)
- Output file ada di folder `dist/`

**Durasi:** 5-10 menit (pertama kali lebih lama)

### C. Push Image ke Google Container Registry

```powershell
docker push gcr.io/$PROJECT_ID/inventori-frontend:latest

# Contoh output:
# The push refers to repository [gcr.io/inventori-project-12345/inventori-frontend]
# ...
# latest: digest: sha256:abc123...
```

**Durasi:** 2-5 menit tergantung ukuran image dan kecepatan internet

### D. Deploy ke Cloud Run

```powershell
gcloud run deploy inventori-frontend `
  --image gcr.io/$PROJECT_ID/inventori-frontend:latest `
  --platform managed `
  --region asia-southeast1 `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1 `
  --max-instances 10

# Contoh output:
# Service [inventori-frontend] revision [inventori-frontend-00001-abc] has been deployed and is serving 100 percent of traffic.
# Service URL: https://inventori-frontend-abc-as.a.run.app
```

**Durasi:** 2-3 menit

Setelah deploy selesai, buka URL yang ditampilkan di browser untuk verifikasi aplikasi berjalan.

---

## Troubleshooting

### Error: "gcloud: The term 'gcloud' is not recognized"

**Solusi:**
1. Tutup PowerShell
2. Buka PowerShell baru
3. Cek: `gcloud --version`

Jika masih error, install ulang Google Cloud SDK dari: https://cloud.google.com/sdk/docs/install-windows

### Error: "docker: The term 'docker' is not recognized"

**Solusi:**
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop
2. Restart computer
3. Buka PowerShell baru
4. Cek: `docker --version`

### Error: "unauthorized: authentication required"

**Solusi:**
```powershell
gcloud auth configure-docker
gcloud auth application-default login
```

### Error: "permission denied while trying to connect to Docker daemon"

**Solusi:**
1. Buka Docker Desktop (klik taskbar tray icon)
2. Tunggu Docker ready
3. Jalankan command ulang

### Error: "Image not found" saat deploy

**Solusi:**
```powershell
# Pastikan image sudah di push
docker push gcr.io/$PROJECT_ID/inventori-frontend:latest

# Cek di Container Registry:
gcloud container images list --repository=gcr.io/$PROJECT_ID
```

### Error: "Billing account not found"

**Solusi:**
1. Buka https://console.cloud.google.com
2. Buka project Anda
3. Buka Billing (hamburger menu → Billing)
4. Link ke billing account atau buat kartu kredit

---

## Commands Berguna

```powershell
# Lihat URL service yang sudah deployed
gcloud run services describe inventori-frontend --region=asia-southeast1

# Lihat logs real-time
gcloud run logs read inventori-frontend --region=asia-southeast1 --follow

# Lihat 50 log terakhir
gcloud run logs read inventori-frontend --region=asia-southeast1 --limit=50

# Update environment variable
gcloud run deploy inventori-frontend `
  --image gcr.io/$PROJECT_ID/inventori-frontend:latest `
  --update-env-vars "API_BASE_URL=https://your-api.com" `
  --region=asia-southeast1

# Skala service
gcloud run services update-traffic inventori-frontend --region=asia-southeast1 --to-revisions=LATEST=100

# Delete service (jika ingin remove)
gcloud run services delete inventori-frontend --region=asia-southeast1

# Lihat semua services yang deployed
gcloud run services list --region=asia-southeast1

# Lihat images di Container Registry
gcloud container images list --repository=gcr.io/$PROJECT_ID
gcloud container images describe gcr.io/$PROJECT_ID/inventori-frontend
```

---

## Cost Estimation

**Cloud Run Pricing (per bulan):**
- 2 juta requests gratis
- 400,000 GB-seconds gratis
- CPU: $0.0000247 per vCPU-second
- Memory: $0.0000050 per GB-second

**Contoh:**
- 100 requests/hari, 1 detik per request = ~$0.50/bulan
- 1000 requests/hari, 2 detik per request = ~$5/bulan

**Tips Hemat:**
1. Jangan set min-instances, biarkan 0 (autoscale from zero)
2. Kurangi memory jika possible: `--memory 256Mi`
3. Gunakan CDN untuk static files
4. Implement caching di app

---

## Deployment Checklist

- [ ] Google Cloud SDK installed
- [ ] Docker Desktop installed
- [ ] GCP Project created
- [ ] Project ID dicatat
- [ ] Billing account linked
- [ ] `gcloud auth login` sudah dilakukan
- [ ] `gcloud config set project YOUR_PROJECT_ID` sudah dilakukan
- [ ] `gcloud auth configure-docker` sudah dilakukan
- [ ] Docker build berhasil
- [ ] Docker push berhasil
- [ ] Cloud Run deploy berhasil
- [ ] Service URL accessible di browser
- [ ] Monitoring setup (optional)

---

## Next Steps (Opsional)

1. **Setup Custom Domain:**
   ```powershell
   gcloud run domain-mappings create --service=inventori-frontend --domain=yourdomain.com
   ```

2. **Setup CI/CD dengan GitHub:**
   - Hubungkan repo ke Cloud Build
   - Auto-deploy setiap push ke main branch

3. **Setup Monitoring:**
   - Alert jika service down
   - Monitor request latency
   - Monitor error rate

4. **Integrate dengan Backend:**
   - Update API_BASE_URL di environment
   - Setup CORS untuk backend

---

Jika ada pertanyaan atau error, tanyakan dengan error message yang lengkap!
