/** node:stream — readable-stream, the npm mirror of Node's own streams. */
import * as rs from "readable-stream";

const stream = rs.default || rs.Stream;
export default stream;
export const { Readable, Writable, Duplex, Transform, PassThrough, Stream, finished, pipeline, addAbortSignal, compose } = rs;
export const destroy = rs.destroy;
export const promises = stream.promises;
