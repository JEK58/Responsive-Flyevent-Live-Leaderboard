import { useState } from "react";
import "./App.css";
import task from "./demo-data/feed_task.json";
import live from "./demo-data/feed_live.json";

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App p-2 ">
      <div className="mb-4">
        <h1 className="text-lg">{task.event}</h1>
        <div className="flex flex-row divide-x divide-dashed"></div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          <div>Distance: {+(task.dist / 1000).toFixed(1)} km</div>
          <div>Launch Opens at: {task.times.wo}</div>
          <div>Race Start at: {task.times.so}</div>
          <div>Style is {task.type}</div>
        </div>
      </div>
      <hr />
      <PilotsList />
      <hr />
      <p>
        The following is based on last GPS positions received | Final scores may
        differ with LeadOut and Arrival points. | Board created by Flyevent.org.
        Leaders in event scoring and tracking technologies
      </p>
      <i>
        <b>KEY:</b> Italic text indicates live tracking data.
      </i>
      | <b>Bold</b>
      text confirms the pilot returned tracker | The
      <b>%</b>
      number shows the LeadOutPoints gained. | <del>Text struck</del>
      out means ESS, but not goal | Fading position means old data. Their
      position is better than shown.
      <hr />
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </div>
  );
}

function PilotsList() {
  // Pilot list starts at index 3
  const listItems = live.slice(3).map((item, i) => {
    const pilot = item[0];

    const sex = pilot[0] % 2 == 1 ? "♀" : "♂";
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
      <tr key={i}>
        <td className="">{pos}</td>
        <td className="">{name}</td>
        <td className="">{time ? time : distance}</td>
        <td className="">
          {location == "GOAL" ? "🎯" : status == "Landed" ? status : amsl}
        </td>
        <td className="">{location == "GOAL" && leading}</td>

        <td></td>
      </tr>
    );
  });
  return (
    <table className="table-auto border-collapse ">
      <tbody>{listItems}</tbody>
    </table>
  );
}

export default App;
