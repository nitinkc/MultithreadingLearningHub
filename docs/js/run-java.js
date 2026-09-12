document.addEventListener('DOMContentLoaded', function () {
  if (!location.pathname.includes('race-conditions')) {
    return;
  }

  document.querySelectorAll('div[class*="language-java"]').forEach(function (block) {
    var pre = block.querySelector('pre');
    if (!pre) return;

    var code = pre.querySelector('code');
    var source = code ? code.textContent : pre.textContent;

    var button = document.createElement('button');
    button.textContent = '▶ Run in JDoodle';
    button.className = 'md-button md-button--primary';
    button.style.marginTop = '0.5rem';
    button.style.marginBottom = '1rem';
    button.type = 'button';

    button.addEventListener('click', function () {
      var form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.jdoodle.com/api/redirect-to-post/online-java-compiler';
      form.target = '_blank';
      form.style.display = 'none';

      var textarea = document.createElement('textarea');
      textarea.name = 'initScript';
      textarea.value = source;
      form.appendChild(textarea);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    });

    block.insertAdjacentElement('afterend', button);
  });
});
