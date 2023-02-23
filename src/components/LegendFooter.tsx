export function LegendFooter() {
  return (
    <footer>
      <ul className="list-disc p-4 text-gray-600 text-sm">
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
        {/* <li>
          Fading position means old data. Their position is better than shown.
        </li> */}
      </ul>
    </footer>
  );
}
