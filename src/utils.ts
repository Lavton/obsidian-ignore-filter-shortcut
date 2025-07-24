import { App, Notice, TFolder } from 'obsidian';
import IgnoreNotice from './IgnoreNotice.svelte';
import { mount } from 'svelte';

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

export function setIgnorence(app: App, whatIgnore: Array<String>) {
	// @ts-ignore
	app.vault.setConfig("userIgnoreFilters", whatIgnore);
}

export function getIgnorenceNotice(whatIgnore: Array<string>): Notice {
	const container = document.createElement('div');

	const component = mount (IgnoreNotice, {
		target: container,
		props: {
			whatIgnore: whatIgnore
		}
	});

	const fragment = document.createDocumentFragment();
	while (container.firstChild) {
		fragment.appendChild(container.firstChild);
	}
	return new Notice(fragment, 5000);
}

