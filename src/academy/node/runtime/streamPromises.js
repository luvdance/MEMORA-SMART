import stream from "./stream.js";
export const pipeline = (...a) => stream.promises.pipeline(...a);
export const finished = (...a) => stream.promises.finished(...a);
export default { pipeline, finished };
