import { App, TFolder } from 'obsidian';
import * as dirUtils from './dirutils';

export function getAllDirs(app: App): Set<string> {
	const dirs = new Set<string>();


	const files = app.vault.getAllLoadedFiles();

	for (const file of files) {
		if (file instanceof TFolder) {
			if (!dirUtils.isRawRoot(file.path)) { // root = "/"
				dirs.add(dirUtils.toCanonicalDir(file.path));  // at the begiing it has not "/" at the end
			}
		}

		// Добавляем все родительские папки для файлов
		let parent = file.parent;
		while (parent && !dirUtils.isRawRoot(parent.path)) {
			dirs.add(dirUtils.toCanonicalDir(parent.path));
			parent = parent.parent;
		}
	}

	return dirs;
}

/**
* wrapper for setting new ignore filters 
*/
export function setIgnoreFilters(app: App, whatIgnore: Array<String>) {
	// @ts-ignore
	app.vault.setConfig("userIgnoreFilters", whatIgnore);
}


/**
* wrapper for getting ignore filters 
*/
export function getIgnoreList(app: App): Array<string> {
	// @ts-ignore
	return app.vault.getConfig("userIgnoreFilters")
}


