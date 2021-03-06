import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HorizontalHistogram, ScatterPlot } from '../src';
import filterRange from '../src/colors/filterRange';
import { data2 } from './data';
import Histogram from './Histogram';
import JoyPlot from './JoyPlot';
import LineChartExample from './LineChartExample';
import Map from './Map';
import Pie from './Pie';

const scatter = [

];

const theme = filterRange(['rgba(255, 113, 1, 0.5)', '#fff6ef', 'rgba(0, 169, 123, 0.5)', '#f6fffd',
  '#D7263D', 'rgba(215, 38, 61, 0.05)',
  '#0f2629', '#ededed', 'rgba(86, 180, 191, 0.5)', '#f5fbfb', '#000000', '#0f2629', '#D7263D', '#FBD7D9',
  '#ffebec', '#963540', '#22545a', '#56b4bf', '#56b4bf', '#56b4bf', '#FF7101', '#449098', '#77c3cb', '#d4eef8',
  '#ff7101', '#FF7101', '#cc5a00', '#ff8d33', '#fef9e5', '#7d5d2e', '#00a97b', '#008762', '#33ba95', '#dbf1d6',
  '#227839', '#0f5e7b', '#d4eef8', '#0f5e7b', '#F9C80E', '#007656', '#c5e5e9', '#f9c80e', '#a9a9a9',
  '#dbdbdb', '#cccccc', '#e6e6e6', '#56b4bf', '#449098', '#77c3cb', '#22545a', '#ff7101', '#cdcdcd', '#ffffff',
  '#d7263d', '#00a97b', '#888888', '#e6e6e6', '#f2f2f2', '#f4f4f4']);

const App: React.SFC<{}> = (): JSX.Element => <div style={{ padding: '20px' }}>
  <Map />
  <JoyPlot theme={theme} />
  <Pie theme={theme} />
  <div>
    <LineChartExample />
  </div>
  <Histogram theme={theme} />
  <div>
    <HorizontalHistogram data={data2} width={500} height={400} margin={{
      left: 30,
      top: 30,
    }} />
  </div>

  <div>
    {/* <ScatterPlot data={scatter} width={300} height={300} /> */}
  </div>

</div>;

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
