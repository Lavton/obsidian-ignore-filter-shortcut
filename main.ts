import { App, Menu, TFolder, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import * as settings from 'src/settings/settingsObs'
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

				// Добавить пункт "Добавить папку в игнорируемое"
				const dirpath = file.path + "/"
				// @ts-ignore
				const ignoreList = this.app.vault.getConfig("userIgnoreFilters");
				const isItInList = isThisDirInIgnoreList(dirpath, ignoreList);
				const isParentInList = isParentOfThisDirInIgnoreList(dirpath, ignoreList);
				const isChildrenInList = isChildrenOfThisDirInIgnoreList(dirpath, ignoreList, this.settings.basicIgnores);

				if (!this.settings.lookAtTree) {
					if (isItInList) {
						menu.addItem((item) => {
							item.setTitle("Remove folder from ignore list")
								.setIcon("eye")
								.onClick(() => {
									const newIgnorance = pureRemoveFromIgnorance(dirpath, ignoreList)
									setIgnoreFilters(this.app, newIgnorance)
									getIgnorenceNotice(newIgnorance)
								});
						});
					} else {
						menu.addItem((item) => {
							item.setTitle("Add folder to ignore list")
								.setIcon("eye-off")
								.onClick(() => {
									const newIgnorance = pureAddToIgnorance(dirpath, ignoreList)
									setIgnoreFilters(this.app, newIgnorance)
									getIgnorenceNotice(newIgnorance)
								});
						});
					}

				} else {
					// adding 
					if (isParentInList || isItInList) {
						// pass, don't do anything
					} else if (!isChildrenInList) {
						menu.addItem((item) => {
							item.setTitle("Add folder to ignore list")
								.setIcon("eye-off")
								.onClick(() => {
									const newIgnorance = pureAddToIgnorance(dirpath, ignoreList)
									setIgnoreFilters(this.app, newIgnorance)
									getIgnorenceNotice(newIgnorance)
								});
						});
					} else {
						// add this, but remove subs
						menu.addItem((item) => {
							item.setTitle("Add folder to ignore list (+remove subfolders)")
								.setIcon("eye-off")
								.onClick(() => {
									const newI = addToIgnorance(dirpath, ignoreList, this.settings.basicIgnores)
									const newIgnorance = newI.ignoreList
									const whatDeleted = newI.whatDeleted

									setIgnoreFilters(this.app, newIgnorance)
									getRemovedNotice(whatDeleted)
									getIgnorenceNotice(newIgnorance)
								});
						});
					}

					// removing
					if (isItInList) {
						menu.addItem((item) => {
							item.setTitle("Remove folder from ignore list")
								.setIcon("eye")
								.onClick(() => {
									const newIgnorance = pureRemoveFromIgnorance(dirpath, ignoreList)
									setIgnoreFilters(this.app, newIgnorance)
									getIgnorenceNotice(newIgnorance)
								});
						});
					} else if (isChildrenInList) {
						menu.addItem((item) => {
							item.setTitle("Remove subfolders from ignore list")
								.setIcon("eye")
								.onClick(() => {
									const newI = removeSubsFromIgnorance(dirpath, ignoreList, this.settings.basicIgnores)
									const newIgnorance = newI.ignoreList
									const whatDeleted = newI.whatDeleted

									setIgnoreFilters(this.app, newIgnorance)
									getRemovedNotice(whatDeleted)
									getIgnorenceNotice(newIgnorance)
								});
						});
					} else if (isParentInList) {
						menu.addItem((item) => {
							item.setTitle("Remove folder from ignore list (+rearange neibors)")
								.setIcon("eye")
								.onClick(() => {
									const newI = removeOnParentFromIgnorance(dirpath, ignoreList, [...getAllDirs(this.app)])
									const newIgnorance = newI.ignoreList
									const whatDeleted = newI.whatDeleted
									const whatAdded = newI.whatAdded

									setIgnoreFilters(this.app, newIgnorance)
									getRemovedNotice(whatDeleted)
									getAddedNotice(whatAdded)
									getIgnorenceNotice(newIgnorance)
								});
						});
					}
					menu.addItem((item) => {
						item.setTitle("Add everything except this folder to ignore list")
							.setIcon("minus-circle")
							.onClick(() => {
								const newI = addEverythingExсept(dirpath, ignoreList, this.settings.basicIgnores, [...getAllDirs(this.app)])
								const newIgnorance = newI.ignoreList
								const whatDeleted = newI.whatDeleted
								const whatAdded = newI.whatAdded

								setIgnoreFilters(this.app, newIgnorance)
								getRemovedNotice(whatDeleted)
								getAddedNotice(whatAdded)
								getIgnorenceNotice(newIgnorance)
							});
					});
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
