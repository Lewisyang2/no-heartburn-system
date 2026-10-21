const sceneData = {
  boot: {
    debt: 0, lin: 5, qian: 0, health: 100, status: 'NORMAL',
    hint: '依赖稳定，暂无隐性成本',
    logs: [['INFO', '夜市进程池已启动'], ['PASS', '林记 v3.0 健康检查通过'], ['PASS', '生产环境响应稳定']]
  },
  quality: {
    debt: 0, lin: 7, qian: 0, health: 100, status: 'NORMAL',
    hint: '全量回归完成，所有指标通过',
    logs: [['INFO', '04:00 骨汤任务开始'], ['PASS', 'dependency fresh@today'], ['PASS', '皮 / 馅 / 汤 单元测试通过']]
  },
  competition: {
    debt: 28, lin: 4, qian: 8, health: 64, status: 'WARNING',
    hint: '检测到回收油与低质量肉源',
    logs: [['WARN', '新进程 PID 0818 加入'], ['WARN', '未找到食材来源日志'], ['WARN', '技术债开始累积：¥ 286.00']]
  },
  traffic: {
    debt: 58, lin: 2, qian: 13, health: 42, status: 'WARNING',
    hint: '低价流量增长，系统风险同步放大',
    logs: [['INFO', '82% 请求迁移至 PID 0818'], ['WARN', '质量检查被主动跳过'], ['WARN', '胃部告警率持续上升']]
  },
  return: {
    debt: 77, lin: 9, qian: 7, health: 29, status: 'DEGRADED',
    hint: '真实反馈正在修正错误路由',
    logs: [['WARN', '用户反馈：夜间反酸'], ['PASS', '正确缓存键已命中：林记'], ['INFO', '请求开始回流 PID 0417']]
  },
  crash: {
    debt: 100, lin: 14, qian: 0, health: 0, status: 'FATAL',
    hint: '技术债到期：连本带利，一次清算',
    logs: [['ERROR', '3 个生产环境严重报错'], ['ERROR', '检测到污染依赖：recycled_oil'], ['FATAL', 'PID 0818 已被 KILL -9']]
  },
  recovery: {
    debt: 0, lin: 16, qian: 0, health: 0, status: 'RECOVERED',
    hint: '危险进程已移除，世界恢复稳定',
    logs: [['INFO', '隔离不安全进程完成'], ['PASS', '林记 v3.1 全量回归通过'], ['PASS', '全街胃部生产环境：零报错']]
  }
};

const chapters = [...document.querySelectorAll('.chapter')];
const terminal = document.querySelector('#terminal');
const linQueue = document.querySelector('#linQueue');
const qianQueue = document.querySelector('#qianQueue');
const qianStall = document.querySelector('#qianStall');
const qianHealth = document.querySelector('#qianHealth');
const debtValue = document.querySelector('#debtValue');
const debtBar = document.querySelector('#debtBar');
const debtHint = document.querySelector('#debtHint');
const sceneCounter = document.querySelector('#sceneCounter');
const globalDebt = document.querySelector('#globalDebt');
const globalStatus = document.querySelector('#globalStatus');
const servedRequests = document.querySelector('#servedRequests');
const runtimeClock = document.querySelector('#runtimeClock');
let currentScene = 'boot';
let requestCount = 128;
let clockSeconds = 23 * 3600 + 47 * 60 + 11;

function createQueue(container, amount) {
  container.replaceChildren();
  for (let index = 0; index < amount; index += 1) {
    const request = document.createElement('i');
    request.className = 'request';
    request.style.animationDelay = `${index * 35}ms`;
    container.append(request);
  }
}

function logClass(level) {
  if (level === 'PASS') return 'log-ok';
  if (level === 'WARN') return 'log-warn';
  if (level === 'ERROR' || level === 'FATAL') return 'log-error';
  return 'log-info';
}

function getTime(offset = 0) {
  const date = new Date();
  date.setHours(23, 47, 11 + offset);
  return date.toLocaleTimeString('zh-CN', { hour12: false });
}

