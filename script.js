const sceneData = {
  boot: { label: 'BOOT', debt: 0, linHealth: 100, qianHealth: 64, linQueue: 12, qianQueue: 28, hint: '依赖稳定，暂无隐性成本', logs: [['INFO','夜市进程池启动完成'],['PASS','林记 v3.0 健康检查通过'],['INFO','首批顾客请求已接入']] },
  quality: { label: 'TESTING', debt: 0, linHealth: 100, qianHealth: 64, linQueue: 15, qianQueue: 24, hint: '全量回归完成，所有指标通过', logs: [['INFO','04:00 骨汤任务开始'],['PASS','dependency fresh@today'],['PASS','皮 / 馅 / 汤测试通过']] },
  competition: { label: 'WARNING', debt: 28, linHealth: 100, qianHealth: 58, linQueue: 8, qianQueue: 31, hint: '检测到回收油与低质量肉源', logs: [['WARN','新进程 PID 0818 加入'],['WARN','食材来源日志缺失'],['WARN','技术债开始累积']] },
  traffic: { label: 'MIGRATING', debt: 58, linHealth: 100, qianHealth: 41, linQueue: 3, qianQueue: 42, hint: '低价流量增长，系统风险同步放大', logs: [['INFO','82% 请求迁移至快香'],['WARN','质量检查被主动跳过'],['WARN','胃部告警率持续上升']] },
  return: { label: 'REROUTING', debt: 77, linHealth: 100, qianHealth: 27, linQueue: 16, qianQueue: 18, hint: '真实反馈正在修正错误路由', logs: [['WARN','用户反馈：夜间反酸'],['PASS','正确缓存键已命中：林记'],['INFO','请求开始回流']] },
  crash: { label: 'FATAL', debt: 100, linHealth: 100, qianHealth: 0, linQueue: 28, qianQueue: 0, hint: '技术债到期：连本带利，一次清算', logs: [['ERROR','3 个生产环境严重报错'],['ERROR','污染依赖：recycled_oil'],['FATAL','快香进程 KILL -9']] },
  recovery: { label: 'RECOVERED', debt: 0, linHealth: 100, qianHealth: 0, linQueue: 32, qianQueue: 0, hint: '危险进程已移除，世界恢复稳定', logs: [['INFO','不安全进程隔离完成'],['PASS','林记 v3.1 全量回归通过'],['PASS','全街生产环境零报错']] }
};

document.documentElement.scrollLeft = 0;
document.body.scrollLeft = 0;
window.addEventListener('pageshow', () => {
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
});

const chapters = [...document.querySelectorAll('.story-chapter')];
const tabs = [...document.querySelectorAll('.chapter-tab')];
const consoleLog = document.querySelector('#consoleLog');
const debtValue = document.querySelector('#debtValue');
const debtBar = document.querySelector('#debtBar');
const debtHint = document.querySelector('#debtHint');
const sceneLabel = document.querySelector('#sceneLabel');
const linHealth = document.querySelector('#linHealth');
const qianHealth = document.querySelector('#qianHealth');
const linCount = document.querySelector('#linCount');
const qianCount = document.querySelector('#qianCount');
const riskCard = document.querySelector('#riskCard');
let currentScene = 'boot';
let requests = 1482;
let clockSeconds = 22 * 3600 + 18 * 60 + 26;

function formatClock(total) {
  const hours = Math.floor(total / 3600) % 24;
  const minutes = Math.floor(total / 60) % 60;
  const seconds = total % 60;
  return [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':');
}

function makePeople(target, count, color) {
  target.replaceChildren();
  const visible = Math.min(Math.ceil(count / 2), 12);
  for (let index = 0; index < visible; index += 1) {
    const person = document.createElement('i');
    if (color) person.style.background = color;
    person.style.animationDelay = `${index * 45}ms`;
    target.append(person);
  }
}

function nowLabel(offset) {
  const value = clockSeconds + offset;
  return `[${formatClock(value)}]`;
}

function renderConsole(logs) {
  consoleLog.replaceChildren();
  logs.forEach(([level, message], index) => {
    const row = document.createElement('p');
    const time = document.createElement('time');
    const badge = document.createElement('b');
    time.textContent = nowLabel(index * 4);
    badge.textContent = level;
    badge.className = level === 'WARN' ? 'warn' : level === 'ERROR' || level === 'FATAL' ? 'error' : '';
    row.append(time, badge, document.createTextNode(message));
    row.style.animationDelay = `${index * 90}ms`;
    consoleLog.append(row);
  });
}

function setScene(name, chapterIndex) {
  const data = sceneData[name];
  if (!data) return;
  currentScene = name;
  sceneLabel.textContent = data.label;
  debtBar.style.width = `${data.debt}%`;
  debtValue.textContent = data.debt ? `¥ ${(data.debt * 28.6).toFixed(2)}` : '¥ 0.00';
  debtHint.textContent = data.hint;
  linHealth.textContent = `${data.linHealth}%`;
  qianHealth.textContent = `${data.qianHealth}%`;
  linCount.textContent = data.linQueue;
  qianCount.textContent = data.qianQueue;
  makePeople(document.querySelector('#linPeople'), data.linQueue);
  makePeople(document.querySelector('#qianPeople'), data.qianQueue, 'var(--red)');
  renderConsole(data.logs);
  riskCard.classList.toggle('is-terminated', name === 'crash');
  tabs.forEach((tab, index) => tab.classList.toggle('is-active', index === chapterIndex));
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    chapters[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    setScene(chapters[index].dataset.scene, index);
  });
});

const chapterObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  chapters.forEach(chapter => chapter.classList.remove('is-active'));
  visible.target.classList.add('is-active');
  const index = chapters.indexOf(visible.target);
  setScene(visible.target.dataset.scene, index);
}, { rootMargin: '-25% 0px -45% 0px', threshold: [0,.25,.5] });

chapters.forEach(chapter => chapterObserver.observe(chapter));

document.querySelector('#startNight').addEventListener('click', () => {
  document.querySelector('.chapter-dock').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.querySelector('#runSimulation').addEventListener('click', event => {
  const running = document.body.classList.toggle('is-running');
  event.currentTarget.lastChild.textContent = running ? ' 运行中' : ' 模拟运行';
  document.querySelector('#heroLogs').insertAdjacentHTML('beforeend', `<p><time>${nowLabel(1)}</time><b class="info">RUN</b><span>${running ? '世界模拟已启动' : '世界模拟已暂停'}</span></p>`);
});

document.querySelector('#restoreWorld').addEventListener('click', event => {
  document.body.classList.add('is-repaired');
  document.querySelector('#repairMessage').classList.add('is-visible');
  event.currentTarget.disabled = true;
  event.currentTarget.innerHTML = '<span>✓</span> 世界已恢复';
  setScene('recovery', 6);
});

window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('#pageProgress').style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
}, { passive: true });

setInterval(() => {
  clockSeconds += 1;
  requests += Math.floor(Math.random() * 3);
  document.querySelector('#liveClock').textContent = formatClock(clockSeconds);
  document.querySelector('#totalRequests').textContent = requests.toLocaleString('zh-CN');
  document.querySelector('#responseTime').textContent = `${(3 + Math.random() * .4).toFixed(1)} min`;
  document.querySelector('#stability').textContent = `${(99.6 + Math.random() * .3).toFixed(1)}%`;
}, 1000);

makePeople(document.querySelector('#linPeople'), 12);
makePeople(document.querySelector('#qianPeople'), 28, 'var(--red)');
renderConsole(sceneData.boot.logs);
