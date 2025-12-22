/**
 * 全球平均气温变化图表 (1850-2024)
 * 数据来源: World Meteorological Organization (WMO)
 * 极端高温可视化图表组件库
 * 基于 ECharts 封装，支持多源气象数据对比与交互
 */

// 默认配置与示例数据
const DEFAULT_CONFIG = {
    colors: {
        berkeleyEarth: '#e74c3c',
        era5: '#3498db',
        gistemp: '#27ae60',
        hadcrut5: '#9b59b6',
        jra3q: '#f39c12',
        noaa: '#1abc9c',
        avg: '#2c3e50',
        targetLine: '#e74c3c'
    },
    names: {
        berkeleyEarth: 'Berkeley Earth',
        era5: 'ERA5',
        gistemp: 'GISTEMP',
        hadcrut5: 'HadCRUT5',
        jra3q: 'JRA-3Q',
        noaa: 'NOAAGlobalTemp'
    }
};

// 内置 WMO 官方示例数据 (1850-2024)
const MOCK_DATA = {
    years: [1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    berkeleyEarth: [-0.18, -0.15, -0.06, -0.07, -0.22, 0.12, -0.23, -0.01, 0.10, 0.31, 0.06, 0.21, 0.25, 0.54, 0.69, 0.68, 1.00, 1.15, 1.29, 1.19, 1.11, 1.25, 1.28, 1.12, 1.16, 1.45, 1.54],
    era5: [null, null, null, null, null, null, null, null, null, 0.20, 0.12, 0.27, 0.31, 0.59, 0.75, 0.63, 1.01, 1.14, 1.32, 1.23, 1.15, 1.28, 1.32, 1.16, 1.18, 1.48, 1.60],
    gistemp: [null, null, null, 0.10, -0.09, 0.18, -0.17, 0.00, 0.12, 0.39, 0.10, 0.24, 0.29, 0.52, 0.72, 0.66, 0.99, 1.16, 1.28, 1.19, 1.12, 1.24, 1.27, 1.11, 1.16, 1.44, 1.55],
    hadcrut5: [-0.08, -0.05, 0.01, 0.02, -0.17, 0.11, -0.19, 0.04, 0.16, 0.42, 0.11, 0.22, 0.26, 0.54, 0.70, 0.67, 1.02, 1.17, 1.27, 1.19, 1.10, 1.23, 1.26, 1.10, 1.14, 1.44, 1.53],
    jra3q: [null, null, null, null, null, null, null, null, null, null, 0.10, 0.28, 0.27, 0.53, 0.74, 0.68, 0.99, 1.15, 1.32, 1.20, 1.11, 1.25, 1.27, 1.08, 1.15, 1.47, 1.57],
    noaa: [0.05, 0.02, 0.07, 0.07, -0.09, 0.19, -0.13, 0.02, 0.13, 0.40, 0.12, 0.25, 0.30, 0.56, 0.70, 0.66, 0.98, 1.16, 1.28, 1.19, 1.12, 1.23, 1.26, 1.11, 1.14, 1.43, 1.53]
};

/**
 * 初始化全球气温变化图表组件
 * @param {string} containerId - DOM容器ID
 * @param {Object} [data] - 自定义数据对象 (可选，默认使用内置 WMO 数据)
 * @param {Object} [options] - 配置项 (可选)
 * @returns {Object} ECharts 实例
 */
function initGlobalTemperatureChart(containerId, data = MOCK_DATA, options = {}) {
    const chartElement = document.getElementById(containerId);
    if (!chartElement) {
        console.error(`Chart container #${containerId} not found.`);
        return null;
    }

    // 合并配置
    const config = { ...DEFAULT_CONFIG, ...options };
    const chart = echarts.init(chartElement);

    // 构建 Series 数据
    const series = Object.keys(config.names).map(key => {
        // 如果数据源中没有该 key，则跳过或填充空
        const seriesData = data[key] || [];
        return {
            name: config.names[key],
            type: 'line',
            data: seriesData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2, color: config.colors[key] },
            itemStyle: { color: config.colors[key] },
            emphasis: { focus: 'series', lineStyle: { width: 3 } },
            connectNulls: true
        };
    });

    // 自动计算多源平均线
    const avgData = data.years.map((year, i) => {
        const values = Object.keys(config.names)
            .map(key => data[key] ? data[key][i] : null)
            .filter(v => v !== null && v !== undefined);
        return values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : null;
    });

    series.push({
        name: '多源平均',
        type: 'line',
        data: avgData,
        smooth: true,
        symbol: 'diamond',
        symbolSize: 8,
        lineStyle: { width: 4, color: config.colors.avg, type: 'solid' },
        itemStyle: { color: config.colors.avg },
        emphasis: { focus: 'series', lineStyle: { width: 5 } },
        z: 10
    });

    const option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderColor: '#e0e0e0',
            textStyle: { color: '#333', fontSize: 13 },
            formatter: function (params) {
                let html = `<div style="font-weight:600;margin-bottom:8px;color:#1e3a8a">${params[0].axisValue}年</div>`;
                html += '<div style="font-size:12px;color:#666;margin-bottom:6px">偏差值 (相对于1850-1900)</div>';
                params.forEach(p => {
                    if (p.value != null) {
                        const sign = p.value >= 0 ? '+' : '';
                        html += `<div style="display:flex;justify-content:space-between;align-items:center;min-width:160px;margin:4px 0">
                            <span style="display:flex;align-items:center">
                                <span style="width:10px;height:10px;border-radius:50%;background:${p.color};margin-right:8px"></span>
                                ${p.seriesName}
                            </span>
                            <span style="font-weight:bold;color:${p.value >= 0 ? '#e74c3c' : '#3498db'}">${sign}${p.value}°C</span>
                        </div>`;
                    }
                });
                return html;
            }
        },
        legend: {
            type: 'scroll',
            bottom: 10,
            data: [...Object.values(config.names), '多源平均']
        },
        grid: { left: 50, right: 40, top: 40, bottom: 80, containLabel: true },
        xAxis: {
            type: 'category',
            data: data.years,
            axisLabel: { rotate: 45, color: '#666' }
        },
        yAxis: {
            type: 'value',
            name: '温度偏差 (°C)',
            nameLocation: 'middle',
            nameGap: 40,
            axisLabel: { formatter: v => v >= 0 ? '+' + v : v }
        },
        series: series,
        graphic: [{
            type: 'group',
            left: 70, top: 60,
            children: [
                { type: 'line', shape: { x1: 0, y1: 0, x2: 600, y2: 0 }, style: { stroke: config.colors.targetLine, lineDash: [5, 3] } },
                { type: 'text', left: 5, top: -18, style: { text: '1.5°C 警戒线', fill: config.colors.targetLine } }
            ]
        }],
        animationEasing: 'cubicOut'
    };

    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
    return chart;
}

