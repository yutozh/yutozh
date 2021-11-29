var bbClass = '#bber'
$(bbClass).after('<div class="load"><button class="load-btn button-load">加载中……</button></div>')
var per = 9, page = 1

var SERVER_URL = "https://bber-vercel.vercel.app/bber"

$('.button-load').click(function () {
  $('.button-load').text('加载中……')
  getList()
})

$('#searchBoxInput').bind('keypress', async function (event) {
  if (event.keyCode == "13") {
    $('.load').remove()
    var ser = $('#searchBoxInput').val()
    if (ser !== '') {
      await getSerList(ser)
    } else {
      $(bbClass).html('请输入内容');
    }
  }
})

let resCont = ''
let totalCount = 0

window.onload = async () => {
  await getTotalCount()
  await getList()
}

async function getTotalCount() {
  totalCount = await apiTotalCount()
  $(bbClass).append('<p class="count">共 <span class="count-data">' + totalCount + '</span> 条</p>')
}


async function getList() {
  if ((page - 1) * per >= totalCount) {
    return
  }
  let bbers = await apiList()
  console.log(bbers)
  bbers.forEach(item => {
    d = new Date(item.date), data = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    dataTime = '<p class="datatime">' + data + '</p>'
    dataCont = '<p class="datacont">' + urlToLink(item.content) + '</p>'
    dataFrom = item.from ? '<p class="datafrom"><small>#' + item.from + '</small></p>' : ''
    resCont += '<li class="item"><div>' + dataTime + dataCont + dataFrom + '</div></li>'
  });

  $(bbClass).append('<section class="timeline page-' + page + '"><ul><div class="list">' + resCont + '</div></ul></section>')
  $('button.button-load').text('加载更多')
  $('html,body').animate({ scrollTop: $('.timeline.page-' + page).offset().top - 20 }, 500)
  if (page * per >= totalCount) {
    $('.load').remove()
    return
  }

  page++
  Lately({ 'target': '#bber .datatime' });
  // $("#bber a[rel!=link]:has(img)").slimbox();//图片灯箱效果
}

async function getSerList(ser) {
  $(bbClass).html('');
  console.log(ser)
  var d, resCont = ''
  let bbers = await apiSerlist(ser)

  bbers.forEach(item => {
    d = new Date(item.date), data = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    dataTime = '<p class="datatime">' + data + '</p>'
    dataCont = '<p class="datacont">' + urlToLink(item.content) + '</p>'
    dataFrom = item.from ? '<p class="datafrom"><small>#' + item.from + '</small></p>' : ''
    resCont += '<li class="item"><div>' + dataTime + dataCont + dataFrom + '</div></li>'
  });
  $(bbClass).append('<p class="count">共 <span class="count-data">' + bbers.length + '</span> 条</p>')
  $(bbClass).append('<section class="timeline page-' + page + '"><ul><div class="list">' + resCont + '</div></ul></section>')
  $('html,body').animate({ scrollTop: $('.timeline').offset().top - 20 }, 500)
  $('.load').remove()
  Lately({ 'target': '#bber .datatime' });
  // $("#bber a[rel!=link]:has(img)").slimbox();//图片灯箱效果
}


function apiTotalCount() {
  return new Promise((resolve, reject) => {
    axios.get(SERVER_URL, {
      params: {
        time: new Date().getTime(),
        from: 'WEB',
        key: 'bber',
        text: '/t'
      }
    })
      .then(function (response) {
        let count = response.data.content
        resolve(count)
      })
      .catch(function (err) {
        console.log(err)
      })

  })
}

function apiList() {
  return new Promise((resolve, reject) => {
    axios.post(SERVER_URL, {
      per: per,
      page: page
    }, {
      params: {
        time: new Date().getTime(),
        from: 'WEB',
        format: 'api',
        key: 'bber',
        action: 'list'
      },
    })
      .then(function (response) {
        res = response.data.content
        resolve(res)
      })
      .catch(function (err) {
        console.log(err)
      })
  })
}

