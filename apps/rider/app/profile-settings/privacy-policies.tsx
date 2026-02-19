import { Regular, SemiBold } from "@brocabs/ui/text";
import { useMemo } from "react";
import { ScrollView } from "react-native";

import { Column, Container, Fill, Row } from "@brocabs/ui/layout";
import { RichText } from "~/shared/ui/rich-text";

export default function PrivacyPoliciesScreen() {
  const policies = useMemo(
    () => [
      {
        id: "introduction",
        title: "Introduction",
        body: 'This Privacy Policy applies to all users of Bro Cabs, including Riders, Drivers (and applicants), and all Bro Cabs platforms and services (collectively, the "Platform"). Your use of the Platform is also subject to our Terms of Service.',
      },
      {
        id: "applicable-law",
        title: "Applicable Law",
        body: "We comply with the Protection of Personal Information Act 4 of 2013 (POPIA), Electronic Communications and Transactions Act 25 of 2002 (ECTA), Consumer Protection Act 68 of 2008 (CPA), Promotion of Access to Information Act 2 of 2000 (PAIA), and other applicable South African legislation.",
      },
      {
        id: "information-collect",
        title: "Information We Collect",
        body: "We collect information you provide, usage and device data, and information from third-party sources.",
      },
      {
        id: "information-provide",
        title: "Information You Provide",
        body: "Account registration (name, email, phone, birth date, payment info, profile photo, preferences). Ride history, ratings, feedback, SOS contacts, and communications with drivers and support.",
      },
      {
        id: "usage-device-data",
        title: "Usage and Device Data",
        body: "Location data (GPS, WiFi) during ride requests and active trips. Ride history, payments, promotional codes. Device identifiers, IP, browser, OS, carrier, advertising IDs, and sensor data.",
      },
      {
        id: "third-party-sources",
        title: "Third-Party Sources",
        body: "Payment processors, loyalty programs, enterprise programs, concierge and referral services, and social media platforms (if you connect your account).",
      },
      {
        id: "how-we-use",
        title: "How We Use Your Information",
        body: "To provide and operate the Platform, match you with drivers, process payments, ensure safety and security, improve services, send ride updates, and comply with legal obligations.",
      },
      {
        id: "legal-basis",
        title: "Legal Basis",
        body: "Processing is based on consent, contractual necessity, legal obligation, or legitimate interest under POPIA.",
      },
      {
        id: "sharing-disclosure",
        title: "Sharing and Disclosure",
        body: "We share data with drivers (for ride matching), service providers, payment processors, legal authorities, in corporate transactions, and as directed by you.",
      },
      {
        id: "data-retention",
        title: "Data Retention",
        body: "Profile data retained until deletion; transactional records retained for at least seven years; other data per legal requirements.",
      },
      {
        id: "your-rights",
        title: "Your Rights",
        body: "Under POPIA, PAIA, and ECTA you have rights to access, correction, deletion, restriction, objection, and withdrawal of consent; and may lodge complaints with the Information Regulator.",
      },
      {
        id: "security",
        title: "Security",
        body: "We implement reasonable technical and organizational measures to protect personal data, including encryption of payment information and secure transmission of location data.",
      },
      {
        id: "children",
        title: "Children's Privacy",
        body: "We do not knowingly collect data from individuals under 13. We will delete any such data upon discovery.",
      },
      {
        id: "policy-changes",
        title: "Changes to Policy",
        body: "We may update this Policy; major changes will be communicated through the Platform or email.",
      },
      {
        id: "contact",
        title: "Contact Us",
        body: "Bro Cabs (Pty) Ltd\n1 Eloff Street, Marshalltown, Johannesburg, 2000\nEmail: privacy@brocabs.co.za",
      },
    ],
    []
  );

  return (
    <Fill backgroundColor="Bg Color">
      <Container px={20} flex={1} justifyContent="space-between">
        <Column flex={1}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}>
            <Column gap={18}>
              <Column gap={10}>
                <SemiBold fontSize={16} color="Primary/50">
                  Privacy Policy - Bro Cabs (Pty) Ltd
                </SemiBold>
                <Regular fontSize={14} lineHeight={24} color="Neutrals/600">
                  Last updated: July 12, 2025
                </Regular>
              </Column>

              {policies.map((policy, index) => (
                <Column key={policy.id} gap={6}>
                  <Row gap={10}>
                    <SemiBold fontSize={18} color="Primary/50">
                      {index + 1}.
                    </SemiBold>
                    <SemiBold fontSize={18} color="Primary/50">
                      {policy.title}
                    </SemiBold>
                  </Row>
                  <Container px={26}>
                    <RichText color="Neutrals/600">{policy.body}</RichText>
                  </Container>
                </Column>
              ))}
            </Column>
          </ScrollView>
        </Column>
      </Container>
    </Fill>
  );
}
