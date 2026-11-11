const id = new URLSearchParams(location.search).get('id');
const data = window.PHASE4;
const s = Object.hasOwn(data.stories, id) ? data.stories[id] : null;
const external = url => /^https?:/.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
if (!s) {
  document.getElementById('story').innerHTML = '<div class="story-header"><h1>Story not found</h1><p>Explore another Phase4 programme or student story.</p><a href="index.html#posts">View all posts</a></div>';
} else {
  document.title = `${s.title} | Phase4`;
  const related = Object.entries(data.stories).filter(([key, value]) => key !== id && value.category === s.category).slice(0, 3);
  document.getElementById('story').innerHTML = `
    <div class="story-header">
      <a class="text-link" href="index.html#posts">← All posts</a>
      <h1>${s.title}</h1><p>${s.subtitle}</p>${s.author ? `<p class="research-author">${s.author}</p>` : ''}
      ${s.links ? `<div class="story-links">${s.links.map(link => `<a class="text-link" href="${link.url}"${external(link.url)}>${link.label} ↗</a>`).join('')}</div>` : ''}
    </div>
    ${s.image ? `<figure class="story-cover${['rylen','lakshita','doj-recognition','market-voice','diamond-artist'].includes(id) ? ' portrait' : ''}">
      <img src="assets/photos/${s.image}.webp" alt="${s.alt}">
      ${s.imageCredit ? `<figcaption>${s.imageCredit}</figcaption>` : ''}
    </figure>` : ''}
    <article class="story-body">${s.intro ? `<p>${s.intro}</p>` : ''}
      ${s.sections.map(section => `<section><h2>${section.title}</h2><p>${section.text}</p>${section.link ? `<a class="text-link" href="${section.link}"${external(section.link)}>${section.linkLabel} ↗</a>` : ''}</section>`).join('')}
      <small>Source: ${s.sourceLabel}</small>
    </article>
    ${s.photos.length ? `<div class="story-photos">${s.photos.map((photo, i) => `<figure><img src="assets/photos/${photo}.webp" srcset="assets/photos/${photo}-small.webp 640w, assets/photos/${photo}.webp 1400w" sizes="(max-width:680px) 100vw, 50vw" alt="${s.photoCaptions[i]}" loading="lazy"><figcaption>${s.photoCaptions[i]}</figcaption></figure>`).join('')}</div>` : ''}
    ${related.length ? `<aside class="related-stories wrap"><h2>Keep exploring.</h2><div>${related.map(([key, value]) => `<a class="text-link" href="story.html?id=${key}">${value.title} ↗</a>`).join('')}</div></aside>` : ''}`;
}
