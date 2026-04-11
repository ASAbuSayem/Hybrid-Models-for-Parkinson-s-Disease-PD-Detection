"""
════════════════════════════════════════════════════════
  STEP: Run this cell at the BOTTOM of Model_2 notebook
  After all training cells are done.
  This will download pkl_files.zip with 3 pkl files.
════════════════════════════════════════════════════════
"""

import joblib, zipfile, os
from google.colab import files

print("💾 Saving Model 2 pkl files...")

# Save SVM model
joblib.dump(trained_models['SVM (RBF)'], '/content/M2_svm_rbf.pkl')
print("   ✅ M2_svm_rbf.pkl saved")

# Save StandardScaler
joblib.dump(scaler, '/content/M2_scaler.pkl')
print("   ✅ M2_scaler.pkl saved")

# Save PCA
joblib.dump(pca, '/content/M2_pca.pkl')
print("   ✅ M2_pca.pkl saved")

# Zip all three
with zipfile.ZipFile('/content/pkl_files.zip', 'w') as zf:
    zf.write('/content/M2_svm_rbf.pkl', 'M2_svm_rbf.pkl')
    zf.write('/content/M2_scaler.pkl',  'M2_scaler.pkl')
    zf.write('/content/M2_pca.pkl',     'M2_pca.pkl')

size = os.path.getsize('/content/pkl_files.zip') / 1024
print(f"\n📦 pkl_files.zip created ({size:.1f} KB)")
print("⬇️  Downloading now...")

files.download('/content/pkl_files.zip')

print("\n✅ Done! Extract the zip and copy 3 pkl files into:")
print("   PD-Detection/backend/models/")
