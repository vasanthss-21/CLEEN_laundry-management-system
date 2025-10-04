import React from "react";
import "./styles.css"; // Import the CSS file

const benefits = [
  "Free Pickup & Delivery",
  "72-Hour Turnaround",
  "Eco-Friendly Cleaning",
  "Specialty Curated Packages",
  "Economical Prices"
];

const BenefitsSection = () => {
  return (
    <section className="benefits-section">
      <h2 className="section-title">Big Laundry. Big Benefits.</h2>

      <div className="benefits-container">
        {benefits.map((benefit, index) => (
          <div key={index} className="benefit-box">
            <div className="icon-placeholder"></div>
            <p>{benefit}</p>
          </div>
        ))}
      </div>
    </section>
  );};

export default BenefitsSection;
