import { FaLinkedinIn } from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { config } from "../config";

const SocialIcons = () => {
  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href={config.contact.linkedin} target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
        </span>
      </div>
    </div>
  );
};

export default SocialIcons;
