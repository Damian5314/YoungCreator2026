import { COMPANY, COMPANY_ADDRESS } from '@/shared/constants/company';

/*
 * Privacybeleid en algemene voorwaarden. Unlisted is een product van TechTable; de bedrijfsgegevens
 * komen uit src/shared/constants/company.ts. Laat wijzigingen juridisch controleren en pas daarna
 * `updated` aan. Een sectie heeft alinea's (`body`) en/of een opsomming (`list`).
 */
export interface LegalSection {
  id: string;
  heading: string;
  body?: string[];
  list?: string[];
}

export interface LegalDocument {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
}

const companyLine = `${COMPANY.legalName}, ${COMPANY_ADDRESS}, ${COMPANY.country.en}`;

const privacy: LegalDocument = {
  metaTitle: 'Privacy Policy',
  metaDescription: `How ${COMPANY.product} (a product of ${COMPANY.legalName}) handles your personal data.`,
  eyebrow: 'Legal',
  title: 'Privacy Policy',
  updated: '28 September 2026',
  intro: [
    `${COMPANY.product} is a product of ${COMPANY.legalName}, registered with the Dutch Chamber of Commerce (KvK) under number ${COMPANY.kvk}. ${COMPANY.legalName} is the controller for the processing of personal data described in this policy.`,
    'We only process what we need to run Unlisted, we never sell your data, and you stay in control of your profile, your CV and the emails you send.',
  ],
  sections: [
    {
      id: 'who-we-are',
      heading: '1. Who we are',
      list: [
        companyLine,
        `Chamber of Commerce (KvK): ${COMPANY.kvk}`,
        `VAT ID: ${COMPANY.vatId}`,
        `Email: ${COMPANY.email}`,
        `Phone: ${COMPANY.phone}`,
      ],
    },
    {
      id: 'data',
      heading: '2. What data we process',
      list: [
        'Account data: your name, email address and password (stored hashed by our authentication provider).',
        'Profile data: your study, skills, languages, work experience, preferred locations, the types of opportunities you are looking for and your search preferences.',
        'CV: the PDF you upload, the text we extract from it and the structured summary (education, experience, skills) we derive from it.',
        'Search and match data: your searches, the companies and opportunity signals we find for you, your match scores and what you save or dismiss.',
        'Outreach data: email drafts, the recipients you choose, and the status of emails that are sent.',
        'Payment data: the credit packs you buy, amounts and payment status. Card or bank details are handled by our payment provider; we never see or store them.',
        'Technical data: IP address, browser type and server logs, needed to keep the service secure and working.',
      ],
    },
    {
      id: 'purposes',
      heading: '3. Why we use your data and on what legal basis',
      list: [
        'To provide Unlisted: create your account, run your searches, show matches and prepare outreach (performance of a contract).',
        'To process payments and keep invoice records (performance of a contract and a legal obligation).',
        'To keep the service secure, prevent abuse and fix errors (legitimate interest).',
        'To send service emails, such as account and payment messages (performance of a contract).',
      ],
      body: [
        'We do not send marketing emails and we never sell your data to third parties.',
      ],
    },
    {
      id: 'profiling',
      heading: '4. Matching, AI and profiling',
      body: [
        'Unlisted compares your profile with public company signals (such as news, funding, hiring activity and expansion) to suggest companies that may be worth contacting. Part of this is done with rules and part with AI models. This is a form of profiling.',
        'Match scores and suggestions are indicative. An opportunity signal is not a confirmed vacancy, and AI can make mistakes. The scoring does not lead to decisions with legal or similarly significant effects for you: you always decide yourself whether to contact a company.',
        'You can change or delete your profile and CV at any time, and remove matches you do not want.',
      ],
    },
    {
      id: 'outreach',
      heading: '5. Emails to companies',
      body: [
        'If you choose to send an email to a company through Unlisted, we process the recipient address, the content of the email and its delivery status. Emails are only sent after you send or approve them yourself, or when you have explicitly turned on automatic sending for your agent, within the daily limit you set. You are responsible for the content of the emails you send.',
        'To find companies and public business contact details, we use publicly available sources on the web. We do not use these details for any other purpose than your search.',
      ],
    },
    {
      id: 'processors',
      heading: '6. Who we share data with',
      body: [
        'We use a limited number of processors. Each only receives the data needed for its task and is bound by a data processing agreement or equivalent terms.',
      ],
      list: [
        'Supabase — database, authentication and file storage (CV).',
        'Vercel — hosting of the website and application, including server logs.',
        'OpenAI and/or Anthropic — AI processing of your CV, search results, match scores and email drafts. We do not allow these providers to use your data to train their models.',
        'n8n — automation of searches and email delivery.',
        'Apify — collecting public company information and business contact details from the web.',
        'Google (Gmail / Google Workspace) — sending and receiving email.',
        'Mollie — payment processing for credit packs.',
      ],
    },
    {
      id: 'transfers',
      heading: '7. Transfers outside the EU',
      body: [
        'Some of these providers are based in, or use servers in, the United States. In those cases transfers take place with appropriate safeguards, such as the EU-US Data Privacy Framework and/or Standard Contractual Clauses.',
      ],
    },
    {
      id: 'retention',
      heading: '8. How long we keep data',
      list: [
        'Account, profile, CV, search and outreach data: as long as your account exists. When you delete your account, we delete this data or make it anonymous within 30 days.',
        'Payment and invoice data: seven years, due to Dutch statutory retention obligations.',
        'Contact with our support: up to two years after our last contact.',
        'Server logs: for a limited period, only as long as needed for security and troubleshooting.',
      ],
    },
    {
      id: 'cookies',
      heading: '9. Cookies',
      body: [
        'Unlisted only uses functional cookies: to keep you signed in, to remember your language preference and to show the opening animation only once per visit. We do not use tracking, advertising or analytics cookies.',
      ],
    },
    {
      id: 'rights',
      heading: '10. Your rights',
      body: [
        `You have the right to access, correct or delete your personal data, to restrict processing, to object to processing and to data portability. To exercise these rights, email ${COMPANY.email}; we respond within four weeks.`,
        'If you are unhappy with how we handle your data, you can file a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens, autoriteitpersoonsgegevens.nl).',
      ],
    },
    {
      id: 'security',
      heading: '11. Security',
      body: [
        'We take appropriate technical and organisational measures to protect your data, such as encrypted connections (HTTPS/TLS), access control per user and restricted access to production data.',
      ],
    },
    {
      id: 'changes',
      heading: '12. Changes',
      body: [
        'We may update this privacy policy. The current version is always available on this page. If a change materially affects you, we will let you know by email.',
      ],
    },
  ],
};

