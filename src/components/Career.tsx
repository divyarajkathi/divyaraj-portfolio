import "./styles/Career.css";
import { config } from "../config";

const Career = () => {
  return (
    <div className="career-section section-container" id="experience">
      <div className="career-container">
        <h2>My Career Path</h2>
        <div className="career-info">
          {/* Vertical axis line animated by GSAP scroll */}
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          
          {config.experiences.map((exp, index) => {
            const isCurrent = exp.period.toLowerCase().includes("present");
            return (
              <div key={index} className="career-info-box">
                <span className="year">
                  {exp.period.toUpperCase()}
                  {isCurrent && <span className="present-badge">CURRENT</span>}
                </span>
                <h3>{exp.position}</h3>
                <span className="company">{exp.company}</span>
                <p>{exp.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Career;
