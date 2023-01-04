interface UploadEntry {
    title?: string;
    watched_at?: string;
    ids: Record<string, number | string>;
    seasons?: {
        watched_at?: string;
        number: number;
        episodes: {
            number: number;
            watched_at?: string;
        }[];
    }[];
}
export interface UploadPayload {
    [key: string]: UploadEntry[];
}
export declare function getAuthToken(): Promise<string>;
export declare function updateHistory(body: UploadPayload): Promise<import("node-fetch").Response>;
export {};
//# sourceMappingURL=simkl.d.ts.map