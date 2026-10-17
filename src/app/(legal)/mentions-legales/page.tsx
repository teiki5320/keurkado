import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/layout/LegalPage";
import { AMAZON_DISCLOSURE } from "@/lib/amazon";
import { legalConfig, siteConfig } from "@/lib/config";

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales",
  description: "Éditeur et hébergeur du site Keur Kado, données personnelles, publicité, liens Amazon et limites de responsabilité.",
  path: "/mentions-legales",
});

export default function LegalNoticePage() {
  const l = legalConfig;
  return (
    <LegalPage title="Mentions légales" updated="17 octobre 2026">
      <p>
        Informations sur l&apos;éditeur et l&apos;hébergeur du site, l&apos;usage de vos données et les limites des
        informations publiées (loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique).
      </p>

      <h2>Éditeur du site</h2>
      <ul>
        <li>
          Éditeur : {l.companyName}, société par actions simplifiée (SAS) au capital de 200 €, exerçant sous le nom
          commercial {l.tradeName}, qui publie le site {siteConfig.name}.
        </li>
        <li>Siège social : {l.address}.</li>
        <li>Immatriculation : {l.rcs} (SIRET {l.siret}).</li>
        <li>N° de TVA intracommunautaire : {l.vat}.</li>
        <li>Directeur de la publication : {l.director}.</li>
        {l.phone && <li>Téléphone : {l.phone}.</li>}
        <li>
          Contact : <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
        </li>
      </ul>

      <h2>Hébergeur</h2>
      <p>{l.host}.</p>

      <h2>Données personnelles et cookies</h2>
      <ul>
        <li>
          Aucun compte n&apos;est nécessaire. Le site ne dépose lui-même aucun cookie ; seuls les cookies de la publicité
          Google sont déposés, et uniquement si vous les acceptez dans le bandeau de consentement (lien « Gérer mes cookies »
          en bas de chaque page pour changer d&apos;avis).
        </li>
        <li>
          Les réponses au quiz « Trouve le cadeau » restent dans votre navigateur : elles sont seulement reportées dans
          l&apos;adresse de la page, pour pouvoir partager le résultat. Elles ne sont transmises à personne.
        </li>
        <li>
          Les polices, les images et le code du site sont servis par le site lui-même, sans mesure d&apos;audience. Seuls les
          annonces et le bandeau de consentement viennent de Google.
        </li>
        <li>L&apos;hébergeur peut enregistrer des journaux techniques (adresse IP, date, page demandée) pour la sécurité du service.</li>
        <li>
          Conformément au RGPD, vous pouvez exercer vos droits d&apos;accès, de rectification et d&apos;effacement auprès de
          l&apos;éditeur, à l&apos;adresse de contact ci-dessus. Le détail figure dans la{" "}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </li>
      </ul>

      <h2>Publicité</h2>
      <p>
        Pour financer le site, certaines pages affichent des annonces fournies par Google AdSense. Elles sont toujours
        signalées par la mention « Publicité » et séparées des contenus et des liens Amazon. L&apos;éditeur ne choisit pas les
        annonces une à une : leur présence ne vaut pas recommandation, et leur contenu relève de l&apos;annonceur. Les
        catégories d&apos;annonces inadaptées à un site tout public sont bloquées. Le détail des données utilisées
        figure dans la <Link href="/confidentialite#publicite">politique de confidentialité</Link>.
      </p>

      <h2>Liens sponsorisés (Amazon)</h2>
      <p>
        Les boutons « Voir sur Amazon » des pages d&apos;idées cadeaux, des Top 10, des conseils et du quiz sont des liens
        d&apos;affiliation du programme Partenaires d&apos;Amazon.fr. {AMAZON_DISCLOSURE} Le prix payé est le même pour
        l&apos;acheteur. Le site ne vend aucun produit : la vente, la livraison et le service client relèvent d&apos;Amazon ou
        du vendeur tiers. Aucun prix n&apos;est garanti : les budgets indiqués sont des fourchettes habituelles, et seul le prix
        affiché sur Amazon au moment de l&apos;achat fait foi. Le choix des cadeaux repose sur leur intérêt, pas sur le montant
        des commissions. Un clic sur ces liens vous fait quitter le site : Amazon applique alors sa propre politique de
        confidentialité et de cookies.
      </p>

      <h2>Propriété intellectuelle et images</h2>
      <ul>
        <li>
          Les textes du site (descriptions des cadeaux, sélections, conseils, calendrier), le logo de {siteConfig.name} et les
          épingles Pinterest sont créés par l&apos;éditeur : ils sont sa propriété, sauf mention contraire. Toute reproduction
          sans autorisation est interdite.
        </li>
        <li>
          Le site n&apos;affiche aucune photo de produit Amazon : les noms de marques et de produits éventuellement cités
          appartiennent à leurs propriétaires.
        </li>
        <li>Pour toute demande de retrait ou de correction, écrivez à l&apos;adresse de contact.</li>
      </ul>

      <h2>Limites de responsabilité</h2>
      <p>
        Les informations sur les cadeaux, les fêtes et leurs dates (les fêtes lunaires sont des estimations) sont vérifiées
        avec soin, mais peuvent comporter des erreurs ou évoluer : pour un produit, seules font foi les informations
        affichées sur Amazon au moment de l&apos;achat. N&apos;hésitez pas à nous signaler une erreur à l&apos;adresse de contact.
      </p>
    </LegalPage>
  );
}
