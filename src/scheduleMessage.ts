import { Methods } from "@slack/web-api";
import { DateTime } from "luxon";

export async function scheduleLunchMessage(chat: Methods["chat"]) {
  const response = await chat.scheduledMessages.list();

  if (response.scheduled_messages?.length !== 0) {
    return;
  }

  const date = DateTime
    .now()
    .setZone("Europe/Paris")
    .startOf("day")
    .plus({ days: 1, hours: 11, minutes: 30 })
    .toUnixInteger();

  await chat.scheduleMessage({
    channel: process.env.CHANNEL_ID as string,
    post_at: date,
    text: "What do we eat for lunch today ? :thinking_face:"
  });
}
