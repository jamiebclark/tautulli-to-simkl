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

interface UploadPayload {
  [key: string]: UploadEntry[]
}

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