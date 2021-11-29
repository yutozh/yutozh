// 文章统计echart，增加暗黑模式适配

function switchPostChart() {
  // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
  let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
  if (document.getElementById('posts-chart')) {
    let postsOptionNew = postsOption
    postsOptionNew.textStyle.color = color
    postsOptionNew.title.textStyle.color = color
    postsOptionNew.xAxis.axisLine.lineStyle.color = color
    postsOptionNew.yAxis.axisLine.lineStyle.color = color
    postsChart.setOption(postsOptionNew)
  }
  if (document.getElementById('tags-chart')) {
    let tagsOptionNew = tagsOption
    tagsOptionNew.textStyle.color = color
    tagsOptionNew.title.textStyle.color = color
    tagsOptionNew.xAxis.axisLine.lineStyle.color = color
    tagsOptionNew.yAxis.axisLine.lineStyle.color = color
    tagsChart.setOption(tagsOptionNew)
  }
  if (document.getElementById('categories-chart')) {
    let categoriesOptionNew = categoriesOption
    categoriesOptionNew.textStyle.color = color
    categoriesOptionNew.title.textStyle.color = color
    categoriesOptionNew.legend.textStyle.color = color
    categoriesChart.setOption(categoriesOptionNew)
  }
}

document.getElementById("darkmode").addEventListener("click", function () { setTimeout(switchPostChart, 100) })


// // 版权信息
// $(document).ready(function(e) {
//     $('.copyright').html('©2020 <i style="color:#FF6A6A;animation: announ_animation 0.8s linear infinite;" class="fa fa-heartbeat"></i> Lete乐特');
// });