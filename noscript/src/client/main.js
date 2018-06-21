// make exceptions loud, otherwise they will be swallowed by framework.
// eg. to throw exceptions out of rejected Vow promises.
ns.log.exception = (name, err) => {
  throw err;
};

// init
document.addEventListener('DOMContentLoaded', () => {
  ns.init();
  ns.page.go();
});
