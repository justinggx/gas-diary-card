# Gaspard 短日记 + 状态翻牌 — ST 正则配置

## 正则条目（填入酒馆正则管理器）

### 查找（Find）
```
<diary>([\s\S]*?)<\/diary>\s*<status>([\s\S]*?)<\/status>
```

### 替换为（Replace with）
把 `diary-card.js` 里 `buildDiaryHTML` 函数生成的 HTML 整块粘贴进去。

由于 ST 正则不支持动态 JS，需要用**脚本注入**方式，见下方说明。

---

## 使用方式（两种选一）

### 方式 A：Quick Reply / 扩展脚本（推荐）

在 ST 的 Quick Reply 或扩展脚本里加载 `diary-card.js`，
然后用 MutationObserver 监听新消息，对含有 `<diary>` 标签的楼层执行替换：

```js
// 在 ST 扩展脚本里
const observer = new MutationObserver(() => {
  document.querySelectorAll('.mes_text').forEach(el => {
    if (el.dataset.diaryProcessed) return;
    const html = el.innerHTML;
    const newHtml = html.replace(
      /<diary>([\s\S]*?)<\/diary>\s*<status>([\s\S]*?)<\/status>/g,
      (_, diary, status) => processDiaryTag(_, diary, status)
    );
    if (newHtml !== html) {
      el.innerHTML = newHtml;
      el.dataset.diaryProcessed = '1';
    }
  });
});
observer.observe(document.getElementById('chat'), { childList: true, subtree: true });
```

### 方式 B：ST 原生正则（纯静态，图片固定不随机）

**查找：**
```
<diary>([\s\S]*?)<\/diary>\s*<status>工作<\/status>
```
**替换为：** 对应状态的静态 HTML（图片写死其中一张）

每个状态单独一条正则，8 条覆盖全部状态。

---

## 世界书输出格式（告诉 AI 怎么写）

AI 每楼末尾输出：
```
<diary>他其实早就看出来了，只是那一瞬间不想装得那么从容。</diary>
<status>吃醋</status>
```

status 枚举值：`工作` / `社交` / `放松` / `开心` / `难过` / `吃醋` / `欲望` / `烦躁`

---

## 状态 → 图片对应表

| status | 图片数量 |
|--------|---------|
| 吃醋   | 2张随机 |
| 工作   | 3张随机 |
| 开心   | 3张随机 |
| 难过   | 3张随机 |
| 社交   | 3张随机 |
| 放松   | 3张随机 |
| 欲望   | 3张随机 |
| 烦躁   | 1张固定 |
