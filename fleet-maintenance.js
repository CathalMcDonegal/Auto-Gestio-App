// Auto Gestió · parc motor i manteniment guiat per font oficial.
// No converteix informació genèrica en intervals obligatoris: model, motor i any poden canviar el pla.
(function(){
  'use strict';
  const T=[
    {type:'Moto',brand:'Husqvarna',model:'Norden 901',note:'El calendari de manteniment depèn de l’any/model. Husqvarna ofereix manual del propietari i calendari de manteniment a Ride Husqvarna.',source:'https://www.husqvarna-motorcycles.com/es-es/service/husqvarna-motorcycles-app/street.html'},
    {type:'Cotxe',brand:'Jeep',model:'Compass',year:2017,note:'Manual oficial 2017 disponible. El pla exacte depèn de motor/mercat; no s’ha de barrejar amb un Compass d’una altra motorizació.',source:'https://vehicleinfo.mopar.com/assets/publications/en-us/Jeep/2017/Compass/2017-Compass_Next_Gen-OM-2nd_R1.pdf'},
    {type:'Cotxe',brand:'Suzuki',model:'SJ Samurai',note:'Model clàssic: cal identificar any i motor per seleccionar el manual i el pla correcte.',source:'https://auto.suzuki.es/posventa/'},
    {type:'Moto',brand:'Honda',model:'CBR 600',note:'CBR 600 té diverses versions i anys. Cal seleccionar la versió/any per no aplicar un programa incorrecte.',source:'https://motos.honda.es/manuales/'},
    {type:'Cotxe',brand:'Skoda',model:'Kamiq',note:'Škoda disposa de pla oficial i intervals variables segons vehicle; el sistema del vehicle/MyŠkoda pot indicar el proper servei.',source:'https://www.skoda.es/servicios-posventa/plan-mantenimiento'},
    {type:'Cotxe',brand:'Skoda',model:'Kodiaq',note:'Škoda disposa de pla oficial; les operacions depenen de model, motorizació i equipament.',source:'https://www.skoda.es/servicios-posventa/plan-mantenimiento'}
  ];
  window.AUTO_GESTIO_FLEET_TEMPLATES=T;

  function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
  function match(v,t){return norm(v.brand)===norm(t.brand)&&norm(v.model)===norm(t.model)&&(t.year==null||Number(v.year)===Number(t.year));}
  function templateCard(){
    const el=document.createElement('section'); el.className='card';
    el.id='fleetPanel';
    el.innerHTML='<div class="hero"><div><h2>🚗 El meu parc motor</h2><div class="muted">6 vehicles que tenim preparats per gestionar. No afegim intervals que no estiguin confirmats.</div></div><button id="loadFleet">＋ Carregar parc</button></div><div id="fleetList" class="grid" style="margin-top:10px"></div>';
    const list=el.querySelector('#fleetList');
    T.forEach((t,i)=>{const b=document.createElement('button');b.className='secondary';b.dataset.fleet=i;b.textContent=(t.type==='Moto'?'🏍️ ':'🚙 ')+t.brand+' '+t.model+(t.year?' '+t.year:'');list.appendChild(b)});
    document.querySelector('main')?.insertBefore(el,document.querySelector('.tabs'));
    el.addEventListener('click',function(e){
      const b=e.target.closest('[data-fleet]');
      if(b){const t=T[Number(b.dataset.fleet)];window.open(t.source,'_blank','noopener');return;}
      if(e.target.closest('#loadFleet')) loadFleet();
    });
  }
  function loadFleet(){
    if(!Array.isArray(window.AUTO_GESTIO_FLEET_TEMPLATES))return;
    let added=0;
    T.forEach(t=>{
      if(typeof vehicles==='undefined')return;
      if(!vehicles.some(v=>match(v,t))){vehicles.push({type:t.type,brand:t.brand,model:t.model,engine:'',year:t.year||'',plate:'',vin:'',km:0,eco:'',photo:'',itv:'',insurance:'',insuranceFrequency:'annual',serviceKm:'',serviceDate:'',observations:''});added++;}
    });
    if(typeof save==='function')save();
    if(typeof renderAll==='function')renderAll();
    alert(added?'S’han afegit '+added+' vehicles del teu parc. Ara completa motor, any, matrícula i km.':'El teu parc ja estava carregat.');
  }
  function guidance(v){
    const n=norm(v.brand)+'|'+norm(v.model);
    if(n==='jeep|compass'&&Number(v.year)===2017)return {title:'Jeep Compass 2017',text:'Manual oficial 2017. Falta motor per determinar el programa exacte.',url:'https://vehicleinfo.mopar.com/assets/publications/en-us/Jeep/2017/Compass/2017-Compass_Next_Gen-OM-2nd_R1.pdf'};
    if(n==='skoda|kamiq')return {title:'Škoda Kamiq',text:'Pla oficial Škoda. Les operacions i intervals poden variar segons motorizació i equipament.',url:'https://www.skoda.es/servicios-posventa/plan-mantenimiento'};
    if(n==='skoda|kodiaq')return {title:'Škoda Kodiaq',text:'Pla oficial Škoda. Les operacions i intervals poden variar segons motorizació i equipament.',url:'https://www.skoda.es/servicios-posventa/plan-mantenimiento'};
    if(n==='husqvarna|norden 901')return {title:'Husqvarna Norden 901',text:'Calendari de manteniment oficial disponible a Ride Husqvarna; cal any/model exacte.',url:'https://www.husqvarna-motorcycles.com/es-es/service/husqvarna-motorcycles-app/street.html'};
    if(n==='honda|cbr 600')return {title:'Honda CBR 600',text:'Cal versió i any (F, F4i, RR, etc.) per aplicar el programa correcte.',url:'https://motos.honda.es/manuales/'};
    if(n==='suzuki|sj samurai')return {title:'Suzuki SJ Samurai',text:'Cal any i motor per identificar el manual i el programa de manteniment correcte.',url:'https://auto.suzuki.es/posventa/'};
    return null;
  }
  function enhanceTasks(){
    if(typeof renderTasks!=='function'||window.__fleetTasksEnhanced)return;
    window.__fleetTasksEnhanced=true;
    const original=renderTasks;
    window.renderTasks=function(){
      original();
      if(!Array.isArray(vehicles))return;
      const root=document.getElementById('tasks'); if(!root)return;
      vehicles.forEach((v,i)=>{const g=guidance(v);if(!g)return;const cards=root.querySelectorAll('.card');let card=null;for(const c of cards){if(c.querySelector('h3')?.textContent===String(v.brand)+' '+String(v.model)+(v.plate?' · '+v.plate:'')){card=c;break;}}if(!card)return;const box=document.createElement('div');box.className='obs';box.innerHTML='<b>🏭 Pla oficial</b><br><span class="muted">'+g.text+'</span><div class="actions"><button class="secondary" data-guidance="'+i+'">📘 Obrir font oficial</button></div>';card.appendChild(box);});
      root.querySelectorAll('[data-guidance]').forEach(b=>b.onclick=()=>{const g=guidance(vehicles[Number(b.dataset.guidance)]);if(g)window.open(g.url,'_blank','noopener')});
    };
  }
  function start(){
    if(!document.getElementById('fleetPanel'))templateCard();
    enhanceTasks();
    if(typeof renderAll==='function')renderAll();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,0));else setTimeout(start,0);
})();
