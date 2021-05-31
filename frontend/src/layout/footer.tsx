import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container-fluid d-flex justify-content-center">
        <Link to="/mentions-legales" title="mentions légales">
          mentions légales
        </Link>{" "}
        <Link to="/" title="crédits">
          crédits
        </Link>{" "}
        <a href="https://github.com/SciencesPoDRIS/archelec4/" title="Code source ouvert sur github">
          code source
        </a>
      </div>
    </footer>
  );
};
