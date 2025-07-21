import { App, Notice, SuggestModal } from "obsidian";
import type { IgnoreFilter } from "./iFilterI";

const ADD_FILTERS: Array<IgnoreFilter> = [
	{
		name: "basic",
		filters: []
	}
]

export class SuggestFilterModal extends SuggestModal<IgnoreFilter> {
	ignoreFilters: IgnoreFilter[];
	basicIgnores: string[]
	app: App
	constructor(ignoreFilters: IgnoreFilter[], basicIgnores: string[], app: App) {
		super(app);
		this.ignoreFilters = [...ignoreFilters, ...ADD_FILTERS]
		this.basicIgnores = basicIgnores
	}

	getSuggestions(query: string): IgnoreFilter[] | Promise<IgnoreFilter[]> {
		return this.ignoreFilters.filter(iFilter => iFilter.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
	}
	renderSuggestion(value: IgnoreFilter, el: HTMLElement) {
		el.createEl("div", { text: value.name })
		el.createEl("small", { text: value.filters.join("\n") })
	}
	onChooseSuggestion(item: IgnoreFilter, evt: MouseEvent | KeyboardEvent) {
		var allFilters: string[] = [...this.basicIgnores, ...item.filters]
		// @ts-ignore
		this.app.vault.setConfig("userIgnoreFilters", allFilters);
		new Notice(`select ${item.name}`)
	}
}
