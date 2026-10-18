// Auto Gestió · Manual d'ús complet
(function(){
'use strict';
function ready(){
  if(!document.querySelector('.tabs')) return;
  // El manual anterior es substitueix per una versió completa i coherent amb les funcions reals de l'app.
  const old=document.getElementById('userManual');
  const oldBtn=document.querySelector('[data-tab="userManual"]');
  if(old) old.remove();
  if(oldBtn) oldBtn.remove();

  const tabs=document.querySelector('.tabs');
  const btn=document.createElement('button');
  btn.type='button'; btn.dataset.tab='userManual'; btn.textContent='❓ Com funciona';
  tabs.appendChild(btn);

  const sec=document.createElement('section');
  sec.id='userManual'; sec.className='tab';
  sec.innerHTML=`
  <div class="card">
    <h2>❓ Com funciona Auto Gestió</h2>
    <div class="muted">Manual pas a pas de les funcions que realment incorpora l'app.</div>
  </div>

  <div class="card"><h3>1. 🚗 Afegir un vehicle</h3>
    <p>Prem <b>＋ Vehicle</b> (també tens el botó fix de la part inferior).</p>
    <p>Omple <b>marca</b> i <b>model</b>, que són obligatoris. Pots completar tipus, motor/versió, any, matrícula, VIN, quilometratge i etiqueta ambiental.</p>
    <p>Afegeix també, si vols, les dates d'<b>ITV</b>, <b>assegurança</b> i <b>pròxima revisió</b>, més observacions.</p>
    <p>Finalment prem <b>💾 Guardar vehicle</b>. Les dades queden guardades al dispositiu.</p>
  </div>

  <div class="card"><h3>2. 🖼️ Afegir la foto des de la galeria</h3>
    <p>Prem <b>🖼️ Foto del vehicle (Galeria)</b> i tria una imatge que ja tinguis al mòbil.</p>
    <p>L'app prepara/comprimeix la fotografia abans de guardar-la per evitar problemes d'espai.</p>
    <p>La previsualització apareix al formulari i, en guardar, la foto queda associada al vehicle.</p>
    <div class="small muted">La selecció de fitxer es fa amb el selector del dispositiu; l'app no demana activar la càmera.</div>
  </div>

  <div class="card"><h3>3. ✏️ Editar i consultar un vehicle</h3>
    <p>A <b>🚗 Vehicles</b> apareixen tots els vehicles que hagis afegit.</p>
    <p><b>Fitxa</b> mostra totes les dades, la fotografia i les observacions.</p>
    <p><b>Editar</b> permet canviar qualsevol dada, inclòs el quilometratge i la fotografia.</p>
    <p><b>Eliminar</b> demana confirmació i elimina el vehicle, els seus documents associats i el seu historial de manteniment.</p>
  </div>

  <div class="card"><h3>4. 📊 Panell de control</h3>
    <p>El panell superior calcula automàticament:</p>
    <ul><li>Nombre de vehicles.</li><li>Venciments durant els propers <b>30 dies</b>.</li><li>Venciments ja vençuts.</li><li>Total d'euros de manteniment registrat.</li></ul>
    <p>No cal introduir aquestes xifres manualment: es recalculen quan canvies dades.</p>
  </div>

  <div class="card"><h3>5. 🔧 Què toca fer</h3>
    <p>Aquesta pestanya concentra els avisos de <b>ITV, assegurança i revisió</b> i també controla la revisió per quilometratge.</p>
    <p>Els avisos es classifiquen visualment com a correctes, propers o vençuts.</p>
    <p>Quan hi ha un vehicle amb pla de manteniment integrat, apareix <b>🧠 Pla del manual</b> amb la propera revisió, quilòmetres restants i una llista de treballs.</p>
    <p>També pots obrir la font de manteniment i registrar directament una intervenció.</p>
  </div>

  <div class="card"><h3>6. 🧠 Plans de manteniment</h3>
    <p>Actualment hi ha plans detallats integrats per als vehicles que l'app té configurats amb una font concreta. Per a la resta, l'app <b>no inventa intervals</b>: mostra la font del fabricant quan està disponible i ofereix una cerca específica del manual.</p>
    <p>En afegir un vehicle nou, <b>🔎 Buscar manual i manteniment</b> obre una cerca amb marca, model, motor i any.</p>
    <p>Això permet treballar amb vehicles diferents sense presentar com a oficial un interval que no s'hagi verificat.</p>
  </div>

  <div class="card"><h3>7. 🔧 Registrar un manteniment</h3>
    <p>Prem <b>＋ Registrar manteniment</b> des de <b>Què toca</b>, des de la fitxa del vehicle o des d'<b>📋 Historial</b>.</p>
    <p>Indica vehicle, data, quilometratge, treball realitzat, cost, taller i observacions.</p>
    <p>Si el quilometratge introduït és superior al que tenia el vehicle, l'app actualitza automàticament el quilometratge del vehicle.</p>
  </div>

  <div class="card"><h3>8. 📋 Historial</h3>
    <p>Mostra els manteniments registrats de més recent a més antic.</p>
    <p>Cada registre indica vehicle, data, quilometratge, treball, taller, cost i observacions.</p>
    <p>A la part superior veus el <b>cost total registrat</b>.</p>
  </div>

  <div class="card"><h3>9. 🗓️ Calendari</h3>
    <p>Mostra el <b>mes actual</b> en format calendari.</p>
    <p>Els dies poden mostrar ITV, assegurança i revisió programades.</p>
    <p>A sota hi ha una llista de les properes dates, incloses les que han vençut recentment, per facilitar el seguiment.</p>
  </div>

  <div class="card"><h3>10. 📘 Manuals</h3>
    <p>Per cada vehicle pots obrir la <b>font oficial</b> del fabricant quan està disponible i fer una <b>cerca específica del manual</b>.</p>
    <p>Per als vehicles que tenen documents guardats, pots obrir el manual d'ús o el document de manteniment directament.</p>
    <p>Els documents són enllaços a fonts externes; l'app no afirma que un document sigui oficial si no està identificat com a tal.</p>
  </div>

  <div class="card"><h3>11. 📱 Instal·lar com una app</h3>
    <p>En navegadors compatibles, quan el navegador considera que la PWA es pot instal·lar, apareix el botó <b>Instal·lar</b> a la capçalera.</p>
    <p>En Android compatible, la instal·lació pot crear una icona a la pantalla d'inici i obrir l'app com una aplicació independent.</p>
    <p>Si el botó no apareix, es pot fer servir l'opció d'instal·lar/afegir a pantalla d'inici del navegador.</p>
  </div>

  <div class="card"><h3>12. 💾 On es guarden les dades</h3>
    <p>Les dades de vehicles, manteniments i documents es guarden <b>localment al navegador/dispositiu</b>. No hi ha un compte al núvol ni sincronització entre mòbils.</p>
    <p>Per això, si instal·les o obres l'app en un altre dispositiu, començaràs amb el seu propi espai de dades.</p>
    <p>La fotografia també es redueix abans de guardar-la per minimitzar problemes de quota d'emmagatzematge.</p>
  </div>

  <div class="card"><h3>13. ✅ Resum ràpid</h3>
    <ol><li>Afegeix el vehicle.</li><li>Posa les dades i la foto de la galeria.</li><li>Guarda'l.</li><li>Consulta el panell.</li><li>Mira <b>Què toca</b> per als venciments.</li><li>Registra cada manteniment.</li><li>Consulta l'historial.</li><li>Fes servir el calendari.</li><li>Obre manuals i fonts quan necessitis informació tècnica.</li></ol>
  </div>`;
  tabs.parentNode.insertBefore(sec, document.getElementById('vehicles'));

  // Navegació de pestanyes: també cobreix la pestanya afegida dinàmicament.
  tabs.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    const target=document.getElementById(b.dataset.tab);
    if(target) target.classList.add('active');
    if(typeof renderAll==='function') renderAll();
  });
  tabs.style.display='flex';
  tabs.style.overflowX='auto';
  tabs.style.gridTemplateColumns='none';
  tabs.style.scrollbarWidth='thin';
  tabs.querySelectorAll('button').forEach(b=>{b.style.flex='0 0 auto';b.style.minWidth='112px'});
}
setTimeout(ready,700);
})();
