import assert from 'node:assert/strict';
import { PROBLEMS, INTERVIEW, WEEKS } from '../data.js';
let total=0;
for (const problem of PROBLEMS) {
  assert.match(problem.id,/^[a-z][a-z0-9-]+$/);
  assert.ok(problem.fn && problem.tests.length>=3,`${problem.id}: missing tests`);
  const fn=new Function(`"use strict";\n${problem.solution}\nreturn ${problem.fn};`)();
  for (const test of problem.tests) {
    let actual;
    try {actual=fn(...structuredClone(test.args));} catch (error) {throw new Error(`${problem.id}: reference solution threw ${error.message}`);}
    assert.equal(JSON.stringify(actual),JSON.stringify(test.expected),`${problem.id}: expected ${JSON.stringify(test.expected)}, got ${JSON.stringify(actual)}`);
    total++;
  }
}
assert.equal(PROBLEMS.length,18);
assert.equal(INTERVIEW.length,14);
assert.equal(WEEKS.length,6);
for (const week of WEEKS) assert.equal(week.goals.length,5);
console.log(`PASS ${PROBLEMS.length} problems, ${total} test cases, ${INTERVIEW.length} mock prompts and ${WEEKS.length} weekly plans`);

// Canonical URL script regression check: discard query strings but keep tab hashes.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const cleanupScript = readFileSync(new URL('../url-cleanup.js', import.meta.url), 'utf8');
function checkURL(search, hash, expectedCalls) {
  const calls = [];
  const location = { pathname: '/', search, hash };
  const history = { state: { view: 'arena' }, replaceState: (...args) => calls.push(args) };
  runInNewContext(cleanupScript, { window: { location, history } });
  assert.equal(calls.length, expectedCalls);
  if (expectedCalls) {
    assert.equal(calls[0][2], '/' + hash);
    assert.equal(calls[0][0], history.state);
  }
}
checkURL('?utm_source=referral', '#dashboard', 1);
checkURL('?campaign=share', '#arena', 1);
checkURL('', '#dashboard', 0);
