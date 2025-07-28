import { LOOPS_COOKIE, LOOPS_LIST_ID } from "astro:env/server";
const placeholderAudienceCount = 1234;


export const withCommas = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function formatDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).formatToParts(date);

  let day = parts.find((p) => p.type === "day")?.value ?? "";

  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";

  return `${month} ${day}, ${year}`;
}

export async function getAudienceCount() {
  if (!LOOPS_COOKIE || !LOOPS_LIST_ID) {
    console.warn(
      "No LOOPS_COOKIE or LOOPS_LIST_ID found. Using placeholder audience count."
    );
    return placeholderAudienceCount;
  }
  try {
    const body = {
      json: {
        filter: null,
        subscribedToTeam: false,
        subscribedToList: true,
        mailingListId: LOOPS_LIST_ID,
        direction: "forward",
      },
    };
    const response = await fetch(
      `https://app.loops.so/api/trpc/emailMessages.streamAudienceCount?input=${encodeURIComponent(JSON.stringify(body))}`,
      {
        headers: {
          "content-type": "application/json",
          cookie: LOOPS_COOKIE,
        },
      }
    );
    const data = await response.json();
    return data.result.data.json.count as number;
  } catch (error) {
    console.error("Error fetching audience count:", error);
    return placeholderAudienceCount;
  }
}
