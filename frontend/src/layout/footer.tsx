import React from "react";
import packageJson from "../package.alias.json";

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container-fluid d-flex justify-content-center">
        <span>&copy;Archelec - v{packageJson.version}</span>
      </div>
    </footer>
  );
};
