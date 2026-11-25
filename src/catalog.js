export const columns=['sku','nombre','precio','stock','stock_minimo'];

export function parseCsv(text){
  text=text.replace(/^\uFEFF/,'');
  const rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(quoted){if(c==='"'&&text[i+1]==='"'){field+='"';i++}else if(c==='"')quoted=false;else field+=c}
    else if(c==='"')quoted=true;
    else if(c===';'||c===','){row.push(field);field=''}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(v=>v.trim()))rows.push(row);row=[];field=''}
    else field+=c;
  }
  if(quoted)throw Error('El CSV tiene comillas sin cerrar.');
  row.push(field);if(row.some(v=>v.trim()))rows.push(row);
  return rows;
}

export async function readCatalog(file){
  const name=file.name.toLowerCase();
  if(name.endsWith('.csv'))return parseCsv(await file.text());
  if(!name.endsWith('.xlsx'))throw Error('Selecciona un archivo .xlsx o .csv.');
  if(!window.ExcelJS)throw Error('No se pudo cargar el lector de Excel.');
  const workbook=new window.ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  const sheet=workbook.worksheets[0];
  if(!sheet)throw Error('El Excel no contiene hojas.');
  const rows=[];
  sheet.eachRow({includeEmpty:false},row=>rows.push(columns.map((_,i)=>{
    const value=row.getCell(i+1).value;
    return value&&typeof value==='object'&&'text'in value?value.text:String(value??'');
  })));
  return rows;
}

export function validateCatalog(rows,products){
  if(!rows.length)throw Error('El archivo está vacío.');
  const header=rows[0].map(v=>String(v).trim().toLowerCase());
  if(columns.some((name,i)=>header[i]!==name))throw Error(`La primera fila debe ser: ${columns.join(', ')}.`);
  const seen=new Set(),items=[],errors=[];
  for(let i=1;i<rows.length;i++){
    const [skuRaw,nameRaw,priceRaw,stockRaw,minRaw]=rows[i];
    if(rows[i].every(v=>!String(v??'').trim()))continue;
    const sku=String(skuRaw??'').trim(),name=String(nameRaw??'').trim();
    const nums=[priceRaw,stockRaw,minRaw].map(v=>Number(String(v??'').trim()));
    if(!sku||sku.length>30||!name||name.length>80||[priceRaw,stockRaw,minRaw].some(v=>String(v??'').trim()==='')||nums.some(n=>!Number.isSafeInteger(n)||n<0)){
      errors.push(`Fila ${i+1}: SKU y nombre obligatorios; precio, stock y mínimo deben ser enteros no negativos.`);continue;
    }
    const key=sku.toLocaleLowerCase('es-CL');
    if(seen.has(key)){errors.push(`Fila ${i+1}: SKU repetido en el archivo (${sku}).`);continue}
    seen.add(key);items.push({sku,name,price:nums[0],stock:nums[1],min:nums[2]});
  }
  if(errors.length)throw Error(errors.slice(0,8).join('\n')+(errors.length>8?`\nY ${errors.length-8} errores más.`:''));
  if(!items.length)throw Error('El archivo no tiene productos.');
  const existing=new Set(products.map(p=>p.sku.toLocaleLowerCase('es-CL')));
  return{items,added:items.filter(p=>!existing.has(p.sku.toLocaleLowerCase('es-CL'))).length,updated:items.filter(p=>existing.has(p.sku.toLocaleLowerCase('es-CL'))).length};
}

export function applyCatalog(products,items){
  const bySku=new Map(products.map(p=>[p.sku.toLocaleLowerCase('es-CL'),p]));
  let nextId=Math.max(0,...products.map(p=>Number(p.id)||0))+1;
  for(const item of items){const current=bySku.get(item.sku.toLocaleLowerCase('es-CL'));if(current)Object.assign(current,item);else products.push({id:nextId++,...item})}
}

export function downloadBlob(blob,name){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}

export async function downloadTemplate(type){
  if(type==='csv'){downloadBlob(new Blob(['\uFEFF'+columns.join(';')+'\r\n'],{type:'text/csv;charset=utf-8'}),'modelo-productos.csv');return}
  if(!window.ExcelJS)throw Error('No se pudo cargar el generador de Excel.');
  const workbook=new window.ExcelJS.Workbook(),sheet=workbook.addWorksheet('Productos');
  sheet.columns=[{header:'sku',key:'sku',width:20},{header:'nombre',key:'nombre',width:38},{header:'precio',key:'precio',width:16},{header:'stock',key:'stock',width:16},{header:'stock_minimo',key:'stock_minimo',width:18}];
  sheet.getRow(1).font={bold:true,color:{argb:'FFFFFFFF'}};
  sheet.getRow(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF294575'}};
  sheet.views=[{state:'frozen',ySplit:1}];
  const info=workbook.addWorksheet('Instrucciones');
  info.addRow(['Completa la hoja Productos sin cambiar los encabezados.']);
  info.addRow(['SKU único identifica el producto; si ya existe, actualiza nombre, precio y existencias.']);
  info.addRow(['Precio, stock y stock_minimo deben ser números enteros no negativos.']);
  info.addRow(['Ejemplo: SKU-001 | Producto de prueba | 2500 | 12 | 4']);
  info.getColumn(1).width=100;
  downloadBlob(new Blob([await workbook.xlsx.writeBuffer()],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),'modelo-productos.xlsx');
}
