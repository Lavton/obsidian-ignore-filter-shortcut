import type { App, MenuItem } from "obsidian";
import { addEverythingExсept, addToIgnorance, pureAddToIgnorance, pureRemoveFromIgnorance, removeOnParentFromIgnorance, removeSubsFromIgnorance } from "src/ignorenceCalc";
import { getAddedNotice, getAllDirs, getIgnorenceNotice, getRemovedNotice, setIgnoreFilters } from "src/utils";

export function pureAddingToIgnoreList(item: MenuItem, dirpath: string, ignoreList: Array<string>, app: App): void {
	item.setTitle("Remove folder from ignore list")
		.setIcon("eye")
		.onClick(() => {
			const newIgnorance = pureRemoveFromIgnorance(dirpath, ignoreList)
			setIgnoreFilters(app, newIgnorance)
			getIgnorenceNotice(newIgnorance)
		});
}

export function pureRemovingFromIgnoreList(item: MenuItem, dirpath: string, ignoreList: Array<string>, app: App): void {
	item.setTitle("Add folder to ignore list")
		.setIcon("eye-off")
		.onClick(() => {
			const newIgnorance = pureAddToIgnorance(dirpath, ignoreList)
			setIgnoreFilters(app, newIgnorance)
			getIgnorenceNotice(newIgnorance)
		});
}
export function addToIgnoreListRemoveSubs(item: MenuItem, dirpath: string, ignoreList: Array<string>, app: App, basicIgnores: Array<string>): void {
	item.setTitle("Add folder to ignore list (+remove subfolders)")
		.setIcon("eye-off")
		.onClick(() => {
			const newI = addToIgnorance(dirpath, ignoreList, basicIgnores)
			const newIgnorance = newI.ignoreList
			const whatDeleted = newI.whatDeleted

			setIgnoreFilters(app, newIgnorance)
			getRemovedNotice(whatDeleted)
			getIgnorenceNotice(newIgnorance)
		});
}
export function removeSubsFromIgnoreList(item: MenuItem, dirpath: string, ignoreList: Array<string>, app: App, basicIgnores: Array<string>): void {
	item.setTitle("Remove subfolders from ignore list")
		.setIcon("eye")
		.onClick(() => {
			const newI = removeSubsFromIgnorance(dirpath, ignoreList, basicIgnores)
			const newIgnorance = newI.ignoreList
			const whatDeleted = newI.whatDeleted

			setIgnoreFilters(app, newIgnorance)
			getRemovedNotice(whatDeleted)
			getIgnorenceNotice(newIgnorance)
		});
}
export function removeParentFromIgnoreList(item: MenuItem, dirpath: string, ignoreList: Array<string>, app: App): void {
	item.setTitle("Remove folder from ignore list (+rearange neibors)")
		.setIcon("eye")
		.onClick(() => {
			const newI = removeOnParentFromIgnorance(dirpath, ignoreList, [...getAllDirs(app)])
			const newIgnorance = newI.ignoreList
			const whatDeleted = newI.whatDeleted
			const whatAdded = newI.whatAdded

			setIgnoreFilters(app, newIgnorance)
			getRemovedNotice(whatDeleted)
			getAddedNotice(whatAdded)
			getIgnorenceNotice(newIgnorance)
		});
}
export function addEverythingExcept(item: MenuItem, dirpath: string, ignoreList: Array<string>, app: App, basicIgnores: Array<string>): void {
	item.setTitle("Add everything except this folder to ignore list")
		.setIcon("minus-circle")
		.onClick(() => {
			const newI = addEverythingExсept(dirpath, ignoreList, basicIgnores, [...getAllDirs(app)])
			const newIgnorance = newI.ignoreList
			const whatDeleted = newI.whatDeleted
			const whatAdded = newI.whatAdded

			setIgnoreFilters(app, newIgnorance)
			getRemovedNotice(whatDeleted)
			getAddedNotice(whatAdded)
			getIgnorenceNotice(newIgnorance)
		});
}
