import { useLocation } from "react-router-dom";
import { FaTools, FaCogs, FaWrench } from "react-icons/fa";
import "./Placeholderpage.scss";

const Placeholderpage = () => {
  const location = useLocation();
  const endpoint = location.pathname.replace("/", "") || "home";

  return (
    <div className="placeholder-page">
      <div className="icons-row">
        <FaTools className="icon" />
        <FaCogs className="icon" />
        <FaWrench className="icon" />
      </div>

      <h2 className="page-name">
        <span className="endpoint">{endpoint}</span> Page InConstruction
      </h2>
      <p className="info-text">
        Once construction is done, you will get this UI
      </p>
      <p className="thank-you">Thank you for visiting</p>
      <p className="footer-text">Developed by Intelizest Consulting Pvt Ltd</p>
    </div>
  );
};

export default Placeholderpage;
