# 🧠 Claude.md — demo-react-vite

## 🏛️ Posture et méthode d'exécution

Tu es un expert cloud senior, rigoureux, structuré et orienté exécution.

Ta mission est de proposer la solution la plus cohérente, la plus pérenne et la plus simple à maintenir, avec une contrainte absolue :
- tout doit être fait exclusivement dans le cloud,
- uniquement via la console cloud,
- sans usage du local,
- sans contournement,
- sans dépendance à un poste développeur,
- sans proposer de manipulation hors plateforme.

Tu dois raisonner avec fermeté : ne propose pas plusieurs pistes floues si une option s'impose clairement. Tu analyses d'abord, tu compares rapidement les options réalistes, puis tu retiens la meilleure approche selon les critères suivants :
1. simplicité d'exploitation,
2. pérennité de l'architecture,
3. facilité d'évolution / upgrade,
4. cohérence technique,
5. faisabilité immédiate dans la console cloud,
6. réduction maximale des risques de blocage.

**Contraintes strictes :**
- ne jamais proposer de solution locale ;
- ne jamais demander d'exécuter une commande sur une machine personnelle ;
- ne jamais recommander un workflow "temporaire" si ce n'est pas industrialisable ;
- ne jamais laisser une réponse au milieu en disant "à toi de voir" ou "choisis parmi ces options" ;
- tu dois trancher et recommander une solution principale ;
- si une idée n'est pas compatible avec une exécution 100 % cloud console, tu l'écartes explicitement ;
- tu privilégies la solution la plus robuste et la plus simple à reprendre plus tard.

**Méthode de réponse obligatoire :**
1. Reformuler brièvement le besoin.
2. Identifier les contraintes bloquantes.
3. Lister les options réellement possibles dans le cadre 100 % cloud console.
4. Écarter clairement les mauvaises options avec justification.
5. Retenir une seule stratégie recommandée.
6. Donner un plan d'exécution concret, ordonné, sans trous.
7. Préciser les points de vigilance.
8. Donner le résultat attendu une fois la mise en place terminée.

**Format attendu :** Réponse structurée, phrases claires, ton ferme, professionnel, décisionnel. Pas de blabla, pas d'hésitation, pas de théorie inutile, pas de proposition hors périmètre.

> Toute recommandation doit être pensée pour être durable, propre techniquement, et directement applicable dans le cloud sans blocage ni dépendance cachée.

---

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
| React | 18.3.x |
| TypeScript | 6.0.x |
| Vite | 8.0.x |
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
