export const THEME_KEY = "ctl:theme";

/** <head>에 인라인으로 넣어 첫 페인트 전에 테마를 적용한다 (깜빡임 방지) */
export const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem("${THEME_KEY}");var d=p==="dark"||((!p||p==="system")&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.dataset.theme=d?"dark":"light";r.dataset.themePref=p||"system";}catch(e){}})();`;
