function createReleaseContainer(release) {
  var releaseContainer = $('<div/>', { 'class': 'release col-sm-4 col-md-2'});
  
  var link = $('<a>', {
    href: release.url,
    target: '_blank',
    'class': 'd-block mb-4' 
  });
  release.images = release.images || [{uri: ''}];
  link.append($('<img>', {
    'class': 'img-fluid img-thumbnail img-zoom', 
    src: release.images[0].uri
  }));
  releaseContainer.append(link);

  // price + rating + recommended
  var matches = release.comment.match(/(\*){1,3}/g);
  var rarity = 0;
  if (matches !== null) {
    rarity = matches[0].length;
  }

  var priceEl = $('<div>', { 'class': 'release-price'}).text('£' + release.price || 'N/A');

  var ratingEl = $('<span>', { 'class': 'rating' });
  for (var i = 0; i < 3; i++) {
    var starEl = $('<span>', { 'class': 'star' });
    if (i < rarity) {
      starEl.addClass('solid');
    }
    ratingEl.append(starEl);
  }

  var headerEl = $('<div>', { 'class': 'release-header' }).append(priceEl).append(ratingEl);

  // recommended
  var isRecommended = release.comment.indexOf('Highlight') > 0;

  if (isRecommended) {
    headerEl.append($('<i>', { 'class': 'fa fa-heart recommended', 'aria-hidden': true }));
  }

  releaseContainer.append(headerEl);

  // details
  var releaseDetails = $('<div/>', { 'class': 'release-details'});
  releaseDetails.append($('<h6>', { 'class': 'release-artist' }).text(release.artist));
  releaseDetails.append($('<p>', { 'class': 'release-title' }).text(release.title));
  releaseDetails.append($('<p>', { 'class': 'release-label' }).text(release.year + ' / ' + release.label.name + ' / ' + release.label.catno));
  releaseDetails.append($('<p>', { 'class': 'release-genres'}).text(release.genres.join(' / ')));
  releaseContainer.append(releaseDetails);

  return releaseContainer;
}

$(document).ready(function () {
  var container = $('.container-fluid .row');

  var urlParams = new URLSearchParams(window.location.search);
  var url = '/api/lists/' + (urlParams.get('name') || 'rare-groove');
  var shouldSort = urlParams.get('sort') || false;

  $.ajax({
    url: url,
    statusCode: {
      404: function () {
        $('.list-name').text('Unknown list ' + urlParams.get('name'));    
      }
    }
  }).then(function (data) {
    $('title').text(data.name);
    $('.list-name').text(data.name);
    $('.list-total').text('(' + data.items.length + ')');

    var items = data.items;

    if (shouldSort) {
      items = data.items.sort(function (a, b) { 
        var aJoined = a.artist + a.year + a.title;
        var bJoined = b.artist + b.year + b.title;
        if (aJoined < bJoined) return -1;
        if (aJoined > bJoined) return 1;
        return 0;
      });
    }
    
    var releaseElements = [];
    items.forEach(function (release) {
      var releaseEl = createReleaseContainer(release);
      releaseElements.push(releaseEl);
    });

    container.append(releaseElements);
  });
});
