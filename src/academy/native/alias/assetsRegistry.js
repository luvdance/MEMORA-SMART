/** The packager's asset registry. The practice phone has no packager, so it is empty. */
const assets = [];
export function registerAsset(asset) {
  return assets.push(asset);
}
export function getAssetByID(id) {
  return assets[id - 1];
}