/**
 * 创建分享按钮组件
 * @param {string} containerId - 容器ID
 * @param {string} title - 分享标题
 * @param {string} url - 分享链接
 */
function createShareButtons(containerId, title, url) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const shareData = {
        title: title || '全球气温变化趋势 (1850-2024)',
        url: url || window.location.href
    };

    const platforms = [
        {
            name: '微信',
            icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89l-.006-.002zm-2.092 2.55c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.827 0c.536 0 .97.44.97.982a.976.976 0 0 1-.97.983.976.976 0 0 1-.969-.983c0-.542.433-.982.97-.982z"/></svg>`,
            action: () => alert('请截图分享至微信')
        },
        {
            name: '抖音',
            icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
            action: () => alert('请截图分享至抖音')
        },
        {
            name: '小红书',
            icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>`,
            action: () => alert('请截图分享至小红书')
        },
        {
            name: 'B站',
            icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/></svg>`,
            action: () => window.open(`https://www.bilibili.com`, '_blank')
        }
    ];

    let html = '<div class="share-buttons flex items-center gap-3 mt-4">';
    html += '<span class="text-sm text-slate-500">分享至:</span>';

    platforms.forEach((p, i) => {
        html += `<button onclick="shareHandlers[${i}]()" class="share-btn w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all" title="${p.name}">${p.icon}</button>`;
    });

    html += '</div>';
    container.innerHTML = html;

    // 暴露分享处理函数到全局
    window.shareHandlers = platforms.map(p => p.action);
}

