import { COMPANY, COMPANY_ADDRESS } from '@/shared/constants/company';
import type { LegalDocument } from '../en/legal';

const companyLine = `${COMPANY.legalName}, ${COMPANY_ADDRESS}, ${COMPANY.country.nl}`;

const privacy: LegalDocument = {
  metaTitle: 'Privacybeleid',
  metaDescription: `Hoe ${COMPANY.product} (een product van ${COMPANY.legalName}) met je persoonsgegevens omgaat.`,
  eyebrow: 'Juridisch',
  title: 'Privacybeleid',
  updated: '28 september 2026',
  intro: [
    `${COMPANY.product} is een product van ${COMPANY.legalName}, ingeschreven bij de Kamer van Koophandel onder nummer ${COMPANY.kvk}. ${COMPANY.legalName} is verwerkingsverantwoordelijke voor de verwerking van persoonsgegevens die in dit beleid wordt beschreven.`,
    'We verwerken alleen wat nodig is om Unlisted te laten werken, verkopen je gegevens nooit en jij houdt de regie over je profiel, je cv en de e-mails die je verstuurt.',
  ],
  sections: [
    {
      id: 'who-we-are',
      heading: '1. Wie wij zijn',
      list: [
        companyLine,
        `Kamer van Koophandel (KvK): ${COMPANY.kvk}`,
        `Btw-id: ${COMPANY.vatId}`,
        `E-mail: ${COMPANY.email}`,
        `Telefoon: ${COMPANY.phone}`,
      ],
    },
    {
      id: 'data',
      heading: '2. Welke gegevens we verwerken',
      list: [
        'Accountgegevens: je naam, e-mailadres en wachtwoord (versleuteld opgeslagen door onze authenticatieprovider).',
        'Profielgegevens: je studie, vaardigheden, talen, werkervaring, voorkeurslocaties, het soort kansen dat je zoekt en je zoekvoorkeuren.',
        'Cv: de pdf die je uploadt, de tekst die we eruit halen en de gestructureerde samenvatting (opleiding, ervaring, vaardigheden) die we daarvan maken.',
        'Zoek- en matchgegevens: je zoekopdrachten, de bedrijven en kanssignalen die we voor je vinden, je matchscores en wat je bewaart of wegklikt.',
        'Outreachgegevens: concept-e-mails, de ontvangers die je kiest en de status van verstuurde e-mails.',
        'Betaalgegevens: de creditpakketten die je koopt, bedragen en betaalstatus. Kaart- of bankgegevens worden verwerkt door onze betaalprovider; die zien en bewaren wij nooit.',
        'Technische gegevens: IP-adres, browsertype en serverlogs, nodig om de dienst veilig en werkend te houden.',
      ],
    },
    {
      id: 'purposes',
      heading: '3. Waarom we je gegevens gebruiken en op welke grondslag',
      list: [
        'Om Unlisted te leveren: je account aanmaken, je zoekopdrachten uitvoeren, matches tonen en outreach voorbereiden (uitvoering van de overeenkomst).',
        'Om betalingen te verwerken en factuurgegevens te bewaren (uitvoering van de overeenkomst en wettelijke plicht).',
        'Om de dienst te beveiligen, misbruik te voorkomen en fouten op te lossen (gerechtvaardigd belang).',
        'Om service-e-mails te sturen, zoals berichten over je account en betalingen (uitvoering van de overeenkomst).',
      ],
      body: [
        'We sturen geen marketingmails en verkopen je gegevens nooit aan derden.',
      ],
    },
    {
      id: 'profiling',
      heading: '4. Matching, AI en profilering',
      body: [
        'Unlisted vergelijkt je profiel met openbare bedrijfssignalen (zoals nieuws, investeringen, wervingsactiviteit en uitbreiding) om bedrijven voor te stellen die interessant kunnen zijn om te benaderen. Dat gebeurt deels met vaste regels en deels met AI-modellen. Dit is een vorm van profilering.',
        'Matchscores en suggesties zijn indicatief. Een kanssignaal is geen bevestigde vacature, en AI kan fouten maken. De scoring leidt niet tot besluiten met rechtsgevolgen of vergelijkbare impact voor jou: je bepaalt altijd zelf of je een bedrijf benadert.',
        'Je kunt je profiel en cv op elk moment wijzigen of verwijderen, en matches weghalen die je niet wilt.',
      ],
    },
    {
      id: 'outreach',
      heading: '5. E-mails aan bedrijven',
      body: [
        'Als je via Unlisted een e-mail naar een bedrijf stuurt, verwerken we het adres van de ontvanger, de inhoud van de e-mail en de verzendstatus. E-mails worden pas verstuurd als jij daarvoor kiest. Je bent zelf verantwoordelijk voor de inhoud van de e-mails die je verstuurt.',
        'Om bedrijven en openbare zakelijke contactgegevens te vinden, gebruiken we openbaar beschikbare bronnen op het web. Die gegevens gebruiken we alleen voor jouw zoekopdracht.',
      ],
    },
    {
      id: 'processors',
      heading: '6. Met wie we gegevens delen',
      body: [
        'We werken met een beperkt aantal verwerkers. Elke verwerker krijgt alleen de gegevens die nodig zijn voor zijn taak en is gebonden aan een verwerkersovereenkomst of vergelijkbare voorwaarden.',
      ],
      list: [
        'Supabase — database, authenticatie en bestandsopslag (cv).',
        'Vercel — hosting van de website en applicatie, inclusief serverlogs.',
        'OpenAI en/of Anthropic — AI-verwerking van je cv, zoekresultaten, matchscores en concept-e-mails. Deze partijen mogen je gegevens niet gebruiken om hun modellen te trainen.',
        'n8n — automatisering van zoekopdrachten en het versturen van e-mails.',
        'Apify — verzamelen van openbare bedrijfsinformatie en zakelijke contactgegevens op het web.',
        'Google (Gmail / Google Workspace) — versturen en ontvangen van e-mail.',
        'Mollie — betaalverwerking voor creditpakketten.',
      ],
    },
    {
      id: 'transfers',
      heading: '7. Doorgifte buiten de EU',
      body: [
        'Sommige van deze partijen zijn gevestigd in, of gebruiken servers in, de Verenigde Staten. In die gevallen vindt doorgifte plaats met passende waarborgen, zoals het EU-VS Data Privacy Framework en/of standaardcontractbepalingen.',
      ],
    },
    {
      id: 'retention',
      heading: '8. Hoe lang we gegevens bewaren',
      list: [
        'Account-, profiel-, cv-, zoek- en outreachgegevens: zolang je account bestaat. Verwijder je je account, dan verwijderen of anonimiseren we deze gegevens binnen 30 dagen.',
        'Betaal- en factuurgegevens: zeven jaar, vanwege de wettelijke bewaarplicht.',
        'Contact met onze support: maximaal twee jaar na het laatste contact.',
        'Serverlogs: beperkte tijd, alleen zolang nodig voor beveiliging en het oplossen van fouten.',
      ],
    },
    {
      id: 'cookies',
      heading: '9. Cookies',
      body: [
        'Unlisted gebruikt alleen functionele cookies: om je ingelogd te houden, je taalvoorkeur te onthouden en de openingsanimatie maar één keer per bezoek te tonen. We gebruiken geen tracking-, advertentie- of analytische cookies.',
      ],
    },
    {
      id: 'rights',
      heading: '10. Je rechten',
      body: [
        `Je hebt het recht om je persoonsgegevens in te zien, te corrigeren of te laten verwijderen, de verwerking te beperken, bezwaar te maken tegen de verwerking en je gegevens over te dragen. Mail hiervoor naar ${COMPANY.email}; we reageren binnen vier weken.`,
        'Ben je niet tevreden over hoe we met je gegevens omgaan, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).',
      ],
    },
    {
      id: 'security',
      heading: '11. Beveiliging',
      body: [
        'We nemen passende technische en organisatorische maatregelen om je gegevens te beschermen, zoals versleutelde verbindingen (HTTPS/TLS), toegangscontrole per gebruiker en beperkte toegang tot productiegegevens.',
      ],
    },
    {
      id: 'changes',
      heading: '12. Wijzigingen',
      body: [
        'We kunnen dit privacybeleid aanpassen. De actuele versie staat altijd op deze pagina. Raakt een wijziging je wezenlijk, dan laten we je dat per e-mail weten.',
      ],
    },
  ],
};

