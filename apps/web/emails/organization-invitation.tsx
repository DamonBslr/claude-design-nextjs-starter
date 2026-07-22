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
      <Preview>Join {organizationName} in Planwise</Preview>
      <Body>
        <Container>
          <Heading>Join {organizationName}</Heading>
          <Text>
            {invitedByName} ({invitedByEmail}) invited you to join their
            organization in Planwise.
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
