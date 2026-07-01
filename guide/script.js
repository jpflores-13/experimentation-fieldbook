(function () {
  var ids = ['overview', 'anatomy', 'workflow', 'components', 'interactive', 'state', 'theming'];

  function setActive(activeId) {
    ids.forEach(function (id) {
      var el = document.getElementById('toc-' + id);
      if (el) el.classList.toggle('active', id === activeId);
    });
  }

  function onScroll() {
    var current = ids[0];
    for (var i = 0; i < ids.length; i++) {
      var sec = document.getElementById(ids[i]);
      if (sec && sec.getBoundingClientRect().top <= 130) current = ids[i];
    }
    setActive(current);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
