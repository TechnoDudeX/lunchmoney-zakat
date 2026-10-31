// Run with: node --test tests/calculator.test.cjs
// Exercises the actual inline calculator without a browser or dependencies.
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');

const html = readFileSync(resolve(__dirname, '../index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function calculator() {
  const fields = {};
  let focused;
  const values = { goldPrice: '100', silverPrice: '2', goldGramsNisab: '85', silverGramsNisab: '595',
    goldKarat: '18', silverPurity: '0.925', mortgagePerYear: '12' };
  const radio = { nisab: 'silver', mortgage: 'none' };
  const element = id => fields[id] ||= { value: values[id] || '', textContent: '', innerHTML: '',
    attributes: {}, classList: { toggle() {} }, addEventListener() {},
    setAttribute(name, value) { this.attributes[name] = value; },
    toggleAttribute(name, present) { if (present) this.attributes[name] = ''; else delete this.attributes[name]; },
    focus() { focused = id; }, scrollIntoView() {} };
  const context = vm.createContext({ Intl, Date, window: { scrollTo() {} }, document: {
    getElementById: element,
    querySelector: selector => ({ value: radio[selector.match(/name=(\w+)/)[1]] }),
    querySelectorAll: () => [], addEventListener() {}
  } });
  // Expose private functions in this test VM only; production has no test hooks.
  vm.runInContext(script.replace(/\}\)\(\);\s*$/, `
    globalThis.subject = { totals, hawlMonths, buildData, kindOf, render, setView, waterfallModel, historyPlot, calculationItems, isAdjusted, sourceOf, methodChartMarkup,
      configure: function (accounts, debts, months) {
        accountRows = accounts; debtRows = debts; D = { months: months };
        money = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });
        price = money;
      }
    };
  })();`), context);
  context.subject.configure([], [], ['2026-09', '2026-10']);
  return { app: context.subject, field: element, radio, focused: () => focused };
}

const row = (amount, history = [], checked = true) => ({
  cb: { checked }, input: { value: String(amount) },
  data: { history, amount }, tr: { classList: { toggle() {} } }
});

test('sample estimate remains 811.25, with all six method combinations', () => {
  const { app, field } = calculator();
  app.configure([4200, 8500, 6300, 12000, 2100].map(x => row(x)), [row(650)], ['2026-10']);
  field('mortgagePayment').value = '500';
  for (const metal of ['silver', 'gold']) {
    for (const [method, deduction] of [['none', 0], ['next', 500], ['year', 6000]]) {
      const result = app.totals(metal, method);
      assert.equal(result.net, 32450 - deduction);
      assert.equal(result.due, (32450 - deduction) * 0.025);
    }
  }
});

test('missing, zero or negative nisab prices and weights are incomplete', () => {
  const { app, field } = calculator();
  for (const id of ['silverPrice', 'silverGramsNisab']) {
    const original = field(id).value;
    for (const value of ['', '0', '-1']) {
      field(id).value = value;
      const result = app.totals('silver', 'none');
      assert.equal(result.ready, false);
      assert.equal(result.due, null);
    }
    field(id).value = original;
  }
  app.render();
});

test('owned metals need prices even when the other metal sets the nisab', () => {
  const { app, field } = calculator();
  field('goldGrams').value = '100';
  field('goldPrice').value = '';
  let result = app.totals('silver', 'none');
  assert.equal(result.nisabReady, true);
  assert.equal(result.assetsReady, false);
  assert.equal(result.due, null);
  app.render();
  assert.equal(field('due').textContent, 'Incomplete');
  assert.match(field('lines').innerHTML, /gold price/);
  assert.match(field('methodRows').innerHTML, /Incomplete/);
  field('goldPrice').value = '100';
  assert.equal(app.totals('silver', 'none').goldValue, 7500);
  field('silverGrams').value = '100';
  field('silverPrice').value = '';
  assert.equal(app.totals('gold', 'none').due, null);
});

test('unused metal price is optional; below-nisab and negative net totals are valid zero estimates', () => {
  const { app, field } = calculator();
  field('goldPrice').value = '';
  assert.equal(app.totals('silver', 'none').ready, true);
  assert.equal(app.totals('silver', 'none').due, 0);
  app.configure([row(-100)], [row(-200)], ['2026-10']);
  const result = app.totals('silver', 'none');
  assert.equal(result.net, -100);
  assert.equal(result.due, 0);
});

test('nisab equality qualifies, purity is applied, and unchecked balances are excluded', () => {
  const { app, field } = calculator();
  app.configure([row(1190), row(99999, [], false)], [], ['2026-10']);
  assert.equal(app.totals('silver', 'none').due, 29.75);
  field('goldGrams').value = '10';
  field('silverGrams').value = '100';
  assert.equal(app.totals('silver', 'none').assets, 1190 + 750 + 185);
});

