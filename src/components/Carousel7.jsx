import { useNavigate } from "react-router-dom";
import "./Carousel7.scss";
import img1 from "../assets/1.png";
import img2 from "../assets/2.png";
import img3 from "../assets/4.png";
const images = [
  {
    src: img1,
    title: "🎉 Family Get-Together — CIT @ Chennai Chapter 🌳",
    items: 33,
  },
  {
    src: img2,
    title: "CIT Alumni Association – Bangalore Chapter Grand Get-together",
    items: 202,
  },
  {
    src: img3,
    title: "Open House 2025 on November 8, 2025",
    items: 138,
  },
];

const Carousel7 = () => {
  const navigate = useNavigate();

  return (
    <div className="carousel7">
      <div className="carousel7-header">
        <h2>Gallery</h2>
        <button className="view-all" onClick={() => navigate("/gallery")}>
          View All
        </button>
      </div>
      <div className="carousel7-items">
        {images.map((img, index) => (
          <div key={index} className="carousel7-item">
            <img src={img.src} alt={img.title} />
            <div className="carousel7-caption">
              <p>{img.title}</p>
              <span>{img.items} Items</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel7;
