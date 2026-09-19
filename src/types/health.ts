export interface ActivityMetrics {
  activeZoneMinutes: number;
  distanceKm: number;
  distanceMiles: number;
}

export interface DailyActivity extends ActivityMetrics {
  date: string;
}

export interface MonthToDateActivity extends ActivityMetrics {
  rangeStart: string;
  rangeEnd: string;
}

export interface ActivitySummary {
  updatedAt: string;
  today: DailyActivity;
  monthToDate: MonthToDateActivity;
}