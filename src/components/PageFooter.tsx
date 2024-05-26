import { FaGithub } from "react-icons/fa";

export function PageFooter() {
  return (
    <footer className="text-gray-600 dark:text-slate-400 p-2 m-4">
      <a
        href="https://github.com/JEK58/Responsive-Flyevent-Live-Leaderboard"
        className="text-sm flex items-center justify-center"
      >
        <FaGithub className="mr-1" />
        Made with ❤️ by Stephan Schöpe
      </a>
    </footer>
  );
}
