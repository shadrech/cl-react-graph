import merge from 'deepmerge';
import colorScheme from './colors';

import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { select } from 'd3-selection';
import { IChartPoint } from './LineChart';
import { IScatterPlotProps, ScatterPlotData } from './ScatterPlot';

export const scatterPlotD3 = (() => {
  let svg;
  const yScale = scaleLinear();
  const xScale = scaleLinear();
  const domainByTrait = {};
  let xAxis;
  let color;
  let yAxis;

  const defaultProps = {
    choices: [],
    className: 'scatter-plot-d3',
    colorScheme,
    data: [],
    delay: 0,
    duration: 400,
    height: 300,
    legendWidth: 100,
    padding: 20,
    radius: 4,
    width: '100%',
  };

  const GenerateChart = {

    /**
     * Initialization
     * @param {Element} el Target DOM node
     * @param {Object} props Chart properties
     */
    create(el: Element, props: IScatterPlotProps = defaultProps) {
      this.props = merge(defaultProps, props);
      this.update(el, props);
    },

    /**
     * Make the SVG container element
     * Recreate if it previously existed
     * @param {Element} el Dom container node
     * @param {Array} data Chart data
     */
    _makeSvg(el: Element, data: ScatterPlotData) {
      if (svg) {
        svg.selectAll('svg > *').remove();
        svg.remove();
        const childNodes = el.getElementsByTagName('svg');
        if (childNodes.length > 0) {
          el.removeChild(childNodes[0]);
        }
      }
      const { width, className, height,
        legendWidth, padding } = this.props;

      // Reference to svg element containing chart
      svg = select(el).append('svg')
        .attr('class', className)
        .attr('width', width + padding + legendWidth)
        .attr('height', height + padding)
        .append('g')
        .attr('transform', 'translate(' + padding + ',' + padding / 2 + ')');

      color = scaleOrdinal(this.props.colorScheme);
    },

    /**
     * Draw the chart scales
     * @param {Object} data Chart data
     */
    _drawScales(data) {
      const { height, padding, width } = this.props;
      const xSize = width / data.length;
      const ySize = height / data.length;
      xScale.range([padding / 2, xSize - padding / 2]);
      yScale.range([height - padding / 2, padding / 2]);

      svg.selectAll('.x.axis')
        .data(data)
        .enter().append('g')
        .attr('class', 'x axis')
        .attr('transform', (d, i) =>
          'translate(' + (data.length - i - 1) * xSize + ',0)')
        .each(function (d) {
          xScale.domain(domainByTrait[d]);
          select(this).call(xAxis);
        });

      svg.selectAll('.y.axis')
        .data(data)
        .enter().append('g')
        .attr('class', 'y axis')
        .attr('transform', (d, i) => 'translate(0,' + i * ySize + ')')
        .each(function (d) {
          yScale.domain(domainByTrait[d]);
          select(this).call(yAxis);
        });
    },

    /**
     * Make a legend showing spit choice options
     */
    _drawLegend() {
      const { choices, padding, width, split } = this.props;
      if (choices === undefined) {
        return;
      }
      const legend = svg.append('g')
        .attr('transform', 'translate(' + (width + padding / 2) +
          ', ' + (padding + 50) + ')');

      legend.append('g').append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '.71em')
        .text((d) => split);
      legend.selectAll('.legendItem')
        .data(choices)
        .enter().append('g')
        .each(function (c, i: number) {
          const cell = select(this);
          cell.append('rect')
            .attr('class', 'legendItem')
            .attr('x', 0)
            .attr('y', 20 + (i * 15))
            .attr('fill', color(i))
            .attr('height', 10)
            .attr('width', 10);

          cell.append('text')
            .attr('x', 15)
            .attr('y', 20 + (i * 15))
            .attr('dy', '.71em')
            .text((d) => c);
        });

      legend.exit().remove();
    },

    /**
     * Draw scatter points
     * @param {Object} traits Chart data
     * @param {Number} size Chart size
     */
    _drawPoints(traits, width: number, height: number) {
      const { data, delay, duration,
        choices, split, padding, radius } = this.props;
      const n = traits.length;
      const cell = svg.selectAll('.cell')
        .data(cross(traits, traits))
        .enter().append('g')
        .attr('class', 'cell')
        .attr('transform', (d) => 'translate(' + (n - d.i - 1) * width +
          ',' + d.j * width + ')')
        .each(plot);

      // Titles for the diagonal.
      cell.filter((d) => d.i === d.j).append('text')
        .attr('x', padding)
        .attr('y', padding)
        .attr('dy', '.71em')
        .text((d) => d.x);

      /**
       * Plot a point
       * @param {Object} p Point
       */
      function plot(p: IChartPoint) {
        const plotCell = select(this);
        let circle;
        xScale.domain(domainByTrait[Number(p.x)]);
        yScale.domain(domainByTrait[Number(p.y)]);

        plotCell.append('rect')
          .attr('class', 'frame')
          .attr('x', padding / 2)
          .attr('y', padding / 2)
          .attr('width', width - padding)
          .attr('height', height - padding);

        circle = plotCell.selectAll('circle')
          .data(data.values)
          .enter().append('circle')
          .attr('r', (d) => radius)
          .attr('cx', (d) => xScale(d[Number(p.x)]))
          .attr('cy', (d) => yScale(d[Number(p.y)]))
          .style('fill', (d) => {
            if (d[split]) {
              const i = choices.findIndex((c) => c === d[split]);
              return color(i);
            }
            return '#eeaabb';
          });

        circle
          .transition()
          .duration(duration)
          .delay(delay)
          .attr('r', (d) => radius);
      }

      /**
       * Create cross array
       * // @TODO looks like d3 has its own cross function now...
       * @param {Object} a point
       * @param {Object} b point
       * @return {Array} data
       */
      function cross(a, b) {
        const c = [];
        const nx = a.length;
        const m = b.length;
        let i;
        let j;
        for (i = -1; ++i < nx;) {
          for (j = -1; ++j < m;) {
            c.push({ x: a[i], i, y: b[j], j });
          }
        }
        return c;
      }
    },

    /**
     * Update chart
     * @param {Node} el Chart element
     * @param {Object} props Chart props
     */
    update(el: Element, props: IScatterPlotProps) {
      this.props = { ...this.props, ...props };
      if (!props.data) {
        return;
      }
      const { data, distModels, height, width } = this.props;
      this._makeSvg(el, props.data);
      this._drawLegend();
      const traits = data.keys.filter((k) => distModels.indexOf(k) !== -1);
      const xSize = width / traits.length;
      const ySize = height / traits.length;
      const n = traits.length;

      traits.forEach((trait) => {
        domainByTrait[trait] = extent(data.values, (d) => d[trait]);
      });
      xAxis = axisBottom(xScale)
        .ticks(6)
        .tickSize(xSize * n);
      yAxis = axisLeft(yScale)
        .ticks(6)
        .tickSize(-ySize * n);

      this._drawScales(traits);
      this._drawPoints(traits, xSize, ySize);
    },

    /**
     * Any necessary clean up
     * @param {Element} el To remove
     */
    destroy(el: Element) {
      svg.selectAll('svg > *').remove();
    },
  };
  return GenerateChart;
});