function apiSerlist(serContent) {
  return new Promise((resolve, reject) => {
    axios.post(SERVER_URL, {
      serContent: serContent,
    }, {
      params: {
        time: new Date().getTime(),
        from: 'WEB',
        format: 'api',
        key: 'bber',
        action: 'search'
      }
    })
      .then(function (response) {
        res = response.data.content
        resolve(res)
      })
      .catch(function (err) {
        console.log(err)
      })
  })
}


function urlToLink(str) {
  //去除<img>标签，留 src 链接
  var re_forimg = /\<[img|IMG].*?src=[\'|\"](https\:\/\/.*?(?:[\.jpg|\.jpeg|\.png|\.gif|\.bmp]))[\'|\"].*?[\/]?>/g;
  str = str.replace(re_forimg, '$1');
  //去 ![]() 标签，留图片链接
  var re_formd = /^!\[(.*)\]\((.*)\)/g;
  str = str.replace(re_formd, '$2');
  //处理图片链接，添加 a 标签共添加灯箱效果
  var re_forpic = /\bhttps?:[^:<>"]*\/([^:<>"]*)(\.(jpeg)|(png)|(jpg)|(webp))/g;
  str = str.replace(re_forpic, function (imgurl) {
    return '<a href="' + imgurl + '"><img src="' + imgurl + '" /></a>';
  });
  //处理普通链接，添加 a 标签供跳转
  var re = /\bhttps?:\/\/(?!\S+(?:jpe?g|png|bmp|gif|webp|gif))\S+/g;
  str = str.replace(re, function (website) {
    return " <a href='" + website + "'rel='noopener' target='_blank'>↘链接↙</a> ";
  });
  //微信表情
  str = qqWechatEmotionParser(str)
  return str;
}



/*
 MIT License - http://www.opensource.org/licenses/mit-license.php
 For usage and examples, visit:
 https://tokinx.github.io/lately/
 Copyright (c) 2017, Biji.IO
*/
var $jscomp = $jscomp || {}; $jscomp.scope = {}; $jscomp.arrayIteratorImpl = function (b) { var g = 0; return function () { return g < b.length ? { done: !1, value: b[g++] } : { done: !0 } } }; $jscomp.arrayIterator = function (b) { return { next: $jscomp.arrayIteratorImpl(b) } }; $jscomp.makeIterator = function (b) { var g = "undefined" != typeof Symbol && Symbol.iterator && b[Symbol.iterator]; return g ? g.call(b) : $jscomp.arrayIterator(b) };
(function (b, g) {
  var p = function (h) {
    var d = h.lang || { second: "\u79d2", minute: "\u5206\u949f", hour: "\u5c0f\u65f6", day: "\u5929", month: "\u4e2a\u6708", year: "\u5e74", ago: "\u524d", error: "NaN" }; h = $jscomp.makeIterator(document.querySelectorAll(h.target || ".time")); for (var c = h.next(); !c.done; c = h.next()) {
      c = c.value; var a = c.dateTime; var e = c.title, f = c.innerHTML; if (!a || isNaN(new Date(a = a.replace(/(.*)[a-z](.*)\+(.*)/gi, "$1 $2").replace(/-/g, "/")))) if (e && !isNaN(new Date(e = e.replace(/-/g, "/")))) a = e; else if (f && !isNaN(new Date(f =
        f.replace(/-/g, "/")))) a = f; else break; c.title = a; a = new Date(a); a = ((new Date).getTime() - a.getTime()) / 1E3; e = a / 60; f = e / 60; var k = f / 24, l = k / 30, m = l / 12; c.innerHTML = (1 <= m ? Math.floor(m) + d.year : 1 <= l ? Math.floor(l) + d.month : 1 <= k ? Math.floor(k) + d.day : 1 <= f ? Math.floor(f) + d.hour : 1 <= e ? Math.floor(e) + d.minute : 1 <= a ? Math.floor(a) + d.second : d.error) + d.ago
    }
  }; var n = function () { return this || (0, eval)("this") }(); "Lately" in n || (n.Lately = p)
})();