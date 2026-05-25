"use strict";

const APP_VERSION = "semantic-relatedness-rating-2026-05-26-v1";

const ITEMS = [
  { condition: "homonymy", item_id: "low_nv_x27", target_word: "bolt", known_gloss: "ボルト", target_gloss: "急に逃げる", jp_fasttext_gloss_cosine: 0.16767341 },
  { condition: "homonymy", item_id: "low_nv_x13", target_word: "cap", known_gloss: "帽子", target_gloss: "上限を設ける", jp_fasttext_gloss_cosine: 0.08917291 },
  { condition: "homonymy", item_id: "homo_nv_p04", target_word: "coast", known_gloss: "海岸", target_gloss: "惰性で進む", jp_fasttext_gloss_cosine: 0.02395736 },
  { condition: "homonymy", item_id: "homo_nv_p02", target_word: "cow", known_gloss: "牛", target_gloss: "おびえさせて従わせる", jp_fasttext_gloss_cosine: 0.00789343 },
  { condition: "homonymy", item_id: "homo_nv_p07", target_word: "dog", known_gloss: "犬", target_gloss: "しつこく追跡する", jp_fasttext_gloss_cosine: 0.04609800 },
  { condition: "homonymy", item_id: "homo_nv_p03", target_word: "floor", known_gloss: "床", target_gloss: "完全に困惑させる", jp_fasttext_gloss_cosine: -0.00704886 },
  { condition: "homonymy", item_id: "low_nv_x03", target_word: "frame", known_gloss: "額縁", target_gloss: "罪を着せる", jp_fasttext_gloss_cosine: 0.04455380 },
  { condition: "homonymy", item_id: "low_nv_x25", target_word: "needle", known_gloss: "針", target_gloss: "しつこくからかう", jp_fasttext_gloss_cosine: 0.05029313 },
  { condition: "homonymy", item_id: "low_nv_x07", target_word: "pound", known_gloss: "ポンド", target_gloss: "激しく打つ", jp_fasttext_gloss_cosine: -0.04144050 },
  { condition: "homonymy", item_id: "low_nv_x24", target_word: "stomach", known_gloss: "胃", target_gloss: "我慢する", jp_fasttext_gloss_cosine: 0.05474948 },
  { condition: "polysemy", item_id: "poly_nv_p02", target_word: "chair", known_gloss: "いす", target_gloss: "議長を務める", jp_fasttext_gloss_cosine: 0.03078451 },
  { condition: "polysemy", item_id: "poly_nv_p07", target_word: "channel", known_gloss: "チャンネル", target_gloss: "向ける", jp_fasttext_gloss_cosine: 0.11898873 },
  { condition: "polysemy", item_id: "poly_nv_p11", target_word: "corner", known_gloss: "角", target_gloss: "追い詰める", jp_fasttext_gloss_cosine: 0.07535855 },
  { condition: "polysemy", item_id: "poly_nv_p10", target_word: "head", known_gloss: "頭", target_gloss: "率いる", jp_fasttext_gloss_cosine: 0.25436768 },
  { condition: "polysemy", item_id: "poly_nv_p08", target_word: "market", known_gloss: "市場", target_gloss: "売り込む", jp_fasttext_gloss_cosine: 0.25238445 },
  { condition: "polysemy", item_id: "poly_nv_p05", target_word: "mirror", known_gloss: "鏡", target_gloss: "反映する", jp_fasttext_gloss_cosine: 0.18634188 },
  { condition: "polysemy", item_id: "poly_nv_p04", target_word: "pocket", known_gloss: "ポケット", target_gloss: "自分のものにする", jp_fasttext_gloss_cosine: -0.02053400 },
  { condition: "polysemy", item_id: "poly_nv_p03", target_word: "screen", known_gloss: "画面", target_gloss: "選別する", jp_fasttext_gloss_cosine: -0.01543890 },
  { condition: "polysemy", item_id: "poly_nv_p06", target_word: "ship", known_gloss: "船", target_gloss: "発送する", jp_fasttext_gloss_cosine: -0.09619107 },
  { condition: "polysemy", item_id: "poly_nv_p09", target_word: "shoulder", known_gloss: "肩", target_gloss: "引き受ける", jp_fasttext_gloss_cosine: 0.08612008 }
];

const SCALE = [
  { value: 1, label: "全く関連していない" },
  { value: 2, label: "ほとんど関連していない" },
  { value: 3, label: "やや関連していない" },
  { value: 4, label: "どちらともいえない" },
  { value: 5, label: "やや関連している" },
  { value: 6, label: "かなり関連している" },
  { value: 7, label: "非常に関連している" }
];

const state = {
  participant: null,
  seed: null,
  randomizedItems: [],
  currentIndex: 0,
  trialStartedAt: null,
  experimentStartedAt: null,
  experimentEndedAt: null,
  responses: [],
  lastWorkbook: null,
  lastFilename: null
};

