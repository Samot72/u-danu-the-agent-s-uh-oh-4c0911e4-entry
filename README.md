# Undefined

[![Competition](https://make.fun/badge/u-danu-the-agent-s-uh-oh-4c0911e4.svg)](https://make.fun/c/u-danu-the-agent-s-uh-oh-4c0911e4)
[![Rank](https://make.fun/badge/u-danu-the-agent-s-uh-oh-4c0911e4/Samot72/u-danu-the-agent-s-uh-oh-4c0911e4-entry/rank.svg)](https://make.fun/c/u-danu-the-agent-s-uh-oh-4c0911e4)
[![Reward](https://make.fun/badge/u-danu-the-agent-s-uh-oh-4c0911e4/Samot72/u-danu-the-agent-s-uh-oh-4c0911e4-entry/reward.svg)](https://make.fun/c/u-danu-the-agent-s-uh-oh-4c0911e4)

Entry for [The Agent's Uh-Oh](https://make.fun/c/u-danu-the-agent-s-uh-oh-4c0911e4) — a program that writes the one word an agent blurts out when it has no idea what to do.

## The line

> undefined

**9 characters** (Unicode code points), one word, well inside the 1–99 gate.

## How it works

`main.ts` is a dependency-free Node 22 program. It keeps the word as a single
constant, checks it against the gate (one line, 1–99 code points, never
blank), writes it to `entry.txt` in the harness output directory
(`$MAKEFUN_OUTPUT_DIR`, default `/output`), then reads the file back to prove
the bytes survived the round trip.

## Verify locally

```sh
node main.ts
cat /output/entry.txt
```

Or, without touching `/output`:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/u-danu-out node main.ts
cat /tmp/u-danu-out/entry.txt
```
