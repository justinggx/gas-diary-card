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
      'https://i.postimg.cc/J45CT6w3/sfw-1boy-sitting-from-side-upper-body-male-f-0.png',
    ],
    '难过': [
      'https://i.postimg.cc/zBQSvWrW/nan-guo-di-qi-ya1.png',
      'https://i.postimg.cc/0y9swjkd/nan-guo-di-qi-ya2.png',
      'https://i.postimg.cc/3wMxVYYL/nan-guo-di-qi-ya3.png',
    ],
    '社交': [
      'https://i.postimg.cc/4dHkghPf/she-jiao-wei-zhuang-zhuang-tai1.png',
      'https://i.postimg.cc/gJzmb05v/she-jiao-wei-zhuang-zhuang-tai2.png',
      'https://i.postimg.cc/wvGP4TYn/she-jiao-wei-zhuang-zhuang-tai3.png',
    ],
    '放松': [
      'https://i.postimg.cc/SNyTLM9z/si-xia-fang-song-zhuang-tai1.png',
      'https://i.postimg.cc/R0q27njk/si-xia-fang-song-zhuang-tai2.png',
      'https://i.postimg.cc/BbM8tfDM/si-xia-fang-song-zhuang-tai3.png',
    ],
    '欲望': [
      'https://i.postimg.cc/VvL6xZT3/yu-wang-NSFW-qian-tai1.jpg',
      'https://i.postimg.cc/1XCtsc1h/yu-wang-NSFW-qian-tai2.jpg',
      'https://i.postimg.cc/nzSb8GBS/yu-wang-NSFW-qian-tai3.png',
    ],
    '烦躁': [
      'https://i.postimg.cc/RZTvsfp9/fan-zao-tong-ku.png',
    ],
  };

  const STATUS_LABEL = {
    '工作': '工作中', '社交': '社交中', '放松': '私下放松',
    '开心': '心情不错', '难过': '低气压', '吃醋': '不太高兴',
    '欲望': '克制中', '烦躁': '烦躁',
  };

  const STATUS_ALIASES = {
    '工作中': '工作',
    '控场': '工作',
    '控场状态': '工作',
    '社交中': '社交',
    '伪装状态': '社交',
    '私下放松': '放松',
    '放松状态': '放松',
    '心情不错': '开心',
    '愉悦': '开心',
    '被取悦': '开心',
    '低气压': '难过',
    '难受': '难过',
    '不太高兴': '吃醋',
    '占有欲': '吃醋',
    '吃醋占有欲': '吃醋',
    '克制中': '欲望',
    'NSFW前态': '欲望',
    'NSFW 前态': '欲望',
    '烦': '烦躁',
    '痛苦': '烦躁',
    '烦躁痛苦': '烦躁',
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

  function normalizeStatus(status) {
    const s = String(status || '').trim();
    return STATUS_IMAGES[s] ? s : (STATUS_ALIASES[s] || s);
  }

  function buildHTML(diary, status) {
    const normalizedStatus = normalizeStatus(status);
    const imgs = STATUS_IMAGES[normalizedStatus] || (() => {
      console.warn(`[gaspard-diary] 未知状态: "${status}"，标准化后仍无匹配，已fallback到工作。请检查世界书输出。`);
      return STATUS_IMAGES['工作'];
    })();
    const img = rand(imgs);
    const label = STATUS_LABEL[normalizedStatus] || normalizedStatus || status;
    const hint = STATUS_HINT[normalizedStatus] || '';
    const uid = 'gd' + Math.random().toString(36).slice(2, 8);
    // 提取日记开头的日期（X月X日）用于底部水印
    const dateMatch = diary.match(/^(\d{1,2}月\d{1,2}日)/);
    const dateStr = dateMatch ? dateMatch[1] : '';

    return `<div class="gsp-diary-wrap" id="${uid}">
<div class="gsp-diary-left" style="background:linear-gradient(150deg,rgba(20,16,10,.97) 0%,rgba(30,24,14,.95) 100%) !important;">
  <div class="gsp-diary-corner tl"></div>
  <div class="gsp-diary-corner tr"></div>
  <div class="gsp-diary-corner bl"></div>
  <div class="gsp-diary-corner br"></div>
  <div class="gsp-diary-eyebrow">G · PRIVATE · JOURNAL</div>
  <div class="gsp-diary-text" style="color:rgba(224,208,184,.88) !important;font-style:normal !important;text-align:left !important;">${diary}</div>
  ${dateStr ? `<div class="gsp-diary-date">${dateStr}</div>` : ''}
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
    const old = document.getElementById('gsp-diary-style');
    if (old) old.remove();
    const s = document.createElement('style');
    s.id = 'gsp-diary-style';
    s.textContent = `
/* ── Gaspard Diary Widget ── */
.gsp-diary-wrap {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin: 16px auto 6px;
  max-width: 680px;
  width: 100%;
  font-family: 'Noto Serif SC', Georgia, serif;
}

/* 左侧日记区 — 暗金风格，无底图 */
.gsp-diary-left {
  flex: 0 0 60%;
  align-self: stretch;
  min-width: 0;
  background: linear-gradient(150deg, rgba(20,16,10,.97) 0%, rgba(30,24,14,.95) 100%);
  border-radius: 8px;
  border: 1px solid rgba(201,170,114,.15);
  box-shadow: inset 0 0 32px rgba(0,0,0,.4), 0 8px 32px rgba(0,0,0,.35);
  padding: 0;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 去掉原来的两条线伪元素，改用独立四角装饰 */
.gsp-diary-left::before,
.gsp-diary-left::after { display: none; }

/* 四角 L 形装饰 */
.gsp-diary-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  z-index: 2;
  pointer-events: none;
}
.gsp-diary-corner.tl { top: 10px;  left: 10px;  border-top: 1px solid rgba(201,170,114,.5); border-left: 1px solid rgba(201,170,114,.5); }
.gsp-diary-corner.tr { top: 10px;  right: 10px; border-top: 1px solid rgba(201,170,114,.5); border-right: 1px solid rgba(201,170,114,.5); }
.gsp-diary-corner.bl { bottom: 10px; left: 10px;  border-bottom: 1px solid rgba(201,170,114,.5); border-left: 1px solid rgba(201,170,114,.5); }
.gsp-diary-corner.br { bottom: 10px; right: 10px; border-bottom: 1px solid rgba(201,170,114,.5); border-right: 1px solid rgba(201,170,114,.5); }

/* 顶部眉注 */
.gsp-diary-eyebrow {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  letter-spacing: .22em;
  color: rgba(201,170,114,.35);
  white-space: nowrap;
  font-family: 'Playfair Display', Georgia, serif;
  z-index: 2;
  pointer-events: none;
}

/* 底部日期水印 */
.gsp-diary-date {
  position: absolute;
  bottom: 14px;
  right: 18px;
  font-size: 9px;
  letter-spacing: .15em;
  color: rgba(201,170,114,.28);
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  z-index: 2;
  pointer-events: none;
}

.gsp-diary-text {
  position: relative;
  z-index: 1;
  width: 78%;
  margin: 0;
  padding: 24px 0;
  font-size: 13.5px;
  line-height: 2;
  color: rgba(224,208,184,.88);
  font-style: normal;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Noto Serif SC', Georgia, serif;
  text-align: justify;
  letter-spacing: .01em;
}

/* 笔记本装饰容器 */
.gsp-notebook-deco {
  position: relative;
  width: 100%;
  max-width: 320px;
}

/* 叠纸效果 */
.gsp-paper {
  position: absolute;
  border-radius: 4px;
}
.gsp-paper-3 {
  inset: 0;
  transform: rotate(3.5deg) translate(6px, 4px);
  background: #d4c9a8;
  border-radius: 4px;
  box-shadow: 1px 2px 6px rgba(0,0,0,.35);
}
.gsp-paper-2 {
  inset: 0;
  transform: rotate(-2deg) translate(-4px, 3px);
  background: #ddd3b2;
  border-radius: 4px;
  box-shadow: 1px 2px 5px rgba(0,0,0,.3);
}

/* 主纸页 */
.gsp-paper-1 {
  position: relative;
  background: #f2ecd8;
  border-radius: 4px;
  padding: 16px 16px 20px 20px;
  box-shadow: 2px 4px 12px rgba(0,0,0,.4);
  /* 横线 */
  background-image:
    linear-gradient(#f2ecd8 0%, #f2ecd8 100%),
    repeating-linear-gradient(
      transparent,
      transparent 27px,
      rgba(180,160,110,.25) 27px,
      rgba(180,160,110,.25) 28px
    );
  background-blend-mode: multiply;
}
.gsp-paper-eyebrow {
  font-size: 8px;
  letter-spacing: .22em;
  color: rgba(100,80,40,.5);
  text-transform: uppercase;
  margin-bottom: 10px;
  font-family: 'Noto Serif SC', Georgia, serif;
}
.gsp-paper-text {
  font-size: 12.5px;
  line-height: 1.85;
  color: rgba(50,35,15,.82);
  font-style: italic;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Noto Serif SC', Georgia, serif;
}
.gsp-paper-text::before { content: '\u201C'; color: rgba(120,90,40,.4); font-size: 15px; }
.gsp-paper-text::after  { content: '\u201D'; color: rgba(120,90,40,.4); font-size: 15px; }

/* 钢笔装饰 — 右下角斜放 */
.gsp-pen {
  position: absolute;
  bottom: -10px;
  right: -14px;
  width: 22px;
  height: 74px;
  transform: rotate(30deg);
  opacity: .85;
  pointer-events: none;
  filter: drop-shadow(1px 2px 3px rgba(0,0,0,.5));
}

/* 右侧翻牌区 — 40%，以图片原始比例 2:3 自然撑高 */
.gsp-flip-wrap {
  flex: 0 0 40%;
  min-width: 0;
  perspective: 900px;
  cursor: pointer;
  box-sizing: border-box;
}
/* 用 padding-top 锁定 2:3 比例，图片完整展示不裁切 */
.gsp-flip-inner {
  width: 100%;
  padding-top: 146%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform .52s cubic-bezier(.4,0,.2,1);
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
  border-radius: 8px;
  overflow: hidden;
}
.gsp-flip-front {
  background: linear-gradient(150deg, rgba(24,20,13,.97) 0%, rgba(36,30,17,.93) 100%);
  border: 1px solid rgba(201,170,114,.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 10px;
  box-shadow: inset 0 0 20px rgba(0,0,0,.45);
}
.gsp-status-badge {
  font-size: 11px;
  letter-spacing: .1em;
  color: rgba(201,170,114,.9);
  border: 1px solid rgba(201,170,114,.28);
  padding: 3px 12px;
  border-radius: 20px;
  white-space: nowrap;
}
.gsp-status-hint {
  font-size: 10px;
  color: rgba(200,190,170,.4);
  text-align: center;
  line-height: 1.65;
  padding: 0 6px;
}
.gsp-flip-icon {
  font-size: 9px;
  color: rgba(201,170,114,.24);
  letter-spacing: .12em;
  margin-top: 6px;
}
.gsp-flip-back {
  transform: rotateY(180deg);
  background: #0c0b09;
}
.gsp-flip-back img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
  display: block;
}

/* ── 手机端适配 ── */
@media (max-width: 520px) {
  .gsp-diary-wrap {
    flex-direction: column;
    gap: 8px;
    max-width: 100%;
  }
  /* 手机端只修正文案排版，不动 PC */
  .gsp-diary-left {
    flex: none;
    width: 100%;
    min-height: auto;
    padding: 0;
    background: linear-gradient(150deg, rgba(20,16,10,.97) 0%, rgba(30,24,14,.95) 100%) !important;
    background-image: none !important;
    position: relative;
    align-self: auto;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
  }
  .gsp-diary-corner { width: 10px; height: 10px; }
  .gsp-diary-corner.tl { top: 8px;  left: 8px; }
  .gsp-diary-corner.tr { top: 8px;  right: 8px; }
  .gsp-diary-corner.bl { bottom: 8px; left: 8px; }
  .gsp-diary-corner.br { bottom: 8px; right: 8px; }
  .gsp-diary-eyebrow { top: 10px; font-size: 7px; }
  .gsp-diary-date { bottom: 10px; right: 12px; font-size: 8px; }
  .gsp-diary-text {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    z-index: 1;
    width: calc(100% - 56px);
    margin: 0 28px;
    padding: 42px 0 30px;
    font-size: 13px;
    line-height: 1.9;
    color: rgba(224,208,184,.9);
    text-align: left;
    font-style: normal;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
    letter-spacing: .01em;
  }
  /* 翻牌区：严格 2:3 比例 */
  .gsp-flip-wrap {
    flex: none;
    width: 100%;
  }
  .gsp-flip-inner {
    padding-top: 150%; /* 2:3 */
    height: auto;
  }
  .gsp-flip-back img {
    object-fit: cover;
    object-position: center top;
  }
}
`;
    document.head.appendChild(s);
  }

  // 单标签格式：[gspstate]状态|日记内容[/gspstate]
  const RE = /\[gspstate\]([^|]+)\|([\s\S]*?)\[\/gspstate\]/g;

  function processEl(el) {
    // 已经渲染过且没有新的原始标签 → 跳过
    if (el.querySelector('.gsp-diary-wrap') && !el.innerHTML.includes('[gspstate]')) return;
    const raw = el.innerHTML;
    if (!raw.includes('[gspstate]')) return;
    el.innerHTML = raw.replace(RE, (_, status, diary) =>
      buildHTML(diary.trim(), status.trim())
    );
  }

  function scanAll() {
    document.querySelectorAll('.mes_text').forEach(processEl);
  }

  // debounce：DOM 稳定 300ms 后才跑 scanAll，避免流式输出时高频触发
  let scanTimer = null;
  function debouncedScan() {
    if (scanTimer) clearTimeout(scanTimer);
    scanTimer = setTimeout(scanAll, 300);
  }

  injectStyles();
  scanAll();

  // 优先用 ST 官方事件（消息生成完毕才触发，精准且无性能损耗）
  // 兼容 SillyTavern eventSource API
  const STEvents = window.eventSource || window.SillyTavern?.eventSource;
  if (STEvents && typeof STEvents.on === 'function') {
    const EV = window.event_types || window.SillyTavern?.event_types || {};
    const onDone = () => scanAll();
    // 消息收到 + 渲染完成 两个事件都挂，确保覆盖
    if (EV.MESSAGE_RECEIVED)        STEvents.on(EV.MESSAGE_RECEIVED, onDone);
    if (EV.CHARACTER_MESSAGE_RENDERED) STEvents.on(EV.CHARACTER_MESSAGE_RENDERED, onDone);
    // 同时监听 MESSAGE_EDITED（编辑/re-roll 后也要重渲染）
    if (EV.MESSAGE_EDITED)          STEvents.on(EV.MESSAGE_EDITED, onDone);
    console.log('[gaspard-diary] using ST eventSource');
  } else {
    // 降级：ST 事件不可用时才用 MutationObserver + debounce
    const ob = new MutationObserver(debouncedScan);
    const chat = document.getElementById('chat');
    if (chat) ob.observe(chat, { childList: true, subtree: true });
    console.log('[gaspard-diary] fallback to MutationObserver');
  }

  console.log('[gaspard-diary] loaded');
})();
