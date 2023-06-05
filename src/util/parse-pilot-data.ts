export function parsePilotData(data: unknown) {
  // @ts-ignore TODO: type this somehow
  const raw = data[0];
  const pilot = {
    sex: raw[0] % 2 == 1 ? "f" : "m",
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
    trackerState: raw[14], // "" | "Landed" | "At HQ" | "x min"  | "OK"
    timeLanded: raw[15], // "" | "xx:xx"
    leading: raw[16],
    location: raw[17], // "GOAL" | "At HQ"
    target: raw[18],
    distance: raw[19] + "km",
    essTime: raw[20] as string | undefined,
    score: raw[24] as string,
  };
  return pilot;
}
