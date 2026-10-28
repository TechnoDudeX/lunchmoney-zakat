# Zakat calculator for Lunch Money

**Use it here: https://lunchmoney-zakat.netlify.app**

A web page that reads your balances from [Lunch Money](https://lunchmoney.app) and calculates your zakat. It gets today's gold and silver prices in your currency, and it checks the hawl (a full year above the nisab) from your month-end balances.

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
- Has a sample mode, so you can try it without a token.

## Your data and your token

- **Read only.** The page sends only GET requests. It has no code that changes or deletes anything in Lunch Money.
- **No server.** The page is 1 static HTML file. Your browser talks directly to the Lunch Money API. Nothing goes to the author.
- **The token is not kept.** The page sends your token only to `api.lunchmoney.dev`, then forgets it. The page does not save the token in the browser, in a cookie or anywhere else. If your browser or a password manager asks to save it, click Never.
- **Only 2 hosts.** A Content Security Policy lets the page connect only to `api.lunchmoney.dev` and `api.gold-api.com`. Requests to gold-api.com include only your currency code (for example CAD). They do not include your token or your balances. Redirects are refused, so the token cannot follow a redirect to another host.
- **Saved in your browser:** only your choices (nisab, mortgage method, nisab weights, gold and silver purity). Amounts are never saved.
- **Lunch Money tokens can change data.** Lunch Money has no read-only tokens. Make a separate token for this page, and delete it on the [developers page](https://my.lunchmoney.app/developers) when you finish.

You can read all the code in [index.html](index.html). There are no other files, no libraries and no build step.

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
- The hawl check uses Lunch Money's month-end balances for the included accounts, less the included debts. The last row is today, with the amounts on the page.
- Closed and deleted accounts count for the months when they were open. A deleted home, car or loan is not used.
- A month with no balances in Lunch Money (for example before you started to use it) shows "No data". It does not count as below the nisab.
- A lunar year is 354 days, so 12 months is close but not exact.

Scholars do not agree about some points:

- the mortgage
- retirement accounts
- gold jewellery that a woman wears
- what happens when your total goes below the nisab during the year

This page is an estimate. Ask your imam or a zakat scholar to confirm the method that you follow.

## Licence

MIT. See [LICENSE](LICENSE).
