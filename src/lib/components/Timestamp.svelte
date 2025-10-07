<script>
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc";
  import timezone from "dayjs/plugin/timezone";

  dayjs.extend(utc);
  dayjs.extend(timezone);

  let { timestamp } = $props();

  let userTimezone = dayjs.tz.guess();
</script>

<time datetime={timestamp}>
  {dayjs(timestamp).tz(userTimezone).format("MMMM D, YYYY [at] h:mm a")}
</time>
