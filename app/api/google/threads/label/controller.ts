import { z } from "zod";
import { getSession } from "@/utils/auth";
import { getGmailClient } from "@/utils/google";
import { INBOX_LABEL_ID } from "@/utils/label";

export const labelThreadBody = z.object({
  threadId: z.string(),
  labelId: z.string(),
  archive: z.boolean(),
});
export type LabelThreadBody = z.infer<typeof labelThreadBody>;
export type LabelThreadResponse = Awaited<ReturnType<typeof labelThread>>;

export async function labelThread(body: LabelThreadBody) {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");

  const gmail = getGmailClient(session);

  const res = await gmail.users.threads.modify({
    userId: "me",
    id: body.threadId,
    requestBody: {
      addLabelIds: [body.labelId],
      removeLabelIds: body.archive ? [INBOX_LABEL_ID] : [],
    },
  });
  const thread = res.data;

  return { thread };
}