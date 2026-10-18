// Fonts oficials de manteniment per Auto Gestió.
// No inventem intervals: cada marca pot variar segons model, motor, any i ús.
window.AUTO_GESTIO_MAINTENANCE_SOURCES={
 Toyota:{label:'Toyota España',url:'https://www.toyota.es/service-and-accessories/service-and-maintenance/revisiones-toyota'},
 Ford:{label:'Ford España',url:'https://www.ford.es/soporte/comprobacion-intervalos-mantenimiento'},
 Volkswagen:{label:'Volkswagen España',url:'https://www.volkswagen.es/es/clientes/mantenimiento-reparaciones/revisiones-itv.html'},
 SEAT:{label:'SEAT España',url:'https://www.seat.es/posventa/mantenimiento'},
 Skoda:{label:'Škoda España',url:'https://www.skoda.es/servicios-posventa/plan-mantenimiento'},
 BMW:{label:'BMW España',url:'https://www.bmw.es/es/topics/owners/service-and-maintenance.html'},
 Mercedes:{label:'Mercedes-Benz España',url:'https://www.mercedes-benz.es/passengercars/services.html'},
 Nissan:{label:'Nissan España',url:'https://www.nissan.es/servicios/servicio-oficial.html'},
 Hyundai:{label:'Hyundai España',url:'https://www.hyundai.com/es/es/servicios/mantenimiento.html'},
 Kia:{label:'Kia España',url:'https://www.kia.com/es/servicios/servicio-y-mantenimiento/'},
 Audi:{label:'Audi España',url:'https://www.audi.es/es/servicios-posventa/'},
 Renault:{label:'Renault España',url:'https://www.renault.es/mantenimiento.html'},
 Peugeot:{label:'Peugeot España',url:'https://www.peugeot.es/mantenimiento.html'},
 Citroen:{label:'Citroën España',url:'https://www.citroen.es/mantenimiento.html'},
 Opel:{label:'Opel España',url:'https://www.opel.es/servicios/mantenimiento.html'},
 Honda:{label:'Honda España',url:'https://motos.honda.es/manuales/'},
 Husqvarna:{label:'Husqvarna Motorcycles España',url:'https://www.husqvarna-motorcycles.com/es-es/service/husqvarna-motorcycles-app/street.html'},
 Yamaha:{label:'Yamaha Motor España',url:'https://www.yamaha-motor.eu/es/es/service-support/'},
 Suzuki:{label:'Suzuki España',url:'https://auto.suzuki.es/posventa/'},
 Kawasaki:{label:'Kawasaki España',url:'https://www.kawasaki.es/es/service'},
 Mazda:{label:'Mazda España',url:'https://www.mazda.es/servicio/'},
 Volvo:{label:'Volvo Cars España',url:'https://www.volvocars.com/es/l/servicio-y-mantenimiento/'},
 Dacia:{label:'Dacia España',url:'https://www.dacia.es/mantenimiento.html'},
 Jeep:{label:'Jeep España / Mopar',url:'https://es.jeep.com/services.html'}
};
// Càrrega posterior per no tocar la base estable de l'app.
(function(){
  const s=document.createElement('script');
  s.src='fleet-maintenance.js?v=20261018';
  s.defer=true;
  document.head.appendChild(s);
  const p=document.createElement('script');
  p.src='photo-storage.js?v=20261018';
  p.defer=true;
  document.head.appendChild(p);
  const m=document.createElement('script');
  m.src='app-manual.js?v=20261018';
  m.defer=true;
  document.head.appendChild(m);
})();
