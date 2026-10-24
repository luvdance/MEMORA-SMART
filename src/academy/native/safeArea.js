/**
 * react-native-safe-area-context ON THE PRACTICE PHONE
 *
 * The same API as the real library, answering with the practice phone's
 * insets: the status bar and Dynamic Island or camera cut-out at the top,
 * the home indicator or gesture bar at the bottom. Expo Router's headers and
 * tab bars use it too, so they sit where they would on a device.
 */

import { createContext, createElement, forwardRef, useContext, useSyncExternalStore } from "react";
import { View } from "react-native-web";
import { on, screen } from "./phone.js";

const snapshot = () => JSON.stringify(screen());
const subscribe = (cb) => on("screen", cb);
function useScreen() {
  return JSON.parse(useSyncExternalStore(subscribe, snapshot, snapshot));
}

export const initialWindowMetrics = {
  get insets() {
    return screen().insets;
  },
  get frame() {
    const s = screen();
    return { x: 0, y: 0, width: s.width, height: s.height };
  },
};

export const SafeAreaInsetsContext = createContext(null);
SafeAreaInsetsContext.displayName = "SafeAreaInsetsContext";
export const SafeAreaFrameContext = createContext(null);
SafeAreaFrameContext.displayName = "SafeAreaFrameContext";
export const SafeAreaConsumer = SafeAreaInsetsContext.Consumer;

export function SafeAreaProvider({ children, style }) {
  const s = useScreen();
  const frame = { x: 0, y: 0, width: s.width, height: s.height };
  return createElement(
    SafeAreaFrameContext.Provider,
    { value: frame },
    createElement(SafeAreaInsetsContext.Provider, { value: s.insets }, createElement(View, { style: [{ flex: 1 }, style] }, children))
  );
}

export function useSafeAreaInsets() {
  const fromContext = useContext(SafeAreaInsetsContext);
  const s = useScreen();
  return fromContext || s.insets;
}

export function useSafeAreaFrame() {
  const fromContext = useContext(SafeAreaFrameContext);
  const s = useScreen();
  return fromContext || { x: 0, y: 0, width: s.width, height: s.height };
}

export function withSafeAreaInsets(Component) {
  const Wrapped = Component;
  return forwardRef(function WithInsets(props, ref) {
    const insets = useSafeAreaInsets();
    return <Wrapped {...props} insets={insets} ref={ref} />;
  });
}

const ALL = ["top", "right", "bottom", "left"];

/** Padding (or margin) on each requested edge, as the real SafeAreaView adds it. */
export const SafeAreaView = forwardRef(function SafeAreaView({ edges, mode = "padding", style, ...rest }, ref) {
  const insets = useSafeAreaInsets();
  const wanted = edges == null ? Object.fromEntries(ALL.map((e) => [e, "additive"])) : Array.isArray(edges) ? Object.fromEntries(edges.map((e) => [e, "additive"])) : edges;
  const flat = Object.assign({}, ...[].concat(style || []).flat(Infinity).filter(Boolean));
  const out = {};
  for (const edge of ALL) {
    const how = wanted[edge];
    if (!how || how === "off") continue;
    const key = `${mode}${edge[0].toUpperCase()}${edge.slice(1)}`;
    const own = Number(flat[key] ?? flat[mode === "padding" ? (edge === "top" || edge === "bottom" ? "paddingVertical" : "paddingHorizontal") : (edge === "top" || edge === "bottom" ? "marginVertical" : "marginHorizontal")] ?? flat[mode] ?? 0) || 0;
    out[key] = how === "maximum" ? Math.max(own, insets[edge]) : own + insets[edge];
  }
  return <View {...rest} ref={ref} style={[style, out]} />;
});

export const SafeAreaListener = ({ children }) => children ?? null;
export default { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, useSafeAreaFrame };
