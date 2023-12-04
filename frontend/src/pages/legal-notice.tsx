import { FC } from "react";

export const LegalNotice: FC = () => (
  <div className="container full-height content-page">
    <div className="row mt-3">
      <h1>Mentions légales</h1>
    </div>
    <div className="row mt-3">
      <p>
        L'Institut d'études politique de Paris (IEP de Paris), établissement public à caractère scientifique, culturel
        et professionnel (EPCSCP), dont la déclaration d’activité est enregistrée sous le numéro 11 75 P 00 12 75 auprès
        du Préfet de la région Ile-de-France, est géré, en vertu de l’article L. 758-1 du code de l’éducation, par la
        Fondation nationale des sciences politiques (FNSP), fondation de droit privé domiciliée au 27, rue
        Saint-Guillaume 75337 PARIS cedex 07, France, étant rappelé que les deux entités sont rassemblées collectivement
        sous le nom de « Sciences Po ».
      </p>
      <p>
        Numéro Siren FNSP : 784 308 249
        <br /> IEP de Paris : 197534316
      </p>
      <p>
        Le directeur de la publication de la plateforme est Mathias Vicherat, administrateur de la Fondation nationale
        des sciences politiques et directeur de l’Institut d’études politiques de Paris.
      </p>
      <p>
        Sciences Po agit en tant que responsable du traitement de données personnelles confiées par l'utilisateur de la
        plateforme. L'utilisateur peut exercer ses droits à tout moment, à l'adresse cnil@sciencespo.fr
      </p>

      <p>
        Le service chargé de l'édition et du suivi de la plateforme est la Direction des Ressources et de l’Information
        scientifique (DRIS).
      </p>

      <p>L'hébergement de la plateforme est assuré par la Direction des systèmes d'information (DSI).</p>

      <h2>Propriété industrielle et intellectuelle</h2>

      <p>
        Toutes les données relatives au matériel électoral mises à disposition via l’interface de recherche sont
        associées à la licence Attribution - Pas d’Utilisation Commerciale - Pas de Modification 3.0 non transposé (CC
        BY-NC-ND 3.0).
      </p>

      <p>
        Le code source de l’interface de recherche et de visualisation est déposé sur{" "}
        <a href="https://github.com/SciencesPoDRIS/archelec4/" title="dépôt de code Archélec 4">
          le site GitHub de la DRIS, projet Archelec4.
        </a>
      </p>

      <p>
        Toutes les autres informations reproduites dans ce site web (textes, photos, logos, etc.) sont protégées par des
        droits de propriété intellectuelle détenus par Sciences Po ou par ses partenaires. Par conséquent, aucune de ces
        informations ne peut être reproduite, modifiée, rediffusée, traduite, exploitée commercialement ou utilisée de
        quelque manière que ce soit sans l'accord préalable et écrit de Sciences Po.
      </p>

      <p>
        Le titre, la conception, la forme du site Archelec mais aussi son contenu tels que des informations,
        descriptions, illustrations et leur organisation, ainsi que toute compilation de logiciels, code source
        fondamental et autres éléments contenus sur le site Sciences Po sont la propriété de Sciences Po.
      </p>

      <h2>Les liens hypertextes</h2>

      <p>
        Nos pages web proposent également des liens vers d'autres sites pour lesquels nous ne sommes responsables ni de
        leur intégral respect aux normes d'ordre public et bonnes mœurs, d'une part, ni de leur politique de protection
        des données personnelles ou d'utilisation qui en seraient faites, d'autre part.
      </p>

      <p>
        En accédant à un autre site, par l'intermédiaire d'un lien hypertexte, vous acceptez que cet accès s'effectue à
        vos risques et périls. En conséquence, tout préjudice direct ou indirect résultant de votre accès à un autre
        site relié par un lien hypertexte ne peut engager la responsabilité de Sciences Po.
      </p>
    </div>
  </div>
);
