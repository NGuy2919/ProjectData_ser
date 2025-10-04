// nav.js — small accessible toggle for topbar
(function(){
  // wait for DOM
  function ready(fn){
    if(document.readyState!='loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function(){
    const btn = document.querySelector('.nav-toggle');
    const nav = document.getElementById('navLinks');
    if(!btn || !nav) return;
    function open(){
      nav.classList.add('open');
      btn.setAttribute('aria-expanded','true');
      const first = nav.querySelector('a,button,input');
      if(first) first.focus();
    }
    function close(){
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      btn.focus();
    }
    btn.addEventListener('click', function(e){
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if(expanded) close(); else open();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && nav.classList.contains('open')) close();
    });
    document.addEventListener('click', function(e){
      if(window.innerWidth > 720) return; // only on small screens
      if(!nav.contains(e.target) && !btn.contains(e.target)){
        if(nav.classList.contains('open')) close();
      }
    });
  });
})();
