# CLEEN — RFID-Based Smart Laundry System 🧺

CLEEN is a smart laundry management platform for hostels, PGs, apartments, and institutions.  
It combines **RFID tags, load cells, IoT (ESP32/Raspberry Pi), and a React + Firebase web app** to deliver automated laundry tracking, weight-based billing, and real-time status updates.

---

## Features
- 🔖 RFID-tagged bags for unique identification  
- ⚖️ Load-cell weight measurement → automatic billing  
- 📲 Real-time status tracking (In Progress → Ready for Collection)  
- 🔔 Notifications via app/SMS  
- 📸 Student/customer profile with photo, reg no, mobile, and RFID  
- 🔁 Scalable & modular — supports ESP32 and Raspberry Pi  

---

## Tech Stack
- **Frontend:** React, React Router  
- **Backend:** Firebase Realtime DB (auth), Firestore (profiles), Storage (images)  
- **Edge devices:** ESP32 (current), upgrading to Raspberry Pi  

---

## Firebase Structure

### Firestore (`students` collection)
| Field     | Type   | Description                  |
|-----------|--------|------------------------------|
| regNo     | string | Student registration number  |
| name      | string | Student name                 |
| mobile    | string | Student mobile number        |
| photoUrl  | string | Public URL of profile photo  |

> Use **raw.githubusercontent.com** URLs for GitHub-hosted images:  
> ```
> https://raw.githubusercontent.com/<username>/<repo>/main/path/to/image.png
> ```

### Realtime Database (`Auth/<TagId>`)
| Field    | Type   | Description      |
|----------|--------|-----------------|
| password | number | Login password   |

---
Screenshots
Message:
![Msg_ScreenShot](https://github.com/user-attachments/assets/e3f328a9-5179-4ddd-8738-a4cb208b474d)
Prototype:
![Prototype_Image](https://github.com/user-attachments/assets/5c1a5881-9684-4e64-b9c8-cfc10bdb0580)
Web_Page:
![Login_Page](https://github.com/user-attachments/assets/daebca9a-3369-462f-b2a8-683ead0346d4)
![Home_Page](https://github.com/user-attachments/assets/51fc548a-65ec-44a4-97c5-9db3121e315a)
![Dashboard_Page](https://github.com/user-attachments/assets/1be4660a-ff36-4217-821f-86807c64bf11)
![Profile_Page](https://github.com/user-attachments/assets/016b0dc6-c465-48e8-81f2-b51a27cef0be)
![MonthlyDetails_Page](https://github.com/user-attachments/assets/5e57a161-fb9c-49b5-b151-7fe7ab5951e5)


## Example Firestore entry
```json
{
  "regNo": "21EC001",
  "name": "Vasanth",
  "mobile": "9876543210",
  "photoUrl": "samplePhoto.com"
} 

Getting Started
bash
git clone https://github.com/vasanthss-21/CLEEN_laundry-management-system.git
cd CLEEN_laundry-management-system
npm install
npm start
Persistent Login in React.js
// Save login
localStorage.setItem('user', tagid);

// Initialize state
const [user, setUser] = useState(() => localStorage.getItem('user') || '');

// Logout
localStorage.removeItem('user');
setUser('');



