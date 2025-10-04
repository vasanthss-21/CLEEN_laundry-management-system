// uploadStudentProfiles.js
import { sdb, doc } from "../firebaseConfig";
// Import setDoc and Timestamp, which are needed for writing data and dates
import { setDoc, Timestamp } from "firebase/firestore";

/**
 * Uploads sample student profiles to the 'students' collection in Firestore.
 */
export async function uploadStudentProfiles() {
  const studentsToUpload = [
    {
      // The tagId will become the Document ID in Firestore
      tagId: "63e5ff27", 
      data: {
        name: "Student Name",
        regNo: "123EC256",
        hostel: "Hostel A",
        roomNo: "318",
        laundryPlan: "Pay per Use",
        planStatus: "Active",
        // Firestore uses a special Timestamp object for dates
        lastDropOff: Timestamp.fromDate(new Date("2025-09-24T18:30:00")),
        activeOrders: 1,
        preferences: "Use Comfort fabric softener",
        photoUrl: "", 
      }
    },
    {
      tagId: "439b50fa",
      data: {
        name: "Student Name",
        regNo: "123EC256",
        hostel: "Hostel B",
        roomNo: "402",
        laundryPlan: "Monthly Unlimited",
        planStatus: "Payment Due",
        lastDropOff: Timestamp.fromDate(new Date("2025-09-17T18:30:00")),
        activeOrders: 0,
        preferences: "No fabric softener",
        photoUrl: "",
      }
    }
  ];

  try {
    const uploadPromises = studentsToUpload.map(student => {
      // Create a document reference in the 'students' collection with the tagId
      const studentRef = doc(sdb, "students", student.tagId);
      // Use setDoc to create or overwrite the document with the provided data
      return setDoc(studentRef, student.data);
    });

    // Wait for all profiles to be uploaded
    await Promise.all(uploadPromises);
    
    console.log("✅ Successfully uploaded student profiles to Firestore.");
    alert("✅ Student profiles have been uploaded to Firestore!");

  } catch (error) {
    console.error("❌ Error uploading student profiles:", error);
    alert("❌ Error uploading student profiles. Check the console for details.");
  }
}