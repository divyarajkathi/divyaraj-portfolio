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

    // 🌟 Interactive 3D Card Hover & Touch Tilt Effect
    const cards = document.querySelectorAll(".work-item-2 .visual");
    cards.forEach((elem) => {
      const card = elem as HTMLElement;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate tilt angles based on cursor offset from card center
        const rotateX = ((y - centerY) / centerY) * -8; // Tilt up/down (max 8 degrees)
        const rotateY = ((x - centerX) / centerX) * 8;  // Tilt left/right (max 8 degrees)

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          scale: 1.02,
          transformPerspective: 1000,
          boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.25)",
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        // Reset card properties back to normal
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
          duration: 0.5,
          ease: "power3.out",
        });
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches && e.touches[0]) {
          const rect = card.getBoundingClientRect();
          const x = e.touches[0].clientX - rect.left;
          const y = e.touches[0].clientY - rect.top;

          // Check if touch is within the card area
          if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            gsap.to(card, {
              rotateX: rotateX,
              rotateY: rotateY,
              scale: 1.02,
              transformPerspective: 1000,
              boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.25)",
              duration: 0.3,
              ease: "power2.out",
            });
          }
        }
      };

      const handleTouchEnd = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
          duration: 0.5,
          ease: "power3.out",
        });
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
      card.addEventListener("touchmove", handleTouchMove, { passive: true });
      card.addEventListener("touchend", handleTouchEnd, { passive: true });
      card.addEventListener("touchstart", (e: TouchEvent) => {
        if (e.touches && e.touches[0]) {
          handleTouchMove(e);
        }
      }, { passive: true });

      // Store cleanup function
      (card as any)._cleanup3D = () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
        card.removeEventListener("touchmove", handleTouchMove);
        card.removeEventListener("touchend", handleTouchEnd);
      };
    });

    return () => {
      cards.forEach((card) => {
        if ((card as any)._cleanup3D) {
          (card as any)._cleanup3D();
        }
      });
    };
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
