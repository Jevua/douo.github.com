import * as d3 from 'd3';
import { scaleSequential } from 'd3-scale';
import { interpolateSpectral, interpolateRainbow } from 'd3-scale-chromatic';

const D3Demo = {
  render: () => {
    const data = [4, 8, 15, 16, 23, 42];
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, 100]);
    d3.select('.chart')
      .selectAll('div')
      .data(data)
      .enter()
      .append('div')
      .style('width', d => `${x(d) * 10}px`)
      .text(d => d);
  },
  renderSvg: () => {
    const data = d3.range(5000).map(() => Math.round(Math.random() * 5000));
    const width = 420;
    const barHeight = 20;
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, 420]);
    const chart = d3
      .select('.chart')
      .attr('width', width)
      .attr('height', barHeight * data.length);
    const bar = chart
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0,${i * barHeight})`);
    bar
      .append('rect')
      .attr('width', x)
      .attr('height', barHeight - 1);
    bar
      .append('text')
      .attr('x', d => x(d) - 3)
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .text(d => d);
  },

  renderCanvas: () => {
    const width = 750;
    const height = 400;
    const canvas = d3
      .select('#d3')
      .append('canvas')
      .attr('width', width)
      .attr('height', height);

    // Add the hidden canvas and give it the 'hiddenCanvas' class.
    const hiddenCanvas = d3
      .select('#container')
      .append('canvas')
      .classed('hiddenCanvas', true)
      .attr('width', width)
      .attr('height', height);

    const context = canvas.node().getContext('2d');

    const customBase = document.createElement('custom');
    const custom = d3.select(customBase);
    const groupSpacing = 4;
    const cellSpacing = 2;
    const offsetTop = height / 5;
    const cellSize =
      Math.floor((width - 11 * groupSpacing) / 100) - cellSpacing;

    function databind(data) {
      const colourScale = scaleSequential(interpolateRainbow).domain(
        d3.extent(data, d => d)
      );
      const join = custom.selectAll('custom.rect').data(data);
      const enterSel = join
        .enter()
        .append('custom')
        .attr('class', 'rect')
        .attr('x', (d, i) => {
          const x0 = Math.floor(i / 100) % 10;
          const x1 = Math.floor(i % 10);
          return groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10);
        })
        .attr('y', (d, i) => {
          const y0 = Math.floor(i / 1000);
          const y1 = Math.floor((i % 100) / 10);
          return groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
        })
        .attr('width', 0)
        .attr('height', 0);
      join
        .merge(enterSel)
        .transition()
        .duration(1000)
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('fillStyle', d => colourScale(d));
      const exitSel = join
        .exit()
        .transition()
        .attr('width', 0)
        .attr('height', 0)
        .remove();
    } // databind()
    function draw() {
      context.clearRect(0, 0, width, height); // Clear the canvas.
      const elements = custom.selectAll('custom.rect');
      // Grab all elements you bound data to in the databind() function.
      elements.each(function(d, i) {
        // For each virtual/custom element...
        const node = d3.select(this);
        // This is each individual element in the loop.
        context.fillStyle = node.attr('fillStyle');

        // Here you retrieve the colour from the individual in-memory node and set the fillStyle for the canvas paint
        context.fillRect(
          node.attr('x'),
          node.attr('y'),
          node.attr('width'),
          node.attr('height')
        );
        // Here you retrieve the position of the node and apply it to the fillRect context function which will fill and paint the square.
      }); // Loop through each element.
    } // draw()

    d3.select('#text-input').on('keydown', function() {
      console.log(d3.event);
      if (d3.event.keyCode === 13) {
        // Only do something if the user hits return (keycode 13).
        if (+this.value < 1 || +this.value > 10000) {
          // If the user goes lower than 1 or higher than 10k...

          d3.select('#text-explain').classed('alert', true);
          // ... highlight the note about the range and return.
        } else {
          // If the user types in a sensible number...
          d3.select('#text-explain').classed('alert', false);
          // ...remove potential alert colours from the note...
          const value = +this.value; // ...set the value...
          databind(d3.range(value));
          const t = d3.timer(elapsed => {
            draw();
            if (elapsed > 1050) t.stop();
          });
        } // If user hits return.
      }
    }); // Text input listener/handler
  }
};

export default D3Demo;
