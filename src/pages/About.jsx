import Map from "../components/Map";
import "./about.scss";

const About = () => {
  return (
    <div className="about-page">
      <section className="about-section">
        <h1 className="about-title">
          About Coimbatore Institute of Technology
        </h1>

        <h2 className="about-subtitle">
          Established in 1956 · Autonomous Institution · Coimbatore, Tamil Nadu
        </h2>

        <p className="about-description">
          Coimbatore Institute of Technology (CIT) is affiliated to Anna
          University and is recognized for its academic excellence, research
          culture, and strong industry engagement.
        </p>

        <p className="about-description">
          At CIT, we have reasons to be proud of our alumni. Many of these
          former students have pursued not only their degrees, but also their
          dreams. Some have launched new companies; others, new careers. A
          significant number have enjoyed the challenges and satisfaction that
          come with reaching the next level within their organizations.
        </p>

        <p className="about-description">
          Many others have enriched their lives, as well as their communities.
          Regardless of their accomplishments, our alumni seem to be as proud of
          our institute as we are of them. A significant majority of ALUMCIT
          alumni expressed satisfaction with their education and its usefulness
          in their professional careers.* They also said “they would recommend
          the University to others”.Not surprisingly, many alumni stay involved
          with ALUMCIT. Some stay on to earn more than one degree and some
          ultimately join our faculty.
        </p>

        <div className="about-stats">
          <div className="stat">
            <span className="stat-number">1956</span>
            <span className="stat-label">Year Established</span>
          </div>
          <div className="stat">
            <span className="stat-number">60+</span>
            <span className="stat-label">Years of Excellence</span>
          </div>
          <div className="stat">
            <span className="stat-number">Global</span>
            <span className="stat-label">Alumni Presence</span>
          </div>
        </div>
      </section>

      <section className="map-section">
        <Map />
      </section>
    </div>
  );
};

export default About;
