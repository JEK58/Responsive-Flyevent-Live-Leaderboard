import { useState, useEffect, useRef } from "react";
import { TaskInfo } from "./components/TaskInfo";
import { LegendFooter } from "./components/LegendFooter";
import { LiveRanking } from "./components/LiveRanking";
import { NoData } from "./components/NoData";

// const BASE_URL = "https://corsproxy.io/?https://race.airtribune.com/";
const BASE_URL = "http://127.0.0.1:5500/src/demo-data/";
const LIVE_TASK_URL = BASE_URL + "feed_task.json";
const LIVE_DATA_URL = BASE_URL + "feed_live.json";
const REFRESH_INTERVAL = 4000; // in ms

function App() {
  const [liveData, setLiveData] = useState();
  const [taskData, setTaskData] = useState();

  const fetchLiveData = async () => {
    if (!taskData) return;

    try {
      const res = await fetch(LIVE_DATA_URL + "?" + new Date().getTime());
      const data = await res.json();

      // Simple check if data looks like expected
      if (data[2][0].length < 10) throw "Live data is not looking plausible";

      // TODO: Check if the received feed data is newer than the current to prevent "jumping" results on bad connections
      // Need more backend info for that
      // if (liveData && data[0] > liveData[0]) setLiveData(data);

      setLiveData(data);
    } catch (error) {
      // TODO: Show bad connection warning?
      console.log(error);
    }
  };

  const fetchTaskData = async () => {
    // TODO: Automatically update task data after x min or hours
    try {
      const res = await fetch(LIVE_TASK_URL + "?ts=" + new Date().getTime());
      setTaskData(await res.json());

      // Clear old live data that may still be in state
      setLiveData(undefined);
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

  if (!taskData) return <NoData />;

  return (
    <div className="p-2">
      <TaskInfo taskData={taskData} />
      <hr />
      {!liveData ? <NoData /> : <LiveRanking liveData={liveData} />}
      <LegendFooter />
    </div>
  );
}

export default App;
