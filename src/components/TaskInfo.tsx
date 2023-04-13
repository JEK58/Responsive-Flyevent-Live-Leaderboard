import type { TaskData as TaskInfo } from "../types/TaskData";
import { BsReception4, BsReception2 } from "react-icons/bs";

interface TaskDataProps {
  taskData?: TaskInfo;
  showConnectionWarning: boolean;
}

function ConnectionIndicator({ badConnection }: { badConnection: boolean }) {
  return (
    <div
      className={`text-xl mr-4 ${
        badConnection ? "text-red-800" : "text-teal-600"
      }`}
    >
      {badConnection ? <BsReception2 /> : <BsReception4 />}
    </div>
  );
}
export function TaskInfo({ taskData, showConnectionWarning }: TaskDataProps) {
  if (!taskData) return null;
  return (
    <header className="my-4 ml-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl mb-2 font-bold text-gray-700 dark:text-slate-200">
          {taskData.event}
        </h1>
        <ConnectionIndicator badConnection={showConnectionWarning} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 text-gray-600 dark:text-slate-400 text-sm font-semibold">
        <div>Distance: {+(taskData.dist / 1000).toFixed(1)} km</div>
        <div>Style is {taskData.type}</div>
        <div>Window opens at {taskData.times.wo}h</div>
        <div>Race Start at {taskData.times.so}h</div>{" "}
      </div>

      <div className="mt-2">
        <p className="text-gray-600 dark:text-slate-400 text-sm">
          The following is based on last GPS positions received.
        </p>
        <p className="text-gray-600 dark:text-slate-400 text-sm">
          Final scores may differ with LeadOut and Arrival points.
        </p>
      </div>
    </header>
  );
}
