/* =========================================================
   OPPGAVENE I TESTENE
   Her kan gruppen legge til, fjerne og endre oppgaver.

   Oppgavetyper:
   - 'nettside' : url + butikk (mal) ELLER url + innhold (egen HTML)   svar: 'ekte' | 'svindel'
   - 'sms'      : fra, fraUnder, tid, tekst                              svar: 'ekte' | 'svindel'
   - 'epost'    : fraNavn, fraAdresse, emne, tekst                       svar: 'ekte' | 'svindel'
   - 'bilde'    : src, alt                                               svar: 'ekte' | 'ki'
   - 'valg'     : sporsmal, alternativer (liste), riktig (nummer, starter på 0)

   Bildeoppgaver vises bare hvis bildefilen finnes i mappen bilder/.
   Alle navn på butikker, banker og firmaer er oppdiktet.
   ========================================================= */

// Sekunder per oppgave i den vanskelige førstetesten (sett til null for å skru av)
const TIDSGRENSE_VANSKELIG = 40;

/* ---------------------------------------------------------
   TEST 1 – VANSKELIG
   Laget for at nesten ingen skal klare alt. Svindelen er godt
   skjult, og de ekte eksemplene ser litt mistenkelige ut.
   --------------------------------------------------------- */
const VANSKELIG_TEST = [
  {
    type: 'nettside',
    tittel: 'Nordhus Interiør – avviklingssalg',
    url: 'https://www.nordhus-interior.no-butikk.com/salg',
    butikk: {
      navn: 'NORDHUS',
      undertittel: 'INTERIØR SIDEN 1987',
      farge: '#3b4a3f',
      toppstripe: 'Fri frakt over 499 kr · 60 dagers åpent kjøp · Trygg betaling',
      meny: ['Sofaer', 'Belysning', 'Tekstiler', 'Salg'],
      banner: { tittel: 'Vi avvikler nettbutikken', tekst: 'Takk for 37 fine år. Alt må ut – opptil 70 % rabatt på hele sortimentet.' },
      vurdering: '4,9 av 5 · 2 314 omtaler',
      produkter: [
        { navn: 'Sofa «Fjord» 3-seter, ull', forPris: '14 999,-', pris: '4 499,-', bilde: 'bilder/produkter/sofa.jpg', ikon: '🛋️', bakgrunn: '#e6e1d6' },
        { navn: 'Lysestaker i messing, 3 stk.', forPris: '1 299,-', pris: '389,-', bilde: 'bilder/produkter/lysestaker.jpg', ikon: '🕯️', bakgrunn: '#efe9dc' },
        { navn: 'Ullteppe «Vidde» 200×300', forPris: '7 490,-', pris: '2 247,-', bilde: 'bilder/produkter/ullteppe.jpg', ikon: '🧶', bakgrunn: '#e3e6df' }
      ],
      bunn: ['Nordhus Interiør AS · Org.nr. 918 223 405', 'Kirkegata 14, 0153 Oslo', 'kundeservice@nordhus-interior.com'],
      betaling: ['Visa', 'Mastercard']
    },
    svar: 'svindel',
    forklaring: 'Les slutten av nettadressen: Den egentlige eieren er «no-butikk.com», ikke en norsk butikk. Store avviklingssalg med 70 % rabatt og bare kortbetaling er vanlige triks. Org.nr. og adresse kan være kopiert fra et ekte firma.'
  },
  {
    type: 'sms',
    tittel: 'SMS med engangskode fra banken',
    fra: 'Nordbanken',
    tid: 'I dag 10:02',
    tekst: 'Engangskoden din er 482 913. Koden brukes til innlogging i nettbanken og er gyldig i 5 minutter. Del aldri koden med noen – heller ikke med ansatte i banken.',
    svar: 'ekte',
    forklaring: 'Ekte. Dette er en vanlig melding når du selv logger inn. Den har ingen lenke og ber deg ikke gjøre noe. Men: Har du IKKE prøvd å logge inn selv, kan det bety at noen andre prøver. Gi aldri koden til noen som ringer deg.'
  },
  {
    type: 'bilde',
    tittel: 'Bilde 1',
    src: 'bilder/test1-ki.jpg',
    alt: 'Bilde du skal vurdere',
    svar: 'ki',
    forklaring: 'Dette bildet er laget av KI, med Microsoft Designer. Det er nesten umulig å se, og det er poenget. Hodetelefonene ligner et ekte merkeprodukt, og KI kan kopiere både form og logo. Overflaten er helt jevn uten støv, riper eller fingermerker, og lyset er perfekt. Du kan ikke stole på at du ser forskjell. Sjekk heller hvem som selger varen, og om prisen er for god til å være sann.'
  },
  {
    type: 'nettside',
    tittel: 'Fjelltopp Sport – jakker',
    url: 'https://www.fjelltoppsport.no/herre/jakker',
    butikk: {
      navn: 'Fjelltopp Sport',
      logo: '⛰️',
      farge: '#9a2b1f',
      toppstripe: 'Butikk i Storgata 41, Lillehammer · Åpent man–lør',
      meny: ['Herre', 'Dame', 'Barn', 'Ski', 'Tur'],
      banner: { tittel: 'Høstjakker', tekst: 'Klar for tur? Se årets jakker fra norske og svenske merker.' },
      produkter: [
        { navn: 'Skalljakke herre, Gore-Tex', pris: '3 499,-', bilde: 'bilder/produkter/skalljakke.jpg', ikon: '🧥', bakgrunn: '#efe6e3' },
        { navn: 'Dunjakke herre, lett', forPris: '2 799,-', pris: '2 239,-', merke: '-20 %', bilde: 'bilder/produkter/dunjakke.jpg', ikon: '🧥', bakgrunn: '#e4e8ee' },
        { navn: 'Ullgenser, norsk ull', pris: '1 199,-', bilde: 'bilder/produkter/ullgenser.jpg', ikon: '🧶', bakgrunn: '#eceae4' }
      ],
      bunn: ['Fjelltopp Sport AS · Org.nr. 987 654 321', 'Storgata 41, 2609 Lillehammer · Tlf. 61 25 47 80', 'Kjøpsvilkår · Angrerett 14 dager · Retur og bytte'],
      betaling: ['Vipps', 'Klarna faktura', 'Visa', 'Mastercard']
    },
    svar: 'ekte',
    forklaring: 'Ekte. Norsk .no-adresse, normale priser, mange betalingsmåter (også faktura), org.nr., fysisk butikk og telefonnummer. Siden ser litt kjedelig ut – men det er ofte et godt tegn!'
  },
  {
    type: 'epost',
    tittel: 'E-post om tollavgift fra PakkeNorge',
    fraNavn: 'PakkeNorge',
    fraAdresse: 'varsel@pakkenorge-sporing.net',
    emne: 'Forsendelsen din er satt på vent (ref. NO482119374)',
    tekst: `
      <p class="e-logo">📦 PakkeNorge</p>
      <p>Hei,</p>
      <p>Vi har mottatt en forsendelse til deg fra utlandet. Før vi kan levere den, må det betales en tollavgift på <b>28,90 kr</b>.</p>
      <p>Forsendelse: NO482119374<br>Status: Venter på betaling</p>
      <p><span class="e-knapp">Betal og velg leveringsdag</span></p>
      <p>Ubetalte forsendelser returneres til avsender etter 3 dager.</p>
      <p>Vennlig hilsen<br>PakkeNorge Kundeservice</p>`,
    svar: 'svindel',
    forklaring: 'Svindel. Avsenderadressen slutter på «pakkenorge-sporing.net», ikke selskapets egen adresse. Det lille beløpet gjør at du ikke tenker deg om – men det svindlerne egentlig vil ha, er kortinformasjonen din. Fristen på 3 dager skal stresse deg.'
  },
  {
    type: 'nettside',
    tittel: 'Lyd & Bilde Hjem – lagertømming',
    url: 'https://www.lydogbildehjem.no/kampanje',
    butikk: {
      navn: 'Lyd & Bilde Hjem',
      logo: '📺',
      farge: '#0b4f8a',
      toppstripe: 'Norsk nettbutikk · Rask levering 1–3 dager',
      meny: ['TV', 'Lyd', 'Hvitevarer', 'Kampanje'],
      banner: { tittel: 'Lagertømming – kun i dag', tekst: 'Vi har fått inn for mye på lager. Når varene er borte, er de borte.' },
      nedtelling: '00:47:12',
      vurdering: 'Utmerket · 4,8 av 5 på Trustpilot',
      produkter: [
        { navn: '65" 4K Smart-TV, OLED', forPris: '12 999,-', pris: '3 990,-', merke: 'Bare 3 igjen', bilde: 'bilder/produkter/tv.jpg', ikon: '📺', bakgrunn: '#e3e9f1' },
        { navn: 'Robotstøvsuger med mopp', forPris: '5 499,-', pris: '1 290,-', bilde: 'bilder/produkter/robotstovsuger.jpg', ikon: '🤖', bakgrunn: '#eceff3' },
        { navn: 'Kaffemaskin, helautomatisk', forPris: '8 990,-', pris: '2 490,-', bilde: 'bilder/produkter/kaffemaskin.jpg', ikon: '☕', bakgrunn: '#efe7df' }
      ],
      bunn: ['© 2026 Lyd & Bilde Hjem', 'Kontakt oss via kontaktskjemaet', 'Vi er en norsk familiebedrift'],
      betaling: ['Visa', 'Mastercard']
    },
    svar: 'svindel',
    forklaring: 'Svindel – selv om adressen ser norsk ut. Svindlere kan fint kjøpe .no-adresser. Her mangler org.nr., adresse og telefon. Prisene er urealistisk lave, nedtellingen skal stresse deg, du kan bare betale med kort, og «4,8 på Trustpilot» er bare tekst butikken har skrevet selv.'
  },
  {
    type: 'sms',
    tittel: 'SMS om pakke til henting',
    fra: 'PakkeNorge',
    tid: 'I går 15:31',
    tekst: 'Pakken din fra Fjelltopp Sport er klar til henting hos Kiwi Storgata, Lillehammer. Hentekode: 7731. Hentes innen 14. november. Følg pakken: <span class="lenke">pakkenorge.no/spor</span>',
    svar: 'ekte',
    forklaring: 'Ekte. Meldingen nevner butikken du handlet i, ber deg ikke betale noe, og lenken går til selskapets egen adresse (pakkenorge.no). Likevel: Det tryggeste er alltid å åpne appen eller skrive inn adressen selv i stedet for å trykke på lenker i SMS.'
  },
  {
    type: 'bilde',
    tittel: 'Bilde 2',
    src: 'bilder/test1-ekte.jpg',
    alt: 'Bilde du skal vurdere',
    svar: 'ekte',
    forklaring: 'Dette er et ekte foto, tatt av Luke Peterson (Unsplash). Det er samme type hodetelefoner som KI-bildet i denne testen etterligner. Lyset og skyggene faller naturlig, og bakgrunnen er en vanlig fotovegg. Husk likevel: Svindlere stjeler ofte ekte bilder fra ekte butikker, så et ekte bilde betyr ikke at butikken er ekte.'
  },
  {
    type: 'nettside',
    tittel: 'Innlogging i Nordbanken',
    url: 'https://nordbanken.no.kundeinnlogging-sikker.com/logg-inn',
    innhold: `
      <div class="bank">
        <div class="bank-topp"><span class="bank-logo">◆ Nordbanken</span><span>Privat · Bedrift</span></div>
        <div class="bank-varsel">⚠ Av sikkerhetshensyn må du bekrefte kontoen din innen 24 timer. Ellers blir nettbanken midlertidig sperret.</div>
        <div class="bank-boks">
          <h3>Logg inn i nettbanken</h3>
          <div class="falsk-felt-etikett">Fødselsnummer (11 siffer)</div><div class="falsk-felt"></div>
          <div class="falsk-felt-etikett">Engangskode fra kodebrikke eller app</div><div class="falsk-felt"></div>
          <div class="falsk-felt-etikett">Personlig passord</div><div class="falsk-felt"></div>
          <div class="falsk-knapp">Bekreft og logg inn</div>
        </div>
        <div class="bank-bunn">Nordbanken ASA · Kundeservice døgnåpent · Personvern · Informasjonskapsler</div>
      </div>`,
    svar: 'svindel',
    forklaring: 'Svindel. Les adressen nøye: Den egentlige eieren er «kundeinnlogging-sikker.com». «nordbanken.no» står først bare for å lure deg. Trusselen om sperring innen 24 timer skal stresse deg, og hengelåsen betyr ikke at siden er trygg.'
  },
  {
    type: 'sms',
    tittel: '«Hei mamma»-melding',
    fra: '+47 941 22 870',
    fraUnder: 'Ukjent nummer',
    tid: 'I dag 08:47',
    tekst: 'Hei mamma! Mobilen min datt i vasken, så dette er det nye nummeret mitt 🙈 Lagre det gjerne. Kan du sende meg en melding på WhatsApp? Har en regning som må betales i dag, og får ikke logget inn i banken på den nye telefonen.',
    svar: 'svindel',
    forklaring: '«Hei mamma/pappa»-svindel er svært vanlig. Svindleren later som om de er barnet ditt med nytt nummer, og ber snart om penger. Ring alltid barnet ditt på det gamle nummeret før du gjør noe.'
  },
  {
    type: 'nettside',
    tittel: 'Hageverden – sesongslutt',
    url: 'https://www.hageverden.no/sesongslutt',
    butikk: {
      navn: 'Hageverden',
      logo: '🌿',
      farge: '#2f6b2f',
      toppstripe: 'Klikk og hent i 14 hagesentre · Gratis frakt over 999 kr',
      meny: ['Planter', 'Hagemøbler', 'Grill', 'Sesongslutt'],
      banner: { tittel: 'Sesongslutt: opptil 50 % på hagemøbler', tekst: 'Gjør plass til julevarene! Gjelder så langt lageret rekker, t.o.m. 10. november.' },
      produkter: [
        { navn: 'Hagesett i teak, bord og 4 stoler', forPris: '11 990,-', pris: '5 995,-', merke: '-50 %', bilde: 'bilder/produkter/hagesett.jpg', ikon: '🪑', bakgrunn: '#e6ede1' },
        { navn: 'Kullgrill, 57 cm', forPris: '2 499,-', pris: '1 749,-', merke: '-30 %', bilde: 'bilder/produkter/grill.jpg', ikon: '🔥', bakgrunn: '#efe8e1' },
        { navn: 'Parasoll, 3 meter', forPris: '1 299,-', pris: '779,-', merke: '-40 %', bilde: 'bilder/produkter/parasoll.jpg', ikon: '⛱️', bakgrunn: '#e9ecef' }
      ],
      bunn: ['Hageverden Norge AS · Org.nr. 912 345 678', 'Industriveien 8, 1400 Ski · Kundeservice: 64 85 20 00', 'Kjøpsvilkår · Angrerett · Finn ditt hagesenter'],
      betaling: ['Vipps', 'Klarna', 'Visa', 'Mastercard', 'Gavekort']
    },
    svar: 'ekte',
    forklaring: 'Ekte. Ekte butikker har også store salg, særlig ved sesongslutt. Her er rabattene realistiske (30–50 %, ikke 80–90 %), det står en sluttdato, butikken har fysiske hagesentre, og den oppgir org.nr., telefon og mange betalingsmåter.'
  }
];

