import React from "react";
import packageJson from "../package.alias.json";

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container-fluid d-flex justify-content-center">
        <span>mentions légales | Archélec - v{packageJson.version}</span>
      </div>
    </footer>
  );
};
