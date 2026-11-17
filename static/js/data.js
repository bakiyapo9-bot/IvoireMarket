/* =========================================================
   IvoireMarket — Données de démonstration (MOCK)
   ---------------------------------------------------------
   Ce fichier simule la base de données en attendant le back-end
   Django. Les noms de champs suivent la convention snake_case
   des modèles Django pour faciliter le remplacement par :
     - le contexte des templates ({{ produit.nom }}, {% for %}...)
     - ou une API (Django REST Framework) renvoyant le même JSON.
   ========================================================= */
window.IM_DATA = (function () {
  const COMMISSION_RATE = 0.05; // 5 % — défini par l'administrateur

  const categories = [
    { id: 1, nom: "Mode", slug: "mode", icone: "bi-bag-heart", actif: true,
      sous_categories: [{ id: 11, nom: "Homme" }, { id: 12, nom: "Femme" }, { id: 13, nom: "Enfant" }] },
    { id: 2, nom: "Électronique", slug: "electronique", icone: "bi-phone", actif: true,
      sous_categories: [{ id: 21, nom: "Téléphones" }, { id: 22, nom: "Ordinateurs" }, { id: 23, nom: "Accessoires" }] },
    { id: 3, nom: "Maison", slug: "maison", icone: "bi-house-heart", actif: true,
      sous_categories: [{ id: 31, nom: "Cuisine" }, { id: 32, nom: "Décoration" }] },
    { id: 4, nom: "Beauté", slug: "beaute", icone: "bi-stars", actif: true,
      sous_categories: [{ id: 41, nom: "Soins" }, { id: 42, nom: "Parfums" }] },
    { id: 5, nom: "Alimentation", slug: "alimentation", icone: "bi-basket2", actif: true,
      sous_categories: [{ id: 51, nom: "Épicerie" }, { id: 52, nom: "Boissons" }] },
    { id: 6, nom: "Artisanat", slug: "artisanat", icone: "bi-palette", actif: true,
      sous_categories: [{ id: 61, nom: "Pagnes" }, { id: 62, nom: "Sculptures" }] },
    { id: 7, nom: "Sport", slug: "sport", icone: "bi-bicycle", actif: false,
      sous_categories: [] },
  ];

  const boutiques = [
    { id: 1, nom: "Abidjan Tech", slug: "abidjan-tech", vendeur_id: 101, couleur: "#3d6ee0",
      description: "Smartphones, ordinateurs et accessoires high-tech garantis, livrés partout à Abidjan.",
      ville: "Abidjan", commune: "Cocody", telephone: "+225 07 01 02 03 04", email: "contact@abidjantech.ci",
      categories: [2], note: 4.6, nb_avis: 128, nb_produits: 4, statut: "active", date_creation: "2025-03-12" },
    { id: 2, nom: "Pagne Royal", slug: "pagne-royal", vendeur_id: 102, couleur: "#c2185b",
      description: "Pagnes wax, kita et vêtements sur mesure confectionnés par nos couturiers de Treichville.",
      ville: "Abidjan", commune: "Treichville", telephone: "+225 05 11 22 33 44", email: "pagneroyal@gmail.com",
      categories: [1, 6], note: 4.8, nb_avis: 214, nb_produits: 4, statut: "active", date_creation: "2025-01-05" },
    { id: 3, nom: "Saveurs d'Ivoire", slug: "saveurs-ivoire", vendeur_id: 103, couleur: "#e65100",
      description: "Attiéké, cacao, café et produits du terroir ivoirien, directement des producteurs.",
      ville: "Abidjan", commune: "Yopougon", telephone: "+225 01 44 55 66 77", email: "saveurs@ivoire.ci",
      categories: [5], note: 4.5, nb_avis: 96, nb_produits: 3, statut: "active", date_creation: "2025-05-20" },
    { id: 4, nom: "Beauté Karité", slug: "beaute-karite", vendeur_id: 104, couleur: "#8d6e63",
      description: "Beurre de karité pur, savons noirs et cosmétiques naturels fabriqués à Bouaké.",
      ville: "Bouaké", commune: "Centre", telephone: "+225 07 88 99 00 11", email: "karite@beaute.ci",
      categories: [4], note: 4.7, nb_avis: 77, nb_produits: 3, statut: "active", date_creation: "2025-06-02" },
    { id: 5, nom: "Maison Lagune", slug: "maison-lagune", vendeur_id: 105, couleur: "#00897b",
      description: "Décoration, ustensiles de cuisine et linge de maison pour un intérieur chaleureux.",
      ville: "Abidjan", commune: "Marcory", telephone: "+225 05 66 77 88 99", email: "maisonlagune@gmail.com",
      categories: [3], note: 4.3, nb_avis: 41, nb_produits: 2, statut: "active", date_creation: "2025-08-14" },
    { id: 6, nom: "Mode Plateau", slug: "mode-plateau", vendeur_id: 106, couleur: "#5e35b1",
      description: "Prêt-à-porter urbain et accessoires de mode.",
      ville: "Abidjan", commune: "Plateau", telephone: "+225 07 12 34 56 78", email: "modeplateau@gmail.com",
      categories: [1], note: 0, nb_avis: 0, nb_produits: 0, statut: "pending", date_creation: "2026-11-10" },
    { id: 7, nom: "San Pedro Pêche", slug: "san-pedro-peche", vendeur_id: 107, couleur: "#0277bd",
      description: "Poissons fumés et produits de la mer.",
      ville: "San-Pédro", commune: "Centre", telephone: "+225 01 98 76 54 32", email: "sppeche@gmail.com",
      categories: [5], note: 3.1, nb_avis: 12, nb_produits: 0, statut: "suspended", date_creation: "2025-09-01" },
  ];

  // Chaque produit : prix en FCFA (entiers), prix_promo optionnel
  const produits = [
    { id: 1, nom: "Smartphone Tecno Camon 30 — 256 Go", boutique_id: 1, categorie_id: 2, sous_categorie_id: 21,
      prix: 165000, prix_promo: 149000, stock: 14, note: 4.5, nb_avis: 42, ventes: 310, icone: "bi-phone", couleur: "#3d6ee0",
      variantes: { couleur: ["Noir", "Bleu", "Argent"], modele: ["256 Go", "512 Go"] }, statut: "active",
      description: "Écran AMOLED 6,78\", appareil photo 50 MP, batterie 5000 mAh, double SIM. Garantie 12 mois." },
    { id: 2, nom: "Ordinateur portable HP 15\" Core i5", boutique_id: 1, categorie_id: 2, sous_categorie_id: 22,
      prix: 385000, prix_promo: null, stock: 5, note: 4.7, nb_avis: 18, ventes: 64, icone: "bi-laptop", couleur: "#455a64",
      variantes: { modele: ["8 Go / 256 Go", "16 Go / 512 Go"] }, statut: "active",
      description: "Processeur Intel Core i5 12e génération, SSD rapide, Windows 11. Idéal pour les études et le bureau." },
    { id: 3, nom: "Écouteurs Bluetooth sans fil", boutique_id: 1, categorie_id: 2, sous_categorie_id: 23,
      prix: 15000, prix_promo: 11500, stock: 60, note: 4.2, nb_avis: 95, ventes: 820, icone: "bi-earbuds", couleur: "#212121",
      variantes: { couleur: ["Noir", "Blanc"] }, statut: "active",
      description: "Autonomie 24 h avec boîtier, réduction de bruit, compatible Android et iPhone." },
    { id: 4, nom: "Power bank 20 000 mAh", boutique_id: 1, categorie_id: 2, sous_categorie_id: 23,
      prix: 12000, prix_promo: null, stock: 0, note: 4.4, nb_avis: 33, ventes: 410, icone: "bi-battery-charging", couleur: "#0097a7",
      variantes: {}, statut: "active",
      description: "Charge rapide 22,5 W, deux ports USB + USB-C. Indispensable pendant les coupures." },
    { id: 5, nom: "Robe en pagne wax — coupe sirène", boutique_id: 2, categorie_id: 1, sous_categorie_id: 12,
      prix: 28000, prix_promo: 22000, stock: 20, note: 4.9, nb_avis: 67, ventes: 240, icone: "bi-gender-female", couleur: "#c2185b",
      variantes: { taille: ["S", "M", "L", "XL"], couleur: ["Motif Akwaba", "Motif Lagune"] }, statut: "active",
      description: "Robe cousue main en tissu wax 100 % coton. Retouches gratuites sur demande." },
    { id: 6, nom: "Chemise homme en pagne", boutique_id: 2, categorie_id: 1, sous_categorie_id: 11,
      prix: 18000, prix_promo: null, stock: 35, note: 4.6, nb_avis: 39, ventes: 180, icone: "bi-person-standing", couleur: "#6a1b9a",
      variantes: { taille: ["M", "L", "XL", "XXL"] }, statut: "active",
      description: "Chemise manches courtes, coupe ajustée, idéale pour les cérémonies et le bureau." },
    { id: 7, nom: "Pagne Kita tissé main (6 yards)", boutique_id: 2, categorie_id: 6, sous_categorie_id: 61,
      prix: 75000, prix_promo: null, stock: 6, note: 5.0, nb_avis: 21, ventes: 45, icone: "bi-grid-3x3-gap", couleur: "#f9a825",
      variantes: { modele: ["Traditionnel", "Moderne"] }, statut: "active",
      description: "Kita authentique tissé à la main par des artisans de Bondoukou." },
    { id: 8, nom: "Ensemble enfant boubou", boutique_id: 2, categorie_id: 1, sous_categorie_id: 13,
      prix: 12500, prix_promo: 9900, stock: 18, note: 4.4, nb_avis: 12, ventes: 70, icone: "bi-balloon-heart", couleur: "#ef6c00",
      variantes: { taille: ["2 ans", "4 ans", "6 ans", "8 ans"] }, statut: "active",
      description: "Ensemble boubou + pantalon pour enfant, tissu doux et respirant." },
    { id: 9, nom: "Attiéké sec premium — 2 kg", boutique_id: 3, categorie_id: 5, sous_categorie_id: 51,
      prix: 4500, prix_promo: null, stock: 120, note: 4.6, nb_avis: 58, ventes: 990, icone: "bi-basket2", couleur: "#f9a825",
      variantes: {}, statut: "active",
      description: "Attiéké de Dabou séché, se conserve plusieurs mois. Il suffit de le réhydrater." },
    { id: 10, nom: "Chocolat noir 70 % cacao ivoirien", boutique_id: 3, categorie_id: 5, sous_categorie_id: 51,
      prix: 3500, prix_promo: 2900, stock: 80, note: 4.8, nb_avis: 44, ventes: 560, icone: "bi-cup-hot", couleur: "#5d4037",
      variantes: { modele: ["100 g", "250 g"] }, statut: "active",
      description: "Tablette fabriquée à partir de fèves de cacao de Soubré, sans additifs." },
    { id: 11, nom: "Jus de bissap artisanal — 1 L", boutique_id: 3, categorie_id: 5, sous_categorie_id: 52,
      prix: 1500, prix_promo: null, stock: 3, note: 4.3, nb_avis: 20, ventes: 300, icone: "bi-cup-straw", couleur: "#ad1457",
      variantes: {}, statut: "active",
      description: "Jus de fleurs d'hibiscus, gingembre et menthe. À conserver au frais." },
    { id: 12, nom: "Beurre de karité pur — 500 g", boutique_id: 4, categorie_id: 4, sous_categorie_id: 41,
      prix: 6000, prix_promo: 5000, stock: 45, note: 4.9, nb_avis: 61, ventes: 430, icone: "bi-droplet-half", couleur: "#a1887f",
      variantes: { modele: ["Nature", "Parfumé coco"] }, statut: "active",
      description: "Karité brut non raffiné, pressé à froid. Pour la peau et les cheveux." },
    { id: 13, nom: "Savon noir traditionnel (lot de 3)", boutique_id: 4, categorie_id: 4, sous_categorie_id: 41,
      prix: 4500, prix_promo: null, stock: 70, note: 4.5, nb_avis: 28, ventes: 260, icone: "bi-moisture", couleur: "#424242",
      variantes: {}, statut: "active",
      description: "Savon noir à base de cendres de cabosse de cacao et d'huile de palme." },
    { id: 14, nom: "Parfum d'ambiance encens & santal", boutique_id: 4, categorie_id: 4, sous_categorie_id: 42,
      prix: 9500, prix_promo: null, stock: 12, note: 4.1, nb_avis: 9, ventes: 40, icone: "bi-flower1", couleur: "#7b1fa2",
      variantes: {}, statut: "pending",
      description: "Brume parfumée aux notes boisées, 250 ml." },
    { id: 15, nom: "Marmite en fonte — 10 L", boutique_id: 5, categorie_id: 3, sous_categorie_id: 31,
      prix: 22000, prix_promo: 19500, stock: 9, note: 4.4, nb_avis: 15, ventes: 55, icone: "bi-fire", couleur: "#37474f",
      variantes: { modele: ["6 L", "10 L", "15 L"] }, statut: "active",
      description: "Marmite robuste pour sauce graine, foutou et grandes préparations familiales." },
    { id: 16, nom: "Masque décoratif sculpté (Baoulé)", boutique_id: 5, categorie_id: 6, sous_categorie_id: 62,
      prix: 35000, prix_promo: null, stock: 4, note: 4.6, nb_avis: 7, ventes: 22, icone: "bi-emoji-neutral", couleur: "#6d4c41",
      variantes: {}, statut: "active",
      description: "Masque en bois sculpté à la main, pièce unique, hauteur 45 cm." },
  ];

  const avis = [
    { id: 1, produit_id: 1, auteur: "Koffi A.", note: 5, commentaire: "Très bon téléphone, livré en 24 h à Cocody. Je recommande !", date: "2026-10-28", statut: "publie", signale: false },
    { id: 2, produit_id: 1, auteur: "Aminata D.", note: 4, commentaire: "Bon rapport qualité/prix. La batterie tient bien la journée.", date: "2026-10-15", statut: "publie", signale: false },
    { id: 3, produit_id: 5, auteur: "Fatou K.", note: 5, commentaire: "La robe est magnifique, finitions parfaites. Merci Pagne Royal !", date: "2026-11-02", statut: "publie", signale: false },
    { id: 4, produit_id: 3, auteur: "Yao B.", note: 2, commentaire: "Arnaque, allez acheter ailleurs !!! Contactez-moi au 07…", date: "2026-11-08", statut: "en_attente", signale: true },
    { id: 5, produit_id: 9, auteur: "Mariam T.", note: 5, commentaire: "Attiéké de qualité, comme au village.", date: "2026-11-05", statut: "publie", signale: false },
    { id: 6, produit_id: 12, auteur: "Awa S.", note: 5, commentaire: "Karité très pur, mes cheveux adorent.", date: "2026-11-01", statut: "publie", signale: false },
    { id: 7, produit_id: 1, auteur: "Serge N.", note: 4, commentaire: "Conforme à la description. Emballage soigné.", date: "2026-09-30", statut: "publie", signale: false },
  ];

  const zones_livraison = [
    { id: 1, nom: "Abidjan — Cocody / Plateau", frais: 1500, delai: "24 h", actif: true },
    { id: 2, nom: "Abidjan — Yopougon / Abobo", frais: 2000, delai: "24 – 48 h", actif: true },
    { id: 3, nom: "Abidjan — Marcory / Treichville / Koumassi", frais: 1500, delai: "24 h", actif: true },
    { id: 4, nom: "Grand-Bassam / Bingerville", frais: 2500, delai: "48 h", actif: true },
    { id: 5, nom: "Bouaké / Yamoussoukro", frais: 4000, delai: "2 – 3 jours", actif: true },
    { id: 6, nom: "Autres villes de l'intérieur", frais: 5000, delai: "3 – 5 jours", actif: true },
  ];

  const livreurs = [
    { id: 1, nom: "Ibrahim Coulibaly", telephone: "+225 07 45 12 36 98", zone_id: 1, vehicule: "Moto", statut: "active", livraisons: 312 },
    { id: 2, nom: "Jean-Marc Kouassi", telephone: "+225 05 78 41 25 63", zone_id: 2, vehicule: "Moto", statut: "active", livraisons: 248 },
    { id: 3, nom: "Seydou Traoré", telephone: "+225 01 25 36 47 58", zone_id: 3, vehicule: "Tricycle", statut: "active", livraisons: 190 },
    { id: 4, nom: "Paul Yao", telephone: "+225 07 96 85 74 12", zone_id: 5, vehicule: "Voiture", statut: "inactive", livraisons: 75 },
  ];

  /* Commande multi-vendeurs :
     commande principale -> sous_commandes (1 par boutique) -> lignes (prix figé au moment de l'achat) */
  const commandes = [
    { id: 1024, reference: "IM-2026-001024", client: "Aya Konan", client_id: 201, date: "2026-11-14 10:32",
      statut: "processing", paiement_statut: "paid", moyen_paiement: "Orange Money", zone_id: 1, frais_livraison: 1500,
      adresse: "Cocody Riviera 3, Rue des Jardins, Villa 12", telephone: "+225 07 07 07 07 07",
      sous_commandes: [
        { id: 2051, boutique_id: 1, statut: "shipped", livreur_id: 1,
          lignes: [{ produit_id: 1, nom: "Smartphone Tecno Camon 30 — 256 Go", variante: "Bleu / 256 Go", prix_unitaire: 149000, quantite: 1 },
                   { produit_id: 3, nom: "Écouteurs Bluetooth sans fil", variante: "Blanc", prix_unitaire: 11500, quantite: 2 }] },
        { id: 2052, boutique_id: 2, statut: "processing", livreur_id: null,
          lignes: [{ produit_id: 5, nom: "Robe en pagne wax — coupe sirène", variante: "M / Motif Akwaba", prix_unitaire: 22000, quantite: 1 }] },
        { id: 2053, boutique_id: 3, statut: "delivered", livreur_id: 2,
          lignes: [{ produit_id: 9, nom: "Attiéké sec premium — 2 kg", variante: "", prix_unitaire: 4500, quantite: 3 }] },
      ] },
    { id: 1019, reference: "IM-2026-001019", client: "Aya Konan", client_id: 201, date: "2026-11-02 16:05",
      statut: "delivered", paiement_statut: "paid", moyen_paiement: "Wave", zone_id: 1, frais_livraison: 1500,
      adresse: "Cocody Riviera 3, Rue des Jardins, Villa 12", telephone: "+225 07 07 07 07 07",
      sous_commandes: [
        { id: 2040, boutique_id: 4, statut: "delivered", livreur_id: 1,
          lignes: [{ produit_id: 12, nom: "Beurre de karité pur — 500 g", variante: "Nature", prix_unitaire: 5000, quantite: 2 }] },
      ] },
    { id: 1011, reference: "IM-2026-001011", client: "Aya Konan", client_id: 201, date: "2026-10-20 09:14",
      statut: "cancelled", paiement_statut: "refunded", moyen_paiement: "MTN MoMo", zone_id: 1, frais_livraison: 1500,
      adresse: "Cocody Riviera 3, Rue des Jardins, Villa 12", telephone: "+225 07 07 07 07 07",
      sous_commandes: [
        { id: 2021, boutique_id: 1, statut: "cancelled", livreur_id: null,
          lignes: [{ produit_id: 2, nom: "Ordinateur portable HP 15\" Core i5", variante: "8 Go / 256 Go", prix_unitaire: 385000, quantite: 1 }] },
      ] },
    { id: 1025, reference: "IM-2026-001025", client: "Moussa Bamba", client_id: 202, date: "2026-11-15 14:20",
      statut: "pending", paiement_statut: "pending", moyen_paiement: "Moov Money", zone_id: 2, frais_livraison: 2000,
      adresse: "Yopougon Maroc, près de la pharmacie", telephone: "+225 05 05 05 05 05",
      sous_commandes: [
        { id: 2054, boutique_id: 1, statut: "pending", livreur_id: null,
          lignes: [{ produit_id: 4, nom: "Power bank 20 000 mAh", variante: "", prix_unitaire: 12000, quantite: 1 }] },
        { id: 2055, boutique_id: 4, statut: "pending", livreur_id: null,
          lignes: [{ produit_id: 13, nom: "Savon noir traditionnel (lot de 3)", variante: "", prix_unitaire: 4500, quantite: 2 }] },
      ] },
    { id: 1026, reference: "IM-2026-001026", client: "Clarisse Ehui", client_id: 203, date: "2026-11-16 08:47",
      statut: "confirmed", paiement_statut: "paid", moyen_paiement: "Carte bancaire", zone_id: 3, frais_livraison: 1500,
      adresse: "Marcory Zone 4, Rue du Canal", telephone: "+225 01 01 01 01 01",
      sous_commandes: [
        { id: 2056, boutique_id: 1, statut: "confirmed", livreur_id: null,
          lignes: [{ produit_id: 2, nom: "Ordinateur portable HP 15\" Core i5", variante: "16 Go / 512 Go", prix_unitaire: 385000, quantite: 1 }] },
      ] },
    { id: 1022, reference: "IM-2026-001022", client: "Didier Gnagne", client_id: 204, date: "2026-11-10 11:02",
      statut: "failed", paiement_statut: "failed", moyen_paiement: "Orange Money", zone_id: 5, frais_livraison: 4000,
      adresse: "Bouaké, quartier Commerce", telephone: "+225 07 22 33 44 55",
      sous_commandes: [
        { id: 2048, boutique_id: 2, statut: "cancelled", livreur_id: null,
          lignes: [{ produit_id: 7, nom: "Pagne Kita tissé main (6 yards)", variante: "Traditionnel", prix_unitaire: 75000, quantite: 1 }] },
      ] },
  ];

  const transactions = [
    { id: "TX-88412", commande_ref: "IM-2026-001024", type: "paiement", montant: 209000, moyen: "Orange Money", statut: "success", date: "2026-11-14 10:33" },
    { id: "TX-88398", commande_ref: "IM-2026-001019", type: "paiement", montant: 11500, moyen: "Wave", statut: "success", date: "2026-11-02 16:06" },
    { id: "TX-88310", commande_ref: "IM-2026-001011", type: "paiement", montant: 386500, moyen: "MTN MoMo", statut: "success", date: "2026-10-20 09:15" },
    { id: "TX-88311", commande_ref: "IM-2026-001011", type: "remboursement", montant: 386500, moyen: "MTN MoMo", statut: "success", date: "2026-10-22 14:00" },
    { id: "TX-88420", commande_ref: "IM-2026-001022", type: "paiement", montant: 79000, moyen: "Orange Money", statut: "failed", date: "2026-11-10 11:03" },
    { id: "TX-88430", commande_ref: "IM-2026-001026", type: "paiement", montant: 386500, moyen: "Carte bancaire", statut: "success", date: "2026-11-16 08:48" },
  ];

  const remboursements = [
    { id: 301, commande_ref: "IM-2026-001011", transaction_id: "TX-88310", client: "Aya Konan", montant: 386500, motif: "Annulation avant expédition", statut: "done", date: "2026-10-22" },
    { id: 302, commande_ref: "IM-2026-001019", transaction_id: "TX-88398", client: "Aya Konan", montant: 5000, motif: "Produit endommagé à la livraison (1 pot)", statut: "pending", date: "2026-11-06" },
  ];

  const versements = [
    { id: 501, boutique_id: 1, montant: 812500, periode: "Octobre 2026", reference: "VIR-OM-55821", moyen: "Orange Money", statut: "done", date: "2026-11-03" },
    { id: 502, boutique_id: 2, montant: 498750, periode: "Octobre 2026", reference: "VIR-BQ-11290", moyen: "Virement bancaire", statut: "done", date: "2026-11-03" },
    { id: 503, boutique_id: 3, montant: 233700, periode: "Octobre 2026", reference: "VIR-WV-77412", moyen: "Wave", statut: "done", date: "2026-11-04" },
    { id: 504, boutique_id: 1, montant: 152950, periode: "Novembre 2026 (1re quinzaine)", reference: "—", moyen: "Orange Money", statut: "pending", date: "—" },
    { id: 505, boutique_id: 4, montant: 59850, periode: "Novembre 2026 (1re quinzaine)", reference: "—", moyen: "Wave", statut: "pending", date: "—" },
  ];

  const utilisateurs = [
    { id: 1, nom: "Admin IvoireMarket", email: "admin@ivoiremarket.ci", role: "admin", statut: "active", date_inscription: "2025-01-01" },
    { id: 101, nom: "Kouadio Serge", email: "serge@abidjantech.ci", role: "vendeur", statut: "active", date_inscription: "2025-03-10" },
    { id: 102, nom: "Adjoua Marie", email: "marie@pagneroyal.ci", role: "vendeur", statut: "active", date_inscription: "2025-01-03" },
    { id: 106, nom: "Ange Koné", email: "ange@modeplateau.ci", role: "vendeur", statut: "pending", date_inscription: "2026-11-10" },
    { id: 201, nom: "Aya Konan", email: "aya.konan@gmail.com", role: "client", statut: "active", date_inscription: "2025-07-18" },
    { id: 202, nom: "Moussa Bamba", email: "moussa.b@yahoo.fr", role: "client", statut: "active", date_inscription: "2026-02-11" },
    { id: 204, nom: "Didier Gnagne", email: "didier.g@gmail.com", role: "client", statut: "suspended", date_inscription: "2026-04-01" },
    { id: 301, nom: "Ibrahim Coulibaly", email: "ibrahim.c@ivoiremarket.ci", role: "livreur", statut: "active", date_inscription: "2025-02-15" },
    { id: 401, nom: "Nadège Aka", email: "support@ivoiremarket.ci", role: "support", statut: "active", date_inscription: "2025-02-01" },
  ];

  const reclamations = [
    { id: 701, reference: "REC-0701", client: "Aya Konan", commande_ref: "IM-2026-001019", type: "Produit endommagé", priorite: "haute",
      sujet: "Pot de karité cassé à la réception", statut: "processing", date: "2026-11-05", agent: "Nadège Aka",
      messages: [
        { auteur: "Aya Konan", role: "client", date: "2026-11-05 09:12", texte: "Bonjour, un des deux pots de karité est arrivé cassé. Je joins une photo." },
        { auteur: "Nadège Aka", role: "agent", date: "2026-11-05 10:40", texte: "Bonjour Madame Konan, nous sommes désolés. Nous avons contacté la boutique Beauté Karité et lancé une demande de remboursement partiel de 5 000 FCFA." },
        { auteur: "Aya Konan", role: "client", date: "2026-11-05 11:02", texte: "Merci beaucoup pour votre réactivité." },
      ] },
    { id: 702, reference: "REC-0702", client: "Moussa Bamba", commande_ref: "IM-2026-001025", type: "Paiement", priorite: "moyenne",
      sujet: "Paiement Moov débité mais commande en attente", statut: "pending", date: "2026-11-15", agent: null,
      messages: [{ auteur: "Moussa Bamba", role: "client", date: "2026-11-15 14:40", texte: "Mon compte Moov a été débité mais la commande indique toujours « en attente »." }] },
    { id: 703, reference: "REC-0703", client: "Didier Gnagne", commande_ref: "IM-2026-001022", type: "Litige vendeur", priorite: "basse",
      sujet: "Question sur la disponibilité du Kita", statut: "done", date: "2026-11-11", agent: "Nadège Aka",
      messages: [{ auteur: "Didier Gnagne", role: "client", date: "2026-11-11 08:00", texte: "Le kita sera-t-il de nouveau disponible ?" },
                 { auteur: "Nadège Aka", role: "agent", date: "2026-11-11 09:30", texte: "La boutique confirme un réassort sous 10 jours." }] },
  ];

  const notifications = [
    { id: 1, type: "commande", icone: "bi-bag-check", titre: "Commande confirmée", message: "Votre commande IM-2026-001024 a été confirmée.", date: "Il y a 2 jours", lu: false },
    { id: 2, type: "paiement", icone: "bi-credit-card", titre: "Paiement reçu", message: "Paiement de 209 000 FCFA via Orange Money confirmé.", date: "Il y a 2 jours", lu: false },
    { id: 3, type: "livraison", icone: "bi-truck", titre: "Colis expédié", message: "Abidjan Tech a remis votre colis au livreur Ibrahim C.", date: "Hier", lu: false },
    { id: 4, type: "statut", icone: "bi-check2-circle", titre: "Sous-commande livrée", message: "Saveurs d'Ivoire : votre colis a été livré.", date: "Hier", lu: true },
    { id: 5, type: "promotion", icone: "bi-megaphone", titre: "Promo Pagne Royal", message: "-20 % sur toutes les robes wax jusqu'au 30 novembre.", date: "Il y a 4 jours", lu: true },
  ];

  // Statistiques de démonstration (12 derniers mois) pour les graphiques
  const stats = {
    mois: ["Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov"],
    ventes_plateforme: [8.2, 7.1, 7.9, 9.4, 10.2, 11.8, 12.5, 13.1, 12.2, 14.6, 16.3, 9.8], // millions FCFA
    commissions_plateforme: [0.41, 0.36, 0.40, 0.47, 0.51, 0.59, 0.63, 0.66, 0.61, 0.73, 0.82, 0.49],
    ventes_vendeur: [520, 480, 610, 700, 655, 780, 820, 905, 870, 960, 1050, 640], // milliers FCFA
  };

  return {
    COMMISSION_RATE, categories, boutiques, produits, avis, zones_livraison, livreurs,
    commandes, transactions, remboursements, versements, utilisateurs, reclamations, notifications, stats,
  };
})();
