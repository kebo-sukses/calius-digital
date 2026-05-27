# ============================================================================
# COMMAND UNTUK UPLOAD ARTIKEL - COPY & RUN
# ============================================================================

# STEP 1: SET CREDENTIALS (ganti dengan credentials admin Anda)
$env:CALIUS_USER = "admin"
$env:CALIUS_PASS = "password_anda_di_sini"

# STEP 2: RUN UPLOAD
python upload_artikel_final.py

# ============================================================================
# Jika berhasil, lanjutkan dengan:
# ============================================================================

# STEP 3: BUILD FRONTEND
cd frontend
npm run build
cd ..

# STEP 4: DEPLOY TO VERCEL
vercel --prod --yes

# STEP 5: TEST LIVE
start https://www.calius.digital/blog/panduan-lengkap-landing-page-2026

# ============================================================================
# DONE! 🎉
# ============================================================================
