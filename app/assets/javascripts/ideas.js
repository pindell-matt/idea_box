$(document).ready(function(){
  loadIdeas
    .then(function(){
      deleteListener();
    })

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

});

var loadIdeas = $.getJSON('/api/v1/ideas').then(
  function(ideasResponse, status){
    $.each(ideasResponse, function(index, idea) {
      ideaFormatter(idea);
    });
  }
)

var ideaFormatter = function(idea){
    var id      = idea.id;
    var title   = idea.title;
    var body    = idea.body.substring(0, 100) + ' ...';
    var quality = idea.quality;

    // don't need div id
    var structure = '<div id=' + id + '>' +
      '<h3>Title: ' + title + '</h3>' +
      '<h4>' + quality + '</h4>' +
      '<p>' + body + '</p>';

    var deleteButton = '<button id=' + id + '>Delete</button>';

    $('.ideas').prepend(
      '<li id=' + id + '>' + structure + deleteButton + '</li>'
    );

    $('#new_idea_title').val("");
    $('#new_idea_body').val("");
  }

var deleteListener = function(){
  $(':button').on('click', function(){
    var data = this.id

    $.ajax({
      method: 'DELETE',
      url: '/api/v1/ideas/' + data,
      data: data,
      dataType: 'JSON',
      success: deleteIdea(data),
      error: function(data){
        alert("Error - Failed to delete Idea.");
      }
    });
  })
}

var deleteIdea = function(id) {
  var searchableId = '#' + id
  $(searchableId).remove();
}
