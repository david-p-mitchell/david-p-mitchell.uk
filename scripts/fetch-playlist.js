import fs from "fs/promises";

const playlist = "PL4eoRWZvm-i1RhwritYSbfqVCTD8jDmQV";
const key = process.env.YOUTUBE_API_KEY;

if (!key) {
    throw new Error("Missing YOUTUBE_API_KEY");
}

let pageToken = "";
const videos = [];

do {
    const url =
        `https://www.googleapis.com/youtube/v3/playlistItems` +
        `?part=snippet` +
        `&playlistId=${playlist}` +
        `&maxResults=50` +
        `&pageToken=${pageToken}` +
        `&key=${key}`;

    const res = await fetch(url);
    const json = await res.json();

    if (!res.ok) {
        console.error(json);
        process.exit(1);
    }

    videos.push(
        ...json.items.map(v => ({
            id: v.snippet.resourceId.videoId,
            title: v.snippet.title,
            published: v.snippet.publishedAt,
            thumbnail: v.snippet.thumbnails.high.url
        }))
    );

    pageToken = json.nextPageToken ?? "";

} while (pageToken);

await fs.mkdir("src/data", { recursive: true });

await fs.writeFile(
    "src/data/videos.json",
    JSON.stringify(videos, null, 2)
);

console.log(`Fetched ${videos.length} videos`);