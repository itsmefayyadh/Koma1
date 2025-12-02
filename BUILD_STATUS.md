# Cloud Build Status & Deployment Guide

## Status Build Saat Ini

Build telah di-trigger otomatis pada commit `e980ddc`.

### Cara Cek Status Build:

#### Opsi 1: Melalui Cloud Console (Paling Mudah)
1. Buka: https://console.cloud.google.com/cloud-build
2. Lihat build terbaru di list
3. Klik untuk lihat detail & logs

#### Opsi 2: Melalui PowerShell (Butuh gcloud)
```powershell
# Setelah gcloud SDK terinstall dan configure
gcloud builds log --limit=50 --stream

# Atau lihat daftar semua builds
gcloud builds list --limit=10
```

#### Opsi 3: Cek via GitHub Actions (jika integrated)
1. Buka: https://github.com/itsmefayyadh/Koma1
2. Tab "Actions"
3. Lihat workflow status

---

## Timeline Build

Build akan melalui tahapan:

1. **FETCHSOURCE** (1-2 min) - Clone repository dari GitHub
2. **BUILD Step 0** (8-12 min) - Build Docker image
   - Download Node.js alpine image
   - Install npm dependencies
   - Build React app dengan Vite
3. **BUILD Step 1** (2-3 min) - Push image ke Container Registry
4. **BUILD Step 2** (2-3 min) - Deploy ke Cloud Run (jika ada di cloudbuild.yaml)

**Total waktu**: 15-25 menit

---

## Setelah Build Selesai

### ✅ Build Berhasil
- Cloud Build akan show "SUCCESS"
- Image akan ada di Container Registry: `gcr.io/YOUR_PROJECT_ID/inventori-frontend`
- Aplikasi di-deploy ke Cloud Run

### ❌ Build Gagal
- Cloud Build akan show "FAILURE"
- Lihat logs untuk error detail
- Fix error, push commit baru, build akan trigger otomatis

---

## Akses Aplikasi

### Dapatkan URL Cloud Run:

```powershell
# Setelah gcloud terinstall & configure
gcloud run services describe inventori-frontend --region=asia-southeast1 --format 'value(status.url)'
```

Atau lihat di Cloud Console:
1. https://console.cloud.google.com/run
2. Klik service `inventori-frontend`
3. Copy "Service URL" (format: `https://inventori-frontend-xxxxx-as.run.app`)

### Akses di Browser:
Buka URL yang didapat di browser:
```
https://inventori-frontend-xxxxx-as.run.app
```

---

## Troubleshooting Build

### Error: "Cannot find package '@vitejs/plugin-react'"
✅ **Fixed** - vite.config.js sudah di-update ke `@vitejs/plugin-react-swc`

### Error: "lstat /workspace/Dockerfile: no such file or directory"
✅ **Fixed** - Dockerfile sudah di-move ke root directory

### Error: "permission denied"
**Solusi:**
1. Pastikan gcloud authenticated: `gcloud auth login`
2. Pastikan project ID di-set: `gcloud config set project YOUR_PROJECT_ID`
3. Pastikan APIs enabled:
   ```powershell
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

### Build stuck/hanging
**Solusi:**
1. Jangan close PowerShell, tunggu sampai selesai
2. Atau lihat progress di Cloud Console
3. Jika perlu cancel: buka Cloud Console → Cloud Build → Cancel

---

## Commands Berguna

### View full logs
```powershell
gcloud builds log LATEST --stream
```

### View service info
```powershell
gcloud run services describe inventori-frontend --region=asia-southeast1
```

### View traffic
```powershell
gcloud run services describe inventori-frontend --region=asia-southeast1 --format 'value(status.traffic)'
```

### Update service
```powershell
gcloud run deploy inventori-frontend `
  --image gcr.io/YOUR_PROJECT_ID/inventori-frontend:latest `
  --region=asia-southeast1 `
  --update-env-vars "API_URL=https://your-api.com"
```

---

## Demo Checklist

- [ ] Build selesai dengan status SUCCESS
- [ ] Container image ada di GCR
- [ ] Service deployed di Cloud Run
- [ ] URL service dapat diakses
- [ ] Aplikasi loading tanpa error
- [ ] Semua fitur berfungsi normal
- [ ] Performance acceptable

---

## Next Steps

1. **Monitor Build** - Cek Cloud Console sampai status SUCCESS
2. **Test Aplikasi** - Buka URL di browser, test fitur
3. **Setup Custom Domain** (opsional)
   ```powershell
   gcloud run domain-mappings create --service=inventori-frontend --domain=yourdomain.com
   ```
4. **Setup CI/CD** - Otomatis deploy setiap push ke main
5. **Monitoring & Logging** - Setup alerts & dashboards

---

**Status**: Build dalam progress ⏳
**Commit**: e980ddc (Trigger Cloud Build)
**Repository**: https://github.com/itsmefayyadh/Koma1
