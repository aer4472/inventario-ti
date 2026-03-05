import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, Edit2, Trash2, X, Monitor, Tablet, Wifi, Package,
  Printer, Check, Database, Shield, Building2, MapPin, Layers,
  Users, Eye, EyeOff, Copy, KeyRound, BarChart3, Lock, Unlock,
  AlertTriangle, BookOpen, Server, ArrowLeftRight, Clock,
  CheckCircle2, RotateCcw, Tag, Download, Upload, HardDrive,
  TrendingUp, Activity, Zap, PieChart as PieIcon,
  UserCog, LogOut, UserCheck, Eye as EyeIcon, EyeOff as EyeOffIcon
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, AreaChart, Area
} from "recharts";

const C={bg:"#070b14",card:"#0d1424",card2:"#111c2e",border:"#172033",borderHover:"#1e2d45",accent:"#2563eb",accentGlow:"rgba(37,99,235,0.12)",text:"#dde6f5",muted:"#4d6080",dim:"#1e2d45",success:"#10b981",danger:"#ef4444",warning:"#f59e0b",purple:"#8b5cf6",teal:"#14b8a6",orange:"#f97316",mono:"'IBM Plex Mono','Cascadia Code',monospace",sans:"'Inter','Segoe UI',system-ui,sans-serif"};

const CATEGORIAS=["Computadores","Tablets","Access Points","Itens Avulsos"];
const CAT_COLOR={"Computadores":C.accent,"Tablets":C.purple,"Access Points":C.success,"Itens Avulsos":C.warning};

const KEYS={auth:"inv_auth",computers:"inv_computers",tablets:"inv_tablets",aps:"inv_aps",misc:"inv_misc",vlans:"inv_vlans",setores:"inv_setores",blocos:"inv_blocos",locais:"inv_locais",tiposMaq:"inv_tiposmaq",colaboradores:"inv_colaboradores",senhas:"inv_senhas",emprestimos:"inv_emprestimos"};
const load=async(k,fb)=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):fb;}catch{return fb;}};
const save=async(k,d)=>{try{await window.storage.set(k,JSON.stringify(d));}catch{}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2);
const fmt=v=>(v===null||v===undefined||v==="")?"\u2014":String(v);
const boolFmt=v=>(v===true||v==="true"||v==="Sim")?"Sim":"Não";
const ob=s=>btoa(unescape(encodeURIComponent(s)));
const dob=s=>{try{return decodeURIComponent(escape(atob(s)));}catch{return s;}};
const today=()=>new Date().toISOString().slice(0,10);
const loanStatus=e=>{if(e.devolvido)return{label:"Devolvido",color:C.success};const late=e.dataPrevista&&today()>e.dataPrevista;return late?{label:"Atrasado",color:C.danger}:{label:"Em Aberto",color:C.warning};};

const SS=[{id:uid(),nome:"Tecnologia da Informação",sigla:"TI",descricao:""},{id:uid(),nome:"Recursos Humanos",sigla:"RH",descricao:""},{id:uid(),nome:"Financeiro",sigla:"FIN",descricao:""}];
const SB=[{id:uid(),nome:"Bloco A",descricao:"Administrativo"},{id:uid(),nome:"Bloco B",descricao:"Ambulatório"}];
const SL=[{id:uid(),nome:"Sede Central",cidade:"São Paulo",uf:"SP",tipo:"Matriz"},{id:uid(),nome:"Filial Norte",cidade:"Manaus",uf:"AM",tipo:"Filial"}];
const STM=[
  {id:uid(),nome:"Desktop",        categoria:"Computadores",  descricao:"Computador de mesa"},
  {id:uid(),nome:"Notebook",       categoria:"Computadores",  descricao:"Computador portátil"},
  {id:uid(),nome:"All-in-One",     categoria:"Computadores",  descricao:"Monitor com PC integrado"},
  {id:uid(),nome:"Workstation",    categoria:"Computadores",  descricao:"Estação de alto desempenho"},
  {id:uid(),nome:"Tablet Android", categoria:"Tablets",       descricao:"Tablet com Android"},
  {id:uid(),nome:"iPad",           categoria:"Tablets",       descricao:"Tablet Apple"},
  {id:uid(),nome:"AP Indoor",      categoria:"Access Points", descricao:"Ponto de acesso interno"},
  {id:uid(),nome:"AP Outdoor",     categoria:"Access Points", descricao:"Ponto de acesso externo"},
  {id:uid(),nome:"No-break",       categoria:"Itens Avulsos", descricao:"Fonte de alimentação ininterrupta"},
  {id:uid(),nome:"Impressora",     categoria:"Itens Avulsos", descricao:""},
  {id:uid(),nome:"Óculos VR",      categoria:"Itens Avulsos", descricao:"Óculos de realidade virtual"},
  {id:uid(),nome:"Projetor",       categoria:"Itens Avulsos", descricao:""},
  {id:uid(),nome:"Câmera",         categoria:"Itens Avulsos", descricao:""},
  {id:uid(),nome:"Telefone IP",    categoria:"Itens Avulsos", descricao:""},
];
const SC=[{id:uid(),bloco:"Bloco A",setor:"TI",tipoMaquina:"Desktop",programasBasicos:true,dominio:true,hostname:"TI-PC-001",mac:"00:1A:2B:3C:4D:5E",conectividade:"Cabo",endpoint:true,tipoTunel:"Administrativo",serial:"SN2024001",modeloMonitor:"Dell P2419H",serialMonitor:"MN001",patrimonioMonitor:"PAT-001",switch_:"SW-RACK-01",portaSwitch:"Fa0/1",vlan:"Administrativa",observacoes:""}];

