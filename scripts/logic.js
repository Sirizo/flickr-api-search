function results(){
     searchFlickr('sea');
     $('#searchBtn').click(function (){
          $('.album .row').html('');
          if ($('#search').val() == null || $('#search').val() == '') {
               searchFlickr('');
          } else {
               searchFlickr($('#search').val().toLowerCase().replace(" ",""));
          }
     });
     checkImages();
}

function searchFlickr(searchTerm) {

     $.ajax({
          url: 'https://api.flickr.com/services/feeds/photos_public.gne?tags='+searchTerm+'&tagmode=all&safe_search=1&format=json', 
          type: 'GET',
          dataType: "jsonp",
          jsonpCallback: 'jsonFlickrFeed',
          jsonp: "jsonp",
          success: function( msg ) {
               // Make feedData equal to the data within the 'items' outer object of msg
               var feedData = msg.items ? msg.items : {};

               var title, img, author, lnk, authlnk, description, tags;

               // Go through feedData and print out each entry provided it has something
               for (var i = 0; i < 8; i++) {

                    if(typeof feedData[i].title !== 'undefined'){

                         title = feedData[i].title;
                         img = feedData[i].media.m;
                         author = getAuthor(feedData[i].author);
                         lnk = feedData[i].link;
                         authlnk = getLinks(feedData[i].link);
                         description = getDescription(feedData[i].description);
                         tags = getTags(feedData[i].tags);

                         // Output everything
                         $('.album .row').append('<div class="col-md-3">\
                                                    <div class="card mb-4 box-shadow">\
                                                      <a class="imageCard" href="'+lnk+'">\
                                                       <img class="card-img-top" alt="" src="'+img+'" data-holder-rendered="true">\
                                                      </a>\
                                                      <div class="card-body">\
                                                        <div class="d-flex justify-content-between align-items-center">\
                                                          <p><a href="'+lnk+'">'+title+'</a> by <a href="'+authlnk+'">'+author+'</a></p>\
                                                        </div>\
                                                        <p class="card-text">'+description+'</p>\
                                                        <div class="d-flex justify-content-between align-items-center">\
                                                          <p>Tags: <a href="https://www.flickr.com/photos/tags/'+tags[0]+'">'+tags[0]+'</a>, <a href="https://www.flickr.com/photos/tags/'+tags[1]+'">'+tags[1]+'</a>, <a href="https://www.flickr.com/photos/tags/'+tags[2]+'">'+tags[2]+'</a>, <a href="'+lnk+'">...</a></p>\
                                                        </div>\
                                                      </div>\
                                                    </div>\
                                                  </div>')

                    }
               }
          }
     });
     checkImages();
}

function getAuthor(tmp1) {
     var tmp2, author;
     tmp2 = tmp1.replace('nobody@flickr.com ("', '');
     author = tmp2.replace('")', '');

     return author;
}

function getDescription(description) {
     // Sanitize desriptions
     if ($.parseHTML(description).length == 5) {
          return description = '';
     } else if ($.parseHTML(description).length == 6) {
          if ($.parseHTML(description)[5].innerHTML.length > 100) {
               return description = $.parseHTML(description)[5].textContent.substring(0,100) + '...';
          } else {
               return description = $.parseHTML(description)[5].textContent;
          }
     }
}

function getLinks(profile) {
     var tmp, tmplnk;

     tmp = profile.slice(0, -2);
     tmplnk = tmp.split("\/");     
     tmplnk.pop();    
     
     return tmplnk.join("\/");
}

function getTags(tags) {
     return tags.split(' ').slice(0,3);
}

function checkImages(){
  if ( ! Modernizr.objectfit ) {
    $('.imageCard').each(function () {
      var $container = $(this),
          imgUrl = $container.find('.card-img-top').prop('src');
      if (imgUrl) {
        $container
          .css('backgroundImage', 'url(' + imgUrl + ')')
          .addClass('compat-object-fit');
      }  
    });
  }
}

results();