/** expo-linking for the bundled libraries: the practice phone's (expo.js). */
import { ExpoLinking } from "../expo.js";

export const { createURL, parse, useURL, useLinkingURL, getLinkingURL, addEventListener, openURL, canOpenURL, openSettings, getInitialURL, sendIntent, parseInitialURLAsync, resolveScheme, hasCustomScheme, collectManifestSchemes, hasConstantsManifest } = ExpoLinking;
export default ExpoLinking;

/*
 * unwrapDevLaunchURL, as expo-linking 58 implements it (build/devLaunchURL.js,
 * MIT): the URL a launch link targets, without Expo's reserved __expo_*
 * parameters. Expo Router calls it on every incoming URL. The package's
 * exports map does not expose the file, so its code is reproduced here.
 */
const RESERVED_PREFIX = "__expo_";
const URL_PARAM = `${RESERVED_PREFIX}url`;
const LEGACY_HOST = "expo-development-client";
export function unwrapDevLaunchURL(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  const isLegacyHost = parsed.hostname === LEGACY_HOST;
  const target = parsed.searchParams.get(URL_PARAM) ?? (isLegacyHost ? parsed.searchParams.get("url") : null);
  if (target != null) return target;
  if (isLegacyHost) return "";
  const reserved = [...parsed.searchParams.keys()].filter((key) => key.startsWith(RESERVED_PREFIX));
  if (!reserved.length) return url;
  for (const key of reserved) parsed.searchParams.delete(key);
  return parsed.toString();
}
