import React from "react";
import "./styles.css"; // Import CSS file

const benefits = [
  "Free Pickup & Delivery",
  "72-Hour Turnaround",
  "Eco-Friendly Cleaning",
  "Specialty Curated Packages",
  "Economical Prices"
];

const services = [
  { title: "Laundry", description: "Machine wash, drying and folding" },
  { title: "Dry Cleaning", description: "Stain-removal with harmless, organic solvents" },
  { title: "Steam Press", description: "Crease-removal for elevated appearance" },
  { title: "Sanitize Wash", description: "Cleansing and elimination of 99.9% of typical household germs" },
  { title: "Special Laundry", description: "Premium wash, care, and packaging for your fabrics" },
  { title: "Curtain Wash", description: "One-stop solution to cleaning accumulated dirt" }
];

const Services = () => {
  return (
    <div className="container">
      {/* Benefits Section */}
      <section className="benefits">
        <h2 className="section-title">Big Laundry. Big Benefits.</h2>
        <ul className="benefits-list">
          {benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          A quick overview of all that Big Laundry can do for you!
        </p>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Services;
