const data=window.PHASE4;
const photo=(id)=>`assets/photos/${id}.webp`;
const menu=document.querySelector('.menu');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);document.querySelector('nav').classList.toggle('open',open)});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{menu?.setAttribute('aria-expanded','false');document.querySelector('nav').classList.remove('open')}));
function filters(id,items,render){const el=document.getElementById(id);items.forEach((item,i)=>{const b=document.createElement('button');b.textContent=item;b.setAttribute('aria-pressed',i===0);b.addEventListener('click',()=>{el.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));render(item)});el.append(b)});render(items[0])}
let postCategory = 'All posts';
const search = document.getElementById('post-search');
function renderPosts() {
  const query = search.value.trim().toLocaleLowerCase();
  const posts = Object.entries(data.stories).filter(([,s]) => {
    const text = [s.title, s.author, s.subtitle, s.summary, s.category, s.intro, ...s.sections.map(section => section.text)].join(' ').toLocaleLowerCase();
    return (postCategory === 'All posts' || s.category === postCategory) && (!query || text.includes(query));
  });
  document.getElementById('programme-count').textContent = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`;
  document.getElementById('programmes-grid').innerHTML = posts.length ? posts.map(([id,s]) => `<a class="programme${s.image ? '' : ' text-post'}" data-story="${id}" href="story.html?id=${id}">${s.image ? `<img loading="lazy" src="assets/photos/${s.image}-small.webp" alt="${s.alt}"${s.imagePosition ? ` style="object-position:${s.imagePosition}"` : ''}${s.imageFit === 'contain' ? ' class="contain-cover"' : ''}>` : ''}<div class="post-copy"><h3>${s.title}</h3><p class="post-meta">${s.author || s.category}</p><p>${s.summary}</p><span class="read">Read this post ↗</span>${s.imageGenerated ? '<span class="image-note">AI illustration</span>' : ''}</div></a>`).join('') : '<div class="post-empty"><h3>No posts found</h3><p>Try another title, student name or subject.</p><button id="reset-posts" class="text-button">Clear search and filters</button></div>';
  document.getElementById('reset-posts')?.addEventListener('click', () => {
    search.value = ''; document.querySelector('#programme-filters button').click(); search.focus();
  });
}
const categoryCounts = Object.values(data.stories).reduce((counts, story) => { counts[story.category] = (counts[story.category] || 0) + 1; return counts; }, {});
filters('programme-filters', ['All posts', ...data.categoryOrder.filter(category => categoryCounts[category] >= 4)], category => {
  postCategory = category; renderPosts();
});
search.addEventListener('input', renderPosts);
function selectCategory(category) {
  const button = [...document.querySelectorAll('#programme-filters button')].find(b => b.textContent === category);
  if (button) { search.value = ''; button.click(); }
}
selectCategory(new URLSearchParams(location.search).get('category'));
document.querySelectorAll('[data-post-category]').forEach(link => link.addEventListener('click', e => {
  e.preventDefault(); selectCategory(link.dataset.postCategory); document.getElementById('posts').scrollIntoView();
}));
let shown=0,current=0;const dialog=document.getElementById('photo-dialog');
function showPhoto(i){current=(i+data.gallery.length)%data.gallery.length;const [id,caption]=data.gallery[current];dialog.querySelector('img').src=photo(id);dialog.querySelector('img').alt=caption;dialog.querySelector('p').textContent=`${caption} · ${current+1} / ${data.gallery.length}`}
function more(){const end=Math.min(shown+9,data.gallery.length);for(let i=shown;i<end;i++){const [id,caption]=data.gallery[i];const b=document.createElement('button');b.className='gallery-item';b.innerHTML=`<img loading="lazy" src="assets/photos/${id}-small.webp" alt="${caption}"><span>${caption}</span>`;b.addEventListener('click',()=>{showPhoto(i);dialog.showModal()});document.getElementById('gallery-grid').append(b)}shown=end;document.getElementById('gallery-more').hidden=shown===data.gallery.length;}
more();document.getElementById('gallery-more').addEventListener('click',more);dialog.querySelector('.close').addEventListener('click',()=>dialog.close());document.getElementById('previous').addEventListener('click',()=>showPhoto(current-1));document.getElementById('next').addEventListener('click',()=>showPhoto(current+1));dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight')showPhoto(current+1);if(e.key==='ArrowLeft')showPhoto(current-1)});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
