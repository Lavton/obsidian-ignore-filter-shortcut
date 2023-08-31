import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import * as internal from 'stream';
import * as settings from 'src/settings'
import { SuggestFilterModal } from 'src/chooseModal';
// const fs = require('fs')
// Remember to rename these classes and interfaces!

// interface MyPluginSettings {
// 	mySetting: string;
// }


// const DEFAULT_SETTINGS: MyPluginSettings = {
// 	mySetting: 'default'
// }
// const IGNOR2 = `{
//   "userIgnoreFilters": [
//     "ignore_1/"
//   ]
// }`

export default class IgnoreFiltersPlugin extends Plugin {
	settings: settings.IgnoreFilterSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	// fs.readFile(this.app.vault.adapter.basePath + '/.obsidian/app.json', 'utf8', (err, data) => {
		// 	// 	console.log(data)
		// 	// })
		// 	// fs.writeFile('/home/lavton/scripts/obsidian_plugs/test_plugs/.obsidian/app.json', IGNOR2, (err) => { console.error(err) });
		// 	console.log("aaaa");
		// 	console.log(__dirname)
		// 	// Called when the user clicks the icon.
		// 	new Notice('This is a notice!');
		// });
		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-ignore-filters-modal',
			name: 'Open Ignore Filters Choose',
			callback: () => {
				new SuggestFilterModal(this.settings.ignoreFilters, this.settings.basicIgnores, this.app).open();
			}
		});
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new IgnoreFiltersSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
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
					// .setValue(
					// 	this.plugin.settings.mySetting
					// )
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
					// .setValue(
					// 	this.plugin.settings.mySetting
					// )
			})
		// .addText(text => text
		// 	.setPlaceholder('Enter your secret')
		// 	.setValue(this.plugin.settings.mySetting)
		// 	.onChange(async (value) => {
		// 		this.plugin.settings.mySetting = value;
		// 		await this.plugin.saveSettings();
		// 	}));
	}
}
