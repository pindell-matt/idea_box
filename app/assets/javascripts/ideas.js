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
  // ideasResponse.map(ideaFormatter)
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
      '<td contenteditable="true" class="searchable" id="title">' + title + '</td>' +
      '<td>' + quality + '</td>' +
      '<td contenteditable="true" class="searchable" id="body">' + body + '</td>' +
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
  $('td[contenteditable=true]')
    .focus(function() {
      $(this).data("initialText", $(this).html());
    })
    .blur(function() {
      if ($(this).data("initialText") !== $(this).html()) {
        var id = this.parentElement.id;
        var dataType = this.id;
        var data = new Object();
        data[dataType] = $(this).html();

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
    var query = $('#search').val();
    // var allIdeas = $('tr').children('td.searchable');

    var ideaRows = $('tbody').children('tr.searchable');

    ideaRows.each(function(index, row){
      $(row).hide()

      var kids = $(row).children();

      var matches = kids.filter(function (data, content){
        return $(content).text().includes(query);
      })

      var uniqMatches = $.unique(matches);

      uniqMatches.each(function(index, match){
        $($(match).parent('tr')[0]).show()
      })

    })

    // debugger;

    // var matches = ideaRows.each(function (index, row){
    //   $(row).children().map(function(index, tds){
    //     return $(tds).text()
    //   })
    // })
    //
    // debugger;

    // var matches = allIdeas.filter(function (data, content){
    //   return $(content).text().includes(query);
    // })
    //
    // debugger;

    //   var currentText = $(content);
    //   if (currentText.text().includes(query)) {
    //     $(currentText.parent('tr')[0]).show()
    //   } else {
    //     $(currentText.parent('tr')[0]).hide();
    //   }
    //
    // })


    //   var currentText = $(content);
    //   if (currentText.text().includes(query)) {
    //     $(currentText.parent('tr')[0]).show()
    //   } else {
    //     $(currentText.parent('tr')[0]).hide();
    //   }
    //
    // })



    // var matches = allIdeas.each(function (data, content){
    //   var currentText = $(content);
    //   if (currentText.text().includes(query)) {
    //     $(currentText.parent('tr')[0]).show()
    //   } else {
    //     $(currentText.parent('tr')[0]).hide();
    //   }
    //
    // })
  }
}

function toggleRow(row){
  var matches = row.filter(function (data, content){
    return $(content).text().includes(query);
  })
}
