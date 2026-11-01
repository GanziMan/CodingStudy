"use client";

import { useSyncExternalStore } from "react";

export type ThemePref = "light" | "dark" | "system";
export type Theme = "light" | "dark";

import { THEME_KEY } from "./theme-script";

const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function apply(pref: ThemePref) {
  const dark = pref === "dark" || (pref === "system" && media().matches);
  const root = document.documentElement;
  root.dataset.theme = dark ? "dark" : "light";
  root.dataset.themePref = pref;
}

export function setThemePref(pref: ThemePref) {
  try {
    localStorage.setItem(THEME_KEY, pref);
  } catch {}
  apply(pref);
}

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-theme-pref"] });
  const mq = media();
  const onSystem = () => {
    if ((document.documentElement.dataset.themePref ?? "system") === "system") apply("system");
  };
  mq.addEventListener("change", onSystem);
  return () => {
    obs.disconnect();
    mq.removeEventListener("change", onSystem);
  };
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    () => "light",
  );
}

export function useThemePref(): ThemePref {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.themePref as ThemePref) ?? "system",
    () => "system",
  );
}
