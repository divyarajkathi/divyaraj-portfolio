import "./styles/WhatIDo.css";
import { config } from "../config";

const WhatIDo = () => {
  return (
    <div className="whatIDO" id="services">
      <div className="what-box">
        <h2 className="title">
          Specializations
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in design-2">
          <div className="service-item">
            <h3>{config.skills.design.title}</h3>
            <p>{config.skills.design.details}</p>
            <div className="tags">
              {config.skills.design.tools.map((tool, index) => (
                <span key={index} className="tag">{tool}</span>
              ))}
            </div>
          </div>
          <div className="service-item">
            <h3>{config.skills.develop.title}</h3>
            <p>{config.skills.develop.details}</p>
            <div className="tags">
              {config.skills.develop.tools.map((tool, index) => (
                <span key={index} className="tag">{tool}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
