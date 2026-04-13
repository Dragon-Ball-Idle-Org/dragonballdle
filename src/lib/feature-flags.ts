import * as LaunchDarkly from "@launchdarkly/node-server-sdk";

export type FeatureFlags = {
  "show-silhouette": boolean;
};

export const ANONYMOUS_CONTEXT: LaunchDarkly.LDContext = {
  kind: "user",
  key: "anonymous",
  anonymous: true,
};

let ldClient: LaunchDarkly.LDClient | null = null;
let initPromise: Promise<LaunchDarkly.LDClient | null> | null = null;

async function getLDClient(): Promise<LaunchDarkly.LDClient | null> {
  const sdkKey = process.env.LD_SDK_KEY;

  if (!sdkKey || sdkKey === "your-ld-sdk-key") {
    return null;
  }

  if (ldClient) return ldClient;

  if (!initPromise) {
    const client = LaunchDarkly.init(sdkKey, {
      stream: false, // Desativa streaming para evitar erros de timeout de I/O em ambientes serverless/dev
      pollInterval: 60, // Consulta atualizações a cada 60 segundos
    });
    initPromise = client
      .waitForInitialization({ timeout: 10 })
      .then(() => {
        ldClient = client;
        return ldClient;
      })
      .catch((err) => {
        console.error("[LaunchDarkly] Failed to initialize:", err);
        return null;
      });
  }

  return initPromise;
}

export async function getFeatureFlag<K extends keyof FeatureFlags>(
  key: K,
  context: LaunchDarkly.LDContext,
  defaultValue: FeatureFlags[K],
): Promise<FeatureFlags[K]> {
  try {
    const client = await getLDClient();
    if (!client) return defaultValue;

    return (await client.variation(
      key,
      context,
      defaultValue,
    )) as FeatureFlags[K];
  } catch (error) {
    console.warn(`[LaunchDarkly] Error evaluating flag "${key}":`, error);
    return defaultValue;
  }
}
