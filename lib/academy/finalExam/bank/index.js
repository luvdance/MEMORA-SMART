/**
 * EXAM ITEM BANK — the whole pool, in one array.
 *
 * SERVER ONLY. Every item here carries its answer. Nothing in src/ may import
 * this file, and `npm run validate:content` fails the build if anything does.
 *
 * Add items by appending to a domain file. The assembler indexes by domain and
 * tier at load, and the validator proves the pool can still fill every slot on
 * the blueprint with room to spare — so a bank that has grown thin fails the
 * build rather than quietly serving everybody the same paper.
 */

import { ITEMS as D1 } from "./d1-quality.js";
import { ITEMS as D2 } from "./d2-excel.js";
import { ITEMS as D3 } from "./d3-powerbi.js";
import { ITEMS as D4 } from "./d4-python.js";
import { ITEMS as D5 } from "./d5-judgement.js";

export const ITEMS = [...D1, ...D2, ...D3, ...D4, ...D5];

export default ITEMS;
