// "Undefined" — entry for
// u-danu-the-agent-s-uh-oh-4c0911e4.
//
// A small, dependency-free Node 22 program. It keeps the one word an agent
// blurts out when it has no idea what to do, checks it against the
// competition gate (1 to 99 Unicode code points, a single line, never blank,
// no trailing whitespace or control characters), proves the output is
// deterministic by writing it twice and byte-comparing, then writes it to
// entry.txt inside the harness output directory and re-reads the file to
// prove the bytes survived the round trip.

import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// The word, exactly as it will be judged. The joke is the word itself: an
// agent with no idea what to do can only report the value it holds for the
// task — undefined. It sounds like a machine caught out mid-task, lands at
// a glance, and is not the obvious "uh-oh".
const LINE = "undefined";

const GATE_MIN = 1;
const GATE_MAX = 99;

/** Enforce the gate: one line, length counted in code points, not blank. */
function assertValid(line: string): number {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must stay on a single line");
  }
  const count = Array.from(line).length;
  if (count < GATE_MIN || count > GATE_MAX) {
    throw new Error(
      `line must be ${GATE_MIN}-${GATE_MAX} characters, got ${count}`,
    );
  }
  if (line.trim() === "") {
    throw new Error("line must not be blank");
  }
  if (line !== line.trimEnd()) {
    throw new Error("line must not end with whitespace");
  }
  // No control characters: the line is judged as plain text, so tabs and
  // other invisible bytes would be judged differently than they look.
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("line must not contain control characters");
  }
  return count;
}

/**
 * Prove the output is deterministic: write the line twice to two
 * fresh temp directories and byte-compare the results before the real
 * output is written. A non-deterministic generator would fail here.
 */
function assertDeterministic(line: string): void {
  const first = mkdtempSync(join(tmpdir(), "line-a-"));
  const second = mkdtempSync(join(tmpdir(), "line-b-"));
  try {
    const a = join(first, "entry.txt");
    const b = join(second, "entry.txt");
    writeFileSync(a, line, { encoding: "utf8" });
    writeFileSync(b, line, { encoding: "utf8" });
    const bytesA = readFileSync(a);
    const bytesB = readFileSync(b);
    if (!bytesA.equals(bytesB)) {
      throw new Error("determinism check failed: two writes differ");
    }
    if (bytesA.toString("utf8") !== line) {
      throw new Error("determinism check failed: bytes do not match the line");
    }
  } finally {
    rmSync(first, { recursive: true, force: true });
    rmSync(second, { recursive: true, force: true });
  }
}

function run(): void {
  const count = assertValid(LINE);
  assertDeterministic(LINE);

  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = resolve(dir, "entry.txt");

  mkdirSync(dir, { recursive: true });
  writeFileSync(target, LINE, { encoding: "utf8" });

  const reread = readFileSync(target, "utf8");
  if (reread !== LINE) {
    throw new Error("verification failed: file content differs from the line");
  }

  console.log(
    `wrote ${target} (${count} characters, gate ${GATE_MIN}-${GATE_MAX})`,
  );
  console.log(LINE);
}

run();
