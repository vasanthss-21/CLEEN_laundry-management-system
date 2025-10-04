import React, { useState, useEffect } from "react";
import { fetchOutstandingBalance } from "./balanceUtils";
import bgVideo from "./bgvdo1.mp4";
import { sdb, doc, getDoc } from "../firebaseConfig";

const Profile = ({ TagId }) => {
  const [student, setStudent] = useState(null);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!TagId) {
        setError("No TagId provided.");
        return;
      }
      setError("");
      try {
        const studentRef = doc(sdb, "students", TagId);
        const docSnap = await getDoc(studentRef);
        if (docSnap.exists()) {
          setStudent(docSnap.data());
          const bal = await fetchOutstandingBalance(TagId);
          setBalance(bal);
        } else {
          setError("No profile found for this Tag ID.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch student data. Please try again.");
      }
    };
    fetchStudentData();
  }, [TagId]);

  const InfoRow = ({ icon, label, value }) => (
    <div className="info-row">
      <div className="info-icon">{icon}</div>
      <div className="info-text">
        <span className="info-label">{label}</span>
        <span className="info-value">{value || "N/A"}</span>
      </div>
    </div>
  );

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      case "payment due":
        return "status-due";
      default:
        return "";
    }
  };

  if (error) return <div className="status-container error-message">{error}</div>;
  if (!student) return null;

  return (
    <>
      <div className="profile-container">
        <video className="video-background" autoPlay loop muted playsInline>
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div className="profile-card">
          <div className="profile-header">
            <img
              src={student.photoUrl || "image.png"}
              alt={`${student.name}'s profile`}
              className="profile-photo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-profile.png";
              }}
            />
            <h2 className="student-name">{student.name}</h2>
            <p className="student-regno">Reg No: {student.regNo}</p>
            <p className="student-rfid">RFID Tag: {TagId}</p>
          </div>
          <div className="profile-body">
            <div className="plan-status-container">
              <span className={`plan-status ${getStatusClass(student.planStatus)}`}>
                {student.planStatus}
              </span>
            </div>
            <InfoRow
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-4.44a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.88z"></path><path d="M18 2v6h6"></path></svg>}
              label="Laundry Plan"
              value={student.laundryPlan}
            />
            <InfoRow
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>}
              label="Last Drop-off"
              value={student.lastDropOff?.toDate ? student.lastDropOff.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
            />
            <InfoRow
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>}
              label="Last Month's Bill"
              value={`₹${balance.toFixed(2)}`}
            />
            <InfoRow
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>}
              label="Active Orders"
              value={student.activeOrders}
            />
            <InfoRow
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
              label="Hostel & Room"
              value={`${student.hostel}, Room ${student.roomNo}`}
            />
            <InfoRow
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>}
              label="Preferences"
              value={student.preferences}
            />
          </div>
        </div>
      </div>
      <style>{`
        .video-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1; }
        .profile-container { background-color: rgba(0, 0, 0, 0.51); border-radius:20px; display: flex; justify-content: center; align-items: center; padding: 2rem 1rem; min-height: 90vh; font-family: 'Inter', sans-serif; }
        .profile-card { width: 100%; max-width: 850px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); display: flex; flex-direction: column; overflow: hidden; }
        .profile-header { background-color: rgba(0, 95, 115, 0.7); color: white; padding: 2.5rem; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .profile-photo { width: 130px; height: 130px; border-radius: 50%; object-fit: cover; border: 4px solid #ffffff; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); margin-bottom: 1.5rem; }
        .student-name { margin: 0; font-size: 2rem; font-weight: 700; }
        .student-regno, .student-rfid { margin: 0.25rem 0 0; font-size: 1rem; color: #ade8f4; opacity: 0.9; }
        .profile-body { padding: 2.5rem 2rem; display: flex; flex-direction: column; gap: 1.75rem; position: relative; }
        .plan-status-container { position: absolute; top: 1.5rem; right: 1.5rem; }
        .plan-status { padding: 0.4rem 0.8rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-active { background-color: #d1fae5; color: #065f46; }
        .status-inactive { background-color: #fee2e2; color: #991b1b; }
        .status-due { background-color: #ffedd5; color: #9a3412; }
        .info-row { display: flex; align-items: center; gap: 1.5rem; }
        .info-icon { flex-shrink: 0; background-color: rgba(0, 95, 115, 0.5); color: #ade8f4; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .info-icon svg { width: 22px; height: 22px; }
        .info-text { display: flex; flex-direction: column; }
        .info-label { font-size: 0.9rem; color: #ffffff; font-weight: 400; opacity: 0.8; }
        .info-value { font-size: 1.1rem; color: #e9ecef; font-weight: 600; }
        @media (min-width: 768px) { .profile-card { flex-direction: row; } .profile-header { flex: 0 0 320px; border-right: 1px solid rgba(255, 255, 255, 0.2); } .profile-body { flex: 1; padding: 2.5rem; } }
        .status-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; font-size: 1.2rem; color: white; }
        .error-message { color: #e53e3e; background: #fff0f0; padding: 1rem 1.5rem; border-radius: 8px; }
        .loader { border: 5px solid #f3f3f3; border-top: 5px solid #0077b6; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
      `}</style>
    </>
  );
};

export default Profile;