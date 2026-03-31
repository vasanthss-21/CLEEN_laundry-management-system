# test_firebase_conn.py
import firebase_admin
from firebase_admin import credentials, db

SERVICE_ACCOUNT = "serviceAccountKey.json"
DB_URL = "https://laundry-management-syste-f2103-default-rtdb.firebaseio.com/"  # <- put your URL here

cred = credentials.Certificate(SERVICE_ACCOUNT)
firebase_admin.initialize_app(cred, {"databaseURL": DB_URL})
ref = db.reference("/Users")
print("Trying to read /Users ...")
print(ref.get())
