import { useState, useEffect } from "react";
import type { TaskData } from "./types/TaskData";

const BASE_URL = "https://corsproxy.io/?https://race.airtribune.com/";
// const BASE_URL = "http://127.0.0.1:5500/src/demo-data/";
const LIVE_DATA_URL = BASE_URL + "feed_live.json";
const LIVE_TASK_URL = BASE_URL + "feed_task.json";
const REFRESH_INTERVAL = 2000;

function App() {
  const [liveData, setLiveData] = useState([]);
  const [taskData, setTaskData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchLiveData = async () => {
    if (!taskData) return;
    console.log("Fetch live data");
    try {
      const res = await fetch(LIVE_DATA_URL + "?" + new Date().getTime());
      setLiveData(await res.json());
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTaskData = async () => {
    // TODO: Automatically update task data after x
    console.log("Fetch task data");
    try {
      const res = await fetch(LIVE_TASK_URL + "?ts=" + new Date().getTime());
      setTaskData(await res.json());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!taskData) fetchTaskData();
    fetchLiveData();
    const fetchInterval = setInterval(fetchLiveData, REFRESH_INTERVAL);
    return () => clearInterval(fetchInterval);
  }, [taskData]);

  return (
    <div className="p-2">
      <TaskData taskData={taskData} />
      <hr />
      <PilotsList liveData={liveData} />
      <hr />
      <LegendFooter />
    </div>
  );
}

interface TaskDataProps {
  taskData?: TaskData;
}

function TaskData({ taskData }: TaskDataProps) {
  if (!taskData) return null;
  return (
    <header className="my-4 ml-2">
      <h1 className="text-2xl font-bold text-gray-900">{taskData.event}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 text-gray-600 text-sm font-semibold">
        <div>Distance: {+(taskData.dist / 1000).toFixed(1)} km</div>
        <div>Style is {taskData.type}</div>
        <div>Window opens at {taskData.times.wo}h</div>
        <div>Race Start at {taskData.times.so}h</div>{" "}
      </div>

      <div className="mt-2">
        <p className="text-gray-600 text-sm">
          The following is based on last GPS positions received
        </p>
        <p className="text-gray-600 text-sm">
          Final scores may differ with LeadOut and Arrival points.
        </p>
      </div>
    </header>
  );
}
function LegendFooter() {
  return (
    <footer>
      <ul className="list-disc p-4 text-gray-600 text-sm">
        <li>Italic text indicates live tracking data.</li>
        <li>
          <b>Bold</b> text confirms the pilot returned tracker
        </li>
        <li>
          The <b>%</b> number shows the LeadOutPoints gained.
        </li>
        <li>
          <del>Text struck</del>
          out means ESS, but not goal
        </li>
        <li>
          Fading position means old data. Their position is better than shown.
        </li>
      </ul>
    </footer>
  );
}

interface LiveDataProps {
  liveData: unknown[];
}

function PilotsList({ liveData }: LiveDataProps) {
  if (!liveData.length) return null;
  // Pilot list starts at index 3
  const listItems = liveData.slice(3).map((item, i) => {
    // @ts-ignore TODO: type this somewhow
    const pilot = item[0];
    const sex = pilot[0] % 2 == 1 ? "m" : "f";
    const pos = pilot[1];
    const name = pilot[3].replaceAll("_", " ");
    const nation = pilot[4];
    const glider = pilot[5];
    const amsl = pilot[6] + "m";
    const status = pilot[14];
    const leading = pilot[16];
    const location = pilot[17];
    const distance = pilot[19] + "km";
    const time = pilot[20];

    return (
      <tr className="text-gray-700 text-sm" key={i}>
        <td className="py-3 px-2 font-semibold">{pos}</td>
        <td className="py-3 px-2">{name}</td>
        <td className="py-3 px-2">{time ? time : distance}</td>
        <td className="py-3 px-2">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {location == "GOAL"
              ? "Goal 🎯"
              : status == "Landed"
              ? status
              : amsl}
          </span>
        </td>
        <td className="py-3 px-2">{location == "GOAL" && leading}</td>
        <td className="py-3 px-2"></td>
      </tr>
    );
  });
  return (
    <div className="w-full overflow-x-auto lg:columns-2 xl:columns-3">
      <table className="table-auto w-full">
        {/* <thead>
          <tr className="bg-gray-200 text-gray-600 text-sm font-medium uppercase tracking-wider">
            <th className="py-3 px-4">#</th>
          </tr>
        </thead> */}
        <tbody className="bg-white divide-y divide-gray-200">{listItems}</tbody>
      </table>
    </div>
  );
}

export default App;
