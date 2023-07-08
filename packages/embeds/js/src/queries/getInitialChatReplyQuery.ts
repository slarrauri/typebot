import { InitialChatReply } from '@/types'
import { guessApiHost } from '@/utils/guessApiHost'
import type { SendMessageInput, StartParams } from '@typebot.io/schemas'
import { isNotDefined, isNotEmpty, sendRequest } from '@typebot.io/lib'

export async function getInitialChatReplyQuery({
  typebot,
  isPreview,
  apiHost,
  prefilledVariables,
  startGroupId,
  resultId,
}: StartParams & {
  apiHost?: string
}) {
  if (isNotDefined(typebot))
    throw new Error('Typebot ID is required to get initial messages')

  return sendRequest<InitialChatReply>({
    method: 'POST',
    url: `${isNotEmpty(apiHost) ? apiHost : guessApiHost()}/api/v1/sendMessage`,
    body: {
      startParams: {
        isPreview,
        typebot,
        prefilledVariables,
        startGroupId,
        resultId,
        isStreamEnabled: true,
      },
    } satisfies SendMessageInput,
  })
}
