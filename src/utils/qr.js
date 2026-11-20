/*
 * Small QR code generator (byte mode, error correction level M, versions 1-10).
 * Returns a square matrix of booleans (true = dark module).
 * Good for URLs up to about 210 characters.
 */

const ECC_PER_BLOCK = [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26];
const NUM_BLOCKS = [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
const MAX_VERSION = 10;

function rawDataModules(version) {
  let result = (16 * version + 128) * version + 64;

  if (version >= 2) {
    const numAlign = Math.floor(version / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (version >= 7) result -= 36;
  }

  return result;
}

function dataCapacity(version) {
  return (
    Math.floor(rawDataModules(version) / 8) -
    ECC_PER_BLOCK[version] * NUM_BLOCKS[version]
  );
}

/* ---------- Reed-Solomon over GF(256) ---------- */

function gfMultiply(x, y) {
  let z = 0;

  for (let i = 7; i >= 0; i -= 1) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }

  return z;
}

function rsGenerator(degree) {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;

  for (let i = 0; i < degree; i += 1) {
    for (let j = 0; j < degree; j += 1) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMultiply(root, 0x02);
  }

  return result;
}

function rsRemainder(data, generator) {
  const result = new Array(generator.length).fill(0);

  data.forEach((byte) => {
    const factor = byte ^ result.shift();
    result.push(0);
    generator.forEach((coef, i) => {
      result[i] ^= gfMultiply(coef, factor);
    });
  });

  return result;
}

/* ---------- Codewords ---------- */

function toUtf8(text) {
  return Array.from(new TextEncoder().encode(text));
}

function buildCodewords(bytes, version) {
  const bits = [];
  const push = (value, length) => {
    for (let i = length - 1; i >= 0; i -= 1) bits.push((value >>> i) & 1);
  };

  push(0b0100, 4);
  push(bytes.length, version <= 9 ? 8 : 16);
  bytes.forEach((byte) => push(byte, 8));

  const capacityBits = dataCapacity(version) * 8;
  push(0, Math.min(4, capacityBits - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);

  const data = [];
  for (let i = 0; i < bits.length; i += 8) {
    data.push(parseInt(bits.slice(i, i + 8).join(""), 2));
  }

  for (let pad = 0xec; data.length < dataCapacity(version); pad ^= 0xec ^ 0x11) {
    data.push(pad);
  }

  // split into blocks, add error correction, interleave
  const numBlocks = NUM_BLOCKS[version];
  const eccLen = ECC_PER_BLOCK[version];
  const rawCodewords = Math.floor(rawDataModules(version) / 8);
  const numShort = numBlocks - (rawCodewords % numBlocks);
  const shortLen = Math.floor(rawCodewords / numBlocks);
  const generator = rsGenerator(eccLen);

  const blocks = [];
  let k = 0;

  for (let i = 0; i < numBlocks; i += 1) {
    const length = shortLen - eccLen + (i < numShort ? 0 : 1);
    const chunk = data.slice(k, k + length);
    k += length;
    const ecc = rsRemainder(chunk, generator);
    if (i < numShort) chunk.push(0); // placeholder so all blocks line up
    blocks.push(chunk.concat(ecc));
  }

  const result = [];

  for (let i = 0; i < blocks[0].length; i += 1) {
    blocks.forEach((block, j) => {
      if (i !== shortLen - eccLen || j >= numShort) result.push(block[i]);
    });
  }

  return result;
}

/* ---------- Matrix ---------- */

function alignmentPositions(version, size) {
  if (version === 1) return [];

  const numAlign = Math.floor(version / 7) + 2;
  const step =
    version === 32 ? 26 : Math.ceil((version * 4 + 4) / (numAlign * 2 - 2)) * 2;
  const result = [6];

  for (let pos = size - 7; result.length < numAlign; pos -= step) {
    result.splice(1, 0, pos);
  }

  return result;
}

function bchRemainder(value, poly, degree) {
  let rem = value;

  for (let i = 0; i < degree; i += 1) {
    rem = (rem << 1) ^ ((rem >>> (degree - 1)) * poly);
  }

  return rem & ((1 << degree) - 1);
}

function makeMatrix(version, codewords, mask) {
  const size = version * 4 + 17;
  const dark = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFunction = Array.from({ length: size }, () =>
    new Array(size).fill(false)
  );

  const setFunction = (x, y, value) => {
    dark[y][x] = value;
    isFunction[y][x] = true;
  };

  // timing patterns
  for (let i = 0; i < size; i += 1) {
    setFunction(6, i, i % 2 === 0);
    setFunction(i, 6, i % 2 === 0);
  }

  // finder patterns with separators
  const drawFinder = (cx, cy) => {
    for (let dy = -4; dy <= 4; dy += 1) {
      for (let dx = -4; dx <= 4; dx += 1) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const x = cx + dx;
        const y = cy + dy;

        if (x >= 0 && x < size && y >= 0 && y < size) {
          setFunction(x, y, dist !== 2 && dist !== 4);
        }
      }
    }
  };

  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  // alignment patterns
  const positions = alignmentPositions(version, size);

  positions.forEach((cy, i) => {
    positions.forEach((cx, j) => {
      const onFinder =
        (i === 0 && j === 0) ||
        (i === 0 && j === positions.length - 1) ||
        (i === positions.length - 1 && j === 0);

      if (onFinder) return;

      for (let dy = -2; dy <= 2; dy += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          setFunction(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    });
  });

  // format information (level M = 0b00)
  const formatBits =
    ((((0 << 3) | mask) << 10) | bchRemainder((0 << 3) | mask, 0x537, 10)) ^
    0x5412;
  const bit = (value, i) => ((value >>> i) & 1) !== 0;

  for (let i = 0; i <= 5; i += 1) setFunction(8, i, bit(formatBits, i));
  setFunction(8, 7, bit(formatBits, 6));
  setFunction(8, 8, bit(formatBits, 7));
  setFunction(7, 8, bit(formatBits, 8));
  for (let i = 9; i < 15; i += 1) setFunction(14 - i, 8, bit(formatBits, i));
  for (let i = 0; i < 8; i += 1) setFunction(size - 1 - i, 8, bit(formatBits, i));
  for (let i = 8; i < 15; i += 1) setFunction(8, size - 15 + i, bit(formatBits, i));
  setFunction(8, size - 8, true);

  // version information
  if (version >= 7) {
    const versionBits =
      (version << 12) | bchRemainder(version, 0x1f25, 12);

    for (let i = 0; i < 18; i += 1) {
      const value = bit(versionBits, i);
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setFunction(a, b, value);
      setFunction(b, a, value);
    }
  }

  // place data bits in the zigzag order, applying the mask
  let index = 0;

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;

    for (let vert = 0; vert < size; vert += 1) {
      for (let j = 0; j < 2; j += 1) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;

        if (!isFunction[y][x] && index < codewords.length * 8) {
          dark[y][x] =
            ((codewords[index >>> 3] >>> (7 - (index & 7))) & 1) !== 0;
          index += 1;
        }
      }
    }
  }

  const maskFn = [
    (x, y) => (x + y) % 2 === 0,
    (x, y) => y % 2 === 0,
    (x) => x % 3 === 0,
    (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
    (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
    (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
    (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
  ][mask];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!isFunction[y][x] && maskFn(x, y)) dark[y][x] = !dark[y][x];
    }
  }

  return dark;
}

/* Lower is better. Follows the standard's four penalty rules. */
function penalty(matrix) {
  const size = matrix.length;
  let score = 0;

  const lineScore = (get) => {
    let result = 0;

    for (let a = 0; a < size; a += 1) {
      let run = 1;

      for (let b = 1; b < size; b += 1) {
        if (get(a, b) === get(a, b - 1)) {
          run += 1;
          if (run === 5) result += 3;
          else if (run > 5) result += 1;
        } else {
          run = 1;
        }
      }

      // finder-like patterns
      for (let b = 0; b + 10 < size; b += 1) {
        const seq = [];
        for (let k = 0; k < 11; k += 1) seq.push(get(a, b + k) ? 1 : 0);
        const text = seq.join("");
        if (text === "10111010000" || text === "00001011101") result += 40;
      }
    }

    return result;
  };

  score += lineScore((a, b) => matrix[a][b]);
  score += lineScore((a, b) => matrix[b][a]);

  for (let y = 0; y < size - 1; y += 1) {
    for (let x = 0; x < size - 1; x += 1) {
      const c = matrix[y][x];
      if (c === matrix[y][x + 1] && c === matrix[y + 1][x] && c === matrix[y + 1][x + 1]) {
        score += 3;
      }
    }
  }

  let darkCount = 0;
  matrix.forEach((row) => row.forEach((cell) => { if (cell) darkCount += 1; }));
  const percent = (darkCount * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;

  return score;
}

export function makeQr(text) {
  const bytes = toUtf8(String(text));
  let version = 1;

  while (version <= MAX_VERSION) {
    const lengthBits = version <= 9 ? 8 : 16;
    const needed = 4 + lengthBits + bytes.length * 8;

    if (needed <= dataCapacity(version) * 8) break;
    version += 1;
  }

  if (version > MAX_VERSION) {
    throw new Error("Text is too long for this QR code");
  }

  const codewords = buildCodewords(bytes, version);

  let best = null;
  let bestScore = Infinity;

  for (let mask = 0; mask < 8; mask += 1) {
    const matrix = makeMatrix(version, codewords, mask);
    const score = penalty(matrix);

    if (score < bestScore) {
      best = matrix;
      bestScore = score;
    }
  }

  return best;
}
