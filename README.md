# Mizan: zakat calculator for Lunch Money

**Use it here: https://lunchmoney-zakat.netlify.app**

Made by Mazin Kanuga. Mizan is the Arabic word for "balance".

Mizan is a web page that reads your balances from [Lunch Money](https://lunchmoney.app) and estimates your zakat. It gets today's gold and silver prices in your currency, and provides month-end history to help you review the hawl (the relevant lunar year).

A community project. Lunch Money did not make it and does not support it.

## What it does

- Reads your accounts from Lunch Money: bank accounts, investments, crypto (manual and synced), credit cards and loans. Your home and cars are not included.
- Gets today's gold and silver prices from [gold-api.com](https://gold-api.com) in your Lunch Money currency, for example CAD, USD, GBP or EUR. For other currencies, you type the prices.
- Lets you choose the nisab (silver or gold) and the mortgage method:
  - do not deduct the mortgage
  - deduct the next payment
  - deduct the next 12 months of payments
- Lets you change the list:
  - Leave out an account, for example money that belongs to your spouse.
  - Correct an amount.
  - Add things that are not in Lunch Money: cash at home, gold, silver, other crypto, money that people owe you, and other debts.
- Shows all 6 methods side by side.
- Shows your month-end totals for the last 12 months. It tells you if your total was below the nisab in a month.
- Marks balances that are not current, for example when a bank connection needs a relink. It also marks retirement accounts.
- Shows **Incomplete** when a price needed for the selected nisab or your gold/silver holdings is missing. It never presents an incomplete calculation as zero zakat.
- Labels partial balance-history rows and compares only rows with all selected balances against the nisab.
- Has a sample mode, so you can try it without a token.

The [How it works](how-it-works.html) page explains the requests, calculations and limits. The [Zakat guide](zakat-guide.html) links the main rules and differences of opinion to their sources.

## Your data and your token

- **Read only.** The page sends only GET requests. It has no code that changes or deletes anything in Lunch Money.
- **No application server.** The site has a calculator, 2 static guide pages and 2 font files. Your browser talks directly to the Lunch Money API. No token or account balances go to the author.
- **The token is not kept.** The page sends your token only to `api.lunchmoney.dev`, then forgets it. The page does not save the token in the browser, in a cookie or anywhere else. If your browser or a password manager asks to save it, click Never.
- **Only 2 hosts.** A Content Security Policy lets the page connect only to `api.lunchmoney.dev` and `api.gold-api.com`. The fonts come from the same site as the page. Requests to gold-api.com include only your currency code (for example CAD). They do not include your token or your balances. Redirects are refused, so the token cannot follow a redirect to another host.
- **Saved in your browser:** only your choices (nisab, mortgage method, nisab weights, gold and silver purity). Amounts are never saved.
- **Lunch Money tokens can change data.** Lunch Money has no read-only tokens. Make a separate token for this page, and delete it on the [developers page](https://my.lunchmoney.app/developers) when you finish.

You can read the calculator code in [index.html](index.html). The 2 guide pages are also plain HTML. The fonts in [fonts/](fonts/) are Nunito Sans and Red Hat Mono. On Apple devices the page uses Avenir. The site has no libraries and no build step.

## How to use it

1. Go to [my.lunchmoney.app/developers](https://my.lunchmoney.app/developers), and make an access token. Give it a name, for example "Zakat calculator".
2. Open https://lunchmoney-zakat.netlify.app, paste the token, and click **Connect**.
3. Choose your method in section 1, and check the accounts in section 2.

To run it on your own computer:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Method

- Zakat is 2.5% of your total after debts, when the total is at or above the nisab.
- Nisab: 595 g of silver or 85 g of gold (you can change the weights). Prices are for pure metal.
- Gold that you own is valued by its purity (24, 22, 21, 18, 14 or 10 karat). Silver by 999, 925 or 800.
- The hawl table uses Lunch Money's month-end balances for the included accounts, less the included debts. The last row is today, with the amounts in sections 2 and 4. Section 3, other debts and the mortgage are excluded from every row, so the table's total can differ from the zakat estimate. It supports review and cannot confirm a completed hawl.
- Closed and deleted accounts count for the months when they were open. A deleted home, car or loan is not used.
- A month with no balances in Lunch Money (for example before you started to use it) shows "No data". It does not count as below the nisab.
- A month missing some selected balances shows a partial total and is not classified against the nisab. Gaps for closed accounts also stay unknown. Zero balances count as data.
- A lunar year is 354 days, so 12 months is close but not exact.

Scholars do not agree about some points:

- the mortgage
- retirement accounts
- gold jewellery that a woman wears
- what happens when your total goes below the nisab during the year

This page is an estimate. Ask your imam or a zakat scholar to confirm the method that you follow.

## Checks

Run the calculation and account-mapping regression tests without installing dependencies:

```bash
node --test tests/calculator.test.cjs
```

The tests use synthetic balances and run the actual inline script in a test context. They cover missing prices, nisab boundaries, metal purity, mortgage choices, partial history, debt credits and closed accounts. They do not call the live Lunch Money API.

## Licence

MIT, copyright Mazin Kanuga. See [LICENSE](LICENSE).

The fonts use the SIL Open Font License. The licence texts are in [fonts/](fonts/).

The design takes ideas from the Lunch Money style, so that it fits next to Lunch Money. It does not use the Lunch Money logo or mascot.
