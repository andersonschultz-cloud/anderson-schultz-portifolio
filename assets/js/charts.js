/**
 * charts.js — Consumo da Vida
 * Gerencia os gráficos Chart.js da Calculadora de Vida e do Planejador.
 * O gráfico SVG do Simulador está em simulator.js por estar fortemente
 * acoplado ao estado do simulador.
 */

/** Instâncias ativas dos gráficos (necessário para destruir antes de recriar). */
let chartInstance     = null; // gráfico de barras da Calculadora
let planChartInstance = null; // gráfico de rosca do Planejador

/**
 * Renderiza o gráfico de barras na Calculadora de Vida.
 * @param {number} horas - Horas necessárias
 * @param {number} dias  - Dias de trabalho
 * @param {number} perc  - Percentual do salário
 */
function renderChart(horas, dias, perc) {
  const ctx = document.getElementById('myChart');
  if (!ctx) return;
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

  const dark = isDark;
  if (typeof Chart === 'undefined') {
    drawFallbackBarChart(ctx, [horas, dias, perc], ['Horas', 'Dias', '% salário'], dark);
    return;
  }
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Horas necessárias', 'Dias de trabalho', '% do salário'],
      datasets: [{
        data: [horas, dias, perc],
        backgroundColor: dark
          ? ['#3B82F6', '#14B8A6', '#F59E0B']
          : ['#2563EB', '#0F766E', '#D97706'],
        borderRadius: 8,
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => ` ${c.parsed.y}` } },
      },
      scales: {
        y: {
          grid:  { color: dark ? 'rgba(255,255,255,.05)' : 'rgba(37,99,235,.06)' },
          ticks: { color: dark ? '#475569' : '#94A3B8', font: { size: 11 } },
        },
        x: {
          grid:  { display: false },
          ticks: { color: dark ? '#475569' : '#94A3B8', font: { size: 11 }, maxRotation: 0 },
        },
      },
    },
  });
}

/**
 * Renderiza o gráfico de rosca (doughnut) no Planejador de Compras.
 * @param {number}  pp - Percentual do produto (cap. 100%)
 * @param {number}  pr - Percentual restante da renda
 * @param {boolean} ov - Se true, o produto ultrapassa a renda (vermelho)
 */
function renderPlanChart(pp, pr, ov) {
  const ctx = document.getElementById('planChart');
  if (!ctx) return;
  if (planChartInstance) { planChartInstance.destroy(); planChartInstance = null; }

  const dark = isDark;
  if (typeof Chart === 'undefined') {
    drawFallbackDonutChart(ctx, pp, pr, ov, dark);
    return;
  }
  planChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [ov ? 'Produto (supera a renda)' : 'Produto', 'Restante da renda'],
      datasets: [{
        data: [pp, ov ? 0 : pr],
        backgroundColor: [
          ov ? '#DC2626' : (dark ? '#F59E0B' : '#D97706'),
          dark ? '#263548' : '#EFF6FF',
        ],
        borderWidth: 0,
        hoverOffset: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: dark ? '#94A3B8' : '#475569',
            font: { size: 11 },
            padding: 12,
            filter: i => !(ov && i.index === 1),
          },
        },
        tooltip: { callbacks: { label: c => ` ${c.parsed.toFixed(1)}% da renda` } },
      },
    },
  });
}

/* Fallbacks nativos: mantêm os gráficos úteis se o CDN do Chart.js estiver indisponível. */
function _canvasSize(canvas) {
  const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(280, Math.floor(rect.width || 560));
  const h = Math.max(180, Math.floor(rect.height || 260));
  canvas.width = w * ratio; canvas.height = h * ratio;
  const c = canvas.getContext('2d'); c.setTransform(ratio,0,0,ratio,0,0);
  return {c,w,h};
}
function drawFallbackBarChart(canvas, values, labels, dark) {
  const {c,w,h} = _canvasSize(canvas); c.clearRect(0,0,w,h);
  const pad=34, max=Math.max(...values,1), bw=(w-pad*2)/values.length*.52;
  c.font='11px DM Sans, sans-serif'; c.textAlign='center';
  values.forEach((v,i)=>{
    const x=pad+(i+.5)*(w-pad*2)/values.length, bh=(h-70)*(v/max);
    const g=c.createLinearGradient(0,h-40-bh,0,h-40); g.addColorStop(0,'#37c8ff'); g.addColorStop(1,'#0b6ed4');
    c.fillStyle=g; c.fillRect(x-bw/2,h-40-bh,bw,bh);
    c.fillStyle=dark?'#8ea6bb':'#49637b'; c.fillText(labels[i],x,h-18);
    c.fillStyle=dark?'#e9f4ff':'#071321'; c.fillText(Number(v).toLocaleString('pt-BR',{maximumFractionDigits:1}),x,Math.max(14,h-46-bh));
  });
}
function drawFallbackDonutChart(canvas, pp, pr, ov, dark) {
  const {c,w,h}=_canvasSize(canvas), cx=w/2, cy=h/2-8, r=Math.min(w,h)*.28, lw=Math.max(20,r*.35);
  c.clearRect(0,0,w,h); c.lineWidth=lw; c.lineCap='butt';
  c.strokeStyle=dark?'#12283b':'#dbe8f3'; c.beginPath(); c.arc(cx,cy,r,0,Math.PI*2); c.stroke();
  const ratio=Math.max(0,Math.min(1,pp/100)); c.strokeStyle=ov?'#ef4444':'#158bff'; c.beginPath(); c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*ratio); c.stroke();
  c.fillStyle=dark?'#f3f8fd':'#071321'; c.font='600 22px DM Sans, sans-serif'; c.textAlign='center'; c.fillText(`${Number(pp).toFixed(1)}%`,cx,cy+6);
  c.fillStyle=dark?'#8199af':'#607890'; c.font='11px DM Sans, sans-serif'; c.fillText(ov?'supera a renda':'da renda',cx,cy+25);
}
