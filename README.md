# Senior vs Svindel – nettsiden

Nettside der eldre (60+) kan øve seg på å kjenne igjen falske nettbutikker, KI-bilder og svindelmeldinger.

## Flyten

1. **Vanskelig test** (`test.html`): først spør vi hvor sikker brukeren er, og så kommer oppgavene med 40 sekunders tidsgrense. Brukeren får ikke vite svarene underveis. Testen er laget med vilje så vanskelig at nesten ingen klarer den. Resultatsiden sammenligner hvor sikker brukeren sa seg å være med hvor mange riktige svar hen faktisk fikk.
2. **Læringsarenaen** (`laering.html`): fem moduler:
   1. Falske nettbutikker: «finn de 7 tegnene» ved å trykke på dem
   2. Les nettadressen: øvelse i å finne hvem som eier en adresse
   3. KI-bilder: tipskort og bildepar
   4. Falske meldinger: «finn de 5 tegnene» i en SMS
   5. Huskeregelen Stopp – Sjekk – Spør og nyttige verktøy
3. **Lettere test** (`ny-test.html`): ingen tidsgrense, og forklaring etter hver oppgave. Resultatet sammenlignes med første test.

`hjelp.html` forteller hva man gjør hvis man er svindlet.

## Slik åpner dere siden

Dobbeltklikk på `index.html`. Siden trenger verken internett eller noe som må installeres (bortsett fra skrifttypen, som lastes fra Google Fonts).

## Slik endrer dere oppgavene

Alle testoppgavene ligger i **`js/sporsmal.js`**. Hver oppgave er et objekt. Kopier en som ligner, og endre teksten. Øverst i filen står hvilke typer som finnes:

| Type | Hva det er | Svar |
|---|---|---|
| `nettside` | Nettbutikk (ferdig mal) eller egen HTML | `'ekte'` / `'svindel'` |
| `sms` | SMS i en mobiltelefon | `'ekte'` / `'svindel'` |
| `epost` | E-post | `'ekte'` / `'svindel'` |
| `bilde` | Bilde fra mappen `bilder/` | `'ekte'` / `'ki'` |
| `valg` | Flervalgsspørsmål | `riktig: 0, 1, 2 …` |

Tidsgrensen i den vanskelige testen endres med `TIDSGRENSE_VANSKELIG` øverst i filen. Sett den til `null` for å skru den av.

## Produktbilder i nettbutikkene

Produktene i nettbutikkene bruker ekte fotografier fra Unsplash, som ligger i `bilder/produkter/`. Kildene står i `bilder/produkter/KILDER.md`. Et nytt produkt får bilde med `bilde: 'bilder/produkter/filnavn.jpg'`. Uten `bilde` vises ikonet (`ikon`) i stedet.

## Slik legger dere til bilder (KI og ekte)

Bildeoppgavene vises **bare hvis bildefilen finnes**, så siden fungerer også uten bilder. Legg filene i mappen `bilder/` med disse navnene:

| Filnavn | Brukes i |
|---|---|
| `test1-ki.jpg`, `test1-ekte.jpg` | Vanskelig test (velg et svært troverdig KI-bilde) |
| `test2-ki.jpg`, `test2-ekte.jpg` | Lettere test (velg et KI-bilde med tydelige feil) |
| `laering-ki-1.jpg`, `laering-ekte-1.jpg` | Bildepar i læringsarenaen |
| `laering-ki-2.jpg`, `laering-ekte-2.jpg` | Bildepar nr. 2 i læringsarenaen |

Skriv så en forklaring på hva som avslører bildet i `forklaring` for oppgaven i `js/sporsmal.js`. Der står det nå «Gruppen: skriv her …».

Tips: Lag KI-bildene selv (f.eks. med Copilot, ChatGPT eller Gemini) av produkter som jakker, møbler eller elektronikk, slik det ville sett ut i en nettbutikk. Bruk egne bilder eller fritt lisensierte bilder som ekte bilder, og noter kilden i rapporten.

## Legge siden ut på nett

Siden består bare av statiske filer, så den kan legges på **GitHub Pages**, Netlify eller NTNUs hjemmeområde. Lenken kan brukes på plakatene, gjerne som QR-kode.

## Viktig

- Alle butikker, banker og firmaer (Nordbanken, PakkeNorge, Fjelltopp Sport osv.) er **oppdiktet**. Bruk ikke ekte firmanavn og logoer.
- Eksempelsidene har ingen ekte skjemafelt, så brukerne kan ikke skrive inn personopplysninger ved et uhell.
- Fremgang (testresultater og fullførte moduler) lagres bare i brukerens egen nettleser.
