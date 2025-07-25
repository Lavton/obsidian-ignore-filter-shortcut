import { App, Notice, TFolder } from 'obsidian';
import IgnoreNotice from './IgnoreNotice.svelte';
import { mount } from 'svelte';

export async function getAllDirs(app: App): Promise<Set<string>> {
	const dirs = new Set<string>();

	// Добавляем корневую папку
	// dirs.add("./");

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

export  function createSettingExplainFragment(): DocumentFragment {
    const fragment = document.createDocumentFragment();
    
    const paragraph = document.createElement('p');
    paragraph.textContent = 'When active, the plugin will look at the directory tree for ignoreList changes (if the explanation is confusing, just try it!):';
    fragment.appendChild(paragraph);
    
    const list = document.createElement('ul');
    
    const listItem1 = document.createElement('li');
    listItem1.innerHTML = 'if you want to remove folder <code>A</code> from the ignoreList, when it contains subfolders <code>A/B</code>, <code>A/C</code> -- these subfolders <code>A/B</code>, <code>A/C</code> will be removed';
    list.appendChild(listItem1);
    
    const listItem2 = document.createElement('li');
    listItem2.innerHTML = 'if you want to remove folder <code>A/B</code> from the ignoreList, when it contains folder <code>A</code>, then (assuming your directory tree looks like: <code>A/B</code>, <code>A/C</code>, <code>A/D</code>) the ignoreList will contain <code>A/C</code> and <code>A/D</code>: folder <code>A</code> will "break down" into subdirectories and the plugin will look at them';
    list.appendChild(listItem2);
    
    const listItem3 = document.createElement('li');
    listItem3.innerHTML = 'if you want to add folder <code>A</code> to ignored folders, when it already contains subfolder <code>A/B</code>, then path <code>A/</code> will be added to ignoreList, and <code>A/B</code> will be removed as a subpath';
    list.appendChild(listItem3);
	const listItem4 = document.createElement('li');
	listItem4.innerHTML = 'Also you will have an option to add everything <i>except</i> this folder to ignoreList'
	list.appendChild(listItem4);
    
    fragment.appendChild(list);
    
    return fragment;
}
