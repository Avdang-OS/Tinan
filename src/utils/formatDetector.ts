/**
 * Allows for parsing of regex in the *.json files, if not escaped by \
 * @param str Potential Regex
 * @returns String if not valid RegEx.
 */
export function substringOrRegex(str: string): string | RegExp {
  let possibleRegexParts = str.split(/^\/|(?<=[^\\])\//gi); // Split by /'s unless escaped by \

  if (possibleRegexParts.length == 3 && possibleRegexParts[0] === "") {
    let [, pattern, flags] = possibleRegexParts.map(p =>
      p.replaceAll(/\\\//gi, "/")
    );
    
    try {
      return new RegExp(pattern, flags);
    } catch (e) {
      // Return normal string if the RegEx does not compile.
    }
  }

  return str;
}
