$(document).ready(function(){
  listenForSearches()
  loadIdeas

  $('#idea-form').submit(function(event){
    event.preventDefault();
    var data = $(this).serialize();

    $.ajax({
      method: 'POST',
      url: '/api/v1/ideas',
      data: data,
      dataType: 'JSON',
      success: ideaFormatter,
      error: function(data){
        alert("Error - Could not create Idea.");
      }
    });
  });

  $('.ideas').on('click', '.delete', function(){
    var id = this.id
    var data = { id: id }

    $.ajax({
      method: 'DELETE',
      url: '/api/v1/ideas/' + id,
      dataType: 'JSON',
      success: deleteIdea(id),
      error: function(id){
        alert("Error - Failed to delete Idea: " + id);
      }
    });
  })

  $('.ideas').on('click', '.thumbs_up', function(){
    var id = this.id;
    var currentQuality = $('tr#' + id + ' td:nth-child(2)');
    var quality = changeQuality(currentQuality.html(), "up");
    var data = { quality: quality };

    if (currentQuality.html() !== quality) {
      $.ajax({
        method: 'PATCH',
        url: '/api/v1/ideas/' + id,
        data: data,
        dataType: 'JSON',
        success: currentQuality.html(quality),
        error: function(id){
          alert("Error - Failed to update Idea to: " + quality);
        }
      });
    }

  })

  $('.ideas').on('click', '.thumbs_down', function(){
    var id = this.id;
    var currentQuality = $('tr#' + id + ' td:nth-child(2)');
    var quality = changeQuality(currentQuality.html(), "down");
    var data = { quality: quality };

    if (currentQuality.html() !== quality) {
      $.ajax({
        method: 'PATCH',
        url: '/api/v1/ideas/' + id,
        data: data,
        dataType: 'JSON',
        success: currentQuality.html(quality),
        error: function(id){
          alert("Error - Failed to update Idea to: " + quality);
        }
      });
    }
  })

});

var loadIdeas = $.getJSON('/api/v1/ideas').then(
  function(ideasResponse, status){
    $.each(ideasResponse, function(index, idea) {
      ideaFormatter(idea);
    });
  }
)

var ideaFormatter = function(idea){
    var id = idea.id;
    var title = idea.title;
    var quality = idea.quality;

    var rawBody = idea.body;
    if (rawBody.length > 100) {
      var body = rawBody.substr(0, 100) + "...";
    } else {
      var body = rawBody;
    }

    var deleteButton = '<button class="delete" id=' + id + '>Delete</button>';
    var thumbsUp = '<button class="thumbs_up" id=' + id + '>Thumbs Up</button>';
    var thumbsDown = '<button class="thumbs_down" id=' + id + '>Thumbs Down</button>';

    var buttons = thumbsUp + thumbsDown + deleteButton;

    var structure =
      '<td contenteditable="true" class="searchable title">' + title + '</td>' +
      '<td>' + quality + '</td>' +
      '<td contenteditable="true" class="searchable body">' + body + '</td>' +
      '<td>' + buttons + '</td>';

    $('.ideas tr:first').after(
      '<tr class="searchable" id=' + id + '>' + structure + '</tr>'
    );

    $('#new_idea_title').val("");
    $('#new_idea_body').val("");

    listenForEdits();
  }

var deleteIdea = function(id){
  var searchableId = '#' + id;
  $(searchableId).remove();
}

var changeQuality = function(current, movement){
  if (movement === "up") {
    var map = { "swill": "plausible", "plausible": "genius", "genius": "genius" };
  } else if (movement === "down") {
    var map = { "swill": "swill", "plausible": "swill", "genius": "plausible" };
  }
  return newQuality = map[current];
}

var listenForEdits = function(){
  var $td = $(this);
  $('td[contenteditable=true]')
    .focus(function() {
      $td.data("initialText", $td.html());
    })
    .blur(function() {
      if ($td.data("initialText") !== $td.html()) {
        var id = this.parentElement.id;
        var dataType = this.id;
        var data = new Object();
        data[dataType] = $td.html();

        $.ajax({
          method: 'PATCH',
          url: '/api/v1/ideas/' + id,
          data: data,
          dataType: 'JSON',
          error: function(id){
            alert("Error - Failed to update content.");
          }
        });
    }
  });
}

var listenForSearches = function(){
  $('#search').bind('keyup', updateQuery);

  function updateQuery(){
    var $query = $('#search').val();
    var $ideaRows = $('tbody').children('tr.searchable');

    $ideaRows.each(function(index, row){
      $(row).hide()

      var kids = $(row).children();

      var matches = kids.filter(function (data, content){
        return $(content).text().includes($query);
      })

      var uniqMatches = $.unique(matches);

      uniqMatches.each(function(index, match){
        $($(match).parent('tr')[0]).show()
      })

    })
  }
}

function toggleRow(row){
  var matches = row.filter(function (data, content){
    return $(content).text().includes(query);
  })
}

var sortRows = function(){
  var $people = $('ul.js-people'),
      $peopleli = $people.children('li');

  $peopleli.sort(function(a,b){
    var an = a.getAttribute('data-name'),
    	  bn = b.getAttribute('data-name');

    if(an > bn) {
    	return 1;
    }
    if(an < bn) {
    	return -1;
    }
    return 0;
  });

  $peopleli.detach().appendTo($people);
}
