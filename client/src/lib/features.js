import moment from "moment";

export const fileFormat = (url) => {
  const fileExtension = url.split(".").pop().toLowerCase();

  if (["mp4", "webm", "ogg"].includes(fileExtension)) return "video";
  if (["mp3", "wav"].includes(fileExtension)) return "audio";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(fileExtension))
    return "image";

  return "file";
};

export const transformImage = (url = "", width = 100) => url;

export const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");
    last7Days.unshift(dayName);
  }

  return last7Days;
};
