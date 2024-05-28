const LS_KEY = "leaderboard-prefs";

type Prefs = {
  showPilotNumber?: boolean;
  autoToggle?: boolean;
};

export const getPrefsFromLocalStorage = () => {
  const ls = localStorage.getItem(LS_KEY);
  if (ls === null) return;
  const { showPilotNumber, autoToggle } = JSON.parse(ls);

  return { showPilotNumber, autoToggle } as Prefs;
  return;
};

export const savePrefsToLocalStorage = (
  autoToggle: boolean,
  showPilotNumber: boolean
) => {
  localStorage.setItem(
    LS_KEY,
    JSON.stringify({
      autoToggle,
      showPilotNumber,
    })
  );
};
