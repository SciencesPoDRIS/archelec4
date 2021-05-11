import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header>
      <nav className="navbar navbar-dark navbar-expand-lg navbar-fixed">
        <div id="brand">
          <Link className="navbar-brand" to={"/"} title="Archelec">
            Archélec
          </Link>
        </div>
      </nav>
    </header>
  );
};
