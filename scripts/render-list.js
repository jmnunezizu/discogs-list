function createReleaseContainer(release) {
  var releaseContainer = $('<div/>', { 'class': 'release col-sm-4 col-md-2'});
  
  var link = $('<a>', {
    href: release.url,
    target: '_blank',
    'class': 'd-block mb-4' 
  });
  link.append('<img class="img-fluid img-thumbnail" src="' + release.thumb + '" />');
  releaseContainer.append(link);

  // price + rating
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

  var headerEl = $('<div>').append(priceEl).append(ratingEl);
  releaseContainer.append(headerEl);

  // details
  var releaseDetails = $('<div/>', { 'class': 'release-details'});
  releaseDetails.append($('<h6>', { 'class': 'release-title' }).text(release.title));
  releaseDetails.append($('<p>', { 'class': 'release-artist' }).text(release.artist));
  releaseDetails.append($('<p>', { 'class': 'release-label' }).text(release.year + ' / ' + release.label.name + ' / ' + release.label.catno));
  releaseDetails.append($('<p>', { 'class': 'release-genres'}).text(release.genres.join(' / ')));
  releaseContainer.append(releaseDetails);

  return releaseContainer;
}

var container = $('.container-fluid .row');

var releaseElements = [];
rareGroove.items.forEach(function (release) {
  var releaseEl = createReleaseContainer(release);
  releaseElements.push(releaseEl);
});

container.append(releaseElements);
