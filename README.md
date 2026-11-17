# IvoireMarket — Front-end

Marketplace multi-vendeurs (Côte d'Ivoire). Ce dépôt contient **uniquement le front-end** :
HTML5, CSS3 (Bootstrap 5.3) et JavaScript vanilla. Le back-end Django sera branché ensuite.

La structure reprend déjà celle d'un projet Django (`templates/` + `static/`).

---

## 1. Lancer la démo

Aucune installation n'est nécessaire. Ouvrez simplement `templates/index.html` dans un navigateur
(ou utilisez l'extension *Live Server* de VS Code).

> Internet est requis pour charger les CDN (Bootstrap, Bootstrap Icons, Chart.js, Google Fonts).

Pour la démo :

- **Espaces** : utilisez le menu « Espaces (démo) » en haut à droite, ou les boutons de rôle sur la page de connexion.
- **Paiement** : il est simulé. Dans la fenêtre de paiement, choisissez « réussi » ou « échoué ».
- **Code promo** : `AKWABA` (-5 %).
- **Livreur** : code de confirmation de livraison `1234`.

---

## 2. Arborescence

```
IvoireMarket/
├── static/
│   ├── css/style.css        # Thème (orange #F77F00 / vert #009E60), composants
│   └── js/
│       ├── data.js          # DONNÉES FICTIVES (à remplacer par Django)
│       └── app.js           # Navbar, footer, sidebars, panier, toasts, helpers
└── templates/
    ├── index.html           # Accueil
    ├── catalogue.html       # Catalogue + recherche, filtres, tri, pagination (GET)
    ├── produit.html         # Détail, variantes, avis, signalement
    ├── boutiques.html       # Liste des boutiques
    ├── boutique.html        # Page publique d'une boutique
    ├── panier.html          # Panier groupé par vendeur + contrôle de stock
    ├── checkout.html        # Livraison, paiement simulé, sous-commandes
    ├── confirmation.html    # Récapitulatif commande principale / sous-commandes
    ├── contact.html         # Formulaire de contact / FAQ
    ├── auth/                # connexion, inscription (client / vendeur), mot de passe
    ├── compte/              # profil, commandes, détail + suivi, notifications, réclamations
    ├── vendeur/             # dashboard, boutique, produits, formulaire produit,
    │                        # commandes, détail sous-commande, revenus, avis
    ├── administration/      # dashboard, utilisateurs, boutiques (validation), catégories,
    │                        # modération produits / avis, commandes, paiements & remboursements,
    │                        # commissions & versements, livraisons, rapports
    ├── livreur/             # livraisons du jour, historique
    └── support/             # réclamations & litiges, traitement d'un ticket
```

> Le dossier s'appelle `administration/` et non `admin/` pour ne pas entrer en conflit avec `/admin/` de Django.

---

## 3. Intégration avec Django : ce qu'il faut remplacer

### 3.1 Gabarits de base

Les éléments communs sont aujourd'hui générés par `app.js`, à partir de conteneurs vides :

| Conteneur dans la page                  | Rendu par (JS)        | À transformer en (Django)              |
|-----------------------------------------|-----------------------|----------------------------------------|
| `<header id="site-header">`             | `renderHeader()`      | `templates/partials/_navbar.html`      |
| `<div id="site-footer">`                | `renderFooter()`      | `templates/partials/_footer.html`      |
| `<aside id="dash-sidebar">` + `data-role` | `renderDashboard()` | `templates/partials/_sidebar_<role>.html` |
| `<header id="dash-topbar">` + `data-title` | `renderDashboard()` | bloc `{% block page_title %}`          |
| `<aside id="account-nav">`              | `renderAccountNav()`  | `templates/partials/_compte_nav.html`  |

Organisation suggérée :

- `base.html` : `<head>`, navbar et footer, avec `{% block content %}` ;
- `base_dashboard.html` : sidebar et topbar, utilisé par les espaces vendeur, administration, livreur et support.

### 3.2 Chemins

- `href="../../static/css/style.css"` devient `{% load static %}` puis `href="{% static 'css/style.css' %}"`.
- Liens entre pages : `href="produit.html?id=3"` devient `href="{% url 'catalogue:produit' produit.slug %}"`.
- `data-root` sur `<body>` sert uniquement à la démo statique. Il est à supprimer.

### 3.3 Données

- `static/js/data.js` simule la base. **Il est à supprimer** une fois les vues en place.
- Les champs suivent la convention snake_case des modèles (`prix_promo`, `sous_commandes`, `boutique_id`, etc.).
- Les zones rendues en JS sont signalées en commentaire (`<!-- Django : ... -->`). Elles deviennent des boucles `{% for %}`.
- Le markup des cartes réutilisables se trouve dans `productCard()` et `shopCard()` de `app.js`. Copiez-le dans `partials/_product_card.html` et `partials/_shop_card.html`.

### 3.4 Formulaires

- Les formulaires ont déjà `method="post"`, des attributs `name` explicites et `enctype="multipart/form-data"` quand il y a des fichiers.
- Ajoutez `{% csrf_token %}` dans chaque formulaire.
- Les attributs suivants ne servent qu'à la démo et sont à **supprimer** : `data-demo-message`, `data-demo-redirect`, `data-demo-reset`, `data-demo-action`.
- La classe `.needs-validation` garde la validation HTML5 côté client. **Validez toujours côté serveur.**
- Variantes produit : les champs sont nommés `variantes-N-champ`, ce qui est compatible avec un `inlineformset_factory`. Ajoutez `{{ formset.management_form }}`.
- Catalogue : le formulaire de filtres est en `GET` (`q`, `categorie`, `sous_categorie`, `prix_min`, `prix_max`, `boutique` (multiple), `en_stock`, `promo`, `tri`, `page`).

### 3.5 Panier

Le panier est actuellement stocké dans `localStorage` (clé `im_cart`). Côté Django, prévoyez :

- des modèles `Panier` et `LignePanier` liés au client, pour conserver le panier entre les appareils ;
- un panier de session pour les visiteurs, fusionné au panier du client à la connexion.

---

## 4. Modèle de données suggéré (déduit des écrans)

```
Utilisateur(role: client|vendeur|livreur|support|admin, statut, telephone, ...)
Boutique(vendeur→Utilisateur, nom, slug, description, logo, banniere, ville, commune,
         telephone, email, categories M2M, statut: pending|active|suspended|rejected)
Categorie(nom, slug, icone, parent→self null, actif, ordre)
Produit(boutique, categorie, sous_categorie, nom, description, prix, prix_promo,
        promo_debut, promo_fin, stock, statut: pending|active|inactive|rejected)
Variante(produit, type: taille|couleur|modele, valeur, supplement, stock, sku)
ImageProduit(produit, image, ordre)

Commande(client, reference, statut, paiement_statut, zone, frais_livraison, adresse, telephone)
 └── SousCommande(commande, boutique, statut, livreur→Livreur null)
      └── LigneCommande(sous_commande, produit, variante, nom, prix_unitaire, quantite)   # prix FIGÉ
HistoriqueStatut(objet, ancien, nouveau, auteur, justification, date)                     # traçabilité

Transaction(commande, type: paiement|remboursement, montant, moyen, reference_prestataire, statut)
Remboursement(commande, transaction_origine→Transaction, montant, motif, statut)
TauxCommission(taux, categorie null, boutique null, date_effet)
Commission(sous_commande, taux, montant_vente, montant_commission)                       # historisée
Versement(boutique, montant, periode, moyen, reference, preuve, statut, date)

ZoneLivraison(nom, frais, delai, actif)    Livreur(utilisateur, zone, vehicule, statut)
Avis(auteur, produit null, boutique null, note, commentaire, statut, signalements)
Notification(destinataire, type, titre, message, lu, date)
Reclamation(client, commande, type, priorite, sujet, statut, agent)
 └── MessageReclamation(auteur, texte, interne, pieces_jointes, date)
```

---

## 5. Règles de gestion déjà représentées dans l'interface

Ces règles sont visibles côté interface, mais elles doivent être **appliquées côté serveur** :

| Règle | Où on la voit |
|---|---|
| Un vendeur ne voit que ses produits et commandes | `vendeur/*` : filtrage `IM.subOrders(SHOP_ID)` → `filter(boutique__vendeur=request.user)` |
| Un client ne voit que ses commandes | `compte/*` : `filter(client=request.user)` (sinon 404) |
| Prix figés à l'achat | `LigneCommande.prix_unitaire`, mention « Prix figés » sur les détails |
| Stock contrôlé à la commande | Panier (alerte) + revérification au checkout → `select_for_update()` en transaction |
| Commission calculée et historisée | 5 % par sous-commande, annulée si la sous-commande est annulée (`vendeur/revenus`, `administration/commissions`) |
| Versements traçables | Référence de transfert obligatoire + preuve (`administration/commissions`) |
| Pas de modification silencieuse d'une commande payée | Intervention admin = justification obligatoire + journal (`administration/commandes`) |
| Remboursement lié à une transaction | Sélection obligatoire de la transaction d'origine, montant ≤ montant payé (`administration/paiements`) |
| Commande multi-vendeurs | Commande principale → une sous-commande par boutique → lignes (`checkout`, `confirmation`, `compte/commande`) |
| Paiements réels | Intégration officielle du prestataire, webhook vérifié côté serveur, aucune donnée de carte stockée |

---

## 6. Dépendances (CDN, versions figées)

- Bootstrap 5.3.3 (CSS et bundle JS)
- Bootstrap Icons 1.11.3
- Chart.js 4.4.1 (tableaux de bord et rapports uniquement)
- Google Fonts : Poppins

Pour la production, vous pouvez télécharger ces fichiers dans `static/vendor/` et les servir avec `collectstatic`.
