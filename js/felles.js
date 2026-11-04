/* =========================================================
   Senior vs Svindel – felles kode for alle sidene
   ========================================================= */

// Lagring i nettleseren. Pakket inn i try/catch fordi lagring kan være slått av
// (f.eks. i privat modus). Siden skal fungere uansett.
const Lagring = {
  hent(nokkel, standard) {
    try {
      const verdi = localStorage.getItem('svs-' + nokkel);
      return verdi === null ? standard : JSON.parse(verdi);
    } catch (e) {
      return standard;
    }
  },
  lagre(nokkel, verdi) {
    try {
      localStorage.setItem('svs-' + nokkel, JSON.stringify(verdi));
    } catch (e) {
      // Ignorer – lagring er bare en bonus
    }
  }
};

// ---------- Tekststørrelse (A / A+ / A++) ----------
function settTekststorrelse(niva) {
  document.documentElement.dataset.tekst = niva;
  Lagring.lagre('tekst', niva);
  document.querySelectorAll('[data-tekstknapp]').forEach(knapp => {
    knapp.setAttribute('aria-pressed', String(knapp.dataset.tekstknapp === niva));
  });
}

settTekststorrelse(Lagring.hent('tekst', 'normal'));
document.querySelectorAll('[data-tekstknapp]').forEach(knapp => {
  knapp.addEventListener('click', () => settTekststorrelse(knapp.dataset.tekstknapp));
});

// Marker gjeldende side i menyen
document.querySelectorAll('.hovedmeny a').forEach(lenke => {
  const side = location.pathname.split('/').pop() || 'index.html';
  if (lenke.getAttribute('href') === side) lenke.setAttribute('aria-current', 'page');
});

// Sjekker om en bildefil finnes (brukes for å hoppe over bildeoppgaver uten bilde)
function bildeFinnes(src) {
  return new Promise(ferdig => {
    const bilde = new Image();
    bilde.onload = () => ferdig(true);
    bilde.onerror = () => ferdig(false);
    bilde.src = src;
  });
}

/* =========================================================
   Visning av eksempler: nettsider, SMS, e-post og bilder.
   Tekstene kommer fra js/sporsmal.js og kan inneholde HTML.
   ========================================================= */

function lagNettleser(url, innhold) {
  const sikker = url.startsWith('https://');
  return `
    <figure class="nettleser" aria-label="Eksempel på nettside">
      <div class="nettleser-topp">
        <div class="prikker" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="adressefelt">
          ${sikker ? '<span aria-label="Hengelås">🔒</span>' : '<span class="ikke-sikker">⚠ Ikke sikker</span>'}
          <span class="url">${url}</span>
        </div>
      </div>
      <div class="nettleser-side">${innhold}</div>
    </figure>`;
}

function lagButikk(b) {
  const produkter = b.produkter.map(p => `
    <div class="b-produkt">
      ${p.merke ? `<span class="b-merke">${p.merke}</span>` : ''}
      ${p.bilde
        ? `<div class="b-bilde"><img src="${p.bilde}" alt="" loading="lazy"></div>`
        : `<div class="b-bilde" style="background:${p.bakgrunn || '#f0eeea'}" aria-hidden="true">${p.ikon}</div>`}
      <div class="b-pnavn">${p.navn}</div>
      <div class="b-pris">${p.forPris ? `<s>${p.forPris}</s> <b class="tilbud">${p.pris}</b>` : `<b>${p.pris}</b>`}</div>
    </div>`).join('');

  return `
    <div class="butikk" style="--merke:${b.farge}">
      ${b.toppstripe ? `<div class="b-toppstripe">${b.toppstripe}</div>` : ''}
      <div class="b-topp">
        <span class="b-logo">${b.logo ? b.logo + ' ' : ''}${b.navn}${b.undertittel ? `<small>${b.undertittel}</small>` : ''}</span>
        <span class="b-meny">${b.meny.map(m => `<span>${m}</span>`).join('')}</span>
        <span class="b-kurv" aria-hidden="true">🛒</span>
      </div>
      ${b.banner ? `
        <div class="b-banner">
          <h3>${b.banner.tittel}</h3>
          <p>${b.banner.tekst}</p>
          ${b.nedtelling ? `<div class="b-nedtelling">⏱ Tilbudet slutter om ${b.nedtelling}</div>` : ''}
        </div>` : ''}
      ${b.vurdering ? `<div class="b-vurdering"><span class="stjerner">★★★★★</span> ${b.vurdering}</div>` : ''}
      <div class="b-produkter">${produkter}</div>
      <div class="b-bunn">
        <div>${b.bunn.map(linje => `<div>${linje}</div>`).join('')}</div>
        <div>Betal med: ${b.betaling.map(x => `<span class="b-betal">${x}</span>`).join('')}</div>
      </div>
    </div>`;
}

function lagSms(m) {
  return `
    <div class="telefon" aria-label="Eksempel på SMS">
      <div class="t-skjerm">
        <div class="t-topp">
          <div class="t-avatar" aria-hidden="true">${m.fra.replace(/[^A-Za-zÆØÅæøå0-9+]/g, '').charAt(0) || '?'}</div>
          <div class="t-avsender">${m.fra}</div>
          <div class="t-under">${m.fraUnder || 'SMS'}</div>
        </div>
        <div class="t-meldinger">
          <div class="t-tid">${m.tid || 'I dag 09:14'}</div>
          <div class="t-boble">${m.tekst}</div>
        </div>
      </div>
    </div>`;
}

function lagEpost(m) {
  return `
    <div class="epost" aria-label="Eksempel på e-post">
      <div class="e-verktoy">📥 Innboks</div>
      <div class="e-hode">
        <div class="e-emne">${m.emne}</div>
        <div class="e-fra">Fra: <b>${m.fraNavn}</b> <span class="adresse">&lt;${m.fraAdresse}&gt;</span></div>
      </div>
      <div class="e-tekst">${m.tekst}</div>
    </div>`;
}

function lagBilde(q) {
  return `<figure class="bildeoppgave"><img src="${q.src}" alt="${q.alt || 'Bilde du skal vurdere'}"></figure>`;
}

// Velger riktig visning ut fra oppgavetypen
function visEksempel(q) {
  switch (q.type) {
    case 'nettside': return lagNettleser(q.url, q.butikk ? lagButikk(q.butikk) : q.innhold);
    case 'sms': return lagSms(q);
    case 'epost': return lagEpost(q);
    case 'bilde': return lagBilde(q);
    case 'valg': return q.innhold || '';
    default: return '';
  }
}
