(() => {
  const library = window.SEKTA_LIBRARY?.items || [];
  const root = document.querySelector('[data-view-panel="postbuilder"]');
  if (!root) return;

  const DRAFT_KEY = "sekta-mama-carousel-studio-draft-v1";
  const SAVED_KEY = "sekta-mama-carousel-studio-series-v1";
  const IMPORT_KEY = "sekta-mama-carousel-studio-taste-import-v1";
  const LOCAL_MEDIA_DB = "sekta-mama-local-media-v1";
  const LOCAL_MEDIA_STORE = "media";
  const MAX_VIDEO_SECONDS = 60;
  const DEFAULT_LONGREAD = document.querySelector("#carouselLongreadText")?.value || "";
  const formatPresets = {
    feed: { name: "Пост 4:5", width: 1080, height: 1350, ratio: "4 / 5", label: "1080 × 1350" },
    story: { name: "Stories 9:16", width: 1080, height: 1920, ratio: "9 / 16", label: "1080 × 1920" },
  };
  const palettes = {
    ink: { name: "Контрастная", background: "#17221f", foreground: "#ffffff", accent: "#f7f7f2", ink: "#17221f" },
    pink: { name: "Розовая", background: "#f35ba7", foreground: "#17221f", accent: "#ffffff", ink: "#17221f" },
    blue: { name: "Синяя", background: "#3155e4", foreground: "#ffffff", accent: "#dce5ff", ink: "#17211e" },
    lime: { name: "Лайм", background: "#d4f04a", foreground: "#17221f", accent: "#ffffff", ink: "#17221f" },
    paper: { name: "Бумага", background: "#fff7e6", foreground: "#5b493b", accent: "#f35ba7", ink: "#392f29" },
    sky: { name: "Небо", background: "#c8edf2", foreground: "#17221f", accent: "#3155e4", ink: "#17221f" },
    mint: { name: "Мята", background: "#62d9a4", foreground: "#17221f", accent: "#fff7e6", ink: "#17221f" },
    blush: { name: "Пудра", background: "#f8cfe0", foreground: "#17221f", accent: "#f35ba7", ink: "#17221f" },
    sun: { name: "Солнце", background: "#f7c943", foreground: "#17221f", accent: "#ffffff", ink: "#17221f" },
    coral: { name: "Коралл", background: "#ef6c5b", foreground: "#ffffff", accent: "#fff7e6", ink: "#17221f" },
    lilac: { name: "Сирень", background: "#c7b8f5", foreground: "#17221f", accent: "#ffffff", ink: "#17221f" },
  };
  const layoutTemplates = {
    custom: { name: "Своя композиция" },
    "light-column": { scene: "paper", placement: "middle", size: 68, bodySize: 30, plaqueEnabled: false },
    "photo-field": { scene: "window", placement: "bottom", size: 64, bodySize: 28, plaqueEnabled: false },
    "side-plaque": { scene: "split", placement: "middle", size: 64, bodySize: 28, plaqueEnabled: true },
    "top-plaque": { scene: "photo-dim", placement: "top", size: 68, bodySize: 28, plaqueEnabled: true },
    "photo-window": { scene: "window", placement: "bottom", size: 64, bodySize: 28, plaqueEnabled: false },
    "photo-scrim": { scene: "photo-dim", placement: "bottom", size: 72, bodySize: 30, plaqueEnabled: false },
    "text-photo": { scene: "photo-clean", placement: "middle", size: 72, bodySize: 30, plaqueEnabled: false },
    "accent-thought": { scene: "field", placement: "middle", size: 96, bodySize: 34, plaqueEnabled: false },
    "color-final": { scene: "field", placement: "middle", size: 78, bodySize: 32, plaqueEnabled: false },
  };
  const layoutPresets = {
    "paper-column": { name: "Бумажная колонка", role: "longread", scene: "paper", background: "#f3f1e9", foreground: "#171814", accent: "#e9a692", ink: "#171814" },
    "sage-column": { name: "Тёмное поле", role: "longread", scene: "dark", background: "#35432f", foreground: "#fbfaf5", accent: "#e9a692", ink: "#171814" },
    "cobalt-column": { name: "Кобальт + лайм", role: "longread", scene: "field", background: "#2437d8", foreground: "#fbfaf5", accent: "#d7ff37", ink: "#171814" },
    "two-columns": { name: "Пудра + чернила", role: "longread", scene: "paper", background: "#efd7d0", foreground: "#171814", accent: "#a14d3e", ink: "#171814" },
    "split-photo": { name: "Бумага + красный", role: "longread", scene: "split", background: "#f3f1e9", foreground: "#171814", accent: "#ef4b37", ink: "#171814" },
    "photo-window": { name: "Шалфей + пудра", role: "longread", scene: "window", background: "#d8dfcf", foreground: "#171814", accent: "#e9a692", ink: "#171814" },
    "photo-scrim": { name: "Фото + тёмный scrim", role: "longread", scene: "photo-dim", background: "#1d271b", foreground: "#fbfaf5", accent: "#e9a692", ink: "#171814" },
    "photo-band": { name: "Бумага + фотопауза", role: "longread", scene: "window", background: "#f3f1e9", foreground: "#171814", accent: "#e9a692", ink: "#171814" },
    "photo-plaque": { name: "Чёрная плашка", role: "cover", scene: "plate", background: "#171814", foreground: "#fbfaf5", accent: "#e9a692", ink: "#171814" },
    "photo-shadow": { name: "Белый текст на фото", role: "cover", scene: "photo-dim", background: "#171814", foreground: "#fbfaf5", accent: "#e9a692", ink: "#171814" },
    "top-photo-cover": { name: "Молочный + фото", role: "cover", scene: "window", background: "#fbfaf5", foreground: "#171814", accent: "#e9a692", ink: "#171814" },
    "ink-poster": { name: "Чернильный плакат", role: "cover", scene: "dark", background: "#171814", foreground: "#fbfaf5", accent: "#e9a692", ink: "#171814" },
    "lime-poster": { name: "Лайм + чёрный", role: "cover", scene: "field", background: "#d8ff35", foreground: "#11120f", accent: "#f05232", ink: "#11120f" },
    "ruled-quote": { name: "Бумага + шалфей", role: "quote", scene: "quote", background: "#f3f1e9", foreground: "#171814", accent: "#5f6f54", ink: "#171814" },
    "dark-quote": { name: "Бордо + пудра", role: "quote", scene: "quote", background: "#541f2a", foreground: "#fbf5ef", accent: "#e9a692", ink: "#fbf5ef" },
    "photo-caption": { name: "Фото + молочная полоса", role: "quote", scene: "plate", background: "#fbfaf5", foreground: "#171814", accent: "#e9a692", ink: "#171814" },
  };
  const sceneLabels = {
    "photo-dim": "Фото + затемнение",
    "photo-clean": "Текст на фото",
    plate: "Плашка на фото",
    field: "Цветовое поле",
    paper: "Светлое поле",
    dark: "Тёмное поле",
    split: "Split",
    window: "Фото-окно",
    quote: "Цитатная",
  };
  const roleLabels = { cover: "Обложка", longread: "Лонгрид", quote: "Цитата", proof: "Фото-доказательство", pause: "Фотопауза", cta: "Финал / CTA" };

  const ui = {
    saveState: document.querySelector("#carouselSaveState"),
    status: document.querySelector("#carouselStudioStatus"),
    seriesName: document.querySelector("#carouselSeriesName"),
    formatSwitch: document.querySelector("#carouselFormatSwitch"),
    formatHint: document.querySelector("#carouselFormatHint"),
    coverDimensions: document.querySelector("#carouselCoverDimensions"),
    exportDescription: document.querySelector("#carouselExportDescription"),
    fontStrip: document.querySelector("#carouselFontStrip"),
    fontSummary: document.querySelector("#carouselFontSummary"),
    importTaste: document.querySelector("#carouselImportTaste"),
    paletteStrip: document.querySelector("#carouselPaletteStrip"),
    savedCount: document.querySelector("#carouselSavedCount"),
    newSeries: document.querySelector("#carouselNewSeries"),
    saveSeries: document.querySelector("#carouselSaveSeries"),
    coverCanvas: document.querySelector("#carouselCoverCanvas"),
    coverTitle: document.querySelector("#carouselCoverTitle"),
    coverSubtitle: document.querySelector("#carouselCoverSubtitle"),
    coverSize: document.querySelector("#carouselCoverSize"),
    coverSizeValue: document.querySelector("#carouselCoverSizeValue"),
    coverPlacement: document.querySelector("#carouselCoverPlacement"),
    coverAlign: document.querySelector("#carouselCoverAlign"),
    coverCase: document.querySelector("#carouselCoverCase"),
    coverOffsetX: document.querySelector("#carouselCoverOffsetX"),
    coverOffsetXValue: document.querySelector("#carouselCoverOffsetXValue"),
    coverOffsetY: document.querySelector("#carouselCoverOffsetY"),
    coverOffsetYValue: document.querySelector("#carouselCoverOffsetYValue"),
    coverShowSeries: document.querySelector("#carouselCoverShowSeries"),
    coverShowNumber: document.querySelector("#carouselCoverShowNumber"),
    coverBackgroundColor: document.querySelector("#carouselCoverBackgroundColor"),
    coverBackgroundReset: document.querySelector("#carouselCoverBackgroundReset"),
    coverTitleColor: document.querySelector("#carouselCoverTitleColor"),
    coverTitleColorReset: document.querySelector("#carouselCoverTitleColorReset"),
    coverTitleWeight: document.querySelector("#carouselCoverTitleWeight"),
    coverTitleWeightValue: document.querySelector("#carouselCoverTitleWeightValue"),
    coverTitleLineHeight: document.querySelector("#carouselCoverTitleLineHeight"),
    coverTitleLineHeightValue: document.querySelector("#carouselCoverTitleLineHeightValue"),
    coverTitleTracking: document.querySelector("#carouselCoverTitleTracking"),
    coverTitleTrackingValue: document.querySelector("#carouselCoverTitleTrackingValue"),
    coverPhotoScale: document.querySelector("#carouselCoverPhotoScale"),
    coverPhotoScaleValue: document.querySelector("#carouselCoverPhotoScaleValue"),
    coverPhotoFocusX: document.querySelector("#carouselCoverPhotoFocusX"),
    coverPhotoFocusXValue: document.querySelector("#carouselCoverPhotoFocusXValue"),
    coverPhotoFocusY: document.querySelector("#carouselCoverPhotoFocusY"),
    coverPhotoFocusYValue: document.querySelector("#carouselCoverPhotoFocusYValue"),
    coverPlaqueEnabled: document.querySelector("#carouselCoverPlaqueEnabled"),
    coverPlaqueColor: document.querySelector("#carouselCoverPlaqueColor"),
    coverPlaqueOpacity: document.querySelector("#carouselCoverPlaqueOpacity"),
    coverPlaqueOpacityValue: document.querySelector("#carouselCoverPlaqueOpacityValue"),
    coverMedia: document.querySelector("#carouselCoverMedia"),
    coverMediaSearch: document.querySelector("#carouselCoverMediaSearch"),
    coverPhotoName: document.querySelector("#carouselCoverPhotoName"),
    saveCover: document.querySelector("#carouselSaveCover"),
    downloadCover: document.querySelector("#carouselDownloadSlide"),
    longread: document.querySelector("#carouselLongreadText"),
    longreadWords: document.querySelector("#carouselLongreadWords"),
    slideCount: document.querySelector("#carouselSlideCount"),
    splitMath: document.querySelector("#carouselSplitMath"),
    keepParagraphs: document.querySelector("#carouselKeepParagraphs"),
    photoRhythm: document.querySelector("#carouselPhotoRhythm"),
    splitText: document.querySelector("#carouselSplitText"),
    splitHint: document.querySelector("#carouselSplitHint"),
    splitPreview: document.querySelector("#carouselSplitPreview"),
    slideRail: document.querySelector("#carouselSlideRail"),
    activeCanvas: document.querySelector("#carouselActiveCanvas"),
    activeTitle: document.querySelector("#carouselActiveTitle"),
    activeMeta: document.querySelector("#carouselActiveMeta"),
    slideTitle: document.querySelector("#carouselSlideTitle"),
    slideBody: document.querySelector("#carouselSlideBody"),
    richToolbar: document.querySelector("#carouselRichToolbar"),
    slideRole: document.querySelector("#carouselSlideRole"),
    slideScene: document.querySelector("#carouselSlideScene"),
    slidePalette: document.querySelector("#carouselSlidePalette"),
    slideFont: document.querySelector("#carouselSlideFont"),
    slideTemplate: document.querySelector("#carouselSlideTemplate"),
    slideBackgroundColor: document.querySelector("#carouselSlideBackgroundColor"),
    slideBackgroundReset: document.querySelector("#carouselSlideBackgroundReset"),
    slideTexture: document.querySelector("#carouselSlideTexture"),
    slideTitleColor: document.querySelector("#carouselSlideTitleColor"),
    slideTitleColorReset: document.querySelector("#carouselSlideTitleColorReset"),
    slideTitleWeight: document.querySelector("#carouselSlideTitleWeight"),
    slideTitleWeightValue: document.querySelector("#carouselSlideTitleWeightValue"),
    slideTitleLineHeight: document.querySelector("#carouselSlideTitleLineHeight"),
    slideTitleLineHeightValue: document.querySelector("#carouselSlideTitleLineHeightValue"),
    slideTitleTracking: document.querySelector("#carouselSlideTitleTracking"),
    slideTitleTrackingValue: document.querySelector("#carouselSlideTitleTrackingValue"),
    slideBodyFont: document.querySelector("#carouselSlideBodyFont"),
    slideBodyWeight: document.querySelector("#carouselSlideBodyWeight"),
    slideBodyWeightValue: document.querySelector("#carouselSlideBodyWeightValue"),
    slideBodyLineHeight: document.querySelector("#carouselSlideBodyLineHeight"),
    slideBodyLineHeightValue: document.querySelector("#carouselSlideBodyLineHeightValue"),
    slideBodyTracking: document.querySelector("#carouselSlideBodyTracking"),
    slideBodyTrackingValue: document.querySelector("#carouselSlideBodyTrackingValue"),
    slidePhotoScale: document.querySelector("#carouselSlidePhotoScale"),
    slidePhotoScaleValue: document.querySelector("#carouselSlidePhotoScaleValue"),
    slidePhotoFocusX: document.querySelector("#carouselSlidePhotoFocusX"),
    slidePhotoFocusXValue: document.querySelector("#carouselSlidePhotoFocusXValue"),
    slidePhotoFocusY: document.querySelector("#carouselSlidePhotoFocusY"),
    slidePhotoFocusYValue: document.querySelector("#carouselSlidePhotoFocusYValue"),
    slidePlaqueEnabled: document.querySelector("#carouselSlidePlaqueEnabled"),
    slidePlaqueColor: document.querySelector("#carouselSlidePlaqueColor"),
    slidePlaqueOpacity: document.querySelector("#carouselSlidePlaqueOpacity"),
    slidePlaqueOpacityValue: document.querySelector("#carouselSlidePlaqueOpacityValue"),
    slideSize: document.querySelector("#carouselSlideSize"),
    slideSizeValue: document.querySelector("#carouselSlideSizeValue"),
    slideBodySize: document.querySelector("#carouselSlideBodySize"),
    slideBodySizeValue: document.querySelector("#carouselSlideBodySizeValue"),
    slidePlacement: document.querySelector("#carouselSlidePlacement"),
    slideAlign: document.querySelector("#carouselSlideAlign"),
    slideOffsetX: document.querySelector("#carouselSlideOffsetX"),
    slideOffsetXValue: document.querySelector("#carouselSlideOffsetXValue"),
    slideOffsetY: document.querySelector("#carouselSlideOffsetY"),
    slideOffsetYValue: document.querySelector("#carouselSlideOffsetYValue"),
    slideShowSeries: document.querySelector("#carouselSlideShowSeries"),
    slideShowNumber: document.querySelector("#carouselSlideShowNumber"),
    slideMedia: document.querySelector("#carouselSlideMedia"),
    slideMediaSearch: document.querySelector("#carouselSlideMediaSearch"),
    shuffleSlideMedia: document.querySelector("#carouselShuffleSlideMedia"),
    slidePhotoName: document.querySelector("#carouselSlidePhotoName"),
    removePhoto: document.querySelector("#carouselRemovePhoto"),
    saveSlide: document.querySelector("#carouselSaveSlide"),
    downloadActive: document.querySelector("#carouselDownloadActive"),
    downloadAll: document.querySelector("#carouselDownloadAll"),
    downloadAllInline: document.querySelector("#carouselDownloadAllInline"),
    duplicateSlide: document.querySelector("#carouselDuplicateSlide"),
    uploadLocal: document.querySelector("#carouselUploadLocal"),
    uploadLocalSlide: document.querySelector("#carouselUploadLocalSlide"),
    localUpload: document.querySelector("#carouselLocalUpload"),
    savedSeries: document.querySelector("#carouselSavedSeries"),
    exportSeries: document.querySelector("#carouselExportSeries"),
    sourceTitle: document.querySelector("#postSourceTitle"),
    sourceHook: document.querySelector("#postSourceHook"),
    sourceObjective: document.querySelector("#postSourceObjective"),
    sourceAsset: document.querySelector("#postSourceAsset"),
    sourceCta: document.querySelector("#postSourceCta"),
    sourceReadiness: document.querySelector("#postSourceReadiness"),
    generateLongread: document.querySelector("#carouselGenerateLongread"),
    regenerateLongread: document.querySelector("#carouselRegenerateLongread"),
    longreadDraftState: document.querySelector("#carouselLongreadDraftState"),
  };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  const readJson = (key, fallback) => {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  };
  let tasteBundle = readJson(IMPORT_KEY, {});

  function consumeTasteImport() {
    const prefix = "#type-import=";
    if (!location.hash.startsWith(prefix)) return false;
    try {
      const imported = JSON.parse(decodeURIComponent(location.hash.slice(prefix.length)));
      if (!imported || imported.schemaVersion !== 1) throw new Error("unsupported bundle");
      tasteBundle = imported;
      localStorage.setItem(IMPORT_KEY, JSON.stringify(imported));
      history.replaceState(null, "", `${location.pathname}${location.search}`);
      return true;
    } catch {
      history.replaceState(null, "", `${location.pathname}${location.search}`);
      return false;
    }
  }
  const importedOnLoad = consumeTasteImport();
  const deepClone = (value) => JSON.parse(JSON.stringify(value));
  const shuffle = (items) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  };
  let slideMediaOrder = [...library];
  const words = (value) => String(value || "").trim().split(/\s+/).filter(Boolean);
  const plural = (number, one, few, many) => {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
    return many;
  };
  const photoById = (id) => library.find((item) => item.id === id) || null;
  const preferredPhoto = () => library.find((item) => item.orientation === "portrait" && item.carouselRoles?.includes("01_обложка_личное_присутствие")) || library.find((item) => item.orientation === "portrait") || library[0] || null;

  let localMediaDbPromise;

  function openLocalMediaDb() {
    if (!window.indexedDB) return Promise.reject(new Error("IndexedDB unavailable"));
    if (localMediaDbPromise) return localMediaDbPromise;
    localMediaDbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(LOCAL_MEDIA_DB, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(LOCAL_MEDIA_STORE)) db.createObjectStore(LOCAL_MEDIA_STORE, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB open failed"));
    });
    return localMediaDbPromise;
  }

  async function localMediaTransaction(mode, action) {
    const db = await openLocalMediaDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(LOCAL_MEDIA_STORE, mode);
      const store = transaction.objectStore(LOCAL_MEDIA_STORE);
      let request;
      try { request = action(store); } catch (error) { reject(error); return; }
      transaction.oncomplete = () => resolve(request?.result);
      transaction.onerror = () => reject(transaction.error || request?.error || new Error("IndexedDB transaction failed"));
      transaction.onabort = () => reject(transaction.error || new Error("IndexedDB transaction aborted"));
    });
  }

  function persistentRecord(item, file) {
    return {
      id: item.id,
      fileName: item.fileName,
      blob: file,
      poster: item.kind === "video" ? item.thumb : "",
      width: item.width,
      height: item.height,
      duration: item.duration || 0,
      originalDuration: item.originalDuration || 0,
      orientation: item.orientation,
      kind: item.kind,
      createdAt: new Date().toISOString(),
    };
  }

  async function persistLocalMedia(item, file) {
    await localMediaTransaction("readwrite", (store) => store.put(persistentRecord(item, file)));
    item.isPersistentLocal = true;
    navigator.storage?.persist?.().catch(() => {});
  }

  function restoredLocalItem(record) {
    const source = URL.createObjectURL(record.blob);
    return {
      id: record.id,
      folder: "local",
      folderLabel: "С компьютера · сохранено в браузере",
      sourceCategory: record.kind === "video" ? "Личное видео" : "Личное фото",
      sourceFolder: "Локальная загрузка",
      fileName: record.fileName,
      originalPath: "Локальный файл",
      originalUrl: "",
      thumb: record.kind === "video" ? record.poster : source,
      exportImage: source,
      width: record.width,
      height: record.height,
      duration: record.duration || 0,
      originalDuration: record.originalDuration || 0,
      orientation: record.orientation,
      contentThemes: [],
      carouselRoles: ["01_обложка_личное_присутствие"],
      kind: record.kind,
      isLocal: true,
      isPersistentLocal: true,
    };
  }

  async function restoreLocalMedia() {
    try {
      const records = await localMediaTransaction("readonly", (store) => store.getAll());
      const restored = (records || []).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).filter((record) => record?.blob && !photoById(record.id)).map(restoredLocalItem);
      if (!restored.length) return 0;
      library.unshift(...restored);
      slideMediaOrder = [...restored, ...slideMediaOrder];
      renderAll();
      return restored.length;
    } catch {
      return 0;
    }
  }

  function localImageItem(file) {
    return new Promise((resolve, reject) => {
      const thumb = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => resolve({
        id: `mama-local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        folder: "local",
        folderLabel: "С компьютера · локально",
        sourceCategory: "Личное фото",
        sourceFolder: "Локальная загрузка",
        fileName: file.name,
        originalPath: "Локальный файл",
        originalUrl: "",
        thumb,
        exportImage: thumb,
        width: image.naturalWidth,
        height: image.naturalHeight,
        orientation: image.naturalWidth === image.naturalHeight ? "square" : image.naturalWidth > image.naturalHeight ? "landscape" : "portrait",
        contentThemes: [],
        carouselRoles: ["01_обложка_личное_присутствие"],
        kind: "image",
        isLocal: true,
      });
      image.onerror = () => { URL.revokeObjectURL(thumb); reject(new Error(file.name)); };
      image.src = thumb;
    });
  }

  function localVideoItem(file) {
    return new Promise((resolve, reject) => {
      const source = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0 || !video.videoWidth || !video.videoHeight) {
          URL.revokeObjectURL(source);
          reject(new Error(file.name));
          return;
        }
        const capture = () => {
          try {
            const posterCanvas = document.createElement("canvas");
            const ratio = Math.min(1, 720 / Math.max(video.videoWidth, video.videoHeight));
            posterCanvas.width = Math.max(1, Math.round(video.videoWidth * ratio));
            posterCanvas.height = Math.max(1, Math.round(video.videoHeight * ratio));
            posterCanvas.getContext("2d").drawImage(video, 0, 0, posterCanvas.width, posterCanvas.height);
            resolve({
              id: `mama-video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              folder: "local",
              folderLabel: "С компьютера · локально",
              sourceCategory: "Личное видео",
              sourceFolder: "Локальная загрузка",
              fileName: file.name,
              originalPath: "Локальный файл",
              originalUrl: "",
              thumb: posterCanvas.toDataURL("image/jpeg", .82),
              exportImage: source,
              width: video.videoWidth,
              height: video.videoHeight,
              duration: Math.min(MAX_VIDEO_SECONDS, video.duration),
              originalDuration: video.duration,
              orientation: video.videoWidth === video.videoHeight ? "square" : video.videoWidth > video.videoHeight ? "landscape" : "portrait",
              contentThemes: [],
              carouselRoles: ["01_обложка_личное_присутствие"],
              kind: "video",
              isLocal: true,
            });
          } catch {
            URL.revokeObjectURL(source);
            reject(new Error(file.name));
          }
        };
        video.onseeked = capture;
        video.currentTime = Math.min(.12, Math.max(0, video.duration / 2));
        if (video.currentTime === 0) capture();
      };
      video.onerror = () => { URL.revokeObjectURL(source); reject(new Error(file.name)); };
      video.src = source;
    });
  }

  async function addLocalMedia(files, target = "active") {
    const candidates = [...files].filter((file) => {
      if (/\.(jpe?g|png|webp)$/i.test(file.name)) return file.size <= 25 * 1024 * 1024;
      if (/\.(mp4|mov|webm)$/i.test(file.name)) return file.size <= 250 * 1024 * 1024;
      return false;
    });
    if (!candidates.length) {
      setStatus("Выберите JPG, PNG или WebP до 25 МБ либо MP4, MOV или WebM до 250 МБ.");
      return;
    }
    setStatus("Добавляю фото и видео с компьютера…");
    const results = await Promise.allSettled(candidates.map(async (file) => {
      const item = await (/\.(mp4|mov|webm)$/i.test(file.name) ? localVideoItem(file) : localImageItem(file));
      try { await persistLocalMedia(item, file); } catch { item.persistenceFailed = true; }
      return item;
    }));
    const added = results.filter((result) => result.status === "fulfilled").map((result) => result.value);
    if (!added.length) {
      setStatus("Не удалось открыть выбранные файлы. Для видео надёжнее всего использовать MP4.");
      return;
    }
    library.unshift(...added);
    slideMediaOrder = [...added, ...slideMediaOrder];
    const targetSlide = target === "cover" ? coverSlide() : activeSlide();
    targetSlide.photoId = added[0].id;
    if (["paper", "field", "dark", "quote"].includes(targetSlide.scene)) targetSlide.scene = "photo-dim";
    targetSlide.savedAt = null;
    renderAll();
    markChanged();
    const videos = added.filter((item) => item.kind === "video").length;
    const failedToPersist = added.filter((item) => item.persistenceFailed).length;
    setStatus(failedToPersist ? `${added.length} файлов добавлено, но ${failedToPersist} не поместилось в хранилище браузера. Они исчезнут после обновления.` : `${added.length} файлов сохранено в этом браузере${videos ? ` · видео: ${videos}, максимум по 1 минуте` : ""}. Они останутся после обновления страницы.`);
  }

  function fontChoices() {
    const selected = [];
    const add = (family, caseKind = "original", body = "", recipe = "") => {
      if (!family) return;
      const normalized = { family, caseKind: caseKind || "original", body: body || companionFor(family), recipe };
      normalized.key = [normalized.family, normalized.caseKind, normalized.body, normalized.recipe].join("|");
      if (selected.some((font) => font.key === normalized.key)) return;
      selected.push(normalized);
    };
    add("PT Sans Narrow", "upper", "Manrope", "система #Sekta");
    add("Golos Text", "lower", "Golos Text", "спокойный текст");
    add("Manrope", "lower", "Manrope", "мягкий современный");
    add("Literata", "original", "Onest", "редакционный акцент");
    return selected;
  }

  function companionFor(family) {
    const font = (window.CYRILLIC_FONT_DATA || []).find((item) => item.family === family);
    if (!font) return family === "Literata" ? "Onest" : "Literata";
    return ["Serif"].includes(font.category) ? "Onest" : "Literata";
  }

  function ensureFontFamily(family) {
    if (!family || ["Onest", "Golos Text", "Literata"].includes(family)) return;
    const key = family.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    if (document.querySelector(`link[data-carousel-font="${key}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.dataset.carouselFont = key;
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@400;600;700;800;900&display=swap`;
    document.head.append(link);
  }

  function ensureFont(font) {
    ensureFontFamily(font?.family);
    ensureFontFamily(font?.body);
  }

  async function loadSlideFonts(slide, slideFont) {
    const scale = series.format === "story" ? 1.5 : 1;
    const bodyFamily = slide.bodyFont || slideFont.body || companionFor(slideFont.family);
    ensureFontFamily(bodyFamily);
    try {
      await Promise.all([
        document.fonts.load(`${slide.titleWeight || 800} ${Math.round((slide.size || 46) * scale)}px "${slideFont.family}"`),
        document.fonts.load(`${slide.bodyWeight || 500} ${Math.round((slide.bodySize || 34) * scale)}px "${bodyFamily}"`),
      ]);
    } catch {}
  }

  function layoutLikeIds() {
    const importedLikes = (tasteBundle.layoutLikes || []).map((key) => String(key).split("|").at(-1));
    return [...new Set(importedLikes)].filter((id) => layoutPresets[id]);
  }

  function paletteChoices() {
    const choices = { ...palettes };
    layoutLikeIds().forEach((id) => { choices[`layout-${id}`] = { ...layoutPresets[id], sourceId: id }; });
    return choices;
  }

  function paletteFor(id) {
    return paletteChoices()[id] || palettes.ink;
  }

  function fontSystemKey(font) {
    return font?.key || [font?.family || "Onest", font?.caseKind || "original", font?.body || companionFor(font?.family || "Onest"), font?.recipe || ""].join("|");
  }

  function normalizeFontSystem(font) {
    const normalized = {
      family: font?.family || "Onest",
      caseKind: font?.caseKind || "original",
      body: font?.body || companionFor(font?.family || "Onest"),
      recipe: font?.recipe || "",
    };
    normalized.key = fontSystemKey(normalized);
    return normalized;
  }

  function makeSlide(overrides = {}) {
    return {
      id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "longread",
      title: "",
      body: "",
      bodyHtml: "",
      scene: "paper",
      palette: "ink",
      size: 46,
      bodySize: 34,
      align: "left",
      placement: "middle",
      offsetX: 0,
      offsetY: 0,
      caseKind: "original",
      font: null,
      photoId: null,
      showSeriesLabel: true,
      showPagination: true,
      template: "custom",
      backgroundColor: "",
      texture: "none",
      titleColor: "",
      titleWeight: 800,
      titleLineHeight: .96,
      titleTracking: -.035,
      bodyFont: "",
      bodyWeight: 500,
      bodyLineHeight: 1.3,
      bodyTracking: 0,
      photoScale: 1,
      photoFocusX: 50,
      photoFocusY: 50,
      plaqueEnabled: false,
      plaqueColor: "#fff7e6",
      plaqueOpacity: .92,
      savedAt: null,
      ...overrides,
    };
  }

  function defaultSeries() {
    const firstPhoto = preferredPhoto();
    const firstFont = fontChoices()[0] || { family: "Onest", caseKind: "original" };
    const series = {
      id: `series-${Date.now()}`,
      name: "Возвращение после паузы",
      font: firstFont,
      palette: "ink",
      format: "feed",
      longread: DEFAULT_LONGREAD,
      totalSlides: 10,
      activeSlide: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slides: [
        makeSlide({ role: "cover", title: "Пропустили пять дней? Ничего не сломалось", body: "10 слайдов · сохрани", scene: "photo-dim", palette: "ink", size: 88, placement: "bottom", photoId: firstPhoto?.id || null }),
        makeSlide({ role: "cta", title: "Возвращение не требует наказания", body: "Сохраните, чтобы вернуться к этой мысли в нужный день.", scene: "field", palette: "lime", size: 58 }),
      ],
    };
    return splitSeries(series, 10, true, true);
  }

  function normalizeSeries(candidate) {
    if (!candidate || !Array.isArray(candidate.slides) || candidate.slides.length < 2) return defaultSeries();
    return {
      ...candidate,
      format: formatPresets[candidate.format] ? candidate.format : "feed",
      font: normalizeFontSystem(candidate.font?.family ? candidate.font : fontChoices()[0]),
      palette: paletteChoices()[candidate.palette] ? candidate.palette : "ink",
      longread: candidate.longread || DEFAULT_LONGREAD,
      totalSlides: candidate.slides.length,
      activeSlide: Math.min(Math.max(Number(candidate.activeSlide) || 0, 0), candidate.slides.length - 1),
      slides: candidate.slides.map((slide) => makeSlide({ ...slide, font: slide.font?.family ? normalizeFontSystem(slide.font) : null })),
    };
  }

  function sentenceUnits(text) {
    return String(text || "").split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean).flatMap((paragraph, paragraphIndex) => {
      const sentences = paragraph.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || [paragraph];
      return sentences.map((sentence) => ({ text: sentence.trim(), paragraphIndex })).filter((unit) => unit.text);
    });
  }

  function splitUnit(unit, limit) {
    const unitWords = words(unit.text);
    if (unitWords.length <= limit) return [unit];
    const pieces = [];
    for (let index = 0; index < unitWords.length; index += limit) {
      pieces.push({ text: unitWords.slice(index, index + limit).join(" "), paragraphIndex: unit.paragraphIndex });
    }
    return pieces;
  }

  function distributeText(text, slots, keepParagraphs) {
    if (slots <= 0) return [];
    const totalWords = words(text).length;
    if (!totalWords) return Array.from({ length: slots }, () => "");
    const target = Math.max(12, Math.ceil(totalWords / slots));
    let units = sentenceUnits(text).flatMap((unit) => splitUnit(unit, Math.max(target, 20)));
    if (!units.length) units = [{ text: String(text).trim(), paragraphIndex: 0 }];
    while (units.length < slots) {
      const index = units.reduce((best, unit, current) => words(unit.text).length > words(units[best].text).length ? current : best, 0);
      const unitWords = words(units[index].text);
      if (unitWords.length < 2) break;
      const middle = Math.ceil(unitWords.length / 2);
      const first = { ...units[index], text: unitWords.slice(0, middle).join(" ") };
      const second = { ...units[index], text: unitWords.slice(middle).join(" ") };
      units.splice(index, 1, first, second);
    }
    const chunks = [];
    let cursor = 0;
    for (let slot = 0; slot < slots; slot += 1) {
      const remainingSlots = slots - slot;
      const remainingUnits = units.length - cursor;
      if (remainingUnits <= 0) {
        chunks.push("");
        continue;
      }
      const remainingWords = units.slice(cursor).reduce((sum, unit) => sum + words(unit.text).length, 0);
      const desired = Math.max(1, Math.ceil(remainingWords / remainingSlots));
      const selected = [];
      let selectedWords = 0;
      while (cursor < units.length) {
        const mustLeave = units.length - (cursor + 1) >= remainingSlots - 1;
        if (selected.length && selectedWords >= desired && mustLeave) break;
        selected.push(units[cursor]);
        selectedWords += words(units[cursor].text).length;
        cursor += 1;
        if (units.length - cursor === remainingSlots - 1) break;
      }
      chunks.push(selected.map((unit, index) => {
        if (!index) return unit.text;
        return keepParagraphs && unit.paragraphIndex !== selected[index - 1].paragraphIndex ? `\n\n${unit.text}` : ` ${unit.text}`;
      }).join(""));
    }
    if (cursor < units.length) chunks[chunks.length - 1] = `${chunks[chunks.length - 1]} ${units.slice(cursor).map((unit) => unit.text).join(" ")}`.trim();
    return chunks;
  }

  function splitSeries(source, total, keepParagraphs, photoRhythm) {
    const next = deepClone(source);
    const cover = next.slides[0] || makeSlide({ role: "cover" });
    const previousFinal = next.slides[next.slides.length - 1];
    const finalSlide = previousFinal?.role === "cta" ? previousFinal : makeSlide({ role: "cta", title: "Сохраните эту мысль", body: "Вернитесь к ней, когда снова захочется начать с наказания.", scene: "field", palette: "lime", size: 58 });
    const chunks = distributeText(next.longread, total - 2, keepParagraphs);
    const photos = library.filter((item) => item.orientation === "portrait").slice(0, Math.max(1, chunks.length));
    const bodySlides = chunks.map((body, index) => {
      const withPhoto = photoRhythm && index % 3 === 2;
      const scenes = ["paper", "field", "quote", "dark"];
      return makeSlide({
        role: index % 4 === 2 ? "quote" : "longread",
        body,
        scene: withPhoto ? "photo-dim" : scenes[index % scenes.length],
        palette: index % 4 === 1 ? next.palette : index % 4 === 2 ? "paper" : next.palette,
        size: words(body).length > 70 ? 34 : words(body).length > 48 ? 38 : 44,
        photoId: withPhoto ? photos[index % photos.length]?.id || null : null,
      });
    });
    next.slides = [cover, ...bodySlides, finalSlide];
    next.totalSlides = next.slides.length;
    next.activeSlide = Math.min(next.activeSlide || 0, next.slides.length - 1);
    next.updatedAt = new Date().toISOString();
    return next;
  }

  let series = normalizeSeries(readJson(DRAFT_KEY, null));
  let savedSeries = readJson(SAVED_KEY, []);
  if (!Array.isArray(savedSeries)) savedSeries = [];
  let activeStage = "cover";
  let generationVariant = 0;
  let localUploadTarget = "cover";
  let saveTimer;

  const fallbackIdea = { id: "post-1", kind: "post", title: "Возвращение без наказания", hook: "Пауза не обнуляет навык возвращаться", objective: "Теплота", asset: "Домашние фото или спокойный портрет", cta: "Рассказать, как вы возвращаетесь", readiness: "Текст + фото" };

  function activeIdea() {
    return series.idea || fallbackIdea;
  }

  function renderSource() {
    const idea = activeIdea();
    ui.sourceTitle.textContent = idea.title;
    ui.sourceHook.textContent = idea.hook;
    ui.sourceObjective.textContent = idea.objective;
    ui.sourceAsset.textContent = idea.asset;
    ui.sourceCta.textContent = idea.cta;
    ui.sourceReadiness.textContent = idea.readiness;
    document.querySelector("#postSourceBar")?.classList.toggle("needs-review", /ревью|специалист|методическ|эксперт/i.test(idea.readiness));
  }

  function generatedLongread(idea, variant = 0) {
    const hookSentence = /[.!?…]$/.test(idea.hook.trim()) ? idea.hook.trim() : `${idea.hook.trim()}.`;
    const openings = [
      `${hookSentence} Эта мысль важна именно в обычный день — не тогда, когда всё получается, а когда план снова не совпал с жизнью.`,
      `Есть момент, в котором особенно легко решить, что с вами что-то не так: ${idea.title.toLocaleLowerCase("ru")}. Но привычное объяснение здесь редко помогает.`,
      `Попробуем посмотреть на это без героизма и без чувства вины. ${hookSentence} Не как красивый лозунг, а как рабочее правило для реальной жизни.`
    ];
    const middles = [
      `Мы часто замечаем только итог: сколько минут сделали, насколько устали, выполнили ли план полностью. Но устойчивость складывается из другого — из способности заметить своё состояние, выбрать подходящий объём и не превращать движение в проверку характера.`,
      `Проблема не в недостатке силы воли. Чаще всего слишком большой следующий шаг просто не помещается в конкретный день. Тогда полезнее не уговаривать себя на максимум, а уменьшить порог входа до действия, которое действительно можно повторить.`,
      `У движения нет задачи доказать, что вы хороший человек. Оно может быть способом вернуть контакт с телом, чуть изменить состояние и оставить себе возможность продолжить завтра. Этого уже достаточно, чтобы опыт не был пустым.`
    ];
    const proof = `Для этого материала мы используем ${idea.asset.toLocaleLowerCase("ru")}. Визуал должен не изображать идеальную дисциплину, а показывать живой момент: паузу, выбор, короткое действие или возвращение к знакомому движению.`;
    const step = `Практический шаг на сегодня: сначала спросите себя не «сколько я должна сделать?», а «какой объём сейчас поддержит меня и не потребует расплаты завтра?». Выберите самый короткий честный вариант, начните с него и оставьте право остановиться.`;
    const close = `Так появляется не идеальная серия дней, а навык, который выдерживает разные обстоятельства. Если эта рамка вам подходит — ${idea.cta.toLocaleLowerCase("ru")}.`;
    const review = /ревью|специалист|методическ|эксперт/i.test(idea.readiness) ? `\n\nРедакторская пометка: формулировки о нагрузке и результате нужно проверить со специалистом перед публикацией.` : "";
    return [openings[variant % openings.length], middles[variant % middles.length], proof, step, close].join("\n\n") + review;
  }

  function generateFromIdea(advance = false) {
    if (advance) generationVariant += 1;
    const idea = activeIdea();
    series.longread = generatedLongread(idea, generationVariant);
    ui.longread.value = series.longread;
    series = splitSeries(series, Number(ui.slideCount.value || 10), ui.keepParagraphs.checked, ui.photoRhythm.checked);
    ui.longreadDraftState.textContent = `Черновик ${generationVariant + 1} · требует редакторской проверки`;
    renderAll();
    markChanged();
    setStatus(`Лонгрид по теме «${idea.title}» создан. Его можно править перед разбиением.`);
  }

  function loadIdea(detail) {
    const idea = { ...fallbackIdea, ...detail };
    series.idea = idea;
    series.name = idea.title;
    if (idea.font?.family) {
      series.font = normalizeFontSystem(idea.font);
      ensureFont(series.font);
    }
    const requestedSlides = Math.min(20, Math.max(6, Number(idea.slideCount) || 10));
    ui.slideCount.value = String(requestedSlides);
    const cover = coverSlide();
    cover.title = idea.hook;
    cover.body = idea.objective;
    if (idea.photoId && photoById(idea.photoId)) cover.photoId = idea.photoId;
    cover.savedAt = null;
    const final = series.slides.at(-1);
    if (final?.role === "cta") {
      final.title = "Что можно сделать сейчас";
      final.body = idea.cta;
      final.savedAt = null;
    }
    generationVariant = 0;
    if (idea.longread?.trim()) {
      series.longread = idea.longread.trim();
      ui.longread.value = series.longread;
      series = splitSeries(series, requestedSlides, ui.keepParagraphs.checked, ui.photoRhythm.checked);
      if (Array.isArray(idea.slides) && idea.slides.length === series.slides.length) {
        series.slides = series.slides.map((slide, index) => makeSlide({
          ...slide,
          title: idea.slides[index]?.title ?? slide.title,
          body: idea.slides[index]?.body ?? slide.body,
          role: idea.slides[index]?.role || slide.role,
        }));
      }
      if (Array.isArray(idea.visualPlan)) {
        series.slides.forEach((slide, index) => {
          const visual = idea.visualPlan[index];
          if (!visual) return;
          if (sceneLabels[visual.scene]) slide.scene = visual.scene;
          if (paletteChoices()[visual.palette]) slide.palette = visual.palette;
          if (visual.photoId && photoById(visual.photoId)) slide.photoId = visual.photoId;
          else if (["paper", "field", "dark", "quote"].includes(slide.scene)) slide.photoId = null;
        });
      }
      ui.longreadDraftState.textContent = "Сценарий из банка идей · можно редактировать";
      series.activeSlide = Math.min(Math.max(Number(idea.activeSlide) || 0, 0), series.slides.length - 1);
      renderAll();
      markChanged();
      setStatus(`Сценарий на ${requestedSlides} слайдов перенесён из банка идей.`);
    } else {
      generateFromIdea(false);
    }
    renderSource();
    renderAll();
    setStage(idea.openSlides ? "slides" : "longread");
  }

  function setStatus(message) {
    ui.status.textContent = message;
  }

  function markChanged() {
    series.updatedAt = new Date().toISOString();
    ui.saveState.classList.add("is-saving");
    ui.saveState.lastChild.textContent = "сохраняем черновик…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(series));
      ui.saveState.classList.remove("is-saving");
      ui.saveState.lastChild.textContent = "черновик сохранён локально";
    }, 180);
  }

  function displayText(text, caseKind) {
    if (caseKind === "upper") return String(text || "").toLocaleUpperCase("ru-RU");
    if (caseKind === "lower") return String(text || "").toLocaleLowerCase("ru-RU");
    return String(text || "");
  }

  function safeRichColor(value) {
    const color = String(value || "").trim();
    return /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i.test(color) ? color : "";
  }

  function sanitizeRichHtml(input) {
    const template = document.createElement("template");
    template.innerHTML = String(input || "");
    const cleanNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.nodeValue || "");
      if (node.nodeType !== Node.ELEMENT_NODE) return "";
      const tag = node.tagName.toLowerCase();
      const content = [...node.childNodes].map(cleanNode).join("");
      if (tag === "br") return "<br>";
      if (["b", "strong"].includes(tag)) return `<strong>${content}</strong>`;
      if (["p", "div"].includes(tag)) return `${content}<br><br>`;
      if (["span", "font", "mark"].includes(tag)) {
        const color = safeRichColor(node.getAttribute("color") || node.style.color);
        const background = safeRichColor(node.style.backgroundColor || (tag === "mark" ? node.getAttribute("data-color") : ""));
        const styles = [color ? `color:${color}` : "", background ? `background-color:${background}` : ""].filter(Boolean).join(";");
        return styles ? `<span style="${styles}">${content}</span>` : content;
      }
      return content;
    };
    return [...template.content.childNodes].map(cleanNode).join("");
  }

  function richBodyMarkup(slide) {
    if (slide.bodyHtml) return sanitizeRichHtml(slide.bodyHtml);
    return escapeHtml(slide.body || "").replace(/\n/g, "<br>");
  }

  function currentFormat() {
    return formatPresets[series.format] || formatPresets.feed;
  }

  function colorWithAlpha(color, opacity = 1) {
    const hex = String(color || "").replace("#", "");
    const full = hex.length === 3 ? hex.split("").map((part) => part + part).join("") : hex;
    if (!/^[0-9a-f]{6}$/i.test(full)) return `rgba(255,247,230,${opacity})`;
    return `rgba(${parseInt(full.slice(0, 2), 16)},${parseInt(full.slice(2, 4), 16)},${parseInt(full.slice(4, 6), 16)},${opacity})`;
  }

  function renderCanvas(element, slide, index) {
    if (!element || !slide) return;
    const photo = photoById(slide.photoId);
    const palette = paletteFor(slide.palette || series.palette);
    const slideFont = slide.font?.family ? normalizeFontSystem(slide.font) : series.font;
    ensureFont(slideFont);
    element.className = "carousel-slide-canvas";
    element.dataset.scene = slide.scene;
    element.dataset.palette = slide.palette;
    element.dataset.format = series.format || "feed";
    element.dataset.template = slide.template || "custom";
    element.dataset.texture = slide.texture || "none";
    element.dataset.plaque = slide.plaqueEnabled ? "on" : "off";
    element.dataset.placement = slide.placement || "middle";
    element.dataset.align = slide.align || "left";
    element.dataset.role = slide.role;
    element.style.setProperty("--carousel-head-font", `"${slideFont.family}"`);
    const bodyFamily = slide.bodyFont || slideFont.body || companionFor(slideFont.family);
    ensureFontFamily(bodyFamily);
    element.style.setProperty("--carousel-body-font", `"${bodyFamily}"`);
    element.style.setProperty("--carousel-bg", slide.backgroundColor || palette.background);
    element.style.setProperty("--carousel-fg", palette.foreground);
    element.style.setProperty("--carousel-accent", palette.accent);
    element.style.setProperty("--carousel-ink", palette.ink);
    element.style.setProperty("--carousel-title-size", `${Math.max(24, Math.round((slide.size || 46) * .48))}px`);
    element.style.setProperty("--carousel-body-size", `${Math.max(12, Math.min(31, Math.round((slide.bodySize || 34) * .48)))}px`);
    const previewForeground = slide.plaqueEnabled || slide.scene === "plate" ? palette.ink : ["paper", "quote", "field", "dark", "split"].includes(slide.scene) ? palette.foreground : "#ffffff";
    element.style.setProperty("--carousel-title-color", slide.titleColor || previewForeground);
    element.style.setProperty("--carousel-plaque-text", palette.ink);
    element.style.setProperty("--carousel-title-weight", slide.titleWeight || 800);
    element.style.setProperty("--carousel-title-line-height", slide.titleLineHeight || .96);
    element.style.setProperty("--carousel-title-tracking", `${Number(slide.titleTracking) || 0}em`);
    element.style.setProperty("--carousel-body-weight", slide.bodyWeight || 500);
    element.style.setProperty("--carousel-body-line-height", slide.bodyLineHeight || 1.3);
    element.style.setProperty("--carousel-body-tracking", `${Number(slide.bodyTracking) || 0}em`);
    element.style.setProperty("--carousel-photo-scale", slide.photoScale || 1);
    element.style.setProperty("--carousel-photo-x", `${slide.photoFocusX ?? 50}%`);
    element.style.setProperty("--carousel-photo-y", `${slide.photoFocusY ?? 50}%`);
    element.style.setProperty("--carousel-plaque", colorWithAlpha(slide.plaqueColor, slide.plaqueOpacity));
    element.style.setProperty("--carousel-offset-x", `${Number(slide.offsetX) || 0}%`);
    element.style.setProperty("--carousel-offset-y", `${Number(slide.offsetY) || 0}%`);
    const media = photo && !["paper", "field", "dark", "quote"].includes(slide.scene)
      ? photo.kind === "video"
        ? `<video class="carousel-render-photo" src="${escapeHtml(photo.exportImage)}" autoplay muted loop playsinline preload="auto"></video>`
        : `<img class="carousel-render-photo" src="${escapeHtml(photo.thumb)}" alt="">`
      : "";
    const title = slide.title ? `<strong>${escapeHtml(displayText(slide.title, slide.caseKind || slideFont.caseKind)).replace(/\n/g, "<br>")}</strong>` : "";
    const body = slide.body ? `<div class="carousel-render-body"><p>${richBodyMarkup(slide)}</p></div>` : "";
    const seriesLabel = slide.showSeriesLabel !== false ? `<span class="carousel-render-series">${escapeHtml(series.name)}</span>` : "";
    const pagination = slide.showPagination !== false ? `<small>${String(index + 1).padStart(2, "0")} / ${String(series.slides.length).padStart(2, "0")}</small>` : "";
    element.innerHTML = `${media}<div class="carousel-render-shade"></div><div class="carousel-render-texture"></div><div class="carousel-render-content">${seriesLabel}${title}${body}${pagination}</div>`;
    const video = element.querySelector("video");
    if (video) video.addEventListener("timeupdate", () => {
      if (video.currentTime >= Math.min(MAX_VIDEO_SECONDS, photo.duration || MAX_VIDEO_SECONDS)) video.currentTime = 0;
    });
  }

  function renderFontStrip() {
    const choices = fontChoices();
    const activeKey = fontSystemKey(series.font);
    if (!choices.some((font) => fontSystemKey(font) === activeKey)) choices.unshift(normalizeFontSystem(series.font));
    ui.fontSummary.textContent = `${series.font.family} × ${series.font.body} · 4 понятные системы без длинного списка шрифтов`;
    ui.fontStrip.innerHTML = choices.map((font) => {
      const key = fontSystemKey(font);
      const caseLabel = font.caseKind === "upper" ? "КАПС" : font.caseKind === "lower" ? "строчные" : "исходный регистр";
      const recipe = font.recipe && font.recipe !== "стартовая система" ? ` · ${font.recipe}` : "";
      return `<button type="button" class="carousel-font-system${key === activeKey ? " is-active" : ""}" data-carousel-system-key="${escapeHtml(key)}" style="--font-choice:'${escapeHtml(font.family)}'"><span>${escapeHtml(font.family)} <i>× ${escapeHtml(font.body)}</i></span><small>${caseLabel}${escapeHtml(recipe)}</small></button>`;
    }).join("");
    choices.forEach(ensureFont);
  }

  function renderPaletteState() {
    const choices = paletteChoices();
    ui.paletteStrip.innerHTML = Object.entries(choices).map(([id, palette]) => `<button type="button" class="carousel-palette-system${id === series.palette ? " is-active" : ""}" data-carousel-palette="${escapeHtml(id)}" aria-label="${escapeHtml(palette.name)}" style="--palette:${palette.background};--palette-2:${palette.foreground};--palette-3:${palette.accent}"><span></span><small>${escapeHtml(palette.name)}</small>${palette.sourceId ? `<em>${escapeHtml(roleLabels[palette.role] || palette.role)}</em>` : ""}</button>`).join("");
  }

  function renderSlidePaletteOptions(selectedId) {
    const choices = paletteChoices();
    ui.slidePalette.innerHTML = Object.entries(choices).map(([id, palette]) => `<option value="${escapeHtml(id)}">${escapeHtml(palette.name)}${palette.sourceId ? ` · ${roleLabels[palette.role] || palette.role}` : ""}</option>`).join("");
    ui.slidePalette.value = choices[selectedId] ? selectedId : "ink";
  }

  function renderSlideFontOptions(slide) {
    const choices = fontChoices();
    const selectedKey = slide.font?.family ? fontSystemKey(slide.font) : "series";
    ui.slideFont.innerHTML = `<option value="series">Как во всей серии · ${escapeHtml(series.font.family)}</option>${choices.map((font) => `<option value="${escapeHtml(fontSystemKey(font))}">${escapeHtml(font.family)} · ${font.caseKind === "upper" ? "КАПС" : font.caseKind === "lower" ? "строчные" : "исходный регистр"}</option>`).join("")}`;
    ui.slideFont.value = selectedKey;
    if (ui.slideFont.value !== selectedKey) ui.slideFont.value = "series";
    choices.forEach(ensureFont);
    if (ui.slideBodyFont) {
      const families = [...new Set(choices.flatMap((font) => [font.family, font.body]))];
      ui.slideBodyFont.innerHTML = `<option value="">Из шрифтовой пары</option>${families.map((family) => `<option value="${escapeHtml(family)}">${escapeHtml(family)}</option>`).join("")}`;
      ui.slideBodyFont.value = families.includes(slide.bodyFont) ? slide.bodyFont : "";
    }
  }

  function mediaPool(query = "", order = library) {
    const normalized = query.trim().toLocaleLowerCase("ru");
    const pool = normalized ? order.filter((item) => [item.fileName, item.folderLabel, ...(item.contentThemes || []), ...(item.carouselRoles || [])].join(" ").toLocaleLowerCase("ru").includes(normalized)) : order;
    return (order === library ? [...pool].sort((a, b) => Number(!!b.isLocal) - Number(!!a.isLocal) || Number(b.orientation === "portrait") - Number(a.orientation === "portrait")) : [...pool]).slice(0, 24);
  }

  function renderMediaStrip(element, selectedId, query = "", order = library) {
    const pool = mediaPool(query, order);
    element.innerHTML = pool.length ? pool.map((photo) => `<span class="carousel-media-item${photo.isLocal ? " is-local" : ""}"><button type="button" class="carousel-media-select${photo.id === selectedId ? " is-selected" : ""}" data-carousel-photo="${escapeHtml(photo.id)}" aria-label="Выбрать ${escapeHtml(photo.fileName)}"><img src="${escapeHtml(photo.thumb)}" alt="" loading="lazy">${photo.kind === "video" ? `<span class="carousel-video-badge">▶ ${Math.ceil(photo.duration)}с</span>` : ""}</button>${photo.isLocal ? `<button type="button" class="carousel-media-delete" data-delete-local-media="${escapeHtml(photo.id)}" aria-label="Удалить ${escapeHtml(photo.fileName)} из локальной медиатеки" title="Удалить из локальной медиатеки">×</button>` : ""}</span>`).join("") : `<span class="carousel-media-empty">Ничего не найдено.</span>`;
  }

  function releaseLocalMediaUrls(item) {
    if (String(item.thumb).startsWith("blob:")) URL.revokeObjectURL(item.thumb);
    if (String(item.exportImage).startsWith("blob:") && item.exportImage !== item.thumb) URL.revokeObjectURL(item.exportImage);
  }

  async function deleteLocalMedia(id) {
    const item = photoById(id);
    if (!item?.isLocal) return;
    const currentUses = series.slides.filter((slide) => slide.photoId === id).length;
    const savedUses = savedSeries.reduce((sum, saved) => sum + (saved.slides || []).filter((slide) => slide.photoId === id).length, 0);
    const uses = currentUses + savedUses;
    const warning = uses ? `Файл «${item.fileName}» используется в ${uses} карточках. Удалить его и убрать из этих карточек?` : `Удалить «${item.fileName}» из локальной медиатеки этого браузера?`;
    if (!confirm(warning)) return;
    try { await localMediaTransaction("readwrite", (store) => store.delete(id)); } catch {
      setStatus("Не получилось удалить файл из хранилища браузера.");
      return;
    }
    series.slides.forEach((slide) => {
      if (slide.photoId !== id) return;
      slide.photoId = null;
      if (!["paper", "field", "dark", "quote"].includes(slide.scene)) slide.scene = "paper";
      slide.savedAt = null;
    });
    savedSeries.forEach((saved) => (saved.slides || []).forEach((slide) => {
      if (slide.photoId !== id) return;
      slide.photoId = null;
      if (!["paper", "field", "dark", "quote"].includes(slide.scene)) slide.scene = "paper";
      slide.savedAt = null;
    }));
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedSeries));
    releaseLocalMediaUrls(item);
    const libraryIndex = library.findIndex((media) => media.id === id);
    if (libraryIndex >= 0) library.splice(libraryIndex, 1);
    slideMediaOrder = slideMediaOrder.filter((media) => media.id !== id);
    renderAll();
    markChanged();
    setStatus(`«${item.fileName}» удалён из локальной медиатеки.`);
  }

  function coverSlide() {
    return series.slides[0];
  }

  function activeSlide() {
    return series.slides[series.activeSlide] || series.slides[0];
  }

  function syncCoverForm() {
    const slide = coverSlide();
    ui.seriesName.value = series.name;
    ui.coverTitle.value = slide.title;
    ui.coverSubtitle.value = slide.body;
    ui.coverSize.value = slide.size;
    ui.coverSizeValue.textContent = `${slide.size} px`;
    syncSizePresets(ui.coverSize);
    ui.coverPlacement.value = slide.placement || "bottom";
    ui.coverAlign.value = slide.align || "left";
    ui.coverCase.value = slide.caseKind || "original";
    ui.coverOffsetX.value = slide.offsetX || 0;
    ui.coverOffsetXValue.textContent = `${Number(slide.offsetX) || 0}%`;
    ui.coverOffsetY.value = slide.offsetY || 0;
    ui.coverOffsetYValue.textContent = `${Number(slide.offsetY) || 0}%`;
    ui.coverShowSeries.checked = slide.showSeriesLabel !== false;
    ui.coverShowNumber.checked = slide.showPagination !== false;
    ui.coverBackgroundColor.value = slide.backgroundColor || paletteFor(slide.palette).background;
    ui.coverBackgroundColor.dataset.custom = String(!!slide.backgroundColor);
    ui.coverTitleColor.value = slide.titleColor || paletteFor(slide.palette).foreground;
    ui.coverTitleColor.dataset.custom = String(!!slide.titleColor);
    ui.coverTitleWeight.value = slide.titleWeight || 800;
    ui.coverTitleWeightValue.textContent = String(slide.titleWeight || 800);
    ui.coverTitleLineHeight.value = slide.titleLineHeight || .96;
    ui.coverTitleLineHeightValue.textContent = Number(slide.titleLineHeight || .96).toFixed(2);
    ui.coverTitleTracking.value = slide.titleTracking ?? -.035;
    ui.coverTitleTrackingValue.textContent = `${Number(slide.titleTracking ?? -.035).toFixed(3)} em`;
    ui.coverPhotoScale.value = Math.round((slide.photoScale || 1) * 100);
    ui.coverPhotoScaleValue.textContent = `${Math.round((slide.photoScale || 1) * 100)}%`;
    ui.coverPhotoFocusX.value = slide.photoFocusX ?? 50;
    ui.coverPhotoFocusXValue.textContent = `${slide.photoFocusX ?? 50}%`;
    ui.coverPhotoFocusY.value = slide.photoFocusY ?? 50;
    ui.coverPhotoFocusYValue.textContent = `${slide.photoFocusY ?? 50}%`;
    ui.coverPlaqueEnabled.checked = !!slide.plaqueEnabled;
    ui.coverPlaqueColor.value = slide.plaqueColor || "#fff7e6";
    ui.coverPlaqueOpacity.value = Math.round((slide.plaqueOpacity ?? .92) * 100);
    ui.coverPlaqueOpacityValue.textContent = `${Math.round((slide.plaqueOpacity ?? .92) * 100)}%`;
    ui.longread.value = series.longread;
    ui.slideCount.value = String(series.totalSlides || series.slides.length);
    document.querySelectorAll("[data-carousel-scene]").forEach((button) => button.classList.toggle("is-active", button.dataset.carouselScene === slide.scene));
    const photo = photoById(slide.photoId);
    ui.coverPhotoName.textContent = photo ? `${photo.fileName}${photo.kind === "video" ? ` · ${Math.round(photo.duration)} сек.` : ""}` : "без фото или видео";
    ui.downloadCover.textContent = photo?.kind === "video" ? "Скачать видео" : "Скачать PNG";
    renderMediaStrip(ui.coverMedia, slide.photoId, ui.coverMediaSearch.value);
  }

  function renderCover() {
    renderCanvas(ui.coverCanvas, coverSlide(), 0);
    syncCoverForm();
  }

  function renderSplitPreview() {
    const bodySlides = series.slides.slice(1, -1);
    ui.splitPreview.innerHTML = bodySlides.map((slide, index) => `<button type="button" data-edit-split="${index + 1}"><span>${String(index + 2).padStart(2, "0")}</span><strong>${escapeHtml(sceneLabels[slide.scene] || slide.scene)}</strong><p>${escapeHtml(slide.body || "Пустой слайд")}</p><small>${words(slide.body).length} ${plural(words(slide.body).length, "слово", "слова", "слов")}</small></button>`).join("");
    const count = Number(ui.slideCount.value || series.totalSlides || 10);
    ui.splitMath.innerHTML = `<strong>1 + ${Math.max(0, count - 2)} + 1</strong><span>обложка · текст · финал</span>`;
    const countWords = words(ui.longread.value).length;
    ui.longreadWords.textContent = `${countWords} ${plural(countWords, "слово", "слова", "слов")}`;
  }

  function miniSlideMarkup(slide, index) {
    const palette = paletteFor(slide.palette);
    const slideFont = slide.font?.family ? slide.font : series.font;
    const photo = photoById(slide.photoId);
    const image = photo && !["paper", "field", "dark", "quote"].includes(slide.scene) ? `<img src="${escapeHtml(photo.thumb)}" alt="">${photo.kind === "video" ? `<i class="carousel-mini-video">▶</i>` : ""}` : "";
    const label = slide.title || slide.body || roleLabels[slide.role];
    return `<button type="button" class="carousel-mini-slide${index === series.activeSlide ? " is-active" : ""}${slide.savedAt ? " is-saved" : ""}" data-carousel-slide-index="${index}" style="--mini-bg:${slide.backgroundColor || palette.background};--mini-fg:${slide.titleColor || palette.foreground};--mini-font:'${escapeHtml(slideFont.family)}';--mini-ratio:${currentFormat().ratio}"><span>${String(index + 1).padStart(2, "0")}</span><div>${image}<strong>${escapeHtml(label)}</strong></div><small>${escapeHtml(roleLabels[slide.role] || slide.role)}</small></button>`;
  }

  function renderRail() {
    ui.slideRail.innerHTML = series.slides.map(miniSlideMarkup).join("");
  }

  function syncActiveForm() {
    const slide = activeSlide();
    ui.activeTitle.textContent = `Слайд ${series.activeSlide + 1}`;
    ui.activeMeta.textContent = `${roleLabels[slide.role] || slide.role} · ${slide.savedAt ? "сохранён" : "есть изменения"}`;
    ui.slideTitle.value = slide.title || "";
    ui.slideBody.innerHTML = richBodyMarkup(slide);
    ui.slideRole.value = slide.role;
    ui.slideScene.value = slide.scene;
    renderSlidePaletteOptions(slide.palette);
    renderSlideFontOptions(slide);
    ui.slideTemplate.value = layoutTemplates[slide.template] ? slide.template : "custom";
    ui.slideBackgroundColor.value = slide.backgroundColor || paletteFor(slide.palette).background;
    ui.slideBackgroundColor.dataset.custom = String(!!slide.backgroundColor);
    ui.slideTexture.value = slide.texture || "none";
    ui.slideTitleColor.value = slide.titleColor || paletteFor(slide.palette).foreground;
    ui.slideTitleColor.dataset.custom = String(!!slide.titleColor);
    ui.slideTitleWeight.value = slide.titleWeight || 800;
    ui.slideTitleWeightValue.textContent = String(slide.titleWeight || 800);
    ui.slideTitleLineHeight.value = slide.titleLineHeight || .96;
    ui.slideTitleLineHeightValue.textContent = Number(slide.titleLineHeight || .96).toFixed(2);
    ui.slideTitleTracking.value = slide.titleTracking ?? -.035;
    ui.slideTitleTrackingValue.textContent = `${Number(slide.titleTracking ?? -.035).toFixed(3)} em`;
    ui.slideBodyWeight.value = slide.bodyWeight || 500;
    ui.slideBodyWeightValue.textContent = String(slide.bodyWeight || 500);
    ui.slideBodyLineHeight.value = slide.bodyLineHeight || 1.3;
    ui.slideBodyLineHeightValue.textContent = Number(slide.bodyLineHeight || 1.3).toFixed(2);
    ui.slideBodyTracking.value = slide.bodyTracking || 0;
    ui.slideBodyTrackingValue.textContent = `${Number(slide.bodyTracking || 0).toFixed(3)} em`;
    ui.slidePhotoScale.value = Math.round((slide.photoScale || 1) * 100);
    ui.slidePhotoScaleValue.textContent = `${Math.round((slide.photoScale || 1) * 100)}%`;
    ui.slidePhotoFocusX.value = slide.photoFocusX ?? 50;
    ui.slidePhotoFocusXValue.textContent = `${slide.photoFocusX ?? 50}%`;
    ui.slidePhotoFocusY.value = slide.photoFocusY ?? 50;
    ui.slidePhotoFocusYValue.textContent = `${slide.photoFocusY ?? 50}%`;
    ui.slidePlaqueEnabled.checked = !!slide.plaqueEnabled;
    ui.slidePlaqueColor.value = slide.plaqueColor || "#fff7e6";
    ui.slidePlaqueOpacity.value = Math.round((slide.plaqueOpacity ?? .92) * 100);
    ui.slidePlaqueOpacityValue.textContent = `${Math.round((slide.plaqueOpacity ?? .92) * 100)}%`;
    ui.slideSize.value = slide.size;
    ui.slideSizeValue.textContent = `${slide.size} px`;
    ui.slideBodySize.value = slide.bodySize || 34;
    ui.slideBodySizeValue.textContent = `${slide.bodySize || 34} px`;
    syncSizePresets(ui.slideSize);
    syncSizePresets(ui.slideBodySize);
    ui.slidePlacement.value = slide.placement || "middle";
    ui.slideAlign.value = slide.align || "left";
    ui.slideOffsetX.value = slide.offsetX || 0;
    ui.slideOffsetXValue.textContent = `${Number(slide.offsetX) || 0}%`;
    ui.slideOffsetY.value = slide.offsetY || 0;
    ui.slideOffsetYValue.textContent = `${Number(slide.offsetY) || 0}%`;
    ui.slideShowSeries.checked = slide.showSeriesLabel !== false;
    ui.slideShowNumber.checked = slide.showPagination !== false;
    const photo = photoById(slide.photoId);
    ui.slidePhotoName.textContent = photo ? `${photo.fileName}${photo.kind === "video" ? ` · ${Math.round(photo.duration)} сек.` : ""}` : "без фото или видео";
    ui.downloadActive.textContent = photo?.kind === "video" ? "Скачать видео" : "Скачать PNG";
    ui.removePhoto.disabled = !slide.photoId;
    renderMediaStrip(ui.slideMedia, slide.photoId, ui.slideMediaSearch.value, slideMediaOrder);
  }

  function renderActiveEditor() {
    renderCanvas(ui.activeCanvas, activeSlide(), series.activeSlide);
    syncActiveForm();
    renderRail();
  }

  function renderSaved() {
    ui.savedCount.textContent = savedSeries.length ? `${savedSeries.length} ${plural(savedSeries.length, "серия", "серии", "серий")}` : "пока нет серий";
    if (!savedSeries.length) {
      ui.savedSeries.innerHTML = `<div class="carousel-saved-empty"><strong>Здесь появятся собранные карусели</strong><span>Сохраните текущую серию — вместе останутся тексты, сцены, фотографии, цвета и шрифт.</span></div>`;
      return;
    }
    ui.savedSeries.innerHTML = savedSeries.map((item) => {
      const cover = item.slides?.[0] || {};
      const photo = photoById(cover.photoId);
      const palette = paletteFor(item.palette);
      return `<article class="carousel-saved-card"><div class="carousel-saved-cover" style="--saved-bg:${palette.background};--saved-fg:${palette.foreground};--saved-font:'${escapeHtml(item.font?.family || "Onest")}'">${photo ? `<img src="${escapeHtml(photo.thumb)}" alt="">` : ""}<strong>${escapeHtml(cover.title || item.name)}</strong></div><div class="carousel-saved-copy"><span>${item.slides.length} слайдов · ${escapeHtml(item.font?.family || "Onest")} × ${escapeHtml(item.font?.body || companionFor(item.font?.family || "Onest"))}</span><h3>${escapeHtml(item.name)}</h3><small>${new Date(item.updatedAt).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</small><div><button class="button button-primary" type="button" data-load-series="${escapeHtml(item.id)}">Открыть</button><button class="button button-secondary" type="button" data-duplicate-series="${escapeHtml(item.id)}">Копия</button><button class="button button-quiet" type="button" data-delete-series="${escapeHtml(item.id)}">Удалить</button></div></div></article>`;
    }).join("");
  }

  function renderAll() {
    const format = currentFormat();
    ui.formatSwitch?.querySelectorAll("[data-carousel-format]").forEach((button) => {
      const active = button.dataset.carouselFormat === series.format;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (ui.formatHint) ui.formatHint.textContent = `${format.label} · фото и видео обрезаются под формат`;
    if (ui.coverDimensions) ui.coverDimensions.textContent = format.label;
    if (ui.exportDescription) ui.exportDescription.textContent = `Скачать всю серию одним ZIP · ${format.label}`;
    renderSource();
    renderFontStrip();
    renderPaletteState();
    renderCover();
    renderSplitPreview();
    renderActiveEditor();
    renderSaved();
  }

  function setStage(stage, focus = false) {
    activeStage = stage;
    document.querySelectorAll("[data-carousel-stage]").forEach((button) => {
      const active = button.dataset.carouselStage === stage;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus();
    });
    document.querySelectorAll("[data-carousel-stage-panel]").forEach((panel) => {
      const active = panel.dataset.carouselStagePanel === stage;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
    if (stage === "cover") renderCover();
    if (stage === "longread") renderSplitPreview();
    if (stage === "slides") renderActiveEditor();
    if (stage === "saved") renderSaved();
  }

  function updateCoverFromForm() {
    const slide = coverSlide();
    series.name = ui.seriesName.value.trim() || "Новая серия";
    slide.title = ui.coverTitle.value;
    slide.body = ui.coverSubtitle.value;
    slide.size = Number(ui.coverSize.value);
    slide.placement = ui.coverPlacement.value;
    slide.align = ui.coverAlign.value;
    slide.caseKind = ui.coverCase.value;
    slide.offsetX = Number(ui.coverOffsetX.value);
    slide.offsetY = Number(ui.coverOffsetY.value);
    slide.showSeriesLabel = ui.coverShowSeries.checked;
    slide.showPagination = ui.coverShowNumber.checked;
    slide.backgroundColor = ui.coverBackgroundColor.dataset.custom === "true" ? ui.coverBackgroundColor.value : "";
    slide.titleColor = ui.coverTitleColor.dataset.custom === "true" ? ui.coverTitleColor.value : "";
    slide.titleWeight = Number(ui.coverTitleWeight.value);
    slide.titleLineHeight = Number(ui.coverTitleLineHeight.value);
    slide.titleTracking = Number(ui.coverTitleTracking.value);
    slide.photoScale = Number(ui.coverPhotoScale.value) / 100;
    slide.photoFocusX = Number(ui.coverPhotoFocusX.value);
    slide.photoFocusY = Number(ui.coverPhotoFocusY.value);
    slide.plaqueEnabled = ui.coverPlaqueEnabled.checked;
    slide.plaqueColor = ui.coverPlaqueColor.value;
    slide.plaqueOpacity = Number(ui.coverPlaqueOpacity.value) / 100;
    slide.savedAt = null;
    ui.coverSizeValue.textContent = `${slide.size} px`;
    ui.coverOffsetXValue.textContent = `${slide.offsetX}%`;
    ui.coverOffsetYValue.textContent = `${slide.offsetY}%`;
    ui.coverTitleWeightValue.textContent = String(slide.titleWeight);
    ui.coverTitleLineHeightValue.textContent = slide.titleLineHeight.toFixed(2);
    ui.coverTitleTrackingValue.textContent = `${slide.titleTracking.toFixed(3)} em`;
    ui.coverPhotoScaleValue.textContent = `${Math.round(slide.photoScale * 100)}%`;
    ui.coverPhotoFocusXValue.textContent = `${slide.photoFocusX}%`;
    ui.coverPhotoFocusYValue.textContent = `${slide.photoFocusY}%`;
    ui.coverPlaqueOpacityValue.textContent = `${Math.round(slide.plaqueOpacity * 100)}%`;
    renderCanvas(ui.coverCanvas, slide, 0);
    markChanged();
  }

  function updateActiveFromForm() {
    const slide = activeSlide();
    slide.title = ui.slideTitle.value;
    slide.body = ui.slideBody.innerText.trim();
    slide.bodyHtml = sanitizeRichHtml(ui.slideBody.innerHTML);
    slide.role = ui.slideRole.value;
    slide.scene = ui.slideScene.value;
    slide.palette = ui.slidePalette.value;
    slide.size = Number(ui.slideSize.value);
    slide.bodySize = Number(ui.slideBodySize.value);
    slide.placement = ui.slidePlacement.value;
    slide.align = ui.slideAlign.value;
    slide.offsetX = Number(ui.slideOffsetX.value);
    slide.offsetY = Number(ui.slideOffsetY.value);
    slide.showSeriesLabel = ui.slideShowSeries.checked;
    slide.showPagination = ui.slideShowNumber.checked;
    slide.template = ui.slideTemplate.value;
    slide.backgroundColor = ui.slideBackgroundColor.dataset.custom === "true" ? ui.slideBackgroundColor.value : "";
    slide.texture = ui.slideTexture.value;
    slide.titleColor = ui.slideTitleColor.dataset.custom === "true" ? ui.slideTitleColor.value : "";
    slide.titleWeight = Number(ui.slideTitleWeight.value);
    slide.titleLineHeight = Number(ui.slideTitleLineHeight.value);
    slide.titleTracking = Number(ui.slideTitleTracking.value);
    slide.bodyFont = ui.slideBodyFont.value;
    slide.bodyWeight = Number(ui.slideBodyWeight.value);
    slide.bodyLineHeight = Number(ui.slideBodyLineHeight.value);
    slide.bodyTracking = Number(ui.slideBodyTracking.value);
    slide.photoScale = Number(ui.slidePhotoScale.value) / 100;
    slide.photoFocusX = Number(ui.slidePhotoFocusX.value);
    slide.photoFocusY = Number(ui.slidePhotoFocusY.value);
    slide.plaqueEnabled = ui.slidePlaqueEnabled.checked;
    slide.plaqueColor = ui.slidePlaqueColor.value;
    slide.plaqueOpacity = Number(ui.slidePlaqueOpacity.value) / 100;
    slide.savedAt = null;
    ui.slideSizeValue.textContent = `${slide.size} px`;
    ui.slideBodySizeValue.textContent = `${slide.bodySize} px`;
    ui.slideOffsetXValue.textContent = `${slide.offsetX}%`;
    ui.slideOffsetYValue.textContent = `${slide.offsetY}%`;
    ui.slideTitleWeightValue.textContent = String(slide.titleWeight);
    ui.slideTitleLineHeightValue.textContent = slide.titleLineHeight.toFixed(2);
    ui.slideTitleTrackingValue.textContent = `${slide.titleTracking.toFixed(3)} em`;
    ui.slideBodyWeightValue.textContent = String(slide.bodyWeight);
    ui.slideBodyLineHeightValue.textContent = slide.bodyLineHeight.toFixed(2);
    ui.slideBodyTrackingValue.textContent = `${slide.bodyTracking.toFixed(3)} em`;
    ui.slidePhotoScaleValue.textContent = `${Math.round(slide.photoScale * 100)}%`;
    ui.slidePhotoFocusXValue.textContent = `${slide.photoFocusX}%`;
    ui.slidePhotoFocusYValue.textContent = `${slide.photoFocusY}%`;
    ui.slidePlaqueOpacityValue.textContent = `${Math.round(slide.plaqueOpacity * 100)}%`;
    renderCanvas(ui.activeCanvas, slide, series.activeSlide);
    ui.activeMeta.textContent = `${roleLabels[slide.role] || slide.role} · есть изменения`;
    renderRail();
    markChanged();
  }

  function saveCurrentSlide(index = series.activeSlide) {
    const slide = series.slides[index];
    if (!slide) return;
    slide.savedAt = new Date().toISOString();
    markChanged();
    renderRail();
    if (index === series.activeSlide) syncActiveForm();
    setStatus(`Слайд ${index + 1} сохранён внутри черновика.`);
  }

  function saveWholeSeries() {
    series.updatedAt = new Date().toISOString();
    series.slides.forEach((slide) => { if (!slide.savedAt) slide.savedAt = series.updatedAt; });
    const existing = savedSeries.findIndex((item) => item.id === series.id);
    const snapshot = deepClone(series);
    if (existing >= 0) savedSeries.splice(existing, 1, snapshot);
    else savedSeries.unshift(snapshot);
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedSeries));
    localStorage.setItem(DRAFT_KEY, JSON.stringify(series));
    renderSaved();
    renderRail();
    setStatus(`Серия «${series.name}» сохранена: ${series.slides.length} слайдов.`);
  }

  function performSplit() {
    const text = ui.longread.value.trim();
    if (!text) {
      ui.splitHint.textContent = "Сначала вставьте текст лонгрида.";
      ui.longread.focus();
      return;
    }
    const total = Number(ui.slideCount.value);
    series.longread = text;
    series = splitSeries(series, total, ui.keepParagraphs.checked, ui.photoRhythm.checked);
    ui.splitHint.textContent = `Текст разложен на ${total} слайдов без сокращений. Каждый кадр можно править отдельно.`;
    renderAll();
    markChanged();
    setStatus(`Лонгрид разложен: обложка, ${total - 2} текстовых слайдов и финал.`);
  }

  function loadImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = location.protocol === "file:" && !/^https?:/.test(source) ? new URL(source, window.location.href).href : source;
    });
  }

  function mediaDimensions(media) {
    return { width: media.videoWidth || media.naturalWidth || media.width, height: media.videoHeight || media.naturalHeight || media.height };
  }

  function cropImage(context, image, x, y, width, height, focusX = 50, focusY = 50, zoom = 1) {
    const dimensions = mediaDimensions(image);
    const scale = Math.max(width / dimensions.width, height / dimensions.height) * Math.max(1, Number(zoom) || 1);
    const sourceWidth = Math.min(dimensions.width, width / scale);
    const sourceHeight = Math.min(dimensions.height, height / scale);
    const sourceX = Math.max(0, Math.min(dimensions.width - sourceWidth, (dimensions.width - sourceWidth) * (Number(focusX) || 0) / 100));
    const sourceY = Math.max(0, Math.min(dimensions.height - sourceHeight, (dimensions.height - sourceHeight) * (Number(focusY) || 0) / 100));
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  }

  function drawCanvasTexture(context, slide, width, height) {
    if (slide.texture === "none") return;
    context.save();
    context.globalAlpha = slide.texture === "dots" ? .12 : .08;
    context.fillStyle = slide.titleColor || paletteFor(slide.palette).foreground;
    if (slide.texture === "dots") {
      for (let y = 12; y < height; y += 24) for (let x = 12; x < width; x += 24) context.fillRect(x, y, 2, 2);
    } else {
      let seed = 17;
      const count = slide.texture === "grain" ? 6000 : 1200;
      for (let i = 0; i < count; i += 1) {
        seed = (seed * 16807) % 2147483647;
        const x = seed % width;
        seed = (seed * 16807) % 2147483647;
        const y = seed % height;
        context.fillRect(x, y, slide.texture === "grain" ? 1 : 2, 1);
      }
    }
    context.restore();
  }

  function loadVideo(source, seekTo = 0) {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.onloadedmetadata = () => {
        const target = Math.min(Math.max(0, seekTo), Math.max(0, video.duration - .02));
        if (target > 0) {
          video.onseeked = () => resolve(video);
          video.currentTime = target;
        } else if (video.readyState >= 2) resolve(video);
        else video.onloadeddata = () => resolve(video);
      };
      video.onerror = reject;
      video.src = source;
    });
  }

  function wrapCanvasText(context, text, maxWidth) {
    const result = [];
    const sourceLines = String(text || "").replace(/\r/g, "").split("\n");
    sourceLines.forEach((paragraph) => {
      if (!paragraph.trim()) {
        result.push("");
        return;
      }
      let line = "";
      words(paragraph).forEach((word) => {
        const candidate = line ? `${line} ${word}` : word;
        if (line && context.measureText(candidate).width > maxWidth) {
          result.push(line);
          line = word;
        } else line = candidate;
      });
      if (line) result.push(line);
    });
    return result;
  }

  function renderedTextLines(element) {
    if (!element) return [];
    const wordsByLine = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const value = node.nodeValue || "";
      for (const match of value.matchAll(/\S+/gu)) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const rect = range.getClientRects()[0];
        if (!rect) continue;
        let line = wordsByLine.find((item) => Math.abs(item.top - rect.top) < 1.5);
        if (!line) {
          line = { top: rect.top, words: [] };
          wordsByLine.push(line);
        }
        line.words.push({ left: rect.left, text: match[0] });
      }
    }
    return wordsByLine
      .sort((a, b) => a.top - b.top)
      .map((line) => line.words.sort((a, b) => a.left - b.left).map((word) => word.text).join(" "));
  }

  async function measureSlidePreview(slide, index) {
    let element = slide === coverSlide() ? ui.coverCanvas : index === series.activeSlide && slide === activeSlide() ? ui.activeCanvas : null;
    let temporary = false;
    if (!element?.isConnected || !element.getBoundingClientRect().width) {
      temporary = true;
      element = document.createElement("div");
      element.style.cssText = `position:fixed;left:-10000px;top:0;width:${series.format === "story" ? 360 : 520}px;max-width:none;visibility:hidden;pointer-events:none`;
      document.body.append(element);
      renderCanvas(element, slide, index);
    }
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const elementRect = element.getBoundingClientRect();
    const content = element.querySelector(".carousel-render-content");
    const title = content?.querySelector(":scope > strong");
    const body = content?.querySelector(".carousel-render-body");
    const seriesLabel = content?.querySelector(".carousel-render-series");
    const pagination = content?.querySelector(":scope > small");
    const scale = currentFormat().width / elementRect.width;
    const rectFor = (node) => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return {
        left: (rect.left - elementRect.left) * scale,
        top: (rect.top - elementRect.top) * scale,
        right: (rect.right - elementRect.left) * scale,
        bottom: (rect.bottom - elementRect.top) * scale,
        width: rect.width * scale,
        height: rect.height * scale,
      };
    };
    const styleFor = (node) => {
      if (!node) return null;
      const style = getComputedStyle(node);
      return {
        fontFamily: style.fontFamily,
        fontSize: parseFloat(style.fontSize) * scale,
        fontWeight: style.fontWeight,
        lineHeight: parseFloat(style.lineHeight) * scale,
        letterSpacing: style.letterSpacing === "normal" ? 0 : parseFloat(style.letterSpacing) * scale,
        textTransform: style.textTransform,
      };
    };
    const measured = {
      titleLines: renderedTextLines(title),
      content: rectFor(content),
      title: rectFor(title),
      body: rectFor(body),
      seriesLabel: rectFor(seriesLabel),
      pagination: rectFor(pagination),
      titleStyle: styleFor(title),
      bodyStyle: styleFor(body?.querySelector("p")),
      seriesStyle: styleFor(seriesLabel),
      paginationStyle: styleFor(pagination),
    };
    if (temporary) element.remove();
    return measured;
  }

  function richRuns(slide) {
    const root = document.createElement("div");
    root.innerHTML = richBodyMarkup(slide);
    const runs = [];
    const visit = (node, style = {}) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.nodeValue) runs.push({ text: node.nodeValue, ...style });
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.tagName === "BR") {
        runs.push({ text: "\n", ...style });
        return;
      }
      const next = { ...style };
      if (["B", "STRONG"].includes(node.tagName)) next.bold = true;
      const color = safeRichColor(node.style.color || node.getAttribute("color"));
      const background = safeRichColor(node.style.backgroundColor);
      if (color) next.color = color;
      if (background) next.background = background;
      [...node.childNodes].forEach((child) => visit(child, next));
    };
    [...root.childNodes].forEach((node) => visit(node));
    return runs.length ? runs : [{ text: slide.body || "" }];
  }

  function layoutRichLines(context, runs, maxWidth, size, family, weight = 500) {
    const lines = [];
    let line = { segments: [], width: 0 };
    let pendingSpace = false;
    const pushLine = () => { lines.push(line); line = { segments: [], width: 0 }; pendingSpace = false; };
    runs.forEach((run) => {
      String(run.text || "").split(/(\n|\s+)/).forEach((token) => {
        if (!token) return;
        if (token === "\n") { pushLine(); return; }
        if (/^\s+$/.test(token)) { pendingSpace = line.segments.length > 0; return; }
        context.font = `${run.bold ? 800 : weight} ${size}px ${family}`;
        let text = pendingSpace ? ` ${token}` : token;
        let width = context.measureText(text).width;
        if (line.segments.length && line.width + width > maxWidth) {
          pushLine();
          text = token;
          width = context.measureText(text).width;
        }
        line.segments.push({ text, width, bold: !!run.bold, color: run.color || "", background: run.background || "" });
        line.width += width;
        pendingSpace = false;
      });
    });
    if (line.segments.length || !lines.length) lines.push(line);
    while (lines.length > 1 && !lines.at(-1).segments.length) lines.pop();
    return lines;
  }

  function drawRichLines(context, lines, x, firstBaseline, align, size, family, fallbackColor, weight = 500, lineHeight = 1.3) {
    lines.forEach((line, lineIndex) => {
      const baseline = firstBaseline + lineIndex * size * lineHeight;
      let cursor = align === "center" ? x - line.width / 2 : align === "right" ? x - line.width : x;
      line.segments.forEach((segment) => {
        context.font = `${segment.bold ? 800 : weight} ${size}px ${family}`;
        if (segment.background) {
          context.fillStyle = segment.background;
          context.fillRect(cursor - 5, baseline - size * .92, segment.width + 10, size * 1.16);
        }
        context.fillStyle = segment.color || fallbackColor;
        context.textAlign = "left";
        context.fillText(segment.text, cursor, baseline);
        cursor += segment.width;
      });
    });
  }

  async function drawSlideCanvas(canvas, slide, index, suppliedMedia = null, previewLayout = null) {
    const context = canvas.getContext("2d");
    const format = currentFormat();
    const width = format.width;
    const height = format.height;
    const palette = paletteFor(slide.palette);
    const photo = photoById(slide.photoId);
    const slideFont = slide.font?.family ? normalizeFontSystem(slide.font) : series.font;
    const usesPhoto = photo && !["paper", "field", "dark", "quote"].includes(slide.scene);
    context.fillStyle = slide.backgroundColor || palette.background;
    context.fillRect(0, 0, width, height);
    if (usesPhoto) {
      const image = suppliedMedia || (photo.kind === "video" ? await loadVideo(photo.exportImage, .04) : await loadImage(photo.exportImage || photo.thumb));
      const cropArgs = [slide.photoFocusX, slide.photoFocusY, slide.photoScale];
      if (slide.scene === "split") cropImage(context, image, 600, 0, 480, height, ...cropArgs);
      else if (slide.scene === "window") cropImage(context, image, 90, format === formatPresets.story ? 120 : 90, 900, Math.round(height * (format === formatPresets.story ? .42 : .385)), ...cropArgs);
      else cropImage(context, image, 0, 0, width, height, ...cropArgs);
      if (slide.scene === "photo-dim" || slide.scene === "plate") {
        const gradient = context.createLinearGradient(0, height * .18, 0, height);
        gradient.addColorStop(0, "rgba(10,16,14,.08)");
        gradient.addColorStop(1, "rgba(10,16,14,.88)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      }
    }
    drawCanvasTexture(context, slide, width, height);
    const lightScene = ["paper", "quote", "field", "dark"].includes(slide.scene) || slide.scene === "split";
    const foreground = lightScene ? palette.foreground : "#ffffff";
    const titleColor = slide.titleColor || (slide.plaqueEnabled || slide.scene === "plate" ? palette.ink : foreground);
    context.fillStyle = foreground;
    context.textAlign = slide.align || "left";
    context.textBaseline = "alphabetic";
    const xShift = (Number(slide.offsetX) || 0) * 10.8;
    const yShift = (Number(slide.offsetY) || 0) * height / 100;
    const fallbackX = (slide.align === "center" ? 540 : slide.align === "right" ? 980 : 100) + xShift;
    const x = previewLayout?.title ? (slide.align === "center" ? (previewLayout.title.left + previewLayout.title.right) / 2 : slide.align === "right" ? previewLayout.title.right : previewLayout.title.left) : fallbackX;
    const maxWidth = previewLayout?.content?.width || (slide.scene === "split" ? 440 : 880);
    const fontFamily = previewLayout?.titleStyle?.fontFamily || `"${slideFont.family}", Arial, sans-serif`;
    const bodyFontFamily = previewLayout?.bodyStyle?.fontFamily || `"${slide.bodyFont || slideFont.body || companionFor(slideFont.family)}", Arial, sans-serif`;
    const titleText = displayText(slide.title, slide.caseKind || slideFont.caseKind);
    let titleSize = previewLayout?.titleStyle?.fontSize || Math.max(40, Math.min(132, Number(slide.size) || 46));
    const titleWeight = previewLayout?.titleStyle?.fontWeight || slide.titleWeight || 800;
    context.font = `${titleWeight} ${titleSize}px ${fontFamily}`;
    if ("letterSpacing" in context) context.letterSpacing = previewLayout?.titleStyle ? `${previewLayout.titleStyle.letterSpacing}px` : `${Number(slide.titleTracking) || 0}em`;
    let titleLines = previewLayout?.titleLines?.length ? previewLayout.titleLines : wrapCanvasText(context, titleText, maxWidth);
    while (!previewLayout && titleLines.length > 6 && titleSize > 42) {
      titleSize -= 4;
      context.font = `${slide.titleWeight || 800} ${titleSize}px ${fontFamily}`;
      titleLines = wrapCanvasText(context, titleText, maxWidth);
    }
    const bodySize = previewLayout?.bodyStyle?.fontSize || Math.max(24, Math.min(64, Number(slide.bodySize) || Math.round(titleSize * .55)));
    const bodyWeight = previewLayout?.bodyStyle?.fontWeight || slide.bodyWeight || 500;
    const bodyMaxWidth = previewLayout?.body?.width || maxWidth;
    const bodyLines = layoutRichLines(context, richRuns(slide), bodyMaxWidth, bodySize, bodyFontFamily, bodyWeight);
    const titleLineHeight = previewLayout?.titleStyle?.lineHeight ? previewLayout.titleStyle.lineHeight / titleSize : slide.titleLineHeight || .96;
    const bodyLineHeight = previewLayout?.bodyStyle?.lineHeight ? previewLayout.bodyStyle.lineHeight / bodySize : slide.bodyLineHeight || 1.3;
    const titleHeight = titleLines.length * titleSize * titleLineHeight;
    const bodyHeight = bodyLines.length * bodySize * bodyLineHeight;
    const blockHeight = titleHeight + (titleLines.length && bodyLines.length ? 50 : 0) + bodyHeight;
    let startY = slide.placement === "top" ? (format === formatPresets.story ? 230 : 210) : slide.placement === "bottom" ? height - (format === formatPresets.story ? 260 : 170) - blockHeight : (height - blockHeight) / 2;
    if (["window"].includes(slide.scene)) startY = Math.round(height * (format === formatPresets.story ? .56 : .533));
    startY += yShift;
    if (previewLayout?.title) startY = previewLayout.title.top;
    if (slide.scene === "plate" || slide.plaqueEnabled) {
      context.fillStyle = colorWithAlpha(slide.plaqueColor || palette.background, slide.plaqueOpacity ?? .92);
      context.beginPath();
      context.roundRect(65 + xShift, startY - titleSize, 950, blockHeight + 100, 18);
      context.fill();
    }
    context.fillStyle = titleColor;
    context.font = `${titleWeight} ${titleSize}px ${fontFamily}`;
    titleLines.forEach((line, lineIndex) => {
      context.fillText(line, x, startY + titleSize * .85 + lineIndex * titleSize * titleLineHeight, maxWidth);
    });
    let bodyY = previewLayout?.body ? previewLayout.body.top : startY + titleHeight + (titleLines.length && bodyLines.length ? 50 : 0);
    if (bodyLines.length) {
      bodyY += bodySize;
      if ("letterSpacing" in context) context.letterSpacing = previewLayout?.bodyStyle ? `${previewLayout.bodyStyle.letterSpacing}px` : `${Number(slide.bodyTracking) || 0}em`;
      const bodyX = previewLayout?.body ? (slide.align === "center" ? (previewLayout.body.left + previewLayout.body.right) / 2 : slide.align === "right" ? previewLayout.body.right : previewLayout.body.left) : x;
      drawRichLines(context, bodyLines, bodyX, bodyY, slide.align || "left", bodySize, bodyFontFamily, slide.plaqueEnabled || slide.scene === "plate" ? palette.ink : foreground, bodyWeight, bodyLineHeight);
    }
    if ("letterSpacing" in context) context.letterSpacing = "0px";
    context.font = `700 ${format === formatPresets.story ? 32 : 24}px Arial, sans-serif`;
    context.fillStyle = foreground;
    if (slide.showSeriesLabel !== false) {
      context.textAlign = "left";
      const labelStyle = previewLayout?.seriesStyle;
      const labelText = labelStyle?.textTransform === "uppercase" ? series.name.toLocaleUpperCase("ru-RU") : series.name;
      if (labelStyle) context.font = `${labelStyle.fontWeight} ${labelStyle.fontSize}px ${labelStyle.fontFamily}`;
      context.fillText(labelText, previewLayout?.seriesLabel?.left ?? 100, (previewLayout?.seriesLabel?.top ?? (format === formatPresets.story ? 230 : 90)) + (labelStyle?.fontSize || 0) * .85);
    }
    if (slide.showPagination !== false) {
      context.textAlign = "right";
      const pageStyle = previewLayout?.paginationStyle;
      if (pageStyle) context.font = `${pageStyle.fontWeight} ${pageStyle.fontSize}px ${pageStyle.fontFamily}`;
      context.fillText(`${String(index + 1).padStart(2, "0")} / ${String(series.slides.length).padStart(2, "0")}`, previewLayout?.pagination?.right ?? 980, (previewLayout?.pagination?.top ?? (height - (format === formatPresets.story ? 230 : 70))) + (pageStyle?.fontSize || 0) * .85);
    }
    return canvas;
  }

  async function makeSlideCanvas(slide, index, suppliedMedia = null) {
    const canvas = document.createElement("canvas");
    canvas.width = currentFormat().width;
    canvas.height = currentFormat().height;
    const previewLayout = await measureSlidePreview(slide, index);
    await drawSlideCanvas(canvas, slide, index, suppliedMedia, previewLayout);
    return canvas;
  }

  function createVideoRecorder(stream) {
    const types = ["video/mp4;codecs=avc1.42E01E", "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
    for (const mime of types) {
      if (!window.MediaRecorder?.isTypeSupported(mime)) continue;
      try { return new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 }); } catch {}
    }
    return new MediaRecorder(stream, { videoBitsPerSecond: 5_000_000 });
  }

  async function makeVideoSlideBlob(slide, index, onProgress = () => {}) {
    const photo = photoById(slide.photoId);
    if (photo?.kind !== "video" || !window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) throw new Error("video export unsupported");
    const video = await loadVideo(photo.exportImage, 0);
    const duration = Math.min(MAX_VIDEO_SECONDS, photo.duration || video.duration, video.duration);
    const canvas = document.createElement("canvas");
    canvas.width = currentFormat().width;
    canvas.height = currentFormat().height;
    const previewLayout = await measureSlidePreview(slide, index);
    await drawSlideCanvas(canvas, slide, index, video, previewLayout);
    const stream = canvas.captureStream(30);
    const recorder = createVideoRecorder(stream);
    const chunks = [];
    const finished = new Promise((resolve, reject) => {
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = () => reject(recorder.error || new Error("video recorder error"));
      recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
    });
    try {
      recorder.start(1000);
      video.currentTime = 0;
      await video.play();
      await new Promise((resolve, reject) => {
        let drawing = false;
        const frame = async () => {
          if (drawing) { requestAnimationFrame(frame); return; }
          drawing = true;
          try {
            await drawSlideCanvas(canvas, slide, index, video, previewLayout);
            onProgress(Math.min(1, video.currentTime / duration));
            if (video.currentTime >= duration || video.ended) {
              video.pause();
              resolve();
              return;
            }
          } catch (error) { reject(error); return; }
          finally { drawing = false; }
          requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      });
      recorder.stop();
      const blob = await finished;
      return { blob, extension: recorder.mimeType.startsWith("video/mp4") ? "mp4" : "webm" };
    } catch (error) {
      video.pause();
      if (recorder.state !== "inactive") recorder.stop();
      throw error;
    } finally {
      stream.getTracks().forEach((track) => track.stop());
    }
  }

  async function downloadSlide(slide, index) {
    try {
      const media = photoById(slide.photoId);
      const slideFont = slide.font?.family ? normalizeFontSystem(slide.font) : series.font;
      ensureFont(slideFont);
      await loadSlideFonts(slide, slideFont);
      let blob;
      let extension;
      if (media?.kind === "video") {
        setStatus("Собираю видеокарточку · до 1 минуты…");
        const result = await makeVideoSlideBlob(slide, index, (progress) => setStatus(`Собираю видео: ${Math.round(progress * 100)}%`));
        blob = result.blob;
        extension = result.extension;
      } else {
        setStatus(`Собираем PNG ${currentFormat().label}…`);
        const canvas = await makeSlideCanvas(slide, index);
        blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        extension = "png";
      }
      if (!blob) throw new Error("empty export");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${series.name.toLocaleLowerCase("ru-RU").replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "") || "carousel"}-${String(index + 1).padStart(2, "0")}.${extension}`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      setStatus(`Слайд ${index + 1} скачан: ${extension.toUpperCase()}.`);
    } catch {
      setStatus("Файл не собрался. Для видеокарточки используйте свежий Chrome или Edge и MP4-видео.");
    }
  }

  const zipCrcTable = (() => {
    const table = new Uint32Array(256);
    for (let value = 0; value < 256; value += 1) {
      let crc = value;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
      table[value] = crc >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc = 0xffffffff;
    bytes.forEach((byte) => { crc = zipCrcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8); });
    return (crc ^ 0xffffffff) >>> 0;
  }

  function zipDateTime(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    return {
      time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
      date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    };
  }

  function makeZip(entries) {
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    const stamp = zipDateTime();
    let offset = 0;
    entries.forEach((entry) => {
      const name = encoder.encode(entry.name);
      const data = entry.data;
      const checksum = crc32(data);
      const local = new Uint8Array(30 + name.length + data.length);
      const localView = new DataView(local.buffer);
      localView.setUint32(0, 0x04034b50, true);
      localView.setUint16(4, 20, true);
      localView.setUint16(6, 0x0800, true);
      localView.setUint16(8, 0, true);
      localView.setUint16(10, stamp.time, true);
      localView.setUint16(12, stamp.date, true);
      localView.setUint32(14, checksum, true);
      localView.setUint32(18, data.length, true);
      localView.setUint32(22, data.length, true);
      localView.setUint16(26, name.length, true);
      local.set(name, 30);
      local.set(data, 30 + name.length);
      localParts.push(local);

      const central = new Uint8Array(46 + name.length);
      const centralView = new DataView(central.buffer);
      centralView.setUint32(0, 0x02014b50, true);
      centralView.setUint16(4, 20, true);
      centralView.setUint16(6, 20, true);
      centralView.setUint16(8, 0x0800, true);
      centralView.setUint16(10, 0, true);
      centralView.setUint16(12, stamp.time, true);
      centralView.setUint16(14, stamp.date, true);
      centralView.setUint32(16, checksum, true);
      centralView.setUint32(20, data.length, true);
      centralView.setUint32(24, data.length, true);
      centralView.setUint16(28, name.length, true);
      centralView.setUint32(42, offset, true);
      central.set(name, 46);
      centralParts.push(central);
      offset += local.length;
    });
    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, offset, true);
    return new Blob([...localParts, ...centralParts, end], { type: "application/zip" });
  }

  async function downloadAllSlides() {
    const buttons = [ui.downloadAll, ui.downloadAllInline].filter(Boolean);
    const labels = buttons.map((button) => button.textContent);
    buttons.forEach((button) => { button.disabled = true; });
    try {
      const entries = [];
      const base = series.name.toLocaleLowerCase("ru-RU").replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "") || "carousel";
      for (let index = 0; index < series.slides.length; index += 1) {
        buttons.forEach((button) => { button.textContent = `Собираю ${index + 1} / ${series.slides.length}…`; });
        setStatus(`Собираю карточку ${index + 1} из ${series.slides.length}…`);
        const slide = series.slides[index];
        const slideFont = slide.font?.family ? normalizeFontSystem(slide.font) : series.font;
        ensureFont(slideFont);
        await loadSlideFonts(slide, slideFont);
        const media = photoById(slide.photoId);
        let blob;
        let extension;
        if (media?.kind === "video") {
          const result = await makeVideoSlideBlob(slide, index, (progress) => {
            const percent = Math.round(progress * 100);
            buttons.forEach((button) => { button.textContent = `Видео ${index + 1}: ${percent}%`; });
            setStatus(`Собираю видеокарточку ${index + 1} из ${series.slides.length}: ${percent}%`);
          });
          blob = result.blob;
          extension = result.extension;
        } else {
          const canvas = await makeSlideCanvas(slide, index);
          blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
          extension = "png";
        }
        if (!blob) throw new Error("empty export");
        entries.push({ name: `${base}-${String(index + 1).padStart(2, "0")}.${extension}`, data: new Uint8Array(await blob.arrayBuffer()) });
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(makeZip(entries));
      link.download = `${base}-${series.slides.length}-cards.zip`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1500);
      setStatus(`Готово: ${series.slides.length} карточек скачаны одним ZIP · PNG и видео лежат по порядку.`);
    } catch {
      setStatus("Не получилось собрать ZIP. Попробуйте скачать активную карточку отдельно.");
    } finally {
      buttons.forEach((button, index) => { button.disabled = false; button.textContent = labels[index]; });
    }
  }

  function syncSizePresets(input) {
    document.querySelectorAll(`[data-size-target="${input.id}"] [data-size]`).forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.size) === Number(input.value));
    });
  }

  function exportSeries() {
    const blob = new Blob([JSON.stringify(series, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${series.name.toLocaleLowerCase("ru-RU").replace(/[^a-zа-яё0-9]+/gi, "-") || "carousel"}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    setStatus("Структура серии экспортирована в JSON.");
  }

  document.querySelectorAll("[data-carousel-stage]").forEach((button) => button.addEventListener("click", () => setStage(button.dataset.carouselStage)));
  document.querySelector(".carousel-studio-tabs").addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = [...document.querySelectorAll("[data-carousel-stage]")];
    const current = Math.max(0, tabs.indexOf(document.activeElement));
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    event.preventDefault();
    setStage(tabs[next].dataset.carouselStage, true);
  });
  document.querySelectorAll("[data-carousel-go]").forEach((button) => button.addEventListener("click", () => setStage(button.dataset.carouselGo)));

  ui.formatSwitch?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-carousel-format]");
    if (!button || !formatPresets[button.dataset.carouselFormat]) return;
    series.format = button.dataset.carouselFormat;
    series.slides.forEach((slide) => { slide.savedAt = null; });
    renderAll();
    markChanged();
    setStatus(`${currentFormat().name} включён · экспорт ${currentFormat().label}.`);
  });

  ui.fontStrip.addEventListener("click", (event) => {
    const button = event.target.closest("[data-carousel-system-key]");
    if (!button) return;
    const choice = fontChoices().find((font) => fontSystemKey(font) === button.dataset.carouselSystemKey);
    if (!choice) return;
    series.font = normalizeFontSystem(choice);
    ensureFont(series.font);
    renderFontStrip();
    renderCover();
    renderActiveEditor();
    markChanged();
    setStatus(`${series.font.family} × ${series.font.body} применены ко всей карусели.`);
  });
  ui.paletteStrip.addEventListener("click", (event) => {
    const button = event.target.closest("[data-carousel-palette]");
    if (!button) return;
    series.palette = button.dataset.carouselPalette;
    const choice = paletteFor(series.palette);
    series.slides.forEach((slide, index) => {
      slide.palette = series.palette;
      if (choice.sourceId && ((choice.role === "cover" && index === 0) || (choice.role === "longread" && index > 0 && index < series.slides.length - 1) || (choice.role === "quote" && slide.role === "quote"))) slide.scene = choice.scene;
      slide.savedAt = null;
    });
    renderPaletteState();
    renderCover();
    renderSplitPreview();
    renderActiveEditor();
    markChanged();
    setStatus(choice.sourceId ? `Система «${choice.name}» применена вместе с подходящей сценой.` : "Палитра применена ко всей серии; любой слайд можно перекрасить отдельно.");
  });

  ui.importTaste.addEventListener("click", () => {
    series.font = normalizeFontSystem({ family: "PT Sans Narrow", caseKind: "upper", body: "Manrope" });
    series.slides.forEach((slide) => { slide.font = null; slide.savedAt = null; });
    ensureFont(series.font);
    renderAll();
    markChanged();
    setStatus("Базовая пара PT Sans Narrow × Manrope возвращена ко всей карусели.");
  });

  document.querySelectorAll(".carousel-size-presets [data-size]").forEach((button) => button.addEventListener("click", () => {
    const group = button.closest("[data-size-target]");
    const input = document.querySelector(`#${group.dataset.sizeTarget}`);
    if (!input) return;
    input.value = button.dataset.size;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    syncSizePresets(input);
  }));
  [ui.coverSize, ui.slideSize, ui.slideBodySize].forEach((input) => input.addEventListener("input", () => syncSizePresets(input)));

  ui.uploadLocal.addEventListener("click", () => {
    localUploadTarget = "cover";
    ui.localUpload.click();
  });
  ui.uploadLocalSlide.addEventListener("click", () => {
    localUploadTarget = "active";
    ui.localUpload.click();
  });
  ui.localUpload.addEventListener("change", async () => {
    await addLocalMedia(ui.localUpload.files, localUploadTarget);
    ui.localUpload.value = "";
  });

  [ui.seriesName, ui.coverTitle, ui.coverSubtitle, ui.coverSize, ui.coverPlacement, ui.coverAlign, ui.coverCase, ui.coverOffsetX, ui.coverOffsetY, ui.coverShowSeries, ui.coverShowNumber, ui.coverTitleWeight, ui.coverTitleLineHeight, ui.coverTitleTracking, ui.coverPhotoScale, ui.coverPhotoFocusX, ui.coverPhotoFocusY, ui.coverPlaqueEnabled, ui.coverPlaqueColor, ui.coverPlaqueOpacity].forEach((control) => control.addEventListener("input", updateCoverFromForm));
  ui.coverBackgroundColor.addEventListener("input", () => { ui.coverBackgroundColor.dataset.custom = "true"; updateCoverFromForm(); });
  ui.coverTitleColor.addEventListener("input", () => { ui.coverTitleColor.dataset.custom = "true"; updateCoverFromForm(); });
  ui.coverBackgroundReset.addEventListener("click", () => { ui.coverBackgroundColor.dataset.custom = "false"; coverSlide().backgroundColor = ""; renderCover(); markChanged(); });
  ui.coverTitleColorReset.addEventListener("click", () => { ui.coverTitleColor.dataset.custom = "false"; coverSlide().titleColor = ""; renderCover(); markChanged(); });
  document.querySelectorAll("[data-carousel-scene]").forEach((button) => button.addEventListener("click", () => {
    coverSlide().scene = button.dataset.carouselScene;
    coverSlide().savedAt = null;
    document.querySelectorAll("[data-carousel-scene]").forEach((choice) => choice.classList.toggle("is-active", choice === button));
    renderCanvas(ui.coverCanvas, coverSlide(), 0);
    markChanged();
  }));
  ui.coverMedia.addEventListener("click", async (event) => {
    const deleteButton = event.target.closest("[data-delete-local-media]");
    if (deleteButton) { await deleteLocalMedia(deleteButton.dataset.deleteLocalMedia); return; }
    const button = event.target.closest("[data-carousel-photo]");
    if (!button) return;
    coverSlide().photoId = button.dataset.carouselPhoto;
    if (["paper", "field", "dark", "quote"].includes(coverSlide().scene)) coverSlide().scene = "photo-dim";
    coverSlide().savedAt = null;
    renderCover();
    markChanged();
  });
  ui.coverMediaSearch.addEventListener("input", () => renderMediaStrip(ui.coverMedia, coverSlide().photoId, ui.coverMediaSearch.value));
  ui.saveCover.addEventListener("click", () => saveCurrentSlide(0));
  ui.downloadCover.addEventListener("click", () => downloadSlide(coverSlide(), 0));

  ui.longread.addEventListener("input", () => {
    series.longread = ui.longread.value;
    renderSplitPreview();
    markChanged();
  });
  ui.generateLongread?.addEventListener("click", () => generateFromIdea(false));
  ui.regenerateLongread?.addEventListener("click", () => generateFromIdea(true));
  ui.slideCount.addEventListener("change", renderSplitPreview);
  ui.splitText.addEventListener("click", performSplit);
  ui.splitPreview.addEventListener("click", (event) => {
    const button = event.target.closest("[data-edit-split]");
    if (!button) return;
    series.activeSlide = Number(button.dataset.editSplit);
    setStage("slides");
  });

  ui.slideRail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-carousel-slide-index]");
    if (!button) return;
    series.activeSlide = Number(button.dataset.carouselSlideIndex);
    renderActiveEditor();
    markChanged();
  });
  [ui.slideTitle, ui.slideBody, ui.slideRole, ui.slideScene, ui.slidePalette, ui.slideSize, ui.slideBodySize, ui.slidePlacement, ui.slideAlign, ui.slideOffsetX, ui.slideOffsetY, ui.slideShowSeries, ui.slideShowNumber, ui.slideTexture, ui.slideTitleWeight, ui.slideTitleLineHeight, ui.slideTitleTracking, ui.slideBodyFont, ui.slideBodyWeight, ui.slideBodyLineHeight, ui.slideBodyTracking, ui.slidePhotoScale, ui.slidePhotoFocusX, ui.slidePhotoFocusY, ui.slidePlaqueEnabled, ui.slidePlaqueColor, ui.slidePlaqueOpacity].forEach((control) => control.addEventListener("input", updateActiveFromForm));
  ui.slideBackgroundColor.addEventListener("input", () => { ui.slideBackgroundColor.dataset.custom = "true"; updateActiveFromForm(); });
  ui.slideTitleColor.addEventListener("input", () => { ui.slideTitleColor.dataset.custom = "true"; updateActiveFromForm(); });
  ui.slideBackgroundReset.addEventListener("click", () => { ui.slideBackgroundColor.dataset.custom = "false"; activeSlide().backgroundColor = ""; renderActiveEditor(); markChanged(); });
  ui.slideTitleColorReset.addEventListener("click", () => { ui.slideTitleColor.dataset.custom = "false"; activeSlide().titleColor = ""; renderActiveEditor(); markChanged(); });
  ui.slideTemplate.addEventListener("change", () => {
    const slide = activeSlide();
    const template = layoutTemplates[ui.slideTemplate.value] || layoutTemplates.custom;
    slide.template = ui.slideTemplate.value;
    Object.entries(template).forEach(([key, value]) => { if (key !== "name") slide[key] = value; });
    slide.savedAt = null;
    renderActiveEditor();
    markChanged();
    setStatus(ui.slideTemplate.value === "custom" ? "Свободная композиция включена." : "Готовый макет применён; текст и фото сохранены.");
  });
  ui.slideBody.addEventListener("paste", (event) => {
    event.preventDefault();
    document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
  });
  ui.slideBody.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    document.execCommand("insertHTML", false, event.shiftKey ? "<br>" : "<br><br>");
    ui.slideBody.dispatchEvent(new Event("input", { bubbles: true }));
  });
  ui.richToolbar.addEventListener("pointerdown", (event) => event.preventDefault());
  ui.richToolbar.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    ui.slideBody.focus();
    document.execCommand("styleWithCSS", false, true);
    if (button.dataset.richCommand) document.execCommand(button.dataset.richCommand, false, null);
    if (button.dataset.richColor) document.execCommand("foreColor", false, button.dataset.richColor);
    if (button.dataset.richHighlight) {
      const supported = document.execCommand("hiliteColor", false, button.dataset.richHighlight);
      if (!supported) document.execCommand("backColor", false, button.dataset.richHighlight);
    }
    ui.slideBody.dispatchEvent(new Event("input", { bubbles: true }));
  });
  ui.slideFont.addEventListener("change", () => {
    const slide = activeSlide();
    if (ui.slideFont.value === "series") slide.font = null;
    else {
      const choice = fontChoices().find((font) => fontSystemKey(font) === ui.slideFont.value);
      slide.font = choice ? normalizeFontSystem(choice) : null;
      ensureFont(slide.font || series.font);
    }
    slide.savedAt = null;
    renderActiveEditor();
    markChanged();
    setStatus(slide.font ? `${slide.font.family} применён только к слайду ${series.activeSlide + 1}.` : `Слайд ${series.activeSlide + 1} снова использует шрифт всей серии.`);
  });
  ui.slideMedia.addEventListener("click", async (event) => {
    const deleteButton = event.target.closest("[data-delete-local-media]");
    if (deleteButton) { await deleteLocalMedia(deleteButton.dataset.deleteLocalMedia); return; }
    const button = event.target.closest("[data-carousel-photo]");
    if (!button) return;
    const slide = activeSlide();
    slide.photoId = button.dataset.carouselPhoto;
    if (["paper", "field", "dark", "quote"].includes(slide.scene)) slide.scene = "photo-dim";
    slide.savedAt = null;
    renderActiveEditor();
    markChanged();
  });
  ui.slideMediaSearch.addEventListener("input", () => renderMediaStrip(ui.slideMedia, activeSlide().photoId, ui.slideMediaSearch.value, slideMediaOrder));
  window.addEventListener("sekta:library-updated", () => {
    slideMediaOrder = [...library];
    renderMediaStrip(ui.coverMedia, coverSlide().photoId, ui.coverMediaSearch.value);
    renderMediaStrip(ui.slideMedia, activeSlide().photoId, ui.slideMediaSearch.value, slideMediaOrder);
  });
  ui.shuffleSlideMedia.addEventListener("click", () => {
    slideMediaOrder = shuffle(slideMediaOrder);
    renderMediaStrip(ui.slideMedia, activeSlide().photoId, ui.slideMediaSearch.value, slideMediaOrder);
    setStatus("Фотографии для этого слайда перемешаны.");
  });
  ui.removePhoto.addEventListener("click", () => {
    const slide = activeSlide();
    slide.photoId = null;
    if (!["paper", "field", "dark", "quote"].includes(slide.scene)) slide.scene = "paper";
    slide.savedAt = null;
    renderActiveEditor();
    markChanged();
  });
  ui.saveSlide.addEventListener("click", () => saveCurrentSlide());
  ui.downloadActive.addEventListener("click", () => downloadSlide(activeSlide(), series.activeSlide));
  ui.downloadAll?.addEventListener("click", downloadAllSlides);
  ui.downloadAllInline?.addEventListener("click", downloadAllSlides);
  ui.duplicateSlide.addEventListener("click", () => {
    const source = deepClone(activeSlide());
    delete source.id;
    const clone = makeSlide({ ...source, savedAt: null });
    series.slides.splice(series.activeSlide + 1, 0, clone);
    series.activeSlide += 1;
    series.totalSlides = series.slides.length;
    renderAll();
    markChanged();
    setStatus(`Слайд продублирован. В серии теперь ${series.slides.length}.`);
  });

  ui.saveSeries.addEventListener("click", saveWholeSeries);
  ui.exportSeries.addEventListener("click", exportSeries);
  ui.newSeries.addEventListener("click", () => {
    if (!confirm("Начать новую серию? Текущий черновик останется только если вы сохранили серию.")) return;
    series = defaultSeries();
    setStage("cover");
    renderAll();
    markChanged();
    setStatus("Создана новая серия. Начните с обложки.");
  });

  ui.savedSeries.addEventListener("click", (event) => {
    const load = event.target.closest("[data-load-series]");
    const duplicate = event.target.closest("[data-duplicate-series]");
    const remove = event.target.closest("[data-delete-series]");
    if (load) {
      const item = savedSeries.find((entry) => entry.id === load.dataset.loadSeries);
      if (!item) return;
      series = normalizeSeries(deepClone(item));
      setStage("cover");
      renderAll();
      markChanged();
      setStatus(`Серия «${series.name}» открыта для монтажа.`);
    }
    if (duplicate) {
      const item = savedSeries.find((entry) => entry.id === duplicate.dataset.duplicateSeries);
      if (!item) return;
      series = normalizeSeries({ ...deepClone(item), id: `series-${Date.now()}`, name: `${item.name} — копия`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      setStage("cover");
      renderAll();
      markChanged();
      setStatus("Копия серии открыта как новый черновик.");
    }
    if (remove) {
      const item = savedSeries.find((entry) => entry.id === remove.dataset.deleteSeries);
      if (!item || !confirm(`Удалить сохранённую серию «${item.name}»?`)) return;
      savedSeries = savedSeries.filter((entry) => entry.id !== item.id);
      localStorage.setItem(SAVED_KEY, JSON.stringify(savedSeries));
      renderSaved();
      setStatus("Сохранённая серия удалена.");
    }
  });

  window.addEventListener("sekta:seed-carousel-studio", (event) => {
    const detail = event.detail || {};
    const cover = coverSlide();
    if (detail.title) cover.title = detail.title;
    if (detail.subtitle) cover.body = detail.subtitle;
    if (detail.photoId) cover.photoId = detail.photoId;
    if (detail.font?.family) series.font = detail.font;
    if (paletteChoices()[detail.palette]) series.palette = detail.palette;
    cover.palette = series.palette;
    cover.savedAt = null;
    setStage("cover");
    renderAll();
    markChanged();
    setStatus("Обложка из конструктора перенесена в монтаж серии.");
  });
  window.addEventListener("sekta:open-carousel-studio", () => renderAll());
  window.addEventListener("sekta:post-builder-load", (event) => loadIdea(event.detail || fallbackIdea));
  window.addEventListener("beforeunload", () => {
    library.filter((item) => item.isLocal).forEach(releaseLocalMediaUrls);
  });

  ensureFont(series.font);
  renderAll();
  setStage("cover");
  if (importedOnLoad) {
    const choices = fontChoices();
    if (choices.length) series.font = normalizeFontSystem(choices[0]);
    const likedPalettes = layoutLikeIds();
    if (likedPalettes.length) series.palette = `layout-${likedPalettes[0]}`;
    series.slides.forEach((slide) => { slide.palette = series.palette; });
    document.querySelector('[data-view="postbuilder"]')?.click();
    renderAll();
    setStatus(`Импортировано: ${choices.length} шрифтовых вариантов, ${tasteBundle.systems?.length || 0} сохранённых систем и ${likedPalettes.length} цветовых сцен.`);
  }
  restoreLocalMedia().then((count) => {
    if (count) setStatus(`${count} ${plural(count, "файл восстановлен", "файла восстановлены", "файлов восстановлено")} из локальной медиатеки браузера.`);
  });
  markChanged();
})();
