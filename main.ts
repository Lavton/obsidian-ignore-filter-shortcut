import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import * as settings from 'src/settings'
import { SuggestFilterModal } from 'src/chooseModal';


export default class IgnoreFiltersPlugin extends Plugin {
	settings: settings.IgnoreFilterSettings;

	async onload() {
		await this.loadSettings();


		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-ignore-filters-modal',
			name: 'Open Ignore Filters Choose',
			callback: () => {
				new SuggestFilterModal(this.settings.ignoreFilters, this.settings.basicIgnores, this.app).open();
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new IgnoreFiltersSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, settings.DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class IgnoreFiltersSettingTab extends PluginSettingTab {
	plugin: IgnoreFiltersPlugin;

	constructor(app: App, plugin: IgnoreFiltersPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			// as in https://github.com/zsviczian/excalibrain/blob/master/src/Settings.ts
			.setName('default ignore filter')
			.setDesc('what ignored always. Add one by line')
			.addTextArea((text) => {
				text.inputEl.style.height = "300px";
				text.inputEl.style.width = "100%";
				text
					.setValue(settings.basicIgnoresToStr(this.plugin.settings))
					.onChange(async (value) => {
						this.plugin.settings.basicIgnores = settings.basicFiltersToList(value)
						await this.plugin.saveSettings();
					})
			})
		new Setting(containerEl)
			.setName('ignored filters')
			.setDesc('list of ignored filters. Separate by black line')
			.addTextArea((text) => {
				text.inputEl.style.height = "300px";
				text.inputEl.style.width = "100%";
				text
					.setValue(settings.ignoreFiltersToStr(this.plugin.settings))
					.onChange(async (value) => {
						this.plugin.settings.ignoreFilters = settings.ignoreFiltersToList(value)
						await this.plugin.saveSettings();
					})
			})
	}
}
