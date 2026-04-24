# Balance Simulation

Date: 2026-04-25

## Purpose

`受験番長` の144週バランスを、感覚だけでなく再現可能なシミュレーションで確認するためのメモです。

## Command

```bash
npm run simulate:balance -- --runs 1000 --out docs/balance-simulation-latest.csv
```

Output:

```text
/mnt/c/Users/minou/juken-bancho/docs/balance-simulation-latest.csv
```

## Inputs

The simulator reads the same separated data module as the Web game:

```text
/mnt/c/Users/minou/juken-bancho/web/data/game-data.js
```

It covers:

- profiles: `bancho`, `gyaru`
- schools: `johoku`, `toto`, `teio`, `tenrei`
- strategies: `balanced`, `academic`, `random`, `social`
- runs per combination: configurable with `--runs`

## Current Read

The first 1000-run pass shows that lower and mid schools are currently easy for most strategies, while `tenrei` still creates meaningful failure rates.

Examples from the latest CSV:

- `bancho / johoku / balanced`: accepted `0.995`
- `bancho / teio / random`: accepted `0.812`
- `bancho / tenrei / balanced`: accepted `0.571`
- `gyaru / tenrei / balanced`: accepted `0.424`
- `gyaru / tenrei / academic`: accepted `0.877`

This suggests the next balance pass should focus on:

- making `johoku` and `toto` less automatic without punishing casual play too hard
- checking whether `academic` strategy overperforms at `tenrei`
- deciding whether `random` should be viable at mid schools or intentionally unreliable

## Notes

The simulator is intentionally simple. It is not a perfect player model. Its job is to expose obvious balance cliffs, dominant cards, and rough win-rate bands before manual playtesting.
