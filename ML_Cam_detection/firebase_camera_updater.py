# firebase_camera_updater.py
"""
Helper module to write aggregated camera counts into Firebase RTDB.

Usage:
    from firebase_camera_updater import write_counts_to_rtdb, init_firebase
    init_firebase()
    write_counts_to_rtdb("63e5ff27", "2025-01-01_18-30-00", {"shirts":2,"pants":1,"others":0,"total_clothes":3})
"""

import time
from typing import Dict

import firebase_admin
from firebase_admin import credentials, db

# ---------- CONFIG: EDIT these ----------
SERVICE_ACCOUNT_PATH = "serviceAccountKey.json"   # path to your downloaded service account JSON
FIREBASE_DB_URL = "https://laundry-management-syste-f2103-default-rtdb.firebaseio.com"  # <-- change to your RTDB URL
# ----------------------------------------

_initialized = False

def init_firebase():
    global _initialized
    if _initialized:
        return
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred, {"databaseURL": FIREBASE_DB_URL})
    _initialized = True
    print("[firebase] initialized")

def write_counts_to_rtdb(rfid: str, ts_key: str, counts: Dict[str,int]) -> None:
    """
    Write aggregated counts into /Users/<rfid>/<ts_key>/ in RTDB.
    counts dict must contain: 'shirts','pants','others','total_clothes'
    """
    if not _initialized:
        raise RuntimeError("Firebase not initialized. Call init_firebase() first.")
    node_path = f"/Users/{rfid}/{ts_key}"
    ref = db.reference(node_path)
    payload = {
        "shirts": int(counts.get("shirts", 0)),
        "pants": int(counts.get("pants", 0)),
        "others": int(counts.get("others", 0)),
        "total_clothes": int(counts.get("total_clothes", 0)),
        "camera_last_updated": int(time.time())
    }
    ref.update(payload)
    print(f"[firebase] Updated {node_path}: {payload}")
