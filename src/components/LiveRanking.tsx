import { RankingLegend } from "./RankingLegend";
import { formatName } from "../util/format-name";
import { useEffect, useRef, useState } from "react";
import { parsePilotData } from "../util/parse-pilot-data";
import { checkEssTime } from "../util/time-utils";
import {
  savePrefsToLocalStorage,
  getPrefsFromLocalStorage,
} from "../util/local-storage";
import { IoMdFemale } from "react-icons/io";
import ReactCountryFlag from "react-country-flag";
import { getCountryISO2 } from "../util/iso-3-to-2";

interface LiveDataProps {
  liveData?: unknown[];
}

export function LiveRanking({ liveData }: LiveDataProps) {
  if (!liveData?.length) return null;
  const timestamp = liveData[0] as number;
  const time = new Date(timestamp * 1000).toLocaleTimeString();

  // Toggle between Leading points and score
  const [autoToggleActive, setAutoToggleActive] = useState(false);
  const [index, setIndex] = useState(0);
  const bestTime = useRef<Date>(new Date(864000000000000));

  const intervalRef = useRef<null | number>(null);

  function findBestTime(time?: string) {
    if (!time) return;
    const date = new Date(`1970-01-01T${time}Z`);
    if (date < bestTime.current) bestTime.current = date;
  }

  function toggleIndex() {
    setIndex((prevIndex) => (prevIndex + 1) % 2);
  }

  function handleAutoToggleClicked(value: boolean) {
    savePrefsToLocalStorage(value);
    setAutoToggleActive(value);
  }

  // Read prefs from local storage
  if (typeof window !== "undefined") {
    const prefs = getPrefsFromLocalStorage() ?? false;
    if (prefs != autoToggleActive) setAutoToggleActive(prefs);
  }

  // Toggle between leading points and score every three seconds
  useEffect(() => {
    if (!autoToggleActive) return;
    intervalRef.current = setInterval(() => {
      toggleIndex();
    }, 3000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoToggleActive]);

  // Find the best ESS time
  liveData.slice(3).map((data) => findBestTime(parsePilotData(data).essTime));

  // Pilot list starts at index 3
  const listItems = liveData.slice(3).map((data, i) => {
    const pilot = parsePilotData(data);

    // Pilot states
    const isFlying = pilot.amsl !== "" && pilot.timeLanded === "";
    const isOnFinalGlide = isFlying && pilot.grGoal < 12;
    const landedInESS =
      !isFlying && pilot.essTime !== "" && pilot.location !== "GOAL";
    const isInGoal =
      !isFlying && pilot.essTime !== "" && pilot.location === "GOAL";

    const isFastestInGoal =
      pilot.essTime &&
      checkEssTime(pilot.essTime, bestTime.current).includes("+");

    // This values are considered online. Any tracker data > 6 min is considered stale
    const onlineTrackerStates = [
      "0 min",
      "1 min",
      "2 min",
      "3 min",
      "4 min",
      "5 min",
      "6 min",
      "OK",
      "At HQ",
      "Landed",
    ];

    const staleData = !onlineTrackerStates.includes(pilot.trackerState);

    // State Badge Color
    let badgeClass = "";
    if (isInGoal) badgeClass = "bg-violet-200 text-violet-800";
    if (isFlying) badgeClass = "bg-green-100 text-green-800";
    if (!isFlying && !isInGoal) badgeClass = "bg-red-100 text-red-800";

    return (
      <tr
        className="2xl:text-xs text-gray-700 dark:text-slate-400 text-sm even:bg-neutral-100 dark:even:bg-slate-700 break-inside-avoid-column"
        key={i}
        onClick={toggleIndex}
      >
        <td className="pl-3 2xl:py-1 py-3 md:py-2 font-semibold">
          {staleData ? "⏳" : pilot.pos}
        </td>
        <td>
          <ReactCountryFlag
            className="emojiFlag"
            style={{
              fontSize: "1.5em",
              lineHeight: "1.5em",
            }}
            countryCode={getCountryISO2(pilot.nation)}
          />
        </td>
        <td className="py-3 2xl:py-1 md:py-2 px-1">{formatName(pilot.name)}</td>
        <td> {pilot.sex === "f" && <IoMdFemale />}</td>
        <td
          className={`py-3 2xl:py-1 md:py-2 px-1 ${
            landedInESS ? "line-through" : ""
          }`}
        >
          {pilot.essTime
            ? checkEssTime(pilot.essTime, bestTime.current)
            : pilot.distance}
        </td>
        <td className="py-3 2xl:py-1 md:py-2 px-1">
          <span
            className={
              "whitespace-nowrap px-2 inline-flex text-xs leading-5 font-semibold rounded-full  " +
              badgeClass
            }
          >
            {isInGoal ? "Goal 🎯" : !isFlying ? "Landed" : pilot.amsl}
          </span>
        </td>

        <td className="py-3 2xl:py-1 md:py-2 pr-3 min-w-4em">
          {index === 0 && pilot.leading}
          {index === 1 && pilot.score.split(".")[0] + " P"}
        </td>
      </tr>
    );
  });
  return (
    <>
      <div className="w-full overflow-x-auto md:columns-2 xl:columns-3 2xl:columns-5  gap-6 my-2">
        <table className="table-auto w-full">
          {/* <thead>
          <tr className="bg-gray-200 text-gray-600 text-sm font-medium uppercase tracking-wider">
            <th className="py-3 md:py-2 px-4">#</th>
          </tr>
        </thead> */}
          <tbody>{listItems}</tbody>
        </table>
      </div>
      <div className="p-1 px-3  text-gray-600 dark:text-slate-400 text-sm  flex justify-between">
        <div>Last update: {time}</div>
        <div className="text-right flex items-center">
          <label htmlFor="auto-toggle"> Auto toggle LP / Score</label>
          <input
            id="auto-toggle"
            type="checkbox"
            checked={autoToggleActive}
            onChange={(e) => handleAutoToggleClicked(e.target.checked)}
            className="h-4 w-4 mx-1 rounded-md border border-blue-gray-200 "
          />
        </div>
      </div>
      <RankingLegend />
    </>
  );
}
