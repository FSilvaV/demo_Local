// Edit these public defaults when preparing a fresh copy for a customer.
export const defaultBrand={
  name:'AppNova',
  subtitle:'Locales · demo',
  customer:'',
  color:'azul',
  logo:''
};

// Curated pairs keep button text readable across all available themes.
export const themes={
  azul:{label:'Azul',accent:'#4169e1',accentDark:'#3155af',sidebar:'#101e37',sidebarActive:'#294575'},
  verde:{label:'Verde',accent:'#176b54',accentDark:'#10523f',sidebar:'#10332b',sidebarActive:'#1e5a48'},
  morado:{label:'Morado',accent:'#6946b5',accentDark:'#523694',sidebar:'#281d40',sidebarActive:'#4a3473'},
  terracota:{label:'Terracota',accent:'#a34530',accentDark:'#823522',sidebar:'#39211e',sidebarActive:'#714034'}
};

export function normalizeBrand(value){
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Configuración de marca inválida.');
  const name=String(value.name??'').trim();
  const subtitle=String(value.subtitle??'').trim();
  const customer=String(value.customer??'').trim();
  const color=String(value.color??'azul');
  const logo=String(value.logo??'');
  if(!name||name.length>50||subtitle.length>80||customer.length>80)throw Error('Revisa las longitudes del nombre y los textos.');
  if(!Object.hasOwn(themes,color))throw Error('El color seleccionado no está disponible.');
  if(logo&&!/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(logo))throw Error('El logo debe ser PNG, JPEG o WebP.');
  if(logo.length>700000)throw Error('El logo supera el tamaño permitido.');
  return{name,subtitle,customer,color,logo};
}

export function parseBrandFile(text){
  let data;try{data=JSON.parse(text)}catch{throw Error('El archivo JSON no es válido.')}
  if(data?.type!=='appnova-brand'||data?.version!==1)throw Error('El archivo no es un perfil de marca AppNova compatible.');
  return normalizeBrand(data.brand);
}

export function exportBrand(brand){
  const data={type:'appnova-brand',version:1,brand:normalizeBrand(brand)};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download='appnova-marca.json';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
