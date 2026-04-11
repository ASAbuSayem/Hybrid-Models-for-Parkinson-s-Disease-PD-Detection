"""
PD Detection FastAPI Backend — FIXED v3
Colab-exported MobileNetV2 use (same features as training)
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
import joblib
import io
import os
import logging
from PIL import Image

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.layers import GlobalAveragePooling2D, Input
from tensorflow.keras.models import Model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PD Detection API",
    description="Parkinson's Disease Detection via Spiral/Wave Drawing Analysis",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")


class PDDetector:
    def __init__(self):
        self.feature_extractor = None
        self.svm_model = None
        self.scaler    = None
        self.pca       = None
        self.img_size  = (224, 224)
        self.loaded    = False

    def _build_extractor(self):
        # ── Colab exported model use (same as training) ──
        keras_path = os.path.join(MODELS_DIR, "mobilenet_extractor.keras")

        if os.path.exists(keras_path):
            logger.info("Loading Colab-exported MobileNetV2...")
            model = tf.keras.models.load_model(keras_path)
            logger.info("Feature extractor loaded from file!")
            return model

        # ── Fallback: build from scratch ──────────────────────
        logger.warning("⚠️  mobilenet_extractor.keras not found!")
        logger.warning("⚠️  Building from scratch — may cause prediction errors!")
        logger.warning("⚠️  Export from Colab for best accuracy!")
        base = MobileNetV2(
            weights="imagenet",
            include_top=False,
            input_shape=(224, 224, 3)
        )
        base.trainable = False
        inp = Input(shape=(224, 224, 3))
        x   = base(inp, training=False)
        out = GlobalAveragePooling2D()(x)
        model = Model(inputs=inp, outputs=out)
        logger.info("MobileNetV2 built from scratch")
        return model

    def load(self):
        try:
            # 1. Feature extractor
            self.feature_extractor = self._build_extractor()

            # 2. SVM + Scaler + PCA
            for attr, fname in [
                ('svm_model', 'M2_svm_rbf.pkl'),
                ('scaler',    'M2_scaler.pkl'),
                ('pca',       'M2_pca.pkl'),
            ]:
                path = os.path.join(MODELS_DIR, fname)
                if not os.path.exists(path):
                    raise FileNotFoundError(
                        f"Missing: {path}\n"
                        "Run export cell in Colab and copy pkl files to backend/models/"
                    )
                setattr(self, attr, joblib.load(path))
                logger.info(f" {fname} loaded")

            self.loaded = True
            logger.info("🎉 All models ready!")

        except FileNotFoundError as e:
            logger.error(f" {e}")
            raise RuntimeError(str(e))
        except Exception as e:
            logger.error(f" Load failed: {e}")
            raise RuntimeError(f"Model loading failed: {e}")

    def predict(self, image_bytes: bytes) -> dict:
        if not self.loaded:
            raise RuntimeError("Models not loaded")

        # 1. Image preprocess
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize(self.img_size, Image.LANCZOS)
        arr = preprocess_input(np.array(img, dtype=np.float32))
        batch = np.expand_dims(arr, 0)  # (1, 224, 224, 3)

        # 2. CNN feature extraction
        cnn_feat = self.feature_extractor.predict(batch, verbose=0)  # (1, 1280)

        # 3. Scaler → PCA → SVM
        scaled   = self.scaler.transform(cnn_feat)
        pca_feat = self.pca.transform(scaled)
        pred     = self.svm_model.predict(pca_feat)[0]
        proba    = self.svm_model.predict_proba(pca_feat)[0]

        label      = "Parkinson" if pred == 1 else "Healthy"
        confidence = float(proba[pred]) * 100

        return {
            "prediction":            label,
            "confidence":            round(confidence, 2),
            "probability_healthy":   round(float(proba[0]) * 100, 2),
            "probability_parkinson": round(float(proba[1]) * 100, 2),
            "model":                 "MobileNetV2 + SVM (RBF)",
            "model_accuracy":        83.33,
            "model_auc":             0.924,
        }


detector = PDDetector()


@app.on_event("startup")
async def startup_event():
    detector.load()


@app.get("/")
async def root():
    return {
        "message": "PD Detection API is running",
        "status":  "ready" if detector.loaded else "loading",
        "version": "3.0.0",
    }


@app.get("/health")
async def health():
    return {
        "status":        "healthy" if detector.loaded else "loading",
        "models_loaded": detector.loaded,
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not detector.loaded:
        raise HTTPException(status_code=503, detail="Models still loading.")

    if file.content_type not in ["image/jpeg","image/jpg","image/png","image/webp"]:
        raise HTTPException(status_code=400, detail=f"Invalid file type: {file.content_type}")

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file.")

    try:
        result = detector.predict(data)
        logger.info(f" {result['prediction']} ({result['confidence']:.1f}%)")
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f" {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/model-info")
async def model_info():
    if not detector.loaded:
        raise HTTPException(status_code=503, detail="Models not loaded")
    return {
        "architecture": "MobileNetV2 (Colab-exported) → GlobalAvgPool → StandardScaler → PCA → SVM (RBF)",
        "test_accuracy": "83.33%",
        "auc":           0.924,
        "pca_components": int(detector.pca.n_components_),
    }