// App statique : aucune variable d'environnement serveur n'est disponible côté client.
// On déduit « live / local » de l'hôte courant, ce qui suffit pour la démo.

const LOCAL_HOSTS = /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/;

export function isLiveOnCleverCloud(): boolean {
  if (typeof window === "undefined") return false;
  return !LOCAL_HOSTS.test(window.location.hostname);
}
