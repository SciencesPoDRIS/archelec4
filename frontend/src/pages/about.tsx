import React from "react";
import { Link } from "react-router-dom";
import { Loader } from "../components/loader";
import { MetadataPanel } from "../components/metadata-panel";

interface Props {}
export const About: React.FC<Props> = (props: Props) => {
  return (
    <div className="container-fluid about full-height">
      <div>
        <h1>Archives électorales de Sciences Po</h1>
        <h2>Explorer les professions de foi des élections législatives de la Ve République</h2>
        <p>
          Interface de recherche avancée pour une exploration multicritère des archives électorales mis en ligne par
          Sciences Po sur Internet Archive (+ lien) et sur sa Bibliothèque numérique (+ lien).
        </p>
        <p>
          <Link className="btn" to="/explorer">
            Explorer
          </Link>
        </p>
      </div>
    </div>
  );
};
