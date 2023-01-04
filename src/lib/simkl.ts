import dotenv from "dotenv";
dotenv.config()

import fs from 'fs';
import fetch from 'node-fetch';

interface AuthPayload {
  result: string;
  device_code: number;
  user_code: string;
  verification_url: string;
  expires_in: number;
  interval: number;
}

interface CheckinSuccessPayload {
  result: 'OK'
  access_token: string
}

interface CheckinWaitPayload {
  result: 'KO'
  message: string;
}

type CheckinPayload = CheckinSuccessPayload | CheckinWaitPayload


interface UploadEntry {
  title?: string,
  watched_at?: string,
  ids: Record<string, number | string>,
  seasons?: {
    watched_at?: string,
    number: number,
    episodes: {
      number: number,
      watched_at?: string,
    }[]
  }[]
}

export interface UploadPayload {
  [key: string]: UploadEntry[]
}


const AUTH_TOKEN_FILE_PATH = './auth.json'

// https://api.simkl.com/oauth/pin?client_id=***&redirect=http%3A%2F%2Fyourdomain.com%2Fwelcome
async function getAuthCode() {
  const apiUrl =
    "https://api.simkl.com/oauth/pin?" +
    new URLSearchParams([
      ["client_id", process.env.SIMKL_CLIENT_ID],
    ]).toString();
  return fetch(apiUrl);
}

export async function getAuthToken(): Promise<string> {
  return new Promise(async (resolve, reject) => {

    if (fs.existsSync(AUTH_TOKEN_FILE_PATH)) {
      const authTokenFile = JSON.parse(fs.readFileSync(AUTH_TOKEN_FILE_PATH, 'utf-8'))
      return resolve(authTokenFile.access_token)
    }

    const response = await getAuthCode();
    const authPayload = (await response.json()) as AuthPayload

    console.log(`To authorize, visit: ${authPayload.verification_url} and enter the code ${authPayload.user_code}`)

    let timer = 0;
    const intervalTimer = authPayload.interval * 1000;
    const intervalExpires = authPayload.expires_in * 1000;

    const interval = setInterval(async () => {
      const response = await fetch(`https://api.simkl.com/oauth/pin/${authPayload.user_code}?client_id=${process.env.SIMKL_CLIENT_ID}`)
      const checkinPayload = (await response.json()) as CheckinPayload;
      if (checkinPayload.result === 'OK') {
        fs.writeFileSync(AUTH_TOKEN_FILE_PATH, JSON.stringify(checkinPayload), "utf-8")
        resolve(checkinPayload.access_token)
        clearInterval(interval)
      }
      timer += intervalTimer
      if (timer >= intervalExpires) {
        reject('Timeout')
      }
    }, intervalTimer)
  })
}

export async function updateHistory(body: UploadPayload) {
  const token = await getAuthToken();
  return fetch('https://api.simkl.com/sync/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'simkl-api-key': process.env.SIMKL_CLIENT_ID,
    },
    body: JSON.stringify(body)
  })
}