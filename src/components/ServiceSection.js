import React from "react";
import bgVideo from './bgvdo1.mp4';

import {
  WashingMachine,
  Shirt,
  Star,
  SprayCan,
  Home,
} from "lucide-react";

const services = [
  {
    title: "Laundry",
    description: "Machine wash, drying and folding",
    icon: WashingMachine,
  },
  {
    title: "Dry Cleaning",
    description: "Stain-removal with harmless, organic solvents",
    icon: Shirt,
  },
  {
    title: "Steam Press",
    description: "Crease-removal for elevated appearance",
    icon: Star, // Changed to a reliable icon from the core library
  },
  {
    title: "Sanitize Wash",
    description: "Cleansing and elimination of 99.9% of typical household germs",
    icon: SprayCan,
  },
  {
    title: "Special Laundry",
    description: "Premium wash, care, and packaging for your fabrics",
    icon: Home, // Swapped to a home icon for special services
  },
  {
    title: "Curtain Wash",
    description: "One-stop solution to cleaning accumulated dirt",
    icon: Star, // Swapped to a star icon
  }
];

const ServicesSection = () => {
  return (
    <>
      <div className="services-section">
        <video className="video-background" autoPlay loop muted playsInline>
          <source src={bgVideo} type="video/mp4" />
        </video>
        <h2 className="section-title">Our Services</h2>
        <p className="section-description">
          A quick overview of all that Big Laundry can do for you!
        </p>

        <div className="services-container">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="service-box">
                <div className="service-icon-container">
                  <IconComponent strokeWidth={1.5} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inline <style> tag for all CSS rules */}
      <style>{`
        .video-background {
          position: fixed; /* Cover whole screen */
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -2;
        }
        .services-section {
          padding: 60px 20px;
          background-color: rgba(0, 0, 0, 0.46);
          border-radius:20px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
        }

        .section-title {
          font-size: 2.5em;
          font-weight: 700;
          color: #ffffffff;
          margin-bottom: 10px;
        }

        .section-description {
          font-size: 1.1em;
          color: #c5c5c5ff;
          margin-bottom: 40px;
        }

        .services-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .service-box {
          background: rgba(255, 255, 255, 0.23); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);;
          padding: 2.5rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
          border-bottom: 5px solid #00b2acff;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .service-box:hover {
          transform: translateY(-10px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .service-icon-container {
          margin-bottom: 20px;
          color: #00fff7ff;
        }
        .service-icon-container svg {
          /* Desktop size */
          width: 48px;
          height: 48px;
        }

        .service-box h3 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #ffffffff;
          margin-top: 0;
          margin-bottom: 10px;
        }

        .service-box p {
          font-size: 1rem;
          color: #ffffffff;
          line-height: 1.6;
        }
        @media (max-width: 992px) {
          .services-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            height:100vh;
            max-width:100%;
          }
          .service-box{
          padding:15px;
          }
          .service-box p {
            font-size: 0.8rem;
            line-height: 1.6;
          }
          .service-box h3{
            font-size:1rem;
          }
          .service-icon-container {
            margin:20px 0px;
            color: #00fff7ff;
          }
          .service-icon-container svg {
            /* Mobile size */
            width: 45px;
            height: 45px;
          }
          .section-title {
            font-size: 1.8rem;
            margin-bottom: 5px;
          }
          .section-description{
            font-size:1rem;
            color:#ffffff;
          }
        }
      `}</style>
    </>
  );
};

export default ServicesSection;