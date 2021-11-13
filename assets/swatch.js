$('.Color-label span').each(function () {
  if($(this).attr('class').indexOf('swatch_color') > -1){
    $(this).attr('style', '');
  }
})