test('partial history cannot classify a month, including missing debt balances', () => {
  const { app, field } = calculator();
  const accounts = [row(5000, [5000, 5000]), row(5000, [null, 5000])];
  const debts = [row(100, [100, null])];
  const result = app.hawlMonths(['2026-08', '2026-09', '2026-10'], accounts, debts, 1190, true);
  for (const month of result.slice(0, 2)) {
    assert.equal(month.has, true);
    assert.equal(month.complete, false);
    assert.equal(month.above, null);
    assert.equal(month.missing, 1);
  }
  assert.equal(result[2].total, 9900);
  assert.equal(result[2].complete, true);
  app.configure(accounts, debts, ['2026-08', '2026-09', '2026-10']);
  app.render();
  assert.equal((field('hawlRows').innerHTML.match(/Partial: 1 missing/g) || []).length, 2);
  assert.match(field('hawlSummary').textContent, /2 rows are missing selected account balances/);
  assert.match(field('hawlSummary').textContent, /1 complete row\./);
});

test('zero history is data; no history stays unknown; credits do not increase historical wealth', () => {
  const { app } = calculator();
  const result = app.hawlMonths(['2026-08', '2026-09', '2026-10'], [row(0, [0, null])], [row(0, [-200, null])], 1190, true);
  assert.equal(result[0].complete, true);
  assert.equal(result[0].total, 0);
  assert.equal(result[0].above, false);
  assert.equal(result[1].has, false);
  assert.equal(result[1].above, null);
  assert.equal(app.hawlMonths(['2026-09', '2026-10'], [row(2000, [2000])], [], 0, false)[0].above, null);
});

test('deselected rows do not cause partial history; closed-account gaps remain unknown', () => {
  const { app } = calculator();
  const accounts = [row(2000, [2000]), row(0, [null], false)];
  assert.equal(app.hawlMonths(['2026-09', '2026-10'], accounts, [], 1190, true)[0].complete, true);
  accounts[1].cb.checked = true;
  accounts[1].data.status = 'closed';
  assert.equal(app.hawlMonths(['2026-09', '2026-10'], accounts, [], 1190, true)[0].complete, false);
});

test('mapping preserves closed history, excludes property and never values coin units as money', () => {
  const { app } = calculator();
  const data = app.buildData({ primary_currency: 'cad' }, [], [
    { id: 1, type: 'cash', name: 'Closed savings', status: 'closed', to_base: 999 },
    { id: 2, type: 'real estate', name: 'Home', to_base: 500000 },
    { id: 3, type: 'loan', subtype: 'mortgage', name: 'Mortgage', to_base: 200000 }
  ], [{ id: 4, symbol: 'BTC', balance: 100, to_base: null }], [], [
    { source: { type: 'manual', manual_account_id: 1 }, balances: [{ month: '2026-09', to_base: 2000 }] }
  ], {}, ['2026-09', '2026-10']);
  assert.equal(data.accounts.length, 2);
  assert.equal(data.accounts[0].amount, 0);
  assert.equal(data.accounts[0].history[0], 2000);
  assert.equal(data.accounts[1].amount, 0);
  assert.equal(data.accounts[1].include, false);
  assert.equal(data.mortgages[0].balance, 200000);
});

test('null and invalid history amounts stay unknown instead of becoming zero', () => {
  const { app } = calculator();
  const data = app.buildData({ primary_currency: 'cad' }, [], [
    { id: 1, type: 'cash', name: 'Savings', to_base: 2000 }
  ], [], [], [{ source: { type: 'manual', manual_account_id: 1 }, balances: [
    { month: '2026-07', to_base: null }, { month: '2026-08', to_base: 'invalid' },
    { month: '2026-09', to_base: 0 }
  ] }], {}, ['2026-07', '2026-08', '2026-09', '2026-10']);
  assert.deepEqual(Array.from(data.accounts[0].history), [null, null, 0, null]);
});

test('review and estimate navigation preserves amounts and moves keyboard focus', () => {
  const { app, field, focused } = calculator();
  field('cashHome').value = '123';
  app.setView('estimate');
  assert.equal(field('reviewView').hidden, true);
  assert.equal(field('estimateView').hidden, false);
  assert.equal(field('estimateStep').attributes['aria-current'], 'step');
  assert.equal(field('reviewStep').attributes['aria-current'], undefined);
  assert.equal(focused(), 'estimateHead');
  app.setView('review');
  assert.equal(field('estimateView').hidden, true);
  assert.equal(field('reviewView').hidden, false);
  assert.equal(field('cashHome').value, '123');
  assert.equal(focused(), 'reviewHead');
});

test('missing prices reveal their settings and mortgage inputs follow the selected method', () => {
  const { app, field, radio } = calculator();
  field('silverPrice').value = '';
  app.render();
  assert.equal(field('priceSettings').open, true);
  assert.match(field('lines').innerHTML, /Prices &amp; nisab weights/);
  assert.equal(field('mortgageFields').hidden, true);
  radio.mortgage = 'year';
  app.render();
  assert.equal(field('mortgageFields').hidden, false);
  assert.equal(field('mortgageChoice').textContent, 'Next 12 months');
});


