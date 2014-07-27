/*jslint browser: true, plusplus: true, unparam: true, white: true */

;(function(window, $) {

  "use strict";

  var $window = $(window),
      $body = $('html, body'),
      $header = $('.header-inner'),
      $gallery = $('.gallery'),
      $form = $('#form'),
      $upArrow = $form.find('.scroll-up'),
      $input = $form.find('.input'),
      $loading = $('.loading');

  function processData(data) {
     var status = data.stat.toUpperCase(),
        photos = data.photos.photo,
        len = photos.length,
        photo, photoSrc, i, item, imgUrl,
        farmID, serverID, photoID, secret, size,
        items = '';

    if (status === 'OK') {

      for (i = 0; i < len; i++) {
        photo = photos[i];
        farmID = photo.farm;
        serverID = photo.server;
        photoID = photo.id;
        secret = '_' + photo.secret;
        size = '_z';
        imgUrl = 'https://flickr.com/photos/' + photo.owner + '/' + photoID;
        photoSrc = 'https://farm' + farmID + '.staticflickr.com/' + serverID + '/' + photoID + secret + size + '.jpg';
        item = '<div class="item"><a href="' + imgUrl + '" title="Double-click to open image on Flickr" ><img src="' + photoSrc + '" alt="' + photo.title + '" width="200"></a></div>';
        items += item;
      }

      return $(items);
    }
  }

  function queryFlickr(query) {
    var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search',
        APIkey = 'bf221ff37e56f2d668f51d71e164188e',
        tags = encodeURIComponent(query),
        url = flickrAPI + '&api_key=' + APIkey + '&tags=' + tags + '&is_commons=true&format=json&jsoncallback=?';

    $loading.show();

    $.getJSON(url, function(data) {
      var $items;
      $gallery.empty().masonry({itemSelector: '.item', columnWidth: 100, gutter: 10});
      $items = processData(data);
      $gallery.revealImages($items);
    });

  }
  
  $.fn.revealImages = function($items) {
    var masonry = this.data('masonry'),
        itemSelector = masonry.options.itemSelector;
    $items.hide();
    $loading.hide();
    this.append($items);
    $items.imagesLoaded().always(function(instance) {
      var $things = $('.fluidbox');
      $things.on('dblclick', function(event) {
        var $target = $(event.target);
        window.open($target.closest('a').attr('href'));
      });
    }).progress(function(instance, image) {
      var $img = $(image.img),
          $anchor = $img.parent(),
          $item = $img.parents(itemSelector);
      $item.show();
      $anchor.fluidbox({overlayColor: 'rgba(49, 49, 46, 0.85)'});
      
      masonry.appended($item);
    });
 
    return this;
  };

  $form.on('submit', function(event) {
    var query = $input.val();

    if (!!query.trim() || !!$.trim(query)) {
      $('html, body').animate({scrollTop: 0}, 500, 'linear', function() {
        $input.select();
        queryFlickr(query);
      });
    }

    event.preventDefault();
  });

  $upArrow.on('click', function(event) {
    $body.animate({scrollTop: 0}, '500', 'linear');
    event.preventDefault();
  });

  $window.on('scroll', function() {

    var galleryHeight = $gallery.height();

    if (galleryHeight > 400 && $window.scrollTop() > 400) {
      $header.addClass('header-fixed');
    } else {
      $header.removeClass('header-fixed');
    }

  });

  queryFlickr('nature');

}(window, jQuery, undefined));