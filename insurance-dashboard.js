(() => {
  const KEY='autoGestioVehicles';
  const read=()=>JSON.parse(localStorage.getItem(KEY)||'[]');
  const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
  const $=id=>document.getElementById(id);

  function daysFromDate(d){
    if(!d) return null;
    const t=new Date(d+'T12:00:00');
    return Math.ceil((t-new Date())/86400000);
  }

  function annualDays(d){
    if(!d) return null;
    const base=new Date(d+'T12:00:00');
    const now=new Date();
    let next=new Date(now.getFullYear(),base.getMonth(),base.getDate(),12);
    if(next<new Date(now.getFullYear(),now.getMonth(),now.getDate(),12)) next.setFullYear(now.getFullYear()+1);
    return Math.ceil((next-new Date(now.getFullYear(),now.getMonth(),now.getDate(),12))/86400000);
  }

  function dateLabel(d){
    if(!d)return '—';
    return new Date(d+'T12:00:00').toLocaleDateString('ca-ES');
  }

  function insuranceDays(v){
    return v.insuranceFrequency==='monthly' ? annualDays(v.insurance) : daysFromDate(v.insurance);
  }

  function urgency(days){
    if(days===null)return 'none';
    if(days<0)return 'danger';
    if(days<=30)return 'warn';
    return 'ok';
  }

  function item(v,name,days,text){
    if(days===null)return '';
    const cls=urgency(days);
    const label=days<0?'VENÇUT':(days===0?'AVUI':days+' dies');
    return `<div class="agDashItem ${cls}"><div><b>${name}</b><small>${v.brand||''} ${v.model||''} · ${text}</small></div><strong>${label}</strong></div>`;
  }

  function renderDashboard(){
    const host=$('vehicles');
    if(!host)return;
    let box=$('autoDashboard');
    if(!box){
      box=document.createElement('section');
      box.id='autoDashboard';
      host.parentNode.insertBefore(box,host);
    }
    const vs=read();
    let due=0,warn=0,ok=0;
    const items=[];
    vs.forEach(v=>{
      const checks=[
        ['ITV',daysFromDate(v.itv),dateLabel(v.itv)],
        ['Assegurança',insuranceDays(v),v.insuranceFrequency==='monthly'?'pagament mensual · record anual':(v.insurance?'renovació anual':'')],
        ['Revisió',v.serviceKm&&v.km!==undefined?Number(v.km)>=Number(v.serviceKm)?-1:Number(v.serviceKm)-Number(v.km):null,v.serviceKm?Number(v.serviceKm).toLocaleString('ca-ES')+' km':''],
        ['Revisió per data',daysFromDate(v.serviceDate),dateLabel(v.serviceDate)]
      ];
      checks.forEach(c=>{if(c[1]===null)return; if(c[1]<0)due++;else if(c[1]<=30)warn++;else ok++;items.push({v,name:c[0],days:c[1],text:c[2]})});
    });
    items.sort((a,b)=>a.days-b.days);
    box.innerHTML=`<div class="card agDashboard"><h3>📊 Què toca ara</h3><div class="agStats"><div><b class="dangerText">${due}</b><span>Vençut</span></div><div><b class="warn">${warn}</b><span>Pròximament</span></div><div><b class="ok">${ok}</b><span>Al dia</span></div></div>${items.length?'<div class="agDashList">'+items.slice(0,8).map(x=>item(x.v,x.name,x.days,x.text)).join('')+'</div>':'<div class="notice">Encara no hi ha cap data o revisió programada.</div>'}</div>`;
  }

  function addInsuranceField(){
    const insurance=$('insurance');
    if(!insurance || $('insuranceFrequency'))return;
    const wrap=document.createElement('div');
    wrap.innerHTML=`<label>💳 Pagament de l'assegurança</label><select id="insuranceFrequency"><option value="annual">Anual</option><option value="monthly">Mensual</option></select><div class="notice" id="insuranceHint">Si és mensual, Auto Gestió només et recordarà la renovació una vegada l'any, no cada mes.</div>`;
    insurance.parentNode.insertBefore(wrap,insurance.nextSibling);
    const sel=$('insuranceFrequency');
    sel.addEventListener('change',()=>{
      $('insuranceHint').textContent=sel.value==='monthly'?'Assegurança mensual: no rebràs avisos cada mes. Només es controlarà la renovació anual.':'Assegurança anual: controlarem la data de renovació cada any.';
    });
  }

  let editingIndex=null;
  function hookEditing(){
    if(typeof window.editVehicle==='function' && !window.editVehicle.__agWrapped){
      const original=window.editVehicle;
      const wrapped=function(i){
        editingIndex=i;
        const r=original.apply(this,arguments);
        setTimeout(()=>{
          addInsuranceField();
          const vs=read();
          $('insuranceFrequency').value=vs[i]?.insuranceFrequency||'annual';
        },30);
        return r;
      };
      wrapped.__agWrapped=true;
      window.editVehicle=wrapped;
    }
  }

  function hookForm(){
    const form=$('vehicleForm');
    if(!form || form.__agHooked)return;
    form.__agHooked=true;
    form.addEventListener('submit',()=>{
      setTimeout(()=>{
        const vs=read();
        const plate=($('plate')?.value||'').trim().toUpperCase();
        let idx=editingIndex;
        if(idx===null || !vs[idx] || (plate && String(vs[idx].plate||'').toUpperCase()!==plate)){
          idx=vs.length-1;
          if(plate){
            for(let i=vs.length-1;i>=0;i--)if(String(vs[i].plate||'').toUpperCase()===plate){idx=i;break;}
          }
        }
        if(vs[idx]){
          vs[idx].insuranceFrequency=$('insuranceFrequency')?.value||'annual';
          write(vs);
          renderDashboard();
          if(typeof window.render==='function')window.render();
        }
        editingIndex=null;
      },50);
    });
  }

  function hookAdd(){
    const add=$('add');
    if(add && !add.__agHooked){
      add.__agHooked=true;
      add.addEventListener('click',()=>{editingIndex=null;setTimeout(()=>{addInsuranceField();if($('insuranceFrequency'))$('insuranceFrequency').value='annual';},30)});
    }
  }

  function init(){
    addInsuranceField();hookEditing();hookForm();hookAdd();renderDashboard();
    const observer=new MutationObserver(()=>{addInsuranceField();hookEditing();hookForm();hookAdd();});
    observer.observe(document.body,{childList:true,subtree:true});
    setInterval(renderDashboard,60000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
