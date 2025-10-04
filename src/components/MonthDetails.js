import React, { useEffect, useState, useCallback } from "react";
import { db, ref, get } from "../firebaseConfig";
import bgVideo from './bgvdo1.mp4';
import { useParams, useLocation, useNavigate } from "react-router-dom";

const formatDateString = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

function MonthDetails() {
    const { monthName } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const user = queryParams.get("user");

    const [laundryData, setLaundryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shortUrl, setShortUrl] = useState("");
    const [showQR, setShowQR] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const monthMapping = {
        January: "01", February: "02", March: "03", April: "04",
        May: "05", June: "06", July: "07", August: "08",
        September: "09", October: "10", November: "11", December: "12",
    };
    const monthNumber = monthMapping[monthName];
    const currentYear = new Date().getFullYear();

    const now = new Date();
    const isPastMonth = (currentYear < now.getFullYear()) ||
                        (currentYear === now.getFullYear() && parseInt(monthNumber, 10) < now.getMonth());

    const fetchData = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const userRef = ref(db, `Users/${user}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const allData = snapshot.val();
                let filteredData = Object.keys(allData)
                    .filter((key) => key.startsWith(`${currentYear}-${monthNumber}`))
                    .map((key) => ({ ...allData[key], key }));

                filteredData.sort((a, b) => a.key.localeCompare(b.key));

                const cycles = new Map();
                filteredData.forEach(entry => {
                    const entryDate = new Date(entry.date);
                    let cycleKey;

                    if (entry.status === "Dropped") {
                        cycleKey = entry.date;
                    } else {
                        const dropDate = new Date(entryDate);
                        dropDate.setDate(entryDate.getDate() - 1);
                        cycleKey = formatDateString(dropDate);
                    }
                    cycles.set(cycleKey, entry);
                });

                const consolidatedData = Array.from(cycles.values());
                setLaundryData(consolidatedData);
            } else {
                setLaundryData([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [monthName, monthNumber, user, currentYear]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleBack = () => {
        setRedirecting(true);
        setTimeout(() => {
            navigate("/dashboard");
            setRedirecting(false); 
        }, 800);
    };

    const totalAmount = laundryData
        .filter(item => item.status === "Collected")
        .reduce((sum, item) => sum + item.amount, 0);

    const getStatusColor = (status) => {
        switch (status) {
            case "Dropped": return "#ff6363ff";
            case "Ready to Collect": return "#ffcc00ff";
            case "Collected": return "#00ffa2ff";
            default: return "#f3f4f6";
        }
    };

    const upiLink = `upi://pay?pa=shreenivas699@okaxis&pn=ShreenivasA&am=${totalAmount.toFixed(2)}&cu=INR`;
    const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`;

    const getShortUrl = async () => {
        try {
            if (totalAmount <= 0) return;
            const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(upiLink)}`);
            const shortUrlText = await response.text();
            setShortUrl(shortUrlText);
        } catch (error) {
            console.error("Error shortening URL:", error);
        }
    };

    useEffect(() => { getShortUrl(); }, [totalAmount]);

    return (
        <div className="month-details">
            <video className="video-background" autoPlay loop muted playsInline>
                <source src={bgVideo} type="video/mp4" />
            </video>

            <div className={`loading-overlay ${redirecting ? "show" : ""}`}>
                <img src="/LOGO.gif" alt="Loading..." className="loading-gif" />
            </div>

            <button className="back-btn" onClick={handleBack}>← Back to Dashboard</button>
            <h2>{monthName} Laundry Details</h2>

            {loading ? (
                <div className="skeleton-loader">Loading data...</div>
            ) : laundryData.length === 0 ? (
                <p>No laundry data available for {monthName}.</p>
            ) : (
                <>
                    <div className="table-wrapper desktop-only">
                        <table className="full-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Weight (kg)</th>
                                    <th>Amount (₹)</th>
                                    <th>Clothes</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {laundryData.map((entry) => (
                                    <tr key={entry.key} className="table-row">
                                        <td>{entry.date}</td>
                                        <td>{entry.time.replace(/-/g, ':')}</td>
                                        <td>{entry.weight} kg</td>
                                        <td>₹{entry.amount.toFixed(2)}</td>
                                        <td>{`Shirts:${entry.shirts}, Pants:${entry.pants}, Others:${entry.others}`}</td>
                                        <td style={{ color: getStatusColor(entry.status), fontWeight: "bold" }}>{entry.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mobile-only">
                        {laundryData.map((entry) => (
                            <div key={entry.key} className="card">
                                <p><strong>Date & Time:</strong> {entry.date} at {entry.time.replace(/-/g, ':')}</p>
                                <p><strong>Weight:</strong> {entry.weight} kg</p>
                                <p><strong>Amount:</strong> ₹{entry.amount.toFixed(2)}</p>
                                <p><strong>Clothes:</strong> Shirts: {entry.shirts}, Pants: {entry.pants}, Others: {entry.others}</p>
                                <p><strong>Status:</strong> <span style={{ color: getStatusColor(entry.status), fontWeight: "bold" }}>{entry.status}</span></p>
                            </div>
                        ))}
                    </div>

                    <h3>Total Bill for {monthName}: ₹{totalAmount.toFixed(2)}</h3>

                    {isPastMonth ? (
                        <div className="payment-container">
                            <button onClick={() => setShowQR(!showQR)} className="show-qr-button">
                                {showQR ? "Hide Details" : "Payment Status"}
                            </button>
                            {showQR && (
                                <div className="paid-status-container">
                                    <p>✅ This bill has been paid.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`payment-container ${isMobile && showQR ? "show-qr" : ""}`}>
                            {!isMobile && (
                                <button onClick={() => setShowQR(!showQR)} className={`show-qr-button ${showQR ? "active" : ""}`}>
                                    {showQR ? "Hide QR" : "Show QR"}
                                </button>
                            )}
                            {!isMobile && showQR && (
                                <div className="qr-container">
                                    <h4>Scan to Pay via UPI</h4>
                                    <img src={QR_CODE_URL} alt="UPI QR Code" />
                                </div>
                            )}
                            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="pay-now-button">
                                Pay Now
                            </a>
                        </div>
                    )}
                </>
            )}

            <style>{`
                .month-details { padding: 20px; max-width: 1000px; margin: auto; background-color: rgba(0, 0, 0, 0.52); border-radius: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37); }
                .back-btn { margin-bottom: 15px; padding: 8px 15px; border: none; background-color: #dedede; color: #000; border-radius: 5px; cursor: pointer; transition: background-color 0.3s; }
                .back-btn:hover { background-color: #333; color: #fff; }
                h2,h3 { text-align: center; margin-bottom: 20px; color: #fff; }
                .table-wrapper { overflow-x: auto; }
                table.full-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-radius: 10px; overflow: hidden; box-shadow: 0 3px 10px rgba(0,0,0,0.1); }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
                th { background-color: #3498db; color: #fff; font-weight: bold; }
                tr td { background-color: #fff; color: #000; }
                .card { border-radius: 1rem; padding: 1.2rem; margin-bottom: 15px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); color: #f9fafb; }
                .card p { margin: 6px 0; font-size: 15px; line-height: 1.5; font-weight: 600; }
                .video-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1; }
                .payment-container { display: flex; flex-direction: column; gap: 10px; align-items: center; margin-top: 20px; }
                .show-qr-button, .pay-now-button { padding: 10px 15px; border-radius: 5px; border: none; cursor: pointer; width: 100%; max-width: 220px; text-align: center; }
                .show-qr-button { background-color: #007bff; color: #fff; }
                .pay-now-button { background-color: #27ae60; color: #fff; text-decoration: none; }
                .qr-container { display: flex; flex-direction: column; align-items: center; position: fixed; bottom: 20px; right: 20px; background: #fff; padding: 15px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 100; }
                .qr-container img { width: 150px; height: 150px; }
                .paid-status-container { margin-top: 15px; padding: 1rem; width: 100%; max-width: 220px; background-color: rgba(40, 167, 69, 0.2); border: 1px solid #28a745; border-radius: 8px; color: #d4edda; text-align: center; font-weight: bold; }
                .paid-status-container p { margin: 0; }
                
                .loading-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100vw; height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    backdrop-filter: blur(6px);
                    background: rgba(255, 255, 255, 0.08);
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.4s ease-in-out;
                }
                .loading-overlay.show {
                    opacity: 1;
                    pointer-events: all;
                }
                .loading-gif {
                    width: 100px;
                    height: 100px;
                    animation: pulse 1.2s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                @media (max-width: 768px) { .desktop-only { display: none; } .mobile-only { display: block; } .qr-container { right: 50%; transform: translateX(50%); } }
                @media (min-width: 769px) { .desktop-only { display: block; } .mobile-only { display: none; } }
            `}</style>
        </div>
    );
}

export default MonthDetails;