const terms: LegalDocument = {
  metaTitle: 'Algemene voorwaarden',
  metaDescription: `De voorwaarden voor het gebruik van ${COMPANY.product}, een product van ${COMPANY.legalName}.`,
  eyebrow: 'Juridisch',
  title: 'Algemene voorwaarden',
  updated: '28 september 2026',
  intro: [
    `Deze voorwaarden gelden voor het gebruik van ${COMPANY.product} door studenten en andere particuliere gebruikers. ${COMPANY.product} is een product van ${COMPANY.legalName} (${companyLine}, KvK ${COMPANY.kvk}, btw-id ${COMPANY.vatId}).`,
    'Door een account aan te maken ga je akkoord met deze voorwaarden. Lees ze goed door.',
  ],
  sections: [
    {
      id: 'definitions',
      heading: '1. Begrippen',
      list: [
        `Wij / ons: ${COMPANY.legalName}, de aanbieder van ${COMPANY.product}.`,
        `Jij: de persoon die een account aanmaakt en ${COMPANY.product} gebruikt.`,
        'Zoekopdracht: één run van de Unlisted-agent die zoekt naar bedrijven en kanssignalen die passen bij je profiel en voorkeuren, door jou gestart of automatisch volgens je planning.',
        'Credit: een vooraf betaalde eenheid waarmee je een zoekopdracht start. Eén zoekopdracht kost één credit.',
        'Kanssignaal: openbare informatie over een bedrijf (zoals nieuws, investeringen, wervingsactiviteit of uitbreiding) die erop kan wijzen dat het interessant is om contact op te nemen. Een signaal is geen bevestigde vacature.',
        'Outreach: een e-mail aan een bedrijf die Unlisted je helpt schrijven en, als je dat wilt, versturen.',
      ],
    },
    {
      id: 'service',
      heading: '2. De dienst',
      body: [
        'Unlisted helpt je bedrijven te ontdekken die interessant kunnen zijn om te benaderen, op basis van openbare bedrijfssignalen en je profiel, en helpt je persoonlijke outreach te schrijven.',
        'We garanderen niet dat een zoekopdracht resultaten oplevert, dat een bedrijf een openstaande functie heeft, of dat contact opnemen leidt tot een baan, stage of antwoord. Matchscores en suggesties zijn indicatief, deels door AI gegenereerd en kunnen fouten bevatten. Controleer belangrijke informatie altijd zelf.',
      ],
    },
    {
      id: 'account',
      heading: '3. Je account',
      list: [
        'Je moet minimaal 16 jaar oud zijn om een account aan te maken.',
        'Geef juiste gegevens op en houd je wachtwoord geheim. Je bent verantwoordelijk voor wat er via je account gebeurt.',
        `Laat het ons zo snel mogelijk weten via ${COMPANY.email} als je misbruik van je account vermoedt.`,
        'Eén account per persoon. Accounts zijn persoonlijk en niet overdraagbaar.',
      ],
    },
    {
      id: 'credits',
      heading: '4. Credits en prijzen',
      list: [
        'Je eerste zoekopdracht is gratis: elk nieuw account krijgt één gratis credit.',
        'Daarna koop je credits in eenmalige creditpakketten. Er is geen abonnement en er wordt niets automatisch verlengd.',
        'Prijzen worden vóór het betalen getoond in euro, inclusief btw.',
        'Eén zoekopdracht kost één credit, ook als een zoekopdracht nul resultaten oplevert.',
        'Mislukt een zoekopdracht door een technische fout aan onze kant, dan krijg je de credit automatisch terug.',
        'Credits vervallen niet zolang je account bestaat. Credits hebben geen geldwaarde en zijn niet overdraagbaar of inwisselbaar voor geld, behalve zoals beschreven onder "Herroepingsrecht en terugbetaling".',
        'Betalingen worden verwerkt door Mollie. Credits worden bijgeschreven zodra de betaling is bevestigd.',
      ],
    },
    {
      id: 'withdrawal',
      heading: '5. Herroepingsrecht en terugbetaling',
      body: [
        'Als consument heb je bij een online aankoop normaal 14 dagen bedenktijd. Credits zijn digitale inhoud die direct na betaling wordt geleverd. Als je credits koopt, vraag je ons om ze direct te leveren en verklaar je dat je je herroepingsrecht verliest zodra de credits op je saldo staan.',
        `Ongebruikte credits uit een pakket dat je in de afgelopen 14 dagen hebt gekocht, betalen we uit coulance op verzoek terug, zolang er nog geen enkele credit uit dat pakket is gebruikt. Mail naar ${COMPANY.email} met de datum en het bedrag van je aankoop.`,
        'Dit doet niets af aan je wettelijke rechten als de dienst niet aan de overeenkomst voldoet.',
      ],
    },
    {
      id: 'use',
      heading: '6. Toegestaan gebruik',
      body: ['Je mag Unlisted alleen gebruiken voor je eigen, rechtmatige zoektocht naar werk. Het is niet toegestaan om:'],
      list: [
        'via Unlisted spam, bulkmails of ongevraagde commerciële berichten te versturen;',
        'e-mails te versturen die misleidend, beledigend of discriminerend zijn of waarin je je voordoet als iemand anders;',
        'bedrijfs- of contactgegevens uit Unlisted voor iets anders te gebruiken dan je eigen zoektocht naar werk, of ze door te verkopen;',
        'gegevens uit Unlisted te scrapen, te kopiëren of automatisch te verzamelen;',
        'de dienst te overbelasten, te verstoren of te proberen er onbevoegd toegang toe te krijgen;',
        'meerdere accounts aan te maken om extra gratis credits te krijgen.',
      ],
    },
    {
      id: 'outreach',
      heading: '7. Outreach-e-mails',
      body: [
        'Jij bepaalt welke e-mails worden verstuurd en je bent verantwoordelijk voor de inhoud, ook als Unlisted een concept voor je heeft geschreven. Lees elk concept voordat je het verstuurt. We kunnen het aantal e-mails dat je verstuurt beperken, en e-mails die in strijd zijn met deze voorwaarden weigeren of stoppen.',
      ],
    },
    {
      id: 'ip',
      heading: '8. Intellectueel eigendom',
      body: [
        `Alle intellectuele-eigendomsrechten op ${COMPANY.product}, waaronder de software, het ontwerp en de teksten, liggen bij ${COMPANY.legalName} of haar licentiegevers. Je krijgt een persoonlijk, niet-exclusief en niet-overdraagbaar recht om de dienst te gebruiken zolang je account bestaat.`,
        'Je profiel, je cv en de e-mails die je verstuurt blijven van jou. Je geeft ons toestemming om ze te gebruiken voor zover dat nodig is om de dienst te leveren.',
      ],
    },
    {
      id: 'availability',
      heading: '9. Beschikbaarheid en wijzigingen',
      body: [
        'We doen ons best om Unlisted beschikbaar te houden, maar garanderen geen ononderbroken beschikbaarheid. We kunnen onderhoud uitvoeren en functies wijzigen, uitbreiden of verwijderen. Unlisted is afhankelijk van diensten van derden (zoals hosting, AI-providers en betaalproviders); voor hun beschikbaarheid zijn wij niet verantwoordelijk.',
      ],
    },
    {
      id: 'liability',
      heading: '10. Aansprakelijkheid',
      body: [
        'We zijn alleen aansprakelijk voor directe schade die het gevolg is van een toerekenbare tekortkoming aan onze kant. Onze totale aansprakelijkheid is beperkt tot het bedrag dat je ons in de 12 maanden vóór het ontstaan van de schade hebt betaald.',
        'We zijn niet aansprakelijk voor indirecte schade, zoals gemiste kansen op werk, of voor beslissingen die je neemt op basis van matchscores, signalen of door AI geschreven teksten.',
        'Deze beperkingen gelden niet bij opzet of bewuste roekeloosheid aan onze kant, of waar dwingend consumentenrecht anders bepaalt.',
      ],
    },
    {
      id: 'termination',
      heading: '11. Je account beëindigen',
      body: [
        `Je kunt op elk moment stoppen met Unlisted en ons vragen je account te verwijderen door te mailen naar ${COMPANY.email}. Ongebruikte betaalde credits worden bij het verwijderen van je account niet terugbetaald, behalve zoals beschreven onder "Herroepingsrecht en terugbetaling".`,
        'We kunnen je account opschorten of sluiten als je deze voorwaarden overtreedt. Bij ernstige of herhaalde overtredingen kan dat zonder voorafgaande waarschuwing.',
      ],
    },
    {
      id: 'privacy',
      heading: '12. Privacy',
      body: [
        'We verwerken je persoonsgegevens zoals beschreven in ons privacybeleid.',
      ],
    },
    {
      id: 'complaints',
      heading: '13. Klachten',
      body: [
        `Heb je een klacht over Unlisted? Mail naar ${COMPANY.email}. We reageren binnen 14 dagen. Komen we er samen niet uit, dan kun je ook gebruikmaken van het Europese ODR-platform voor onlinegeschillen.`,
      ],
    },
    {
      id: 'changes',
      heading: '14. Wijziging van deze voorwaarden',
      body: [
        'We kunnen deze voorwaarden wijzigen. We laten je minimaal 30 dagen voordat een wezenlijke wijziging ingaat per e-mail weten. Ga je niet akkoord met de wijziging, dan kun je je account vóór die datum beëindigen.',
      ],
    },
    {
      id: 'law',
      heading: '15. Toepasselijk recht en geschillen',
      body: [
        'Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Rotterdam, tenzij dwingend recht je het recht geeft om naar de rechter van je woonplaats te gaan. Als consument behoud je de bescherming van de dwingende regels van het land waar je woont.',
      ],
    },
  ],
};

export const legal = {
  labels: {
    lastUpdated: 'Laatst bijgewerkt',
    onThisPage: 'Op deze pagina',
    backHome: 'Terug naar home',
    questions: 'Vragen?',
    questionsBody: `Mail ons via ${COMPANY.email} of bel ${COMPANY.phone}.`,
    companyDetails: 'Bedrijfsgegevens',
  },
  privacy,
  terms,
};
