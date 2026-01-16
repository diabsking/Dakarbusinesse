/**
 * Validation téléphone international (ex: 22177xxxxxxx)
 * ⚠️ Ne pas modifier car vérification par SMS
 */
export const validerPhone = (phone) => {
  const regex = /^(\+221|221)?[0-9]{9}$/;
  return regex.test(phone);
};

/**
 * Validation mot de passe (minimum 6 caractères)
 */
export const validerMotDePasse = (password) => {
  return typeof password === "string" && password.length >= 6;
};

/**
 * Validation nom (vendeur / boutique)
 */
export const validerNom = (nom) => {
  return typeof nom === "string" && nom.trim().length > 0;
};

/**
 * Validation produit
 */
export const validerProduit = (produit) => {
  const erreurs = [];

  if (!validerNom(produit.nom)) erreurs.push("Nom produit invalide");
  if (!produit.description || produit.description.trim().length === 0)
    erreurs.push("Description obligatoire");
  if (!produit.categorie || produit.categorie.trim().length === 0)
    erreurs.push("Catégorie obligatoire");
  if (typeof produit.prix !== "number" || produit.prix <= 0)
    erreurs.push("Prix invalide");
  if (typeof produit.quantite !== "number" || produit.quantite < 0)
    erreurs.push("Quantité invalide");

  return erreurs;
};

/**
 * Validation promotion
 */
export const validerPromotion = (promo) => {
  const erreurs = [];

  if (!promo.produit) erreurs.push("Produit obligatoire");
  if (typeof promo.pourcentage !== "number" || promo.pourcentage <= 0 || promo.pourcentage > 100)
    erreurs.push("Pourcentage invalide");
  if (!promo.dateDebut) erreurs.push("Date de début obligatoire");
  if (!promo.dateFin) erreurs.push("Date de fin obligatoire");
  if (new Date(promo.dateFin) <= new Date(promo.dateDebut))
    erreurs.push("Date de fin doit être après la date de début");

  return erreurs;
};
