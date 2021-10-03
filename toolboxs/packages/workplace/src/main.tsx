import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

const App = () => {
  useEffect(() => {
    const workspaceEl = document.getElementById('workspace');
    console.log(workspaceEl);

    var svg = d3.select('#workspace').append('svg');
    var scale = 1;
    svg.attr('width', 500).attr('height', 500);
    var g = svg.append('g');
    g.append('ellipse')
      .attr('cx', function (d) {
        return 300;
      })

      .attr('cy', function (d) {
        return 100;
      })
      .attr('rx', 150)
      .attr('ry', 100);
  }, []);
  return <div id="workspace"></div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
