import Map from "../components/Map"; // import your map component
import "./about.scss";

const About = () => {
  return (
    <div className="about-page">
      {/* Top About Section */}
      <section className="about-section">
        <h1>About</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod
          orci vel dui tincidunt, sit amet dictum urna elementum. Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Donec eget ligula id elit vulputate dapibus. Duis
          placerat, mi a sagittis finibus, ligula nisl vulputate purus, et
          cursus eros justo at lectus. Praesent vitae tortor vel justo tincidunt
          fermentum. Phasellus in sem libero. Curabitur eget metus vitae justo
          convallis consectetur. Integer sed pharetra mauris. Cras eget nunc nec
          justo bibendum posuere. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Sed euismod orci vel dui tincidunt, sit amet dictum
          urna elementum. Pellentesque habitant morbi tristique senectus et
          netus et malesuada fames ac turpis egestas. Donec eget ligula id elit
          vulputate dapibus. Duis placerat, mi a sagittis finibus, ligula nisl
          vulputate purus, et cursus eros justo at lectus. Praesent vitae tortor
          vel justo tincidunt fermentum. Phasellus in sem libero. Curabitur eget
          metus vitae justo convallis consectetur.
        </p>
      </section>

      {/* Map Section at the bottom */}
      <section className="map-section">
        <Map />
      </section>
    </div>
  );
};

export default About;
