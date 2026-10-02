import { CREDIT_PACKS, formatMoney } from '@/modules/billing/plans';
import { COMPANY } from '@/shared/constants/company';

/*
 * FAQ (/faq), contact & support (/contact) en het supportblok onder privacy/voorwaarden.
 * Een antwoord bestaat uit alinea's en optioneel één link naar de plek waar je het regelt.
 */
export interface FaqItem {
  id: string;
  question: string;
  answer: string[];
  link?: { href: string; label: string };
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

const cheapest = CREDIT_PACKS[0];

const categories: FaqCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    items: [
      {
        id: 'what-is-unlisted',
        question: 'What is Unlisted?',
        answer: [
          'Unlisted helps students in the Netherlands find companies worth contacting before a job is posted. Your agent looks at public company signals such as news, funding, hiring activity and expansion, compares them with your profile and helps you write a personal email.',
        ],
      },
      {
        id: 'signal-vs-vacancy',
        question: 'Is every result a real vacancy?',
        answer: [
          'No. Unlisted shows two kinds of results: published vacancies, and opportunity signals. A signal means a company shows activity (for example a new office or a funding round) that may make it a good moment to reach out. It is not a confirmed open position.',
        ],
      },
      {
        id: 'first-search-free',
        question: 'Is it free to try?',
        answer: [
          'Yes. Every new account gets one free credit, so your first search costs nothing. There is no subscription: after that you only pay for the searches you run.',
        ],
        link: { href: '/register', label: 'Create a free account' },
      },
    ],
  },
  {
    id: 'credits',
    title: 'Credits and payments',
    items: [
      {
        id: 'how-credits-work',
        question: 'How do credits work?',
        answer: [
          `One search costs one credit, whether you start it yourself or your agent runs it on a schedule. You buy credits in one-off packs, starting at ${formatMoney(cheapest.amountCents, 'en')} for ${cheapest.credits} credits. Prices include VAT.`,
          'Credits do not expire as long as your account exists.',
        ],
        link: { href: '/billing', label: 'See credit packs' },
      },
      {
        id: 'zero-results',
        question: 'Does a search with no results cost a credit?',
        answer: [
          'Yes. The agent did the work of searching, even if nothing matched this time. If a search fails because of an error on our side, you get the credit back automatically.',
        ],
      },
      {
        id: 'payment-failed',
        question: 'My payment failed or was canceled. What now?',
        answer: [
          'If a payment fails or you cancel it, you are not charged and no credits are added. You can simply try again from the Credits & billing page, with the same or another payment method.',
        ],
        link: { href: '/billing', label: 'Go to Credits & billing' },
      },
      {
        id: 'credits-missing',
        question: 'I paid, but my credits are not showing.',
        answer: [
          'Credits are added as soon as our payment provider confirms the payment. That usually takes a few seconds, sometimes a few minutes. Refresh the Credits & billing page to see the latest status.',
          `Still nothing after 15 minutes? Email ${COMPANY.email} with the date and amount of the payment. We will sort it out.`,
        ],
      },
      {
        id: 'refund',
        question: 'Can I get a refund?',
        answer: [
          'Credits are delivered right away, so the standard 14-day withdrawal period no longer applies once they are added. As a courtesy we refund a pack bought in the last 14 days, as long as none of its credits have been used.',
        ],
        link: { href: '/terms#withdrawal', label: 'Read the refund terms' },
      },
    ],
  },
  {
    id: 'searches',
    title: 'Searches and results',
    items: [
      {
        id: 'search-duration',
        question: 'How long does a search take?',
        answer: [
          'Usually a few minutes. You can leave the page or close your browser: the search keeps running and the results appear on your dashboard when it is done.',
        ],
      },
      {
        id: 'search-stuck',
        question: 'My search seems stuck or failed.',
        answer: [
          'A failed search is shown on the search page, and the credit is returned to your balance automatically. You can start a new search right away.',
          `Is a search still running after 30 minutes? Email ${COMPANY.email} and mention roughly when you started it.`,
        ],
        link: { href: '/search', label: 'Go to search' },
      },
      {
        id: 'no-results',
        question: 'My search found nothing. How do I get better results?',
        answer: [
          'Try broadening your preferences: add more locations, more types of opportunities or related fields. A complete profile with your CV also helps the agent find better matches.',
        ],
        link: { href: '/search/preferences', label: 'Edit your preferences' },
      },
      {
        id: 'wrong-result',
        question: 'A result is wrong or not relevant.',
        answer: [
          'Mark it as "Not interested", so it no longer shows up in your lists, and check whether your preferences still describe what you are looking for. Match scores and summaries are partly generated by AI and can contain mistakes.',
          `If information about a company is clearly incorrect, let us know at ${COMPANY.email}.`,
        ],
      },
      {
        id: 'match-score',
        question: 'How is the match score calculated?',
        answer: [
          'The score compares the opportunity with your profile: your skills, study, experience, preferred locations and the type of role you are looking for, plus how relevant the company signal is. It is an indication to help you prioritise, not a prediction that you will get the job.',
        ],
      },
    ],
  },
  {
    id: 'outreach',
    title: 'Emails to companies',
    items: [
      {
        id: 'who-sends',
        question: 'Does Unlisted send emails on my behalf?',
        answer: [
          'That depends on the level you choose for your agent. As an assistant it only writes drafts that you send yourself. Semi-automatic means you approve each email with one click. Fully automatic sending is only possible after you explicitly allow it, and always stays within the daily limit you set.',
        ],
        link: { href: '/settings', label: 'Choose your agent level' },
      },
      {
        id: 'replies',
        question: 'Where do replies go?',
        answer: ['Replies from companies go to your own email address, not to Unlisted.'],
      },
    ],
  },
  {
    id: 'account',
    title: 'Account and privacy',
    items: [
      {
        id: 'change-login',
        question: 'How do I change my email address or password?',
        answer: ['Go to Settings. You can update your email address and choose a new password there.'],
        link: { href: '/settings', label: 'Go to Settings' },
      },
      {
        id: 'delete-account',
        question: 'How do I delete my account?',
        answer: [
          'Go to Settings and scroll to "Delete account". Type your email address to confirm. Your profile, CV, searches and emails are deleted right away. Payment records are kept for seven years without your name, because Dutch law requires it.',
        ],
        link: { href: '/settings', label: 'Go to Settings' },
      },
      {
        id: 'my-data',
        question: 'What do you do with my CV and data?',
        answer: [
          'We use your data only to run your searches, score matches and write your emails. We never sell it. The privacy policy explains exactly what we process, which providers we use and how long we keep it.',
        ],
        link: { href: '/privacy', label: 'Read the privacy policy' },
      },
      {
        id: 'privacy-request',
        question: 'I want to see, correct or export my data.',
        answer: [
          'You can correct your profile and preferences yourself, and download all your data at any time via Settings → Your data.',
          `For anything else, email ${COMPANY.email}. We respond within four weeks.`,
        ],
        link: { href: '/settings', label: 'Go to Settings' },
      },
    ],
  },
];

