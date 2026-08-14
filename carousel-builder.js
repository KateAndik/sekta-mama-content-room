(() => {
  const config = window.SEKTA_CAROUSEL_BUILDER;
  const library = window.SEKTA_LIBRARY?.items || [];
  if (!config?.topics?.length) return;

  const ui = {
    form: document.querySelector("#builderControls"),
    ideaStrip: document.querySelector("#builderIdeaStrip"),
    topic: document.querySelector("#builderTopic"),
    goal: document.querySelector("#builderGoal"),
    account: document.querySelector("#builderAccount"),
    tone: document.querySelector("#builderTone"),
    hook: document.querySelector("#builderHook"),
    subtitle: document.querySelector("#builderSubtitle"),
    cover: document.querySelector("#builderCoverPreview"),
    coverImage: document.querySelector("#builderCoverImage"),
    coverAccount: document.querySelector("#builderCoverAccount"),
    coverHeadline: document.querySelector("#builderCoverHeadline"),
    coverPromise: document.querySelector("#builderCoverPromise"),
    coverStatus: document.querySelector("#builderCoverStatus"),
    slides: document.querySelector("#builderSlides"),
    mediaGrid: document.querySelector("#builderMediaGrid"),
    mediaCount: document.querySelector("#builderMediaCount"),
    wordCount: document.querySelector("#builderWordCount"),
    status: document.querySelector("#builderStatus"),
    download: document.querySelector("#builderDownload"),
    addGrid: document.querySelector("#builderAddGrid"),
    newHook: document.querySelector("#builderNewHook"),
    copyScript: document.querySelector("#builderCopyScript"),
    shuffleMedia: document.querySelector("#builderShuffleMedia"),
  };

  let activeTopic = config.topics[0];
  let activeStyle = "dark";
  let hookIndex = 0;
  let mediaOffset = 0;
  let candidates = [];
  let visibleMedia = [];
  let selectedPhoto = null;

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  const plural = (number, one, few, many) => {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
    return many;
  };

  function setStatus(message) {
    ui.status.textContent = message;
  }

  function candidateScore(item) {
    const coverRole = item.carouselRoles?.includes("01_обложка_личное_присутствие") ? 2 : 0;
    const actionRole = activeTopic.theme === "03_тело_спорт_сила_изменения" && item.carouselRoles?.includes("02_действие_и_доказательство") ? 1.6 : 0;
    const portrait = item.orientation === "portrait" ? 1 : 0;
    const beforePhotoPenalty = item.sourceFolder === "тело ДО" && activeTopic.id !== "body-neutrality" ? -5 : 0;
    return coverRole + actionRole + portrait + beforePhotoPenalty + Number(item.agentScore || 0);
  }

  function findCandidates() {
    const exact = library.filter((item) => item.contentThemes?.includes(activeTopic.theme));
    const pool = exact.length >= 12 ? exact : library;
    return [...pool].sort((a, b) => candidateScore(b) - candidateScore(a));
  }

  function mediaWindow() {
    if (!candidates.length) return [];
    return Array.from({ length: Math.min(12, candidates.length) }, (_, index) => candidates[(mediaOffset + index) % candidates.length]);
  }

  function currentSlideMedia() {
    const pool = visibleMedia.length ? visibleMedia : candidates;
    return [selectedPhoto, pool[2], pool[5], pool[8]].filter(Boolean);
  }

  function renderIdeaStrip() {
    ui.ideaStrip.innerHTML = config.topics.map((topic, index) => `<button type="button" class="builder-idea${topic.id === activeTopic.id ? " is-active" : ""}" data-builder-topic="${escapeHtml(topic.id)}"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${escapeHtml(topic.label)}</strong><small>${escapeHtml(topic.hooks[0])}</small></div></button>`).join("");
  }

  function renderMedia() {
    visibleMedia = mediaWindow();
    if (!selectedPhoto || !candidates.some((item) => item.id === selectedPhoto.id)) selectedPhoto = visibleMedia[0] || null;
    ui.mediaCount.textContent = `${candidates.length} ${plural(candidates.length, "релевантное фото", "релевантных фото", "релевантных фото")}`;
    ui.mediaGrid.innerHTML = visibleMedia.map((item) => `<button type="button" class="builder-media${item.id === selectedPhoto?.id ? " is-selected" : ""}" data-builder-media="${escapeHtml(item.id)}" aria-label="Выбрать ${escapeHtml(item.fileName)}"><img src="${escapeHtml(item.thumb)}" alt="" loading="lazy"></button>`).join("");
  }

  function subtitleForGoal() {
    const labels = { save: "10 слайдов · сохрани", comment: "10 слайдов · обсудим", warmth: "10 слайдов · отправь близким", class: "10 слайдов · выбери класс" };
    return labels[ui.goal.value] || labels.save;
  }

  function renderCover() {
    ui.cover.className = `builder-cover builder-cover-${activeStyle}`;
    ui.coverImage.src = selectedPhoto?.thumb || "";
    ui.coverHeadline.textContent = ui.hook.value;
    ui.coverPromise.textContent = ui.subtitle.value;
    ui.coverAccount.textContent = ui.account.value;
    document.querySelectorAll("[data-builder-style]").forEach((button) => button.classList.toggle("is-active", button.dataset.builderStyle === activeStyle));
    ui.coverStatus.textContent = ({ dark: "Фото + контраст", lime: "Лайм-блок", blue: "Синий-блок" })[activeStyle];
  }

  function buildSlides() {
    const goal = config.goals[ui.goal.value] || config.goals.save;
    return [
      { role: "Обложка", title: ui.hook.value, body: activeTopic.promise },
      ...activeTopic.slides,
      { role: "CTA", title: goal.label, body: goal.cta },
    ];
  }

  function renderSlides() {
    const slideMedia = currentSlideMedia();
    const photoSlots = new Map([[0, slideMedia[0]], [3, slideMedia[1]], [6, slideMedia[2]], [8, slideMedia[3]]]);
    ui.slides.innerHTML = buildSlides().map((slide, index) => {
      const photo = photoSlots.get(index);
      const visual = photo ? `<div class="builder-slide-visual"><img src="${escapeHtml(photo.thumb)}" alt=""></div>` : `<div class="builder-slide-visual is-text">ТЕКСТ</div>`;
      return `<article class="builder-slide" data-builder-slide="${index + 1}"><span class="builder-slide-number">${String(index + 1).padStart(2, "0")}</span><div class="builder-slide-copy"><span class="builder-slide-role">${escapeHtml(slide.role)}</span><strong contenteditable="true" spellcheck="true">${escapeHtml(slide.title)}</strong><p contenteditable="true" spellcheck="true">${escapeHtml(slide.body)}</p></div>${visual}</article>`;
    }).join("");
    updateWordCount();
  }

  function updateSlideVisuals() {
    const slideMedia = currentSlideMedia();
    const slots = [1, 4, 7, 9];
    slots.forEach((number, index) => {
      const visual = ui.slides.querySelector(`[data-builder-slide="${number}"] .builder-slide-visual`);
      const photo = slideMedia[index];
      if (!visual || !photo) return;
      visual.classList.remove("is-text");
      visual.innerHTML = `<img src="${escapeHtml(photo.thumb)}" alt="">`;
    });
  }

  function updateWordCount() {
    const words = ui.slides.textContent.trim().split(/\s+/).filter(Boolean).length;
    ui.wordCount.textContent = `${words} ${plural(words, "слово", "слова", "слов")}`;
  }

  function syncCoverToSlide() {
    const first = ui.slides.querySelector('[data-builder-slide="1"] strong');
    if (first) first.textContent = ui.hook.value;
    renderCover();
    updateWordCount();
  }

  function generateConcept({ preserveHook = false } = {}) {
    activeTopic = config.topics.find((topic) => topic.id === ui.topic.value) || config.topics[0];
    const toneHook = { warm: 0, bold: 1, expert: 2 }[ui.tone.value] ?? 0;
    hookIndex = preserveHook ? hookIndex : toneHook % activeTopic.hooks.length;
    if (!preserveHook) ui.hook.value = activeTopic.hooks[hookIndex];
    ui.subtitle.value = subtitleForGoal();
    mediaOffset = 0;
    candidates = findCandidates();
    visibleMedia = mediaWindow();
    selectedPhoto = visibleMedia[0] || null;
    renderIdeaStrip();
    renderMedia();
    renderCover();
    renderSlides();
    setStatus(`Концепт «${activeTopic.label}» собран: хук, 10 слайдов и ${candidates.length} релевантных фото.`);
  }

  function nextHook() {
    hookIndex = (hookIndex + 1) % activeTopic.hooks.length;
    ui.hook.value = activeTopic.hooks[hookIndex];
    syncCoverToSlide();
    setStatus(`Хук ${hookIndex + 1} из ${activeTopic.hooks.length}.`);
  }

  function scriptText() {
    const rows = [...ui.slides.querySelectorAll(".builder-slide")];
    const slides = rows.map((row, index) => {
      const role = row.querySelector(".builder-slide-role")?.textContent.trim();
      const title = row.querySelector("strong")?.textContent.trim();
      const body = row.querySelector("p")?.textContent.trim();
      return `${String(index + 1).padStart(2, "0")} · ${role}\n${title}\n${body}`;
    }).join("\n\n");
    return `${activeTopic.label}\nАккаунт: ${ui.account.value}\nЦель: ${config.goals[ui.goal.value]?.label}\n\n${slides}`;
  }

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
  }

  function loadImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = location.protocol === "file:" && !/^https?:/.test(source)
        ? `https://olymarkes.github.io/sekta-smm-content-room/${source}`
        : source;
    });
  }

  function drawCoverImage(context, image, x, y, width, height) {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sourceX = (image.naturalWidth - sourceWidth) / 2;
    const sourceY = (image.naturalHeight - sourceHeight) / 2;
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  }

  function wrapLines(context, text, maxWidth) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (line && context.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function roundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
    context.fill();
  }

  async function makeCoverCanvas(width = 1080, height = 1350) {
    if (!selectedPhoto) throw new Error("Нет выбранной фотографии");
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    const image = await loadImage(selectedPhoto.thumb);
    const scale = width / 1080;
    const panelTop = Math.round(height * .55);

    context.fillStyle = activeStyle === "lime" ? "#d4f04a" : activeStyle === "blue" ? "#3155e4" : "#17221f";
    context.fillRect(0, 0, width, height);
    if (activeStyle === "dark") {
      drawCoverImage(context, image, 0, 0, width, height);
      const gradient = context.createLinearGradient(0, height * .24, 0, height);
      gradient.addColorStop(0, "rgba(8,14,12,0)");
      gradient.addColorStop(1, "rgba(8,14,12,.94)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    } else {
      drawCoverImage(context, image, 0, 0, width, activeStyle === "blue" ? height * .62 : panelTop);
      context.fillStyle = activeStyle === "lime" ? "#d4f04a" : "#3155e4";
      context.fillRect(0, panelTop, width, height - panelTop);
    }

    const lightText = activeStyle !== "lime";
    context.fillStyle = activeStyle === "lime" ? "rgba(23,33,30,.72)" : "rgba(18,27,24,.58)";
    roundedRect(context, 54 * scale, 52 * scale, 238 * scale, 58 * scale, 10 * scale);
    context.fillStyle = "#ffffff";
    context.font = `800 ${22 * scale}px Arial, sans-serif`;
    context.fillText(ui.account.value, 76 * scale, 89 * scale);

    const maxWidth = width - 108 * scale;
    let fontSize = 92 * scale;
    let lines = [];
    do {
      context.font = `900 ${fontSize}px Arial, sans-serif`;
      lines = wrapLines(context, ui.hook.value, maxWidth);
      if (lines.length > 5) fontSize -= 5 * scale;
    } while (lines.length > 5 && fontSize > 54 * scale);

    context.fillStyle = lightText ? "#ffffff" : "#17211e";
    context.textBaseline = "alphabetic";
    const lineHeight = fontSize * .93;
    const subtitleY = height - 64 * scale;
    const headlineBottom = subtitleY - 64 * scale;
    const startY = headlineBottom - (lines.length - 1) * lineHeight;
    lines.forEach((line, index) => context.fillText(line, 54 * scale, startY + index * lineHeight));

    context.font = `800 ${20 * scale}px Arial, sans-serif`;
    context.fillStyle = lightText ? "rgba(255,255,255,.88)" : "rgba(23,33,30,.72)";
    context.fillText(ui.subtitle.value.toUpperCase(), 56 * scale, subtitleY);
    return canvas;
  }

  async function downloadCover() {
    try {
      ui.download.disabled = true;
      ui.download.textContent = "Собираю PNG…";
      const canvas = await makeCoverCanvas();
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `sekta-carousel-${activeTopic.id}-cover.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      setStatus("Обложка 1080 × 1350 скачана в PNG.");
    } catch {
      setStatus("Не удалось собрать PNG. Откройте командную версию через GitHub Pages и попробуйте снова.");
    } finally {
      ui.download.disabled = false;
      ui.download.textContent = "Скачать PNG";
    }
  }

  async function addCoverToGrid() {
    try {
      const canvas = await makeCoverCanvas(540, 675);
      const thumb = canvas.toDataURL("image/jpeg", .82);
      window.dispatchEvent(new CustomEvent("sekta:add-generated-cover", { detail: {
        id: `builder-${activeTopic.id}-${Date.now()}`,
        thumb,
        title: ui.hook.value,
        source: "Конструктор каруселей",
      } }));
      setStatus("Обложка добавлена в будущую сетку.");
    } catch {
      setStatus("Не удалось добавить обложку. Попробуйте в версии на GitHub Pages.");
    }
  }

  ui.topic.innerHTML = config.topics.map((topic) => `<option value="${escapeHtml(topic.id)}">${escapeHtml(topic.label)}</option>`).join("");
  ui.form.addEventListener("submit", (event) => { event.preventDefault(); generateConcept(); });
  ui.ideaStrip.addEventListener("click", (event) => {
    const button = event.target.closest("[data-builder-topic]");
    if (!button) return;
    ui.topic.value = button.dataset.builderTopic;
    generateConcept();
  });
  ui.mediaGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-builder-media]");
    if (!button) return;
    selectedPhoto = candidates.find((item) => item.id === button.dataset.builderMedia) || selectedPhoto;
    renderMedia();
    renderCover();
    updateSlideVisuals();
    setStatus(`Фото ${selectedPhoto.fileName} выбрано для обложки.`);
  });
  document.querySelectorAll("[data-builder-style]").forEach((button) => button.addEventListener("click", () => {
    activeStyle = button.dataset.builderStyle;
    renderCover();
  }));
  ui.hook.addEventListener("input", syncCoverToSlide);
  ui.subtitle.addEventListener("input", renderCover);
  ui.account.addEventListener("change", renderCover);
  ui.goal.addEventListener("change", () => generateConcept({ preserveHook: true }));
  ui.slides.addEventListener("input", updateWordCount);
  ui.newHook.addEventListener("click", nextHook);
  ui.copyScript.addEventListener("click", async () => { await copyText(scriptText()); setStatus("Сценарий скопирован в буфер обмена."); });
  ui.shuffleMedia.addEventListener("click", () => {
    mediaOffset = (mediaOffset + 12) % Math.max(candidates.length, 1);
    visibleMedia = mediaWindow();
    selectedPhoto = visibleMedia[0] || selectedPhoto;
    renderMedia();
    renderCover();
    updateSlideVisuals();
    setStatus("Показана следующая подборка фотографий.");
  });
  ui.download.addEventListener("click", downloadCover);
  ui.addGrid.addEventListener("click", addCoverToGrid);

  ui.topic.value = activeTopic.id;
  ui.hook.value = activeTopic.hooks[0];
  ui.subtitle.value = subtitleForGoal();
  candidates = findCandidates();
  visibleMedia = mediaWindow();
  selectedPhoto = visibleMedia[0] || null;
  renderIdeaStrip();
  renderMedia();
  renderCover();
  renderSlides();
})();
