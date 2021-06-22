import React from "react";
import { Link } from "react-router-dom";

interface Props {}
export const Home: React.FC<Props> = (props: Props) => {
  return (
    <div className="container-fluid about full-height">
      <div>
        <h1>
          Archives électorales de <span style={{ whiteSpace: "nowrap" }}>Sciences Po</span>
        </h1>
        <h2>
          Explorer les professions de foi des élections législatives de la V<sup>e</sup> République
        </h2>
        <p>
          Interface de recherche avancée pour une exploration multicritère des archives électorals du CEVIPOF mises en
          ligne à partir du corpus diffusé sur{" "}
          <a
            title="Lien vers le corpus sur Internet Archive"
            href="https://archive.org/details/archiveselectoralesducevipof"
          >
            Internet Archive
          </a>{" "}
          et sur la{" "}
          <a
            title="Lien vers le corpus sur la bibliothèque numérique de Sciences Po"
            href="https://bibnum.sciencespo.fr/s/catalogue/item-set/1725987"
          >
            bibliothèque numérique de Sciences Po
          </a>
          .
        </p>
        <p>
          <Link
            className="btn btn-lg"
            to="/explorer"
            title="Explorer les professions de foi des élections législatives de la Ve République"
          >
            <i className="fas fa-search"></i> Explorer
          </Link>
          <Link className="btn btn-lg" to="/faq" title="Foire aux questions">
            <i className="far fa-question-circle"></i> FAQ
          </Link>
        </p>
      </div>
      <div className="credit-photo" title="Crédit photo: Caroline Maufroid / Sciences Po">
        <i className="fas fa-camera"></i> Caroline Maufroid, Sciences Po
      </div>
    </div>
  );
};
