// Runs candidate code off the UI thread. Each run is disposable and hard-capped by the parent.
self.onmessage = async (event) => {
  const { runId, code, fn, tests } = event.data || {};
  const output = [];
  try {
    // Only user-authored code is evaluated. The worker has no app state or credentials.
    const candidate = new Function(`"use strict";\n${code}\n;return typeof ${fn} === 'function' ? ${fn} : null;`)();
    if (typeof candidate !== 'function') throw new Error(`Define a function named ${fn} before running tests.`);
    for (const test of tests) {
      const t0 = performance.now();
      let actual, ok = false, err = null;
      try {
        const args = structuredClone(test.args);
        actual = await candidate(...args);
        const norm = value => JSON.stringify(value);
        ok = norm(actual) === norm(test.expected);
      } catch (e) { err = String(e?.message || e).slice(0, 240); }
      output.push({ok,actual:format(actual),expected:format(test.expected),error:err,hidden:!!test.hidden,ms:Math.round((performance.now()-t0)*100)/100});
    }
    postMessage({runId,results:output});
  } catch (e) { postMessage({runId,error:String(e?.message || e).slice(0,360)}); }
};
function format(value) {
  try { const json = JSON.stringify(value); return (json===undefined ? String(value) : json).slice(0, 350); }
  catch { return String(value).slice(0,350); }
}
