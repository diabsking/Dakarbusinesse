import React from "react";

function Confidentialite() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 text-gray-800">
      <h1 className="text-3xl font-bold">
        Politique de confidentialité – DakarBusiness
      </h1>

      <p className="text-sm text-gray-500">
        Dernière mise à jour : {new Date().toLocaleDateString()}
      </p>

      {/* INTRO */}
      <section className="space-y-3">
        <p>
          DakarBusiness accorde une grande importance à la protection de vos
          données personnelles. Cette politique de confidentialité explique
          quelles informations nous collectons, comment nous les utilisons et
          quels sont vos droits.
        </p>
      </section>

      {/* DONNÉES COLLECTÉES */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Données collectées</h2>
        <p>Nous pouvons collecter les informations suivantes :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Nom et prénom</li>
          <li>Adresse e-mail</li>
          <li>Numéro de téléphone</li>
          <li>Adresse de livraison</li>
          <li>Informations liées aux commandes</li>
          <li>Données de connexion (adresse IP, navigateur)</li>
        </ul>
      </section>

      {/* UTILISATION */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          2. Utilisation des données
        </h2>
        <p>Les données collectées sont utilisées pour :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Traiter les commandes</li>
          <li>Gérer les comptes utilisateurs</li>
          <li>Améliorer nos services</li>
          <li>Assurer la sécurité du site</li>
          <li>Communiquer avec les utilisateurs</li>
        </ul>
      </section>

      {/* PARTAGE */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          3. Partage des données
        </h2>
        <p>
          DakarBusiness ne vend ni ne loue vos données personnelles. Les données
          peuvent être partagées uniquement avec :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Les vendeurs pour le traitement des commandes</li>
          <li>Les prestataires techniques nécessaires au fonctionnement du site</li>
          <li>Les autorités légales si la loi l’exige</li>
        </ul>
      </section>

      {/* SÉCURITÉ */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. Sécurité</h2>
        <p>
          Nous mettons en place des mesures techniques et organisationnelles
          pour protéger vos données contre tout accès non autorisé, perte ou
          divulgation.
        </p>
      </section>

      {/* COOKIES */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5. Cookies</h2>
        <p>
          DakarBusiness utilise des cookies pour améliorer l’expérience
          utilisateur, analyser le trafic et assurer le bon fonctionnement du
          site. Vous pouvez désactiver les cookies dans les paramètres de votre
          navigateur.
        </p>
      </section>

      {/* DROITS */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">6. Vos droits</h2>
        <p>Vous disposez des droits suivants :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Droit d’accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit de suppression</li>
          <li>Droit d’opposition</li>
        </ul>
      </section>

      {/* CONTACT */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">7. Contact</h2>
        <p>
          Pour toute question concernant cette politique de confidentialité,
          vous pouvez nous contacter à l’adresse suivante :
        </p>
        <p className="font-medium">
          📧 contact@dakarbusiness.com
        </p>
      </section>
    </div>
  );
}

export default Confidentialite;
