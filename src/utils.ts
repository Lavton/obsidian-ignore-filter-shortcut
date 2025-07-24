import { App, Notice, TFolder } from 'obsidian';

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
    // Create a DocumentFragment to build the notice content in memory
    const fragment = document.createDocumentFragment();

    // Add the introductory paragraph
    fragment.createEl('p', { text: 'Update ignore filters. Now they are:' });

    // Create the unordered list element
    const ul = fragment.createEl('ul');

    // Take only the first 10 items to display
    const displayFilters = whatIgnore.slice(0, 10);

    // Create an <li> for each item and append it to the <ul>
    for (const filter of displayFilters) {
        ul.createEl('li', { text: filter });
    }

    // If there were more than 10 items in the original array, add an ellipsis
    if (whatIgnore.length > 10) {
        ul.createEl('li', { text: '...' });
    }

    // Create the Notice using the completed DocumentFragment
    // This will render the HTML correctly instead of showing the tags
    return new Notice(fragment, 5000);
}