export const support = {
  // /unsubscribe: ontvangers van outreach-mails die geen berichten via Unlisted meer willen
  unsubscribe: {
    metaTitle: 'Unsubscribe',
    title: 'No more emails via Unlisted',
    body: (email: string) => `Students use Unlisted to send personal emails to companies. Confirm below and we won’t send anything to ${email} via Unlisted again.`,
    button: 'Unsubscribe this address',
    doneTitle: 'You’re unsubscribed',
    doneBody: 'We won’t send emails to this address via Unlisted anymore. Sorry for the bother.',
    invalidTitle: 'This link doesn’t work',
    invalidBody: 'The unsubscribe link is incomplete or has been changed. Use the link from the email, or contact us and we’ll take care of it.',
  },
  card: {
    title: 'Questions?',
    body: 'Check the frequently asked questions or get in touch.',
    contactLink: 'Contact & support',
  },
  faq: {
    metaTitle: 'FAQ',
    metaDescription: 'Answers to common questions about Unlisted: credits, payments, searches, emails and your account.',
    eyebrow: 'Help',
    title: 'Frequently asked questions',
    intro: 'Quick answers about credits, searches, emails and your account.',
    onThisPage: 'Topics',
    categories,
  },
  contact: {
    metaTitle: 'Contact & support',
    metaDescription: 'Get help with Unlisted: payments, credits, searches, your account or privacy.',
    eyebrow: 'Support',
    title: 'Contact & support',
    intro: 'Something not working, a question about a payment or a privacy request? We are happy to help.',
    responseTime: 'We aim to reply within two working days.',
    channels: {
      email: { title: 'Email', body: 'Best for most questions. Send it from the address you log in with.' },
      phone: { title: 'Phone', body: 'On working days, during office hours.' },
      whatsapp: { title: 'WhatsApp', body: 'For a quick question.' },
    },
    includeTitle: 'Help us help you faster',
    includeList: [
      'The email address of your Unlisted account.',
      'What you were doing and what went wrong.',
      'When it happened, and a screenshot if you have one.',
      'For payments: the date and amount of the payment.',
    ],
    topicsTitle: 'Maybe already answered',
    topics: [
      { href: '/faq#payment-failed', label: 'My payment failed' },
      { href: '/faq#credits-missing', label: 'My credits are missing' },
      { href: '/faq#search-stuck', label: 'My search is stuck' },
      { href: '/faq#wrong-result', label: 'A result is incorrect' },
      { href: '/faq#delete-account', label: 'Delete my account' },
      { href: '/faq#privacy-request', label: 'A privacy question' },
    ],
    allFaq: 'All questions',
  },
};
