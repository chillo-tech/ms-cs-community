export const heureFormat = (heureString: string) => {
  const currentDate = new Date(heureString);
  const minutes = `0${currentDate.getMinutes()}`.slice(-2);
  const heure = `0${currentDate.getHours()}`.slice(-2);
  return `${heure}:${minutes}`;
};
