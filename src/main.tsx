import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Styled Console Watermark for Developers / Copiers
console.log(
  `%c 🚀 DIVYARAJ VARANIYA %c https://divyaraj.js.org \n%c Full Stack Web Developer & UI Engineer %c Copyright © ${new Date().getFullYear()} `,
  "background: #a855f7; color: #ffffff; padding: 6px 12px; border-radius: 4px 0 0 4px; font-weight: bold; font-family: sans-serif; font-size: 13px;",
  "background: #1e1b4b; color: #a855f7; padding: 6px 12px; border-radius: 0 4px 4px 0; font-family: sans-serif; font-size: 13px; font-weight: 500;",
  "color: #a855f7; font-size: 12px; font-weight: bold; font-family: sans-serif; line-height: 2.2;",
  "color: #71717a; font-size: 11px; font-family: sans-serif;"
);

console.log(
  `%c 🛠️ Built with React, TypeScript, and Three.js. Unauthorized copying of this site's source code is prohibited. `,
  "color: #e4e4e7; font-size: 11px; font-family: sans-serif; line-height: 1.5;"
);


import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
);
