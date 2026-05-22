import fs from "fs";

const css = fs.readFileSync(new URL("../theme.css", import.meta.url), "utf8");

function lum(hex) {
	const h = hex.replace("#", "");
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
	const lin = (c) =>
		c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(fg, bg) {
	const L1 = lum(fg);
	const L2 = lum(bg);
	return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

function parseBlock(selector) {
	const idx = css.indexOf(`${selector} {`);
	if (idx < 0) return {};
	const end = css.indexOf("\n}", idx);
	const block = css.slice(idx, end);
	const vars = {};
	const re = /--([\w-]+):\s*(#[0-9a-fA-F]{6})/gi;
	let m;
	while ((m = re.exec(block))) vars[m[1]] = m[2];
	return vars;
}

/** What community theme palette validation cares about (Obsidian maps text to color-base) */
const BASE_TEXT_STEPS = ["50", "60", "70", "100"];

/** Body text tokens on main reading surfaces only */
const SEMANTIC_TEXT = [
	"text-normal",
	"text-muted",
	"text-faint",
	"interactive-before",
];
const SEMANTIC_BACKGROUNDS = ["background-primary", "background-secondary"];

let submissionFailed = false;

for (const sel of [".theme-dark", ".theme-light"]) {
	const v = parseBlock(sel);
	const bg10 = v["color-base-10"];
	const paletteFails = [];

	if (!bg10) {
		console.log(`\n${sel}: FAIL — missing --color-base-10`);
		submissionFailed = true;
		continue;
	}

	for (const step of BASE_TEXT_STEPS) {
		const tc = v[`color-base-${step}`];
		if (!tc) {
			paletteFails.push({ r: 0, pair: `missing color-base-${step}` });
			continue;
		}
		const r = contrast(tc, bg10);
		if (r < 4.5) paletteFails.push({ r, pair: `color-base-${step} on color-base-10` });
	}

	const semanticFails = [];
	for (const tk of SEMANTIC_TEXT) {
		const tc = v[tk];
		if (!tc) continue;
		for (const bk of SEMANTIC_BACKGROUNDS) {
			const bc = v[bk];
			if (!bc) continue;
			const r = contrast(tc, bc);
			if (r < 4.5) semanticFails.push({ r, pair: `${tk} on ${bk}` });
		}
	}

	console.log(`\n${sel} (${Object.keys(v).length} hex vars)`);

	if (paletteFails.length === 0) {
		console.log("  Palette (submission): PASS — all color-base text steps ≥ 4.5:1 on base-10");
	} else {
		submissionFailed = true;
		paletteFails.sort((a, b) => b.r - a.r);
		const best = paletteFails[0];
		console.log(
			`  Palette (submission): FAIL — ${paletteFails.length} pair(s), best failing ratio ${best.r.toFixed(2)} (${best.pair})`,
		);
	}

	if (semanticFails.length === 0) {
		console.log("  Semantic text on primary/secondary: PASS");
	} else {
		semanticFails.sort((a, b) => b.r - a.r);
		const best = semanticFails[0];
		console.log(
			`  Semantic text on primary/secondary: ${semanticFails.length} below 4.5:1 (worst ${best.r.toFixed(2)}: ${best.pair})`,
		);
	}
}

if (submissionFailed) {
	process.exitCode = 1;
} else {
	console.log("\nReady for community theme palette checks.");
}
