import { App, Menu, TFolder, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import * as settings from 'src/settings'
import { SuggestFilterModal } from 'src/chooseModal';
import SettingsS from './src/SettingsS.svelte';
import { mount, unmount } from 'svelte';
import { createSettingExplainFragment, getIgnorenceNotice, getRemovedNotice, setIgnorence } from 'src/utils';
import { addToIgnorance, canBeAddedToIgnorance, isChildrenOfThisDirInIgnoreList, isParentOfThisDirInIgnoreList, isThisDirInIgnoreList, pureAddToIgnorance, pureRemoveFromIgnorance } from 'src/ignorenceCalc';

export default class IgnoreFiltersPlugin extends Plugin {
	settings: settings.IgnoreFilterSettings;

	async onload() {
		await this.loadSettings();



		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new IgnoreFiltersSettingTab(this.app, this));
		this.addCommand({
			id: 'switch-to-default-ignorence',
			name: 'return ignore filters to default',
			callback: () => {
				const defaultIgnore = this.settings.basicIgnores
				setIgnorence(this.app, defaultIgnore)
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
				const isChildrenInList = isChildrenOfThisDirInIgnoreList(dirpath, ignoreList);

				if (!this.settings.lookAtTree) {
					if (isItInList) {
						menu.addItem((item) => {
							item.setTitle("Remove folder from ignore list")
								.setIcon("eye")
								.onClick(() => {
									const newIgnorance = pureRemoveFromIgnorance(dirpath, ignoreList)
									setIgnorence(this.app, newIgnorance)
									getIgnorenceNotice(newIgnorance)
								});
						});
					} else {
						menu.addItem((item) => {
							item.setTitle("Add folder to ignore list")
								.setIcon("eye-off")
								.onClick(() => {
									const newIgnorance = pureAddToIgnorance(dirpath, ignoreList)
									setIgnorence(this.app, newIgnorance)
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
									setIgnorence(this.app, newIgnorance)
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
									
									setIgnorence(this.app, newIgnorance)
									getRemovedNotice(whatDeleted)
									getIgnorenceNotice(newIgnorance)
								});
						});
					}

					// removing
				}
				// он или родитель уже в игнорируемых -> не добавить
				// его или родителя нет в игнорируемых -> добавляем. Удаляем детей. Сообщаем что удалили. Точнее это тоже 2 варианта
				// он в игнориуемых -> убираем
				// его дети в игнорируемых -> убираем детей. Отдельный текст, отдельно нотификация
				// его родитель в игнорируемых -> строим дерево, убираем его и родителя, добавляем братьев

				// "убрать всё кроме" - строим дерево и вверх братьев добавляем

				//if (canBeAddedToIgnorance(dirpath, ignoreList)) {
				// // if (true) {
				//	menu.addItem((item) => {
				//		item.setTitle("add to ignore list")
				//			.setIcon("eye-off")
				//			.onClick(() => {
				//				const newIgnorance = addToIgnorance(dirpath, ignoreList, this.settings.basicIgnores)
				//				setIgnorence(this.app, newIgnorance)
				//				getIgnorenceNotice(newIgnorance)

				//				// this.ignoredFolders.add(file.path);

				//				// new Notice(`Папка "${file.name}" добавлена в игнорируемое.`);
				//			});
				//	});
				//}

				//// Добавить пункт "Убрать папку из игнорируемого"
				////if (this.ignoredFolders.has(file.path)) {
				//if (true) {
				//	menu.addItem((item) => {
				//		item.setTitle("Убрать папку из игнорируемого")
				//			.setIcon("eye")
				//			.onClick(() => {
				//				//      this.ignoredFolders.delete(file.path);
				//				new Notice(`Папка "${file.name}" убрана из игнорируемого.`);
				//			});
				//	});
				//}

				// Добавить пункт "Добавить всё кроме этой папки в игнорируемое"
				menu.addItem((item) => {
					item.setTitle("Добавить всё кроме этой папки в игнорируемое")
						.setIcon("minus-circle")
						.onClick(() => {
							const root = this.app.vault.getRoot();
							const queue: TFolder[] = [root];
							// this.ignoredFolders.clear();
							while (queue.length > 0) {
								const folder = queue.pop();
								if (!folder) continue;
								// if(folder.path !== file.path)
								//   this.ignoredFolders.add(folder.path);
								for (const child of folder.children) {
									if (child instanceof TFolder) {
										queue.push(child);
									}
								}
							}
							new Notice(`Все папки кроме "${file.name}" добавлены в игнорируемое.`);
						});
				});
			})
		);
		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
	}

	onunload() {

	}

	async loadSettings() {
		// @ts-ignore
		const currentIgnoreFilters: Array<string> = this.app.vault.getConfig("userIgnoreFilters");
		const newDefaultSettings: settings.IgnoreFilterSettings = {
			...settings.DEFAULT_SETTINGS,
			basicIgnores: currentIgnoreFilters
		};
		this.settings = Object.assign({}, newDefaultSettings, await this.loadData());
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

		console.log(this.plugin)
		const settingsComponent = mount(SettingsS, {
			target: containerEl,
			props: {
				plugin: this.plugin,
				settings: this.plugin.settings
			}
		});

		new Setting(containerEl)
			.setName("Look at folder tree")
			.setDesc(createSettingExplainFragment())
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.lookAtTree)
				.onChange(async (value) => {
					this.plugin.settings.lookAtTree = value;
					await this.plugin.saveSettings();
				})
			);
		// new Setting(containerEl)
		// 	// as in https://github.com/zsviczian/excalibrain/blob/master/src/Settings.ts
		// 	.setName('default ignore filter')
		// 	.setDesc('what ignored always. Add one by line')
		// 	.addTextArea((text) => {
		// 		text.inputEl.style.height = "300px";
		// 		text.inputEl.style.width = "100%";
		// 		text
		// 			.setValue(settings.basicIgnoresToStr(this.plugin.settings))
		// 			.onChange(async (value) => {
		// 				this.plugin.settings.basicIgnores = settings.basicFiltersToList(value)
		// 				await this.plugin.saveSettings();
		// 			})
		// 	})
		// new Setting(containerEl)
		// 	.setName('ignored filters')
		// 	.setDesc('list of ignored filters. Separate by black line')
		// 	.addTextArea((text) => {
		// 		text.inputEl.style.height = "300px";
		// 		text.inputEl.style.width = "100%";
		// 		text
		// 			.setValue(settings.ignoreFiltersToStr(this.plugin.settings))
		// 			.onChange(async (value) => {
		// 				this.plugin.settings.ignoreFilters = settings.ignoreFiltersToList(value)
		// 				await this.plugin.saveSettings();
		// 			})
		// 	})
	}
}
