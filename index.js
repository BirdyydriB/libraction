const absolutePath = window.location.origin + '/libraction';
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
  function(m, key, value) {
    vars[key] = value;
  });
  return vars;
}

$(document).ready(function() {
  // Load menu if it's not loaded
  if($('#menu').html().trim() === '') {
    loadMenu();
  }

  function loadMenu() {
    $.ajax({
      url : absolutePath + '/components/menu.html',
      type : 'GET',
      dataType : 'html',
      success : function(response) {
        $('#menu').html(response);

        // Current page : activate menu
        const pageName = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        activateMenu(pageName);

        // On menu click
        $('a.nav-link').click(function(event) {
          event.preventDefault();
          if(!$(this).hasClass('active')) {
            loadPage($(this).attr('href'));
          }
          return false;
        });
      }
    });
  }

  function loadPage(pageName) {
    const pageUrl = (pageName == 'index.html') ?
      (absolutePath + '/' + pageName) :
      (absolutePath + '/pages/' + pageName);

    $.ajax({
      url : pageUrl,
      type : 'GET',
      dataType : 'html',
      success : function(response) {
        const newTitle = $(response).filter('title').text();
        const newContent = $(response).find('#content').html();
        const onLoadScript = $(response).filter('script.onLoad').text();
        if(onLoadScript != '') {
          eval(onLoadScript);
        }
        setPage(pageName, newTitle, newContent);
        window.history.pushState({
          "content": newContent,
          "title": newTitle,
          "pageName": pageName
        }, "", pageUrl);
      }
    });
  }

  function setPage(pageName, pageTitle, pageContent) {
    $('#content').html(pageContent);
    document.title = pageTitle;
    activateMenu(pageName);
  }

  function activateMenu(pageName) {
    $('.active').removeClass('active');
    const pageMenu = (pageName != '') ?
      $('#menu').find('a[href="' + pageName + '"]') :
      $('#menu').find('a[href="index.html"]');
    pageMenu.addClass('active');
  }

  window.onpopstate = function(event) {
    setPage(event.state.pageName, event.state.title, event.state.content);
  };

});
