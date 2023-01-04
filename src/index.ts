import dotenv from "dotenv";
import fs from 'fs';

import { updateHistory } from "./lib/simkl.js";
import { getHistory } from "./lib/tautulli.js";
dotenv.config()

const OUTPUT_PATH = './output.json';

async function run() {
  console.log('Syncing Tautulli with Simkl')

  console.log('Fetching history')
  const history = await getHistory();
  console.log('Fetching history complete')

  console.log('Uploading history')
  const response = await updateHistory(history)
  const data = (await response.json()) as Record<string, any>

  console.log('Upload complete');
  console.log(`Output saved to ${OUTPUT_PATH}`)

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), "utf-8")

  if (data.added) {
    Object.keys(data.added).forEach((key) => {
      if (data.added[key]) {
        console.log(`Added ${data.added[key]} ${key}`)
      }
    })
    console.log()
  }

  if (data.not_found) {
    Object.keys(data.not_found)
      .filter((key) => data.not_found[key].length)
      .forEach((key) => {
        console.log(`Could not find ${data.not_found[key].length} ${key}`)
        console.log(key.toUpperCase());
      })
  }

  console.log('Sync complete')
}

run();
