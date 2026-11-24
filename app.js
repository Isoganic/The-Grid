const styles = [
  {id:'geometric', name:'Bold geometric', title:'Desert in motion', location:'FCP Euro · Commercial', type:['commercial'], tag:'Painted project', image:'fcp-detail.webp', detail:'fcp-hero.webp', alt:'Angular sunset desert and off-road vehicles painted in bold solid colors for FCP Euro', description:'Sharp forms, dramatic contrast and graphic shapes that carry across large walls.', long:'The FCP Euro warehouse mural brings automotive culture into a stylized Arizona desert. The bold block-color approach works especially well for large feature walls, storefronts and branded interiors.', palette:['#1f729f','#efca66','#a63e36','#e8ab57','#2d2035','#292638']},
  {id:'lettering', name:'Local lettering', title:'Gilbert, Arizona', location:'Backyard · Residential', type:['residential','commercial'], tag:'Painted detail', image:'gilbert.webp', detail:'gilbert-wall.webp', alt:'Hand-painted block lettering with a windmill, blue sky and Arizona flag colors on a textured exterior wall', description:'Graphic letterforms filled with the local details that make a place unique.', long:'Inspired by the town’s landmarks, farmland, and Arizona colors, this backyard lettering mural tells a local story one letter at a time. The photograph shows the work during painting.', palette:['#43a6c6','#f2cb47','#bd5839','#ef8a2c','#233647','#293a4a']},
  {id:'immersive', name:'Immersive scenes', title:'Saguaro Circuit', location:'Living space · Residential', type:['residential'], tag:'Painted project', image:'racing.webp', detail:'racing-wide.webp', alt:'Hand-painted desert racing mural around a living room with saguaros and racing karts', description:'Playful, room-scale environments that wrap around corners and architecture.', long:'A three-wall Arizona racing-themed room, designed around the existing windows, television, and doorway. Immersive murals can turn a game room, child’s space or living room into a world of its own.', palette:['#3e9bcb','#f8d343','#ab534f','#f3a625','#423438','#546b32']},
  {id:'community', name:'Community & brand', title:'Sugar Land', location:'Music & arts festival · Texas', type:['commercial'], tag:'Live painting', image:'festival.webp', detail:'festival.webp', alt:'In-progress hand-painted Sugar Land festival panel with Texas flag, water tower, microphone, bird and flowing blue shapes', description:'A story of place, music and community told through distinctive symbols.', long:'A live-painted panel for a Sugar Land music and arts festival brings together Texas iconography, a local water tower, music and native plants. This is a progress photograph from the live event.', palette:['#224e9e','#edb044','#d5493a','#417fc2','#182d53','#386944']},
  {id:'landscape', name:'Calm desert landscape', title:'Quiet horizon', location:'Church lobby · Design study', type:['residential','commercial'], tag:'Design study', image:'desert-study.webp', detail:'desert-study.webp', alt:'Design study of a calm blue sky, angular rust mountains and layered desert terrain with saguaros', description:'Layered mountains, warm desert tones and an open, tranquil horizon.', long:'This church-lobby concept explores a softer side of the desert: simplified mountain planes, open sky and warm color blocks. The study illustrates a direction for a peaceful home, hospitality or community space; it is not a photograph of finished work.', palette:['#86aabd','#eed8a9','#b86c48','#d88b58','#a96c48','#4e5330']},
  {id:'botanical', name:'Desert botanical', title:'Sonoran shapes', location:'Home accent wall · Design study', type:['residential','commercial'], tag:'Design study', image:'botanical-study.webp', detail:'botanical-study.webp', alt:'Warm desert botanical mural design study surrounding a wall mirror, with saguaro and earthy-toned flowers', description:'Stylized cacti and botanical forms in a restrained, natural palette.', long:'A small-scale design study for a home accent wall. Natural colors, clean plant shapes and the existing architecture inspire a more intimate visual direction.', palette:['#efe3cb','#b96d42','#ad7752','#d3ad8f','#b08b69','#4e533b']},
];
const budgets=['Under $750','$750–$1,500','$1,500–$3,000','$3,000–$6,000','$6,000–$10,000','$10,000+','Not sure yet'];
const form=document.getElementById('project-form');
const gallery=document.getElementById('gallery');
const styleOptions=document.getElementById('style-options');
const budgetOptions=document.getElementById('budget-options');
const dialog=document.getElementById('project-dialog');
const copyStatus=document.getElementById('copy-status');
const manualCopy=document.getElementById('manual-copy');
let activeFilter='all', selectedStyle='open', dialogStyle=null, attempted=false;

