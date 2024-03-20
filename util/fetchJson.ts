export async function fetchJSONData(path: string) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! Status : ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
  }
}
