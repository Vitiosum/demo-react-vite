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

Déployée sur **Clever Cloud** (runtime Static), habillée avec le **Clever Brand Kit** (certification Clever Cloud mise en avant).

---

## ☁️ Déploiement Clever Cloud

- **Type d'app** : Static
- **App ID** : `app_56896d45-3c0a-4305-8513-8b351c9f41b1`
- **URL** : https://app-56896d45-3c0a-4305-8513-8b351c9f41b1.cleverapps.io/
- **Webroot** : `dist/`, réglé par la variable d'environnement `CC_WEBROOT=/dist` (à poser une fois sur l'app)
- **Build** : `vite build` en local → `dist/` **committé** ; aucun build côté plateforme

```bash
# Une seule fois, sur l'app Clever Cloud
clever env set CC_WEBROOT /dist
```

### Fichiers
```
index.html          → entrée SOURCE Vite (head snippet brand kit + /src/main.tsx)
dist/index.html     → version buildée (générée par Vite, committée)
dist/assets/        → JS et CSS compilés (committés)
```

> ⚠️ Le runtime Static ne lit **pas** `clevercloud/static.json` (supprimé) : seul `CC_WEBROOT` fixe le dossier servi.
> Ne pas utiliser `CC_BUILD_COMMAND` (disponibilité de Node dans l'image Static non vérifiée).

---

## 🛠️ Stack

| Élément | Valeur |
|---|---|
| React | 18.3.x |
| TypeScript | 6.0.x |
| Vite | 8.0.x |
| Tailwind CSS | 4.x (utilitaires ; tokens mappés sur `--cc-*` dans `src/styles/theme.css`) |
| Design | Clever Brand Kit (Plus Jakarta Sans, navy #13172e, dégradé Clever) — `src/styles/cc-brand.css` |
| Icônes | lucide-react |
| Utilitaires CSS | clsx + tailwind-merge (présents, non utilisés dans l'app) |

---

## 📁 Structure clé

```
index.html                                → entrée Vite source
src/main.tsx                              → montage React + import src/styles/index.css
src/app/App.tsx                           → page : topbar → héro → calculateur → certification → panneau Static → footer
src/app/components/clever/CleverLogo.tsx  → logo officiel Clever Cloud (SVG inline JSX)
src/app/components/clever/CleverBadge.tsx → médaillon « Certified · Clever Cloud · Academy »
src/app/components/clever/CleverTopbar.tsx→ barre de marque (nom démo, pill stack, live/local, Se certifier)
src/app/components/clever/CleverCert.tsx  → bloc certification complet (2 parcours + CTA)
src/app/components/clever/CleverFooter.tsx→ pied de page plateforme (doc Static, Console, Academy, GitHub)
src/app/components/clever/platform.ts     → détection live/local via l'hôte (pas d'env serveur en statique)
src/app/components/DistanceSelector.tsx   → sélecteur de distance
src/app/components/ResultCard.tsx         → carte de résultat
src/app/components/RankBadge.tsx          → badge de rang (couleurs propres aux rangs conservées)
src/app/utils/calculations.ts             → logique de calcul (allure, rang, percentile)
src/styles/cc-brand.css                   → kit partagé, copié tel quel — NE PAS MODIFIER
src/styles/index.css                      → styles spécifiques RunRank (classes rr-*)
src/styles/fonts.css / theme.css          → alias polices et pont Tailwind → tokens --cc-*
vite.config.ts                            → build vers dist/ (emptyOutDir)
dist/                                     → build compilé (committé)
docs/superpowers/specs/                   → spec design Clever Brand Kit
```

---

## ⚙️ Commandes utiles

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Builder pour la production (régénère dist/)
npm run build

# Prévisualiser le build en local
npm run preview
```

---

## 🚀 Déployer une modification

```bash
# 1. Builder (obligatoire — régénère dist/)
npm run build

# 2. Commiter les fichiers modifiés + le build
git add .
git commit -m "description"
git push
```

> ⚠️ **Ne pas oublier le `npm run build` avant chaque push.**
> Sans ça, Clever Cloud sert l'ancienne version buildée.

---

## 🎨 Règles de design

- Le kit `src/styles/cc-brand.css` est partagé entre les démos : ne pas l'éditer, ajouter les styles propres dans `src/styles/index.css`.
- Ordre des blocs à conserver : topbar → héro → calculateur → bloc certification → panneau « Runtime Static » → footer.
- Textes UI en français ; couleurs via les tokens `--cc-*` ; polices Plus Jakarta Sans / JetBrains Mono chargées par le `<head>` de `index.html`.
- Les couleurs des rangs (`RankBadge.tsx`) sont propres au jeu RunRank et restent inchangées.

---

## ⚠️ Points de vigilance

- `dist/` est généré par Vite et **doit être committé** ; `assets/` et `index.html` buildés ne sont plus à la racine
- `CC_WEBROOT=/dist` doit être posé sur l'app, sinon la racine (index.html source) est servie → page blanche
- `src/vite-env.d.ts` référence `vite/client` pour que `npx tsc -p tsconfig.app.json --noEmit` passe (import CSS side-effect)
- Les polices Google Fonts sont chargées via `<link>` dans `index.html` (repli `system-ui` / `ui-monospace`)

---

## 🔍 Diagnostic rapide

| Symptôme | Cause probable | Correction |
|---|---|---|
| Page blanche en prod | `CC_WEBROOT` absent → racine servie (index.html source) | `clever env set CC_WEBROOT /dist` + redéploiement |
| Assets 404 | `dist/` non committé | `npm run build` + `git add dist/` + push |
| Modifications non visibles | Oubli du `npm run build` avant push | Toujours builder avant de pusher |
| Style cassé / fond blanc | `cc-brand.css` non importé dans `src/styles/index.css` | Vérifier l'ordre des `@import` (cc-brand en premier) |
