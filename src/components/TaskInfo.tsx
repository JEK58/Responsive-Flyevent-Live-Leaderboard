import type { TaskData as TaskInfo } from "../types/TaskData";

interface TaskDataProps {
  taskData?: TaskInfo;
}

export function TaskInfo({ taskData }: TaskDataProps) {
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
          The following is based on last GPS positions received.
        </p>
        <p className="text-gray-600 text-sm">
          Final scores may differ with LeadOut and Arrival points.
        </p>
      </div>
    </header>
  );
}
