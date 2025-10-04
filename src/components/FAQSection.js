import React from "react";
import "./styles.css"; // Import the CSS file

const faqData = [
    {
      question: "What are your operating hours?",
      answer: "Our laundry service operates from 8:00 AM to 8:00 PM, seven days a week. Pickups and deliveries are available within these hours."
    },
    {
      question: "Do you offer eco-friendly cleaning options?",
      answer: "Yes, we use eco-friendly detergents and cleaning methods to ensure your clothes are cleaned sustainably."
    },
    {
      question: "How long does it take to get my laundry back?",
      answer: "Our standard turnaround time is 72 hours. However, we also offer express services for an additional fee if you need your laundry sooner."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital payment methods such as PayPal and Google Pay."
    },
    {
      question: "Can I track the status of my laundry?",
      answer: "Yes, you can track the status of your laundry in real-time through the app. You'll receive notifications at each stage of the process."
    },
    {
      question: "What if I have special instructions for my laundry?",
      answer: "You can add special instructions when scheduling your pickup. Our team will follow your instructions carefully to ensure your laundry is handled as per your preferences."
    },
    {
      question: "Do you handle delicate fabrics?",
      answer: "Yes, we have specialized processes for delicate fabrics. Please inform us about any delicate items when scheduling your pickup."
    },
    {
      question: "Is there a minimum weight requirement for laundry?",
      answer: "No, there is no minimum weight requirement. We accept laundry of any size, from a single item to bulk loads."
    },
    {
      question: "What if I need to cancel or reschedule my pickup?",
      answer: "You can cancel or reschedule your pickup through the app up to 2 hours before the scheduled time. Just go to the 'My Orders' section and make the necessary changes."
    }
  ];


  const FAQSection = () => {
    return (
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {faqData.map((faq, index) => (
          <div key={index} className="faq-card">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    );
  };
export default FAQSection;