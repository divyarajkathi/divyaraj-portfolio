import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger loading screen split immediately when progress reaches 100%
  if (percent >= 100 && !isLoaded) {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }

  useEffect(() => {
    if (isLoaded) {
      // Unmount the loader and trigger landing page text animations after the zoom-out transition finishes (300ms)
      setTimeout(() => {
        import("./utils/initialFX").then((module) => {
          if (module.initialFX) {
            module.initialFX();
          }
          setIsLoading(false);
        });
      }, 300);
    }
  }, [isLoaded]);

  return (
    <div className={`loading-screen ${isLoaded && "loaded"}`}>
      <div className="loader-content-center">
        {/* The Text group that scales up on load completion */}
        <div className={`loader-text-group ${isLoaded && "zoom-out"}`}>
          {/* Background Text Layer (Dark Grey) */}
          <div className="loader-text-bg">
            WELCOME
          </div>

          {/* Foreground Text Layer (Solid White) that gets clipped as progress rises */}
          <div
            className="loader-text-fg"
            style={{ clipPath: `inset(${100 - percent}% 0px 0px 0px)` }}
          >
            WELCOME
          </div>

          {/* Tiny Status indicator on the bottom right of the text */}
          <div className="loader-percentage-small">
            loading... {percent}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  // Hyper-speed loading progress ticks (fully loads within ~800ms to 1s)
  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 8) + 5; // Fast steps (5% - 13% increments)
      percent = percent + rand;
      if (percent > 50) percent = 50;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random() * 3) + 1; // Speedy increments up to 91%
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 45); // Ticks every 45ms for instant responsiveness
    }
  }, 35);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
