import { App, TFolder } from 'obsidian';

export async function getAllDirs(app: App): Promise<Set<string>> {
	const dirs = new Set<string>();

	// Добавляем корневую папку
	dirs.add("./");

	const files = app.vault.getAllLoadedFiles();

	for (const file of files) {
		if (file instanceof TFolder) {
			if (file.path !== "/") {
				dirs.add(file.path + "/");
			}
		}

		// Добавляем все родительские папки для файлов
		let parent = file.parent;
		while (parent && parent.path !== "/") {
			dirs.add(parent.path + "/");
			parent = parent.parent;
		}
	}

	return dirs;
}
