require('code-prettify');

export default class Pretty {
  static setup() {
    const pres = Array.from(document.getElementsByTagName('pre'));
    pres.forEach(ele => {
      ele.className = 'prettyprint linenums';
    });
    PR.prettyPrint();
  }
}
