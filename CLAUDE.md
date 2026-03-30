# 🧠 Claude.md — demo-react-vite

## 🎯 Contexte du projet

App React + Vite de classement de course à pied **RunRank**.
L'utilisateur saisit une distance (5k, 10k, semi, marathon) et un temps, l'app calcule l'allure et attribue un rang (Iron → Challenger) avec un score percentile.
App 100% statique — pas de backend, pas d'API, tout est calculé côté client.

Déployée sur **Clever Cloud** (runtime Static).

---

## ☁️ Déploiement Clever Cloud

- **Type d'app** : Static
- **URL** : https://app-56896d45-3c0a-4305-8513-8b351c9f41b1.cleverapps.io/
- **Webroot** : racine du repo (`/`) — Clever Cloud sert directement les fichiers à la racine
- **Build** : Vite builde directement à la racine (`outDir: '.'`) — le `index.html` et `assets/` sont committés

### Fichiers Clever Cloud
```
clevercloud/static.json   → webroot: / (racine)
index.html                → version buildée (générée par Vite, commitée)
assets/                   → JS et CSS compilés (committés)
```

> ⚠️ Le `clevercloud/static.json` avec `webroot: /dist` n'était pas respecté.
> Solution retenue : builder Vite directement à la racine avec `outDir: '.'`.

---

## 🛠️ Stack

| Élément | Valeur |
|---|---|
| React | 18.x |
| TypeScript | 5.x |
| Vite | 6.x |
| Tailwind CSS | 4.x |
| UI components | shadcn/ui (non utilisés dans l'app principale) |
| Icônes | lucide-react |
| Utilitaires CSS | clsx + tailwind-merge |

---

## 📁 Structure clé

```
src/app/App.tsx                          → composant principal
src/app/components/DistanceSelector.tsx  → sélecteur de distance
src/app/components/ResultCard.tsx        → carte de résultat
src/app/components/RankBadge.tsx         → badge de rang avec config des rangs
src/app/utils/calculations.ts           → logique de calcul (allure, rang, percentile)
src/styles/                             → CSS (Tailwind, thème, fonts)
vite.config.ts                          → build vers racine (outDir: '.')
assets/                                 → build compilé (commité)
index.html                              → build compilé (commité)
```

---

## ⚙️ Commandes utiles

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Builder pour la production (met à jour index.html et assets/ à la racine)
npm run build

# Prévisualiser le build en local
npm run preview
```

---

## 🚀 Déployer une modification

```bash
# 1. Builder (obligatoire — met à jour index.html et assets/ à la racine)
npm run build

# 2. Commiter les fichiers modifiés + le build
git add .
git commit -m "description"
git push
```

> ⚠️ **Ne pas oublier le `npm run build` avant chaque push.**
> Sans ça, Clever Cloud sert l'ancienne version buildée.

---

## ⚠️ Points de vigilance

- Le dossier `assets/` et `index.html` à la racine sont générés par Vite et **doivent être committés**
- Les composants `src/app/components/ui/` (shadcn) ne sont pas utilisés dans l'app — ils génèrent des erreurs TypeScript si `tsc` est lancé (dépendances radix-ui manquantes). Le build utilise `vite build` sans `tsc -b` pour cette raison
- `outDir: '.'` génère un warning Vite (normal, sans impact)
- La typo Google Fonts (Inter) est chargée via CDN dans `src/styles/fonts.css`

---

## 🔍 Diagnostic rapide

| Symptôme | Cause probable | Correction |
|---|---|---|
| Page blanche | `index.html` à la racine = version source (non buildée) | `npm run build` + push |
| Assets 404 | Build non commité | `git add assets/ index.html` + push |
| Erreurs TypeScript au build | Composants shadcn non installés | Normal — le build utilise `vite build` sans `tsc` |
| Modifications non visibles | Oubli du `npm run build` avant push | Toujours builder avant de pusher |
