export const dateFormat = (date: Date) => {
  return `${date.getDate()} ${date
    .toLocaleString("default", {
      month: "long",
    })
    .substring(0, 3)} ${date.getFullYear().toString().substring(2)}`;
};
