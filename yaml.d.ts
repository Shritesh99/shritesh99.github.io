/**
 * YAML imports (webpack yaml-loader): parsed at build time into a plain
 * object. Typed loosely here; `data/portfolio.ts` narrows it to the real
 * content types.
 */
declare module '*.yaml' {
  const data: unknown;
  export default data;
}
declare module '*.yml' {
  const data: unknown;
  export default data;
}
