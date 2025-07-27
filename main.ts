import { Menu, TFolder, Plugin } from 'obsidian';
import * as settings from 'src/settings/settingsObs'
import * as menuItems from 'src/folderManipulations/menuItems'
import {getIgnoreList, setIgnoreFilters } from 'src/utils';
import * as dirutils from 'src/dirutils';
import { notifyUserAboutNewIgnoreList } from 'src/notifiing';

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
				notifyUserAboutNewIgnoreList(defaultIgnore)
			}
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu: Menu, file) => {
				// Если выбран не файл, а папка
				if (!(file instanceof TFolder)) return;

				const dirpath = dirutils.toCanonicalDir(file.path)
				const ignoreList = getIgnoreList(this.app)
				const ignoreListNoDefaults = dirutils.removeSomeDirs(ignoreList, this.settings.basicIgnores)
				const isItInList = dirutils.isDirInList(dirpath, ignoreList);
				const isParentInList = dirutils.isParentOfDirInList(dirpath, ignoreList);
				const isChildrenInList = dirutils.isChildrenInList(dirpath, ignoreListNoDefaults)

				if (!this.settings.lookAtTree) {
					if (isItInList) {
						menu.addItem((item) => menuItems.pureRemovingFromIgnoreList(item, dirpath, ignoreList, this.app));
					} else {
						menu.addItem((item) => menuItems.pureAddingToIgnoreList(item, dirpath, ignoreList, this.app))
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
		this.settings = Object.assign({}, settings.DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
