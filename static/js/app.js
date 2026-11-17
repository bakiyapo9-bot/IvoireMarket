/* =========================================================
   IvoireMarket — Script principal (front-end uniquement)
   ---------------------------------------------------------
   - Rendu des éléments communs (en-tête, pied de page, menus
     des espaces). Côté Django : ces blocs deviennent
     templates/partials/_navbar.html, _footer.html, _sidebar.html
     inclus depuis base.html / base_dashboard.html.
   - Panier persistant (localStorage) en attendant l'API panier.
   - Composants (cartes produit/boutique, badges, étoiles).
   ========================================================= */
(function () {
  "use strict";
  const D = window.IM_DATA;

  /* ---------- Chemins ----------
     <body data-root="../"> indique le chemin vers templates/.
     Côté Django, remplacer par {% url 'nom_de_vue' %}. */
  const ROOT = document.body.dataset.root || "";
  const url = (p) => ROOT + p;

  /* ---------- Utilitaires ---------- */
  const fmt = (n) => new Intl.NumberFormat("fr-FR").format(Math.round(n)).replace(/ | /g, " ") + " FCFA";
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const param = (k) => new URLSearchParams(location.search).get(k);
  const initials = (name) => String(name).split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const price = (p) => (p.prix_promo != null ? p.prix_promo : p.prix);
  const discount = (p) => (p.prix_promo != null ? Math.round((1 - p.prix_promo / p.prix) * 100) : 0);

  const getProduct = (id) => D.produits.find((p) => p.id === Number(id));
  const getShop = (id) => D.boutiques.find((b) => b.id === Number(id));
  const getCategory = (id) => D.categories.find((c) => c.id === Number(id));
  const getZone = (id) => D.zones_livraison.find((z) => z.id === Number(id));
  const getLivreur = (id) => D.livreurs.find((l) => l.id === Number(id));

  const storage = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* stockage indisponible : panier non persistant */ }
    },
  };

  /* ---------- Statuts (mêmes codes que les choices Django) ---------- */
  const STATUS = {
    pending: "En attente", confirmed: "Confirmée", paid: "Payée", processing: "En préparation",
    shipped: "En livraison", delivered: "Livrée", cancelled: "Annulée", failed: "Échouée", refunded: "Remboursée",
    active: "Active", inactive: "Inactive", suspended: "Suspendue", rejected: "Rejetée", success: "Réussie", done: "Effectué",
    publie: "Publié", en_attente: "En attente",
  };
  const STATUS_CLASS = { publie: "st-active", en_attente: "st-pending" };
  const statusBadge = (code, label) =>
    `<span class="badge badge-status ${STATUS_CLASS[code] || "st-" + code}">${esc(label || STATUS[code] || code)}</span>`;

  const stars = (n) => {
    let h = "";
    for (let i = 1; i <= 5; i++) h += `<i class="bi ${n >= i ? "bi-star-fill" : n >= i - 0.5 ? "bi-star-half" : "bi-star"}"></i>`;
    return `<span class="stars">${h}</span>`;
  };

  /* Vignette produit : remplacée côté Django par <img src="{{ produit.image_principale.url }}"> */
  const thumb = (p, size = "") =>
    `<div class="product-thumb ${size}" style="background:linear-gradient(135deg, ${p.couleur}, ${p.couleur}bb)"><i class="bi ${p.icone}"></i></div>`;
  const shopLogo = (s, extra = "") =>
    `<div class="shop-logo ${extra}" style="background:${s.couleur}">${initials(s.nom)}</div>`;

  /* ---------- Composants ---------- */
  function productCard(p, col = "col-6 col-md-4 col-xl-3") {
    const s = getShop(p.boutique_id);
    const d = discount(p);
    return `
    <div class="${col}">
      <div class="card product-card">
        <div class="p-2 position-relative">
          ${d ? `<span class="badge badge-promo">-${d}%</span>` : ""}
          ${p.stock === 0 ? `<span class="badge badge-stock bg-secondary">Rupture</span>` : p.stock <= 5 ? `<span class="badge badge-stock bg-warning text-dark">Plus que ${p.stock}</span>` : ""}
          <a href="${url("produit.html?id=" + p.id)}">${thumb(p)}</a>
          <button class="btn-wish shadow-sm" type="button" aria-label="Ajouter aux favoris" data-wish="${p.id}"><i class="bi bi-heart"></i></button>
        </div>
        <div class="card-body pt-1 d-flex flex-column">
          <a href="${url("boutique.html?id=" + s.id)}" class="shop-link"><i class="bi bi-shop me-1"></i>${esc(s.nom)}</a>
          <a href="${url("produit.html?id=" + p.id)}" class="product-name mt-1">${esc(p.nom)}</a>
          <div class="d-flex align-items-center gap-1 my-1">${stars(p.note)}<small class="text-muted">(${p.nb_avis})</small></div>
          <div class="mt-auto d-flex align-items-end justify-content-between gap-1">
            <div>
              <div class="price">${fmt(price(p))}</div>
              ${d ? `<div class="price-old">${fmt(p.prix)}</div>` : ""}
            </div>
            <button class="btn btn-sm btn-primary rounded-circle" type="button" data-add-cart="${p.id}" ${p.stock === 0 ? "disabled" : ""} aria-label="Ajouter au panier" title="Ajouter au panier">
              <i class="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }

  function shopCard(s, col = "col-sm-6 col-lg-4") {
    const cats = s.categories.map((id) => getCategory(id)?.nom).filter(Boolean).join(" · ");
    return `
    <div class="${col}">
      <div class="card shop-card h-100">
        <div class="shop-banner" style="background:linear-gradient(120deg, ${s.couleur}, ${s.couleur}88)"></div>
        <div class="card-body pt-0">
          <div class="d-flex align-items-end gap-3">
            ${shopLogo(s)}
            <div class="pb-1 min-w-0">
              <h6 class="mb-0 text-truncate">${esc(s.nom)} <i class="bi bi-patch-check-fill text-green" title="Boutique vérifiée"></i></h6>
              <small class="text-muted"><i class="bi bi-geo-alt"></i> ${esc(s.commune)}, ${esc(s.ville)}</small>
            </div>
          </div>
          <p class="text-muted small mt-3 mb-2">${esc(s.description)}</p>
          <div class="d-flex justify-content-between align-items-center small">
            <span>${stars(s.note)} <span class="text-muted">${s.note.toFixed(1)} (${s.nb_avis})</span></span>
            <span class="text-muted">${cats}</span>
          </div>
        </div>
        <div class="card-footer bg-white border-0 pt-0 pb-3">
          <a href="${url("boutique.html?id=" + s.id)}" class="btn btn-outline-primary btn-sm w-100">Visiter la boutique</a>
        </div>
      </div>
    </div>`;
  }

  /* ---------- Panier (localStorage) ----------
     Côté Django : modèles Panier / LignePanier liés au client,
     et le panier anonyme fusionné à la connexion. */
  const CART_KEY = "im_cart";
  const cart = {
    items() { return storage.get(CART_KEY, []); },
    save(items) { storage.set(CART_KEY, items); updateCartBadge(); },
    count() { return this.items().reduce((n, i) => n + i.quantite, 0); },
    add(produitId, quantite = 1, variante = "") {
      const p = getProduct(produitId);
      if (!p || p.stock === 0) { toast("Ce produit est en rupture de stock.", "danger"); return false; }
      const items = this.items();
      const key = `${p.id}|${variante}`;
      const line = items.find((i) => i.key === key);
      const newQty = (line ? line.quantite : 0) + quantite;
      if (newQty > p.stock) { toast(`Stock insuffisant : il reste ${p.stock} article(s).`, "warning"); return false; }
      if (line) line.quantite = newQty; else items.push({ key, produit_id: p.id, variante, quantite });
      this.save(items);
      toast(`<strong>${esc(p.nom)}</strong> ajouté au panier.`, "success", { href: url("panier.html"), label: "Voir le panier" });
      return true;
    },
    setQty(key, quantite) {
      const items = this.items();
      const line = items.find((i) => i.key === key);
      if (!line) return;
      const p = getProduct(line.produit_id);
      line.quantite = Math.max(1, Math.min(quantite, p.stock));
      if (quantite > p.stock) toast(`Stock maximum atteint (${p.stock}).`, "warning");
      this.save(items);
    },
    remove(key) { this.save(this.items().filter((i) => i.key !== key)); },
    clear() { this.save([]); },
    /* Regroupe les lignes par boutique -> préfigure les sous-commandes */
    groupByShop() {
      const groups = {};
      this.items().forEach((i) => {
        const p = getProduct(i.produit_id);
        if (!p) return;
        (groups[p.boutique_id] ||= { boutique: getShop(p.boutique_id), lignes: [], sous_total: 0 });
        const total = price(p) * i.quantite;
        groups[p.boutique_id].lignes.push({ ...i, produit: p, prix_unitaire: price(p), total, dispo: p.stock >= i.quantite });
        groups[p.boutique_id].sous_total += total;
      });
      return Object.values(groups);
    },
    total() { return this.groupByShop().reduce((t, g) => t + g.sous_total, 0); },
  };

  function updateCartBadge() {
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      const c = cart.count();
      el.textContent = c;
      el.classList.toggle("d-none", c === 0);
    });
  }

  /* ---------- Toasts ---------- */
  function toast(html, type = "success", action) {
    let box = document.getElementById("im-toasts");
    if (!box) {
      box = document.createElement("div");
      box.id = "im-toasts";
      box.className = "toast-container position-fixed bottom-0 end-0 p-3";
      document.body.appendChild(box);
    }
    const icons = { success: "bi-check-circle-fill text-success", danger: "bi-x-circle-fill text-danger", warning: "bi-exclamation-triangle-fill text-warning", info: "bi-info-circle-fill text-primary" };
    const el = document.createElement("div");
    el.className = "toast align-items-center bg-white border-0 shadow";
    el.setAttribute("role", "status");
    el.innerHTML = `<div class="d-flex"><div class="toast-body d-flex gap-2 align-items-start">
        <i class="bi ${icons[type] || icons.info} fs-5"></i><div>${html}${action ? `<div class="mt-1"><a href="${action.href}" class="fw-semibold">${action.label} →</a></div>` : ""}</div></div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Fermer"></button></div>`;
    box.appendChild(el);
    const t = new bootstrap.Toast(el, { delay: 3500 });
    el.addEventListener("hidden.bs.toast", () => el.remove());
    t.show();
  }

  /* ---------- En-tête public ---------- */
  function renderHeader() {
    const el = document.getElementById("site-header");
    if (!el) return;
    const unread = D.notifications.filter((n) => !n.lu).length;
    const cats = D.categories.filter((c) => c.actif);
    el.innerHTML = `
    <div class="flag-strip"></div>
    <div class="topbar py-1 d-none d-lg-block">
      <div class="container d-flex justify-content-between">
        <span><i class="bi bi-telephone me-1"></i>+225 27 20 00 00 00 · <i class="bi bi-truck ms-2 me-1"></i>Livraison partout en Côte d'Ivoire</span>
        <span class="d-flex gap-3">
          <a href="${url("auth/inscription-vendeur.html")}"><i class="bi bi-shop me-1"></i>Vendre sur IvoireMarket</a>
          <a href="${url("contact.html")}"><i class="bi bi-headset me-1"></i>Aide & contact</a>
          <span class="dropdown">
            <a href="#" class="dropdown-toggle" data-bs-toggle="dropdown"><i class="bi bi-grid me-1"></i>Espaces (démo)</a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="${url("vendeur/dashboard.html")}"><i class="bi bi-shop me-2"></i>Espace vendeur</a></li>
              <li><a class="dropdown-item" href="${url("administration/dashboard.html")}"><i class="bi bi-speedometer2 me-2"></i>Administration</a></li>
              <li><a class="dropdown-item" href="${url("livreur/dashboard.html")}"><i class="bi bi-truck me-2"></i>Espace livreur</a></li>
              <li><a class="dropdown-item" href="${url("support/dashboard.html")}"><i class="bi bi-headset me-2"></i>Service client</a></li>
            </ul>
          </span>
        </span>
      </div>
    </div>
    <nav class="site-navbar sticky-top">
      <div class="container py-2 py-lg-3">
        <div class="d-flex align-items-center gap-3 flex-wrap flex-lg-nowrap">
          <a class="brand-logo me-auto me-lg-3" href="${url("index.html")}"><i class="bi bi-bag-check-fill"></i> Ivoire<span>Market</span></a>
          <form class="search-bar input-group order-last order-lg-0 flex-grow-1" action="${url("catalogue.html")}" method="get" role="search">
            <input class="form-control" type="search" name="q" placeholder="Rechercher un produit, une boutique…" aria-label="Rechercher" value="${esc(param("q") || "")}">
            <button class="btn btn-primary px-3" type="submit" aria-label="Lancer la recherche"><i class="bi bi-search"></i></button>
          </form>
          <div class="d-flex align-items-center gap-1">
            <div class="dropdown">
              <a href="#" class="nav-icon-btn d-flex align-items-center gap-2" data-bs-toggle="dropdown" aria-label="Mon compte">
                <i class="bi bi-person-circle"></i><span class="d-none d-xl-inline fs-7 text-start lh-sm"><small class="text-muted d-block">Bonjour,</small>Mon compte</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end shadow">
                <li><a class="dropdown-item" href="${url("auth/connexion.html")}"><i class="bi bi-box-arrow-in-right me-2"></i>Connexion</a></li>
                <li><a class="dropdown-item" href="${url("auth/inscription.html")}"><i class="bi bi-person-plus me-2"></i>Créer un compte</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="${url("compte/profil.html")}"><i class="bi bi-person me-2"></i>Mon profil</a></li>
                <li><a class="dropdown-item" href="${url("compte/commandes.html")}"><i class="bi bi-receipt me-2"></i>Mes commandes</a></li>
                <li><a class="dropdown-item" href="${url("compte/reclamations.html")}"><i class="bi bi-chat-left-dots me-2"></i>Mes réclamations</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="${url("auth/connexion.html")}" data-logout><i class="bi bi-box-arrow-right me-2"></i>Déconnexion</a></li>
              </ul>
            </div>
            <a href="${url("compte/notifications.html")}" class="nav-icon-btn" aria-label="Notifications"><i class="bi bi-bell"></i>${unread ? `<span class="badge rounded-pill">${unread}</span>` : ""}</a>
            <a href="${url("panier.html")}" class="nav-icon-btn" aria-label="Panier"><i class="bi bi-cart3"></i><span class="badge rounded-pill d-none" data-cart-count>0</span></a>
          </div>
        </div>
      </div>
      <div class="cat-nav d-none d-md-block">
        <div class="container d-flex align-items-center">
          <div class="dropdown">
            <a class="nav-link fw-semibold bg-orange text-white px-3 rounded-0" href="#" data-bs-toggle="dropdown"><i class="bi bi-list me-1"></i> Toutes les catégories</a>
            <ul class="dropdown-menu shadow">
              ${cats.map((c) => `<li><a class="dropdown-item" href="${url("catalogue.html?categorie=" + c.id)}"><i class="bi ${c.icone} me-2 text-orange"></i>${c.nom}</a></li>`).join("")}
            </ul>
          </div>
          <div class="scroll-x d-flex">
            ${cats.map((c) => `<a class="nav-link" href="${url("catalogue.html?categorie=" + c.id)}">${c.nom}</a>`).join("")}
            <a class="nav-link" href="${url("boutiques.html")}"><i class="bi bi-shop me-1"></i>Boutiques</a>
            <a class="nav-link text-danger fw-semibold" href="${url("catalogue.html?promo=1")}"><i class="bi bi-lightning-charge-fill me-1"></i>Promotions</a>
          </div>
        </div>
      </div>
    </nav>`;
  }

  function renderFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML = `
    <section class="bg-white border-top py-4 mt-5">
      <div class="container"><div class="row g-4">
        <div class="col-6 col-lg-3 feature-box"><i class="bi bi-truck"></i><div><div class="fw-semibold">Livraison rapide</div><small class="text-muted">24 h à Abidjan</small></div></div>
        <div class="col-6 col-lg-3 feature-box"><i class="bi bi-phone-vibrate"></i><div><div class="fw-semibold">Mobile Money</div><small class="text-muted">Orange, MTN, Moov, Wave</small></div></div>
        <div class="col-6 col-lg-3 feature-box"><i class="bi bi-shield-check"></i><div><div class="fw-semibold">Paiement sécurisé</div><small class="text-muted">Aucune donnée carte stockée</small></div></div>
        <div class="col-6 col-lg-3 feature-box"><i class="bi bi-arrow-repeat"></i><div><div class="fw-semibold">Service client</div><small class="text-muted">Réclamations suivies</small></div></div>
      </div></div>
    </section>
    <footer class="site-footer pt-5 pb-3">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4">
            <a class="brand-logo text-white" href="${url("index.html")}"><i class="bi bi-bag-check-fill"></i> Ivoire<span>Market</span></a>
            <p class="mt-3 small">La marketplace ivoirienne qui réunit les meilleurs commerçants du pays sur une seule plateforme.</p>
            <div class="social d-flex gap-2">
              <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a><a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
              <a href="#" aria-label="TikTok"><i class="bi bi-tiktok"></i></a><a href="#" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
            </div>
          </div>
          <div class="col-6 col-lg-2"><h6>Acheter</h6><ul class="list-unstyled d-grid gap-2">
            <li><a href="${url("catalogue.html")}">Catalogue</a></li><li><a href="${url("boutiques.html")}">Boutiques</a></li>
            <li><a href="${url("catalogue.html?promo=1")}">Promotions</a></li><li><a href="${url("panier.html")}">Panier</a></li></ul></div>
          <div class="col-6 col-lg-2"><h6>Vendre</h6><ul class="list-unstyled d-grid gap-2">
            <li><a href="${url("auth/inscription-vendeur.html")}">Ouvrir ma boutique</a></li><li><a href="${url("vendeur/dashboard.html")}">Espace vendeur</a></li>
            <li><a href="#">Commissions</a></li></ul></div>
          <div class="col-6 col-lg-2"><h6>Aide</h6><ul class="list-unstyled d-grid gap-2">
            <li><a href="${url("contact.html")}">Nous contacter</a></li><li><a href="${url("compte/reclamations.html")}">Réclamations</a></li>
            <li><a href="#">Livraison</a></li><li><a href="#">Remboursements</a></li></ul></div>
          <div class="col-6 col-lg-2"><h6>Légal</h6><ul class="list-unstyled d-grid gap-2">
            <li><a href="#">CGU / CGV</a></li><li><a href="#">Confidentialité</a></li><li><a href="#">Mentions légales</a></li></ul></div>
        </div>
        <hr class="border-secondary my-4">
        <div class="d-flex flex-column flex-md-row justify-content-between small gap-2">
          <span>© ${new Date().getFullYear()} IvoireMarket — Abidjan, Côte d'Ivoire</span>
          <span>Prix en FCFA (XOF), TVA incluse</span>
        </div>
      </div>
    </footer>`;
  }

  /* ---------- Espaces : sidebar + topbar ---------- */
  const MENUS = {
    vendeur: {
      titre: "Espace vendeur", user: "Kouadio Serge", sous_titre: "Abidjan Tech",
      groupes: [
        { label: "Principal", items: [
          ["dashboard", "bi-speedometer2", "Tableau de bord", "vendeur/dashboard.html"],
          ["boutique", "bi-shop", "Ma boutique", "vendeur/boutique.html"]] },
        { label: "Catalogue", items: [
          ["produits", "bi-box-seam", "Mes produits", "vendeur/produits.html"],
          ["produit-form", "bi-plus-square", "Ajouter un produit", "vendeur/produit-form.html"]] },
        { label: "Ventes", items: [
          ["commandes", "bi-receipt", "Commandes", "vendeur/commandes.html", 3],
          ["revenus", "bi-wallet2", "Revenus & commissions", "vendeur/revenus.html"],
          ["avis", "bi-star", "Avis clients", "vendeur/avis.html"]] },
      ] },
    admin: {
      titre: "Administration", user: "Admin IvoireMarket", sous_titre: "Super administrateur",
      groupes: [
        { label: "Principal", items: [
          ["dashboard", "bi-speedometer2", "Tableau de bord", "administration/dashboard.html"],
          ["rapports", "bi-bar-chart-line", "Rapports & statistiques", "administration/rapports.html"]] },
        { label: "Comptes", items: [
          ["utilisateurs", "bi-people", "Utilisateurs", "administration/utilisateurs.html"],
          ["boutiques", "bi-shop-window", "Vendeurs & boutiques", "administration/boutiques.html", 1]] },
        { label: "Catalogue", items: [
          ["categories", "bi-tags", "Catégories", "administration/categories.html"],
          ["produits", "bi-box-seam", "Modération produits", "administration/produits.html", 1],
          ["avis", "bi-chat-square-quote", "Modération avis", "administration/avis.html", 1]] },
        { label: "Ventes", items: [
          ["commandes", "bi-receipt", "Commandes", "administration/commandes.html"],
          ["paiements", "bi-credit-card", "Paiements & remboursements", "administration/paiements.html", 1],
          ["commissions", "bi-percent", "Commissions & versements", "administration/commissions.html"],
          ["livraisons", "bi-truck", "Livraisons", "administration/livraisons.html"]] },
        { label: "Support", items: [
          ["reclamations", "bi-headset", "Réclamations", "support/dashboard.html", 1]] },
      ] },
    livreur: {
      titre: "Espace livreur", user: "Ibrahim Coulibaly", sous_titre: "Zone Cocody / Plateau",
      groupes: [{ label: "Livraisons", items: [
        ["dashboard", "bi-truck", "Mes livraisons", "livreur/dashboard.html", 2],
        ["historique", "bi-clock-history", "Historique", "livreur/historique.html"]] }] },
    support: {
      titre: "Service client", user: "Nadège Aka", sous_titre: "Agent support",
      groupes: [{ label: "Demandes", items: [
        ["dashboard", "bi-inbox", "Réclamations & litiges", "support/dashboard.html", 1],
        ["ticket", "bi-chat-dots", "Traiter une demande", "support/ticket.html?id=702"]] }] },
  };

  function renderDashboard() {
    const side = document.getElementById("dash-sidebar");
    if (!side) return;
    const role = document.body.dataset.role;
    const active = document.body.dataset.active;
    const m = MENUS[role];
    side.classList.add("dash-sidebar");
    side.innerHTML = `
      <div class="px-4 py-4 d-flex align-items-center justify-content-between">
        <a class="brand-logo fs-5" href="${url("index.html")}"><i class="bi bi-bag-check-fill"></i> Ivoire<span>Market</span></a>
        <button class="btn btn-sm text-white d-lg-none" data-sidebar-toggle aria-label="Fermer le menu"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="mx-3 mb-2 p-3 rounded-3" style="background:rgba(255,255,255,.05)">
        <div class="small text-uppercase" style="color:#7c8194;font-size:.68rem;letter-spacing:1px">${m.titre}</div>
        <div class="text-white fw-semibold">${m.sous_titre}</div>
      </div>
      ${m.groupes.map((g) => `
        <div class="side-label">${g.label}</div>
        <nav class="nav flex-column">
          ${g.items.map(([key, icon, label, href, badge]) =>
            `<a class="nav-link ${key === active ? "active" : ""}" href="${url(href)}"><i class="bi ${icon}"></i>${label}${badge ? `<span class="badge rounded-pill bg-orange">${badge}</span>` : ""}</a>`).join("")}
        </nav>`).join("")}
      <div class="side-label">Compte</div>
      <nav class="nav flex-column mb-4">
        <a class="nav-link" href="${url("index.html")}"><i class="bi bi-house"></i>Retour au site</a>
        <a class="nav-link" href="${url("auth/connexion.html")}" data-logout><i class="bi bi-box-arrow-right"></i>Déconnexion</a>
      </nav>`;

    const backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    backdrop.setAttribute("data-sidebar-toggle", "");
    document.body.appendChild(backdrop);

    const top = document.getElementById("dash-topbar");
    if (top) {
      top.classList.add("dash-topbar");
      top.innerHTML = `
      <div class="d-flex align-items-center gap-3 px-3 px-lg-4 py-3">
        <button class="btn btn-light d-lg-none" data-sidebar-toggle aria-label="Ouvrir le menu"><i class="bi bi-list"></i></button>
        <div class="min-w-0">
          <h1 class="h5 mb-0 fw-bold text-truncate">${esc(document.body.dataset.title || "")}</h1>
          ${document.body.dataset.subtitle ? `<small class="text-muted d-none d-sm-block">${esc(document.body.dataset.subtitle)}</small>` : ""}
        </div>
        <div class="ms-auto d-flex align-items-center gap-2">
          <div class="dropdown">
            <button class="btn btn-light position-relative" data-bs-toggle="dropdown" aria-label="Notifications"><i class="bi bi-bell"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-orange">3</span></button>
            <div class="dropdown-menu dropdown-menu-end shadow p-0" style="width:320px">
              <div class="p-3 border-bottom fw-semibold">Notifications</div>
              ${notifSamples(role).map((n) => `<a class="dropdown-item py-2 small text-wrap" href="#"><i class="bi ${n[0]} text-orange me-2"></i>${n[1]}<div class="text-muted ms-4" style="font-size:.72rem">${n[2]}</div></a>`).join("")}
            </div>
          </div>
          <div class="dropdown">
            <button class="btn btn-light d-flex align-items-center gap-2" data-bs-toggle="dropdown">
              <span class="avatar bg-orange" style="width:30px;height:30px;font-size:.72rem">${initials(m.user)}</span>
              <span class="d-none d-md-inline small fw-medium">${m.user}</span><i class="bi bi-chevron-down small"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow">
              <li><a class="dropdown-item" href="${url("compte/profil.html")}"><i class="bi bi-person me-2"></i>Mon profil</a></li>
              <li><a class="dropdown-item" href="${url("index.html")}"><i class="bi bi-house me-2"></i>Voir le site</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="${url("auth/connexion.html")}" data-logout><i class="bi bi-box-arrow-right me-2"></i>Déconnexion</a></li>
            </ul>
          </div>
        </div>
      </div>`;
    }

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-sidebar-toggle]")) {
        side.classList.toggle("show");
        backdrop.classList.toggle("show");
      }
    });
  }

  /* ---------- Menu de l'espace client (compte/*) ---------- */
  function renderAccountNav() {
    const el = document.getElementById("account-nav");
    if (!el) return;
    const active = document.body.dataset.active;
    const unread = D.notifications.filter((n) => !n.lu).length;
    const items = [
      ["profil", "bi-person", "Mon profil", "compte/profil.html"],
      ["commandes", "bi-receipt", "Mes commandes", "compte/commandes.html"],
      ["notifications", "bi-bell", "Notifications", "compte/notifications.html", unread],
      ["reclamations", "bi-chat-left-dots", "Réclamations", "compte/reclamations.html"],
    ];
    el.innerHTML = `
      <div class="card">
        <div class="card-body d-flex align-items-center gap-3 border-bottom">
          <span class="avatar bg-orange" style="width:48px;height:48px">AK</span>
          <div><div class="fw-semibold">Aya Konan</div><small class="text-muted">Client depuis 2025</small></div>
        </div>
        <div class="list-group list-group-flush">
          ${items.map(([k, i, l, h, b]) => `<a href="${url(h)}" class="list-group-item list-group-item-action d-flex align-items-center gap-2 ${k === active ? "active bg-orange border-0" : ""}">
            <i class="bi ${i}"></i>${l}${b ? `<span class="badge rounded-pill ${k === active ? "bg-white text-orange" : "bg-orange"} ms-auto">${b}</span>` : ""}</a>`).join("")}
          <a href="${url("auth/connexion.html")}" class="list-group-item list-group-item-action text-danger" data-logout><i class="bi bi-box-arrow-right me-2"></i>Déconnexion</a>
        </div>
      </div>`;
  }

  function notifSamples(role) {
    return {
      vendeur: [["bi-bag-plus", "Nouvelle sous-commande #2056 (385 000 FCFA)", "Il y a 1 h"], ["bi-star", "Nouvel avis 5★ sur Smartphone Tecno", "Il y a 3 h"], ["bi-exclamation-triangle", "Power bank 20 000 mAh en rupture", "Hier"]],
      admin: [["bi-shop", "Nouvelle boutique à valider : Mode Plateau", "Il y a 6 jours"], ["bi-flag", "Avis signalé comme abusif", "Il y a 8 jours"], ["bi-credit-card", "Paiement échoué IM-2026-001022", "Il y a 6 jours"]],
      livreur: [["bi-truck", "Nouvelle livraison affectée #2051", "Il y a 2 h"], ["bi-geo-alt", "Adresse modifiée pour #2047", "Hier"], ["bi-check2", "Livraison #2040 confirmée", "Il y a 2 jours"]],
      support: [["bi-inbox", "Nouvelle réclamation REC-0702", "Il y a 1 jour"], ["bi-chat-dots", "Réponse client sur REC-0701", "Il y a 11 jours"], ["bi-flag", "Litige escaladé par un vendeur", "Il y a 3 jours"]],
    }[role] || [];
  }

  /* ---------- Formulaires ----------
     .needs-validation : validation HTML5 + styles Bootstrap.
     data-demo-message : message affiché à la soumission (démo).
     data-demo-redirect : redirection après soumission (démo).
     Côté Django : retirer ces attributs, le formulaire sera
     posté normalement (method="post" + {% csrf_token %}). */
  function initForms() {
    document.querySelectorAll("form.needs-validation").forEach((form) => {
      form.addEventListener("submit", (e) => {
        // Vérification de la confirmation de mot de passe si présente
        const pwd = form.querySelector("[data-password]");
        const confirm = form.querySelector("[data-password-confirm]");
        if (pwd && confirm) confirm.setCustomValidity(pwd.value === confirm.value ? "" : "Les mots de passe ne correspondent pas.");

        if (!form.checkValidity()) {
          e.preventDefault(); e.stopPropagation();
          form.classList.add("was-validated");
          form.querySelector(":invalid")?.focus();
          return;
        }
        if (form.dataset.demoMessage !== undefined) {
          e.preventDefault();
          form.classList.remove("was-validated");
          toast(esc(form.dataset.demoMessage || "Enregistré avec succès."), "success");
          if (form.dataset.demoRedirect) setTimeout(() => (location.href = url(form.dataset.demoRedirect)), 1200);
          else if (form.dataset.demoReset !== undefined) form.reset();
          const modal = form.closest(".modal");
          if (modal) bootstrap.Modal.getInstance(modal)?.hide();
        }
      });
    });

    // Afficher / masquer le mot de passe
    document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = btn.closest(".input-group").querySelector("input");
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.innerHTML = `<i class="bi ${show ? "bi-eye-slash" : "bi-eye"}"></i>`;
      });
    });

    // Aperçu des images (logo, bannière, photos produit)
    document.querySelectorAll("input[type=file][data-preview]").forEach((input) => {
      input.addEventListener("change", () => {
        const target = document.querySelector(input.dataset.preview);
        if (!target) return;
        target.innerHTML = "";
        [...input.files].slice(0, 8).forEach((f) => {
          if (!f.type.startsWith("image/")) return;
          const img = document.createElement("img");
          img.src = URL.createObjectURL(f);
          img.alt = f.name;
          img.onload = () => URL.revokeObjectURL(img.src);
          target.appendChild(img);
        });
      });
    });
  }

  /* Filtre texte simple sur un tableau : <input data-table-filter="#maTable"> */
  function initTableFilters() {
    document.querySelectorAll("[data-table-filter]").forEach((input) => {
      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        document.querySelectorAll(input.dataset.tableFilter + " tbody tr").forEach((tr) => {
          tr.classList.toggle("d-none", q !== "" && !tr.textContent.toLowerCase().includes(q));
        });
      });
    });
  }

  /* Actions de démonstration : <button data-demo-action="Message"> */
  function initDemoActions() {
    document.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add-cart]");
      if (add) { e.preventDefault(); cart.add(Number(add.dataset.addCart)); return; }

      const wish = e.target.closest("[data-wish]");
      if (wish) {
        e.preventDefault();
        const icon = wish.querySelector("i");
        const on = icon.classList.toggle("bi-heart-fill");
        icon.classList.toggle("bi-heart", !on);
        wish.classList.toggle("text-danger", on);
        toast(on ? "Ajouté à vos favoris." : "Retiré de vos favoris.", "info");
        return;
      }

      const act = e.target.closest("[data-demo-action]");
      if (act) {
        e.preventDefault();
        if (act.dataset.confirm && !window.confirm(act.dataset.confirm)) return;
        toast(esc(act.dataset.demoAction), act.dataset.type || "success");
        if (act.dataset.status) {
          const row = act.closest("tr, .list-group-item, .card");
          const cell = row?.querySelector("[data-status-cell]");
          if (cell) cell.innerHTML = statusBadge(act.dataset.status);
        }
        return;
      }

      if (e.target.closest("[data-logout]")) {
        toast("Vous êtes déconnecté(e).", "info");
      }
    });
  }

  /* ---------- Calculs commandes / commissions ----------
     Côté Django, ces montants sont calculés et HISTORISÉS en base
     (prix_unitaire figé dans LigneCommande, commission dans Commission). */
  const subTotal = (sc) => sc.lignes.reduce((t, l) => t + l.prix_unitaire * l.quantite, 0);
  const orderSubtotal = (c) => c.sous_commandes.reduce((t, sc) => t + subTotal(sc), 0);
  const orderTotal = (c) => orderSubtotal(c) + c.frais_livraison;
  const commission = (montant, taux = D.COMMISSION_RATE) => Math.round(montant * taux);
  /* Sous-commandes à plat (avec leur commande parente).
     shopId fourni => filtre vendeur : Django SousCommande.objects.filter(boutique__vendeur=request.user) */
  function subOrders(shopId) {
    const out = [];
    D.commandes.forEach((c) => c.sous_commandes.forEach((sc) => {
      if (shopId && sc.boutique_id !== Number(shopId)) return;
      const montant = subTotal(sc);
      const com = ["cancelled"].includes(sc.statut) ? 0 : commission(montant);
      out.push({ commande: c, sc, boutique: getShop(sc.boutique_id), montant, commission: com, net: montant - com });
    }));
    return out.sort((a, b) => b.commande.date.localeCompare(a.commande.date));
  }
  const STEPS = ["confirmed", "processing", "shipped", "delivered"];
  const STEP_LABELS = { confirmed: "Commande confirmée", processing: "En préparation chez le vendeur", shipped: "Remise au livreur", delivered: "Livrée" };
  function timeline(statut) {
    if (["cancelled", "failed"].includes(statut)) return `<div class="alert alert-danger small py-2 mb-0"><i class="bi bi-x-circle me-1"></i>${STATUS[statut]}</div>`;
    const idx = statut === "pending" ? -1 : STEPS.indexOf(statut);
    return `<ul class="timeline small mb-0">${STEPS.map((s, i) => `<li class="${i < idx || (i === idx && s === "delivered") ? "done" : i === idx ? "current" : ""}">
      <span class="tl-dot">${i <= idx ? '<i class="bi bi-check"></i>' : ""}</span>${STEP_LABELS[s]}</li>`).join("")}</ul>`;
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    renderDashboard();
    renderAccountNav();
    updateCartBadge();
    initForms();
    initTableFilters();
    initDemoActions();
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el));
  });

  window.IM = {
    D, url, fmt, esc, param, initials, price, discount, stars, thumb, shopLogo, statusBadge, STATUS,
    getProduct, getShop, getCategory, getZone, getLivreur, productCard, shopCard, cart, toast, storage, updateCartBadge,
    subTotal, orderSubtotal, orderTotal, commission, timeline, subOrders,
  };
})();
