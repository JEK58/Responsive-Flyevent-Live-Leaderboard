import { RankingLegend } from "./RankingLegend";

interface LiveDataProps {
  liveData?: unknown[];
}

function parsePilotData(data: unknown) {
  // @ts-ignore TODO: type this somehow
  const raw = data[0];
  const pilot = {
    sex: raw[0] % 2 == 1 ? "m" : "f",
    pos: raw[1],
    id: raw[2],
    name: raw[3].replaceAll("_", " "),
    nation: raw[4],
    glider: raw[5],
    amsl: raw[6] + "m",
    agl: raw[7] + "m",
    speed: raw[8],
    vario: raw[9],
    bearing: raw[10],
    grGoal: raw[11],
    grPilot: raw[12],
    arrGoal: raw[13],
    trackerState: raw[14], // "" | "Landed" | "At HQ" | "x min"
    timeLanded: raw[15], // "" | "xx:xx"
    leading: raw[16],
    location: raw[17], // "GOAL" | "At HQ
    target: raw[18],
    distance: raw[19] + "km",
    essTime: raw[20],
  };
  return pilot;
}

export function LiveRanking({ liveData }: LiveDataProps) {
  if (!liveData?.length) return null;
  const timestamp = liveData[0] as number;
  const time = new Date(timestamp * 1000).toLocaleTimeString();

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

    // State Badge Color
    let badgeClass = "";
    if (isInGoal) badgeClass = "bg-violet-200 text-violet-800";
    if (isFlying) badgeClass = "bg-green-100 text-green-800";
    if (!isFlying && !isInGoal) badgeClass = "bg-red-100 text-red-800";

    return (
      <tr className="text-gray-700 text-sm even:bg-neutral-50" key={i}>
        <td className="py-3 md:py-2 px-2 font-semibold">{pilot.pos}</td>
        <td className="py-3 md:py-2 px-2">{pilot.name}</td>
        <td className={"py-3 md:py-2 px-2 " + (landedInESS && "line-through")}>
          {pilot.essTime ? pilot.essTime : pilot.distance}
        </td>
        <td className="py-3 md:py-2 px-2">
          <span
            className={
              "whitespace-nowrap px-2 inline-flex text-xs leading-5 font-semibold rounded-full  " +
              badgeClass
            }
          >
            {isInGoal ? "Goal 🎯" : !isFlying ? "Landed" : pilot.amsl}
          </span>
        </td>
        <td className="py-3 md:py-2 px-2">
          {pilot.leading !== "0%" && pilot.leading}
        </td>
      </tr>
    );
  });
  return (
    <>
      <div className="w-full overflow-x-auto md:columns-2 xl:columns-3 gap-6 my-2">
        <table className="table-auto w-full">
          {/* <thead>
          <tr className="bg-gray-200 text-gray-600 text-sm font-medium uppercase tracking-wider">
            <th className="py-3 md:py-2 px-4">#</th>
          </tr>
        </thead> */}
          <tbody className="bg-white divide-y divide-gray-200">
            {listItems}
          </tbody>
        </table>
      </div>
      <div className="p-1 text-gray-600 text-sm">
        <div>Last update: {time}</div>
      </div>
      <RankingLegend />
    </>
  );
}
