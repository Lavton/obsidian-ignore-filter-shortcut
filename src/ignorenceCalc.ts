
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

export function addToIgnorance(path: string, ignoreList: Array<string>, defaultList: Array<string>): Array<string> {
	const defaultSet = new Set(defaultList);
	let newIgnorance = ignoreList.filter(item => !item.startsWith(path) || defaultSet.has(item));
	newIgnorance.push(path)
	newIgnorance.sort()
	return newIgnorance
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
