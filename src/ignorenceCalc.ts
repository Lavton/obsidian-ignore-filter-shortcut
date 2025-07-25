
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
export function isChildrenOfThisDirInIgnoreList(currentPath: string, ignoreList: Array<string>): boolean {
	return ignoreList.some(ignorePath => {
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
