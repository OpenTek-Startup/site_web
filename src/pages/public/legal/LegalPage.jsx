import { useTranslation } from "react-i18next";
import { Seo } from "../../../components/seo/Seo";
import "./legal.css";

const CONTENT = {
  fr: {
    title: "Mentions legales & Politique de confidentialite",
    updated: "Derniere mise a jour : a completer",
    sections: [
      {
        heading: "1. Editeur du site",
        body: `Le site OpenTek (ci-apres "le Site") est edite par :
[RAISON SOCIALE A COMPLETER], immatriculee sous le numero RCCM [A COMPLETER], dont le siege social est situe [ADRESSE A COMPLETER], Cameroun.
Contact : opentek.startup@gmail.com — Telephone : +237 657 26 85 49
Directeur de la publication : [NOM A COMPLETER]`,
      },
      {
        heading: "2. Hebergement",
        body: `Le Site est heberge par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, Etats-Unis.
Les donnees (base de donnees, fichiers, authentification) sont hebergees par Appwrite (Appwrite Cloud).`,
      },
      {
        heading: "3. Donnees collectees",
        body: `Nous collectons les donnees personnelles suivantes lorsque vous utilisez le Site :
- Formulaire de contact : nom, email, message
- Candidature a une offre d'emploi : nom, email, telephone, lettre de motivation, CV
- Navigation : donnees d'usage anonymisees via Google Analytics, si active (voir section Cookies)

Ces donnees sont necessaires pour repondre a vos demandes et ne sont utilisees a aucune autre fin sans votre consentement.`,
      },
      {
        heading: "4. Finalite et duree de conservation",
        body: `Les donnees collectees via le formulaire de contact et les candidatures sont conservees le temps necessaire au traitement de votre demande, et au maximum 24 mois apres le dernier contact, sauf obligation legale contraire.`,
      },
      {
        heading: "5. Vos droits",
        body: `Conformement a la reglementation applicable en matiere de protection des donnees personnelles, vous disposez d'un droit d'acces, de rectification, de suppression et d'opposition au traitement de vos donnees. Pour exercer ces droits, contactez-nous a l'adresse : opentek.startup@gmail.com`,
      },
      {
        heading: "6. Cookies et outils de mesure d'audience",
        body: `Le Site peut utiliser Google Analytics et/ou Google Tag Manager pour mesurer la frequentation du Site, une fois ces outils actives par l'editeur. Ces outils deposent des cookies de mesure d'audience. Vous pouvez vous opposer a ce suivi via les parametres de votre navigateur.`,
      },
      {
        heading: "7. Propriete intellectuelle",
        body: `L'ensemble des elements du Site (textes, images, logos, mise en page) sont la propriete d'OpenTek ou de ses partenaires, sauf mention contraire, et sont proteges par le droit de la propriete intellectuelle. Toute reproduction sans autorisation prealable est interdite.`,
      },
    ],
  },
  en: {
    title: "Legal Notice & Privacy Policy",
    updated: "Last updated: to be completed",
    sections: [
      {
        heading: "1. Site Publisher",
        body: `The OpenTek website (the "Site") is published by:
[COMPANY NAME TO BE COMPLETED], registered under number RCCM [TO BE COMPLETED], with registered office at [ADDRESS TO BE COMPLETED], Cameroon.
Contact: opentek.startup@gmail.com — Phone: +237 657 26 85 49
Publication director: [NAME TO BE COMPLETED]`,
      },
      {
        heading: "2. Hosting",
        body: `The Site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
Data (database, files, authentication) is hosted by Appwrite (Appwrite Cloud).`,
      },
      {
        heading: "3. Data We Collect",
        body: `We collect the following personal data when you use the Site:
- Contact form: name, email, message
- Job application: name, email, phone, cover letter, CV
- Browsing: anonymized usage data via Google Analytics, if enabled (see Cookies section)

This data is necessary to respond to your requests and is not used for any other purpose without your consent.`,
      },
      {
        heading: "4. Purpose and Retention Period",
        body: `Data collected via the contact form and job applications is kept for as long as necessary to process your request, and for a maximum of 24 months after the last contact, unless otherwise required by law.`,
      },
      {
        heading: "5. Your Rights",
        body: `In accordance with applicable data protection regulations, you have the right to access, rectify, delete, and object to the processing of your data. To exercise these rights, contact us at: opentek.startup@gmail.com`,
      },
      {
        heading: "6. Cookies and Analytics",
        body: `The Site may use Google Analytics and/or Google Tag Manager to measure Site traffic, once these tools are enabled by the publisher. These tools set audience measurement cookies. You can opt out of this tracking through your browser settings.`,
      },
      {
        heading: "7. Intellectual Property",
        body: `All elements of the Site (text, images, logos, layout) are the property of OpenTek or its partners, unless otherwise stated, and are protected by intellectual property law. Any reproduction without prior authorization is prohibited.`,
      },
    ],
  },
};

export default function LegalPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "fr";
  const content = CONTENT[lang];

  return (
    <div className="legal-page container">
      <Seo title={content.title} path="/legal" />
      <h1>{content.title}</h1>
      <p className="legal-page__updated">{content.updated}</p>

      {content.sections.map((section) => (
        <section key={section.heading} className="legal-page__section">
          <h2>{section.heading}</h2>
          {section.body.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </section>
      ))}
    </div>
  );
}
