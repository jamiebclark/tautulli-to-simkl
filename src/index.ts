import dotenv from "dotenv";
import { updateHistory } from "./lib/simkl.js";
import { getHistory } from "./lib/tautulli.js";
dotenv.config()

async function run() {
  const history = await getHistory();
  const response = await updateHistory(history)
  const data = (await response.json()) as Record<string, any>
  console.log(data)

  if (data.not_found) {
    console.log('Not Found:')
    Object.keys(data.not_found)
      .filter((key) => data.not_found[key].length)
      .forEach((key) => {
        console.log(key.toUpperCase());
        data.not_found[key].forEach((item: any) => {
          console.log(item)
        })
      })
  }
}

run();
