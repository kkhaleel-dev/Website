import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import "./about.scss";

const About = () => {
  const navigate = useNavigate();
  const activities = [
    {
      title: "Quarterly Movie Screenings",
      desc: "Come for the movie, stay for the conversations, laughter, and nostalgia that only CITians can share.",
    },
    {
      title: "Regular Alumni Meets",
      desc: "Casual catch-ups, meaningful discussions, and idea-sharing over coffee and conversations.",
    },
    {
      title: "Family Get-Together Events",
      desc: "Because CIT friendships grow into lifelong bonds — families are part of the journey.",
    },
  ];

  const initiatives = [
    {
      title: "Official Chapter Website",
      tag: "Digital First",
      desc: "A one-stop platform for events, updates, engagement, and alumni stories.",
    },
    {
      title: "CIT Alumni Walkathon",
      tag: "Community & Well-being",
      desc: "A high-energy walkathon bringing together fitness, fun, and fellowship.",
    },
    {
      title: "Entrepreneurship Group",
      tag: "Entrepreneurship & Innovation",
      desc: "Support alumni founders, exchange mentorship, and inspire student entrepreneurs.",
    },
    {
      title: "Tech Discussion Forums",
      tag: "Knowledge Sharing",
      desc: "Peer-driven conversations on technology, trends, and real-world experiences.",
    },
    {
      title: "CIT Alumni Card",
      tag: "Alumni Privileges",
      desc: "Exclusive alumni identity with expanding partner discounts and privileges.",
    },
  ];

  return (
    <div className="about-page">
      {/* HERO */}
      <div className="about-hero">
        <h2>About CIT Alumni – Chennai Chapter</h2>
        <p>
          A living, growing community bound by shared memories, friendships, and
          the unmistakable CIT vibe.
        </p>
      </div>

      {/* INTRO */}
      <section className="about-content">
        <p>
          The CIT Alumni Chennai Chapter is more than just an alumni group — it’s
          a vibrant network of people who carry the spirit of CIT across
          generations.
        </p>
        <p>
          As one of the oldest and most active alumni chapters, we proudly bring
          together nearly <strong>1,000 alumni across Chennai</strong>, with
          close to <strong>200 new members joining every year</strong>. Whether
          you graduated decades ago or just stepped into the professional world,
          there’s always a place for you here.
        </p>
      </section>

      {/* STATS */}
      <div className="about-stats">
        <div className="stat-card">
          <span className="stat-number">1000+</span>
          <span className="stat-label">Active Alumni</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">200+</span>
          <span className="stat-label">New Members / Year</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">70+</span>
          <span className="stat-label">Years of CIT Legacy</span>
        </div>
      </div>

      {/* PURPOSE */}
      <section className="about-highlight">
        <h3>Powered by Alumni. Run with Purpose.</h3>
        <p>
          The Chennai Chapter is a registered and fully functional association,
          driven by an elected Executive Committee (EC) serving a two-year term.
          The EC plans, executes, and evolves initiatives that keep alumni
          engaged, inspired, and connected.
        </p>
        <p>
          What truly sets us apart is the sense of ownership — because this is
          <strong> our community</strong>.
        </p>
      </section>

      {/* ACTIVITIES */}
      <section className="about-section-block">
        <h3>Where Memories Meet New Connections</h3>
        <div className="about-card-grid">
          {activities.map((item, i) => (
            <div className="about-card" key={i}>
              <span className="card-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INITIATIVES */}
      <section className="about-section-block">
        <h3>New Ideas. Fresh Energy.</h3>
        <div className="about-card-grid">
          {initiatives.map((item, i) => (
            <div className="about-card" key={i}>
              <span className="card-tag">{item.tag}</span>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className="about-highlight">
        <h3>Why We Exist</h3>
        <p>
          To keep the CIT spirit alive — strengthening bonds, building new
          connections, and celebrating a journey that began on the CIT campus.
        </p>
        <p className="about-quote">
          Stay connected. Grow together. Give back.
        </p>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h3>Be Part of the Story</h3>
        <p>
          Reconnect with old friends, make new ones, share ideas, mentor, learn,
          and celebrate everything that makes being a CITian special.
        </p>
        <button onClick={() => navigate("/accounts")}>Join the CIT Alumni Chennai Chapter</button>
      </section>

      {/* MAP */}
      <section className="map-section">
        <Map />
      </section>
    </div>
  );
};

export default About;