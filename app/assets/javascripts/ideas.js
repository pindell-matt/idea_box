$(document).ready(function(){
  loadIdeas
    .then(function(){
      deleteButtons();
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
        alert("ERROR");
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
    var title   = idea.title;
    var body    = idea.body.substring(0, 100) + ' ...';
    var quality = idea.quality;

    var structure = '<div class=' + title + '>' +
      '<h3>Title: ' + title + '</h3>' +
      '<h4>' + quality + '</h4>' +
      '<p>' + body + '</p>';

    var deleteButton = '<button id=' + idea.id + '>Delete</button>';

    $('.ideas').prepend(
      '<li>' + structure + deleteButton + '</li>'
    );

    $('#new_idea_title').val("");
    $('#new_idea_body').val("");
  }

var deleteButtons = function(){
  $(':button').on('click', function(){
    var data = this.id

    $.ajax({
      method: 'DELETE',
      url: '/api/v1/ideas/' + data,
      data: data,
      dataType: 'JSON',
      success: function(data){
        alert("TOTES WORKED, PLZ REFRESH");
      },
      error: function(data){
        alert("FAILED TO DELETE");
      }
    });
  })
}