test('calculation ledger reconciles accounts, adjustments, additions and all deductions', () => {
  const { app, field, radio } = calculator();
  const imported = row(10000.13), adjusted = row(2000.25), excluded = row(999, [], false);
  adjusted.data.amount = 1900;
  imported.data.name = '<Account & name>';
  app.configure([imported, adjusted, excluded], [row(300.12), row(-20)], ['2026-10']);
  field('cashHome').value = '25.10';
  field('goldGrams').value = '2.5';
  field('silverGrams').value = '10';
  field('otherDebts').value = '70.05';
  field('mortgagePayment').value = '500';
  radio.mortgage = 'year';
  const total = app.totals('silver', 'year');
  const items = app.calculationItems(total);
  assert.ok(Math.abs(items.reduce((sum, item) => sum + item.amount, 0) - total.net) < 1e-8);
  assert.equal(items[0].source, 'Lunch Money');
  assert.equal(items[1].source, 'Adjusted here');
  assert.equal(items.find(item => item.name.startsWith('Mortgage:')).amount, -6000);
  assert.equal(items.filter(item => item.source === 'Added here').length, 4);
  app.render();
  assert.match(field('calculationItems').innerHTML, /&lt;Account &amp; name&gt;/);
  assert.doesNotMatch(field('calculationItems').innerHTML, /<Account/);
  field('goldPrice').value = '';
  const incomplete = app.totals('silver', 'year');
  assert.equal(app.calculationItems(incomplete).find(item => item.name.startsWith('Gold')).amount, null);
  app.render();
  assert.match(field('calculationItems').innerHTML, /Price needed/);
  assert.doesNotMatch(field('calculationChart').innerHTML, /<rect/);
});

test('adjustment provenance compares against the cents shown in the imported field', () => {
  const { app } = calculator();
  const imported = row(123.46);
  imported.data.amount = 123.45678;
  assert.equal(app.isAdjusted(imported), false);
  imported.input.value = '123.45';
  assert.equal(app.isAdjusted(imported), true);
  imported.input.value = '123.460';
  assert.equal(app.isAdjusted(imported), false);
});

test('waterfall shows the exact contribution of additions and deductions, including negative net wealth', () => {
  const { app } = calculator();
  const steps = app.waterfallModel(100.25, 120.75, 200.50);
  assert.deepEqual(Array.from(steps, step => [step.start, step.end, step.amount]), [
    [0, 100.25, 100.25], [100.25, 120.75, 20.5], [120.75, -79.75, -200.5], [0, -79.75, -79.75]
  ]);
  for (const value of [0, -100, 100]) {
    const { field, app: renderer } = calculator();
    renderer.configure([row(value)], [row(200)], ['2026-10']);
    renderer.render();
    assert.doesNotMatch(field('calculationChart').innerHTML, /NaN|Infinity|height="-/);
  }
});

test('history graph breaks at unknown and partial months, retains zero and negative balances', () => {
  const { app } = calculator();
  const months = [
    { month: '2026-04', total: 0, has: true, complete: true, missing: 0 },
    { month: '2026-05', total: -10, has: true, complete: true, missing: 0 },
    { month: '2026-06', total: 0, has: false, complete: false, missing: 2 },
    { month: '2026-07', total: 100, has: true, complete: true, missing: 0 },
    { month: '2026-08', total: 150, has: true, complete: false, missing: 1 },
    { month: '2026-09', total: 200, has: true, complete: true, missing: 0 },
    { month: '2026-10', total: 250, has: true, complete: true, missing: 0 }
  ];
  const plot = app.historyPlot(months, 190, true);
  assert.deepEqual(Array.from(plot.segments, run => Array.from(run, point => point.month)), [
    ['2026-04', '2026-05'], ['2026-09', '2026-10']
  ]);
  assert.equal(plot.points[2].y, null);
  assert.ok(Number.isFinite(plot.points[0].y));
  assert.ok(plot.extent.min < -10 && plot.extent.max > 250);
  assert.ok(Number.isFinite(plot.thresholdY));
  assert.equal(app.historyPlot(months, 0, false).thresholdY, null);
  const zeroOnly = app.historyPlot([{ ...months[0], total: 0 }], 0, false);
  assert.ok(Number.isFinite(zeroOnly.points[0].y));
});

test('method graphs distinguish a genuine zero from incomplete input', () => {
  const { app } = calculator();
  const markup = app.methodChartMarkup([
    { metal: 'silver', mode: 'none', ready: true, due: 0, selected: true },
    { metal: 'gold', mode: 'next', ready: false, due: null, selected: false }
  ]);
  assert.match(markup, /\$0\.00/);
  assert.match(markup, /Incomplete/);
  assert.match(markup, /aria-pressed="true"/);
  assert.doesNotMatch(markup, /NaN|Infinity|--bar-size:-/);
});
