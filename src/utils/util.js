// 封装公共工具

export function dateString(time){
  var date =new Date(time);
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  month = month < 10 ?"0"+month:month;
  day = day < 10 ?"0"+day:day;
  return year+"-"+month+"-"+day;
}