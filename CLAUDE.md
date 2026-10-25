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

- **Type d'app** : Static (`clever create --type static`), gabarit pico ou nano suffisant (aucun processus applicatif)
- **App** : créée à la demande ; aucune instance de démo n'est maintenue en service
- **Build** : `vite build` en local → `dist/` **committé** ; aucun build côté plateforme (pas de `CC_BUILD_COMMAND`, aucun SSG détecté : Vite n'est pas dans la liste de l'auto-build)
- **Serveur** : Static Web Server (SWS) sert `dist/` ; aucun add-on

### Variables Clever à poser (une fois)

| Variable | Valeur | Preuve doc |
|---|---|---|
| `CC_WEBROOT` | `/dist` | runtime Static : « set the CC_WEBROOT environment variable, relative to the root of your project » |
| `CC_PRE_RUN_HOOK` | `./scripts/write-config.sh` | hooks : « This hook runs every time. » et « Hooks have access to the environnement variables » |
| `CC_OVERRIDE_BUILDCACHE` | `dist:scripts` | runtime Static : « if you define CC_WEBROOT, the build cache contains only some configuration files and the served directory » → sans elle, le script du hook manquerait lors d'un `clever restart` depuis le cache |
| `CC_HEALTH_CHECK_PATH` | `/config.json` | « If these paths don't return a 2xx response code, the deployment fails. » |
| `CC_GIT_FULL_CLONE` | `false` | référence : « If set to false, the git repository is cloned with --depth 1 to speed up the deployment » (l'historique de `dist/` alourdit le clone) |

```bash
clever env set CC_WEBROOT /dist
clever env set CC_PRE_RUN_HOOK ./scripts/write-config.sh
clever env set CC_OVERRIDE_BUILDCACHE dist:scripts
clever env set CC_HEALTH_CHECK_PATH /config.json
clever env set CC_GIT_FULL_CLONE false
```

Inutiles ici : `CC_CACHE_DEPENDENCIES` (aucune dépendance installée sur la plateforme), `CC_BUILD_COMMAND`.

### Variables de démo (lues par l'app via `dist/config.json`)

| Variable | Défaut | Effet visible |
|---|---|---|
| `APP_ENV` | `local` | pastille du dossard ; fond blanc si `production` |
| `ANNOUNCEMENT` | vide | bandeau dégradé sous la topbar si non vide |
| `CLUB_NAME` | `RunRank Club` | bandeau du dossard + phrase « Objectif <club> … » |
| `GOAL_PACE` | `5:00` | drapeau « Objectif » sur la piste des rangs, verdict tenu / à gagner, temps cible du bracelet. Format `m:ss` entre 2:00 et 12:00, sinon défaut + mention « valeur invalide ignorée » |

Variables plateforme affichées (dossard) : `INSTANCE_NUMBER` (numéro du dossard), `CC_PRETTY_INSTANCE_NAME`, `CC_APP_NAME`, `INSTANCE_TYPE`, `CC_COMMIT_ID`, `CC_DEPLOYMENT_ID` ; `APP_ID` présent ⇒ pastille « Live on Clever Cloud ». En local : « injecté au déploiement ».

**Pourquoi un hook** : une app statique ne voit pas les variables d'environnement. `scripts/write-config.sh` (sh, tr, sed, date : aucune dépendance) écrit `dist/config.json` avant chaque démarrage ; React le lit avec `fetch(..., { cache: "no-store" })`, ce qui contourne le cache HTTP de SWS (1 an sur js/css). Le fichier committé `public/config.json` → `dist/config.json` (valeurs vides) sert de repli ; fichier absent ou invalide ⇒ défauts, la page s'affiche quand même.

### Fichiers
```
index.html               → entrée SOURCE Vite (CSP meta : connect-src 'self' autorise le fetch de config.json)
public/config.json       → config par défaut (copiée dans dist/ au build)
scripts/write-config.sh  → hook CC_PRE_RUN_HOOK : variables → dist/config.json
dist/                    → build servi (committé)
```

> ⚠️ Le runtime Static ne lit **pas** `clevercloud/static.json` : seul `CC_WEBROOT` fixe le dossier servi.
> Ne jamais créer de `config.toml` à la racine (déclenche l'auto-build Zola).

---

## 🛠️ Stack

| Élément | Valeur |
|---|---|
| React | 18.3.x |
| TypeScript | 6.0.x |
| Vite | 8.x (`^8.0.3` ; 8.2.2 verrouillé dans `package-lock.json`) |
| Tailwind CSS | 4.x (utilitaires ; tokens mappés sur `--cc-*` dans `src/styles/theme.css`) |
| Design | Clever Brand Kit (Plus Jakarta Sans, navy #13172e, dégradé Clever) — `src/styles/cc-brand.css` |
| Icônes | lucide-react |

---

## 📁 Structure clé

```
index.html                                → entrée Vite source
src/main.tsx                              → montage React + import src/styles/index.css
src/app/App.tsx                           → page : topbar → bandeau ANNOUNCEMENT → allure + piste + bracelet | dossard → certification → section Variables (config.json) → footer
src/app/config.ts                         → lecture de /config.json (fetch no-store), parsing robuste, défauts
src/app/components/PaceTrack.tsx          → piste des 9 rangs, marqueur « Toi » et drapeau GOAL_PACE
src/app/components/RaceBib.tsx            → dossard : instance, APP_ENV, CLUB_NAME, GOAL_PACE, variables plateforme
src/app/components/clever/CleverLogo.tsx  → logo officiel Clever Cloud (SVG inline JSX)
src/app/components/clever/CleverBadge.tsx → médaillon « Certified · Clever Cloud · Academy »
src/app/components/clever/CleverTopbar.tsx→ barre de marque (nom démo, pill stack, live/local, Se certifier)
src/app/components/clever/CleverCert.tsx  → bloc certification complet (2 parcours + CTA)
src/app/components/clever/CleverFooter.tsx→ pied de page plateforme (doc Static, Console, Academy, GitHub)
src/app/components/DistanceSelector.tsx   → sélecteur de distance
src/app/components/RankBadge.tsx          → couleurs et messages des rangs
src/app/utils/calculations.ts             → allure, rang, percentile, échelle de la piste, points de passage
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

# Prévisualiser le build en local (usage local uniquement, pas un serveur de production)
npm run preview
```

> Aucun script `start` : l'app n'a pas de processus serveur. Le runtime Static sert `dist/` tel quel et n'exécute aucun script npm.

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
- Ordre des blocs : topbar → bandeau → premier écran (allure géante, piste des rangs, bracelet d'allure, dossard) → bloc certification → section Variables → footer. Le premier écran montre le produit, pas un héro marketing.
- Textes UI en français ; couleurs via les tokens `--cc-*` ; polices Plus Jakarta Sans / JetBrains Mono chargées par le `<head>` de `index.html`.
- Les couleurs des rangs (`RankBadge.tsx`) sont propres au jeu RunRank et restent inchangées.

---

## ⚠️ Points de vigilance

- `dist/` est généré par Vite et **doit être committé** ; `assets/` et `index.html` buildés ne sont plus à la racine
- `CC_WEBROOT=/dist` doit être posé sur l'app, sinon la racine (index.html source) est servie → page blanche
- `src/vite-env.d.ts` référence `vite/client` pour que `npx tsc -p tsconfig.app.json --noEmit` passe (import CSS side-effect)
- Les polices Google Fonts sont chargées via `<link>` dans `index.html` (repli `system-ui` / `ui-monospace`)
- SWS met `index.html` en cache 1 jour : après un **redéploiement**, faire un rechargement forcé. Un `clever restart` (variables) ne pose pas ce problème, `config.json` étant lu sans cache
- `npm run preview` renvoie `index.html` pour un fichier absent (repli SPA) : le JSON invalide est ignoré, défauts appliqués ; SWS renvoie 404, même effet

---

## 🎬 Scénario vidéo

1. Ouvrir l'app : « Votre 10 km en 48:30, c'est 4:51 /km », rang Platinum, dossard 001 pour l'instance #0 (INSTANCE_NUMBER + 1).
2. Changer la distance / le temps : l'allure, la piste et le bracelet suivent en direct. Lien partageable `?d=42.195&t=2:59:30`.
3. Console Clever → Variables : poser `ANNOUNCEMENT`, `CLUB_NAME="Les Foulées Nantaises"`, `GOAL_PACE=4:30`, `APP_ENV=production`.
4. `clever restart`, recharger : bandeau, nom du club sur le dossard, drapeau déplacé (« encore 21 s/km à gagner »), pastille production, pied du dossard « écrit par CC_PRE_RUN_HOOK à hh:mm:ss ».
5. Descendre au bloc certification (bouton « Se certifier Clever Cloud ↓ ») puis à la section Variables qui affiche le `config.json` servi.

### Tester les variables en local

```bash
npm run build
APP_ENV=production ANNOUNCEMENT="Démo live" CLUB_NAME="Les Foulées Nantaises" GOAL_PACE=4:30 \
  INSTANCE_NUMBER=1 APP_ID=app_demo sh scripts/write-config.sh   # écrit dist/config.json
npx vite preview --port 8102
npm run build   # remet le dist/config.json par défaut avant de committer
```

---

## 🔍 Diagnostic rapide

| Symptôme | Cause probable | Correction |
|---|---|---|
| Page blanche en prod | `CC_WEBROOT` absent → racine servie (index.html source) | `clever env set CC_WEBROOT /dist` + redéploiement |
| Assets 404 | `dist/` non committé | `npm run build` + `git add dist/` + push |
| Modifications non visibles | Oubli du `npm run build` avant push | Toujours builder avant de pusher |
| Variables sans effet | `CC_PRE_RUN_HOOK` absent ou script non exécutable | `clever env set CC_PRE_RUN_HOOK ./scripts/write-config.sh` ; vérifier « write-config: … écrit » dans `clever logs` |
| Déploiement KO après `clever restart` | script absent du cache de build | `clever env set CC_OVERRIDE_BUILDCACHE dist:scripts` |
| Style cassé / fond blanc | `cc-brand.css` non importé dans `src/styles/index.css` | Vérifier l'ordre des `@import` (cc-brand en premier) |
