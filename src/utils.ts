import { App, Notice, TFolder } from 'obsidian';
import IgnoreNotice from './IgnoreNotice.svelte';
import { mount } from 'svelte';
import * as dirUtils from './dirutils';

export function splitArrayByCondition<T>(
	data: T[],
	condition: (item: T) => boolean
): [T[], T[]] {
	const passed: T[] = [];
	const failed: T[] = [];

	for (const item of data) {
		if (condition(item)) {
			passed.push(item);
		} else {
			failed.push(item);
		}
	}

	return [passed, failed];
}

export function getAllDirs(app: App): Set<string> {
	const dirs = new Set<string>();

	// Добавляем корневую папку
	// dirs.add("./");

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

export function getIgnorenceNotice(whatIgnore: Array<string>): Notice {
	const container = document.createElement('div');

	const component = mount(IgnoreNotice, {
		target: container,
		props: {
			whatIgnore: whatIgnore,
			title: "Update ignore filters. Now they are:"
		}
	});

	const fragment = document.createDocumentFragment();
	while (container.firstChild) {
		fragment.appendChild(container.firstChild);
	}
	return new Notice(fragment, 5000);
}
export function getRemovedNotice(whatRemoved: Array<string>): Notice {
	const container = document.createElement('div');

	const component = mount(IgnoreNotice, {
		target: container,
		props: {
			whatIgnore: whatRemoved,
			title: "remove following subfolders from ignore list:"
		}
	});

	const fragment = document.createDocumentFragment();
	while (container.firstChild) {
		fragment.appendChild(container.firstChild);
	}
	return new Notice(fragment, 5000);
}
export function getAddedNotice(whatRemoved: Array<string>): Notice {
	const container = document.createElement('div');

	const component = mount(IgnoreNotice, {
		target: container,
		props: {
			whatIgnore: whatRemoved,
			title: "add following folders to ignore list:"
		}
	});

	const fragment = document.createDocumentFragment();
	while (container.firstChild) {
		fragment.appendChild(container.firstChild);
	}
	return new Notice(fragment, 5000);
}


export function getPathBetween(root: string, leaf: string): Array<string> {
	// Если leaf не начинается с root, то путь между ними невозможен.
	// Возвращаем пустой массив.
	if (!leaf.startsWith(root)) {
		return [];
	}

	// Если пути идентичны, то результат - это массив с одним этим путем.
	if (root === leaf) {
		return [root];
	}

	// Получаем относительный путь - ту часть leaf, которая идет после root.
	const relativePath = leaf.substring(root.length);

	// Разбиваем относительный путь на компоненты по разделителю '/'.
	// Фильтруем пустые строки, которые могут возникнуть,
	// например, из-за слэша в начале или в конце.
	const parts = relativePath.split('/').filter(p => p.length > 0);

	// Инициализируем результирующий массив, сразу добавляя в него корень.
	const result: Array<string> = [root];
	let currentPath = root;

	// Итерируем по компонентам, чтобы построить промежуточные пути.
	for (const part of parts) {
		// Убеждаемся, что текущий путь заканчивается слэшем, прежде чем добавлять следующий компонент.
		const basePath = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;

		// Формируем новый путь, добавляя компонент и слэш в конце.
		currentPath = `${basePath}${part}/`;

		// Добавляем свежесформированный путь в результат.
		result.push(currentPath);
	}

	return result;
}

export function findSiblings(currentPath: string, allDirs: Array<string>): Array<string> {
	// Нормализуем currentPath - убираем завершающий слеш если есть
	const normalizedCurrentPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;

	// Находим родительскую директорию
	const lastSlashIndex = normalizedCurrentPath.lastIndexOf('/');
	if (lastSlashIndex === -1) {
		// Если нет родительской директории, возвращаем пустой массив
		return [];
	}

	const parentPath = normalizedCurrentPath.substring(0, lastSlashIndex + 1);

	// Фильтруем все директории, чтобы найти братьев
	const siblings = allDirs.filter(dir => {
		// Нормализуем директорию
		const normalizedDir = dir.endsWith('/') ? dir.slice(0, -1) : dir;

		// Пропускаем текущую директорию
		if (normalizedDir === normalizedCurrentPath) {
			return false;
		}

		// Проверяем, что директория является дочерней для того же родителя
		if (!normalizedDir.startsWith(parentPath)) {
			return false;
		}

		// Получаем часть пути после родительской директории
		const relativePath = normalizedDir.substring(parentPath.length);

		// Проверяем, что это прямой потомок (нет дополнительных слешей)
		return !relativePath.includes('/');
	});

	// Возвращаем результат с завершающими слешами
	return siblings.map(sibling => sibling.endsWith('/') ? sibling : sibling + '/');
}

export function getRoots(allDirs: Array<string>): Array<string> {
	return allDirs.filter(dir => {
		// Подсчитываем количество слэшей в пути
		const slashCount = (dir.match(/\//g) || []).length;
		// Корневая папка содержит только один слэш в конце
		return slashCount === 1;
	});
}
