# main.py
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

import os


import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore import FieldFilter

load_dotenv() 
def get_db() -> firestore.Client:
    if not firebase_admin._apps:
        svc_path = os.getenv("FIREBASE_SERVICE_ACCOUNT") or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if not svc_path or not os.path.exists(svc_path):
            raise RuntimeError(
                "Service account JSON not found. "
                "Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS to the JSON path."
            )
        cred = credentials.Certificate(svc_path)
        firebase_admin.initialize_app(cred)
    return firestore.client()


DB = get_db()
COLLECTION_NAME = "FashionData"  # change if your collection is named differently



# ---------------------------
# Helpers
# ---------------------------
def _sanitize(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Convert None/NaN/blank to '', and ensure id is a string."""
    out = {}
    for k, v in doc.items():
        if v is None:
            out[k] = ""
        else:
            out[k] = v
    if "id" in out:
        out["id"] = str(out["id"])
    return out


def _apply_filters(q, **filters):
    """Apply equality filters that are non-empty. Firestore supports chaining .where for equality."""
    for field, value in filters.items():
        if value is None:
            continue
        if isinstance(value, str) and value.strip() == "":
            continue
        q = q.where(filter= FieldFilter(field, "==", value))
    return q


def _count_query(q) -> int:
    """
    Use Firestore aggregation count when available; fallback to manual count (not ideal, but works).
    Requires google-cloud-firestore >= 2.11 for count().
    """
    try:
        agg = q.count()
        res = agg.get()
        # New SDK: res[0].value
        return res[0][0].value
    except Exception:
        # Fallback (costly for huge collections—consider using a cached counter in production)
        return sum(1 for _ in q.stream())