const els = {
  startScreen: document.getElementById("startScreen"),
  taskScreen: document.getElementById("taskScreen"),
  finishScreen: document.getElementById("finishScreen"),
  participantForm: document.getElementById("participantForm"),
  participantName: document.getElementById("participantName"),
  participantId: document.getElementById("participantId"),
  sessionNote: document.getElementById("sessionNote"),
  trialNumber: document.getElementById("trialNumber"),
  trialTotal: document.getElementById("trialTotal"),
  progressBar: document.getElementById("progressBar"),
  targetWord: document.getElementById("targetWord"),
  knownGloss: document.getElementById("knownGloss"),
  targetGloss: document.getElementById("targetGloss"),
  ratingForm: document.getElementById("ratingForm"),
  ratingScale: document.getElementById("ratingScale"),
  validationMessage: document.getElementById("validationMessage"),
  nextButton: document.getElementById("nextButton"),
  downloadStatus: document.getElementById("downloadStatus"),
  downloadAgainButton: document.getElementById("downloadAgainButton"),
  resetButton: document.getElementById("resetButton")
};

function nowIso() {
  return new Date().toISOString();
}

function makeSeed() {
  const values = new Uint32Array(1);
  window.crypto.getRandomValues(values);
  return values[0];
}

function mulberry32(seed) {
  return function random() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed(items, seed) {
  const random = mulberry32(seed);
  const shuffled = items.map((item, originalIndex) => ({ ...item, original_index: originalIndex + 1 }));
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.map((item, randomizedIndex) => ({ ...item, randomized_index: randomizedIndex + 1 }));
}

function sanitize(value) {
  return String(value || "")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 60) || "participant";
}

function showOnly(screen) {
  [els.startScreen, els.taskScreen, els.finishScreen].forEach((node) => {
    node.classList.toggle("hidden", node !== screen);
  });
}

function renderScale() {
  els.ratingScale.innerHTML = "";
  SCALE.forEach((point) => {
    const label = document.createElement("label");
    label.className = "rating-option";
    label.innerHTML = `
      <input type="radio" name="relatednessRating" value="${point.value}" required>
      <span>${point.value}<small>${point.label}</small></span>
    `;
    els.ratingScale.appendChild(label);
  });
}

function renderTrial() {
  const item = state.randomizedItems[state.currentIndex];
  const progressPercent = (state.currentIndex / state.randomizedItems.length) * 100;

  els.trialNumber.textContent = String(state.currentIndex + 1);
  els.trialTotal.textContent = String(state.randomizedItems.length);
  els.progressBar.style.width = `${progressPercent}%`;
  els.targetWord.textContent = item.target_word;
  els.knownGloss.textContent = item.known_gloss;
  els.targetGloss.textContent = item.target_gloss;
  els.validationMessage.textContent = "";
  els.nextButton.textContent = state.currentIndex === state.randomizedItems.length - 1 ? "完了してダウンロード" : "次へ";
  els.ratingForm.reset();
  state.trialStartedAt = performance.now();
}

function collectCurrentResponse() {
  const selected = document.querySelector("input[name='relatednessRating']:checked");
  if (!selected) {
    els.validationMessage.textContent = "評定を選択してください。";
    return false;
  }

  const item = state.randomizedItems[state.currentIndex];
  const endedAt = performance.now();
  const rating = Number(selected.value);
  const scalePoint = SCALE.find((point) => point.value === rating);

  state.responses.push({
    app_version: APP_VERSION,
    participant_id: state.participant.id,
    participant_name: state.participant.name,
    session_note: state.participant.note,
    random_seed: state.seed,
    trial_number: state.currentIndex + 1,
    randomized_index: item.randomized_index,
    original_index: item.original_index,
    condition: item.condition,
    item_id: item.item_id,
    target_word: item.target_word,
    known_gloss: item.known_gloss,
    target_gloss: item.target_gloss,
    jp_fasttext_gloss_cosine: item.jp_fasttext_gloss_cosine,
    rating_dimension: "semantic_relatedness",
    rating_value: rating,
    rating_label: scalePoint ? scalePoint.label : "",
    scale_min: 1,
    scale_max: 7,
    rt_ms: Math.round(endedAt - state.trialStartedAt),
    trial_started_at_iso: new Date(Date.now() - (endedAt - state.trialStartedAt)).toISOString(),
    trial_submitted_at_iso: nowIso(),
    user_agent: window.navigator.userAgent
  });

  return true;
}