function renderLogs(logs) {
  terminal.replaceChildren();
  logs.forEach(([level, text], index) => {
    const row = document.createElement('p');
    const time = document.createElement('time');
    const badge = document.createElement('span');
    time.textContent = getTime(index * 7);
    badge.textContent = level;
    badge.className = logClass(level);
    row.append(time, badge, document.createTextNode(text));
    row.style.animationDelay = `${index * 100}ms`;
    terminal.append(row);
  });
}

function updateScene(name, index) {
  if (!sceneData[name]) return;
  currentScene = name;
  const data = sceneData[name];
  sceneCounter.textContent = `${String(index + 1).padStart(2, '0')} / 07`;
  createQueue(linQueue, data.lin);
  createQueue(qianQueue, data.qian);
  qianHealth.textContent = `${data.health}%`;
  debtBar.style.width = `${data.debt}%`;
  debtValue.textContent = data.debt ? `¥ ${(data.debt * 28.6).toFixed(2)}` : '¥ 0.00';
  debtHint.textContent = data.hint;
  globalDebt.textContent = data.debt ? `¥ ${(data.debt * 28.6).toFixed(2)}` : '¥ 0.00';
  globalStatus.textContent = data.status;
  globalStatus.style.color = data.status === 'NORMAL' || data.status === 'RECOVERED' ? 'var(--green)' : data.status === 'FATAL' ? 'var(--red)' : 'var(--amber)';
  qianStall.classList.toggle('is-failed', name === 'crash' || name === 'recovery');
  renderLogs(data.logs);
}

const sceneObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  chapters.forEach((chapter) => chapter.classList.remove('is-active'));
  visible.target.classList.add('is-active');
  const index = chapters.indexOf(visible.target);
  updateScene(visible.target.dataset.scene, index);
}, { rootMargin: '-28% 0px -42% 0px', threshold: [0, .2, .5] });

chapters.forEach((chapter) => sceneObserver.observe(chapter));

function updateReadingProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  document.querySelector('#readingProgress').style.width = `${progress}%`;
}

window.addEventListener('scroll', updateReadingProgress, { passive: true });

function formatClock(total) {
  const hours = Math.floor(total / 3600) % 24;
  const minutes = Math.floor(total / 60) % 60;
  const seconds = total % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

setInterval(() => {
  clockSeconds += 1;
  runtimeClock.textContent = formatClock(clockSeconds);
  requestCount += Math.floor(Math.random() * 3);
  servedRequests.textContent = String(requestCount).padStart(6, '0');
}, 1000);

const steamField = document.querySelector('#steamField');
for (let index = 0; index < 14; index += 1) {
  const steam = document.createElement('span');
  steam.style.left = `${Math.random() * 100}%`;
  steam.style.animationDuration = `${8 + Math.random() * 10}s`;
  steam.style.animationDelay = `${-Math.random() * 12}s`;
  steamField.append(steam);
}

const dialog = document.querySelector('#principlesDialog');
document.querySelector('#openManifesto').addEventListener('click', () => dialog.showModal());
document.querySelector('#closeManifesto').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const motionToggle = document.querySelector('#motionToggle');
motionToggle.addEventListener('click', () => {
  const isPaused = document.body.classList.toggle('reduced-motion');
  motionToggle.setAttribute('aria-pressed', String(isPaused));
  motionToggle.querySelector('.toggle-label').textContent = isPaused ? '动态已暂停' : '动态运行中';
});

document.querySelector('#restoreWorld').addEventListener('click', () => {
  document.body.classList.add('is-repaired');
  document.querySelector('#restoreResult').classList.add('is-visible');
  updateScene('recovery', 6);
  globalStatus.textContent = 'HEALTHY';
  globalStatus.style.color = 'var(--green)';
  globalDebt.textContent = '¥ 0.00';
  document.querySelector('#restoreWorld').disabled = true;
  document.querySelector('#restoreWorld span').textContent = '世界已恢复';
});

createQueue(linQueue, 5);
createQueue(qianQueue, 0);
updateReadingProgress();
