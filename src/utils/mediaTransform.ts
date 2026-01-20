// Shared media transform helpers for content coming from the admin editors
// - Wrap <img title> into <figure><img/><figcaption/>
// - Convert ONLY <a data-e4d-video="1" href="..."> into embeds (YouTube iframe or MP4 <video>)

export function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '').trim();
      return id || null;
    }
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return id;
      const m = u.pathname.match(/\/embed\/([A-Za-z0-9_-]+)/);
      if (m?.[1]) return m[1];
    }
    return null;
  } catch { return null; }
}

export function transformArticleHtml(html: string): string {
  try {
    const container = document.createElement('div');
    container.innerHTML = html || '';
    // Convert tagged video links
    const anchors = Array.from(container.querySelectorAll('a[href][data-e4d-video="1"]')) as HTMLAnchorElement[];
    anchors.forEach(a => {
      const href = a.getAttribute('href') || '';
      const txt = a.textContent || '';
      if (!href) return;
      const ytId = extractYouTubeId(href);
      const figure = document.createElement('figure');
      let replaced = false;
      if (ytId) {
        const wrap = document.createElement('div');
        wrap.setAttribute('style','position:relative;width:100%;padding-top:56.25%;border-radius:12px;overflow:hidden;background:#000');
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`);
        iframe.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen','');
        iframe.setAttribute('title','YouTube video');
        iframe.setAttribute('style','position:absolute;inset:0;width:100%;height:100%;border:0');
        wrap.appendChild(iframe);
        figure.appendChild(wrap);
        if (txt && txt !== href) {
          const cap = document.createElement('figcaption');
          cap.textContent = txt;
          cap.setAttribute('style','font-size:12px;color:#6b7280;text-align:center;margin-top:6px');
          figure.appendChild(cap);
        }
        replaced = true;
      } else if (/\.mp4(\?|$)/i.test(href)) {
        const video = document.createElement('video');
        video.setAttribute('controls','');
        video.setAttribute('src', href);
        video.setAttribute('style','width:100%;border-radius:12px');
        figure.appendChild(video);
        if (txt && txt !== href) {
          const cap = document.createElement('figcaption');
          cap.textContent = txt;
          cap.setAttribute('style','font-size:12px;color:#6b7280;text-align:center;margin-top:6px');
          figure.appendChild(cap);
        }
        replaced = true;
      }
      if (replaced) {
        const p = a.closest('p') || a;
        p.parentElement?.insertBefore(figure, p);
        p.remove();
      }
    });
    // Wrap images with captions
    const imgs = Array.from(container.querySelectorAll('img'));
    imgs.forEach(img => {
      const title = img.getAttribute('title') || '';
      if (!title) return;
      if (img.parentElement && img.parentElement.tagName.toLowerCase() === 'figure') return;
      const figure = document.createElement('figure');
      figure.style.margin = '0';
      const clone = img.cloneNode(true) as HTMLElement;
      const fc = document.createElement('figcaption');
      fc.textContent = title;
      fc.style.fontSize = '12px';
      fc.style.color = '#6b7280';
      fc.style.textAlign = 'center';
      fc.style.marginTop = '6px';
      figure.appendChild(clone);
      figure.appendChild(fc);
      img.replaceWith(figure);
    });
    return container.innerHTML;
  } catch { return html; }
}
