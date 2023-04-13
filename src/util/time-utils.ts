export function checkEssTime(time: string, bestTime: Date) {
  const date = new Date(`1970-01-01T${time}Z`);
  if (date.getTime() == bestTime.getTime()) return time;
  return calcTimeDiff(date, bestTime);
}

export function calcTimeDiff(date1: Date, date2: Date) {
  const diff = Math.abs(date1.getTime() - date2.getTime());

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  // format the time difference as hh:mm:ss
  const formattedDiff = `+${hours.toString()}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  if (formattedDiff.startsWith("+0:")) return "+" + formattedDiff.slice(3);
  return formattedDiff;
}
