/** Apply the public stay terminology without changing URLs, asset paths or object keys. */
export function mudhouseText(text: string): string {
  return text.replace(/https?:\/\/[^\s<>"']+|<[^>]*>|\b(?:mud(?:-house)?\s+)?cottages?\b/gi, (word) => {
    if (/^(?:https?:|<)/i.test(word)) return word;
    const result = /s$/i.test(word) ? "mudhouses" : "mudhouse";
    return word === word.toUpperCase() ? result.toUpperCase()
      : /^[A-Z]/.test(word) ? result[0].toUpperCase() + result.slice(1) : result;
  });
}

export function mudhouseContent<T>(value: T, key = ""): T {
  if (/^(?:slug|id|src|href|url|path|image|imageUrl|coverUrl|gallery|logo|icon|type|kind|layout|sourceUrl|permalink|value)(?:_|$)/i.test(key)) return value;
  if (typeof value === "string") {
    if (/^(?:https?:|\/|@\/|components\/)/.test(value)) return value;
    return mudhouseText(value) as T;
  }
  if (Array.isArray(value)) return value.map(item => mudhouseContent(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([field, item]) => [field, mudhouseContent(item, field)])) as T;
  }
  return value;
}
