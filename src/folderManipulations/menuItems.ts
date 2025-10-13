import type { App, MenuItem } from "obsidian";
import * as ignrCalc from "src/ignorenceCalc";
import { notifyUserAboutChangesInIgnoreList, notifyUserAboutNewIgnoreList } from "src/notifiing";
import { getAllDirs, setIgnoreFilters } from "src/utils";

export function pureRemovingFromIgnoreList(item: MenuItem, dirpath: string, ignoreList: Array<string>, app: App): void {
	item.setTitle("Remove folder from ignore list")
		.setIcon("eye")
		.onClick(() => {
			const newIgnoreList = ignrCalc.pureRemove(dirpath, ignoreList);
			setIgnoreFilters(app, newIgnoreList)
			notifyUserAboutNewIgnoreList(newIgnoreList)
		});
}

export function pureAddingToIgnoreList(item: MenuItem, dirpath: string, ignoreList: Array<string>, app: App): void {
	item.setTitle("Add folder to ignore list")
		.setIcon("eye-off")
		.onClick(() => {
			const newIgnoreList = ignrCalc.pureAdd(dirpath, ignoreList)
			setIgnoreFilters(app, newIgnoreList)
			notifyUserAboutNewIgnoreList(newIgnoreList)
		});
}

export function addToIgnoreListRemoveSubs(item: MenuItem, dirpath: string, ignoreList: Array<string>, app: App, basicIgnores: Array<string>): void {
	item.setTitle("Add folder to ignore list (+remove subfolders)")
		.setIcon("eye-off")
		.onClick(() => {
			const newIgnoreList = ignrCalc.addItRemoveSubs(dirpath, ignoreList, basicIgnores)

			setIgnoreFilters(app, newIgnoreList)
			notifyUserAboutChangesInIgnoreList(ignoreList, newIgnoreList, true, true)
		});
}
export function removeSubsFromIgnoreList(item: MenuItem, dirpath: string, ignoreList: Array<string>, app: App, basicIgnores: Array<string>): void {
	item.setTitle("Remove subfolders from ignore list")
		.setIcon("eye")
		.onClick(() => {
			const newIgnoreList = ignrCalc.removeSubs(dirpath, ignoreList, basicIgnores)

			setIgnoreFilters(app, newIgnoreList)
			notifyUserAboutChangesInIgnoreList(ignoreList, newIgnoreList, true, true)
		});
}

export function removeParentFromIgnoreList(item: MenuItem, dirpath: string, ignoreList: Array<string>, app: App): void {
	item.setTitle("Remove folder from ignore list (+rearange neighbors)")
		.setIcon("eye")
		.onClick(() => {
			const newIgnoreList = ignrCalc.removeOnParents(dirpath, ignoreList, [...getAllDirs(app)])

			setIgnoreFilters(app, newIgnoreList)
			notifyUserAboutChangesInIgnoreList(ignoreList, newIgnoreList, true, true)
		});
}

export function addEverythingExcept(item: MenuItem, dirpath: string, ignoreList: Array<string>, app: App, basicIgnores: Array<string>): void {
	item.setTitle("Add everything except this folder to ignore list")
		.setIcon("minus-circle")
		.onClick(() => {
			const newIgnoreList = ignrCalc.addExсeptIt(dirpath, ignoreList, basicIgnores, [...getAllDirs(app)])

			setIgnoreFilters(app, newIgnoreList)
			notifyUserAboutChangesInIgnoreList(ignoreList, newIgnoreList, true, true)
		});
}
