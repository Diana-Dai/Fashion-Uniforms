$('.Color-label span').each(function () {
  if($(this).attr('class').indexOf('swatch_color') > -1){
    var styleValue = $(this)[0].style.color;
    var cssValue = $(this).css('color');
    var parentcssValue = $(this).parent().css('color');
    if (cssValue === parentcssValue) {
      $(this).css('color', $(this).attr('data-color'));
    }
  }
})
