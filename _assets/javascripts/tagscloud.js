import * as d3 from 'd3';
import d3cloud from 'd3-cloud';

class TagsCloud {
  constructor() {
    const font =
      'Helvetica, Tahoma, Arial, STXihei, "华文细黑", "Microsoft YaHei", "微软雅黑", SimSun, "宋体", Heiti, "黑体", sans-serif';
    const tagscloud = d3.select('#tagscloud');
    const progress = d3.select('#tagscloud .progress');
    const fill = d3.scaleOrdinal(d3.schemeCategory10);

    // 插入 svg
    const svg = tagscloud.append('svg');
    const vis = svg.append('g');

    function draw(data) {
      const text = vis.selectAll('text').data(data, d => d.text.toLowerCase());
      text
        .enter()
        .append('text')
        .text(d => d.text)
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .style('font-size', d => `${d.size}px`)
        .on('click', d => window.scrollTo(`${d.text}-ref`))
        .style('opacity', 1e-6)
        .style('font-family', d => d.font)
        .style('fill', d => fill(d.text.toLowerCase()))
        .transition()
        .duration(1000)
        .style('opacity', 1);

      text
        .transition()
        .duration(1000)
        .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .style('font-size', d => `${d.size}px`);

      text
        .exit()
        .transition()
        .duration(1000)
        .style('opacity', 1e-6)
        .remove();
      // 移除 progress
      progress.style('display', 'none');
    }

    this.layout = d3cloud()
      .timeInterval(10)
      .font(font)
      .fontSize(d => d.size)
      .rotate(() => ~~(Math.random() * 2) * 90) // 0/90
      // .on("word", progress) // 每处理一个单词调用一次 progress
      .on('end', draw); // 处理完成后调用 draw
    this.progress = progress;
    this.tagscloud = tagscloud;
    this.svg = svg;
    this.vis = vis;
  }

  setup() {
      console.log("setup")
      console.log(d3)
      console.log(d3.json)
    if (this.data) {
      this.generate(this.data);
    } else {
        d3.json('/tags.json', (data => {
        this.data = data;
        this.generate(data);
        let w = window.innerWidth;
        window.addEventListener('resize', () => {
          const newW = window.innerWidth;
          if (w !== newW) {
            // 只有宽度变化才需要重新生成
            w = newW;
            this.generate(this.data);
          }
        });
        }));
    }
  }

  generate(tags) {
    this.progress.style('display', 'block');
    // 每次生成重新获取 tagscloud 的宽度
    const rect = this.tagscloud.node().getBoundingClientRect();
    const w = rect.width;
    const h = w / 1.6;
    this.svg.attr('width', w).attr('height', h);
    this.vis
      .attr('width', w)
      .attr('height', h)
      .attr('transform', `translate(${[w >> 1, h >> 1]})`);
    this.layout
      .stop()
      .size([w, h])
      .words(
        tags.map(d => ({
          text: d.name,
          size: (d.size - 1) * 10 + Math.random() * 60
        }))
      )
      .start();
  }
}

new TagsCloud().setup();
