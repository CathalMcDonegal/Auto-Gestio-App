// Auto Gestió · petites correccions funcionals de la interfície
(function(){
'use strict';
function apply(){
  if(typeof renderDocs!=='function') return;
  const original=renderDocs;
  if(window.__autoGestioDocsFixed) return;
  window.__autoGestioDocsFixed=true;
  window.renderDocs=function(){
    original();
    // Els documents creats pel gestor de flota tenen "title"; els antics poden tenir "name".
    document.querySelectorAll('#docs [data-docdel]').forEach(btn=>{
      const row=btn.closest('.status');
      if(!row) return;
      const link=row.querySelector('a');
      if(link && (!link.textContent.trim() || link.textContent.trim()==='undefined')){
        const idx=Number(btn.dataset.docdel);
        let list=[]; try{list=JSON.parse(localStorage.getItem('autoGestioDocuments')||'[]')}catch(e){}
        const d=list[idx];
        if(d) link.textContent=d.title||d.name||'Document';
      }
    });
  };
}
setTimeout(apply,900);
})();
