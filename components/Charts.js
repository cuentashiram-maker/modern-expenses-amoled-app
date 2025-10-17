'use client';
import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { supabase } from '@/lib/supabaseClient';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

// Colores tipo Bootstrap (sólidos) + helper para alpha
const PALETTE = ['#0d6efd','#198754','#ffc107','#dc3545','#0dcaf0','#6f42c1','#6610f2','#20c997','#fd7e14','#6c757d'];
const withA = (hex, a=0.85) => {
  // convierte #rrggbb a rgba(r,g,b,a)
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
};

// Mejora de legibilidad en fondo negro
const axisColor = '#e5e7eb';          // texto ejes/leyenda
const gridColor = 'rgba(229,231,235,.12)'; // rejilla sutil

export default function Charts({ refreshKey = 0 }) {
  const [byMonth, setByMonth] = useState({ labels: [], data: [] });
  const [byCat, setByCat] = useState({ labels: [], data: [] });

  const load = async () => {
    const { data: mData } = await supabase.rpc('summary_monthly');
    if (mData) setByMonth({ labels: mData.map(r => r.label), data: mData.map(r => Number(r.total)) });

    const { data: cData } = await supabase.rpc('summary_categories');
    if (cData) setByCat({ labels: cData.map(r => r.category), data: cData.map(r => Number(r.total)) });
  };

  useEffect(() => { load(); }, [refreshKey]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // el alto lo manda el contenedor CSS
    plugins: {
      legend: { display: false, labels: { color: axisColor } },
      tooltip: { enabled: true }
    },
    scales: {
      x: { ticks: { color: axisColor }, grid: { color: gridColor } },
      y: { ticks: { color: axisColor }, grid: { color: gridColor } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: axisColor, boxWidth: 12 } },
      tooltip: { enabled: true }
    },
    cutout: '58'
  };

  return (
    <div className="charts-wrap">
      {/* BAR */}
      <div className="chart-block">
        <div className="h2" style={{margin:'0 0 6px'}}>Gasto por mes</div>
        <div className="chart-canvas">
          <Bar
            options={barOptions}
            data={{
              labels: byMonth.labels,
              datasets: [{
                label: 'Total mensual',
                data: byMonth.data,
                backgroundColor: withA(PALETTE[0], 0.9),
                borderColor: PALETTE[0],
                borderWidth: 0,      // sin contorno
                borderRadius: 8,
                borderSkipped: false
              }]
            }}
          />
        </div>
      </div>

      {/* DOUGHNUT */}
      <div className="chart-block">
        <div className="h2" style={{margin:'12px 0 6px'}}>Por categoría</div>
        <div className="chart-canvas">
          <Doughnut
            options={doughnutOptions}
            data={{
              labels: byCat.labels,
              datasets: [{
                label: 'Por categoría',
                data: byCat.data,
                backgroundColor: byCat.labels.map((_, i) => withA(PALETTE[i % PALETTE.length], 0.88)),
                borderWidth: 0       // sin borde blanco
              }]
            }}
          />
        </div>
      </div>
    </div>
  );
}
