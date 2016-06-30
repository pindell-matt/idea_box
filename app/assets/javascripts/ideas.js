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
      success: processIdea,
      error: function(data){
        alert("Error - Could not create Idea.");
      }
    });
  });

  $('.ideas').on('click', '.delete', function(){
    var id = this.id,
        data = { id: id }

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
    var id = this.id,
        currentQuality = $('tr#' + id + ' td:nth-child(2)'),
        quality = changeQuality(currentQuality.html(), "up"),
        data = { quality: quality };

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
    var id = this.id,
        currentQuality = $('tr#' + id + ' td:nth-child(2)'),
        quality = changeQuality(currentQuality.html(), "down"),
        data = { quality: quality };

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
      processIdea(idea);
    });
  }
)

var processIdea = function(idea){
    var structure = rowContentsFormatter(idea);
    prependNewIdea(idea.id, structure);
    clearNewIdeaForm();
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
        var id = this.parentElement.id,
            dataType = this.id,
            data = new Object();

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
    var $query = $('#search').val(),
        $ideaRows = $('tbody').children('tr.searchable');

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
  var $ideaRows = $('tbody').children('tr.searchable');
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

var buttonsFormatter = function(id){
  var deleteButton = '<button class="delete" id=' + id + '>Delete</button>',
      thumbsUp = '<button class="thumbs_up" id=' + id + '>Thumbs Up</button>',
      thumbsDown = '<button class="thumbs_down" id=' + id + '>Thumbs Down</button>';
  return thumbsUp + thumbsDown + deleteButton;
}

var bodyLengthFormatter = function(rawBody){
  if (rawBody.length > 100) {
    return body = rawBody.substr(0, 100) + "...";
  } else {
    return body = rawBody;
  }
}

var rowContentsFormatter = function(idea){
  var title = idea.title,
      quality = idea.quality,
      body = bodyLengthFormatter(idea.body),
      buttons = buttonsFormatter(idea.id);

  return structure =
    '<td contenteditable="true" class="searchable title">' + title + '</td>' +
    '<td>' + quality + '</td>' +
    '<td contenteditable="true" class="searchable body">' + body + '</td>' +
    '<td>' + buttons + '</td>';
}

var prependNewIdea = function(id, structure){
  $('.ideas tr:first').after(
    '<tr class="searchable" id=' + id + '>' + structure + '</tr>'
  );
}

var clearNewIdeaForm = function(){
  $('#new_idea_title').val("");
  $('#new_idea_body').val("");
}
