export interface ForecastItem {
  date: string;
  temp: number;
  icon: string;
  condition: string;
}

export interface FiveDayForecastEntry {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
    main: string;
  }[];
}

export interface SixteenDayForecastEntry {
  dt: number; // unix timestamp
  temp: {
    day: number;
  };
  weather: {
    icon: string;
    main: string;
  }[];
}
