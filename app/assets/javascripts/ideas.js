$(document).ready(function(){

  $.getJSON('/api/v1/ideas').then(
    function(ideasResponse, status){
      $.each(ideasResponse, function(index, idea) {
        ideaFormatter(idea);
      });
    }
  )

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

  function ideaFormatter(idea){
    var title   = idea.title;
    var body    = idea.body;
    var quality = idea.quality;

    var structure = '<div class=' + title + '>' +
      '<h3>' + title + '</h3>' +
      '<h4>' + quality + '</h4>' +
      '<span>' + body + '</span>';

    var deleteButton = '<button id=' + title + '>Delete</button>';

    $('.ideas').prepend(
      '<li>' + structure + deleteButton + '</li>'
    );
  }
});
