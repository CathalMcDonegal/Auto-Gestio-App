// Auto Gestió · fotos de galeria i compressió per evitar errors d'emmagatzematge.
(function(){
'use strict';
const VKEY='autoGestioVehicles';
function compressImage(file,maxDim=1400,targetBytes=650000){
 return new Promise((resolve,reject)=>{
  const url=URL.createObjectURL(file),img=new Image();
  img.onload=()=>{
   URL.revokeObjectURL(url);
   let w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
   const scale=Math.min(1,maxDim/Math.max(w,h));w=Math.max(1,Math.round(w*scale));h=Math.max(1,Math.round(h*scale));
   const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.drawImage(img,0,0,w,h);
   let q=.82;
   const make=()=>c.toBlob(blob=>{
    if(!blob){reject(new Error('No s’ha pogut comprimir la imatge.'));return;}
    if(blob.size<=targetBytes||q<=.48){resolve(blob);return}
    q-=.07;make();
   },'image/jpeg',q);
   make();
  };
  img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('No s’ha pogut llegir la imatge.'));};
  img.src=url;
 });
}
function forceGallery(){
 const input=document.getElementById('photo');if(!input)return false;
 input.removeAttribute('capture');input.setAttribute('accept','image/*');
 const label=[...document.querySelectorAll('#vehicleForm label')].find(l=>l.textContent.includes('Fotografia')||l.textContent.includes('Galeria'));
 if(label)label.textContent='🖼️ Foto del vehicle (Galeria)';
 if(input.dataset.photoCompression==='1')return true;
 const original=input.onchange;
 if(typeof original!=='function')return false;
 input.dataset.photoCompression='1';
 input.onchange=async function(e){
  const file=input.files&&input.files[0];if(!file){return original.call(input,e);}
  try{
   const blob=await compressImage(file);
   const name=(file.name||'vehicle').replace(/\.[^.]+$/,'')+'.jpg';
   const compressed=new File([blob],name,{type:'image/jpeg',lastModified:Date.now()});
   const dt=new DataTransfer();dt.items.add(compressed);input.files=dt.files;
   original.call(input,{target:input,currentTarget:input});
  }catch(err){
   alert('No s’ha pogut preparar la fotografia. Prova amb una altra imatge.');
  }
 };
 return true;
}
function start(){forceGallery();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,250));else setTimeout(start,250);
})();
