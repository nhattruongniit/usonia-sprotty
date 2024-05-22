// format: [prefix]_mmddyyyy_ hhmmss
function addZero(i: number) {
  let str = i.toString();
  if (i < 10) {
    str = "0" + i;
  }
  return str;
}

export default function randomText(prefix = "default") {
  const today = new Date();
  const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  const month =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : `${today.getMonth() + 1}`;
  const date = new Date();
  const hour = addZero(date.getHours());
  const minute = addZero(date.getMinutes());
  const second = addZero(date.getSeconds());
  const text = `${prefix}_${month}${day}${today.getFullYear()}_${hour}${minute}${second}`;

  return text;
}
