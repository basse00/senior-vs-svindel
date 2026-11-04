/* =========================================================
   Læringsarenaen: moduler, «finn feilene», nettadresser,
   bildepar og små kontrollspørsmål
   ========================================================= */
(function () {
  // ---------- Navigasjon mellom moduler ----------
  const moduler = [...document.querySelectorAll('.modul')];
  const navKnapper = [...document.querySelectorAll('.steg-nav button')];
  let ferdige = Lagring.hent('ferdigeModuler', []);

  function visModul(nr, rull) {
    moduler.forEach(m => { m.hidden = m.dataset.modul !== String(nr); });
    navKnapper.forEach(k => {
      k.setAttribute('aria-current', k.dataset.gaa === String(nr) ? 'step' : 'false');
      k.classList.toggle('ferdig', ferdige.includes(k.dataset.gaa));
    });
    Lagring.lagre('modul', nr);
    if (rull) document.querySelector('.steg-nav').scrollIntoView({ behavior: 'smooth' });
  }

  function merkFerdig(nr) {
    if (!ferdige.includes(String(nr))) {
      ferdige.push(String(nr));
      Lagring.lagre('ferdigeModuler', ferdige);
    }
  }

  navKnapper.forEach(k => k.addEventListener('click', () => visModul(Number(k.dataset.gaa), false)));
  moduler.forEach(m => {
    const nr = Number(m.dataset.modul);
    m.querySelector('[data-neste]')?.addEventListener('click', () => {
      merkFerdig(nr);
      visModul(nr + 1, true);
    });
    m.querySelector('[data-forrige]')?.addEventListener('click', () => visModul(nr - 1, true));
  });
  // Siste modul regnes som ferdig når den åpnes
  const sisteNr = moduler.length;
  navKnapper[sisteNr - 1].addEventListener('click', () => merkFerdig(sisteNr));

  const lagretModul = Number(Lagring.hent('modul', 1));
  visModul(lagretModul >= 1 && lagretModul <= moduler.length ? lagretModul : 1, false);

  // ---------- «Finn tegnene på svindel» ----------
  document.querySelectorAll('.finn-feil').forEach(oppgave => {
    const omrade = oppgave.querySelector('.finn-omrade');
    const punkter = [...oppgave.querySelectorAll('.funn-liste li')];
    const status = oppgave.querySelector('.finn-status');
    const teller = oppgave.querySelector('.finn-teller');

    function oppdaterTeller() {
      const antall = punkter.filter(p => p.classList.contains('vist')).length;
      teller.textContent = `Funnet: ${antall} av ${punkter.length}`;
      if (antall === punkter.length) {
        status.innerHTML = '🎉 <b>Flott! Du fant alle tegnene.</b>';
        status.className = 'finn-status ok';
      }
    }

    function finn(id) {
      omrade.querySelectorAll(`[data-funn="${id}"]`).forEach(el => el.classList.add('funnet'));
      const punkt = oppgave.querySelector(`.funn-liste li[data-for="${id}"]`);
      const nytt = !punkt.classList.contains('vist');
      punkt.classList.add('vist');
      return { punkt, nytt };
    }

    omrade.addEventListener('click', e => {
      // Velg det innerste merkede elementet (f.eks. «Bare 2 igjen» inni et produkt)
      const treff = e.target.closest('[data-funn]');
      if (!treff) {
        status.textContent = 'Her ser alt greit ut. Prøv et annet sted!';
        status.className = 'finn-status';
        return;
      }
      const { punkt, nytt } = finn(treff.dataset.funn);
      status.innerHTML = nytt
        ? `✔ Godt sett: <b>${punkt.querySelector('strong').textContent}</b>. Les forklaringen i listen.`
        : 'Det har du allerede funnet. Let videre!';
      status.className = 'finn-status ok';
      punkt.classList.add('blink');
      setTimeout(() => punkt.classList.remove('blink'), 1500);
      oppdaterTeller();
    });

    oppgave.querySelector('.vis-alle').addEventListener('click', () => {
      punkter.forEach(p => finn(p.dataset.for));
      oppdaterTeller();
    });

    oppdaterTeller();
  });

  // ---------- Ekte eller falsk nettadresse ----------
  document.querySelectorAll('.adresse-oppgave').forEach(el => {
    const url = el.dataset.url;
    const [protokoll, rest] = url.split('://');
    const vert = rest.split('/')[0];
    const sti = rest.slice(vert.length);
    const eier = vert.split('.').slice(-2).join('.');
    const foran = vert.slice(0, vert.length - eier.length);

    el.innerHTML = `
      <div class="adresse-tekst">${url}</div>
      <div class="adresse-knapper">
        <button type="button" class="knapp svar-ekte" data-v="ekte">✔ Ekte</button>
        <button type="button" class="knapp svar-svindel" data-v="falsk">⚠ Falsk</button>
      </div>
      <div class="adresse-svar" aria-live="polite"></div>`;

    el.querySelectorAll('button').forEach(knapp => {
      knapp.addEventListener('click', () => {
        const riktig = knapp.dataset.v === el.dataset.svar;
        el.querySelector('.adresse-tekst').innerHTML =
          `<span class="del-dempet">${protokoll}://${foran}</span><mark>${eier}</mark><span class="del-dempet">${sti}</span>`;
        el.querySelector('.adresse-svar').innerHTML =
          `<b>${riktig ? '✔ Riktig!' : '✘ Feil.'}</b> Adressen er <b>${el.dataset.svar}</b>. Eieren er <b>${eier}</b>. ${el.dataset.forklaring || ''}`;
        el.classList.add(riktig ? 'riktig' : 'feil');
        el.querySelectorAll('button').forEach(b => { b.disabled = true; });
        knapp.classList.add('valgt');
      });
    });
  });

  // ---------- Bildepar (vises bare når bildene finnes) ----------
  const parBoks = document.getElementById('bildepar');
  if (parBoks && typeof BILDE_PAR !== 'undefined') {
    Promise.all(BILDE_PAR.map(par =>
      Promise.all([bildeFinnes(par.ki), bildeFinnes(par.ekte)]).then(([a, b]) => (a && b ? par : null))
    )).then(liste => {
      const gyldige = liste.filter(Boolean);
      if (!gyldige.length) return;
      parBoks.hidden = false;
      const beholder = document.getElementById('bildepar-liste');
      gyldige.forEach(par => {
        const kiForst = Math.random() < 0.5;
        const bilder = kiForst ? [['ki', par.ki], ['ekte', par.ekte]] : [['ekte', par.ekte], ['ki', par.ki]];
        const blokk = document.createElement('div');
        blokk.innerHTML = `
          <div class="bildepar">
            ${bilder.map(([type, src], i) => `
              <button type="button" data-type="${type}">
                <img src="${src}" alt="Bilde ${i + 1}">
                <span>Bilde ${i + 1}</span>
              </button>`).join('')}
          </div>
          <div class="mq-svar" aria-live="polite"></div>`;
        const svarboks = blokk.querySelector('.mq-svar');
        blokk.querySelectorAll('button').forEach(knapp => {
          knapp.addEventListener('click', () => {
            const riktig = knapp.dataset.type === 'ki';
            blokk.querySelectorAll('button').forEach(b => {
              b.disabled = true;
              b.classList.add(b.dataset.type === 'ki' ? 'er-ki' : 'er-ekte');
              b.querySelector('span').textContent = b.dataset.type === 'ki' ? '🤖 Laget av KI' : '📷 Ekte foto';
            });
            svarboks.className = 'mq-svar ' + (riktig ? 'riktig' : 'feil');
            svarboks.innerHTML = `<b>${riktig ? '✔ Riktig!' : '✘ Ikke denne gangen.'}</b> ${par.forklaring || ''}`;
          });
        });
        beholder.appendChild(blokk);
      });
    });
  }

  // ---------- Små kontrollspørsmål ----------
  document.querySelectorAll('.miniquiz').forEach(quiz => {
    const svarboks = quiz.querySelector('.mq-svar');
    const knapper = [...quiz.querySelectorAll('.mq-valg button')];
    knapper.forEach(knapp => {
      knapp.addEventListener('click', () => {
        const riktig = knapp.hasAttribute('data-riktig');
        knapper.forEach(k => k.classList.remove('valgt'));
        knapp.classList.add('valgt');
        svarboks.className = 'mq-svar ' + (riktig ? 'riktig' : 'feil');
        svarboks.innerHTML = `<b>${riktig ? '✔ ' : '✘ '}</b>${knapp.dataset.tilbakemelding}${riktig ? '' : ' <i>Prøv et annet svar.</i>'}`;
        if (riktig) {
          knapper.forEach(k => { k.disabled = true; });
          knapp.classList.add('er-riktig');
        }
      });
    });
  });
})();
