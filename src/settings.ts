
export interface IgnoreFilterSettings {
	basicIgnores: Array<string>;
	ignoreFilters: Array<Array<string>>;
}

export const DEFAULT_SETTINGS: IgnoreFilterSettings = {
	basicIgnores: ["aaa", "bbb"],
	ignoreFilters: [["ccc", "dd"], ["xx", "yy"]]
}

export function basicIgnoresToStr(ignoreSettings: IgnoreFilterSettings): string {
    return ignoreSettings.basicIgnores.join("\n")
}
export function ignoreFiltersToStr(ignoreSettings: IgnoreFilterSettings): string {
    return ignoreSettings.ignoreFilters
    .map ((filters) => filters.join("\n"))
    .join("\n\n")
}
export function basicFiltersToList(str: string): Array<string> {
    var res = str.trim().split("\n")
        .map(s=> s.trim())
    return res
}
export function ignoreFiltersToList(str: string): Array<Array<string>> {
    var res = str.trim().split("\n\n").map(f => basicFiltersToList(f))
    return res
}