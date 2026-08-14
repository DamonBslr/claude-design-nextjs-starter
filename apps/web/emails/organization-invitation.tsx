import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components"

import { APP_NAME } from "@/lib/app-config"

export function OrganizationInvitationEmail({
  acceptUrl,
  invitedByEmail,
  invitedByName,
  organizationName,
}: {
  acceptUrl: string
  invitedByEmail: string
  invitedByName: string
  organizationName: string
}) {
  return (
    <Html>
      <Head />
      <Preview>
        Join {organizationName} in {APP_NAME}
      </Preview>
      <Body>
        <Container>
          <Heading>Join {organizationName}</Heading>
          <Text>
            {invitedByName} ({invitedByEmail}) invited you to join their
            organization in {APP_NAME}.
          </Text>
          <Text>
            <Link href={acceptUrl}>Accept the invitation</Link>
          </Text>
          <Hr />
          <Text>
            This invitation expires in 48 hours. Sign up or sign in with the
            email address that received this message.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
