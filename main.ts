import { App, Menu, TFolder, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import * as settings from 'src/settings/settingsObs'
import * as menuItems from 'src/folderManipulations/menuItems'
import {getAddedNotice, getAllDirs, getIgnoreList, getIgnorenceNotice, getRemovedNotice, setIgnoreFilters } from 'src/utils';
import { addEverythingExсept, addToIgnorance, canBeAddedToIgnorance, isChildrenOfThisDirInIgnoreList, isParentOfThisDirInIgnoreList, isThisDirInIgnoreList, pureAddToIgnorance, pureRemoveFromIgnorance, removeOnParentFromIgnorance, removeSubsFromIgnorance } from 'src/ignorenceCalc';

export default class IgnoreFiltersPlugin extends Plugin implements settings.SettingsSaver {
	settings: settings.IgnoreFilterSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new settings.IgnoreFiltersSettingTab(this.app, this));
		this.addCommand({
			id: 'switch-to-default-ignorence',
			name: 'return ignore filters to default',
			callback: () => {
				const defaultIgnore = this.settings.basicIgnores
				setIgnoreFilters(this.app, defaultIgnore)
				getIgnorenceNotice(defaultIgnore)
			}
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu: Menu, file) => {
				// Если выбран не файл, а папка
				if (!(file instanceof TFolder)) return;

				const dirpath = file.path + "/"
				const ignoreList = getIgnoreList(this.app)
				const isItInList = isThisDirInIgnoreList(dirpath, ignoreList);
				const isParentInList = isParentOfThisDirInIgnoreList(dirpath, ignoreList);
				const isChildrenInList = isChildrenOfThisDirInIgnoreList(dirpath, ignoreList, this.settings.basicIgnores);

				if (!this.settings.lookAtTree) {
					if (isItInList) {
						menu.addItem((item) => menuItems.pureAddingToIgnoreList(item, dirpath, ignoreList, this.app))
					} else {
						menu.addItem((item) => menuItems.pureRemovingFromIgnoreList(item, dirpath, ignoreList, this.app));
					}
				} else {
					// adding 
					if (isParentInList || isItInList) {
						// pass, don't do anything
					} else if (!isChildrenInList) {
						menu.addItem((item) => menuItems.pureAddingToIgnoreList(item, dirpath, ignoreList, this.app))
					} else {
						// has subs
						menu.addItem((item) => menuItems.addToIgnoreListRemoveSubs(item, dirpath, ignoreList, this.app, this.settings.basicIgnores))
					}

					// removing
					if (isItInList) {
						// remove just it
						menu.addItem((item) => menuItems.pureRemovingFromIgnoreList(item, dirpath, ignoreList, this.app));
					} else if (isChildrenInList) {
						// remove children 
						menu.addItem((item) => menuItems.removeSubsFromIgnoreList(item, dirpath, ignoreList, this.app, this.settings.basicIgnores));
					} else if (isParentInList) {
						// remove parent & it 
						menu.addItem((item) => menuItems.removeParentFromIgnoreList(item, dirpath, ignoreList, this.app));
					}
					// add everything except this 
					menu.addItem((item) => menuItems.addEverythingExcept(item, dirpath, ignoreList, this.app, this.settings.basicIgnores));
				}
			})
		);
	}

	onunload() {

	}

	async loadSettings() {
		const newDefaultSettings = this.changeDefaultIgnoreSettingsToCurrent();
		this.settings = Object.assign({}, newDefaultSettings, await this.loadData());
	}

	/**
	* use as "default settings" not empty, but current user's settings. 
	*/
	private changeDefaultIgnoreSettingsToCurrent(): settings.IgnoreFilterSettings {
		const currentIgnoreFilters: Array<string> = getIgnoreList(this.app);
		const newDefaultSettings: settings.IgnoreFilterSettings = {
			...settings.DEFAULT_SETTINGS,
			basicIgnores: currentIgnoreFilters
		};
		return newDefaultSettings;
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
