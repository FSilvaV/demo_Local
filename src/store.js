export const modules={dashboard:'Dashboard',inventory:'Inventario',sales:'Ventas',cash:'Caja',prices:'Precios',reports:'Informes de ventas',settings:'Configuración'};
const key='appnova-locales-demo-v1';
const sampleProducts=[
{ id:1,name:"Café americano",sku:"CAF-001",stock:18,min:8,price:2200 },
{ id:2,name:"Sándwich italiano",sku:"SAN-002",stock:5,min:7,price:5900 },
{ id:3,name:"Jugo natural",sku:"JUG-003",stock:0,min:5,price:3200 },
{ id:4,name:"Brownie",sku:"POS-004",stock:12,min:4,price:2800 },
{ id:5,name:"Café latte",sku:"CAF-005",stock:22,min:8,price:2900 },
{ id:6,name:"Capuchino",sku:"CAF-006",stock:14,min:6,price:3100 },
{ id:7,name:"Té chai",sku:"BEB-007",stock:9,min:5,price:2700 },
{ id:8,name:"Chocolate caliente",sku:"BEB-008",stock:4,min:6,price:3300 },
{ id:9,name:"Agua mineral",sku:"BEB-009",stock:30,min:10,price:1600 },
{ id:10,name:"Bebida lata",sku:"BEB-010",stock:25,min:10,price:1900 },
{ id:11,name:"Limonada",sku:"BEB-011",stock:7,min:6,price:3000 },
{ id:12,name:"Sándwich de pollo",sku:"SAN-012",stock:11,min:5,price:6200 },
{ id:13,name:"Sándwich vegetariano",sku:"SAN-013",stock:6,min:5,price:5600 },
{ id:14,name:"Empanada de pino",sku:"SAL-014",stock:15,min:6,price:2800 },
{ id:15,name:"Empanada de queso",sku:"SAL-015",stock:3,min:6,price:2600 },
{ id:16,name:"Ensalada mixta",sku:"SAL-016",stock:8,min:4,price:4900 },
{ id:17,name:"Papas fritas",sku:"SAL-017",stock:10,min:5,price:3500 },
{ id:18,name:"Galleta de avena",sku:"POS-018",stock:20,min:8,price:1800 },
{ id:19,name:"Muffin de arándanos",sku:"POS-019",stock:0,min:4,price:2500 },
{ id:20,name:"Cheesecake",sku:"POS-020",stock:5,min:5,price:3900 }
];
const seed={products:sampleProducts,sales:[{id:101,date:'2026-11-25T10:40:00',productId:1,quantity:2,total:4400,method:'Tarjeta'},{id:102,date:'2026-11-25T11:20:00',productId:2,quantity:1,total:5900,method:'Efectivo'}],cash:{open:true,opening:50000,movements:[]},subscription:{expires:'2026-12-01'},visibility:{owner:['dashboard','inventory','sales','cash','prices','reports'],seller:['dashboard','inventory','sales','cash','prices']},api:{provider:'',baseUrl:'',status:'Pendiente de configurar'}};
// Add new demo products to previously saved browsers without replacing edited items.
export function load(){try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&Array.isArray(saved.products)&&Array.isArray(saved.sales)){const existing=new Set(saved.products.map(p=>p.sku));for(const item of sampleProducts)if(!existing.has(item.sku))saved.products.push(structuredClone(item));save(saved);return saved}return structuredClone(seed)}catch{return structuredClone(seed)}}
export function save(state){localStorage.setItem(key,JSON.stringify(state))}
export function reset(){localStorage.removeItem(key);return structuredClone(seed)}