/* ---------------------------------------------------------
   TEST 2 – LETTERE
   Tegnene fra læringsarenaen er tydeligere. Brukeren får
   forklaring etter hver oppgave.
   --------------------------------------------------------- */
const LETT_TEST = [
  {
    type: 'nettside',
    tittel: 'Merkevare Outlet – megasalg',
    url: 'http://www.merkevare-outlet-norge.shop/salg',
    butikk: {
      navn: 'MERKEVARE OUTLET',
      logo: '👟',
      farge: '#d10000',
      toppstripe: 'GRATIS FRAKT TIL HELE NORGE!!! Bestil nå før tilbudet er borte',
      meny: ['Sko', 'Jakker', 'Vesker', 'SALG -90%'],
      banner: { tittel: 'MEGA SALG -90% PÅ ALT', tekst: 'Kun idag! Original merkevarer til laveste pris i norge' },
      nedtelling: '00:04:59',
      vurdering: '5,0 · Alle kunder er fornøyd',
      produkter: [
        { navn: 'Vinterstøvler dame, ekte skinn', forPris: '2 999 kr', pris: '299 kr', merke: 'Bare 2 igjen!', bilde: 'bilder/produkter/vinterstovler.jpg', ikon: '👢', bakgrunn: '#f3e6e0' },
        { navn: 'Dunjakke, kjent merke', forPris: '4 500 kr', pris: '399 kr', merke: 'Bare 1 igjen!', bilde: 'bilder/produkter/dunjakke.jpg', ikon: '🧥', bakgrunn: '#e6e9ef' },
        { navn: 'Skinnveske', forPris: '3 200 kr', pris: '249 kr', bilde: 'bilder/produkter/skinnveske.jpg', ikon: '👜', bakgrunn: '#efe6dc' }
      ],
      bunn: ['Kontakt: merkevareoutlet.service@gmail.com'],
      betaling: ['Visa', 'Mastercard']
    },
    svar: 'svindel',
    forklaring: 'Svindel – her er det mange tegn: 90 % rabatt, nedtelling, «bare 2 igjen», adresse som slutter på .shop, «Ikke sikker» i adressefeltet, skrivefeil («Bestil», «idag»), kontakt via Gmail, ingen org.nr. og bare kortbetaling.'
  },
  {
    type: 'sms',
    tittel: 'SMS om tollgebyr',
    fra: 'PakkeNorge',
    tid: 'I dag 07:42',
    tekst: 'Pakken din er holdt tilbake på grunn av ubetalt tollgebyr (24,50 kr). Betal innen 12 timer, ellers sendes pakken i retur: <span class="lenke">https://pakkenorge.gebyr-betaling.com/no</span>',
    svar: 'svindel',
    forklaring: 'Svindel. Lenken går til «gebyr-betaling.com», ikke PakkeNorge. Meldingen sier ikke hvilken butikk pakken er fra, beløpet er lite, og fristen skal stresse deg. Avsendernavnet kan forfalskes.'
  },
  {
    type: 'nettside',
    tittel: 'Bokhylla Bokhandel',
    url: 'https://www.bokhylla.no/romaner',
    butikk: {
      navn: 'Bokhylla',
      logo: '📚',
      farge: '#5a3e8a',
      toppstripe: 'Fri frakt over 349 kr · Bokhandel i Trondheim sentrum siden 1979',
      meny: ['Romaner', 'Krim', 'Fagbøker', 'Barnebøker'],
      banner: { tittel: 'Ukens anbefalinger', tekst: 'Bokhandlerne våre har valgt ut høstens beste romaner.' },
      produkter: [
        { navn: 'Roman: «Huset ved fjorden»', pris: '449,-', bilde: 'bilder/produkter/bok-roman.jpg', ikon: '📕', bakgrunn: '#f1e7e7' },
        { navn: 'Krim: «Siste ferge»', forPris: '399,-', pris: '319,-', merke: '-20 %', bilde: 'bilder/produkter/bok-krim.jpg', ikon: '📘', bakgrunn: '#e5eaf2' },
        { navn: 'Kokebok: «Mormors kjøkken»', pris: '379,-', bilde: 'bilder/produkter/bok-kokebok.jpg', ikon: '📗', bakgrunn: '#e6efe4' }
      ],
      bunn: ['Bokhylla AS · Org.nr. 976 112 340', 'Munkegata 22, 7011 Trondheim · Tlf. 73 52 18 40', 'Åpent man–fre 10–18, lør 10–16 · Kjøpsvilkår · Angrerett'],
      betaling: ['Vipps', 'Klarna', 'Visa', 'Mastercard']
    },
    svar: 'ekte',
    forklaring: 'Ekte. Riktig .no-adresse, vanlige priser, flere betalingsmåter, og butikken oppgir org.nr., adresse, telefon og åpningstider.'
  },
  {
    type: 'bilde',
    tittel: 'Bilde 1',
    src: 'bilder/test2-ki.jpg',
    alt: 'Bilde du skal vurdere',
    svar: 'ki',
    forklaring: 'Dette bildet er laget av KI, med Microsoft Designer. Se på tastaturet: bokstavene står i feil rekkefølge, og noen taster har bokstaver eller ord som ikke hører hjemme der. Nederst på skjermen er det samme app-ikon (App Store) to ganger. KI er dårlig på tekst og små detaljer som skal stemme. Zoom inn på tekst, tastatur og merkelapper når du er usikker.'
  },
  {
    type: 'epost',
    tittel: 'E-post om sperret konto',
    fraNavn: 'Nordbanken Sikkerhet',
    fraAdresse: 'sikkerhet@nordbank-kundeservice.info',
    emne: 'VIKTIG: Kontoen din er sperret',
    tekst: `
      <p>Kjære kunde,</p>
      <p>Vi har oppdaget uvanlig aktivitet på kontoen din, og den er derfor midlertidig <b>sperret</b>.</p>
      <p>For å åpne kontoen igjen må du bekrefte opplysningene dine innen 24 timer:</p>
      <p><span class="e-knapp" style="background:#0d2c54">Logg inn med BankID her</span></p>
      <p>Hvis du ikke bekrefter, vil kontoen bli stengt permanent.</p>
      <p>Med vennlig hilsen<br>Nordbanken</p>`,
    svar: 'svindel',
    forklaring: 'Svindel. Avsenderen er «nordbank-kundeservice.info», ikke bankens egen adresse. Banken ber deg aldri logge inn via en lenke i e-post. Trusler om sperring og en kort frist er klassiske triks.'
  },
  {
    type: 'valg',
    tittel: 'Hvilken adresse tilhører banken?',
    sporsmal: 'Du skal logge inn i Nordbanken. Hvilken nettadresse er trygg?',
    alternativer: [
      'https://nordbanken.no.logg-inn.com',
      'https://nordbanken-sikker.net',
      'https://www.nordbanken.no',
      'https://www.nordbankem.no'
    ],
    riktig: 2,
    forklaring: 'Bare www.nordbanken.no tilhører banken. Se på det som står rett før den første skråstreken: «logg-inn.com», «nordbanken-sikker.net» og «nordbankem.no» (med m!) er helt andre eiere.'
  },
  {
    type: 'sms',
    tittel: 'SMS fra apoteket',
    fra: 'Byapoteket',
    tid: 'I dag 11:20',
    tekst: 'Reseptvarene dine er klare for henting hos Byapoteket i Storgata 5. Husk legitimasjon. Varene holdes av i 7 dager.',
    svar: 'ekte',
    forklaring: 'Ekte. Meldingen har ingen lenke, ber ikke om penger eller opplysninger, og har ingen tidspress utover en vanlig hentefrist.'
  },
  {
    type: 'nettside',
    tittel: 'Kopi av Fjelltopp Sport',
    url: 'https://www.fjelltoppsport-salg.store',
    butikk: {
      navn: 'Fjelltopp Sport',
      logo: '⛰️',
      farge: '#9a2b1f',
      toppstripe: 'OFFISIELL OUTLET · Siste dag med salg!',
      meny: ['Herre', 'Dame', 'Barn', 'Ski', 'Tur'],
      banner: { tittel: 'Konkurssalg – alt skal ut!', tekst: 'Alle jakker 80 % billigere. Kun i dag.' },
      nedtelling: '01:12:30',
      produkter: [
        { navn: 'Skalljakke herre, Gore-Tex', forPris: '3 499,-', pris: '699,-', merke: '-80 %', bilde: 'bilder/produkter/skalljakke.jpg', ikon: '🧥', bakgrunn: '#efe6e3' },
        { navn: 'Dunjakke herre, lett', forPris: '2 799,-', pris: '559,-', merke: '-80 %', bilde: 'bilder/produkter/dunjakke.jpg', ikon: '🧥', bakgrunn: '#e4e8ee' },
        { navn: 'Ullgenser, norsk ull', forPris: '1 199,-', pris: '239,-', merke: '-80 %', bilde: 'bilder/produkter/ullgenser.jpg', ikon: '🧶', bakgrunn: '#eceae4' }
      ],
      bunn: ['Kontakt: post@fjelltopp-outlet-store.com'],
      betaling: ['Visa', 'Mastercard']
    },
    svar: 'svindel',
    forklaring: 'Svindel. Navnet, logoen og til og med produktbildene er kopiert fra den ekte butikken (som du kanskje så i første test), men adressen slutter på «fjelltoppsport-salg.store», ikke fjelltoppsport.no. «Konkurssalg» og 80 % rabatt er klassiske triks, og org.nr., adresse og telefon mangler.'
  },
  {
    type: 'bilde',
    tittel: 'Bilde 2',
    src: 'bilder/test2-ekte.jpg',
    alt: 'Bilde du skal vurdere',
    svar: 'ekte',
    forklaring: 'Dette er et ekte foto, tatt av James McKinven (Unsplash). Se på docken nederst på skjermen: Der er mange ulike, kjente app-ikoner, og ingen av dem står to ganger. Sammenlign med KI-bildet av laptopen, der samme ikon gikk igjen og tastaturet var rotete. Husk likevel at et ekte bilde ikke betyr at butikken er ekte.'
  },
  {
    type: 'valg',
    tittel: 'Hva gjør du med pakke-SMS-en?',
    sporsmal: 'Du får en SMS om at du må betale 29 kr for at pakken din skal bli levert. Hva er det tryggeste å gjøre?',
    alternativer: [
      'Trykke på lenken og betale – det er jo bare 29 kroner.',
      'Svare på SMS-en og spørre om den er ekte.',
      'Ikke trykke på lenken, men stoppe opp og tenke: Har jeg faktisk bestilt noe? Hvis ja, sjekke pakken selv på fraktselskapets offisielle nettside eller app.',
      'Sende meldingen videre til familien, så de også betaler i tide.'
    ],
    riktig: 2,
    forklaring: 'Trykk aldri på lenken i meldingen. Stopp og tenk deg om: Venter du faktisk på en pakke? Har du ikke bestilt noe, kan du bare slette meldingen. Venter du på en pakke, sjekker du den selv – i fraktselskapets egen app eller ved å skrive inn adressen til den offisielle nettsiden. Svarer du på SMS-en, snakker du bare med svindleren.'
  }
];

