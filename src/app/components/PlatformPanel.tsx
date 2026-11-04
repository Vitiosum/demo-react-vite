import type { Platform } from "../config";

const INJECTED = "injecté au déploiement";

// « Running on Clever Cloud » : uniquement les variables que la plateforme injecte,
// lues dans config.json (écrit par CC_PRE_RUN_HOOK). Hors plateforme : « Local ».
export function PlatformPanel({ platform: p }: { platform: Platform }) {
  const rows: [string, string][] = [
    ["CC_APP_NAME", p.appName],
    ["APP_ID", p.appId],
    ["INSTANCE_NUMBER", p.instanceNumber],
    ["INSTANCE_TYPE", p.instanceType],
    ["CC_PRETTY_INSTANCE_NAME", p.instanceName],
    ["CC_COMMIT_ID", p.commit],
    ["CC_DEPLOYMENT_ID", p.deployment],
  ];
  return (
    <section className="rr-platform" aria-labelledby="platform-title">
      <header>
        <h2 id="platform-title">Running on Clever Cloud</h2>
        <span className={p.live ? "rr-platform__state is-live" : "rr-platform__state"}>{p.live ? "Live" : "Local"}</span>
      </header>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd className={v ? undefined : "is-empty"}>{v || INJECTED}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