function buildWorkbookRows() {
  const durationMs = state.experimentEndedAt && state.experimentStartedAt
    ? Math.round(state.experimentEndedAt - state.experimentStartedAt)
    : "";

  const participantRows = [{
    app_version: APP_VERSION,
    participant_id: state.participant.id,
    participant_name: state.participant.name,
    session_note: state.participant.note,
    random_seed: state.seed,
    item_count: state.randomizedItems.length,
    completed: true,
    started_at_iso: state.participant.startedAt,
    ended_at_iso: state.participant.endedAt,
    duration_ms: durationMs,
    downloaded_at_iso: nowIso(),
    browser_language: window.navigator.language,
    user_agent: window.navigator.userAgent
  }];

  const orderRows = state.randomizedItems.map((item) => ({
    participant_id: state.participant.id,
    random_seed: state.seed,
    randomized_index: item.randomized_index,
    original_index: item.original_index,
    condition: item.condition,
    item_id: item.item_id,
    target_word: item.target_word,
    known_gloss: item.known_gloss,
    target_gloss: item.target_gloss,
    jp_fasttext_gloss_cosine: item.jp_fasttext_gloss_cosine
  }));

  const codebookRows = [
    { field: "rating_value", description: "1-7 semantic relatedness rating." },
    { field: "rt_ms", description: "Milliseconds from trial render to submission." },
    { field: "random_seed", description: "Seed used for reproducible item randomization." },
    ...SCALE.map((point) => ({ field: `rating_${point.value}`, description: point.label }))
  ];

  return { participantRows, orderRows, codebookRows };
}

function buildWorkbook() {
  if (!window.XLSX) {
    throw new Error("XLSX library is not loaded.");
  }

  const workbook = XLSX.utils.book_new();
  const { participantRows, orderRows, codebookRows } = buildWorkbookRows();
  const responseSheet = XLSX.utils.json_to_sheet(state.responses);
  const participantSheet = XLSX.utils.json_to_sheet(participantRows);
  const orderSheet = XLSX.utils.json_to_sheet(orderRows);
  const codebookSheet = XLSX.utils.json_to_sheet(codebookRows);

  XLSX.utils.book_append_sheet(workbook, responseSheet, "responses");
  XLSX.utils.book_append_sheet(workbook, participantSheet, "participant");
  XLSX.utils.book_append_sheet(workbook, orderSheet, "trial_order");
  XLSX.utils.book_append_sheet(workbook, codebookSheet, "codebook");

  return workbook;
}

function makeFilename() {
  const id = sanitize(state.participant.id);
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "Z");
  return `semantic_relatedness_${id}_${timestamp}.xlsx`;
}

function downloadWorkbook() {
  try {
    if (!state.lastWorkbook) {
      state.lastWorkbook = buildWorkbook();
      state.lastFilename = makeFilename();
    }
    XLSX.writeFile(state.lastWorkbook, state.lastFilename);
    els.downloadStatus.textContent = `ファイル名: ${state.lastFilename}`;
  } catch (error) {
    els.downloadStatus.textContent = `Excelファイルを作成できませんでした: ${error.message}`;
  }
}

function finishExperiment() {
  state.experimentEndedAt = performance.now();
  state.participant.endedAt = nowIso();
  els.progressBar.style.width = "100%";
  showOnly(els.finishScreen);
  downloadWorkbook();
}

function startExperiment(event) {
  event.preventDefault();

  const name = els.participantName.value.trim();
  const id = els.participantId.value.trim();
  const note = els.sessionNote.value.trim();

  if (!name || !id) {
    return;
  }

  state.participant = {
    name,
    id,
    note,
    startedAt: nowIso(),
    endedAt: ""
  };
  state.seed = makeSeed();
  state.randomizedItems = shuffleWithSeed(ITEMS, state.seed);
  state.currentIndex = 0;
  state.responses = [];
  state.lastWorkbook = null;
  state.lastFilename = null;
  state.experimentStartedAt = performance.now();
  state.experimentEndedAt = null;

  showOnly(els.taskScreen);
  renderTrial();
}

function submitRating(event) {
  event.preventDefault();

  if (!collectCurrentResponse()) {
    return;
  }

  if (state.currentIndex >= state.randomizedItems.length - 1) {
    finishExperiment();
    return;
  }

  state.currentIndex += 1;
  renderTrial();
}

function resetExperiment() {
  state.participant = null;
  state.seed = null;
  state.randomizedItems = [];
  state.currentIndex = 0;
  state.trialStartedAt = null;
  state.experimentStartedAt = null;
  state.experimentEndedAt = null;
  state.responses = [];
  state.lastWorkbook = null;
  state.lastFilename = null;
  els.participantForm.reset();
  showOnly(els.startScreen);
}

renderScale();
els.participantForm.addEventListener("submit", startExperiment);
els.ratingForm.addEventListener("submit", submitRating);
els.downloadAgainButton.addEventListener("click", downloadWorkbook);
els.resetButton.addEventListener("click", resetExperiment);
