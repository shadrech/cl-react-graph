import { axisBottom, axisLeft } from 'd3-axis';
import * as get from 'lodash.get';
import attrs from './d3/attrs';
import { IAxes } from './Histogram';

// Gridlines in y axis function
export const makeYGridlines = (y, ticks: number = 5) => {
  return axisLeft(y)
    .ticks(ticks);
};

// Gridlines in x axis function
export const makeXGridlines = (x, ticks: number = 5) => {
  return axisBottom(x)
    .ticks(ticks);
};

export const drawGrid = (x, y, gridX, gridY, props, ticks) => {
  const { height, width, axis, grid, margin } = props;
  const axisWidth = axis.y.style['stroke-width'];

  const offset = {
    x: yAxisWidth(axis) + axisWidth,
    y: gridHeight(props),
  };

  if (grid.x.visible) {
    // Add the X gridlines
    gridX.attr('transform', `translate(${offset.x}, ${offset.y})`);

    gridX.call(makeXGridlines(x, get(grid, 'x.ticks', ticks))
      .tickSize(-height + xAxisHeight(props.axis) + (margin.top * 2))
      .tickFormat(() => ''));

    attrs(gridX.selectAll('.tick line'), grid.x.style);
    attrs(gridX.selectAll('.domain'), { stroke: 'transparent' });
  }

  if (grid.y.visible) {
    // add the Y gridlines
    gridY.attr('transform', 'translate(' + (yAxisWidth(axis) + axisWidth) + ', 0)')
      .transition()
      .call(makeYGridlines(y, get(grid, 'y.ticks', ticks))
        .tickSize(-width + (margin.left * 2) + yAxisWidth(axis))
        .tickFormat(() => ''),
    );

    attrs(gridY.selectAll('.tick line'), grid.y.style);

    // Hide the first horizontal grid line to show axis
    gridY.selectAll('.gridY .tick line').filter((d, i) => i === 0)
      .attr('display', 'none');
    attrs(gridY.selectAll('.domain'), { stroke: 'transparent' });
  }
};

export const gridHeight = (props): number => {
  const { height, margin, axis } = props;
  return height - (margin.top * 2) - xAxisHeight(axis);
};

export const yAxisWidth = (axis: IAxes) => {
  return axis.y.label === ''
    ? axis.y.width
    : axis.y.width + 30;
};

export const xAxisHeight = (axis: IAxes) => {
  return axis.x.label === ''
    ? axis.x.height
    : axis.x.height + 30 + get(axis, 'x.margin', 0);
};

export const gridWidth = (props): number => {
  const { axis, width, margin } = props;
  return width - (margin.left * 2) - yAxisWidth(axis);
};
