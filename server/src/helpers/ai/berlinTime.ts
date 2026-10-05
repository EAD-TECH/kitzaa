import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const BERLIN_TIME_ZONE = "Europe/Berlin";

export const berlinNow = () => dayjs().tz(BERLIN_TIME_ZONE);

export const berlinDate = (specificDate: string) =>
  dayjs.tz(specificDate, "YYYY-MM-DD", BERLIN_TIME_ZONE);
