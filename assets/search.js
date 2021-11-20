var selectedTags = [];

function filterProducts(selectedTags) {
      var sizeOptions = [],
          colorOptions = [];

      $('#ProductGridContainer ul').children().each(function () {
        const tags = $(this).attr('data-sizes') + $(this).attr('data-colors');
        console.log(tags);
        $(this).removeClass('hidden');
        for (let index = 0; index < selectedTags.length; index++) {
          const tag = selectedTags[index];
          if(tags.indexOf(tag) === -1){
            $(this).addClass('hidden');
          }
          return
        }
        
      })
}

function renderSectionFromFetch(url) {
  fetch(url)
    .then(response => response.text())
    .then((responseText) => {
      const html = responseText;
      renderProductGridContainer(html)
    });
}

function renderProductGridContainer(html) {
  document.getElementById('ProductGridContainer').innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductGridContainer').innerHTML;
  filterProducts(selectedTags);
}

function setSelectedColor() {
  let selectedColor = [];
  $('#selectedColor').empty();
  $('input[name="filter.v.option.color"]').each(function () {
    if($(this).attr('checked')){
      selectedColor.push($(this).val())
    }
    })
  
  if (selectedColor.length > 0) {
    $('#selectedColor').append('<span>Color:</span>');;        
    for (let index = 0; index < selectedColor.length; index++) {
      const newNode = $(`<span class="color">${selectedColor[index]}</span>`);
      $('#selectedColor').append(newNode);;        
    }
    // Show color swatches
    // $('#ProductGridContainer').addClass('show_color_swatches');
  }else{
    // $('#ProductGridContainer').removeClass('show_color_swatches');
  }
}

function throttle(fn, delay) {
  var previous = 0;
  return function() {
      var _this = this;
      var args = arguments;
      var now = new Date();
      if(now - previous > delay) {
          fn.apply(_this, args);
          previous = now;
      }
  }
}
$(document).ready(function () {
 setSelectedColor();

 $('form.filter-form').click(function (e) {
 if(e.target.tagName === "INPUT"){
 $(this).submit();
 }
})

 $('#sortBy').change(function (e) { 
  e.preventDefault();
  const selectedSort = $("input[type='radio']:checked").val();
  const url = window.location + '&filter.v.price.gte=&filter.v.price.lte=&sort_by=' + selectedSort;
  renderSectionFromFetch(url);
});

// Hover color options
$('.options').each(function(){
  $(this).click(function (e) {
    e.preventDefault();
    })
  $(this).mouseover(function (e) {
    triggermouseOver(e);
  })
  var triggermouseOver = throttle(mouseOver, 100);
  function mouseOver(e) {
    e.preventDefault();
    var productInfo = '',thisVariant, productImgNode;
    if(e.target.nodeName === "LABEL"){
      if(productInfo === ''){
        var targetId = e.target.parentNode.parentNode.querySelector('a').getAttribute('data-info');
        productImgNode = e.target.parentNode.parentNode.querySelector('img');
        productInfo = JSON.parse(document.getElementById(targetId).text).variants;
      }
      thisVariant = $(e.target).attr('data-label');
      // console.log(thisVariant);
    }
    if (productInfo !== '') {
      var imgsrc = getTheImgSrc(productInfo, thisVariant);
      if(imgsrc){
      updateProductImg(productImgNode, imgsrc);
      }else{
        updateProductImg(productImgNode, '')
      }
    }
    function getTheImgSrc(productInfo, thisVariant) {
      var variant = productInfo.find(item=>{
        if (item.option1 === thisVariant) {
          return true
        }else if(item.option2 === thisVariant){
          return true
        }
      })
      if(!variant || !variant.featured_image) {
        return;
      }
      return variant.featured_image.src;
    };
    function updateProductImg(productImgNode, url) {
      var srcset = productImgNode.getAttribute('srcset');
      if (srcset !== url) {
        productImgNode.setAttribute('srcset', url);
      }
    }
  }
})
});