// ── PRIMITIVOS ────────────────────────────────────────────────────────────────
const Input=({label,value,onChange,mono,type="text",placeholder,required,disabled})=>(<div style={{display:"flex",flexDirection:"column",gap:4}}>{label&&<label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}<input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder||label||""} disabled={disabled} style={{background:disabled?C.dim:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 12px",color:disabled?C.muted:C.text,fontFamily:mono?C.mono:C.sans,fontSize:mono?12:13,outline:"none",width:"100%",boxSizing:"border-box"}} onFocus={e=>{if(!disabled)e.target.style.borderColor=C.accent;}} onBlur={e=>e.target.style.borderColor=C.border}/></div>);
const Sel=({label,value,onChange,options,required})=>(<div style={{display:"flex",flexDirection:"column",gap:4}}>{label&&<label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}<select value={value||""} onChange={e=>onChange(e.target.value)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 12px",color:value?C.text:C.muted,fontFamily:C.sans,fontSize:13,outline:"none",appearance:"none",cursor:"pointer",width:"100%"}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}><option value="">Selecionar...</option>{options.map(o=>typeof o==="string"?<option key={o} value={o}>{o}</option>:<option key={o.value} value={o.value}>{o.label}</option>)}</select></div>);
const Toggle=({label,value,onChange})=>(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 12px",gap:8}}><span style={{fontSize:13,color:C.text}}>{label}</span><button onClick={()=>onChange(!value)} style={{width:38,height:22,borderRadius:11,border:"none",cursor:"pointer",background:value?C.accent:C.dim,position:"relative",transition:"background 0.2s",flexShrink:0}}><span style={{position:"absolute",top:3,left:value?19:3,width:16,height:16,borderRadius:8,background:"#fff",transition:"left 0.2s"}}/></button></div>);
const Textarea=({label,value,onChange,rows=3})=>(<div style={{display:"flex",flexDirection:"column",gap:4}}>{label&&<label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</label>}<textarea value={value||""} onChange={e=>onChange(e.target.value)} rows={rows} placeholder="Observações..." style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 12px",color:C.text,fontFamily:C.sans,fontSize:13,outline:"none",resize:"vertical",width:"100%",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/></div>);
const Badge=({children,color=C.accent})=>(<span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:5,padding:"2px 8px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>);
const BoolBadge=({value})=><Badge color={value?C.success:C.muted}>{value?"✓ Sim":"✗ Não"}</Badge>;
const Btn=({onClick,children,variant="primary",icon,small,danger,disabled,title,full})=>{const bg=danger?C.danger:variant==="primary"?C.accent:variant==="ghost"?"transparent":C.card2;const border=variant==="outline"?C.border:danger?C.danger:"transparent";return(<button onClick={onClick} disabled={disabled} title={title} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,background:bg,border:`1px solid ${border}`,borderRadius:7,padding:small?"5px 10px":"8px 14px",color:disabled?C.muted:C.text,fontSize:small?12:13,fontWeight:500,cursor:disabled?"not-allowed":"pointer",fontFamily:C.sans,whiteSpace:"nowrap",opacity:disabled?0.5:1,width:full?"100%":"auto"}} onMouseEnter={e=>{if(!disabled)e.currentTarget.style.opacity="0.82";}} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>{icon&&icon}{children}</button>);};
const Modal=({title,subtitle,onClose,children,wide,maxWidth})=>(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:1000,padding:"32px 16px",overflowY:"auto"}} onClick={e=>e.target===e.currentTarget&&onClose()}><div style={{background:C.card,border:`1px solid ${C.borderHover}`,borderRadius:14,width:"100%",maxWidth:maxWidth||(wide?860:580),boxShadow:"0 24px 60px rgba(0,0,0,0.6)"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",borderBottom:`1px solid ${C.border}`}}><div><h3 style={{margin:0,fontSize:15,fontWeight:700,color:C.text}}>{title}</h3>{subtitle&&<p style={{margin:"2px 0 0",fontSize:12,color:C.muted}}>{subtitle}</p>}</div><button onClick={onClose} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",display:"flex",padding:4,borderRadius:6}}><X size={17}/></button></div><div style={{padding:24}}>{children}</div></div></div>);
const Grid=({children,cols=2})=><div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:14}}>{children}</div>;
const Full=({children})=><div style={{gridColumn:"1 / -1"}}>{children}</div>;
const Sec=({label})=>(<div style={{gridColumn:"1 / -1",display:"flex",alignItems:"center",gap:10,margin:"6px 0 2px"}}><span style={{fontSize:10,fontWeight:800,color:C.accent,textTransform:"uppercase",letterSpacing:"0.12em",whiteSpace:"nowrap"}}>{label}</span><div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/></div>);

// ── TABELA ────────────────────────────────────────────────────────────────────
const Table=({columns,rows,onEdit,onDelete,compact,extraActions})=>(<div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr>{columns.map(col=>(<th key={col.key} style={{padding:compact?"8px 12px":"10px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",borderBottom:`1px solid ${C.border}`,background:C.bg,whiteSpace:"nowrap"}}>{col.label}</th>))}<th style={{padding:compact?"8px 12px":"10px 16px",textAlign:"right",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`,background:C.bg}}>Ações</th></tr></thead><tbody>{rows.length===0?(<tr><td colSpan={columns.length+1} style={{padding:"52px 24px",textAlign:"center",color:C.muted}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><Database size={28} style={{opacity:0.25}}/><span style={{fontSize:13}}>Nenhum registro encontrado</span></div></td></tr>):rows.map(row=>(<tr key={row.id} style={{borderBottom:`1px solid ${C.border}22`}} onMouseEnter={e=>e.currentTarget.style.background=C.accentGlow} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{columns.map(col=>(<td key={col.key} style={{padding:compact?"7px 12px":"9px 16px",color:C.text,fontFamily:col.mono?C.mono:C.sans,fontSize:col.mono?11:13,whiteSpace:"nowrap"}}>{col.render?col.render(row[col.key],row):fmt(row[col.key])}</td>))}<td style={{padding:compact?"7px 12px":"9px 16px",textAlign:"right"}}><div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>{extraActions&&extraActions(row)}<Btn small icon={<Edit2 size={11}/>} variant="outline" onClick={()=>onEdit(row)}>Editar</Btn><Btn small icon={<Trash2 size={11}/>} danger onClick={()=>onDelete(row.id)}>Excluir</Btn></div></td></tr>))}</tbody></table></div>);

// ── EXPORTAÇÃO ────────────────────────────────────────────────────────────────
const exportCSV=(data,filename,cols)=>{if(!data.length)return;const keys=cols.map(c=>c.key);const rows=data.map(row=>keys.map(k=>{const v=row[k];if(v==null)return'""';if(typeof v==="boolean")return`"${boolFmt(v)}"`;return`"${String(v).replace(/"/g,'""')}"`;}).join(","));const csv=[cols.map(c=>c.label).join(","),...rows].join("\n");const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename+".csv";a.click();URL.revokeObjectURL(url);};
const printHTML=html=>{const w=window.open("","_blank");w.document.write(html);w.document.close();setTimeout(()=>w.print(),400);};
const buildPDF=(sections,title)=>{const rs=({name,data,cols,color="#1e3a5f"})=>{if(!data.length)return`<div class="sec"><h2 style="color:${color}">${name}</h2><p class="empty">Sem registros.</p></div>`;const rows=data.map(row=>`<tr>${cols.map(col=>{const v=row[col.key];if(v==null)return"<td>—</td>";if(col.bool||typeof v==="boolean")return`<td class="${v?"yes":"no"}">${boolFmt(v)}</td>`;return`<td>${v}</td>`;}).join("")}</tr>`).join("");return`<div class="sec"><h2 style="color:${color}">${name}<span class="cnt">${data.length}</span></h2><table><thead><tr>${cols.map(c=>`<th>${c.label}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>`;};return`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;padding:24px;color:#111}h1{margin:0;font-size:20px;color:#1e3a5f}.sub{color:#666;font-size:12px;margin:4px 0 16px}.stats{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap}.stat{background:#f1f5f9;border-radius:8px;padding:8px 14px;font-size:11px;color:#334155}.stat strong{display:block;font-size:17px;color:#1e3a5f}.sec{margin-bottom:28px}h2{font-size:13px;margin:0 0 8px;display:flex;align-items:center;gap:8px}.cnt{background:#e2e8f0;color:#64748b;padding:1px 7px;border-radius:4px;font-size:10px;font-weight:normal}table{width:100%;border-collapse:collapse;font-size:10px}th{background:#1e3a5f;color:#fff;padding:5px 8px;text-align:left;font-size:9px;text-transform:uppercase}td{padding:5px 8px;border-bottom:1px solid #e5e7eb}.yes{color:#059669;font-weight:600}.no{color:#9ca3af}tr:nth-child(even) td{background:#f8fafc}.empty{color:#9ca3af;font-size:12px}@media print{.sec{page-break-inside:avoid}}</style></head><body><h1>📊 ${title}</h1><p class="sub">Gerado em ${new Date().toLocaleString("pt-BR")} • Inventário TI</p><div class="stats">${sections.map(s=>`<div class="stat"><strong>${s.data.length}</strong>${s.name}</div>`).join("")}</div>${sections.map(rs).join("")}</body></html>`;};

// ── MÓDULO GENÉRICO ───────────────────────────────────────────────────────────
function Module({title,items,setItems,columns,FormComponent,formProps={},storageKey,compact,extraActions}){
  const[search,setSearch]=useState("");const[modal,setModal]=useState(null);
  const filtered=items.filter(item=>Object.values(item).some(v=>String(v??"").toLowerCase().includes(search.toLowerCase())));
  const hSave=data=>{const u=data.id?items.map(i=>i.id===data.id?data:i):[...items,{...data,id:uid(),createdAt:new Date().toISOString()}];setItems(u);save(storageKey,u);setModal(null);};
  const hDel=id=>{if(!confirm("Confirmar exclusão?"))return;const u=items.filter(i=>i.id!==id);setItems(u);save(storageKey,u);};
  return(<div style={{display:"flex",flexDirection:"column"}}><div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 20px",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"}}><div style={{flex:1,position:"relative",minWidth:180}}><Search size={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px 6px 30px",color:C.text,fontFamily:C.sans,fontSize:12,outline:"none",boxSizing:"border-box"}}/></div><span style={{fontSize:11,color:C.muted}}>{filtered.length}/{items.length}</span><Btn small icon={<Plus size={12}/>} onClick={()=>setModal("add")}>Novo {title}</Btn></div><Table columns={columns} rows={filtered} onEdit={item=>setModal(item)} onDelete={hDel} compact={compact} extraActions={extraActions}/>{modal&&<Modal title={modal==="add"?`Novo ${title}`:`Editar ${title}`} onClose={()=>setModal(null)} wide><FormComponent item={modal==="add"?{}:modal} onSave={hSave} onClose={()=>setModal(null)} {...formProps}/></Modal>}</div>);
}

// ── FORMULÁRIOS ───────────────────────────────────────────────────────────────
const COMP_COLS=[{key:"bloco",label:"Bloco"},{key:"setor",label:"Setor"},{key:"tipoMaquina",label:"Tipo",render:v=><Badge color={C.accent}>{v||"—"}</Badge>},{key:"hostname",label:"Hostname",mono:true},{key:"mac",label:"MAC",mono:true},{key:"dominio",label:"Domínio",render:v=><BoolBadge value={v}/>},{key:"endpoint",label:"Endpoint",render:v=><BoolBadge value={v}/>},{key:"tipoTunel",label:"Túnel",render:v=>v?<Badge color={v==="Administrativo"?C.accent:C.warning}>{v}</Badge>:"—"},{key:"vlan",label:"VLAN",render:v=>v?<Badge color={C.success}>{v}</Badge>:"—"},{key:"switch_",label:"Switch",mono:true}];
const EC={id:null,bloco:"",setor:"",tipoMaquina:"",programasBasicos:false,dominio:false,hostname:"",mac:"",conectividade:"Cabo",endpoint:false,tipoTunel:"",serial:"",modeloMonitor:"",serialMonitor:"",patrimonioMonitor:"",switch_:"",portaSwitch:"",vlan:"",observacoes:""};
function ComputerForm({item,onSave,onClose,vlans,onAddVlan,blocos,setores,tiposMaq}){const[d,setD]=useState({...EC,...item});const[nv,setNV]=useState("");const s=k=>v=>setD(p=>({...p,[k]:v}));const tiposComp=tiposMaq.filter(t=>t.categoria==="Computadores").map(t=>t.nome);const showMonitor=d.tipoMaquina&&!["Notebook"].includes(d.tipoMaquina);return(<div style={{display:"flex",flexDirection:"column",gap:14}}><Grid><Sec label="Identificação & Localização"/><Sel label="Bloco" value={d.bloco} onChange={s("bloco")} options={blocos.map(b=>b.nome)}/><Sel label="Setor" value={d.setor} onChange={s("setor")} options={setores.map(x=>x.nome)}/><Sel label="Tipo de Máquina" value={d.tipoMaquina} onChange={s("tipoMaquina")} options={tiposComp} required/><Input label="Número de Série" value={d.serial} onChange={s("serial")} mono/><Sec label="Sistema & Rede"/><Toggle label="Possui programas básicos?" value={d.programasBasicos} onChange={s("programasBasicos")}/><Toggle label="Está no domínio?" value={d.dominio} onChange={s("dominio")}/><Input label="Hostname" value={d.hostname} onChange={s("hostname")} mono/><Input label="Endereço MAC" value={d.mac} onChange={s("mac")} mono placeholder="00:00:00:00:00:00"/><Sel label="Conectividade" value={d.conectividade} onChange={s("conectividade")} options={["Cabo","Wi-Fi"]}/><Toggle label="Está no Endpoint?" value={d.endpoint} onChange={s("endpoint")}/><Sel label="Tipo de Túnel" value={d.tipoTunel} onChange={s("tipoTunel")} options={["Administrativo","Acadêmico"]}/>{showMonitor&&<><Sec label="Monitor"/><Input label="Modelo do Monitor" value={d.modeloMonitor} onChange={s("modeloMonitor")}/><Input label="Nº Série Monitor" value={d.serialMonitor} onChange={s("serialMonitor")} mono/><Input label="Nº Patrimônio Monitor" value={d.patrimonioMonitor} onChange={s("patrimonioMonitor")} mono/></>}<Sec label="Rede Física"/><Input label="Switch Conectado" value={d.switch_} onChange={s("switch_")} mono/><Input label="Porta do Switch" value={d.portaSwitch} onChange={s("portaSwitch")} mono/><Sel label="VLAN" value={d.vlan} onChange={s("vlan")} options={["Administrativa","Laboratório",...vlans.filter(v=>v!=="Administrativa"&&v!=="Laboratório")]}/><div style={{display:"flex",gap:8,alignItems:"flex-end"}}><div style={{flex:1}}><Input label="Nova VLAN" value={nv} onChange={setNV} placeholder="Ex: VLAN-50"/></div><Btn onClick={()=>{if(nv.trim()){onAddVlan(nv.trim());setD(p=>({...p,vlan:nv.trim()}));setNV("");}}} variant="outline">+ Add</Btn></div><Full><Textarea label="Observações" value={d.observacoes} onChange={s("observacoes")}/></Full></Grid><div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><Btn variant="outline" onClick={onClose}>Cancelar</Btn><Btn onClick={()=>onSave(d)} icon={<Check size={14}/>}>Salvar</Btn></div></div>);}

const TAB_COLS=[{key:"local",label:"Local"},{key:"tipoTablet",label:"Tipo",render:v=>v?<Badge color={C.purple}>{v}</Badge>:"—"},{key:"modelo",label:"Modelo"},{key:"hostname",label:"Hostname",mono:true},{key:"mac",label:"MAC",mono:true},{key:"imei",label:"IMEI",mono:true},{key:"serial",label:"Série",mono:true},{key:"patrimonio",label:"Patrimônio",mono:true},{key:"dominio",label:"Domínio",render:v=><BoolBadge value={v}/>}];
const ET={id:null,local:"",tipoTablet:"",aplicativosBasicos:false,dominio:false,mac:"",hostname:"",imei:"",mei:"",modelo:"",serial:"",vlan:"",patrimonio:"",observacoes:""};
function TabletForm({item,onSave,onClose,vlans,locais,tiposMaq}){const[d,setD]=useState({...ET,...item});const s=k=>v=>setD(p=>({...p,[k]:v}));const tiposTab=tiposMaq.filter(t=>t.categoria==="Tablets").map(t=>t.nome);return(<div style={{display:"flex",flexDirection:"column",gap:14}}><Grid><Sel label="Tipo de Tablet" value={d.tipoTablet} onChange={s("tipoTablet")} options={tiposTab}/><Sel label="Local / Afiliada" value={d.local} onChange={s("local")} options={locais.map(l=>l.nome)}/><Input label="Modelo" value={d.modelo} onChange={s("modelo")}/><Input label="Hostname" value={d.hostname} onChange={s("hostname")} mono/><Input label="Endereço MAC" value={d.mac} onChange={s("mac")} mono/><Input label="IMEI" value={d.imei} onChange={s("imei")} mono/><Input label="MEI" value={d.mei} onChange={s("mei")} mono/><Input label="Número de Série" value={d.serial} onChange={s("serial")} mono/><Input label="Nº Patrimônio" value={d.patrimonio} onChange={s("patrimonio")} mono/><Sel label="VLAN" value={d.vlan} onChange={s("vlan")} options={["Administrativa","Laboratório",...vlans.filter(v=>v!=="Administrativa"&&v!=="Laboratório")]}/><div/><Toggle label="Possui aplicativos básicos?" value={d.aplicativosBasicos} onChange={s("aplicativosBasicos")}/><Toggle label="Está no domínio?" value={d.dominio} onChange={s("dominio")}/><Full><Textarea label="Observações" value={d.observacoes} onChange={s("observacoes")}/></Full></Grid><div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><Btn variant="outline" onClick={onClose}>Cancelar</Btn><Btn onClick={()=>onSave(d)} icon={<Check size={14}/>}>Salvar</Btn></div></div>);}

const AP_COLS=[{key:"tipoAP",label:"Tipo",render:v=>v?<Badge color={C.success}>{v}</Badge>:"—"},{key:"nome",label:"Nome AP",mono:true},{key:"ip",label:"IP",mono:true},{key:"mac",label:"MAC",mono:true},{key:"local",label:"Local"},{key:"bloco",label:"Bloco"},{key:"switch_",label:"Switch",mono:true}];
const EA={id:null,tipoAP:"",nome:"",ip:"",mac:"",local:"",switch_:"",bloco:"",observacoes:""};
function APForm({item,onSave,onClose,blocos,locais,tiposMaq}){const[d,setD]=useState({...EA,...item});const s=k=>v=>setD(p=>({...p,[k]:v}));const tiposAP=tiposMaq.filter(t=>t.categoria==="Access Points").map(t=>t.nome);return(<div style={{display:"flex",flexDirection:"column",gap:14}}><Grid><Sel label="Tipo de AP" value={d.tipoAP} onChange={s("tipoAP")} options={tiposAP}/><Input label="Nome do AP" value={d.nome} onChange={s("nome")} mono required/><Input label="Endereço IP" value={d.ip} onChange={s("ip")} mono placeholder="192.168.1.1"/><Input label="Endereço MAC" value={d.mac} onChange={s("mac")} mono/><Sel label="Local / Afiliada" value={d.local} onChange={s("local")} options={locais.map(l=>l.nome)}/><Input label="Switch Conectado" value={d.switch_} onChange={s("switch_")} mono/><Sel label="Bloco" value={d.bloco} onChange={s("bloco")} options={blocos.map(b=>b.nome)}/><Full><Textarea label="Observações" value={d.observacoes} onChange={s("observacoes")}/></Full></Grid><div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><Btn variant="outline" onClick={onClose}>Cancelar</Btn><Btn onClick={()=>onSave(d)} icon={<Check size={14}/>}>Salvar</Btn></div></div>);}

const MISC_COLS=[{key:"tipo",label:"Tipo",render:v=><Badge color={C.warning}>{v||"—"}</Badge>},{key:"local",label:"Local"},{key:"modelo",label:"Modelo"},{key:"serial",label:"Série",mono:true},{key:"patrimonio",label:"Patrimônio",mono:true}];
const EM={id:null,tipo:"",local:"",modelo:"",serial:"",patrimonio:"",mac:"",mei:"",imei:"",observacoes:""};
function MiscForm({item,onSave,onClose,locais,tiposMaq}){const[d,setD]=useState({...EM,...item});const s=k=>v=>setD(p=>({...p,[k]:v}));const tiposMisc=tiposMaq.filter(t=>t.categoria==="Itens Avulsos").map(t=>t.nome);return(<div style={{display:"flex",flexDirection:"column",gap:14}}><Grid><div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Tipo do Item <span style={{color:C.danger}}>*</span></label>{tiposMisc.length>0?<select value={d.tipo} onChange={e=>s("tipo")(e.target.value)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 12px",color:d.tipo?C.text:C.muted,fontFamily:C.sans,fontSize:13,outline:"none",appearance:"none",cursor:"pointer",width:"100%"}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}><option value="">Selecionar...</option>{tiposMisc.map(t=><option key={t} value={t}>{t}</option>)}</select>:<div style={{background:C.warning+"15",border:`1px solid ${C.warning}44`,borderRadius:7,padding:"8px 12px",fontSize:12,color:C.warning,display:"flex",alignItems:"center",gap:8}}><AlertTriangle size={13}/>Cadastre tipos em <strong>Cadastros → Tipos</strong> com categoria "Itens Avulsos"</div>}</div><Sel label="Local / Afiliada" value={d.local} onChange={s("local")} options={locais.map(l=>l.nome)}/><Input label="Modelo" value={d.modelo} onChange={s("modelo")}/><Input label="Número de Série" value={d.serial} onChange={s("serial")} mono/><Input label="Nº Patrimônio" value={d.patrimonio} onChange={s("patrimonio")} mono/><Input label="Endereço MAC" value={d.mac} onChange={s("mac")} mono placeholder="Se aplicável"/><Input label="MEI" value={d.mei} onChange={s("mei")} mono/><Input label="IMEI" value={d.imei} onChange={s("imei")} mono/><Full><Textarea label="Observações" value={d.observacoes} onChange={s("observacoes")}/></Full></Grid><div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><Btn variant="outline" onClick={onClose}>Cancelar</Btn><Btn onClick={()=>onSave(d)} icon={<Check size={14}/>}>Salvar</Btn></div></div>);}

// ── ABA EQUIPAMENTOS — sidebar com 4 categorias ───────────────────────────────
function EquipamentosTab({computers,setComputers,tablets,setTablets,aps,setAps,misc,setMisc,vlans,addVlan,blocos,setores,locais,tiposMaq}){
  const[sub,setSub]=useState("computers");
  const subs=[
    {id:"computers",label:"Computadores",  icon:Monitor, color:C.accent,  count:computers.length},
    {id:"tablets",  label:"Tablets",        icon:Tablet,  color:C.purple,  count:tablets.length},
    {id:"aps",      label:"Access Points",  icon:Wifi,    color:C.success, count:aps.length},
    {id:"misc",     label:"Itens Avulsos",  icon:Package, color:C.warning, count:misc.length},
  ];
  return(
    <div style={{display:"flex",minHeight:480}}>
      {/* Sidebar */}
      <div style={{width:190,flexShrink:0,borderRight:`1px solid ${C.border}`,padding:"12px 8px",display:"flex",flexDirection:"column",gap:2}}>
        {subs.map(({id,label,icon:Icon,color,count})=>{
          const on=sub===id;
          return(
            <button key={id} onClick={()=>setSub(id)}
              style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:8,border:`1px solid ${on?color+"44":"transparent"}`,cursor:"pointer",background:on?color+"15":"transparent",color:on?color:C.muted,fontFamily:C.sans,fontSize:12,fontWeight:on?700:400,width:"100%",transition:"all 0.15s"}}
              onMouseEnter={e=>{if(!on){e.currentTarget.style.background=C.accentGlow;e.currentTarget.style.color=C.text;}}}
              onMouseLeave={e=>{if(!on){e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.muted;}}}>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <div style={{width:26,height:26,background:on?color+"25":C.dim,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon size={13} color={on?color:C.muted}/>
                </div>
                {label}
              </div>
              <span style={{fontSize:11,fontWeight:700,color:on?color:C.muted,background:on?color+"22":C.dim,borderRadius:5,padding:"1px 8px",minWidth:22,textAlign:"center"}}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
      {/* Conteúdo */}
      <div style={{flex:1,minWidth:0}}>
        {sub==="computers"&&<Module title="Computador" items={computers} setItems={v=>{setComputers(v);save(KEYS.computers,v);}} columns={COMP_COLS} FormComponent={ComputerForm} storageKey={KEYS.computers} formProps={{vlans,onAddVlan:addVlan,blocos,setores,tiposMaq}}/>}
        {sub==="tablets"&&<Module title="Tablet" items={tablets} setItems={v=>{setTablets(v);save(KEYS.tablets,v);}} columns={TAB_COLS} FormComponent={TabletForm} storageKey={KEYS.tablets} formProps={{vlans,locais,tiposMaq}}/>}
        {sub==="aps"&&<Module title="Access Point" items={aps} setItems={v=>{setAps(v);save(KEYS.aps,v);}} columns={AP_COLS} FormComponent={APForm} storageKey={KEYS.aps} formProps={{blocos,locais,tiposMaq}}/>}
        {sub==="misc"&&<Module title="Item Avulso" items={misc} setItems={v=>{setMisc(v);save(KEYS.misc,v);}} columns={MISC_COLS} FormComponent={MiscForm} storageKey={KEYS.misc} formProps={{locais,tiposMaq}}/>}
      </div>
    </div>
  );
}

// ── CADASTROS ─────────────────────────────────────────────────────────────────
const SETOR_COLS=[{key:"nome",label:"Nome"},{key:"sigla",label:"Sigla",render:v=>v?<Badge>{v}</Badge>:"—"},{key:"descricao",label:"Descrição"}];
function SetorForm({item,onSave,onClose}){const[d,setD]=useState({nome:"",sigla:"",descricao:"",...item});const s=k=>v=>setD(p=>({...p,[k]:v}));return(<div style={{display:"flex",flexDirection:"column",gap:14}}><Grid cols={3}><div style={{gridColumn:"1 / 3"}}><Input label="Nome do Setor" value={d.nome} onChange={s("nome")} required/></div><Input label="Sigla" value={d.sigla} onChange={s("sigla")} placeholder="Ex: TI"/><Full><Input label="Descrição" value={d.descricao} onChange={s("descricao")}/></Full></Grid><div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><Btn variant="outline" onClick={onClose}>Cancelar</Btn><Btn onClick={()=>onSave(d)} icon={<Check size={14}/>}>Salvar</Btn></div></div>);}
const BLOCO_COLS=[{key:"nome",label:"Nome"},{key:"descricao",label:"Descrição"}];
function BlocoForm({item,onSave,onClose}){const[d,setD]=useState({nome:"",descricao:"",...item});const s=k=>v=>setD(p=>({...p,[k]:v}));return(<div style={{display:"flex",flexDirection:"column",gap:14}}><Grid cols={1}><Input label="Nome do Bloco" value={d.nome} onChange={s("nome")} required/><Input label="Descrição" value={d.descricao} onChange={s("descricao")}/></Grid><div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><Btn variant="outline" onClick={onClose}>Cancelar</Btn><Btn onClick={()=>onSave(d)} icon={<Check size={14}/>}>Salvar</Btn></div></div>);}
const LOCAL_COLS=[{key:"nome",label:"Nome"},{key:"cidade",label:"Cidade"},{key:"uf",label:"UF"},{key:"tipo",label:"Tipo",render:v=><Badge color={v==="Matriz"?C.accent:C.teal}>{v||"—"}</Badge>}];
function LocalForm({item,onSave,onClose}){const[d,setD]=useState({nome:"",cidade:"",uf:"",tipo:"",endereco:"",cnpj:"",telefone:"",observacoes:"",...item});const s=k=>v=>setD(p=>({...p,[k]:v}));const UFs=["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];return(<div style={{display:"flex",flexDirection:"column",gap:14}}><Grid><Input label="Nome / Afiliada" value={d.nome} onChange={s("nome")} required/><Sel label="Tipo" value={d.tipo} onChange={s("tipo")} options={["Matriz","Filial","Unidade","Ambulatório","Hospital","Clínica"]}/><Input label="Cidade" value={d.cidade} onChange={s("cidade")}/><Sel label="UF" value={d.uf} onChange={s("uf")} options={UFs}/><Input label="CNPJ" value={d.cnpj} onChange={s("cnpj")} mono/><Input label="Telefone" value={d.telefone} onChange={s("telefone")}/><Full><Input label="Endereço" value={d.endereco} onChange={s("endereco")}/></Full><Full><Textarea label="Observações" value={d.observacoes} onChange={s("observacoes")}/></Full></Grid><div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><Btn variant="outline" onClick={onClose}>Cancelar</Btn><Btn onClick={()=>onSave(d)} icon={<Check size={14}/>}>Salvar</Btn></div></div>);}

function TipoMaqForm({item,onSave,onClose}){
  const[d,setD]=useState({nome:"",categoria:"",descricao:"",...item});const s=k=>v=>setD(p=>({...p,[k]:v}));
  const catIcons={"Computadores":Monitor,"Tablets":Tablet,"Access Points":Wifi,"Itens Avulsos":Package};
  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <div style={{background:C.accentGlow,border:`1px solid ${C.accent}33`,borderRadius:8,padding:"12px 16px",display:"flex",gap:10,alignItems:"flex-start"}}><Tag size={14} color={C.accent} style={{flexShrink:0,marginTop:1}}/><span style={{fontSize:12,color:C.text,lineHeight:1.5}}>O tipo aparecerá automaticamente no campo de tipo da categoria selecionada.</span></div>
    <Grid cols={1}>
      <Input label="Nome do Tipo" value={d.nome} onChange={s("nome")} required placeholder="Ex: Notebook, No-break, iPad..."/>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        <label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Categoria <span style={{color:C.danger}}>*</span></label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {CATEGORIAS.map(cat=>{const color=CAT_COLOR[cat];const on=d.categoria===cat;const Icon=catIcons[cat];return(<div key={cat} onClick={()=>s("categoria")(cat)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:on?color+"18":C.bg,border:`2px solid ${on?color:C.border}`,borderRadius:9,cursor:"pointer",transition:"all 0.15s"}}><div style={{width:28,height:28,background:color+"22",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={13} color={color}/></div><span style={{fontSize:12,fontWeight:on?700:400,color:on?color:C.text}}>{cat}</span>{on&&<Check size={13} color={color} style={{marginLeft:"auto"}}/>}</div>);})}
        </div>
      </div>
      <Input label="Descrição" value={d.descricao} onChange={s("descricao")}/>
    </Grid>
    <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><Btn variant="outline" onClick={onClose}>Cancelar</Btn><Btn onClick={()=>{if(!d.nome||!d.categoria){alert("Preencha Nome e Categoria.");return;}onSave(d);}} icon={<Check size={14}/>}>Salvar</Btn></div>
  </div>);}

function TiposMaqPanel({tiposMaq,setTiposMaq}){
  const[modal,setModal]=useState(null);
  const hSave=data=>{const u=data.id?tiposMaq.map(i=>i.id===data.id?data:i):[...tiposMaq,{...data,id:uid(),createdAt:new Date().toISOString()}];setTiposMaq(u);save(KEYS.tiposMaq,u);setModal(null);};
  const hDel=id=>{if(!confirm("Confirmar exclusão?"))return;const u=tiposMaq.filter(i=>i.id!==id);setTiposMaq(u);save(KEYS.tiposMaq,u);};
  const catIcons={"Computadores":Monitor,"Tablets":Tablet,"Access Points":Wifi,"Itens Avulsos":Package};
  return(<div style={{display:"flex",flexDirection:"column"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:12,color:C.muted}}>Tipos vinculados às categorias — aparecem nos formulários de cada seção</span><Btn small icon={<Plus size={12}/>} onClick={()=>setModal("add")}>Novo Tipo</Btn></div><div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>{CATEGORIAS.map(cat=>{const color=CAT_COLOR[cat];const tipos=tiposMaq.filter(t=>t.categoria===cat);const Icon=catIcons[cat];return(<div key={cat} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}><div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",background:color+"10",borderBottom:`1px solid ${color}22`}}><div style={{width:26,height:26,background:color+"25",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={13} color={color}/></div><span style={{fontSize:12,fontWeight:700,color}}>{cat}</span><Badge color={color}>{tipos.length} tipo(s)</Badge></div>{tipos.length===0?<div style={{padding:"12px 16px",fontSize:12,color:C.muted}}>Nenhum tipo. Clique em "Novo Tipo" e selecione <strong>{cat}</strong>.</div>:<div style={{padding:10,display:"flex",flexWrap:"wrap",gap:8}}>{tipos.map(t=>(<div key={t.id} style={{display:"flex",alignItems:"center",gap:8,background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"5px 10px"}}><span style={{fontSize:12,color:C.text,fontWeight:500}}>{t.nome}</span>{t.descricao&&<span style={{fontSize:11,color:C.muted}}>— {t.descricao}</span>}<button onClick={()=>setModal(t)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",display:"flex",padding:2}} onMouseEnter={e=>e.currentTarget.style.color=C.accent} onMouseLeave={e=>e.currentTarget.style.color=C.muted}><Edit2 size={11}/></button><button onClick={()=>hDel(t.id)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",display:"flex",padding:2}} onMouseEnter={e=>e.currentTarget.style.color=C.danger} onMouseLeave={e=>e.currentTarget.style.color=C.muted}><Trash2 size={11}/></button></div>))}</div>}</div>);})}</div>{modal&&<Modal title={modal==="add"?"Novo Tipo de Equipamento":"Editar Tipo"} onClose={()=>setModal(null)}><TipoMaqForm item={modal==="add"?{}:modal} onSave={hSave} onClose={()=>setModal(null)}/></Modal>}</div>);}

const COLAB_COLS=[{key:"nome",label:"Nome"},{key:"matricula",label:"Matrícula",mono:true},{key:"setor",label:"Setor"},{key:"cargo",label:"Cargo"},{key:"email",label:"E-mail",mono:true},{key:"ramal",label:"Ramal",mono:true},{key:"status",label:"Status",render:v=><Badge color={v==="Ativo"?C.success:C.muted}>{v||"—"}</Badge>}];
function ColaboradorForm({item,onSave,onClose,setores}){const[d,setD]=useState({nome:"",matricula:"",setor:"",cargo:"",email:"",ramal:"",telefone:"",status:"Ativo",observacoes:"",...item});const s=k=>v=>setD(p=>({...p,[k]:v}));return(<div style={{display:"flex",flexDirection:"column",gap:14}}><Grid><Input label="Nome Completo" value={d.nome} onChange={s("nome")} required/><Input label="Matrícula" value={d.matricula} onChange={s("matricula")} mono/><Sel label="Setor" value={d.setor} onChange={s("setor")} options={setores.map(x=>x.nome)}/><Input label="Cargo" value={d.cargo} onChange={s("cargo")}/><Input label="E-mail" value={d.email} onChange={s("email")} type="email"/><Input label="Ramal" value={d.ramal} onChange={s("ramal")} mono placeholder="Ex: 1234"/><Input label="Telefone" value={d.telefone} onChange={s("telefone")}/><Sel label="Status" value={d.status} onChange={s("status")} options={["Ativo","Inativo","Afastado","Férias"]}/><Full><Textarea label="Observações" value={d.observacoes} onChange={s("observacoes")}/></Full></Grid><div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><Btn variant="outline" onClick={onClose}>Cancelar</Btn><Btn onClick={()=>onSave(d)} icon={<Check size={14}/>}>Salvar</Btn></div></div>);}

function CadastrosTab({setores,setSetores,blocos,setBlocos,locais,setLocais,tiposMaq,setTiposMaq,colaboradores,setColaboradores}){
  const[sub,setSub]=useState("tipos");
  const subs=[{id:"tipos",label:"Tipos de Equipamento",icon:Tag,color:C.orange},{id:"setores",label:"Setores",icon:Layers,color:C.teal},{id:"blocos",label:"Blocos",icon:Building2,color:"#f472b6"},{id:"locais",label:"Locais / Afiliadas",icon:MapPin,color:"#fb923c"},{id:"colaboradores",label:"Colaboradores",icon:Users,color:"#a78bfa"}];
  return(<div style={{display:"flex",minHeight:400}}><div style={{width:200,flexShrink:0,borderRight:`1px solid ${C.border}`,padding:"12px 8px",display:"flex",flexDirection:"column",gap:2}}>{subs.map(({id,label,icon:Icon,color})=>(<button key={id} onClick={()=>setSub(id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",background:sub===id?color+"18":"transparent",color:sub===id?color:C.muted,fontFamily:C.sans,fontSize:12,fontWeight:sub===id?600:400,textAlign:"left",width:"100%",transition:"all 0.15s"}}><Icon size={14}/>{label}</button>))}</div><div style={{flex:1,minWidth:0}}>{sub==="tipos"&&<TiposMaqPanel tiposMaq={tiposMaq} setTiposMaq={setTiposMaq}/>}{sub==="setores"&&<Module title="Setor" items={setores} setItems={v=>{setSetores(v);save(KEYS.setores,v);}} columns={SETOR_COLS} FormComponent={SetorForm} storageKey={KEYS.setores} compact/>}{sub==="blocos"&&<Module title="Bloco" items={blocos} setItems={v=>{setBlocos(v);save(KEYS.blocos,v);}} columns={BLOCO_COLS} FormComponent={BlocoForm} storageKey={KEYS.blocos} compact/>}{sub==="locais"&&<Module title="Local/Afiliada" items={locais} setItems={v=>{setLocais(v);save(KEYS.locais,v);}} columns={LOCAL_COLS} FormComponent={LocalForm} storageKey={KEYS.locais} compact/>}{sub==="colaboradores"&&<Module title="Colaborador" items={colaboradores} setItems={v=>{setColaboradores(v);save(KEYS.colaboradores,v);}} columns={COLAB_COLS} FormComponent={ColaboradorForm} storageKey={KEYS.colaboradores} formProps={{setores}} compact/>}</div></div>);
}

// ── COFRE DE SENHAS ───────────────────────────────────────────────────────────
const PWD_CATS=["Sistema","Servidor","Rede / Switch","Firewall","E-mail","Cloud","Banco de Dados","Aplicação","Wi-Fi","Outro"];
const CAT_CLR={"Sistema":C.accent,"Servidor":C.teal,"Rede / Switch":C.orange,"Firewall":C.danger,"Cloud":C.purple,"Banco de Dados":"#f472b6","Wi-Fi":C.success};
function PasswordCard({item,onEdit,onDelete}){const[show,setShow]=useState(false);const[cp,setCp]=useState(false);const pwd=dob(item.senha||"");const color=CAT_CLR[item.categoria]||C.muted;const copyPwd=()=>{navigator.clipboard.writeText(pwd).then(()=>{setCp(true);setTimeout(()=>setCp(false),1500);});};return(<div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:16,display:"flex",flexDirection:"column",gap:10,transition:"border-color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=color+"66"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}><div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:34,height:34,borderRadius:8,background:color+"20",border:`1px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><KeyRound size={15} color={color}/></div><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{item.nome||"—"}</div><div style={{fontSize:11,color:C.muted}}>{item.usuario||"Sem usuário"}</div></div></div><Badge color={color}>{item.categoria||"—"}</Badge></div><div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}><span style={{fontFamily:C.mono,fontSize:12,color:show?C.success:C.muted,letterSpacing:show?"0.04em":"0.2em",flex:1,overflow:"hidden",textOverflow:"ellipsis"}}>{show?pwd:"••••••••••••"}</span><div style={{display:"flex",gap:4,flexShrink:0}}><button onClick={()=>setShow(!show)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",display:"flex",padding:2}} onMouseEnter={e=>e.currentTarget.style.color=C.text} onMouseLeave={e=>e.currentTarget.style.color=C.muted}>{show?<EyeOff size={13}/>:<Eye size={13}/>}</button><button onClick={copyPwd} style={{background:"none",border:"none",color:cp?C.success:C.muted,cursor:"pointer",display:"flex",padding:2}}>{cp?<Check size={13}/>:<Copy size={13}/>}</button></div></div>{item.url&&<div style={{fontSize:11,color:C.accent,fontFamily:C.mono,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.url}</div>}{item.observacoes&&<div style={{fontSize:11,color:C.muted,borderTop:`1px solid ${C.border}`,paddingTop:8}}>{item.observacoes}</div>}<div style={{display:"flex",gap:6,justifyContent:"flex-end"}}><Btn small icon={<Edit2 size={11}/>} variant="outline" onClick={()=>onEdit(item)}>Editar</Btn><Btn small icon={<Trash2 size={11}/>} danger onClick={()=>onDelete(item.id)}>Excluir</Btn></div></div>);}
const EP={id:null,nome:"",categoria:"",usuario:"",senha:"",url:"",observacoes:""};
function PasswordForm({item,onSave,onClose}){const[d,setD]=useState({...EP,...item,senha:item.senha?dob(item.senha):""});const[show,setShow]=useState(false);const s=k=>v=>setD(p=>({...p,[k]:v}));const st=pwd=>{if(!pwd)return{score:0,label:"",color:C.muted};let sc=0;if(pwd.length>=8)sc++;if(pwd.length>=12)sc++;if(/[A-Z]/.test(pwd))sc++;if(/[0-9]/.test(pwd))sc++;if(/[^A-Za-z0-9]/.test(pwd))sc++;const lb=["","Fraca","Razoável","Boa","Forte","Muito forte"];const cl=[C.muted,C.danger,C.warning,C.warning,C.success,C.success];return{score:sc,label:lb[sc]||"",color:cl[sc]};};const pw=st(d.senha);return(<div style={{display:"flex",flexDirection:"column",gap:14}}><Grid><Input label="Nome / Serviço" value={d.nome} onChange={s("nome")} required/><Sel label="Categoria" value={d.categoria} onChange={s("categoria")} options={PWD_CATS}/><Input label="Usuário / Login" value={d.usuario} onChange={s("usuario")} mono/><div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Senha <span style={{color:C.danger}}>*</span></label><div style={{position:"relative"}}><input type={show?"text":"password"} value={d.senha} onChange={e=>s("senha")(e.target.value)} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 38px 8px 12px",color:C.text,fontFamily:C.mono,fontSize:13,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/><button onClick={()=>setShow(!show)} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.muted,cursor:"pointer",display:"flex"}}>{show?<EyeOff size={14}/>:<Eye size={14}/>}</button></div>{d.senha&&<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:3,background:C.border,borderRadius:2}}><div style={{width:`${(pw.score/5)*100}%`,height:"100%",background:pw.color,borderRadius:2,transition:"width 0.3s"}}/></div><span style={{fontSize:10,color:pw.color,fontWeight:600,whiteSpace:"nowrap"}}>{pw.label}</span></div>}</div><Full><Input label="URL / Endereço" value={d.url} onChange={s("url")} mono placeholder="https:// ou 192.168.x.x"/></Full><Full><Textarea label="Observações" value={d.observacoes} onChange={s("observacoes")}/></Full></Grid><div style={{background:C.warning+"15",border:`1px solid ${C.warning}44`,borderRadius:8,padding:"10px 14px",display:"flex",gap:8,alignItems:"flex-start"}}><AlertTriangle size={14} color={C.warning} style={{flexShrink:0,marginTop:1}}/><span style={{fontSize:11,color:C.warning}}>Senhas armazenadas com ofuscação básica neste dispositivo.</span></div><div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><Btn variant="outline" onClick={onClose}>Cancelar</Btn><Btn onClick={()=>onSave({...d,senha:ob(d.senha)})} icon={<Check size={14}/>}>Salvar</Btn></div></div>);}
function SenhasTab({senhas,setSenhas}){const[search,setSearch]=useState("");const[cat,setCat]=useState("");const[modal,setModal]=useState(null);const[locked,setLocked]=useState(true);const[pin,setPin]=useState("");const[pi,setPI]=useState("");const[pe,setPE]=useState("");const[sp,setSP]=useState(true);const hU=()=>{if(!pin){setLocked(false);return;}if(pi===pin){setLocked(false);setPE("");setPI("");}else{setPE("PIN incorreto.");}};const hSP=()=>{if(pi.length<4){setPE("Mínimo 4 dígitos");return;}setPin(pi);setLocked(false);setPI("");setPE("");setSP(false);};const filtered=senhas.filter(s=>{const q=search.toLowerCase();const ms=!q||Object.values(s).some(v=>String(v??"").toLowerCase().includes(q));const mc=!cat||s.categoria===cat;return ms&&mc;});const hSave=data=>{const u=data.id?senhas.map(s=>s.id===data.id?data:s):[...senhas,{...data,id:uid(),createdAt:new Date().toISOString()}];setSenhas(u);save(KEYS.senhas,u);setModal(null);};const hDel=id=>{if(!confirm("Excluir?"))return;const u=senhas.filter(s=>s.id!==id);setSenhas(u);save(KEYS.senhas,u);};if(locked)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"64px 24px"}}><div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:16,padding:40,width:"100%",maxWidth:360,display:"flex",flexDirection:"column",alignItems:"center",gap:20,textAlign:"center"}}><div style={{width:56,height:56,background:C.accentGlow,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${C.accent}44`}}><Lock size={24} color={C.accent}/></div><div><h3 style={{margin:"0 0 6px",fontSize:16,fontWeight:700,color:C.text}}>Cofre de Senhas</h3><p style={{margin:0,fontSize:12,color:C.muted}}>{sp?"Defina um PIN de sessão":"Digite o PIN para acessar"}</p></div><div style={{width:"100%",display:"flex",flexDirection:"column",gap:10}}><input type="password" value={pi} onChange={e=>setPI(e.target.value.replace(/\D/g,"").slice(0,8))} onKeyDown={e=>e.key==="Enter"&&(sp?hSP():hU())} placeholder={sp?"Definir PIN (4-8 dígitos)":"PIN de acesso"} style={{background:C.bg,border:`1px solid ${pe?C.danger:C.border}`,borderRadius:8,padding:"12px 16px",color:C.text,fontFamily:C.mono,fontSize:18,textAlign:"center",letterSpacing:"0.3em",outline:"none",width:"100%",boxSizing:"border-box"}}/>{pe&&<span style={{color:C.danger,fontSize:12}}>{pe}</span>}<Btn onClick={sp?hSP:hU} icon={<Unlock size={14}/>}>{sp?"Definir PIN e Entrar":"Acessar"}</Btn>{!sp&&<button onClick={()=>setLocked(false)} style={{background:"none",border:"none",color:C.muted,fontSize:11,cursor:"pointer",fontFamily:C.sans}}>Entrar sem PIN</button>}</div></div></div>);return(<div style={{display:"flex",flexDirection:"column"}}><div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 20px",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"}}><div style={{flex:1,position:"relative",minWidth:180}}><Search size={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar credenciais..." style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px 6px 30px",color:C.text,fontFamily:C.sans,fontSize:12,outline:"none",boxSizing:"border-box"}}/></div><select value={cat} onChange={e=>setCat(e.target.value)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 12px",color:cat?C.text:C.muted,fontFamily:C.sans,fontSize:12,outline:"none",cursor:"pointer"}}><option value="">Todas</option>{PWD_CATS.map(c=><option key={c} value={c}>{c}</option>)}</select><span style={{fontSize:11,color:C.muted}}>{filtered.length}/{senhas.length}</span><Btn small icon={<Lock size={12}/>} variant="outline" onClick={()=>setLocked(true)}>Bloquear</Btn><Btn small icon={<Plus size={12}/>} onClick={()=>setModal("add")}>Nova Credencial</Btn></div><div style={{padding:20}}>{filtered.length===0?(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"48px 24px",color:C.muted}}><Shield size={32} style={{opacity:0.25}}/><span style={{fontSize:13}}>Nenhuma credencial encontrada</span></div>):(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>{filtered.map(s=><PasswordCard key={s.id} item={s} onEdit={item=>setModal(item)} onDelete={hDel}/>)}</div>)}</div>{modal&&<Modal title={modal==="add"?"Nova Credencial":"Editar Credencial"} onClose={()=>setModal(null)}><PasswordForm item={modal==="add"?{}:modal} onSave={hSave} onClose={()=>setModal(null)}/></Modal>}</div>);}

// ── EMPRÉSTIMOS ───────────────────────────────────────────────────────────────
const EMP_EMPTY={id:null,numeroChamado:"",tipoEquipamento:"",identificacao:"",colaborador:"",setorColaborador:"",dataEmprestimo:today(),dataPrevista:"",dataDevolvido:"",devolvido:false,observacoes:""};
function EmprestimoForm({item,onSave,onClose,colaboradores,tiposMaq}){const[d,setD]=useState({...EMP_EMPTY,...item});const s=k=>v=>setD(p=>({...p,[k]:v}));const selColab=nome=>{const c=colaboradores.find(x=>x.nome===nome);setD(p=>({...p,colaborador:nome,setorColaborador:c?.setor||p.setorColaborador}));};const handleDevolucao=()=>{setD(p=>({...p,devolvido:true,dataDevolvido:today()}));};const todosOsTipos=tiposMaq.map(t=>({value:t.nome,label:`${t.nome} (${t.categoria})`}));const st=loanStatus(d);return(<div style={{display:"flex",flexDirection:"column",gap:14}}><Grid><Sec label="Chamado & Equipamento"/><Input label="Número do Chamado" value={d.numeroChamado} onChange={s("numeroChamado")} mono required placeholder="Ex: CHM-2024-001"/><Sel label="Tipo de Equipamento" value={d.tipoEquipamento} onChange={s("tipoEquipamento")} options={todosOsTipos} required/><Full><Input label="Identificação do Equipamento" value={d.identificacao} onChange={s("identificacao")} placeholder="Hostname, Nº Série, Patrimônio ou descrição" required/></Full><Sec label="Colaborador Responsável"/><Sel label="Colaborador" value={d.colaborador} onChange={selColab} options={colaboradores.filter(c=>c.status==="Ativo"||!c.status).map(c=>c.nome)}/><Input label="Setor" value={d.setorColaborador} onChange={s("setorColaborador")} disabled={!!colaboradores.find(x=>x.nome===d.colaborador)?.setor} placeholder="Preenchido automaticamente"/><Sec label="Datas"/><Input label="Data do Empréstimo" value={d.dataEmprestimo} onChange={s("dataEmprestimo")} type="date" required/><Input label="Data Prevista de Devolução" value={d.dataPrevista} onChange={s("dataPrevista")} type="date"/>{d.devolvido?<Input label="Data de Devolução" value={d.dataDevolvido} onChange={s("dataDevolvido")} type="date"/>:<div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Devolução</label><Btn icon={<RotateCcw size={13}/>} onClick={handleDevolucao} variant="outline">Registrar Devolução Agora</Btn></div>}<div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Status Atual</label><div style={{background:st.color+"15",border:`1px solid ${st.color}44`,borderRadius:7,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:13,fontWeight:700,color:st.color}}>{st.label}</span>{d.dataPrevista&&!d.devolvido&&<span style={{fontSize:11,color:C.muted}}>Previsto: {new Date(d.dataPrevista+"T12:00:00").toLocaleDateString("pt-BR")}</span>}</div></div><Full><Textarea label="Observações" value={d.observacoes} onChange={s("observacoes")}/></Full></Grid><div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><Btn variant="outline" onClick={onClose}>Cancelar</Btn><Btn onClick={()=>onSave(d)} icon={<Check size={14}/>}>Salvar</Btn></div></div>);}
const EMP_COLS=[{key:"numeroChamado",label:"Chamado",mono:true},{key:"tipoEquipamento",label:"Tipo",render:v=><Badge color={C.orange}>{v||"—"}</Badge>},{key:"identificacao",label:"Equipamento"},{key:"colaborador",label:"Colaborador"},{key:"setorColaborador",label:"Setor"},{key:"dataEmprestimo",label:"Emprestado",render:v=>v?new Date(v+"T12:00:00").toLocaleDateString("pt-BR"):"—"},{key:"dataPrevista",label:"Previsto",render:v=>v?new Date(v+"T12:00:00").toLocaleDateString("pt-BR"):"—"},{key:"dataDevolvido",label:"Devolvido em",render:v=>v?new Date(v+"T12:00:00").toLocaleDateString("pt-BR"):"—"},{key:"_status",label:"Status",render:(_,row)=>{const st=loanStatus(row);return<Badge color={st.color}>{st.label}</Badge>;}}];
function EmprestimosTab({emprestimos,setEmprestimos,colaboradores,tiposMaq}){const[search,setSearch]=useState("");const[filterStatus,setFilterStatus]=useState("");const[modal,setModal]=useState(null);const hoje=today();const stats={total:emprestimos.length,abertos:emprestimos.filter(e=>!e.devolvido&&(!e.dataPrevista||hoje<=e.dataPrevista)).length,atrasados:emprestimos.filter(e=>!e.devolvido&&e.dataPrevista&&hoje>e.dataPrevista).length,devolvidos:emprestimos.filter(e=>e.devolvido).length};const filtered=emprestimos.filter(e=>{const q=search.toLowerCase();const ms=!q||Object.values(e).some(v=>String(v??"").toLowerCase().includes(q));const st=loanStatus(e).label;const mf=!filterStatus||st===filterStatus;return ms&&mf;}).sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));const hSave=data=>{const u=data.id?emprestimos.map(i=>i.id===data.id?data:i):[...emprestimos,{...data,id:uid(),createdAt:new Date().toISOString()}];setEmprestimos(u);save(KEYS.emprestimos,u);setModal(null);};const hDel=id=>{if(!confirm("Confirmar exclusão?"))return;const u=emprestimos.filter(i=>i.id!==id);setEmprestimos(u);save(KEYS.emprestimos,u);};const hDevolver=row=>{if(!confirm(`Registrar devolução de "${row.identificacao}"?`))return;const updated={...row,devolvido:true,dataDevolvido:today()};const u=emprestimos.map(i=>i.id===row.id?updated:i);setEmprestimos(u);save(KEYS.emprestimos,u);};const exportarEmprestimos=()=>{const cols=[{key:"numeroChamado",label:"Chamado"},{key:"tipoEquipamento",label:"Tipo"},{key:"identificacao",label:"Equipamento"},{key:"colaborador",label:"Colaborador"},{key:"setorColaborador",label:"Setor"},{key:"dataEmprestimo",label:"Data Empréstimo"},{key:"dataPrevista",label:"Data Prevista"},{key:"dataDevolvido",label:"Data Devolução"},{key:"observacoes",label:"Obs"}];exportCSV(filtered.map(e=>({...e,_status:loanStatus(e).label})),`emprestimos_${hoje}`,cols);};return(<div style={{display:"flex",flexDirection:"column"}}><div style={{display:"flex",gap:12,padding:"16px 20px",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"}}>{[{label:"Total",val:stats.total,color:C.accent,icon:ArrowLeftRight},{label:"Em Aberto",val:stats.abertos,color:C.warning,icon:Clock},{label:"Atrasados",val:stats.atrasados,color:C.danger,icon:AlertTriangle},{label:"Devolvidos",val:stats.devolvidos,color:C.success,icon:CheckCircle2}].map(({label,val,color,icon:Icon})=>(<div key={label} onClick={()=>setFilterStatus(f=>f===label&&label!=="Total"?"":label==="Total"?"":label)} style={{display:"flex",alignItems:"center",gap:10,background:color+"12",border:`1px solid ${(filterStatus===label)?color:color+"28"}`,borderRadius:9,padding:"10px 16px",cursor:"pointer",transition:"all 0.15s",flex:1,minWidth:100}}><div style={{width:32,height:32,borderRadius:8,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={14} color={color}/></div><div><div style={{fontSize:11,color:C.muted}}>{label}</div><div style={{fontSize:18,fontWeight:800,color,fontVariantNumeric:"tabular-nums"}}>{val}</div></div></div>))}</div><div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 20px",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"}}><div style={{flex:1,position:"relative",minWidth:200}}><Search size={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por chamado, colaborador, equipamento..." style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px 6px 30px",color:C.text,fontFamily:C.sans,fontSize:12,outline:"none",boxSizing:"border-box"}}/></div>{filterStatus&&<button onClick={()=>setFilterStatus("")} style={{display:"flex",alignItems:"center",gap:5,background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 10px",color:C.text,fontSize:11,cursor:"pointer",fontFamily:C.sans}}><X size={11}/>Filtro: {filterStatus}</button>}<span style={{fontSize:11,color:C.muted}}>{filtered.length}/{emprestimos.length}</span><Btn small icon={<Printer size={12}/>} variant="outline" onClick={exportarEmprestimos}>CSV</Btn><Btn small icon={<Plus size={12}/>} onClick={()=>setModal("add")}>Novo Empréstimo</Btn></div><Table columns={EMP_COLS} rows={filtered} onEdit={row=>setModal(row)} onDelete={hDel} extraActions={row=>!row.devolvido&&(<Btn small icon={<RotateCcw size={11}/>} variant="outline" onClick={()=>hDevolver(row)} title="Registrar devolução">Devolver</Btn>)}/>{modal&&<Modal title={modal==="add"?"Novo Empréstimo":`Editar: ${modal.numeroChamado||"Empréstimo"}`} subtitle="Controle de empréstimo de equipamentos" onClose={()=>setModal(null)} wide><EmprestimoForm item={modal==="add"?{}:modal} onSave={hSave} onClose={()=>setModal(null)} colaboradores={colaboradores} tiposMaq={tiposMaq}/></Modal>}</div>);}

// ── RELATÓRIOS ────────────────────────────────────────────────────────────────
function ReportsModal({onClose,computers,tablets,aps,misc,setores,blocos,locais,tiposMaq,colaboradores,emprestimos}){
  const mods=[
    {id:"computers",label:"Computadores",icon:Monitor,color:C.accent,data:computers,cols:[{key:"bloco",label:"Bloco"},{key:"setor",label:"Setor"},{key:"tipoMaquina",label:"Tipo"},{key:"hostname",label:"Hostname"},{key:"mac",label:"MAC"},{key:"dominio",label:"Domínio",bool:true},{key:"endpoint",label:"Endpoint",bool:true},{key:"tipoTunel",label:"Túnel"},{key:"vlan",label:"VLAN"},{key:"switch_",label:"Switch"},{key:"serial",label:"Série"}]},
    {id:"tablets",label:"Tablets",icon:Tablet,color:C.purple,data:tablets,cols:[{key:"tipoTablet",label:"Tipo"},{key:"local",label:"Local"},{key:"modelo",label:"Modelo"},{key:"hostname",label:"Hostname"},{key:"mac",label:"MAC"},{key:"imei",label:"IMEI"},{key:"serial",label:"Série"},{key:"patrimonio",label:"Patrimônio"},{key:"dominio",label:"Domínio",bool:true}]},
    {id:"aps",label:"Access Points",icon:Wifi,color:C.success,data:aps,cols:[{key:"tipoAP",label:"Tipo"},{key:"nome",label:"Nome"},{key:"ip",label:"IP"},{key:"mac",label:"MAC"},{key:"local",label:"Local"},{key:"bloco",label:"Bloco"},{key:"switch_",label:"Switch"}]},
    {id:"misc",label:"Itens Avulsos",icon:Package,color:C.warning,data:misc,cols:[{key:"tipo",label:"Tipo"},{key:"local",label:"Local"},{key:"modelo",label:"Modelo"},{key:"serial",label:"Série"},{key:"patrimonio",label:"Patrimônio"}]},
    {id:"emprestimos",label:"Empréstimos",icon:ArrowLeftRight,color:C.orange,data:emprestimos.map(e=>({...e,_status:loanStatus(e).label})),cols:[{key:"numeroChamado",label:"Chamado"},{key:"tipoEquipamento",label:"Tipo"},{key:"identificacao",label:"Equipamento"},{key:"colaborador",label:"Colaborador"},{key:"dataEmprestimo",label:"Empréstimo"},{key:"dataPrevista",label:"Previsto"},{key:"dataDevolvido",label:"Devolvido"},{key:"_status",label:"Status"}]},
    {id:"tiposmaq",label:"Tipos de Equipamento",icon:Tag,color:C.orange,data:tiposMaq,cols:[{key:"nome",label:"Nome"},{key:"categoria",label:"Categoria"},{key:"descricao",label:"Descrição"}]},
    {id:"setores",label:"Setores",icon:Layers,color:C.teal,data:setores,cols:[{key:"nome",label:"Nome"},{key:"sigla",label:"Sigla"},{key:"descricao",label:"Descrição"}]},
    {id:"blocos",label:"Blocos",icon:Building2,color:"#f472b6",data:blocos,cols:[{key:"nome",label:"Nome"},{key:"descricao",label:"Descrição"}]},
    {id:"locais",label:"Locais / Afiliadas",icon:MapPin,color:"#fb923c",data:locais,cols:[{key:"nome",label:"Nome"},{key:"cidade",label:"Cidade"},{key:"uf",label:"UF"},{key:"tipo",label:"Tipo"}]},
    {id:"colaboradores",label:"Colaboradores",icon:Users,color:"#a78bfa",data:colaboradores,cols:[{key:"nome",label:"Nome"},{key:"matricula",label:"Matrícula"},{key:"setor",label:"Setor"},{key:"cargo",label:"Cargo"},{key:"email",label:"E-mail"},{key:"status",label:"Status"}]},
  ];
  const[sel,setSel]=useState(new Set(mods.map(m=>m.id)));
  const tgl=id=>setSel(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  return(<Modal title="Central de Relatórios" subtitle="Selecione módulos e exporte" onClose={onClose} maxWidth={700}><div style={{display:"flex",flexDirection:"column",gap:20}}><div><p style={{margin:"0 0 12px",fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>Módulos</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{mods.map(m=>{const Icon=m.icon;const on=sel.has(m.id);return(<div key={m.id} onClick={()=>tgl(m.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:on?m.color+"15":C.bg,border:`1px solid ${on?m.color+"44":C.border}`,borderRadius:8,padding:"10px 14px",cursor:"pointer",transition:"all 0.15s"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:30,height:30,background:m.color+"20",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={14} color={m.color}/></div><div><div style={{fontSize:12,fontWeight:600,color:C.text}}>{m.label}</div><div style={{fontSize:11,color:C.muted}}>{m.data.length} registros</div></div></div><div style={{width:18,height:18,borderRadius:5,background:on?m.color:"transparent",border:`2px solid ${on?m.color:C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{on&&<Check size={11} color="#fff"/>}</div></div>);})}</div></div><div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:16}}><p style={{margin:"0 0 8px",fontSize:13,fontWeight:700,color:C.text}}>📋 Relatório PDF Consolidado</p><p style={{margin:"0 0 14px",fontSize:12,color:C.muted}}>Gera documento formatado para impressão com todos os módulos selecionados.</p><Btn icon={<Printer size={14}/>} onClick={()=>{const secs=mods.filter(m=>sel.has(m.id)&&m.data.length>0).map(m=>({name:m.label,data:m.data,cols:m.cols,color:m.color}));if(!secs.length)return alert("Nenhum dado.");printHTML(buildPDF(secs,"Inventário TI"));}} disabled={sel.size===0}>Gerar PDF — {sel.size} módulo(s)</Btn></div><div><p style={{margin:"0 0 10px",fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>Exportar CSV individual</p><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{mods.map(m=>{const Icon=m.icon;return(<button key={m.id} onClick={()=>exportCSV(m.data,`inv_${m.id}_${new Date().toISOString().slice(0,10)}`,m.cols)} disabled={!m.data.length} style={{display:"inline-flex",alignItems:"center",gap:6,background:m.data.length?C.card2:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 12px",color:m.data.length?C.text:C.muted,fontSize:12,cursor:m.data.length?"pointer":"not-allowed",fontFamily:C.sans,opacity:m.data.length?1:0.5}} onMouseEnter={e=>{if(m.data.length)e.currentTarget.style.borderColor=m.color;}} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}><Icon size={12} color={m.color}/>{m.label} ({m.data.length})</button>);})}</div></div><div style={{paddingTop:8,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end"}}><Btn variant="outline" onClick={onClose}>Fechar</Btn></div></div></Modal>);}




// ── AUTENTICAÇÃO ──────────────────────────────────────────────────────────────
const DEFAULT_USER = "admin";
const DEFAULT_PASS = "admin123";

function hashSimple(str) {
  // Ofuscação simples (não criptografia real) — suficiente para acesso local
  return btoa(unescape(encodeURIComponent(str + "::inv_salt_2024")));
}

function LoginScreen({onLogin}) {
  const[user,setUser]=useState("");
  const[pass,setPass]=useState("");
  const[show,setShow]=useState(false);
  const[err,setErr]=useState("");
  const[loading,setLoading]=useState(false);

  const doLogin = async () => {
    if(!user||!pass){setErr("Preencha usuário e senha.");return;}
    setLoading(true);setErr("");
    try{
      let creds;
      try{ const r=await window.storage.get(KEYS.auth); creds=JSON.parse(r.value); }
      catch{ creds={usuario:hashSimple(DEFAULT_USER),senha:hashSimple(DEFAULT_PASS)}; }
      // Verifica admin principal
      if(hashSimple(user)===creds.usuario && hashSimple(pass)===creds.senha){
        onLogin(user); return;
      }
      // Verifica usuarios adicionais
      try{
        const ru=await window.storage.get("inv_usuarios");
        const lista=JSON.parse(ru.value);
        const found=lista.find(u=>u.hash===hashSimple(user)&&u.senhaHash===hashSimple(pass));
        if(found){onLogin(user);return;}
      }catch{}
      setErr("Usuário ou senha incorretos.");
    }catch(e){setErr("Erro ao verificar credenciais.");}
    finally{setLoading(false);}
  };

  return(
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.sans}}>
      <div style={{width:"100%",maxWidth:400,padding:"0 24px"}}>
        {/* Logo */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,marginBottom:36}}>
          <div style={{width:60,height:60,background:`linear-gradient(135deg,${C.accent},#1d4ed8)`,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 40px ${C.accent}44`}}>
            <Server size={28} color="#fff"/>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:800,color:C.text,letterSpacing:"-0.03em"}}>Inventário TI</div>
            <div style={{fontSize:12,color:C.muted,marginTop:3}}>Sistema de Gestão de Ativos</div>
          </div>
        </div>

        {/* Card */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:32,boxShadow:`0 24px 60px rgba(0,0,0,0.4)`}}>
          <h2 style={{fontSize:16,fontWeight:700,color:C.text,margin:"0 0 24px",textAlign:"center"}}>Entrar no sistema</h2>

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {/* Usuário */}
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Usuário</label>
              <input
                value={user} onChange={e=>setUser(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&doLogin()}
                placeholder="Digite seu usuário"
                autoFocus
                style={{background:C.bg,border:`1px solid ${err?C.danger:C.border}`,borderRadius:8,padding:"10px 14px",color:C.text,fontFamily:C.sans,fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"}}
                onFocus={e=>e.target.style.borderColor=C.accent}
                onBlur={e=>e.target.style.borderColor=err?C.danger:C.border}
              />
            </div>

            {/* Senha */}
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Senha</label>
              <div style={{position:"relative"}}>
                <input
                  type={show?"text":"password"}
                  value={pass} onChange={e=>setPass(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&doLogin()}
                  placeholder="Digite sua senha"
                  style={{background:C.bg,border:`1px solid ${err?C.danger:C.border}`,borderRadius:8,padding:"10px 38px 10px 14px",color:C.text,fontFamily:C.sans,fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"}}
                  onFocus={e=>e.target.style.borderColor=C.accent}
                  onBlur={e=>e.target.style.borderColor=err?C.danger:C.border}
                />
                <button onClick={()=>setShow(!show)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.muted,cursor:"pointer",display:"flex",padding:2}}>
                  {show?<EyeOffIcon size={14}/>:<EyeIcon size={14}/>}
                </button>
              </div>
            </div>

            {/* Erro */}
            {err&&<div style={{background:C.danger+"15",border:`1px solid ${C.danger}33`,borderRadius:7,padding:"8px 12px",fontSize:12,color:C.danger,display:"flex",alignItems:"center",gap:7}}><AlertTriangle size={13}/>{err}</div>}

            {/* Botão */}
            <button
              onClick={doLogin} disabled={loading}
              style={{background:`linear-gradient(135deg,${C.accent},#1d4ed8)`,border:"none",borderRadius:9,padding:"12px",color:"#fff",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:C.sans,marginTop:4,opacity:loading?0.7:1,transition:"all 0.2s",boxShadow:`0 4px 20px ${C.accent}44`}}
              onMouseEnter={e=>{if(!loading)e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
            >
              {loading?"Verificando...":"Entrar"}
            </button>
          </div>

          <div style={{marginTop:20,padding:"12px 14px",background:C.accentGlow,border:`1px solid ${C.accent}22`,borderRadius:8,fontSize:11,color:C.muted,textAlign:"center",lineHeight:1.6}}>
            Acesso padrão: <code style={{color:C.accent}}>admin</code> / <code style={{color:C.accent}}>admin123</code><br/>
            Altere em <strong style={{color:C.text}}>Configurações</strong> após entrar
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfiguracaoModal({onClose,currentUser}){
  const[tab,setTab]=useState("alterar");

  // Alterar
  const[usuario,setUsuario]=useState("");
  const[senhaAtual,setSenhaAtual]=useState("");
  const[novaSenha,setNovaSenha]=useState("");
  const[confirmar,setConfirmar]=useState("");
  const[showA,setShowA]=useState(false);
  const[showN,setShowN]=useState(false);
  const[showC,setShowC]=useState(false);

  // Novo usuário
  const[novoUser,setNovoUser]=useState("");
  const[novoPwd,setNovoPwd]=useState("");
  const[novoConf,setNovoConf]=useState("");
  const[showNP,setShowNP]=useState(false);
  const[showNC,setShowNC]=useState(false);
  const[senhaAdm,setSenhaAdm]=useState("");
  const[showSA,setShowSA]=useState(false);
  const[usuarios,setUsuarios]=useState([]);

  const[msg,setMsg]=useState(null);
  const[loading,setLoading]=useState(false);

  useEffect(()=>{
    (async()=>{
      try{ const r=await window.storage.get("inv_usuarios"); setUsuarios(JSON.parse(r.value)); }
      catch{ setUsuarios([]); }
    })();
  },[]);

  const strength=pwd=>{
    if(!pwd)return{score:0,label:"",color:C.muted};
    let s=0;
    if(pwd.length>=8)s++;if(pwd.length>=12)s++;
    if(/[A-Z]/.test(pwd))s++;if(/[0-9]/.test(pwd))s++;if(/[^A-Za-z0-9]/.test(pwd))s++;
    const lb=["","Fraca","Razoável","Boa","Forte","Muito forte"];
    const cl=[C.muted,C.danger,C.warning,C.warning,C.success,C.success];
    return{score:s,label:lb[s],color:cl[s]};
  };

  // Input de senha reutilizável usando useRef para estabilidade
  const iStyle={background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 38px 9px 14px",color:C.text,fontFamily:C.sans,fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"};
  const lStyle={fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5};
  const eyeBtn={position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.muted,cursor:"pointer",display:"flex",padding:2};

  const salvarAlteracao=async()=>{
    if(!senhaAtual){setMsg({ok:false,text:"Informe a senha atual."});return;}
    if(novaSenha&&novaSenha!==confirmar){setMsg({ok:false,text:"Nova senha e confirmação não conferem."});return;}
    if(novaSenha&&novaSenha.length<6){setMsg({ok:false,text:"Senha mínimo 6 caracteres."});return;}
    setLoading(true);setMsg(null);
    try{
      let creds;
      try{const r=await window.storage.get(KEYS.auth);creds=JSON.parse(r.value);}
      catch{creds={usuario:hashSimple(DEFAULT_USER),senha:hashSimple(DEFAULT_PASS)};}
      if(hashSimple(senhaAtual)!==creds.senha){setMsg({ok:false,text:"Senha atual incorreta."});setLoading(false);return;}
      await window.storage.set(KEYS.auth,JSON.stringify({
        usuario:usuario?hashSimple(usuario):creds.usuario,
        senha:novaSenha?hashSimple(novaSenha):creds.senha,
      }));
      setMsg({ok:true,text:"Salvo! Faça login novamente."});
      setTimeout(()=>window.location.reload(),1800);
    }catch(e){setMsg({ok:false,text:"Erro: "+e.message});}
    setLoading(false);
  };

  const salvarNovo=async()=>{
    if(!novoUser.trim()){setMsg({ok:false,text:"Informe o nome do usuário."});return;}
    if(!novoPwd||novoPwd.length<6){setMsg({ok:false,text:"Senha mínimo 6 caracteres."});return;}
    if(novoPwd!==novoConf){setMsg({ok:false,text:"Senha e confirmação não conferem."});return;}
    if(!senhaAdm){setMsg({ok:false,text:"Confirme com sua senha de admin."});return;}
    setLoading(true);setMsg(null);
    try{
      let creds;
      try{const r=await window.storage.get(KEYS.auth);creds=JSON.parse(r.value);}
      catch{creds={usuario:hashSimple(DEFAULT_USER),senha:hashSimple(DEFAULT_PASS)};}
      if(hashSimple(senhaAdm)!==creds.senha){setMsg({ok:false,text:"Senha de admin incorreta."});setLoading(false);return;}
      const lista=[...usuarios,{nome:novoUser.trim(),hash:hashSimple(novoUser.trim()),senhaHash:hashSimple(novoPwd),criadoEm:new Date().toLocaleDateString("pt-BR")}];
      await window.storage.set("inv_usuarios",JSON.stringify(lista));
      setUsuarios(lista);
      setNovoUser("");setNovoPwd("");setNovoConf("");setSenhaAdm("");
      setMsg({ok:true,text:`Usuário "${novoUser}" criado!`});
    }catch(e){setMsg({ok:false,text:"Erro: "+e.message});}
    setLoading(false);
  };

  const excluirUsuario=async(idx)=>{
    if(!confirm("Excluir este usuário?"))return;
    const lista=usuarios.filter((_,i)=>i!==idx);
    await window.storage.set("inv_usuarios",JSON.stringify(lista));
    setUsuarios(lista);
  };

  const pw=strength(novaSenha);
  const np=strength(novoPwd);

  const TabBtn=({id,label,ic:Icon})=>{
    const on=tab===id;
    return(<button type="button" onClick={()=>{setTab(id);setMsg(null);}} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",background:on?C.accent+"22":"transparent",border:`1px solid ${on?C.accent+"55":"transparent"}`,borderRadius:8,cursor:"pointer",color:on?C.accent:C.muted,fontSize:12,fontWeight:on?700:400,fontFamily:C.sans,transition:"all 0.15s"}}><Icon size={13}/>{label}</button>);
  };

  return(
    <Modal title="Configurações de Acesso" subtitle={`Logado como: ${currentUser}`} onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{display:"flex",gap:6,padding:4,background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}>
          <TabBtn id="alterar"  label="Alterar Credenciais"  ic={UserCog}/>
          <TabBtn id="novo"     label="Novo Usuário"          ic={Plus}/>
          <TabBtn id="usuarios" label="Usuários"              ic={Users}/>
        </div>

        {/* ── ALTERAR ─────────────────────────── */}
        {tab==="alterar"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:C.accentGlow,border:`1px solid ${C.accent}22`,borderRadius:8,padding:"9px 13px",fontSize:11,color:C.muted}}>Altere usuário e/ou senha. A senha atual é sempre obrigatória.</div>

          <div>
            <label style={lStyle}>Novo Usuário <span style={{fontWeight:400,textTransform:"none"}}>(em branco = manter)</span></label>
            <input value={usuario} onChange={e=>setUsuario(e.target.value)} placeholder={`atual: ${currentUser}`} style={{...iStyle,padding:"9px 14px"}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>

          <div>
            <label style={lStyle}>Nova Senha <span style={{fontWeight:400,textTransform:"none"}}>(em branco = manter)</span></label>
            <div style={{position:"relative"}}>
              <input type={showN?"text":"password"} value={novaSenha} onChange={e=>setNovaSenha(e.target.value)} placeholder="Mínimo 6 caracteres" style={iStyle} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
              <button type="button" onClick={()=>setShowN(v=>!v)} style={eyeBtn}>{showN?<EyeOffIcon size={13}/>:<EyeIcon size={13}/>}</button>
            </div>
            {novaSenha&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:5}}>
              <div style={{flex:1,height:4,background:C.border,borderRadius:2}}><div style={{width:`${(pw.score/5)*100}%`,height:"100%",background:pw.color,borderRadius:2}}/></div>
              <span style={{fontSize:10,color:pw.color,fontWeight:700}}>{pw.label}</span>
            </div>}
          </div>

          <div>
            <label style={lStyle}>Confirmar Nova Senha</label>
            <div style={{position:"relative"}}>
              <input type={showC?"text":"password"} value={confirmar} onChange={e=>setConfirmar(e.target.value)} placeholder="Repita a nova senha" style={iStyle} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
              <button type="button" onClick={()=>setShowC(v=>!v)} style={eyeBtn}>{showC?<EyeOffIcon size={13}/>:<EyeIcon size={13}/>}</button>
            </div>
          </div>

          <div style={{height:1,background:C.border}}/>

          <div>
            <label style={lStyle}>Senha Atual <span style={{color:C.danger}}>*</span></label>
            <div style={{position:"relative"}}>
              <input type={showA?"text":"password"} value={senhaAtual} onChange={e=>setSenhaAtual(e.target.value)} placeholder="Confirme com sua senha atual" style={iStyle} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
              <button type="button" onClick={()=>setShowA(v=>!v)} style={eyeBtn}>{showA?<EyeOffIcon size={13}/>:<EyeIcon size={13}/>}</button>
            </div>
          </div>

          {msg&&<div style={{background:msg.ok?C.success+"15":C.danger+"15",border:`1px solid ${msg.ok?C.success:C.danger}44`,borderRadius:8,padding:"9px 13px",fontSize:12,color:msg.ok?C.success:C.danger,fontWeight:600,display:"flex",alignItems:"center",gap:7}}>{msg.ok?<CheckCircle2 size={13}/>:<AlertTriangle size={13}/>}{msg.text}</div>}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:4,borderTop:`1px solid ${C.border}`}}>
            <Btn variant="outline" onClick={onClose}>Cancelar</Btn>
            <Btn onClick={salvarAlteracao} disabled={loading} icon={<UserCheck size={13}/>}>{loading?"Salvando...":"Salvar"}</Btn>
          </div>
        </div>}

        {/* ── NOVO USUARIO ─────────────────────── */}
        {tab==="novo"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:C.success+"12",border:`1px solid ${C.success}22`,borderRadius:8,padding:"9px 13px",fontSize:11,color:C.muted}}>Cadastre usuários adicionais com login próprio.</div>

          <div>
            <label style={lStyle}>Nome do Novo Usuário</label>
            <input value={novoUser} onChange={e=>setNovoUser(e.target.value)} placeholder="Ex: joao.silva" style={{...iStyle,padding:"9px 14px"}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>

          <div>
            <label style={lStyle}>Senha</label>
            <div style={{position:"relative"}}>
              <input type={showNP?"text":"password"} value={novoPwd} onChange={e=>setNovoPwd(e.target.value)} placeholder="Mínimo 6 caracteres" style={iStyle} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
              <button type="button" onClick={()=>setShowNP(v=>!v)} style={eyeBtn}>{showNP?<EyeOffIcon size={13}/>:<EyeIcon size={13}/>}</button>
            </div>
            {novoPwd&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:5}}>
              <div style={{flex:1,height:4,background:C.border,borderRadius:2}}><div style={{width:`${(np.score/5)*100}%`,height:"100%",background:np.color,borderRadius:2}}/></div>
              <span style={{fontSize:10,color:np.color,fontWeight:700}}>{np.label}</span>
            </div>}
          </div>

          <div>
            <label style={lStyle}>Confirmar Senha</label>
            <div style={{position:"relative"}}>
              <input type={showNC?"text":"password"} value={novoConf} onChange={e=>setNovoConf(e.target.value)} placeholder="Repita a senha" style={iStyle} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
              <button type="button" onClick={()=>setShowNC(v=>!v)} style={eyeBtn}>{showNC?<EyeOffIcon size={13}/>:<EyeIcon size={13}/>}</button>
            </div>
          </div>

          <div style={{height:1,background:C.border}}/>

          <div>
            <label style={lStyle}>Sua Senha de Admin <span style={{color:C.danger}}>*</span></label>
            <div style={{position:"relative"}}>
              <input type={showSA?"text":"password"} value={senhaAdm} onChange={e=>setSenhaAdm(e.target.value)} placeholder="Confirme com sua senha" style={iStyle} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
              <button type="button" onClick={()=>setShowSA(v=>!v)} style={eyeBtn}>{showSA?<EyeOffIcon size={13}/>:<EyeIcon size={13}/>}</button>
            </div>
          </div>

          {msg&&<div style={{background:msg.ok?C.success+"15":C.danger+"15",border:`1px solid ${msg.ok?C.success:C.danger}44`,borderRadius:8,padding:"9px 13px",fontSize:12,color:msg.ok?C.success:C.danger,fontWeight:600,display:"flex",alignItems:"center",gap:7}}>{msg.ok?<CheckCircle2 size={13}/>:<AlertTriangle size={13}/>}{msg.text}</div>}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:4,borderTop:`1px solid ${C.border}`}}>
            <Btn variant="outline" onClick={onClose}>Cancelar</Btn>
            <Btn onClick={salvarNovo} disabled={loading} icon={<Plus size={13}/>}>{loading?"Criando...":"Criar Usuário"}</Btn>
          </div>
        </div>}

        {/* ── LISTA USUARIOS ───────────────────── */}
        {tab==="usuarios"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:30,height:30,background:C.accent+"22",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}><UserCheck size={13} color={C.accent}/></div>
              <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{currentUser}</div><div style={{fontSize:10,color:C.muted}}>Administrador principal</div></div>
            </div>
            <Badge color={C.accent}>Admin</Badge>
          </div>
          {usuarios.length===0
            ?<div style={{padding:20,textAlign:"center",color:C.muted,fontSize:12,background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}>Nenhum usuário adicional cadastrado.</div>
            :usuarios.map((u,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:30,height:30,background:C.purple+"22",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}><Users size={13} color={C.purple}/></div>
                  <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{u.nome}</div><div style={{fontSize:10,color:C.muted}}>Criado em {u.criadoEm}</div></div>
                </div>
                <button type="button" onClick={()=>excluirUsuario(i)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",color:C.muted,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:4,fontFamily:C.sans}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.danger;e.currentTarget.style.color=C.danger;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}><Trash2 size={11}/>Excluir</button>
              </div>
            ))
          }
          <div style={{display:"flex",justifyContent:"flex-end",paddingTop:4,borderTop:`1px solid ${C.border}`}}>
            <Btn variant="outline" onClick={onClose}>Fechar</Btn>
          </div>
        </div>}
      </div>
    </Modal>
  );
}


function StatCard({label,value,sub,icon:Icon,color,onClick}){
  return(
    <div onClick={onClick} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 24px",display:"flex",flexDirection:"column",gap:12,cursor:onClick?"pointer":"default",transition:"all 0.2s",position:"relative",overflow:"hidden"}}
      onMouseEnter={e=>{if(onClick){e.currentTarget.style.borderColor=color;e.currentTarget.style.transform="translateY(-2px)";}}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)";}}>
      <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:color+"15"}}/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</span>
        <div style={{width:34,height:34,borderRadius:9,background:color+"20",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={15} color={color}/></div>
      </div>
      <div style={{fontSize:32,fontWeight:900,color,fontVariantNumeric:"tabular-nums",lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:C.muted}}>{sub}</div>}
    </div>
  );
}

const CHART_TOOLTIP = {
  contentStyle:{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,color:C.text},
  cursor:{fill:C.accentGlow}
};

function DashboardTab({computers,tablets,aps,misc,emprestimos,setores,locais,tiposMaq,setActive}){
  const hoje = today();
  const totalEq = computers.length+tablets.length+aps.length+misc.length;
  const empAbertos = emprestimos.filter(e=>!e.devolvido&&(!e.dataPrevista||hoje<=e.dataPrevista)).length;
  const empAtrasados = emprestimos.filter(e=>!e.devolvido&&e.dataPrevista&&hoje>e.dataPrevista).length;
  const empDevolvidos = emprestimos.filter(e=>e.devolvido).length;

  // Equipamentos por categoria
  const catData = [
    {name:"Computadores", value:computers.length, color:C.accent},
    {name:"Tablets",      value:tablets.length,   color:C.purple},
    {name:"Access Points",value:aps.length,        color:C.success},
    {name:"Itens Avulsos",value:misc.length,        color:C.warning},
  ].filter(d=>d.value>0);

  // Empréstimos por status
  const empStatusData = [
    {name:"Em Aberto",  value:empAbertos,   color:C.warning},
    {name:"Atrasados",  value:empAtrasados, color:C.danger},
    {name:"Devolvidos", value:empDevolvidos,color:C.success},
  ].filter(d=>d.value>0);

  // Computadores por setor
  const setorMap = {};
  computers.forEach(c=>{if(c.setor){setorMap[c.setor]=(setorMap[c.setor]||0)+1;}});
  const setorData = Object.entries(setorMap).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,8);

  // Computadores por tipo
  const tipoMap = {};
  computers.forEach(c=>{if(c.tipoMaquina){tipoMap[c.tipoMaquina]=(tipoMap[c.tipoMaquina]||0)+1;}});
  tablets.forEach(c=>{if(c.tipoTablet){tipoMap[c.tipoTablet]=(tipoMap[c.tipoTablet]||0)+1;}});
  misc.forEach(c=>{if(c.tipo){tipoMap[c.tipo]=(tipoMap[c.tipo]||0)+1;}});
  const tipoData = Object.entries(tipoMap).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,10);

  // Empréstimos por mês (últimos 6 meses)
  const mesMap = {};
  const now = new Date();
  for(let i=5;i>=0;i--){
    const d=new Date(now.getFullYear(),now.getMonth()-i,1);
    const k=d.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"});
    mesMap[k]={mes:k,emprestados:0,devolvidos:0};
  }
  emprestimos.forEach(e=>{
    if(!e.dataEmprestimo)return;
    const d=new Date(e.dataEmprestimo+"T12:00:00");
    const k=d.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"});
    if(mesMap[k]){mesMap[k].emprestados++; if(e.devolvido)mesMap[k].devolvidos++;}
  });
  const mesData = Object.values(mesMap);

  // Domínio / Endpoint stats
  const totalComp = computers.length||1;
  const domPct = Math.round(computers.filter(c=>c.dominio).length/totalComp*100);
  const epPct  = Math.round(computers.filter(c=>c.endpoint).length/totalComp*100);
  const wifiPct= Math.round(computers.filter(c=>c.conectividade==="Wi-Fi").length/totalComp*100);

  // APs por local
  const apLocalMap = {};
  aps.forEach(a=>{if(a.local){apLocalMap[a.local]=(apLocalMap[a.local]||0)+1;}});
  const apLocalData = Object.entries(apLocalMap).map(([name,value])=>({name,value})).slice(0,6);

  const radialData = [
    {name:"Domínio",   value:domPct, fill:C.accent},
    {name:"Endpoint",  value:epPct,  fill:C.success},
    {name:"Wi-Fi",     value:wifiPct,fill:C.purple},
  ];

  const Section = ({title,icon:Icon,color,children})=>(
    <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 20px",borderBottom:`1px solid ${C.border}`,background:color+"08"}}>
        <div style={{width:28,height:28,background:color+"22",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={13} color={color}/></div>
        <span style={{fontSize:13,fontWeight:700,color:C.text}}>{title}</span>
      </div>
      <div style={{padding:20}}>{children}</div>
    </div>
  );

  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:24}}>

      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
        <StatCard label="Total de Equipamentos" value={totalEq} sub={`${computers.length} comp · ${tablets.length} tab · ${aps.length} APs`} icon={Monitor} color={C.accent} onClick={()=>setActive("equipamentos")}/>
        <StatCard label="Empréstimos Ativos"    value={empAbertos}   sub="em aberto no momento"       icon={ArrowLeftRight} color={C.warning}/>
        <StatCard label="Empréstimos Atrasados" value={empAtrasados} sub="passaram da data prevista"  icon={AlertTriangle}  color={C.danger}/>
        <StatCard label="Total Emprestado"      value={emprestimos.length} sub={`${empDevolvidos} devolvidos`} icon={Clock} color={C.orange}/>
        <StatCard label="Tipos Cadastrados"     value={tiposMaq.length} sub="tipos de equipamento"    icon={Tag}            color={C.purple}/>
        <StatCard label="Access Points"         value={aps.length}   sub="pontos de acesso"           icon={Wifi}           color={C.success}/>
      </div>

      {/* Linha 1: Pizza categorias + Status empréstimos + Linha tempo */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr",gap:16}}>

        <Section title="Equipamentos por Categoria" icon={PieIcon} color={C.accent}>
          {catData.length===0
            ?<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200,color:C.muted,fontSize:12}}>Sem dados</div>
            :<><ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {catData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip {...CHART_TOOLTIP} formatter={(v,n)=>[v,n]}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
              {catData.map(d=>(
                <div key={d.name} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.muted}}>
                  <div style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}}/>
                  {d.name} <span style={{color:d.color,fontWeight:700}}>{d.value}</span>
                </div>
              ))}
            </div></>
          }
        </Section>

        <Section title="Status dos Empréstimos" icon={ArrowLeftRight} color={C.orange}>
          {empStatusData.length===0
            ?<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200,color:C.muted,fontSize:12}}>Sem empréstimos</div>
            :<><ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={empStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {empStatusData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip {...CHART_TOOLTIP}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
              {empStatusData.map(d=>(
                <div key={d.name} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.muted}}>
                  <div style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}}/>
                  {d.name} <span style={{color:d.color,fontWeight:700}}>{d.value}</span>
                </div>
              ))}
            </div></>
          }
        </Section>

        <Section title="Empréstimos — Últimos 6 Meses" icon={TrendingUp} color={C.teal}>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={mesData} margin={{top:5,right:10,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="gEmp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.orange} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={C.orange} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gDev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.success} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={C.success} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="mes" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <Tooltip {...CHART_TOOLTIP}/>
              <Legend wrapperStyle={{fontSize:11,color:C.muted}}/>
              <Area type="monotone" dataKey="emprestados" name="Emprestados" stroke={C.orange} fill="url(#gEmp)" strokeWidth={2} dot={{fill:C.orange,r:3}}/>
              <Area type="monotone" dataKey="devolvidos"  name="Devolvidos"  stroke={C.success} fill="url(#gDev)" strokeWidth={2} dot={{fill:C.success,r:3}}/>
            </AreaChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* Linha 2: Barras por setor + Tipos */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>

        <Section title="Computadores por Setor" icon={Building2} color={C.accent}>
          {setorData.length===0
            ?<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200,color:C.muted,fontSize:12}}>Sem dados por setor</div>
            :<ResponsiveContainer width="100%" height={220}>
              <BarChart data={setorData} layout="vertical" margin={{top:0,right:20,left:10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
                <XAxis type="number" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
                <YAxis type="category" dataKey="name" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} width={80}/>
                <Tooltip {...CHART_TOOLTIP}/>
                <Bar dataKey="value" name="Computadores" radius={[0,4,4,0]}>
                  {setorData.map((_,i)=><Cell key={i} fill={`hsl(${210+i*25},70%,${50+i*3}%)`}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          }
        </Section>

        <Section title="Equipamentos por Tipo" icon={Layers} color={C.purple}>
          {tipoData.length===0
            ?<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200,color:C.muted,fontSize:12}}>Sem dados por tipo</div>
            :<ResponsiveContainer width="100%" height={220}>
              <BarChart data={tipoData} layout="vertical" margin={{top:0,right:20,left:10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
                <XAxis type="number" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
                <YAxis type="category" dataKey="name" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} width={90}/>
                <Tooltip {...CHART_TOOLTIP}/>
                <Bar dataKey="value" name="Qtd" radius={[0,4,4,0]}>
                  {tipoData.map((_,i)=><Cell key={i} fill={`hsl(${270+i*20},65%,${50+i*2}%)`}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          }
        </Section>
      </div>

      {/* Linha 3: Radial compliance + APs por local */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>

        <Section title="Conformidade dos Computadores" icon={Activity} color={C.success}>
          <div style={{display:"flex",alignItems:"center",gap:24}}>
            <ResponsiveContainer width={180} height={180}>
              <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={80} data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar background={{fill:C.dim}} dataKey="value" cornerRadius={6} label={false}/>
                <Tooltip {...CHART_TOOLTIP} formatter={(v)=>[v+"%"]}/>
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexDirection:"column",gap:14,flex:1}}>
              {radialData.map(d=>(
                <div key={d.name}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:12,color:C.muted}}>{d.name}</span>
                    <span style={{fontSize:13,fontWeight:700,color:d.fill}}>{d.value}%</span>
                  </div>
                  <div style={{height:6,background:C.dim,borderRadius:3}}>
                    <div style={{height:"100%",width:d.value+"%",background:d.fill,borderRadius:3,transition:"width 0.8s ease"}}/>
                  </div>
                </div>
              ))}
              <div style={{fontSize:11,color:C.muted,marginTop:4}}>Base: {computers.length} computadores</div>
            </div>
          </div>
        </Section>

        <Section title="Access Points por Local" icon={Wifi} color={C.success}>
          {apLocalData.length===0
            ?<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:180,color:C.muted,fontSize:12}}>Sem APs cadastrados</div>
            :<ResponsiveContainer width="100%" height={200}>
              <BarChart data={apLocalData} margin={{top:5,right:10,left:-20,bottom:30}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                <XAxis dataKey="name" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} angle={-20} textAnchor="end"/>
                <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
                <Tooltip {...CHART_TOOLTIP}/>
                <Bar dataKey="value" name="APs" fill={C.success} radius={[4,4,0,0]}>
                  {apLocalData.map((_,i)=><Cell key={i} fill={`hsl(${152+i*15},60%,${42+i*4}%)`}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          }
        </Section>
      </div>

      {/* Linha 4: Resumo rápido por VLAN */}
      {(() => {
        const vlanMap = {};
        computers.forEach(c=>{if(c.vlan)vlanMap[c.vlan]=(vlanMap[c.vlan]||0)+1;});
        const vlanData = Object.entries(vlanMap).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
        if(vlanData.length===0)return null;
        return(
          <Section title="Distribuição por VLAN" icon={Zap} color={C.teal}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={vlanData} margin={{top:5,right:10,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                <XAxis dataKey="name" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
                <Tooltip {...CHART_TOOLTIP}/>
                <Bar dataKey="value" name="Computadores" fill={C.teal} radius={[4,4,0,0]}>
                  {vlanData.map((_,i)=><Cell key={i} fill={`hsl(${174+i*20},55%,${42+i*5}%)`}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Section>
        );
      })()}

    </div>
  );
}

// ── BACKUP / RESTAURAÇÃO ──────────────────────────────────────────────────────
function BackupModal({onClose}){
  const[restoring,setRestoring]=useState(false);
  const[msg,setMsg]=useState(null);

  const doBackup=()=>{window.open('/api/backup','_blank');};

  const doRestore=async(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    setRestoring(true);setMsg(null);
    try{
      const text=await file.text();
      const data=JSON.parse(text);
      const r=await fetch('/api/restore',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
      });
      const res=await r.json();
      setMsg({ok:true,text:`${res.restored} registros restaurados! Recarregando...`});
      setTimeout(()=>window.location.reload(),1500);
    }catch(err){
      setMsg({ok:false,text:'Erro: arquivo inválido ou corrompido.'});
    }finally{setRestoring(false);}
  };

  return(
    <Modal title="Backup & Restauração" subtitle="Dados salvos em inventario-dados.json" onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {/* Backup */}
        <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:36,height:36,background:C.accent+"22",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><Download size={16} color={C.accent}/></div>
            <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>Exportar Backup</div><div style={{fontSize:11,color:C.muted}}>Baixa todos os dados em formato JSON</div></div>
          </div>
          <Btn icon={<Download size={13}/>} onClick={doBackup} full>Baixar backup (.json)</Btn>
        </div>

        {/* Restaurar */}
        <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:36,height:36,background:C.warning+"22",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><Upload size={16} color={C.warning}/></div>
            <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>Restaurar Backup</div><div style={{fontSize:11,color:C.muted}}>Importa dados de um arquivo .json</div></div>
          </div>
          <div style={{background:C.warning+"12",border:`1px solid ${C.warning}33`,borderRadius:7,padding:"8px 12px",fontSize:11,color:C.warning,marginBottom:12,display:"flex",gap:8,alignItems:"flex-start"}}>
            <AlertTriangle size={13} style={{flexShrink:0,marginTop:1}}/><span>Os dados atuais serão <strong>mesclados</strong> com os do backup. Registros com a mesma chave serão sobrescritos.</span>
          </div>
          <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:C.card,border:`1px dashed ${C.border}`,borderRadius:8,padding:"14px 20px",cursor:"pointer",color:C.muted,fontSize:13,transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.warning;e.currentTarget.style.color=C.warning;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}>
            <Upload size={14}/>{restoring?"Restaurando...":"Selecionar arquivo .json"}
            <input type="file" accept=".json" onChange={doRestore} style={{display:"none"}} disabled={restoring}/>
          </label>
        </div>

        {/* Info */}
        <div style={{background:C.accentGlow,border:`1px solid ${C.accent}33`,borderRadius:8,padding:"10px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
          <HardDrive size={13} color={C.accent} style={{flexShrink:0,marginTop:1}}/>
          <span style={{fontSize:11,color:C.muted,lineHeight:1.6}}>Os dados são salvos <strong style={{color:C.text}}>automaticamente</strong> a cada ação. O arquivo <code style={{color:C.accent,fontFamily:"monospace"}}>inventario-dados.json</code> fica na pasta do servidor.</span>
        </div>

        {msg&&<div style={{background:msg.ok?C.success+"15":C.danger+"15",border:`1px solid ${msg.ok?C.success:C.danger}44`,borderRadius:8,padding:"10px 14px",fontSize:12,color:msg.ok?C.success:C.danger,fontWeight:600}}>{msg.text}</div>}

        <div style={{display:"flex",justifyContent:"flex-end",paddingTop:4,borderTop:`1px solid ${C.border}`}}><Btn variant="outline" onClick={onClose}>Fechar</Btn></div>
      </div>
    </Modal>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
const TABS=[
  {id:"dashboard",    label:"Dashboard",         icon:BarChart3,     color:C.teal},
  {id:"equipamentos", label:"Equipamentos",      icon:Monitor,       color:C.accent},
  {id:"emprestimos",  label:"Empréstimos",       icon:ArrowLeftRight,color:C.orange},
  {id:"cadastros",    label:"Cadastros",          icon:BookOpen,      color:"#fb923c"},
  {id:"senhas",       label:"Cofre de Senhas",   icon:Shield,        color:"#f472b6"},
];

export default function App(){
  const[active,setActive]=useState("dashboard");
  const[computers,setComputers]=useState([]);const[tablets,setTablets]=useState([]);const[aps,setAps]=useState([]);const[misc,setMisc]=useState([]);
  const[vlans,setVlans]=useState(["Administrativa","Laboratório"]);
  const[setores,setSetores]=useState([]);const[blocos,setBlocos]=useState([]);const[locais,setLocais]=useState([]);const[tiposMaq,setTiposMaq]=useState([]);const[colaboradores,setColaboradores]=useState([]);const[senhas,setSenhas]=useState([]);const[emprestimos,setEmprestimos]=useState([]);
  const[loaded,setLoaded]=useState(false);const[showReports,setShowReports]=useState(false);const[showBackup,setShowBackup]=useState(false);const[loggedIn,setLoggedIn]=useState(false);const[currentUser,setCurrentUser]=useState("");const[showConfig,setShowConfig]=useState(false);

  useEffect(()=>{(async()=>{const[c,t,a,m,v,st,bl,lo,tm,co,se,em]=await Promise.all([load(KEYS.computers,SC),load(KEYS.tablets,[]),load(KEYS.aps,[]),load(KEYS.misc,[]),load(KEYS.vlans,["Administrativa","Laboratório"]),load(KEYS.setores,SS),load(KEYS.blocos,SB),load(KEYS.locais,SL),load(KEYS.tiposMaq,STM),load(KEYS.colaboradores,[]),load(KEYS.senhas,[]),load(KEYS.emprestimos,[])]);setComputers(c);setTablets(t);setAps(a);setMisc(m);setVlans(v);setSetores(st);setBlocos(bl);setLocais(lo);setTiposMaq(tm);setColaboradores(co);setSenhas(se);setEmprestimos(em);setLoaded(true);})();},[]);

  const addVlan=useCallback(v=>{const u=[...new Set([...vlans,v])];setVlans(u);save(KEYS.vlans,u);},[vlans]);
  const empAtrasados=emprestimos.filter(e=>!e.devolvido&&e.dataPrevista&&today()>e.dataPrevista).length;
  const empAbertos=emprestimos.filter(e=>!e.devolvido&&(!e.dataPrevista||today()<=e.dataPrevista)).length;
  const totalEq=computers.length+tablets.length+aps.length+misc.length;

  const stats=[
    {label:"Equipamentos",count:totalEq,icon:Monitor,color:C.accent,sub:`${computers.length} comp · ${tablets.length} tab · ${aps.length} APs · ${misc.length} avulsos`,subColor:C.muted},
    {label:"Empréstimos",count:emprestimos.length,icon:ArrowLeftRight,color:C.orange,sub:empAtrasados>0?`${empAtrasados} atrasado(s)`:empAbertos>0?`${empAbertos} em aberto`:null,subColor:empAtrasados>0?C.danger:C.warning},
    {label:"Colaboradores",count:colaboradores.length,icon:Users,color:C.teal},
    {label:"Tipos Cadastrados",count:tiposMaq.length,icon:Tag,color:C.purple},
  ];

  if(!loaded)return(<div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.sans}}><div style={{color:C.muted,display:"flex",flexDirection:"column",alignItems:"center",gap:14}}><div style={{width:36,height:36,border:`3px solid ${C.border}`,borderTopColor:C.accent,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><span style={{fontSize:13}}>Carregando inventário...</span></div></div>);
  if(!loggedIn)return <LoginScreen onLogin={u=>{setLoggedIn(true);setCurrentUser(u);}}/>;

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:C.sans,color:C.text}}>
      <style>{`*{box-sizing:border-box;margin:0;}@keyframes spin{to{transform:rotate(360deg);}}::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:${C.bg};}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}select option{background:${C.card};color:${C.text};}`}</style>
      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1500,margin:"0 auto",padding:"0 24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,background:`linear-gradient(135deg,${C.accent},#1d4ed8)`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 20px ${C.accent}44`}}><Server size={18} color="#fff"/></div>
              <div><div style={{fontSize:15,fontWeight:800,color:C.text,letterSpacing:"-0.03em"}}>Inventário TI</div><div style={{fontSize:10,color:C.muted,fontFamily:C.mono}}>Sistema de Gestão de Ativos</div></div>
            </div>
            <button onClick={()=>setShowReports(true)} style={{display:"inline-flex",alignItems:"center",gap:8,background:`linear-gradient(135deg,${C.accent}22,${C.purple}22)`,border:`1px solid ${C.accent}55`,borderRadius:8,padding:"8px 18px",color:C.text,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:C.sans,transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${C.accent}44,${C.purple}44)`;e.currentTarget.style.boxShadow=`0 0 20px ${C.accent}33`;}} onMouseLeave={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${C.accent}22,${C.purple}22)`;e.currentTarget.style.boxShadow="none";}}>
              <BarChart3 size={15} color={C.accent}/>Relatórios &amp; Exportação
            </button>
            <button onClick={()=>setShowBackup(true)} style={{display:"inline-flex",alignItems:"center",gap:8,background:C.success+"22",border:`1px solid ${C.success}55`,borderRadius:8,padding:"8px 18px",color:C.text,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:C.sans,transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background=C.success+"44";}} onMouseLeave={e=>{e.currentTarget.style.background=C.success+"22";}}><HardDrive size={15} color={C.success}/>Backup &amp; Restauração</button>
            <button onClick={()=>setShowConfig(true)} style={{display:"inline-flex",alignItems:"center",gap:8,background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 14px",color:C.muted,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:C.sans,transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.text;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}><UserCog size={14}/>{currentUser}</button>
            <button onClick={()=>{setLoggedIn(false);setCurrentUser("");}} style={{display:"inline-flex",alignItems:"center",gap:6,background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:C.sans,transition:"all 0.2s"}} title="Sair" onMouseEnter={e=>{e.currentTarget.style.borderColor=C.danger;e.currentTarget.style.color=C.danger;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}><LogOut size={13}/>Sair</button>
          </div>
          <div style={{display:"flex",gap:10,paddingBottom:14,flexWrap:"wrap"}}>
            {stats.map(({label,count,icon:Icon,color,sub,subColor})=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:color+"12",border:`1px solid ${color}28`,borderRadius:7}}>
                <Icon size={12} color={color}/><span style={{fontSize:11,color:C.muted}}>{label}</span>
                <span style={{fontSize:14,fontWeight:800,color,fontVariantNumeric:"tabular-nums"}}>{count}</span>
                {sub&&<span style={{fontSize:10,fontWeight:600,color:subColor||C.muted}}>{sub}</span>}
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.border}`,marginLeft:-24,marginRight:-24,paddingLeft:24,overflowX:"auto"}}>
            {TABS.map(({id,label,icon:Icon,color})=>{
              const on=active===id;
              const isAtrasado=id==="emprestimos"&&empAtrasados>0;
              return(<button key={id} onClick={()=>setActive(id)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 18px",background:"none",border:"none",cursor:"pointer",color:on?color:C.muted,fontSize:12,fontWeight:on?700:400,borderBottom:`2px solid ${on?color:"transparent"}`,fontFamily:C.sans,transition:"all 0.15s",whiteSpace:"nowrap",flexShrink:0}}>
                <Icon size={13}/>{label}
                {isAtrasado&&<span style={{background:C.danger+"30",color:C.danger,border:`1px solid ${C.danger}44`,borderRadius:4,padding:"0 5px",fontSize:9,fontWeight:800}}>{empAtrasados}</span>}
                {id==="senhas"&&<span style={{background:"#f472b630",color:"#f472b6",border:"1px solid #f472b644",borderRadius:4,padding:"0 5px",fontSize:9,fontWeight:800}}>SEGURO</span>}
              </button>);
            })}
          </div>
        </div>
      </div>
      <div style={{maxWidth:1500,margin:"0 auto",padding:"24px"}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          {active==="dashboard"&&<DashboardTab computers={computers} tablets={tablets} aps={aps} misc={misc} emprestimos={emprestimos} setores={setores} locais={locais} tiposMaq={tiposMaq} setActive={setActive}/>}
          {active==="equipamentos"&&<EquipamentosTab computers={computers} setComputers={setComputers} tablets={tablets} setTablets={setTablets} aps={aps} setAps={setAps} misc={misc} setMisc={setMisc} vlans={vlans} addVlan={addVlan} blocos={blocos} setores={setores} locais={locais} tiposMaq={tiposMaq}/>}
          {active==="emprestimos"&&<EmprestimosTab emprestimos={emprestimos} setEmprestimos={v=>{setEmprestimos(v);save(KEYS.emprestimos,v);}} colaboradores={colaboradores} tiposMaq={tiposMaq}/>}
          {active==="cadastros"&&<CadastrosTab setores={setores} setSetores={setSetores} blocos={blocos} setBlocos={setBlocos} locais={locais} setLocais={setLocais} tiposMaq={tiposMaq} setTiposMaq={setTiposMaq} colaboradores={colaboradores} setColaboradores={setColaboradores}/>}
          {active==="senhas"&&<SenhasTab senhas={senhas} setSenhas={setSenhas}/>}
        </div>
      </div>
      {showBackup&&<BackupModal onClose={()=>setShowBackup(false)}/>}
      {showConfig&&<ConfiguracaoModal onClose={()=>setShowConfig(false)} currentUser={currentUser}/>}
      {showReports&&<ReportsModal onClose={()=>setShowReports(false)} computers={computers} tablets={tablets} aps={aps} misc={misc} setores={setores} blocos={blocos} locais={locais} tiposMaq={tiposMaq} colaboradores={colaboradores} emprestimos={emprestimos}/>}
    </div>
  );
}
