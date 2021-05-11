import React from "react";
import { Link } from "react-router-dom";
import ScPoLogo from "../assets/ScPo-logo-rouge-400.png";

export const Header: React.FC = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-fixed">
        <div id="brand">
          <Link className="navbar-brand" to="/" title="Archelec">
            Archélec
          </Link>{" "}
          <Link className="navbar-brand" to="/explorer" title="explorer">
            ⋅ explorer
          </Link>{" "}
          <Link className="navbar-brand" to={"/FAQ"} title="Archelec">
            ⋅ faq
          </Link>
        </div>
        <Link to="http://www.sciencepo.fr" title="Sciences Po">
          <img className="logo" src={ScPoLogo} title="Sciences Po" alt="Sciences Po" />
        </Link>
      </nav>
    </header>
  );
};
