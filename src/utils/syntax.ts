/**
 * Allows for prefixing of operands with `!` to invert the condition result
 * As suggested by user @OnFire
 * 
 * ## Example
 * 
 * ```js
 * msgHandler
 *  .hasNames("!User1#5746", "!User2#3454") // User must not have either of these tags
 *  .reply("Hello, cool kid!");             //    in order to be replied to.
 * ```
 * 
 * @param predicate Function to check data.
 * @param pattern string that is fed into predicate. 
 * @returns Wether condition is true
 */
export function invertibleLookup<T extends string | number | bigint | boolean | number>(
    predicate: (pattern : T) => boolean,
    dis: Invertible<T>
  ) : boolean {
  if (dis.startsWith("!")) {
    return !predicate(dis.slice(1) as T);
  }

  return predicate(dis as T);
}

export type Invertible<T extends string | number | bigint | boolean | number> = `${"!" | ""}${T}` 