/* =========================================================
   Kjører testene
   test.html      → vanskelig førstetest (med tidsgrense, svar til slutt)
   ny-test.html   → lettere slutt-test (forklaring etter hver oppgave)
   ========================================================= */
(function () {
  const testNr = window.TESTNUMMER === 2 || new URLSearchParams(location.search).get('test') === '2' ? 2 : 1;
  const oppsett = testNr === 1
    ? { sporsmal: VANSKELIG_TEST, tidsgrense: TIDSGRENSE_VANSKELIG, visSvarUnderveis: false }
    : { sporsmal: LETT_TEST, tidsgrense: null, visSvarUnderveis: true };

  const SIKKERHET = ['Ikke sikker', 'Litt usikker', 'Middels sikker', 'Ganske sikker', 'Helt sikker'];

  const rot = document.getElementById('test');
  let oppgaver = [];
  let indeks = 0;
  let svar = [];
  let sikkerhet = null;
  let tidtaker = null;

  if (testNr === 2) document.title = 'Ny test – Senior vs Svindel';

  // ---------- Hjelpefunksjoner ----------
  function sporsmalTekst(q) {
    if (q.type === 'valg') return q.sporsmal;
    if (q.type === 'bilde') return 'Er dette et ekte foto, eller er bildet laget av KI?';
    if (q.type === 'nettside') return 'Er denne nettsiden ekte, eller er det svindel?';
    return 'Er denne meldingen ekte, eller er det svindel?';
  }

  function svaralternativer(q) {
    if (q.type === 'valg') return q.alternativer.map((tekst, i) => ({ verdi: String(i), tekst, klasse: 'knapp-valg' }));
    if (q.type === 'bilde') return [
      { verdi: 'ekte', tekst: '📷 Ekte foto', klasse: 'svar-ekte' },
      { verdi: 'ki', tekst: '🤖 Laget av KI', klasse: 'svar-svindel' }
    ];
    return [
      { verdi: 'ekte', tekst: '✔ Ekte', klasse: 'svar-ekte' },
      { verdi: 'svindel', tekst: '⚠ Svindel', klasse: 'svar-svindel' }
    ];
  }

  function riktigSvar(q) {
    return q.type === 'valg' ? String(q.riktig) : q.svar;
  }

  function svarTekst(q, verdi) {
    if (verdi === null) return 'Tiden gikk ut';
    const alt = svaralternativer(q).find(a => a.verdi === verdi);
    return alt ? alt.tekst.replace(/^[^\wÆØÅæøå«]+/, '') : verdi;
  }

  function prosent(riktige, antall) {
    return antall ? Math.round((riktige / antall) * 100) : 0;
  }

  // ---------- Oppstart ----------
  async function klargjor() {
    // Bildeoppgaver tas bare med hvis bildefilen faktisk finnes
    const finnes = await Promise.all(oppsett.sporsmal.map(q => (q.type === 'bilde' ? bildeFinnes(q.src) : true)));
    oppgaver = oppsett.sporsmal.filter((q, i) => finnes[i]);
    visIntro();
  }

  function visIntro() {
    if (testNr === 1) {
      rot.innerHTML = `
        <div class="smal">
          <p class="overtittel">Del 1 av 3</p>
          <h1>Test deg selv</h1>
          <p class="ingress">Du får se ${oppgaver.length} nettsider, meldinger og bilder. For hver av dem skal du svare om den er <b>ekte</b> eller <b>svindel</b>.</p>
          ${oppsett.tidsgrense ? `
          <div class="kort varsel-kort">
            <p><strong>⏱ Du har ${oppsett.tidsgrense} sekunder på hver oppgave.</strong></p>
            <p>Svindlere vil at du skal handle raskt – derfor har du dårlig tid her også. Du får vite hvordan det gikk når du er ferdig.</p>
          </div>` : ''}
          <h2>Før du begynner: Hvor sikker er du?</h2>
          <p>Hvor sikker er du på at du ville oppdaget en falsk nettbutikk eller en svindelmelding?</p>
          <div class="sikkerhet" role="group" aria-label="Hvor sikker er du?">
            ${SIKKERHET.map((tekst, i) => `<button type="button" data-sikkerhet="${i + 1}" aria-pressed="false"><b>${i + 1}</b> ${tekst}</button>`).join('')}
          </div>
          <button class="knapp knapp-stor" id="start">Start testen →</button>
        </div>`;
      rot.querySelectorAll('[data-sikkerhet]').forEach(knapp => {
        knapp.addEventListener('click', () => {
          sikkerhet = Number(knapp.dataset.sikkerhet);
          rot.querySelectorAll('[data-sikkerhet]').forEach(k => k.setAttribute('aria-pressed', String(k === knapp)));
        });
      });
    } else {
      rot.innerHTML = `
        <div class="smal">
          <p class="overtittel">Del 3 av 3</p>
          <h1>Ny test</h1>
          <p class="ingress">Nå er det på tide å bruke det du har lært. Denne gangen har du god tid, og du får svar og forklaring etter hver oppgave.</p>
          <div class="kort">
            <h3>Husk å se etter:</h3>
            <ul class="sjekkliste">
              <li>Hvem eier nettadressen? Les det som står rett før den første skråstreken.</li>
              <li>Er prisen for god til å være sann?</li>
              <li>Prøver noen å stresse deg med nedtelling eller frister?</li>
              <li>Finnes org.nr., adresse og telefonnummer?</li>
              <li>Kan du betale på flere måter, eller bare med kort?</li>
            </ul>
          </div>
          <button class="knapp knapp-stor" id="start">Start den nye testen →</button>
        </div>`;
    }
    document.getElementById('start').addEventListener('click', () => {
      indeks = 0;
      svar = [];
      visOppgave();
    });
  }

  // ---------- Oppgavene ----------
  function visOppgave() {
    const q = oppgaver[indeks];
    const erValg = q.type === 'valg';
    rot.innerHTML = `
      <div class="${erValg ? 'smal' : ''}">
        <div class="test-topp">
          <span>Oppgave ${indeks + 1} av ${oppgaver.length}</span>
          ${oppsett.tidsgrense ? '<span class="tidtaker" id="tidtaker"></span>' : ''}
        </div>
        <div class="fremdrift" aria-hidden="true"><span style="width:${(indeks / oppgaver.length) * 100}%"></span></div>
        ${oppsett.tidsgrense ? '<div class="tidslinje" id="tidslinje" aria-hidden="true"><span></span></div>' : ''}
        <h1 class="sporsmal-tekst">${sporsmalTekst(q)}</h1>
        <div class="oppgave">${visEksempel(q)}</div>
        <div class="svarknapper ${erValg ? 'valg-liste' : ''}" id="svarknapper">
          ${svaralternativer(q).map(a => `<button type="button" class="knapp knapp-stor ${a.klasse}" data-verdi="${a.verdi}">${a.tekst}</button>`).join('')}
        </div>
        <div id="tilbakemelding" aria-live="polite"></div>
      </div>`;
    rot.querySelectorAll('#svarknapper button').forEach(knapp => {
      knapp.addEventListener('click', () => registrerSvar(knapp.dataset.verdi));
    });
    window.scrollTo(0, 0);
    startTid();
  }

  function registrerSvar(verdi) {
    stoppTid();
    const q = oppgaver[indeks];
    const riktig = verdi === riktigSvar(q);
    svar.push({ verdi, riktig });
    if (oppsett.visSvarUnderveis) {
      visTilbakemelding(q, verdi, riktig);
    } else {
      neste();
    }
  }

  function visTilbakemelding(q, verdi, riktig) {
    const knapper = document.getElementById('svarknapper');
    if (q.type === 'valg') {
      // Behold alternativene, men vis hva som var valgt og hva som var riktig
      knapper.querySelectorAll('button').forEach(k => {
        k.disabled = true;
        if (k.dataset.verdi === verdi) k.classList.add('valgt');
        if (k.dataset.verdi === riktigSvar(q)) k.classList.add('er-riktig');
      });
    } else {
      knapper.hidden = true;
    }
    const siste = indeks === oppgaver.length - 1;
    const boks = document.getElementById('tilbakemelding');
    boks.innerHTML = `
      <div class="tilbakemelding ${riktig ? 'riktig' : 'feil'}">
        <p class="tb-tittel">${riktig ? '✔ Riktig!' : '✘ Ikke helt'}</p>
        ${q.type === 'valg' ? '' : `<p>Du svarte: <b>${svarTekst(q, verdi)}</b>. Riktig svar er: <b>${svarTekst(q, riktigSvar(q))}</b>.</p>`}
        <p>${q.forklaring}</p>
        <button type="button" class="knapp knapp-stor" id="neste">${siste ? 'Se resultatet →' : 'Neste oppgave →'}</button>
      </div>`;
    document.getElementById('neste').addEventListener('click', neste);
    boks.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function neste() {
    indeks++;
    if (indeks < oppgaver.length) visOppgave();
    else visResultat();
  }

  // ---------- Tidsgrense (bare test 1) ----------
  function startTid() {
    if (!oppsett.tidsgrense) return;
    let igjen = oppsett.tidsgrense;
    const tekst = document.getElementById('tidtaker');
    const linje = document.getElementById('tidslinje');
    const oppdater = () => {
      tekst.textContent = `⏱ ${igjen} sek igjen`;
      tekst.classList.toggle('lite-tid', igjen <= 10);
      linje.classList.toggle('lite-tid', igjen <= 10);
      linje.firstElementChild.style.width = (igjen / oppsett.tidsgrense) * 100 + '%';
    };
    oppdater();
    tidtaker = setInterval(() => {
      igjen--;
      oppdater();
      if (igjen <= 0) {
        stoppTid();
        tidenErUte();
      }
    }, 1000);
  }

  function stoppTid() {
    clearInterval(tidtaker);
    tidtaker = null;
  }

  function tidenErUte() {
    svar.push({ verdi: null, riktig: false });
    document.getElementById('svarknapper').hidden = true;
    const siste = indeks === oppgaver.length - 1;
    const boks = document.getElementById('tilbakemelding');
    boks.innerHTML = `
      <div class="tilbakemelding feil">
        <p class="tb-tittel">⏱ Tiden er ute!</p>
        <p>I virkeligheten bruker svindlere tidspress for å få deg til å handle før du rekker å tenke deg om.</p>
        <button type="button" class="knapp knapp-stor" id="neste">${siste ? 'Se resultatet →' : 'Neste oppgave →'}</button>
      </div>`;
    document.getElementById('neste').addEventListener('click', neste);
    boks.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ---------- Resultat ----------
  function visResultat() {
    const riktige = svar.filter(s => s.riktig).length;
    const antall = oppgaver.length;
    Lagring.lagre('test' + testNr, { riktige, antall, sikkerhet, dato: new Date().toISOString() });
    rot.innerHTML = testNr === 1 ? resultatVanskelig(riktige, antall) : resultatLett(riktige, antall);
    window.scrollTo(0, 0);
  }

  function resultatVanskelig(riktige, antall) {
    const feil = antall - riktige;
    let sikkerhetTekst = '';
    if (sikkerhet >= 4) {
      sikkerhetTekst = `
        <div class="kort varsel-kort">
          <p>Før testen sa du at du var <b>«${SIKKERHET[sikkerhet - 1].toLowerCase()}»</b> på at du ville oppdaget svindel.</p>
          <p>Det er helt vanlig: 6 av 10 eldre er ikke redde for å bli svindlet. Likevel har 1 av 4 eldre allerede opplevd det.</p>
        </div>`;
    } else if (sikkerhet) {
      sikkerhetTekst = `
        <div class="kort">
          <p>Før testen sa du at du var <b>«${SIKKERHET[sikkerhet - 1].toLowerCase()}»</b>. Det er klokt å være litt på vakt – svindlerne er flinke.</p>
        </div>`;
    }

    return `
      <div class="smal resultat">
        <p class="overtittel">Resultat</p>
        <h1>Du fikk ${riktige} av ${antall} riktige</h1>
        <div class="poeng-stor ${riktige / antall < 0.8 ? 'fare' : 'ok'}">${riktige}<span> / ${antall}</span></div>
        <p class="ingress">${feil > 0
          ? `I virkeligheten kunne svindlere ha lurt deg <b>${feil} ${feil === 1 ? 'gang' : 'ganger'}</b> – og kanskje fått tak i kortnummeret, BankID-en eller pengene dine.`
          : 'Imponerende – du klarte alle! Men svindlerne blir stadig flinkere, så det er lurt å lære mer likevel.'}</p>
        ${sikkerhetTekst}
        <div class="kort">
          <h2>Testen var med vilje svært vanskelig</h2>
          <p>Slik ser virkeligheten ut i dag. Med kunstig intelligens (KI) kan svindlere på få minutter lage nettbutikker, bilder og meldinger som er nesten umulige å skille fra ekte.</p>
          <p><b>Den gode nyheten:</b> Det finnes konkrete tegn du kan lære deg å se etter. Det tar bare noen minutter.</p>
        </div>
        <div class="knapperad">
          <a class="knapp knapp-stor" href="laering.html">Gå til læringsarenaen →</a>
        </div>
        ${fasit()}
      </div>`;
  }

  function resultatLett(riktige, antall) {
    const forste = Lagring.hent('test1', null);
    let sammenligning = '';
    if (forste && forste.antall) {
      const for_ = prosent(forste.riktige, forste.antall);
      const naa = prosent(riktige, antall);
      sammenligning = `
        <div class="sammenligning">
          <div><span>Første test</span><b>${for_} %</b></div>
          <div class="naa"><span>Nå</span><b>${naa} %</b></div>
        </div>
        <p class="ingress">${naa > for_
          ? 'Du har blitt flinkere til å avsløre svindel! 🎉'
          : 'Testene var ulike, så ikke heng deg opp i tallene. Gå gjerne gjennom læringsarenaen en gang til – øvelse gjør mester.'}</p>`;
    }

    return `
      <div class="smal resultat">
        <p class="overtittel">Resultat</p>
        <h1>Du fikk ${riktige} av ${antall} riktige</h1>
        <div class="poeng-stor ${riktige / antall >= 0.6 ? 'ok' : 'fare'}">${riktige}<span> / ${antall}</span></div>
        ${sammenligning}
        <div class="kort">
          <h2>Husk: Stopp – Sjekk – Spør</h2>
          <p><b>✋ Stopp</b> når noen har det travelt. Ekte butikker og banker gir deg tid.</p>
          <p><b>🔍 Sjekk</b> nettadressen, org.nr. og anmeldelser før du betaler.</p>
          <p><b>💬 Spør</b> noen du stoler på hvis du er usikker.</p>
        </div>
        <div class="knapperad">
          <a class="knapp knapp-stor" href="hjelp.html">Hvor får jeg hjelp?</a>
          <a class="knapp knapp-stor knapp-sekundar" href="laering.html">Repeter læringsarenaen</a>
        </div>
        ${fasit()}
      </div>`;
  }

  function fasit() {
    const punkter = oppgaver.map((q, i) => {
      const s = svar[i];
      return `
        <li>
          <strong>${q.tittel || sporsmalTekst(q)}</strong><br>
          Du svarte: ${svarTekst(q, s.verdi)}
          <span class="${s.riktig ? 'merke-riktig' : 'merke-feil'}">${s.riktig ? '✔ Riktig' : '✘ Feil'}</span>
          ${s.riktig ? '' : `<br>Riktig svar: <b>${svarTekst(q, riktigSvar(q))}</b>`}
          <p>${q.forklaring}</p>
        </li>`;
    }).join('');
    return `
      <details class="fasit">
        <summary>Se fasit og forklaring for hver oppgave</summary>
        <ol>${punkter}</ol>
      </details>`;
  }

  klargjor();
})();
