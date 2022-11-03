import { Methods } from "@slack/web-api";
import { DateTime } from "luxon";
import mergeInto from "@/utils/merge";

export type ScheduleMessageOptions = {
  zone?: string,
  post_at?: {
    days?: number,
    hours?: number,
    minutes?: number,
  },
  text?: string,
}

const defaultOptions: ScheduleMessageOptions = {
  zone: "Europe/Paris",
  post_at: {
    days: 1,
    hours: 11,
    minutes: 30,
  },
  text: "What do we eat for lunch today ? :thinking_face:",
};

/**
 * @param {Methods["chat"]} chat 
 * @param {scheduleMessageOptions=} options defaultOptions
 */
export async function scheduleLunchMessage(
  chat: Methods["chat"],
  options: ScheduleMessageOptions = defaultOptions
): Promise<void> {
  const response = await chat.scheduledMessages.list();

  if (response.scheduled_messages?.length !== 0) {
    return;
  }

  const mergedOptions = mergeInto(defaultOptions, options);

  const date = DateTime
    .now()
    .setZone(mergedOptions.zone)
    .startOf("day")
    .plus({
      days: mergedOptions.post_at?.days,
      hours: mergedOptions.post_at?.hours,
      minutes: mergedOptions.post_at?.minutes,
    })
    .toUnixInteger();

  await chat.scheduleMessage({
    channel: process.env.CHANNEL_ID as string,
    post_at: date,
    text: mergedOptions.text
  });
}
