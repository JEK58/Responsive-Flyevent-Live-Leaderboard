const LS_KEY = "leaderboard-prefs";

export const getPrefsFromLocalStorage = () => {
  const ls = localStorage.getItem(LS_KEY);
  if (ls === null) return;
  const { autoToggle } = JSON.parse(ls);
  if (typeof autoToggle === "boolean") return autoToggle as boolean;
  return;
};

export const savePrefsToLocalStorage = (autoToggle: boolean) => {
  localStorage.setItem(
    LS_KEY,
    JSON.stringify({
      autoToggle,
    })
  );
};
