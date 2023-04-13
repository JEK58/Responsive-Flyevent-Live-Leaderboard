import { useState, useEffect } from "react";
import { TaskInfo } from "./components/TaskInfo";
import { LiveRanking } from "./components/LiveRanking";
import { NoData } from "./components/NoData";
import { PageFooter } from "./components/PageFooter";

const BASE_URL = "https://corsproxy.io/?https://race.airtribune.com/";
// const BASE_URL = "http://127.0.0.1:5500/src/demo-data/";
const LIVE_TASK_URL = BASE_URL + "feed_task.json";
const LIVE_DATA_URL = BASE_URL + "feed_live.json";
const REFRESH_INTERVAL_TASK = 36_000_000; // in ms
const REFRESH_INTERVAL_LIVE = 3000; // in ms

function App() {
  const [liveData, setLiveData] = useState();
  const [taskData, setTaskData] = useState();
  const [failedFetchAttempts, setFailedFetchAttempts] = useState(0);

  const showConnectionWarning = failedFetchAttempts > 2;

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
      setFailedFetchAttempts(0);
    } catch (error) {
      console.log(error);
      setFailedFetchAttempts((f) => f + 1);
    }
  };

  const fetchTaskData = async () => {
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
    const fetchInterval = setInterval(fetchLiveData, REFRESH_INTERVAL_LIVE);
    const fetchIntervalTask = setInterval(fetchTaskData, REFRESH_INTERVAL_TASK);
    return () => {
      clearInterval(fetchInterval);
      clearInterval(fetchIntervalTask);
    };
  }, [taskData]);

  if (!taskData) return <NoData />;

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-800 ">
      <div className="flex-grow">
        <TaskInfo
          taskData={taskData}
          showConnectionWarning={showConnectionWarning}
        />
        <hr className="dark:border-slate-500" />
        {!liveData ? <NoData /> : <LiveRanking liveData={liveData} />}
      </div>
      <PageFooter />
    </div>
  );
}

export default App;