/* ---------------------------------------------------------
   BILDEPAR I LÆRINGSARENAEN (modul 3)
   Ett KI-bilde og ett ekte bilde av omtrent det samme.
   Vises bare hvis begge bildefilene finnes.
   --------------------------------------------------------- */
const BILDE_PAR = [
  {
    ki: 'bilder/laering-ki-1.jpg',
    ekte: 'bilder/laering-ekte-1.jpg',
    forklaring: 'Jakken som er merket «Laget av KI», er laget med Microsoft Designer. Den har ingen tydelige feil, og logoen til et kjent merke er kopiert nesten perfekt. Det som skiller den fra et ekte foto, er at stoffet er helt glatt, uten folder, lo eller ujevne sømmer. Bilder av kjente merkevarer beviser ikke at varen er ekte.'
  },
  {
    ki: 'bilder/laering-ki-2.jpg',
    ekte: 'bilder/laering-ekte-2.jpg',
    forklaring: 'Stolen som er merket «Laget av KI», er laget med Microsoft Designer. Den ser ut som et vanlig produktbilde i en stue, med plante og teppe. Legg merke til at alt er perfekt: ingen skygger som faller rart, ingen bruksmerker, og et rom som ser ut som en reklame. KI-bilder kan se helt riktige ut. Derfor må du sjekke butikken, ikke bare bildet.'
  }
];
