/**
 * CYBERSECURITY LESSON REGISTRY
 *
 * One file per week. It used to live inline in index.js; it has its own file
 * so the browser can load one course's lessons without the other twelve (see
 * lessonIndex.js).
 */

import { LESSONS as CS_W1 } from "./cs-w1-fundamentals.js";
import { LESSONS as CS_W2 } from "./cs-w2-accounts.js";
import { LESSONS as CS_W3 } from "./cs-w3-data.js";
import { LESSONS as CS_W4 } from "./cs-w4-networking.js";
import { LESSONS as CS_W5 } from "./cs-w5-hardening.js";
import { LESSONS as CS_W6 } from "./cs-w6-networks.js";
import { LESSONS as CS_W7 } from "./cs-w7-software.js";
import { LESSONS as CS_W8 } from "./cs-w8-web.js";
import { LESSONS as CS_W9 } from "./cs-w9-ethical-hacking.js";
import { LESSONS as CS_W10 } from "./cs-w10-vulnerabilities.js";
import { LESSONS as CS_W11 } from "./cs-w11-soc.js";
import { LESSONS as CS_W12 } from "./cs-w12-incident-response.js";
import { LESSONS as CS_W13 } from "./cs-w13-privacy-grc.js";
import { LESSONS as CS_W14 } from "./cs-w14-cloud.js";
import { LESSONS as CS_W15 } from "./cs-w15-capstone.js";
import { LESSONS as CS_W16 } from "./cs-w16-career.js";

export const CYBERSECURITY_LESSONS = {
  "cs-w1-fundamentals": CS_W1,
  "cs-w2-accounts": CS_W2,
  "cs-w3-data": CS_W3,
  "cs-w4-networking": CS_W4,
  "cs-w5-hardening": CS_W5,
  "cs-w6-networks": CS_W6,
  "cs-w7-software": CS_W7,
  "cs-w8-web": CS_W8,
  "cs-w9-ethical-hacking": CS_W9,
  "cs-w10-vulnerabilities": CS_W10,
  "cs-w11-soc": CS_W11,
  "cs-w12-incident-response": CS_W12,
  "cs-w13-privacy-grc": CS_W13,
  "cs-w14-cloud": CS_W14,
  "cs-w15-capstone": CS_W15,
  "cs-w16-career": CS_W16,
};

export default CYBERSECURITY_LESSONS;
