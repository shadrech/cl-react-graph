import * as React from 'react';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import { IAxes, IGrid, IHistogramData, IMargin, ISVGLineStyle, TipContentFn } from './Histogram';
import { lineChartD3 } from './lineChartD3';

interface IState {
  parentWidth?: number;
}

export type IChartPointValue = number | string | Date;
export interface IChartPoint {
  x: IChartPointValue;
  y: IChartPointValue;
}
export interface ILineChartDataSet {
  label: string;
  point?: {
    radius: number;
    stroke: string;
    fill: string;
    show: boolean;
  };
  line?: {
    show: boolean;
    fill?: {
      show: boolean;
      fill: string;
    };
    curveType?: any;
    stroke?: string;
    strokeDashOffset?: number;
    strokeDashArray?: string;
  };
  data: IChartPoint[];
}

export interface ISVGPoint extends ISVGLineStyle {
  radius?: 4;
}

export interface ILineChartProps {
  axis?: IAxes;
  className?: string;
  data?: ILineChartDataSet[];
  fx?: (n: number) => number;
  grid?: IGrid;
  height?: number | string;
  line?: any;
  margin?: IMargin;
  point?: ISVGPoint;
  tip?: any;
  tipContainer?: string;
  tipContentFn?: TipContentFn<{ x: string | number, y: string | number }>;
  width?: number | string;
}

class LineChart extends Component<ILineChartProps, IState> {

  private chart;
  private ref;

  constructor(props: ILineChartProps) {
    super(props);
    this.chart = lineChartD3();
    this.state = {
      parentWidth: 300,
    };
  }

  private handleResize() {
    const elem = this.getDOMNode();
    const width = this.ref.offsetWidth ? this.ref.offsetWidth : 0;

    this.setState({
      parentWidth: width,
    }, () => this.chart.create(elem, this.getChartState()));

  }

  public componentDidMount() {
    this.chart.create(this.getDOMNode(), this.getChartState());
    if (this.props.width === '100%') {
      window.addEventListener('resize', (e) => this.handleResize());
      this.handleResize();
    }
  }

  public componentDidUpdate() {
    this.chart.update(this.getDOMNode(), this.getChartState());
  }

  /**
   * Get the chart state. If a histogram has been assigned
   * to the props, then render this data. Otherwise generate
   * a random normal dist
   */
  public getChartState(): ILineChartProps {
    let { width } = this.props;
    const { children, ...rest } = this.props;

    if (width === '100%') {
      width = this.state.parentWidth || 300;
    }

    return {
      ...rest,
      width,
    };
  }

  public componentWillUnmount() {
    if (this.props.width === '100%') {
      window.removeEventListener('resize', this.handleResize);
    }
    this.chart.destroy(this.getDOMNode());
  }

  public getDOMNode() {
    return ReactDOM.findDOMNode(this.ref);
  }

  public render(): JSX.Element {
    return <div ref={(ref) => this.ref = ref} className="chart-container"></div>;
  }
}

export default LineChart;
