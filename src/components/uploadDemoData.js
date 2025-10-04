// uploadDemoData.js
import { db, ref } from "../firebaseConfig";
import { set } from "firebase/database";

/**
 * Generates weekly demo laundry data with clothes count derived from a random weight.
 * @param {string} userId - The student's TagId.
 * @param {string} mobile - The student's mobile number.
 */
export async function uploadDemoData(userId, mobile = "+919025113512") {
  if (!userId) throw new Error("❌ User ID is missing");

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let demoData = {};

  for (let m = 0; m <= currentMonth; m++) {
    const daysInMonth = new Date(currentYear, m + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateCandidate = new Date(currentYear, m, day);

      if (dateCandidate.getDay() === 3) { // If it's a Wednesday
        
        const dropDate = new Date(currentYear, m, day, 18, 30, 0);
        const processDate = new Date(currentYear, m, day + 1, 10, 0, 0);
        const collectDate = new Date(currentYear, m, day + 1, 19, 15, 0);

        if (collectDate > now) {
          continue;
        }

        // ✅ --- CLOTHES COUNT DERIVED FROM WEIGHT ---
        // 1. First, generate a random weight between 4 and 6 kg.
        const weight = parseFloat((Math.random() * (6 - 4) + 4).toFixed(1));

        // 2. Calculate a realistic number of clothes for that weight.
        // Start with a random number of heavy items (pants).
        const pants = Math.floor(Math.random() * 3) + 3; // Randomly 3, 4, or 5 pants
        const pantsWeight = pants * 0.6; // Assuming pants weigh ~600g

        // Calculate shirts from the remaining weight.
        const remainingWeight = Math.max(0, weight - pantsWeight);
        const shirts = Math.round(remainingWeight / 0.2); // Assuming shirts weigh ~200g
        
        const others = 2; // Assume a couple of small items
        const total_clothes = shirts + pants + others;

        const amount = Math.round(weight * 25);
        // --- END OF NEW LOGIC ---

        const baseData = {
          amount, mobile, others, pants, shirts, total_clothes, weight,
        };

        const dropKey = formatKey(dropDate);
        demoData[dropKey] = {
          ...baseData,
          date: formatDate(dropDate),
          time: formatTime(dropDate),
          status: "Dropped",
        };

        const procKey = formatKey(processDate);
        demoData[procKey] = {
          ...baseData,
          date: formatDate(processDate),
          time: formatTime(processDate),
          status: "Ready to Collect",
        };

        const collKey = formatKey(collectDate);
        demoData[collKey] = {
          ...baseData,
          date: formatDate(collectDate),
          time: formatTime(collectDate),
          status: "Collected",
          upi: `upi://pay?pa=shreenivas699@okaxis&pn=ShreenivasA&am=${amount}&cu=INR`,
          ...(m < currentMonth && { payment_status: "Paid" }),
        };
      }
    }
  }

  const userRef = ref(db, `Users/${userId}`);
  await set(userRef, demoData);

  console.log("✅ Demo weekly data (clothes derived from weight) uploaded successfully for", userId);
}

function formatKey(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatTime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}