function renderGallery(){
  const visible=styles.filter(s=>activeFilter==='all'||s.type.includes(activeFilter));
  gallery.innerHTML=visible.map(s=>`<article class="gallery-card"><button class="card-image-button" type="button" data-details="${s.id}" aria-label="View ${s.title} project details"><img src="assets/${s.image}" alt="${s.alt}" loading="lazy" width="1000" height="650"><span class="card-tag">${s.tag}</span><span class="zoom" aria-hidden="true">+</span></button><div class="card-copy"><span class="card-kicker">${s.location}</span><h3>${s.title}</h3><p>${s.description}</p><div class="card-bottom"><span class="swatches" aria-label="Example color palette">${s.palette.slice(0,4).map(c=>`<i style="background:${c}"></i>`).join('')}</span><button class="card-use" type="button" data-use="${s.id}" aria-pressed="${selectedStyle===s.id}">${selectedStyle===s.id?'Selected ✓':'Use this style'}</button></div></div></article>`).join('');
  document.getElementById('gallery-count').textContent=`${visible.length} style direction${visible.length===1?'':'s'}`;
}

function renderStyleOptions(){
  styleOptions.innerHTML=`<button type="button" class="style-choice" data-style="open" aria-pressed="true">Open to ideas</button>`+styles.map(s=>`<button type="button" class="style-choice" data-style="${s.id}" aria-pressed="false"><img src="assets/${s.image}" alt="" width="24" height="24" loading="lazy">${s.name}</button>`).join('');
}
function renderBudgets(){
  budgetOptions.innerHTML=budgets.map((b,i)=>`<label class="budget-option"><input type="radio" name="budget" value="${b}" ${i===0?'required':''}><span>${b}</span><span class="radio-mark"></span></label>`).join('');
}
function selectStyle(id,scroll=false){
  selectedStyle=id;
  for(const b of styleOptions.querySelectorAll('[data-style]')) b.setAttribute('aria-pressed',String(b.dataset.style===id));
  for(const b of gallery.querySelectorAll('[data-use]')){const selected=b.dataset.use===id;b.setAttribute('aria-pressed',String(selected));b.textContent=selected?'Selected ✓':'Use this style';}
  update();
  if(scroll){document.getElementById('brief').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
}
function getData(){
  const d=new FormData(form);
  return {type:d.get('type')||'',location:(d.get('location')||'').trim(),setting:d.get('setting'),style:styles.find(s=>s.id===selectedStyle),width:form.elements.width.value,height:form.elements.height.value,unknown:form.elements.unknownSize.checked,budget:d.get('budget')||'',timing:d.get('timing'),notes:(d.get('notes')||'').trim()};
}
function sizeInfo(d){
  if(d.unknown) return {valid:true,label:'Not measured yet',area:null};
  const width=Number(d.width),height=Number(d.height);
  if(!d.width&&!d.height) return {valid:false,label:'Not measured yet',area:null};
  if(!d.width||!d.height||!Number.isFinite(width)||!Number.isFinite(height)||width<0.1||height<0.1||width>2000||height>2000) return {valid:false,label:'Enter both dimensions',area:null};
  const area=Math.round(width*height*10)/10;
  return {valid:true,label:`${width} × ${height} ft`,area,ratio:width/height};
}
function addSummaryRow(root,label,value,placeholder){
  const div=document.createElement('div'); div.className='summary-row';
  const dt=document.createElement('dt');dt.textContent=label;
  const dd=document.createElement('dd');dd.textContent=value||placeholder||'Not specified';if(!value)dd.className='empty';
  div.append(dt,dd); root.append(div);
}
function update(){
  const d=getData(),size=sizeInfo(d);
  form.elements.width.disabled=d.unknown;form.elements.height.disabled=d.unknown;
  const summary=document.getElementById('brief-summary'); summary.replaceChildren();
  addSummaryRow(summary,'Project type',d.type,'Choose a type');
  addSummaryRow(summary,'Style',d.style?.name||'Open to ideas');
  addSummaryRow(summary,'Dimensions',size.area!==null?`${size.label} · ${size.area.toLocaleString('en-US')} sq ft`:d.unknown?'Not measured yet':'',size.label);
  addSummaryRow(summary,'Budget',d.budget,'Choose a range');
  addSummaryRow(summary,'Location',d.location,'Not specified');
  addSummaryRow(summary,'Setting',d.setting==='Not sure yet'?'':d.setting,'Not sure yet');
  if(d.timing!=='Flexible / not decided')addSummaryRow(summary,'Timing',d.timing);
  if(d.notes)addSummaryRow(summary,'Vision',d.notes.length>110?d.notes.slice(0,110)+'…':d.notes);
  document.getElementById('wall-dim-label').textContent=size.area!==null?size.label:'Wall dimensions';
  document.getElementById('area-label').textContent=size.area!==null?`${size.area.toLocaleString('en-US')} sq ft`:'Not measured';
  const wall=document.getElementById('wall-box');
  const ratio=size.ratio||1.9,maxW=Math.min(290,wall.parentElement.clientWidth-26),maxH=146;
  const w=Math.max(18,Math.min(maxW,maxH*ratio)),h=Math.max(18,Math.min(maxH,maxW/ratio));
  wall.style.width=`${w}px`;wall.style.height=`${h}px`;
  const palette=d.style?.palette||styles[4].palette;
  ['sky','sun','mountain','ground','front','cactus'].forEach((v,i)=>wall.style.setProperty(`--wall-${v}`,palette[i]));
  const ready=!!d.type&&!!d.budget&&size.valid;
  const progress=document.getElementById('brief-progress');progress.classList.toggle('ready',ready);
  document.getElementById('progress-label').textContent=ready?'Ready to copy':!d.type?'Choose a project type':!size.valid?'Add wall dimensions or mark unmeasured':'Choose a budget range';
  if(attempted) showErrors(d,size);
  copyStatus.textContent='';copyStatus.classList.remove('error');manualCopy.hidden=true;
}
function showErrors(d,size){
  document.getElementById('type-error').hidden=!!d.type;
  document.getElementById('dimensions-error').hidden=size.valid;
  document.getElementById('budget-error').hidden=!!d.budget;
  form.elements.width.setAttribute('aria-invalid',String(!size.valid));form.elements.height.setAttribute('aria-invalid',String(!size.valid));
}
function makeBrief(d,size){
  const lines=['Hi Tyler! I’m interested in a custom ISOGANIC mural.',`Project: ${d.type}`,`Location: ${d.location||'To be confirmed'}`,`Wall setting: ${d.setting}`,`Style: ${d.style?`${d.style.name} (inspired by ${d.style.title})`:'Open to ideas'}`,`Approx. dimensions: ${size.area!==null?`${size.label} (${size.area.toLocaleString('en-US')} sq ft)`:'Not measured yet'}`,`Budget: ${d.budget}`,`Timing: ${d.timing}`];
  if(d.notes)lines.push(`Vision / details: ${d.notes}`);
  lines.push('I can send wall photos and discuss the design and quote.');return lines.join('\n');
}
async function copyBrief(){
  const d=getData(),size=sizeInfo(d);attempted=true;showErrors(d,size);
  if(!d.type||!size.valid||!d.budget){
    copyStatus.textContent='Please complete the highlighted information first.';copyStatus.classList.add('error');
    const target=!d.type?form.querySelector('[name=type]'):!size.valid?form.elements.width:form.querySelector('[name=budget]');target.focus();target.closest('fieldset').scrollIntoView({block:'center',behavior:'smooth'});return;
  }
  const brief=makeBrief(d,size);let copied=false;
  try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(brief);copied=true;}}catch(e){}
  if(!copied){manualCopy.value=brief;manualCopy.hidden=false;manualCopy.focus();manualCopy.select();try{copied=document.execCommand('copy');}catch(e){}if(copied)manualCopy.hidden=true;}
  copyStatus.classList.remove('error');copyStatus.textContent=copied?'Copied! Paste it into your message to Tyler.':'Select and copy the text below, then paste it into your message.';
}
function showDetails(id){
  dialogStyle=styles.find(s=>s.id===id);if(!dialogStyle)return;
  document.getElementById('dialog-category').textContent=dialogStyle.location+' / '+dialogStyle.tag;
  document.getElementById('dialog-title').textContent=dialogStyle.title;
  const img=document.getElementById('dialog-image');img.src='assets/'+dialogStyle.detail;img.alt=dialogStyle.alt;
  document.getElementById('dialog-description').textContent=dialogStyle.long;dialog.showModal();
}
document.querySelector('.filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;activeFilter=b.dataset.filter;for(const x of document.querySelectorAll('[data-filter]')){x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));}renderGallery();});
gallery.addEventListener('click',e=>{const detail=e.target.closest('[data-details]'),use=e.target.closest('[data-use]');if(detail)showDetails(detail.dataset.details);if(use)selectStyle(use.dataset.use,true);});
styleOptions.addEventListener('click',e=>{const b=e.target.closest('[data-style]');if(b)selectStyle(b.dataset.style);});
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
document.getElementById('dialog-select').addEventListener('click',()=>{if(dialogStyle){dialog.close();selectStyle(dialogStyle.id,true);}});
form.addEventListener('input',update);form.addEventListener('change',update);
form.addEventListener('submit',e=>{e.preventDefault();copyBrief();});
document.getElementById('copy-brief').addEventListener('click',copyBrief);
document.getElementById('reset-brief').addEventListener('click',()=>{form.reset();attempted=false;for(const id of ['type-error','dimensions-error','budget-error'])document.getElementById(id).hidden=true;form.elements.width.removeAttribute('aria-invalid');form.elements.height.removeAttribute('aria-invalid');selectStyle('open');document.getElementById('brief').scrollIntoView({block:'start',behavior:'smooth'});});
window.addEventListener('resize',update);
renderStyleOptions();renderBudgets();renderGallery();update();
