import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import ReactApexChart from 'react-apexcharts';

const StatCard = ({ label, value, icon, color }) => {
  const isStarsCard = color === '#FFD700';

  return (
    <button
      type="button"
      className={`admin-stat-card${isStarsCard ? ' is-clickable' : ''}`}
      style={{ borderRight: `4px solid ${color}` }}
      onClick={() => { if (isStarsCard) window.location.assign('/admin/stars'); }}
    >
      <div className="admin-stat-row">
        <div>
          <p className="admin-stat-label">{label}</p>
          <p className="admin-stat-value">{value}</p>
        </div>
        <div className="admin-stat-icon" style={{ background: color + '18' }}>{icon}</div>
      </div>
    </button>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [charts, setCharts] = useState({
    newsByCategory: [],
    matchesByStatus: [],
    videosByCategory: [],
    articlesByType: [],
    starsBySport: [],
    topNewsViews: [],
    newsByMonth: [],
    matchesByMonth: [],
    matchesByWeek: [],
    matchesByYear: [],
  });

  useEffect(() => {
    axios.get('/api/admin/stats').then(r => setStats(r.data)).catch(() => {});
    axios.get('/api/admin/charts').then(r => setCharts(r.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'المستخدمون', value: stats.users || 0, icon: '👥', color: '#CC0000' },
    { label: 'الأخبار', value: stats.news || 0, icon: '📰', color: '#1a73e8' },
    { label: 'المباريات', value: stats.matches || 0, icon: '⚽', color: '#00aa44' },
    { label: 'الفيديوهات', value: stats.videos || 0, icon: '🎥', color: '#ff6b00' },
    { label: 'النجوم', value: stats.stars || 0, icon: '⭐', color: '#FFD700' },
    { label: 'المقالات', value: stats.articles || 0, icon: '✍', color: '#9c27b0' },
  ];

  const newsColors = {
    football: '#1a73e8',
    basketball: '#ff6b00',
    tennis: '#00aa44',
    local: '#CC0000',
    international: '#9c27b0',
    other: '#555555',
    unknown: '#888888',
  };

  const statusColors = {
    live: '#00aa44',
    finished: '#555555',
    upcoming: '#CC0000',
    unknown: '#888888',
  };

  const videoColors = {
    highlights: '#1a73e8',
    interviews: '#ff6b00',
    analysis: '#00aa44',
    other: '#9c27b0',
    unknown: '#888888',
  };

  const articleColors = {
    analysis: '#1a73e8',
    opinion: '#ff6b00',
    report: '#00aa44',
    unknown: '#888888',
  };

  const newsLabels = {
    football: 'كرة القدم',
    basketball: 'كرة السلة',
    tennis: 'التنس',
    local: 'محلي',
    international: 'دولي',
    other: 'أخرى',
    unknown: 'غير محدد',
  };

  const statusLabels = {
    live: 'مباشر',
    finished: 'انتهت',
    upcoming: 'قادمة',
    unknown: 'غير محدد',
  };

  const videoLabels = {
    highlights: 'ملخصات',
    interviews: 'حوارات',
    analysis: 'تحليل',
    other: 'أخرى',
    unknown: 'غير محدد',
  };

  const articleLabels = {
    analysis: 'تحليل',
    opinion: 'رأي',
    report: 'تقرير',
    unknown: 'غير محدد',
  };

  const sportLabels = {
    Football: 'كرة القدم',
    Tennis: 'التنس',
    Basketball: 'كرة السلة',
    Athletics: 'ألعاب القوى',
    Swimming: 'السباحة',
    Other: 'أخرى',
  };

  const newsChartData = (charts.newsByCategory || []).map(item => ({
    key: item.name || 'unknown',
    name: newsLabels[item.name] || newsLabels.unknown,
    value: item.value,
  }));

  const matchesChartData = (charts.matchesByStatus || []).map(item => ({
    key: item.name || 'unknown',
    name: statusLabels[item.name] || statusLabels.unknown,
    value: item.value,
  }));

  const videosChartData = (charts.videosByCategory || []).map(item => ({
    key: item.name || 'unknown',
    name: videoLabels[item.name] || videoLabels.unknown,
    value: item.value,
  }));

  const articlesChartData = (charts.articlesByType || []).map(item => ({
    key: item.name || 'unknown',
    name: articleLabels[item.name] || articleLabels.unknown,
    value: item.value,
  }));

  const starsChartData = (charts.starsBySport || []).map(item => ({
    key: item.name || 'unknown',
    name: sportLabels[item.name] || item.name || 'غير محدد',
    value: item.value,
  }));

  const topNewsViewsData = (charts.topNewsViews || []).map(item => ({
    name: item.name,
    value: item.value,
  }));

  const weekDayLabels = {
    1: 'الأحد',
    2: 'الإثنين',
    3: 'الثلاثاء',
    4: 'الأربعاء',
    5: 'الخميس',
    6: 'الجمعة',
    7: 'السبت',
  };

  const matchesByMonthData = (charts.matchesByMonth || []).map(item => ({
    name: item.name,
    value: item.value,
  }));

  const matchesByWeekData = (charts.matchesByWeek || []).map(item => ({
    name: weekDayLabels[item.name] || 'غير محدد',
    value: item.value,
  }));

  const matchesByYearData = (charts.matchesByYear || []).map(item => ({
    name: item.name,
    value: item.value,
  }));

  const truncate = (text, max = 16) => {
    if (!text) return '';
    return text.length > max ? `${text.slice(0, max)}…` : text;
  };

  const baseOptions = {
    chart: { toolbar: { show: false }, fontFamily: 'inherit' },
    dataLabels: { enabled: false },
    tooltip: { theme: 'light' },
  };

  const newsDonut = {
    series: newsChartData.map(i => i.value),
    options: {
      ...baseOptions,
      chart: { ...baseOptions.chart, type: 'donut' },
      labels: newsChartData.map(i => i.name),
      colors: newsChartData.map(i => newsColors[i.key] || newsColors.unknown),
      legend: { show: false },
    },
  };

  const matchesBar = {
    series: [{ name: 'المباريات', data: matchesChartData.map(i => i.value) }],
    options: {
      ...baseOptions,
      chart: { ...baseOptions.chart, type: 'bar' },
      colors: matchesChartData.map(i => statusColors[i.key] || statusColors.unknown),
      plotOptions: { bar: { borderRadius: 6, columnWidth: '50%', distributed: true } },
      xaxis: { categories: matchesChartData.map(i => i.name) },
      yaxis: { labels: { formatter: v => Math.floor(v) } },
    },
  };

  const videosBar = {
    series: [{ name: 'الفيديوهات', data: videosChartData.map(i => i.value) }],
    options: {
      ...baseOptions,
      chart: { ...baseOptions.chart, type: 'bar' },
      colors: videosChartData.map(i => videoColors[i.key] || videoColors.unknown),
      plotOptions: { bar: { horizontal: true, borderRadius: 6, distributed: true } },
      xaxis: { categories: videosChartData.map(i => i.name) },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      legend: { show: false },
    },
  };

  const articlesBar = {
    series: [{ name: 'المقالات', data: articlesChartData.map(i => i.value) }],
    options: {
      ...baseOptions,
      chart: { ...baseOptions.chart, type: 'bar' },
      colors: articlesChartData.map(i => articleColors[i.key] || articleColors.unknown),
      plotOptions: { bar: { borderRadius: 6, columnWidth: '55%', distributed: true } },
      xaxis: { categories: articlesChartData.map(i => i.name) },
      yaxis: { labels: { formatter: v => Math.floor(v) } },
      legend: { show: false },
    },
  };

  const starsPolar = {
    series: starsChartData.map(i => i.value),
    options: {
      ...baseOptions,
      chart: { ...baseOptions.chart, type: 'polarArea' },
      labels: starsChartData.map(i => i.name),
      colors: ['#CC0000', '#1a73e8', '#00aa44', '#ff6b00', '#9c27b0', '#555555'],
      stroke: { colors: ['#fff'] },
      legend: { position: 'bottom' },
    },
  };

  const topNewsBar = {
    series: [{ name: 'المشاهدات', data: topNewsViewsData.map(i => i.value) }],
    options: {
      ...baseOptions,
      chart: { ...baseOptions.chart, type: 'bar' },
      plotOptions: { bar: { horizontal: true, borderRadius: 6 } },
      colors: ['#1a73e8'],
      xaxis: { categories: topNewsViewsData.map(i => truncate(i.name, 18)) },
      yaxis: { labels: { style: { fontSize: '11px' } } },
    },
  };

  const [matchesRange, setMatchesRange] = useState('week');

  const matchesRangeData =
    matchesRange === 'week'
      ? matchesByWeekData
      : matchesRange === 'month'
      ? matchesByMonthData
      : matchesByYearData;

  const matchesTrendBar = {
    series: [{ name: 'المباريات', data: matchesRangeData.map(i => i.value) }],
    options: {
      ...baseOptions,
      chart: { ...baseOptions.chart, type: 'bar' },
      colors: ['#00aa44'],
      plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
      xaxis: { categories: matchesRangeData.map(i => i.name) },
      yaxis: { labels: { formatter: v => Math.floor(v) } },
    },
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1 className="admin-title">لوحة التحكم</h1>
        <Link to="/" className="admin-back-link">العودة للموقع ←</Link>
      </div>
      <div className="admin-stats-grid">
        {cards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      <div className="admin-charts">
        <div className="admin-charts-grid">
        <div className="admin-chart-card">
          <div className="admin-chart-title">توزيع الأخبار حسب التصنيف</div>
          <div className="admin-chart-subtitle">النسبة من إجمالي الأخبار</div>
          <div className="admin-chart-body">
            <ReactApexChart options={newsDonut.options} series={newsDonut.series} type="donut" height={230} />
          </div>
          <div className="admin-chart-legend">
            {newsChartData.map(item => (
              <div key={item.name} className="admin-chart-legend-item">
                <span className="admin-chart-dot" style={{ background: newsColors[item.key] || newsColors.unknown }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-chart-card">
          <div className="admin-chart-title">حالة المباريات</div>
          <div className="admin-chart-subtitle">توزيع المباريات حسب الحالة</div>
          <div className="admin-chart-body">
            <ReactApexChart options={matchesBar.options} series={matchesBar.series} type="bar" height={230} />
          </div>
        </div>

        <div className="admin-chart-card">
          <div className="admin-chart-title">توزيع الفيديوهات حسب التصنيف</div>
          <div className="admin-chart-subtitle">النسبة من إجمالي الفيديوهات</div>
          <div className="admin-chart-body">
            <ReactApexChart options={videosBar.options} series={videosBar.series} type="bar" height={230} />
          </div>
          <div className="admin-chart-legend">
            {videosChartData.map(item => (
              <div key={item.name} className="admin-chart-legend-item">
                <span className="admin-chart-dot" style={{ background: videoColors[item.key] || videoColors.unknown }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-chart-card">
          <div className="admin-chart-title">أنواع المقالات</div>
          <div className="admin-chart-subtitle">توزيع المقالات حسب النوع</div>
          <div className="admin-chart-body">
            <ReactApexChart options={articlesBar.options} series={articlesBar.series} type="bar" height={230} />
          </div>
          <div className="admin-chart-legend">
            {articlesChartData.map(item => (
              <div key={item.name} className="admin-chart-legend-item">
                <span className="admin-chart-dot" style={{ background: articleColors[item.key] || articleColors.unknown }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-chart-card is-span-2">
          <div className="admin-chart-title">الأخبار الأكثر مشاهدة</div>
          <div className="admin-chart-subtitle">أفضل 5 أخبار حسب عدد المشاهدات</div>
          <div className="admin-chart-body">
            <ReactApexChart options={topNewsBar.options} series={topNewsBar.series} type="bar" height={230} />
          </div>
        </div>
        </div>

        <div className="admin-charts-row">
          <div className="admin-chart-card">
            <div className="admin-chart-title">النجوم حسب الرياضة</div>
            <div className="admin-chart-subtitle">أكثر الرياضات تمثيلاً</div>
            <div className="admin-chart-body">
              <ReactApexChart options={starsPolar.options} series={starsPolar.series} type="polarArea" height={230} />
            </div>
          </div>

          <div className="admin-chart-card is-span-2">
            <div className="admin-chart-title">تطور المباريات عبر الزمن</div>
            <div className="admin-chart-subtitle">عدد المباريات حسب الفترة</div>
            <div className="admin-chart-filters">
            <button
              className={`admin-filter-btn${matchesRange === 'week' ? ' is-active' : ''}`}
              onClick={() => setMatchesRange('week')}
            >
              هذا الأسبوع
            </button>
            <button
              className={`admin-filter-btn${matchesRange === 'month' ? ' is-active' : ''}`}
              onClick={() => setMatchesRange('month')}
            >
              حسب الشهر
            </button>
            <button
              className={`admin-filter-btn${matchesRange === 'year' ? ' is-active' : ''}`}
              onClick={() => setMatchesRange('year')}
            >
              حسب السنة
            </button>
          </div>
            <div className="admin-chart-body">
              <ReactApexChart options={matchesTrendBar.options} series={matchesTrendBar.series} type="bar" height={230} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
