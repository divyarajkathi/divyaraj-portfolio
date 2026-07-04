import { MdCopyright } from "react-icons/md";
import { FaLinkedinIn, FaEnvelope } from "react-icons/fa6";
import "./styles/Contact.css";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  useEffect(() => {
    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 85%",
        end: "bottom center",
        toggleActions: "play none none none",
      },
    });

    // Animate footer components on scroll
    contactTimeline.fromTo(
      ".contact-container > *",
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      }
    );

    return () => {
      contactTimeline.kill();
    };
  }, []);

  return (
    <div className="contact-section" id="contact">
      <div className="contact-container">
        <h2>Let's build something great.</h2>
        
        <div className="social-links">
          <a
            href={config.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="disable"
            title="LinkedIn"
          >
            <FaLinkedinIn />
          </a>
          <a
            href={`mailto:${config.contact.email}`}
            data-cursor="disable"
            title="Email"
          >
            <FaEnvelope />
          </a>
        </div>

        <div className="bottom-bar">
          <span>{config.social.location}</span>
          <span>Designed & Developed by {config.developer.fullName}</span>
          <span>
            <MdCopyright /> {new Date().getFullYear()} All Rights Reserved
          </span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
