import { z } from "zod";

const Prefs = z.object({
  autoToggle: z.boolean(),
  showPilotNumber: z.boolean(),
});

const LS_KEY = "leaderboard_prefs";

export const getPrefsFromLocalStorage = () => {
  const ls = localStorage.getItem(LS_KEY);
  if (ls === null) return;

  try {
    const result = Prefs.safeParse(JSON.parse(ls));

    if (!result.success) console.log(result.error.message);
    else return result.data;
  } catch (err) {
    console.log(err);
  }
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
