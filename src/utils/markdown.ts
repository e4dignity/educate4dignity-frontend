export function mdToHtml(md: string): string {
  let safe = (md||'').replace(/[<>&]/g, (c)=> ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c] as string));

  // Video embed: lines like "Video: https://url.mp4 - Optional caption"
  safe = safe.replace(/^Video:\s*(\S+)(?:\s*-\s*(.*))?$/gim, (_m, url, cap)=> {
    const caption = cap? `<figcaption>${cap}</figcaption>` : '';
    return `<figure><video src="${url}" controls class="w-full rounded-xl"></video>${caption}</figure>`;
  });

  // Images: ![alt](url "optional title-as-caption")
  safe = safe.replace(/!\[(.*?)\]\((https?:[^\s)]+|\/[\w\-\/\.]+)(?:\s+"(.*?)")?\)/g, (_m, alt, url, title)=> {
    const captionText = title || alt;
    const cap = captionText? `<figcaption>${captionText}</figcaption>` : '';
    return `<figure><img src="${url}" alt="${alt}" class="w-full rounded-xl"/>${cap}</figure>`;
  });

  // Markdown links: [text](url)
  safe = safe.replace(/\[([^\]]+)\]\((https?:[^\s)]+|\/[\w\-\/.#?=&%]+)\)/g, (_m, text, url)=> {
    return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
  });

  // Autolink bare URLs
  safe = safe.replace(/(^|[\s(])((https?:\/\/[^\s)]+))/g, (_m, lead, url)=> {
    return `${lead}<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
  });

  // Basic lists
  // Convert blocks of lines starting with - or * into <ul>
  safe = safe.replace(/(^|\n)([-*] .*(?:\n[-*] .*)+)/g, (_m: string, lead: string, list: string)=> {
    const items = list.split(/\n/).map((l: string)=> `<li>${l.replace(/^[-*]\s+/, '')}</li>`).join('');
    return `${lead}<ul>${items}</ul>`;
  });
  // Ordered lists: 1. 2.
  safe = safe.replace(/(^|\n)((?:\d+\. .*(?:\n\d+\. .*)+))/g, (_m: string, lead: string, list: string)=> {
    const items = list.split(/\n/).map((l: string)=> `<li>${l.replace(/^\d+\.\s+/, '')}</li>`).join('');
    return `${lead}<ol>${items}</ol>`;
  });

  // Headings, emphasis, blockquote, paragraphs
  safe = safe
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>')
    .replace(/\n\n/g, '<br/><br/>' );

  return safe;
}
