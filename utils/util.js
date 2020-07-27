const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTimeObject=(leftTime)=> {
  let d, h, m, s, ms;
  if (leftTime >= 0) {
    //传入的是秒，去掉了1000
    let overTime = '';
    d = Math.floor(leftTime / 60 / 60 / 24);
    d > 0 && (overTime += (d + "天"));
    h = Math.floor(leftTime / 60 / 60 % 24);

    h = h < 10 ? "0" + h : h;
    overTime += h;
    m = Math.floor(leftTime / 60 % 60);
    m = m < 10 ? "0" + m : m;
    overTime += (':' + m);
    s = Math.floor(leftTime % 60);
    s = s < 10 ? "0" + s : s;
    overTime += (':' + s);


    return {
      overTime: overTime,
      day: d,
      hour: h,
      min: m,
      send: s,
      Time: (h > 0 ? h : '00') + "小时" + (m > 0 ? m : '00') + "分" + (s > 0 ? s : '00') + '秒' // status == 1,
    }
  }
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatHtml = content => {
  content = content.replace(/\<img/gi, '<img style="width:100% !important;height:auto !important;margin:0;display:flex;" ');
  content = content.replace(/\<td/gi, '<td  cellspacing="0" cellpadding="0" border="0" style="display:block;vertical-align:top;margin: 0px; padding: 0px; border: 0px;outline-width:0px;" ');
  content = content.replace(/width=/gi, 'sss=');
  content = content.replace(/height=/gi, 'sss=');
  content = content.replace(/ \/\>/gi, ' style="max-width:100% !important;height:auto !important;margin:0;display:block;" \/\>');
  return content;
}

module.exports = {
  formatTimeObject,
  formatTime: formatTime,
  formatHtml: formatHtml
}
