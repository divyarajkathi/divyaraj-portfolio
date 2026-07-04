import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { config } from "../config";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  useEffect(() => {
    // Fade in work items dynamically as they scroll into view
    const items = gsap.utils.toArray(".work-item-2");
    items.forEach((item: any) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <div className="section-header">
          <h2>
            My <span>Work</span>
          </h2>
        </div>
        
        <div className="design-2-stack">
          {config.projects.slice(0, 5).map((project, index) => (
            <div className="work-item-2" key={project.id}>
              <div className="content">
                <span className="cat">{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-tags">
                  {project.technologies.split(",").map((tech, idx) => (
                    <span className="tech-tag" key={idx}>
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="visual">
                <span className="big-num">0{index + 1}</span>
                <WorkImage image={project.image} alt={project.title} />
              </div>
            </div>
          ))}
        </div>

        {/* See All Works Button */}
        <div className="see-all-works-footer">
          <h3>Want to see more?</h3>
          <p>Explore all of my projects and creations</p>
          <Link to="/myworks" className="see-all-btn" data-cursor="disable">
            See All Works →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Work;
