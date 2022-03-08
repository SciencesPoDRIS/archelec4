import React from "react";
import { Link } from "react-router-dom";
import ScPoLogo from "../assets/ScPo-logo-rouge-400.png";

export const Header: React.FC = () => {
  return (
    <header>
      <nav className="navbar navbar-fixed">
        <div className="navbar-navigation" role="navigation">
          <span>
            <Link to="/" title="Page d'accueil">
              ARCHELEC
            </Link>
          </span>
          <span>
            <Link to="/explorer" title="Explorer">
              Explorer
            </Link>
          </span>
          <span>
            <Link to="/faq" title="Foire Aux Questions">
              FAQ
            </Link>
          </span>
        </div>
        <a href="http://www.sciencespo.fr" title="Sciences Po">
          <img className="logo" src={ScPoLogo} title="Sciences Po" alt="Sciences Po" role="banner" />
        </a>
      </nav>
    </header>
  );
};
