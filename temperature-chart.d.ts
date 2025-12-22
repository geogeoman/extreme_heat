// temperature-chart.d.ts

/**
 * 气象数据接口
 * 支持年份数组和各个数据源的温度偏差数组
 */
export interface TemperatureData {
    years: number[];
    berkeleyEarth?: (number | null)[];
    era5?: (number | null)[];
    gistemp?: (number | null)[];
    hadcrut5?: (number | null)[];
    jra3q?: (number | null)[];
    noaa?: (number | null)[];
    // 允许扩展其他数据源
    [key: string]: (number | null)[] | number[];
}

/**
 * 组件配置项接口
 */
export interface ChartOptions {
    /** 自定义颜色配置 */
    colors?: {
        [key: string]: string;
        avg?: string;
        targetLine?: string;
    };
    /** 数据源显示名称映射 */
    names?: {
        [key: string]: string;
    };
}

/**
 * 初始化全球气温变化图表组件
 * * @param containerId - 图表挂载的 DOM 元素 ID
 * @param data - 可选，自定义气象数据。若不传则使用默认 WMO 数据。
 * @param options - 可选，图表样式与颜色配置
 * @returns ECharts 实例对象
 */
export declare function initGlobalTemperatureChart(
    containerId: string, 
    data?: TemperatureData, 
    options?: ChartOptions
): echarts.ECharts;

/**
 * 创建社交分享按钮组件
 * @param containerId - 容器ID
 * @param title - 分享标题
 * @param url - 分享链接
 */
export declare function createShareButtons(
    containerId: string, 
    title?: string, 
    url?: string
): void;
