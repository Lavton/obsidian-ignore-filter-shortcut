import { splitArrayByCondition } from "./utils";

export function isThisDirInIgnoreList(currentPath: string, ignoreList: Array<string>): boolean {
	return ignoreList.some(ignorePath => {
		if (currentPath === ignorePath) return true;
		return false;
	});
}

export function isParentOfThisDirInIgnoreList(currentPath: string, ignoreList: Array<string>): boolean {
	return ignoreList.some(ignorePath => {
		if (currentPath === ignorePath) return false;
		return currentPath.startsWith(ignorePath);
	});
}
export function isChildrenOfThisDirInIgnoreList(currentPath: string, ignoreList: Array<string>, defaultList: Array<string>): boolean {
	const defaultSet = new Set(defaultList);
	return ignoreList.filter(ignorePath => !defaultSet.has(ignorePath)).some(ignorePath => {
		if (currentPath === ignorePath) return false;
		return ignorePath.startsWith(currentPath);
	});
}


export function canBeAddedToIgnorance(currentPath: string, ignoreList: Array<string>): boolean {
	return !ignoreList.some(ignoredPath => {
		// Проверяем точное совпадение
		if (currentPath === ignoredPath) {
			return true;
		}

		// Проверяем, является ли ignoredPath родительской папкой для currentPath
		// Добавляем слеш в конец, чтобы избежать ложных совпадений
		const normalizedIgnoredPath = ignoredPath.endsWith('/') ? ignoredPath : ignoredPath + '/';
		return currentPath.startsWith(normalizedIgnoredPath);
	});
}

export function pureAddToIgnorance(path: string, ignoreList: Array<string>): Array<string> {
	const newIgnorance = [...ignoreList]
	newIgnorance.push(path)
	newIgnorance.sort()
	return newIgnorance
}
export function pureRemoveFromIgnorance(path: string, ignoreList: Array<string>): Array<string> {
	const newIgnorance = ignoreList.filter(item => !(item === path));
	return newIgnorance;
	
}

export function addToIgnorance(path: string, ignoreList: Array<string>, defaultList: Array<string>): {
	ignoreList: Array<string>,
	whatDeleted: Array<string>
} {
	const defaultSet = new Set(defaultList);
	let [newIgnorance, whatDeleted] = splitArrayByCondition(ignoreList, item => !item.startsWith(path) || defaultSet.has(item)) 
	newIgnorance.push(path)
	newIgnorance.sort()
	return {ignoreList: newIgnorance, whatDeleted: whatDeleted}
}
export function removeSubsFromIgnorance(path: string, ignoreList: Array<string>, defaultList: Array<string>): {
	ignoreList: Array<string>,
	whatDeleted: Array<string>
} {
	const defaultSet = new Set(defaultList);
	let [newIgnorance, whatDeleted] = splitArrayByCondition(ignoreList, item => !item.startsWith(path) || defaultSet.has(item)) 
	return {ignoreList: newIgnorance, whatDeleted: whatDeleted}
}

export function canBeRemovedFromIgnorance(currentPath: string, ignoreList: Array<string>): boolean {
	return ignoreList.some(ignoredPath => {
		// Проверяем точное совпадение
		if (currentPath === ignoredPath) {
			return true;
		}

		// Проверяем, является ли ignoredPath родительской папкой для currentPath
		// Добавляем слеш в конец, чтобы избежать ложных совпадений
		const normalizedIgnoredPath = ignoredPath.endsWith('/') ? ignoredPath : ignoredPath + '/';
		return currentPath.startsWith(normalizedIgnoredPath) || normalizedIgnoredPath.startsWith(currentPath);
	});
}

export function removeFromIgnorance(path: string, ignoreList: Array<string>, defaultList: Array<string>, allDirs: Array<string>): Array<string> {
	return ignoreList
}
