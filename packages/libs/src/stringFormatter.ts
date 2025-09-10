export function slugToTitle(str: string) {
  return str
    .split(/[-_]/)
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}
