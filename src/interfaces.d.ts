/**
 * General
 */
interface ISVGLineStyle {
    'stroke': string;
    'fill': string;
    'stroke-width': number;
    'stroke-opacity': number;
    'shape-rendering': string;
}

interface ISVGTextStyle {
    'fill': string;
}

interface IAxis {
    ticks: number;
    height?: number;
    width?: number;
    style?: ISVGLineStyle;
    text?: {
      style: ISVGTextStyle
    },
}

interface IMargin {
    top: number;
    left: number;
}

interface IGrid {
    x: {
        height: number;
        ticks?: number;
        visible: boolean;
        style: {
            [key: string]: string;
        };
    };
    y: {
        style: {
            [key: string]: string;
        };
        ticks?: number;
        visible: boolean;
    };
}


interface IChartAdaptor {
    create: (el: Element, props: {[key: string] : any}) => void,
    update: (el: Element, props: {[key: string] : any}) => void,
    destroy: (el: Element) => void
}

/**
 * Scatter plot
 */

type ScatterPlotData = any[]

interface IScatterPlotProps {
  choices?: any[];
  className?: string;
  chartSize?: number;
  data: ScatterPlotData,
  delay?: number;
  distModels?: string[];
  duration?: number;
  height: number;
  legendWidth?: number;
  colorScheme?: string[];
  padding?: number;
  radius?: number;
  split?: string;
  width: string | number;
}

/**
 * Line Chart
 */
interface IChartPoint {
    x: number;
    y: number;
}

interface ILineChartDataSet {
    label: string;
    point?: {
        radius: number;
        stroke: string;
        fill: string;
        show: boolean;
    };
    line?: {
        show: boolean;
        fill?: boolean;
        curveType?: d3.CurveFactory;
        stroke?: string;
        strokeDashOffset?: number;
        strokeDashArray?: string;
    };
    data: IChartPoint[];
}

interface ILineChartProps {
    data: ILineChartDataSet[];
    height?: number;
    width: number | string;
    tipContentFn?: (info, i, d) => void
    yTicks?: number,
}

/**
 * Histogram
 */
interface IHistogramBar {
    margin?: number;
    width?: number;
}

interface IStroke {
    color: (d, i: number, colors: (i: number) => string) => string,
    width: number;
}

interface IHistogramAxes {
    y?: IAxis;
    x?: IAxis;
}
interface IHistogramDataSet {
    borderColors? : string[];
    colors?: string[];
    label: string;
    data: number[];
}

interface IHistogramData {
    bins: string[];
    counts: IHistogramDataSet[];
    colorScheme?: string[];
}

interface IHistogramProps {
    axis?: IHistogramAxes;
    bar?: IHistogramBar,
    grid?: IGrid;
    width: number | string;
    height: number;
    data: IHistogramData;
    stroke?: IStroke;
}

interface IHistogramChartState {
    axis?: IHistogramAxes;
    bar?: IHistogramBar;
    data: IHistogramData;
    grid?: IGrid, 
    height?: number;
    margin?: IMargin;
    stroke?: IStroke
    parentWidth?: number;
    tipContainer?: string;
    tipContentFn?: ((bins: string[], i: number, d: number) => string);
    width: number | string;
}
