import { Alert, AlertIcon, Button, Link, Stack, Text } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@/components/icons'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import {
  PabblyConnectBlock,
  Webhook,
  WebhookOptions,
} from '@typebot.io/schemas'
import React, { useState } from 'react'
import { byId } from '@typebot.io/lib'
import { WebhookAdvancedConfigForm } from '../../webhook/components/WebhookAdvancedConfigForm'
import { TextInput } from '@/components/inputs'

type Props = {
  block: PabblyConnectBlock
  onOptionsChange: (options: WebhookOptions) => void
}

export const PabblyConnectSettings = ({
  block: { webhookId, id: blockId, options },
  onOptionsChange,
}: Props) => {
  const { webhooks, updateWebhook } = useTypebot()

  const [localWebhook, _setLocalWebhook] = useState(
    webhooks.find(byId(webhookId))
  )

  const setLocalWebhook = async (newLocalWebhook: Webhook) => {
    if (options.webhook) {
      onOptionsChange({
        ...options,
        webhook: newLocalWebhook,
      })
      return
    }
    _setLocalWebhook(newLocalWebhook)
    await updateWebhook(newLocalWebhook.id, newLocalWebhook)
  }

  const handleUrlChange = (url: string) =>
    localWebhook &&
    setLocalWebhook({
      ...localWebhook,
      url,
    })

  const url = options.webhook?.url ?? localWebhook?.url

  return (
    <Stack spacing={4}>
      <Alert status={url ? 'success' : 'info'} rounded="md">
        <AlertIcon />
        {url ? (
          <>Your scenario is correctly configured 🚀</>
        ) : (
          <Stack>
            <Text>Head up to Pabbly Connect to get the webhook URL:</Text>
            <Button
              as={Link}
              href="https://www.pabbly.com/connect/integrations/typebot/"
              isExternal
              colorScheme="blue"
            >
              <Text mr="2">Pabbly.com</Text> <ExternalLinkIcon />
            </Button>
          </Stack>
        )}
      </Alert>
      <TextInput
        placeholder="Paste webhook URL..."
        defaultValue={url ?? ''}
        onChange={handleUrlChange}
        withVariableButton={false}
        debounceTimeout={0}
      />
      {(localWebhook || options.webhook) && (
        <WebhookAdvancedConfigForm
          blockId={blockId}
          webhook={(options.webhook ?? localWebhook) as Webhook}
          options={options}
          onWebhookChange={setLocalWebhook}
          onOptionsChange={onOptionsChange}
        />
      )}
    </Stack>
  )
}
