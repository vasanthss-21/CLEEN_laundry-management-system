// balanceUtils.js
import { db, ref, get } from "../firebaseConfig";

/**
 * Fetches the total laundry bill for the PREVIOUS month.
 * For example, if it's October, this will calculate the total for September.
 * @param {string} rfid - The student's TagId.
 * @returns {Promise<number>} The total amount for last month.
 */
export const fetchOutstandingBalance = async (rfid) => {
  try {
    // --- Determine last month's year and month string (e.g., "2025-09") ---
    const now = new Date();
    // Setting the day to 0 goes to the last day of the previous month
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth(), 0); 
    const year = lastMonthDate.getFullYear();
    const month = String(lastMonthDate.getMonth() + 1).padStart(2, '0');
    const prefix = `${year}-${month}`; // This will be "2025-09" if the current month is October

    // Fetch all data for the user from Realtime Database
    const userRef = ref(db, `Users/${rfid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      return 0; // No data exists for this user
    }

    const allData = snapshot.val();
    let lastMonthBalance = 0;

    // Filter the records to include only those from the last month
    Object.keys(allData)
      .filter(key => key.startsWith(prefix))
      .forEach(key => {
        const entry = allData[key];
        // Sum the amount only for completed ("Collected") cycles in that month
        if (entry.status === "Collected" && entry.amount) {
          lastMonthBalance += Number(entry.amount);
        }
      });

    return lastMonthBalance;
    
  } catch (error) {
    console.error("Error fetching last month balance:", error);
    return 0; // Return 0 in case of an error
  }
};