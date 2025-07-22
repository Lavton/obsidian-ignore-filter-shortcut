import type { IgnoreFilter } from "./iFilterI";

export interface IgnoreFilterSettings {
	basicIgnores: Array<string>;
	ignoreFilters: Array<IgnoreFilter>;
}

export const DEFAULT_SETTINGS: IgnoreFilterSettings = {
	basicIgnores: ["aaa", "bbb"],
	ignoreFilters: [
		{ name: "aa", filters: ["ccc", "dd"] },
		{ name: "bb", filters: ["xx", "yy"] }
	],
}

export function basicIgnoresToStr(ignoreSettings: IgnoreFilterSettings): string {
	return ignoreSettings.basicIgnores.join("\n")
}
export function ignoreFiltersToStr(ignoreSettings: IgnoreFilterSettings): string {
	console.log(ignoreSettings.ignoreFilters)
	var res = ignoreSettings.ignoreFilters
		.map((filters: IgnoreFilter) => {
			return "# " + filters.name + "\n" +
				filters.filters.join("\n")
		})
		.join("\n\n")
	console.log(res)
	return res
}
export function basicFiltersToList(str: string): Array<string> {
	var res = str.trim().split("\n")
		.map(s => s.trim())
	return res
}
export function ignoreFiltersToList(str: string): Array<IgnoreFilter> {
	var res: Array<Array<string>> = str.trim().split("\n\n").map(f => basicFiltersToList(f))
	var parsed = res
		.filter(rawFilter => rawFilter.length > 0)
		.filter(rawFilter => rawFilter[0].startsWith("# "))
		.map(rawFilter => {
			var name = rawFilter[0].slice(2)
			var filters = rawFilter.slice(1)
			return { name: name, filters: filters }
		})
	return parsed
}
