/** Keep the address bar free of referral and campaign parameters. */
(() => {
  if (!window.location.search) return;
  const cleanPath = window.location.pathname + window.location.hash;
  try {
    window.history.replaceState(window.history.state, '', cleanPath);
  } catch (_) {
    // Browsers can restrict history updates in sandboxed previews.
  }
})();
