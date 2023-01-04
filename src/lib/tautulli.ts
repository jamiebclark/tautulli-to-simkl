import dotenv from "dotenv";
dotenv.config()

const API_BASE = `${process.env.TAUTILLI_API_BASE}/api/v2`

import fetch from 'node-fetch';

import { UploadPayload } from "./simkl.js";

interface HistoryPayload {
  response: {
    result: string,
    message: string | null,
    data: {
      recordsFiltered: number,
      recordsTotal: number,
      data: {
        reference_id: number,
        row_id: number,
        id: number,
        date: number,
        started: number,
        stopped: number,
        duration: number,
        title: string,
        media_index: number,
        grandparent_title: string,
        parent_title: string,
        parent_media_index: number,
        paused_counter: number,
        rating_key: number,
        parent_rating_key: number,
        grandparent_rating_key: number,
        media_type: 'movie' | 'episode',
        percent_complete: number,
      }[],
      draw: number,
      filter_duration: string,
      total_duration: string;
    }
  }
}

interface MetadataPayload {
  response: {
    result: string,
    message: string | null,
    data: {
      guids: string[]
      grandparent_guids: string[]
    }
  }
}

function getDate(numericDate: number) {
  const d = new Date(numericDate * 1000);
  return [d.getFullYear(), '-', d.getMonth() + 1, '-', d.getDate(), ' ', d.getHours(), ':', d.getMinutes(), ':', d.getSeconds()].map((x) => {
    if (typeof x === 'number') {
      return `${x}`.padStart(2, '0')
    }
    return x
  }).join('')
}

export function getApiCmd(cmd: string, params?: Record<string, string | number>): string {
  const q = {
    apikey: process.env.TAUTILLI_API_KEY,
    user: process.env.PLEX_USER,
    cmd,
    ...params,
  }
  return API_BASE + "?" + new URLSearchParams((Object.keys(q) as (keyof typeof q)[]).map((key) => [key, q[key]])).toString();
}

function formatGuids(guidsList: string[]): Record<string, string | number> {
  return guidsList.reduce((acc, guid) => {
    const [idKey, idValue] = guid.split('://')
    return {
      ...acc,
      [idKey]: /^[0-9]+$/.exec(idValue) ? parseInt(idValue, 10) : idValue
    }
  }, {} as Record<string, number | string>)

}

export async function getHistory(before?: string, updatePayload: UploadPayload = { movies: [], episodes: [] }): Promise<UploadPayload> {
  const params: Record<string, any> = {};
  if (before) {
    params.before = before;
    console.log('Looking before: ', before)
  }

  const url = getApiCmd('get_history', params);
  const response = await fetch(url)
  const data = (await response.json()) as HistoryPayload

  const results = data.response.data.data;

  if (!results.length) {
    return updatePayload;
  }

  let earliestDate: number;

  for (let entry of results) {
    if (entry.percent_complete <= 90) {
      continue;
    }
    const mediaKey = entry.media_type === 'movie' ? 'movies' : 'episodes';
    const entryResponse = await fetch(getApiCmd('get_metadata', { rating_key: entry.rating_key }))
    const entryData = (await entryResponse.json()) as MetadataPayload
    const { guids, grandparent_guids } = entryData.response.data;

    if (!earliestDate || entry.date < earliestDate) {
      earliestDate = entry.date;
    }

    if (!guids || !guids.length) {
      continue
    }

    switch (mediaKey) {
      case 'episodes':
        updatePayload[mediaKey].push({
          title: entry.grandparent_title,
          ids: formatGuids(grandparent_guids),
          seasons: [
            {
              number: entry.parent_media_index,
              episodes: [
                {
                  number: entry.media_index,
                  watched_at: getDate(entry.date),
                }
              ]
            }
          ]
        })
        break;

      case 'movies':
        const ids = guids.reduce((acc, guid) => {
          const [idKey, idValue] = guid.split('://')
          return {
            ...acc,
            [idKey]: /^[0-9]+$/.exec(idValue) ? parseInt(idValue, 10) : idValue
          }
        }, {} as Record<string, number | string>)
        updatePayload[mediaKey].push({
          title: entry.title,
          watched_at: getDate(entry.date),
          ids
        })
        break;
    }
  }

  if (getDate(earliestDate) === before) {
    return updatePayload
  }
  return getHistory(getDate(earliestDate), updatePayload)
}