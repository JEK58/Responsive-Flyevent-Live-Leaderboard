import { useState, useEffect } from "react";
import { TaskInfo } from "./components/TaskInfo";
import { LiveRanking } from "./components/LiveRanking";
import { NoData } from "./components/NoData";
import { PageFooter } from "./components/PageFooter";
import { useLocation } from "react-router-dom";
import { ActiveCompList } from "./components/CompList";
import { CompList } from "./types/CompList";

function App() {
  const [liveData, setLiveData] = useState();
  const [taskData, setTaskData] = useState();
  const [compList, setCompList] = useState<CompList | undefined>();
  const [failedFetchAttempts, setFailedFetchAttempts] = useState(0);

  const search = useLocation().search;
  const compId = new URLSearchParams(search).get("id");
  const useCorsProxy = import.meta.env.VITE_USE_CORS_PROXY === "true";

  const BASE_URL = useCorsProxy
    ? "https://corsproxy.io/?https://race.airtribune.com/"
    : "https://race.airtribune.com/";
  // const BASE_URL = "http://127.0.0.1:5500/src/demo-data/";

  const REFRESH_INTERVAL_TASK = 36_000_000; // in ms
  const REFRESH_INTERVAL_LIVE = 3000; // in ms

  const LIVE_TASK_URL = BASE_URL + compId + "/feed_task.json";
  const LIVE_DATA_URL = BASE_URL + compId + "/feed_live.json";
  const COMP_LIST_URL = BASE_URL + "/active_comps.json";

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
    if (!taskData && compId) fetchTaskData();
    fetchLiveData();
    const fetchInterval = setInterval(fetchLiveData, REFRESH_INTERVAL_LIVE);
    const fetchIntervalTask = setInterval(fetchTaskData, REFRESH_INTERVAL_TASK);
    return () => {
      clearInterval(fetchInterval);
      clearInterval(fetchIntervalTask);
    };
  }, [taskData]);

  const fetchCompList = async () => {
    try {
      const res = await fetch(COMP_LIST_URL);
      setCompList(await res.json());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompList();
  }, []);

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-800  ">
      <div className="flex-grow  text-gray-700 dark:text-slate-400 text-sm even:bg-neutral-100 dark:even:bg-slate-700">
        {!compId && <ActiveCompList compList={compList} />}
        {compId && !taskData && <NoData />}
        {compId && taskData && (
          <>
            <TaskInfo
              taskData={taskData}
              showConnectionWarning={showConnectionWarning}
            />
            <hr className="dark:border-slate-500" />
            {!liveData ? <NoData /> : <LiveRanking liveData={liveData} />}
          </>
        )}
      </div>
      <PageFooter />
    </div>
  );
}

export default App;
