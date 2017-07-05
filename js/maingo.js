const maingoServer = 'http://maingo.ml/logo/direct?q=';

(()=> {
  const elems = document.querySelectorAll('[data-maingo]');
  Array.apply(null, elems).forEach(elem => {
    const img = document.createElement('img');
    const width = elem.getAttribute('data-maingo-width');
    img.src = maingoServer + elem.getAttribute('data-maingo');
    if (width) img.style.width = width + 'px';
    elem.appendChild(img);
  });
})();
