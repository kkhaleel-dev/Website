import React from "react";
import "./Carousel3.scss";
import { FaCity, FaUserGraduate } from "react-icons/fa";
import { PiStudent } from "react-icons/pi";
import { LiaIdCardSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

const Carousel3 = () => {
  const cardData = [
    {
      icon: <FaCity className="icon-svg" />,
      header: "Alumni in your city",
      subheader: "Find alumni living in your city & connect with them",
      buttonText: "Alumni In My City",
      route: "/alumniInYourCity",
    },
    {
      icon: <PiStudent className="icon-svg" />,
      header: "Your Batchmates",
      subheader:
        "View our exclusive batchmates directory to know about whereabouts of your batchmates",
      buttonText: "My Batchmates",
      route: "/batchmates",
    },
    {
      icon: <FaUserGraduate className="icon-svg" />,
      header: "Alumni Directory",
      subheader:
        "Explore complete alumni directory & connect with alumni with your interests & domain.",
      buttonText: "View Directory",
      route: "/directory",
    },
    {
      icon: <LiaIdCardSolid className="icon-svg" />,
      header: "Your Alumni Profile",
      subheader:
        "Create & complete your alumni profile and remain connected with all opportunities matching.",
      buttonText: "My Profile",
      route: "/accounts",
    },
  ];

  return (
    <div className="carousel3-container">
      {cardData.map((item, index) => (
        <div key={index} className="carousel-card">
          <div className="card-icon">{item.icon}</div>

          <h3 className="card-header">{item.header}</h3>

          <div className="card-subheader-wrapper">
            <p className="card-subheader">{item.subheader}</p>
          </div>

          <Link to={item.route} className="card-btn">
            {item.buttonText}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Carousel3;
