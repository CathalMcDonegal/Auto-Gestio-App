// Auto Gestió · parc motor i manteniment guiat per font oficial.
// Important: els intervals exactes depenen de model, motor, any i ús. No els inventem.
(function(){
  'use strict';
  const T=[
    {type:'Moto',brand:'Husqvarna',model:'Norden 901',note:'Cal any/model exacte per aplicar el calendari correcte.',source:'https://www.husqvarna-motorcycles.com/es-es/service/husqvarna-motorcycles-app/street.html'},
    {type:'Cotxe',brand:'Jeep',model:'Compass',year:2017,note:'Manual oficial 2017. El pla exacte depèn de motor/mercat.',source:'https://vehicleinfo.mopar.com/assets/publications/en-us/Jeep/2017/Compass/2141.pdf'},
    {type:'Cotxe',brand:'Suzuki',model:'SJ Samurai',note:'Model clàssic: cal identificar any i motor.',source:'https://auto.suzuki.es/posventa/'},
    {type:'Moto',brand:'Honda',model:'CBR 600',note:'Hi ha diverses CBR 600 (F, F4i, RR...). Cal versió i any.',source:'https://www.honda.es/motorcycles/owners/owners-manual.html'},
    {type:'Cotxe',brand:'Skoda',model:'Kamiq',note:'Škoda ofereix plans i intervals que poden variar segons motor/equipament; el vehicle pot determinar el servei.',source:'https://www.skoda.es/servicios-posventa/plan-mantenimiento'},
    {type:'Cotxe',brand:'Skoda',model:'Kodiaq',note:'Škoda ofereix intervals ampliats fins a 45.000 km o 3 anys en determinades configuracions; el vehicle pot determinar el servei.',source:'https://www.skoda.es/servicios-posventa/plan-mantenimiento'}
  ];
  window.AUTO_GESTIO_FLEET_TEMPLATES=T;
  function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
  function match(v,t){return norm(v.brand)===norm(t.brand)&&norm(v.model)===norm(t.model)&&(t.year==null||Number(v.year)===Number(t.year));}
  function openSource(url){if(url)window.open(url,'_blank','noopener');}
  function fleetGuide(v){
    const n=norm(v.brand)+'|'+norm(v.model);
    if(n==='jeep|compass'&&Number(v.year)===2017)return {title:'Jeep Compass 2017',text:'Manual oficial 2017. El manual indica el manteniment programat i que l’oli/filtre s’ha de fer segons l’indicador; no superar 16.000 km, 12 mesos o 350 h, el que arribi abans. Confirma motor.',url:'https://vehicleinfo.mopar.com/assets/publications/en-us/Jeep/2017/Compass/2141.pdf'};
    if(n==='skoda|kamiq')return {title:'Škoda Kamiq',text:'Pla oficial Škoda. En determinades configuracions hi ha intervals ampliats i el vehicle calcula l’avís segons ús. No fixem una data artificial si no tenim el pla del motor.',url:'https://www.skoda.es/servicios-posventa/plan-mantenimiento'};
    if(n==='skoda|kodiaq')return {title:'Škoda Kodiaq',text:'Pla oficial Škoda. En determinades configuracions els intervals poden arribar fins a 45.000 km o 3 anys; el vehicle determina l’avís segons ús.',url:'https://www.skoda.es/servicios-posventa/plan-mantenimiento'};
    if(n==='husqvarna|norden 901')return {title:'Husqvarna Norden 901',text:'Cal any/model exacte abans d’aplicar un interval. Obrim la font oficial per consultar el calendari corresponent.',url:'https://www.husqvarna-motorcycles.com/es-es/service/husqvarna-motorcycles-app/street.html'};
    if(n==='honda|cbr 600')return {title:'Honda CBR 600',text:'Cal identificar versió i any (F, F4i, RR, etc.) abans d’aplicar el programa de manteniment.',url:'https://www.honda.es/motorcycles/owners/owners-manual.html'};
    if(n==='suzuki|sj samurai')return {title:'Suzuki SJ Samurai',text:'Cal any i motor per identificar el manual correcte. No s’aplica un interval genèric a un model clàssic.',url:'https://auto.suzuki.es/posventa/'};
    return null;
  }
  function parseDate(s){return s?new Date(s+'T12:00:00'):null;}
  function addMonths(d,m){const x=new Date(d);x.setMonth(x.getMonth()+m);return x.toISOString().slice(0,10);}
  function daysTo(d){if(!d)return null;return Math.ceil((parseDate(d)-new Date())/86400000);}
  function historyFor(v,i){return Array.isArray(window.__AUTO_GESTIO_HISTORY)?window.__AUTO_GESTIO_HISTORY.filter(h=>Number(h.vehicleIndex)===i):[];}
  function intelligence(v,i){
    const g=fleetGuide(v);if(!g)return null;
    const hs=historyFor(v,i).slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
    const last=hs[0];
    const result={guide:g,items:[],last:last||null};
    if(norm(v.brand)==='jeep'&&norm(v.model)==='compass'&&Number(v.year)===2017){
      const oil=hs.find(h=>/(oli|aceite|oil).*(filtr|filter)|^(oli|aceite|oil)/i.test(String(h.work||'')));
      if(oil&&oil.date){
        const nextDate=addMonths(parseDate(oil.date),12);const nextKm=Number(oil.km||0)+16000;
        result.items.push({label:'Oli + filtre',date:nextDate,km:nextKm,days:daysTo(nextDate),note:'Límit de manual: 16.000 km o 12 mesos; confirmar motor.'});
      }else result.items.push({label:'Oli + filtre',note:'Registra l’últim canvi per poder calcular el proper avís. El manual 2017 fixa un màxim de 16.000 km/12 mesos/350 h.'});
    }
    if((norm(v.brand)==='skoda')&&(norm(v.model)==='kamiq'||norm(v.model)==='kodiaq')){
      result.items.push({label:'Pla de manteniment Škoda',note:'Consulta l’avís del vehicle/MyŠkoda i el pla específic de motor. L’app no substitueix el càlcul del vehicle.'});
      if(v.year){const age=new Date().getFullYear()-Number(v.year);if(age>=2)result.items.push({label:'Revisió per antiguitat',note:'El vehicle ja supera 2 anys; comprova el servei que indica el vehicle. Les pàgines Škoda mostren plans orientatius per edat/km.'});}
    }
    if(norm(v.brand)==='honda'&&norm(v.model)==='cbr 600'&&!v.engine)result.items.push({label:'Identificar versió',note:'Completa versió/motor i any abans d’aplicar el manteniment.'});
    if(norm(v.brand)==='husqvarna'&&norm(v.model)==='norden 901'&&!v.year)result.items.push({label:'Identificar any',note:'Completa l’any de la Norden 901 per seleccionar el calendari correcte.'});
    return result;
  }
  function templateCard(){
    if(document.getElementById('fleetPanel'))return;
    const el=document.createElement('section');el.className='card';el.id='fleetPanel';
    el.innerHTML='<div class="hero"><div><h2>🚗 El meu parc motor</h2><div class="muted">6 vehicles preparats per gestionar. Els intervals exactes només s’apliquen quan estan confirmats.</div></div><button id="loadFleet">＋ Carregar parc</button></div><div id="fleetList" class="grid" style="margin-top:10px"></div>';
    const list=el.querySelector('#fleetList');T.forEach((t,i)=>{const b=document.createElement('button');b.className='secondary';b.dataset.fleet=i;b.textContent=(t.type==='Moto'?'🏍️ ':'🚙 ')+t.brand+' '+t.model+(t.year?' '+t.year:'');list.appendChild(b)});
    document.querySelector('main')?.insertBefore(el,document.querySelector('.tabs'));
    el.addEventListener('click',e=>{const b=e.target.closest('[data-fleet]');if(b){openSource(T[Number(b.dataset.fleet)].source);return}if(e.target.closest('#loadFleet'))loadFleet()});
  }
  function loadFleet(){
    if(!Array.isArray(window.AUTO_GESTIO_FLEET_TEMPLATES)||typeof vehicles==='undefined')return;
    let added=0;T.forEach(t=>{if(!vehicles.some(v=>match(v,t))){vehicles.push({type:t.type,brand:t.brand,model:t.model,engine:'',year:t.year||'',plate:'',vin:'',km:0,eco:'',photo:'',itv:'',insurance:'',insuranceFrequency:'annual',serviceKm:'',serviceDate:'',observations:''});added++}});
    if(typeof save==='function')save();if(typeof renderAll==='function')renderAll();alert(added?'S’han afegit '+added+' vehicles del teu parc. Completa ara motor/versió, any, matrícula i km.':'El teu parc ja estava carregat.');
  }
  function enhanceTasks(){
    if(typeof renderTasks!=='function'||window.__fleetTasksEnhanced)return;window.__fleetTasksEnhanced=true;
    const original=renderTasks;
    window.renderTasks=function(){
      original();
      if(!Array.isArray(vehicles))return;
      window.__AUTO_GESTIO_HISTORY=typeof history!=='undefined'?history:[];
      const root=document.getElementById('tasks');if(!root)return;
      vehicles.forEach((v,i)=>{const info=intelligence(v,i);if(!info)return;const cards=root.querySelectorAll('.card');let card=null;for(const c of cards){const h=c.querySelector('h3');if(h&&h.textContent===String(v.brand)+' '+String(v.model)+(v.plate?' · '+String(v.plate):'')){card=c;break}}if(!card)return;
        const box=document.createElement('div');box.className='obs';let html='<b>🧠 Manteniment intel·ligent</b>';
        info.items.forEach(x=>{html+='<div class="status"><span>🔧 '+x.label+'</span><b>'+(x.date?fmt(x.date)+' · '+(x.days<0?'<span class="bad">Vençut</span>':x.days<=30?'<span class="warn">'+x.days+' dies</span>':'<span class="ok">'+x.days+' dies</span>'):'')+(x.km?' · '+Number(x.km).toLocaleString('ca-ES')+' km':'')+'</b></div><div class="small muted">'+escSafe(x.note||'')+'</div>'});
        html+='<div class="actions"><button class="secondary" data-fleet-source="'+i+'">📘 Font oficial</button></div>';box.innerHTML=html;card.appendChild(box);
      });
      root.querySelectorAll('[data-fleet-source]').forEach(b=>b.onclick=()=>{const g=fleetGuide(vehicles[Number(b.dataset.fleetSource)]);if(g)openSource(g.url)});
    };
  }
  function escSafe(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function fmt(d){return d?new Date(d+'T12:00:00').toLocaleDateString('ca-ES'):'—'}
  function start(){templateCard();enhanceTasks();if(typeof renderAll==='function')renderAll()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,0));else setTimeout(start,0);
})();