const terms: LegalDocument = {
  metaTitle: 'Terms of Service',
  metaDescription: `The terms for using ${COMPANY.product}, a product of ${COMPANY.legalName}.`,
  eyebrow: 'Legal',
  title: 'Terms of Service',
  updated: '28 September 2026',
  intro: [
    `These terms apply to the use of ${COMPANY.product} by students and other private users. ${COMPANY.product} is a product of ${COMPANY.legalName} (${companyLine}, KvK ${COMPANY.kvk}, VAT ID ${COMPANY.vatId}).`,
    'By creating an account you agree to these terms. Please read them carefully.',
  ],
  sections: [
    {
      id: 'definitions',
      heading: '1. Definitions',
      list: [
        `We / us: ${COMPANY.legalName}, the provider of ${COMPANY.product}.`,
        `You: the person who creates an account and uses ${COMPANY.product}.`,
        'Search: one run of the Unlisted agent that looks for companies and opportunity signals matching your profile and preferences, started by you or automatically on your schedule.',
        'Credit: a prepaid unit that you use to start a search. One search costs one credit.',
        'Opportunity signal: public information about a company (such as news, funding, hiring activity or expansion) that may indicate it is worth contacting. A signal is not a confirmed vacancy.',
        'Outreach: an email to a company that Unlisted helps you write and, if you choose, send.',
      ],
    },
    {
      id: 'service',
      heading: '2. The service',
      body: [
        'Unlisted helps you discover companies that may be interesting to contact, based on public company signals and your profile, and helps you write personal outreach.',
        'We do not guarantee that a search returns results, that a company has an open position, or that contacting a company leads to a job, internship or reply. Match scores and suggestions are indicative, partly generated by AI, and may contain mistakes. Always check important information yourself.',
      ],
    },
    {
      id: 'account',
      heading: '3. Your account',
      list: [
        'You must be at least 16 years old to create an account.',
        'Provide accurate information and keep your password confidential. You are responsible for activity through your account.',
        `Let us know at ${COMPANY.email} as soon as possible if you suspect misuse of your account.`,
        'One account per person. Accounts are personal and may not be transferred.',
      ],
    },
    {
      id: 'credits',
      heading: '4. Credits and prices',
      list: [
        'Your first search is free: every new account receives one free credit.',
        'After that you buy credits in one-off credit packs. There is no subscription and nothing renews automatically.',
        'Prices are shown in euros, including VAT, before you pay.',
        'One search costs one credit, also when a search finds zero results.',
        'If a search fails because of a technical error on our side, the credit is automatically returned to your balance.',
        'Credits do not expire while your account exists. Credits have no cash value and cannot be transferred or exchanged for money, except as described under "Right of withdrawal and refunds".',
        'Payments are processed by Mollie. Credits are added to your balance as soon as the payment is confirmed.',
      ],
    },
    {
      id: 'withdrawal',
      heading: '5. Right of withdrawal and refunds',
      body: [
        'As a consumer you normally have 14 days to withdraw from a purchase made online. Credits are digital content that is delivered immediately after payment. When you buy credits, you ask us to deliver them immediately and you acknowledge that you lose your right of withdrawal once the credits have been added to your balance.',
        `Unused credits from a pack you bought in the last 14 days can still be refunded on request as a courtesy, as long as none of the credits from that pack have been used. Email ${COMPANY.email} with the date and amount of your purchase.`,
        'This does not affect your statutory rights if the service does not conform to the agreement.',
      ],
    },
    {
      id: 'use',
      heading: '6. Acceptable use',
      body: ['You may only use Unlisted for your own, lawful job search. It is not allowed to:'],
      list: [
        'send spam, bulk emails or unsolicited commercial messages through Unlisted;',
        'send emails that are misleading, offensive, discriminatory or that impersonate someone else;',
        'use the company or contact information from Unlisted for anything other than your own job search, or resell it;',
        'scrape, copy or automatically collect data from Unlisted;',
        'overload, disrupt or attempt to gain unauthorised access to the service;',
        'create multiple accounts to obtain extra free credits.',
      ],
    },
    {
      id: 'outreach',
      heading: '7. Outreach emails',
      body: [
        'You decide which emails are sent: you send or approve them yourself, or you explicitly allow your agent to send them automatically within a daily limit you set. You are responsible for their content, even when Unlisted wrote it for you. Read your drafts before you send them, and only turn on automatic sending if you are comfortable with emails going out in your name. We may limit the number of emails you send, and we may refuse or stop sending emails that violate these terms.',
      ],
    },
    {
      id: 'ip',
      heading: '8. Intellectual property',
      body: [
        `All intellectual property rights in ${COMPANY.product}, including the software, design and texts, belong to ${COMPANY.legalName} or its licensors. You receive a personal, non-exclusive and non-transferable right to use the service during the term of your account.`,
        'Your profile, your CV and the emails you send remain yours. You give us permission to use them only as far as needed to provide the service.',
      ],
    },
    {
      id: 'availability',
      heading: '9. Availability and changes',
      body: [
        'We do our best to keep Unlisted available, but we do not guarantee uninterrupted availability. We may carry out maintenance, and we may change, extend or remove features. Unlisted depends on third-party services (such as hosting, AI providers and payment providers); we are not responsible for their availability.',
      ],
    },
    {
      id: 'liability',
      heading: '10. Liability',
      body: [
        'We are only liable for direct damage caused by an attributable failure on our side. Our total liability is limited to the amount you paid us in the 12 months before the damage occurred.',
        'We are not liable for indirect damage, such as missed job opportunities, or for decisions you make based on match scores, signals or AI-generated texts.',
        'These limitations do not apply in case of intent or deliberate recklessness on our side, or where mandatory consumer law provides otherwise.',
      ],
    },
    {
      id: 'termination',
      heading: '11. Ending your account',
      body: [
        `You can stop using Unlisted at any time and ask us to delete your account by emailing ${COMPANY.email}. Unused paid credits are not refunded when you delete your account, except as described under "Right of withdrawal and refunds".`,
        'We may suspend or close your account if you violate these terms. In case of serious or repeated violations we may do so without prior notice.',
      ],
    },
    {
      id: 'privacy',
      heading: '12. Privacy',
      body: [
        'We process your personal data as described in our Privacy Policy.',
      ],
    },
    {
      id: 'complaints',
      heading: '13. Complaints',
      body: [
        `Do you have a complaint about Unlisted? Email ${COMPANY.email}. We respond within 14 days. If we cannot solve it together, you can also use the European Online Dispute Resolution platform.`,
      ],
    },
    {
      id: 'changes',
      heading: '14. Changes to these terms',
      body: [
        'We may change these terms. We will inform you by email at least 30 days before a material change takes effect. If you do not agree with the change, you can end your account before that date.',
      ],
    },
    {
      id: 'law',
      heading: '15. Governing law and disputes',
      body: [
        `These terms are governed by Dutch law. Disputes are submitted to the competent court in Rotterdam, unless mandatory law gives you the right to go to the court of your place of residence. As a consumer, you keep the protection of the mandatory rules of the country where you live.`,
      ],
    },
  ],
};

export const legal = {
  labels: {
    lastUpdated: 'Last updated',
    onThisPage: 'On this page',
    backHome: 'Back to home',
    companyDetails: 'Company details',
  },
  privacy,
  terms,
};
