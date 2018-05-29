const waitForFinalEvent = (function() {
  const timers = {};
  return function(callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout(timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

!(function($) {
  let cloud = {},
    font =
      'Helvetica, Tahoma, Arial, STXihei, "华文细黑", "Microsoft YaHei", "微软雅黑", SimSun, "宋体", Heiti, "黑体", sans-serif',
    w,
    h,
    fontSize,
    fill = d3.scale.category20(), // 设置填充的颜色，这里表示用 20 种颜色进行填充
    layout = d3.layout
      .cloud()
      .timeInterval(10)
      .font(font)
      .fontSize(d => d.size)
      .rotate(() => ~~(Math.random() * 2) * 90) // 0/90
      // .on("word", progress) // 每处理一个单词调用一次 progress
      .on('end', draw), // 处理完成后调用 draw
    svg,
    background,
    vis;

  function init() {
    // 插入 svg
    (svg = d3.select('#tagscloud').append('svg')),
      (background = svg.append('g')),
      (vis = svg.append('g')),
      generate();
  }

  function jump(d) {
    console.log(`jump:${d.text}-ref`);
    moon.scrollTo(`${d.text}-ref`);
  }

  function progress(d) {
    console.log(d);
  }

  function generate() {
    $('#tagscloud .progress').show();

    // 每次生成重新获取 tagscloud 的宽度
    w = $('#tagscloud').width();
    h = w / 1.6;
    $('#tagscloud').height(h);
    svg.attr('width', w).attr('height', h);
    vis
      .attr('width', w)
      .attr('height', h)
      .attr('transform', `translate(${[w >> 1, h >> 1]})`);
    layout
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

  function draw(data, bounds) {
    scale = bounds
      ? Math.min(
          w / Math.abs(bounds[1].x - w / 2),
          w / Math.abs(bounds[0].x - w / 2),
          h / Math.abs(bounds[1].y - h / 2),
          h / Math.abs(bounds[0].y - h / 2)
        ) / 2
      : 1;
    words = data;
    const text = vis.selectAll('text').data(words, d => d.text.toLowerCase()); // 将 data 绑定到 text
    // 设置每个 text 的位置角度等等，
    text
      .transition()
      .duration(1000)
      .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .style('font-size', d => `${d.size}px`);
    text
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .style('font-size', d => `${d.size}px`)
      .on('click', cloud.jump)
      .style('opacity', 1e-6)
      .transition()
      .duration(1000)
      .style('opacity', 1);
    text
      .style('font-family', d => d.font)
      .style('fill', d => fill(d.text.toLowerCase()))
      .text(d => d.text);
    //
    const exitGroup = background
      .append('g')
      .attr('transform', vis.attr('transform'));
    const exitGroupNode = exitGroup.node();
    text.exit().each(function() {
      exitGroupNode.appendChild(this);
    });
    exitGroup
      .transition()
      .duration(1000)
      .style('opacity', 1e-6)
      .remove();
    vis
      .transition()
      .delay(1000)
      .duration(750)
      .attr('transform', `translate(${[w >> 1, h >> 1]})scale(${scale})`);

    // 移除 progress
    console.log('hide');
    $('#tagscloud .progress').hide();
  }
  cloud.init = init;
  cloud.generate = generate;
  cloud.jump = jump;
  this.cloud = cloud;
  // 只有当 resize 完成的时候才重新生成 tagscloud
  $(window).resize(() => {
    // 判断 resize 是否完成是通过在 500ms 内窗口大小没变化来判断的 -_-\\
    // 作用不大
    // waitForFinalEvent(function(){
    const _w = $('#tagscloud').width();
    if (w != _w) {
      // 只有宽度变化才需要重新生成
      generate();
    }
    // console.log('Resize...');
    // }, 200, "resize tagscloud");
  });
})(jQuery);
$(cloud.init);
