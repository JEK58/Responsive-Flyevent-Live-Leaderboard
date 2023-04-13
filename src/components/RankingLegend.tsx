export function RankingLegend() {
  return (
    <div className="dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-sm px-3">
      <ul className="my-3">
        {/* <li>Italic text indicates live tracking data.</li>
        <li>
          <b>Bold</b> text confirms the pilot returned tracker
        </li> */}
        <li>
          The <b>%</b> number shows the LeadOutPoints gained.
        </li>
        <li>
          <del>Text struck</del> out means ESS, but not goal
        </li>
        <li>⏳ marks live data older than 6 minutes</li>
      </ul>
    </div>
  );
}
