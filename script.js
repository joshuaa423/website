const photographs = [
  {id:'jeju', title:'A quieter kind of blue', place:'Gwakji, Jeju Island', date:'2026-08-14', label:'JEJU · 06:18 AM', art:'beach', caption:'The tide was low, the road was empty, and the morning took its time.'},
  {id:'alley', title:'Where the day lets go', place:'Euljiro, Seoul', date:'2026-10-02', label:'SEOUL · 06:42 PM', art:'alley', caption:'A familiar shortcut turns golden for a few minutes each evening.'},
  {id:'night', title:'After the last train', place:'Jongno, Seoul', date:'2026-11-09', label:'SEOUL · 11:36 PM', art:'night', caption:'Blue hour gave way to the warm glow of a street that stayed awake.'},
  {id:'garden', title:'A pause in the green', place:'Seoul Forest, Seoul', date:'2025-05-21', label:'SEOUL · 04:12 PM', art:'garden', caption:'A patch of sun, a long walk, and nowhere else to be.'}
];

// Stable merge sort: split the records, sort each half, then merge by the chosen key.
function mergeSort(items, compare) {
  if (items.length < 2) return items;
  const middle = Math.floor(items.length / 2);
  const left = mergeSort(items.slice(0, middle), compare);
  const right = mergeSort(items.slice(middle), compare);
  const sorted = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (compare(left[i], right[j]) <= 0) sorted.push(left[i++]);
    else sorted.push(right[j++]);
  }
  return sorted.concat(left.slice(i), right.slice(j));
}

function orderPhotos(items, mode) {
  if (mode === 'title') return mergeSort(items, (a, b) => a.title.localeCompare(b.title));
  return mergeSort(items, (a, b) => b.date.localeCompare(a.date));
}

function render(mode = 'date') {
  const gallery = document.querySelector('#gallery');
  const ordered = orderPhotos(photographs, mode);
  gallery.replaceChildren(...ordered.map(photo => {
    const card = document.createElement('article');
    card.className = 'gallery-card';
    const scene = document.createElement('div');
    scene.className = 'scene';
    scene.setAttribute('role', 'button');
    scene.setAttribute('tabindex', '0');
    scene.setAttribute('aria-label', `Compare before and after: ${photo.title}`);
    scene.innerHTML = `<div class="scene-art ${photo.art}"><div class="scene-shape"></div></div><span class="photo-badge">${photo.label}</span><button class="compare-button" type="button">COMPARE ↗</button>`;
    const meta = document.createElement('div'); meta.className = 'meta';
    const date = new Date(`${photo.date}T12:00:00`).toLocaleDateString('en-US', {year:'numeric',month:'short',day:'2-digit'}).toUpperCase();
    meta.innerHTML = `<span>${photo.place.toUpperCase()}</span><span>${date}</span>`;
    const title = document.createElement('h3'); title.textContent = photo.title;
    const place = document.createElement('p'); place.className = 'location'; place.textContent = photo.caption;
    card.append(scene, meta, title, place);
    const open = () => showComparison(photo);
    scene.addEventListener('click', open);
    scene.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
    scene.querySelector('.compare-button').addEventListener('click', event => { event.stopPropagation(); open(); });
    return card;
  }));
}

const dialog = document.querySelector('#compare');
const slider = dialog.querySelector('input[type="range"]');
function showComparison(photo) {
  document.querySelector('#compare-caption').textContent = `${photo.title.toUpperCase()} · ${photo.place.toUpperCase()} — ${photo.caption}`;
  const palettes = {
    beach: ['linear-gradient(180deg,#d5b6a1 0 38%,#8da09b 38% 68%,#bfb49c 68%)', 'linear-gradient(180deg,#f0bd91 0 34%,#eab489 34% 43%,#77918a 43% 70%,#d3bd94 70%)'],
    alley: ['linear-gradient(115deg,#a79c8a 0 24%,#77736a 24% 38%,#596059 38% 64%,#9b8975 64%)', 'linear-gradient(115deg,#d7b69c 0 24%,#897768 24% 38%,#404a43 38% 64%,#b58d66 64%)'],
    night: ['linear-gradient(180deg,#40515c,#586268 55%,#9d8068)', 'linear-gradient(180deg,#172d3b,#374957 55%,#b77a49)'],
    garden: ['linear-gradient(130deg,#b6b8a8,#899184 53%,#697366)', 'linear-gradient(130deg,#d5d5b2,#809170 53%,#485c4b)']
  };
  const before = document.querySelector('#before-image');
  const after = document.querySelector('#after-image');
  before.className = 'compare-image before'; after.className = 'compare-image after';
  before.style.background = palettes[photo.art][0]; after.style.background = palettes[photo.art][1];
  slider.value = 50;
  updateSlider();
  dialog.showModal();
}
function updateSlider() {
  const value = Number(slider.value);
  document.querySelector('#before-image').style.clipPath = `inset(0 ${100-value}% 0 0)`;
  document.querySelector('.compare-divider').style.left = `${value}%`;
}
slider.addEventListener('input', updateSlider);
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelectorAll('.sort-button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.sort-button').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  render(button.dataset.sort);
}));

render();
