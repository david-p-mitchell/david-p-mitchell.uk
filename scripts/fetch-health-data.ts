import fs from 'node:fs/promises';
import path from 'node:path';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!;
const DEBUG = process.env.GOOGLE_HEALTH_DEBUG === '1';

const DATA_OUT_PATH = path.join(process.cwd(), 'src/data/health.json');

type DataSourceFamily = 'all-sources' | 'google-wearables' | 'google-sources';

interface DayMetrics {
  date: string;
  activeZoneMinutes: number;
  distanceKm: number;
  distanceMiles: number;
}

interface RangeMetrics {
  rangeStart: string;
  rangeEnd: string;
  activeZoneMinutes: number;
  distanceKm: number;
  distanceMiles: number;
}

// ---------- Date helpers ----------

function civilDate(d: Date) {
  return { date: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() } };
}

function formatLocalDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function metersFromMillimeters(mm: number) {
  return {
    km: Number((mm / 1_000_000).toFixed(2)),
    miles: Number((mm * 0.000000621371).toFixed(2)),
  };
}

// ---------- Auth ----------

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${await res.text()}`);
  const { access_token } = await res.json();
  return access_token;
}

// ---------- Core API call ----------

async function rollUp(
  accessToken: string,
  dataType: string,
  start: Date,
  end: Date,
  dataSourceFamily?: DataSourceFamily
) {
  const body: Record<string, unknown> = {
    range: { start: civilDate(start), end: civilDate(end) },
  };
  if (dataSourceFamily) {
    body.dataSourceFamily = `users/me/dataSourceFamilies/${dataSourceFamily}`;
  }

  const res = await fetch(
    `https://health.googleapis.com/v4/users/me/dataTypes/${dataType}/dataPoints:dailyRollUp`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`${dataType} rollup failed: ${await res.text()}`);
  const json = await res.json();

  return json;
}

// active-minutes and active-zone-minutes cap at 14 days/request; distance allows 90.
async function rollUpChunked(
  accessToken: string,
  dataType: string,
  start: Date,
  end: Date,
  maxDays: number,
  dataSourceFamily?: DataSourceFamily
): Promise<any[]> {
  const allPoints: any[] = [];
  let chunkStart = new Date(start);

  while (chunkStart < end) {
    const chunkEnd = new Date(chunkStart);
    chunkEnd.setDate(chunkEnd.getDate() + maxDays);
    if (chunkEnd > end) chunkEnd.setTime(end.getTime());

    const res = await rollUp(accessToken, dataType, chunkStart, chunkEnd, dataSourceFamily);
    const points = (res.rollupDataPoints ?? []).map((point:any) => ({
        ...point,
        date: chunkStart // or chunkStart.toISOString()
        }));

    allPoints.push(...points);

    chunkStart = chunkEnd;
  }

  return allPoints;
}

// ---------- Extraction ----------

// Fitbit's Active Zone Minutes formula weights Cardio/Peak minutes at 2x Fat Burn minutes.
// Set WEIGHT_CARDIO_PEAK to false if you want raw, unweighted minutes instead.
const WEIGHT_CARDIO_PEAK = true;

function extractActiveZoneMinutes(points: any[]): number {
  return points.reduce((sum, p) => {
    const azm = p.activeZoneMinutes;
    if (!azm) return sum;

    const fatBurn = Number(azm.sumInFatBurnHeartZone ?? 0);
    const cardio = Number(azm.sumInCardioHeartZone ?? 0);
    const peak = Number(azm.sumInPeakHeartZone ?? 0);
    return sum + fatBurn + (cardio) + (peak );
  }, 0);
}

function extractDistanceMillimeters(points: any[]): number {
  return points.reduce((sum, p) => sum + Number(p.distance?.millimetersSum ?? 0), 0);
}

// ---------- Public functions ----------

async function getDayMetrics(dateStr: string, dataSourceFamily?: DataSourceFamily): Promise<DayMetrics> {
  const accessToken = await getAccessToken();
  const [y, m, d] = dateStr.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const end = new Date(y, m - 1, d + 1); // end is inclusive, so subtract 1ms to stay in the same day

  const [azmPoints, distPoints] = await Promise.all([
    rollUpChunked(accessToken, 'active-zone-minutes', start, end, 14, dataSourceFamily),
    rollUpChunked(accessToken, 'distance', start, end, 90, dataSourceFamily),
  ]);

  const distanceMm = extractDistanceMillimeters(distPoints);
  const { km, miles } = metersFromMillimeters(distanceMm);

  return {
    date: dateStr,
    activeZoneMinutes: extractActiveZoneMinutes(azmPoints),
    distanceKm: km,
    distanceMiles: miles,
  };
}

async function getMonthToDateMetrics(dataSourceFamily?: DataSourceFamily): Promise<RangeMetrics> {
  const accessToken = await getAccessToken();
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now);
  end.setDate(end.getDate() + 1); // end is inclusive, so add 1 day to include today
  end.setHours(23, 59, 59, 999); // Set to the end of the day

  const [azmPoints, distPoints] = await Promise.all([
    rollUpChunked(accessToken, 'active-zone-minutes', start, end, 14, dataSourceFamily),
    rollUpChunked(accessToken, 'distance', start, end, 90, dataSourceFamily),
  ]);

  const distanceMm = extractDistanceMillimeters(distPoints);
  const { km, miles } = metersFromMillimeters(distanceMm);

  return {
    rangeStart: formatLocalDate(start),
    rangeEnd: formatLocalDate(end),
    activeZoneMinutes: extractActiveZoneMinutes(azmPoints),
    distanceKm: km,
    distanceMiles: miles,
  };
}

// ---------- Build entry point ----------

async function main() {
  const today = formatLocalDate(new Date());

  try {
    console.log('Fetching Google Health stats...');

    const [todayMetrics, monthToDate] = await Promise.all([
      getDayMetrics(today),
      getMonthToDateMetrics(),
    ]);

    const payload = {
      updatedAt: new Date().toISOString(),
      today: todayMetrics,
      monthToDate,
    };

    await fs.mkdir(path.dirname(DATA_OUT_PATH), { recursive: true });
    await fs.writeFile(DATA_OUT_PATH, JSON.stringify(payload, null, 2));
    console.log('Saved health metrics successfully:', payload);
  } catch (error) {
    console.error('Error fetching health stats:', error);
    const fallback = {
      updatedAt: new Date().toISOString(),
      today: { date: today, activeZoneMinutes: 0, distanceKm: 0, distanceMiles: 0 },
      monthToDate: { rangeStart: '', rangeEnd: '', activeZoneMinutes: 0, distanceKm: 0, distanceMiles: 0 },
      error: true,
    };
    await fs.writeFile(DATA_OUT_PATH, JSON.stringify(fallback, null, 2));
  }
}

main();