export function formatName(text: string): string {
  const words = text.toLowerCase().split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  const capitalizedText = capitalizedWords.join(" ");

  return capitalizedText;
}
