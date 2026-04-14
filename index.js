/**
 * Gaspard 短日记 + 状态翻牌模块
 * 放入 SillyTavern/public/scripts/extensions/third-party/gaspard-diary/index.js
 * 或直接在 ST 控制台执行
 */

(function () {
  const STATUS_IMAGES = {
    '吃醋': [
      'https://i.postimg.cc/SQrkBrmm/chi-cu-bu-yue-zhan-you-yu1.png',
      'https://i.postimg.cc/4yBGpJWV/chi-cu-bu-yue-zhan-you-yu2.png',
    ],
    '工作': [
      'https://i.postimg.cc/5NydZWPZ/gong-zuo-zhong-kong-chang-zhuang-tai1.png',
      'https://i.postimg.cc/8PcQqgKN/gong-zuo-zhong-kong-chang-zhuang-tai2.jpg',
      'https://i.postimg.cc/Pr7sHV9P/gong-zuo-zhong-kong-chang-zhuang-tai3.png',
    ],
    '开心': [
      'https://i.postimg.cc/GpJ54X72/kai-xin-bei-qu-yue1.png',
      'https://i.postimg.cc/ZqFMWw7K/kai-xin-bei-qu-yue2.png',
      'https://i.postimg.cc/25ftjsxg/kai-xin-bei-qu-yue3.png',
    ],
    '难过': [
      'https://i.postimg.cc/zBQSvWrW/nan-guo-di-qi-ya1.png',
      'https://i.postimg.cc/C5fCq1ht/nan-guo-di-qi-ya2.png',
      'https://i.postimg.cc/WzJmk3NC/nan-guo-di-qi-ya3.png',
    ],
    '社交': [
      'https://i.postimg.cc/Gp7SP4R9/she-jiao-wei-zhuang-zhuang-tai1.png',
      'https://i.postimg.cc/65Jbhskm/she-jiao-wei-zhuang-zhuang-tai2.png',
      'https://i.postimg.cc/KvPqqqb7/she-jiao-wei-zhuang-zhuang-tai3.png',
    ],
    '放松': [
      'https://i.postimg.cc/fLQSrKDx/si-xia-fang-song-zhuang-tai1.png',
      'https://i.postimg.cc/prq9yM8k/si-xia-fang-song-zhuang-tai2.png',
      'https://i.postimg.cc/BbM8tfDM/si-xia-fang-song-zhuang-tai3.png',
    ],
    '欲望': [
      'https://i.postimg.cc/VvL6xZT3/yu-wang-NSFW-qian-tai1.jpg',
      'https://i.postimg.cc/1XCtsc1h/yu-wang-NSFW-qian-tai2.jpg',
      'https://i.postimg.cc/6qj3tLxw/yu-wang-NSFW-qian-tai3.png',
    ],
    '烦躁': [
      'https://i.postimg.cc/d02VLKcr/fan-zao-tong-ku.png',
    ],
  };

  const STATUS_LABEL = {
    '工作': '工作中', '社交': '社交中', '放松': '私下放松',
    '开心': '心情不错', '难过': '低气压', '吃醋': '不太高兴',
    '欲望': '克制中', '烦躁': '烦躁',
  };

  const STATUS_HINT = {
    '工作': '他在处理一些事情',
    '社交': '他在维持某种体面',
    '放松': '没有人看见他的此刻',
    '开心': '他没说出来',
    '难过': '不必知道原因',
    '吃醋': '翻开看看',
    '欲望': '不适合现在打扰他',
    '烦躁': '离远一点比较好',
  };

  function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function buildHTML(diary, status) {
    const imgs = STATUS_IMAGES[status] || STATUS_IMAGES['工作'];
    const img = rand(imgs);
    const label = STATUS_LABEL[status] || status;
    const hint = STATUS_HINT[status] || '';
    const uid = 'gd' + Math.random().toString(36).slice(2, 8);

    return `<div class="gsp-diary-wrap" id="${uid}">
<div class="gsp-diary-left">
  <div class="gsp-diary-eyebrow">Private · ${label}</div>
  <div class="gsp-diary-text">${diary}</div>
</div>
<div class="gsp-flip-wrap" onclick="this.classList.toggle('flipped')">
  <div class="gsp-flip-inner">
    <div class="gsp-flip-front">
      <div class="gsp-status-badge">${label}</div>
      <div class="gsp-status-hint">${hint}</div>
      <div class="gsp-flip-icon">— 翻开 —</div>
    </div>
    <div class="gsp-flip-back">
      <img src="${img}" alt="${label}" loading="lazy">
    </div>
  </div>
</div>
</div>`;
  }

  function injectStyles() {
    if (document.getElementById('gsp-diary-style')) return;
    const s = document.createElement('style');
    s.id = 'gsp-diary-style';
    s.textContent = `
.gsp-diary-wrap {
  display: flex;
  gap: 14px;
  align-items: stretch;
  margin: 18px 0 6px;
  font-family: 'Noto Serif SC', Georgia, serif;
}
.gsp-diary-left {
  flex: 1;
  min-width: 0;
  background: linear-gradient(135deg, rgba(20,18,14,.94) 0%, rgba(30,26,18,.9) 100%);
  border: 1px solid rgba(180,155,100,.18);
  border-radius: 6px;
  padding: 15px 17px;
  position: relative;
  overflow: hidden;
}
.gsp-diary-left::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 2px; height: 100%;
  background: linear-gradient(180deg, rgba(201,170,114,.65) 0%, rgba(201,170,114,.08) 100%);
}
.gsp-diary-eyebrow {
  font-size: 9px;
  letter-spacing: .18em;
  color: rgba(201,170,114,.5);
  text-transform: uppercase;
  margin-bottom: 9px;
}
.gsp-diary-text {
  font-size: 13px;
  line-height: 1.9;
  color: rgba(220,210,190,.82);
  font-style: italic;
  white-space: pre-wrap;
}
.gsp-diary-text::before { content: '\u201C'; color: rgba(201,170,114,.35); }
.gsp-diary-text::after  { content: '\u201D'; color: rgba(201,170,114,.35); }

/* 翻牌 */
.gsp-flip-wrap {
  width: 124px;
  flex-shrink: 0;
  perspective: 900px;
  cursor: pointer;
}
.gsp-flip-inner {
  width: 100%;
  height: 100%;
  min-height: 158px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform .55s cubic-bezier(.4,0,.2,1);
}
.gsp-flip-wrap:hover .gsp-flip-inner,
.gsp-flip-wrap.flipped .gsp-flip-inner {
  transform: rotateY(180deg);
}
.gsp-flip-front,
.gsp-flip-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 6px;
  overflow: hidden;
}
.gsp-flip-front {
  background: linear-gradient(160deg, rgba(26,22,14,.96) 0%, rgba(38,32,18,.92) 100%);
  border: 1px solid rgba(201,170,114,.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 8px;
}
.gsp-status-badge {
  font-size: 11px;
  letter-spacing: .1em;
  color: rgba(201,170,114,.9);
  border: 1px solid rgba(201,170,114,.28);
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.gsp-status-hint {
  font-size: 10px;
  color: rgba(200,190,170,.42);
  text-align: center;
  line-height: 1.5;
}
.gsp-flip-icon {
  font-size: 9px;
  color: rgba(201,170,114,.28);
  letter-spacing: .1em;
  margin-top: 2px;
}
.gsp-flip-back {
  transform: rotateY(180deg);
  background: #0e0d0b;
}
.gsp-flip-back img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: brightness(.93) contrast(1.04);
}
`;
    document.head.appendChild(s);
  }

  const RE = /<diary>([\s\S]*?)<\/diary>\s*<status>([\s\S]*?)<\/status>/g;

  function processEl(el) {
    if (el.dataset.gspDone) return;
    const raw = el.innerHTML;
    if (!raw.includes('<diary>')) return;
    el.dataset.gspDone = '1';
    el.innerHTML = raw.replace(RE, (_, diary, status) =>
      buildHTML(diary.trim(), status.trim())
    );
  }

  function scanAll() {
    document.querySelectorAll('.mes_text').forEach(processEl);
  }

  injectStyles();
  scanAll();

  const ob = new MutationObserver(scanAll);
  const chat = document.getElementById('chat');
  if (chat) ob.observe(chat, { childList: true, subtree: true });

  console.log('[gaspard-diary] loaded');
})();
