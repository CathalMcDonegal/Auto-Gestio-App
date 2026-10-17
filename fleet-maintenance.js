// Auto Gestió · parc real + manuals + planificador de manteniment.
(function(){
  'use strict';
  const T=[
    {type:'Moto',brand:'Husqvarna',model:'Norden 901',note:'Calendari basat en el manual de servei de la Norden 901 (2022-2024): 1.000 km inicials, després 15.000 km/12 mesos; treballs majors a 30.000 km i líquid refrigerant a 48 mesos.',source:'https://www.husqvarna-motorcycles.com/es-es/service/husqvarna-motorcycles-app/street.html',docs:[
      {title:'Manual del vehicle · Norden 901 (PDF)',url:'https://www.manualpdf.es/husqvarna/norden-901-2024/manual',kind:"Manual d'ús"},
      {title:'Pla de manteniment · Norden 901',url:'https://moto.care/es/maintenance/husqvarna/norden-901/2022',kind:'Manteniment'}
    ]},
    {type:'Cotxe',brand:'Jeep',model:'Compass',year:2017,engineDefault:'Limited · 2.0 MultiJet II · 4x4 · automàtic 9 velocitats',note:'Configurat per al Compass Limited 2.0 MultiJet II 4x4 automàtic de 9 velocitats. El pla europeu del 2.0 Diesel marca revisions cada 20.000 km o 12 mesos, i l’avís de degradació de l’oli pot avançar el servei.',source:'https://www.jeep.es/mopar/asistencia-al-cliente-jeep',docs:[
      {title:'Manual del vehicle · Jeep Compass 2017 (PDF)',url:'https://carmanuals2.com/d/105682/jeep-compass-2017-manual-del-propietario',kind:"Manual d'ús"},
      {title:'Manual / pla de manteniment · Compass 2.0 Diesel',url:'https://pt.scribd.com/document/499464844/Jeep-Compass-Compass-MANUAL-DO-PROPRIETARIO',kind:'Manteniment'}
    ]}
  ];
  window.AUTO_GESTIO_FLEET_TEMPLATES=T;
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const match=(v,t)=>norm(v.brand)===norm(t.brand)&&norm(v.model)===norm(t.model)&&(t.year==null||Number(v.year)===Number(t.year));
  const openSource=url=>{if(url)window.open(url,'_blank','noopener');};
  const escSafe=v=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function migrateFleet(){
    try{
      const arr=JSON.parse(localStorage.getItem('autoGestioVehicles')||'[]');if(!Array.isArray(arr))return false;
      const testModels=[['suzuki','sj samurai'],['honda','cbr 600'],['skoda','kamiq'],['skoda','kodiaq']];
      const filtered=arr.filter(v=>!testModels.some(x=>norm(v.brand)===x[0]&&norm(v.model)===x[1]));
      let changed=filtered.length!==arr.length;
      const jeep=filtered.find(v=>norm(v.brand)==='jeep'&&norm(v.model)==='compass'&&Number(v.year)===2017);
      if(jeep&&!String(jeep.engine||'').trim()){jeep.engine=T[1].engineDefault;changed=true;}
      if(changed)localStorage.setItem('autoGestioVehicles',JSON.stringify(filtered));return changed;
    }catch(e){return false;}
  }

  function ensureDocs(){
    try{
      const vehicles=JSON.parse(localStorage.getItem('autoGestioVehicles')||'[]');if(!Array.isArray(vehicles))return false;const docs=[];
      T.forEach(t=>{const vi=vehicles.findIndex(v=>match(v,t));if(vi<0)return;t.docs.forEach(d=>docs.push({vehicleIndex:vi,vehicle:t.brand+' '+t.model,title:d.title,url:d.url,kind:d.kind,source:'Auto Gestió'}));});
      let old=[];try{old=JSON.parse(localStorage.getItem('autoGestioDocuments')||'[]')}catch(e){}
      const fresh=JSON.stringify(docs);if(JSON.stringify(old)!==fresh){localStorage.setItem('autoGestioDocuments',fresh);return true}return false;
    }catch(e){return false;}
  }

  function nextMultiple(km,step,first){km=Math.max(0,Number(km)||0);if(km<first)return first;return Math.ceil((km+1)/step)*step;}

  function planFor(v){
    const km=Number(v.km)||0,n=norm(v.brand)+'|'+norm(v.model);
    if(n==='jeep|compass'&&Number(v.year)===2017){
      const next=nextMultiple(km,20000,20000),extra=[];
      const items=['Canvi d’oli del motor i filtre d’oli','Substitució del filtre de combustible','Substitució de l’element del filtre d’aire del motor','Comprovació de nivells de tots els fluids','Comprovació de pastilles de fre davanteres i posteriors','Comprovació de tubs d’escapament, alimentació de combustible i frens','Comprovació de maneguets, juntes, pneumàtics, desgast i pressions','Comprovació del fre d’estacionament elèctric','Comprovació de l’estat de les escombretes i eixugaparabrises','Comprovació d’elements elèctrics, il·luminació i indicadors','Comprovació del filtre antipol·len de l’aire condicionat'];
      if(next%60000===0)extra.push('Substitució del líquid de frens (60.000 km / 2 anys)','Substitució de les corretges dels òrgans auxiliars (60.000 km / 3 anys)');
      if(next%120000===0)extra.push('Substitució de la corretja dentada de distribució (120.000 km / 3 anys, segons pla)','Substitució del líquid de frens','Substitució de les corretges dels òrgans auxiliars');
      if(next%240000===0)extra.push('Substitució del líquid refrigerant (240.000 km / 10 anys)');
      return {nextKm:next,remaining:next-km,interval:'20.000 km o 12 mesos',items:items.concat(extra),note:'El sistema de degradació de l’oli pot demanar el servei abans. Si el quadre dona avís d’oli/revisió, preval l’avís del vehicle. La transmissió automàtica figura al pla com For Life.'};
    }
    if(n==='husqvarna|norden 901'){
      const next=nextMultiple(km,15000,1000),at30=next%30000===0;
      const items=['Canvi d’oli del motor, filtre d’oli i neteja de les pantalles d’oli','Comprovació de frens, discos, línies i nivells de líquid','Comprovació de cadena, tensió, pinyons i guia','Comprovació d’estat i pressió dels pneumàtics i llantes','Comprovació de forquilla/amortidor, fuites i rodaments','Comprovació elèctrica i diagnosi de memòria d’errors','Comprovació de líquid refrigerant, ventilador i mànegues','Greixatge dels elements mòbils i comprovació de cargols de seguretat','Comprovació/ajust de la indicació de servei i prova final'];
      if(at30)items.push('Canvi del filtre d’aire i neteja de la caixa de filtre','Comprovació de joc de vàlvules','Canvi de bugies','Comprovació de rodaments de roda i direcció','Neteja dels guardapols de la forquilla');
      return {nextKm:next,remaining:next-km,interval:'15.000 km o 12 mesos',items,note:'El manual també fixa treballs específics cada 24 mesos i canvi de refrigerant cada 48 mesos. La primera revisió és a 1.000 km.'};
    }
    return null;
  }
  function fleetGuide(v){const n=norm(v.brand)+'|'+norm(v.model);if(n==='jeep|compass'&&Number(v.year)===2017)return {url:'https://www.jeep.es/mopar/asistencia-al-cliente-jeep'};if(n==='husqvarna|norden 901')return {url:'https://moto.care/es/maintenance/husqvarna/norden-901/2022'};return null;}

  function addDocsBox(){
    document.querySelectorAll('[data-fleet-docbox]').forEach(e=>e.remove());let vehicles=[];try{vehicles=JSON.parse(localStorage.getItem('autoGestioVehicles')||'[]')}catch(e){}
    vehicles.forEach(v=>{const t=T.find(x=>match(v,x));if(!t)return;const card=[...document.querySelectorAll('#vehicles .card')].find(c=>{const h=c.querySelector('h3');return h&&norm(h.textContent).includes(norm(v.brand+' '+v.model))});if(!card)return;const box=document.createElement('div');box.className='obs';box.dataset.fleetDocbox='1';box.innerHTML='<b>📚 Manuals guardats</b><div class="actions">'+t.docs.map(d=>'<button class="secondary" data-open-doc="'+escSafe(d.url)+'">'+escSafe(d.kind)+': '+escSafe(d.title)+'</button>').join('')+'</div>';card.appendChild(box);});
    document.querySelectorAll('[data-open-doc]').forEach(b=>b.onclick=()=>openSource(b.dataset.openDoc));
  }

  function enhanceTasks(){
    if(typeof renderTasks!=='function'||window.__fleetTasksEnhanced)return;window.__fleetTasksEnhanced=true;const original=renderTasks;
    window.renderTasks=function(){original();let vehicles=[];try{vehicles=JSON.parse(localStorage.getItem('autoGestioVehicles')||'[]')}catch(e){}const root=document.getElementById('tasks');if(!root)return;
      vehicles.forEach((v,i)=>{const p=planFor(v);if(!p)return;const cards=root.querySelectorAll('.card');let card=null;for(const c of cards){const h=c.querySelector('h3');if(h&&norm(h.textContent).includes(norm(v.brand+' '+v.model))){card=c;break}}if(!card)return;const box=document.createElement('div');box.className='obs';const due=p.remaining<=0?'⚠️ Revisió pendent':p.remaining<=1500?'🟠 Revisió molt propera':'🟢 Pròxima revisió';box.innerHTML='<b>🧠 Pla del manual</b><div class="status"><span>'+due+'</span><b>'+Number(p.nextKm).toLocaleString('ca-ES')+' km</b></div><div class="small muted">Falten '+Number(Math.max(0,p.remaining)).toLocaleString('ca-ES')+' km · '+escSafe(p.interval)+'</div><div class="small muted" style="margin-top:6px">'+escSafe(p.note)+'</div><details style="margin-top:9px"><summary><b>Què toca fer</b></summary><ul style="padding-left:20px;margin-bottom:0">'+p.items.map(x=>'<li>'+escSafe(x)+'</li>').join('')+'</ul></details><div class="actions"><button class="secondary" data-plan-source="'+i+'">📘 Veure font</button></div>';card.appendChild(box);});
      root.querySelectorAll('[data-plan-source]').forEach(b=>b.onclick=()=>{const v=vehicles[Number(b.dataset.planSource)],g=fleetGuide(v);if(g)openSource(g.url)});
    };
  }

  function addManualSearchToForm(){
    const form=document.getElementById('vehicleForm');if(!form||form.dataset.manualSearchAdded)return;form.dataset.manualSearchAdded='1';const actions=form.querySelector('.actions');if(!actions)return;const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent='🔎 Buscar manual i manteniment';b.onclick=()=>{const brand=document.getElementById('brand')?.value.trim(),model=document.getElementById('model')?.value.trim(),engine=document.getElementById('engine')?.value.trim(),year=document.getElementById('year')?.value.trim();if(!brand||!model){alert('Indica marca i model abans de buscar.');return}const q=encodeURIComponent(brand+' '+model+' '+engine+' '+year+' manual PDF mantenimiento programa revisiones oficial');window.open('https://www.google.com/search?q='+q,'_blank','noopener');};actions.insertBefore(b,actions.firstChild);
  }
  function addFleetPanel(){if(document.getElementById('fleetPanel'))return;const el=document.createElement('section');el.className='card';el.id='fleetPanel';el.innerHTML='<div class="hero"><div><h2>🚗 Parc real</h2><div class="muted">Ara mateix gestionem només la Husqvarna Norden 901 i el Jeep Compass. Els altres vehicles de prova s’han eliminat.</div></div></div>';document.querySelector('main')?.insertBefore(el,document.querySelector('.tabs'));}

  function start(){const changed=migrateFleet(),docsChanged=ensureDocs();if(changed||docsChanged){location.reload();return}addFleetPanel();enhanceTasks();if(typeof renderAll==='function')renderAll();setTimeout(()=>{addDocsBox();addManualSearchToForm();},100);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,0));else setTimeout(start,0);
})();
