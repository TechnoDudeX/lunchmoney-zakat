# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Lunch Money users preparing a zakat estimate from their actual balances.

## Product Purpose

Mizan uses balances from Lunch Money to estimate zakat and show how that estimate was calculated. Reviewing balances supports that calculation; the goal is to understand the zakat estimate.

## Positioning

A community project that reads Lunch Money balances directly, provides a traceable calculation and accommodates different scholarly methods. Lunch Money does not make or support it.

## Operating Context

Users connect with a Lunch Money access token or explore fictional sample data, review balances and debts, choose calculation methods, and review an estimate and balance history.

## Capabilities and Constraints

- The site is a static web application; calculations run in the browser.
- It uses read requests, does not save tokens or balances, and saves only calculation preferences locally.
- It must preserve traceable amounts, method choices, incomplete and partial-data states, and historical coverage limitations.
- It provides an estimate and recognizes differences in scholarly methods; it cannot confirm a completed hawl.

## Brand Commitments

Mizan means balance. The user has requested a calm, trustworthy, modern Islamic technology feel.

## Evidence on Hand

The calculator, fictional sample data, product explanations and source references are in `index.html`, the guide pages and `README.md`.

## Product Principles

- Make the source and effect of every amount clear.
- Protect users' private financial information.
- Support informed choices without implying a single scholarly method.
- Make missing information and limits visible.
