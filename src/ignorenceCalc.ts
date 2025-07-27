import { findSiblings, getGrandParent, getPathBetween, getRoots, isPathIsParent } from "./dirutils";
import { splitArrayByCondition } from "./utils";

// just add this dir
export function pureAdd(path: string, ignoreList: Array<string>): Array<string> {
	const newIgnorance = [...ignoreList]
	newIgnorance.push(path)
	newIgnorance.sort()
	return newIgnorance
}

// just remove this dir 
export function pureRemove(path: string, ignoreList: Array<string>): Array<string> {
	const newIgnorance = ignoreList.filter(item => !(item === path));
	return newIgnorance;
}

export function removeSubs(path: string, ignoreList: Array<string>, defaultList: Array<string>): Array<string> {
	const defaultSet = new Set(defaultList);
	const newIgnorance = ignoreList.filter(item => !isPathIsParent(path, item) || defaultSet.has(item))
	return newIgnorance
}

export function addItRemoveSubs(path: string, ignoreList: Array<string>, defaultList: Array<string>): Array<string> {
	const newIgnorance = removeSubs(path, ignoreList, defaultList)
	const added = pureAdd(path, newIgnorance);
	return added
}

export function removeOnParents(path: string, ignoreList: Array<string>, allDirs: Array<string>): Array<string> {
	// get parents in ignoreFilters
	const parents = ignoreList.filter(item => isPathIsParent(item, path));
	if (parents.length == 0) return ignoreList;
	// get "grand Parent"
	const grandParent = getGrandParent(parents);
	let newIgnoreList = ignoreList.filter(item => !parents.includes(item)); 

	// add siblings of parents 
	const paths = getPathBetween(grandParent, path).slice(1);
	for (const path of paths) {
		const siblings = findSiblings(path, allDirs).filter(item => !ignoreList.includes(item)); // if it was not in ignoreList, it will not appear into newIgnoreList by accedent.
		newIgnoreList.push(...siblings);
	}
	newIgnoreList.sort();
	return newIgnoreList;
}
 
export function addExсeptIt(path: string, ignoreList: Array<string>, defaultList: Array<string>, allDirs: Array<string>): Array<string> {
	// remove everything except default if it is. 
	const defaultSet = new Set(defaultList)
	const newIgnoreList = ignoreList.filter(item => defaultSet.has(item))
	// add Roots 
	const roots = getRoots(allDirs);
	newIgnoreList.push(...roots)
	// make removeOnParents for needed path.
	return removeOnParents(path, newIgnoreList, allDirs) 

	// const defaultSet = new Set(defaultList.filter(d => !path.startsWith(d))); // родители path будут исключены, даже если они есть

	// let [newIgnorance, whatDeleted] = splitArrayByCondition(ignoreList, item => defaultSet.has(path))
	// const roots = getRoots(allDirs);
	// const myRoot = roots.filter(r => path.startsWith(r))[0]
	// newIgnorance = [...newIgnorance, ...roots.filter(r => r !== myRoot && !newIgnorance.includes(r))]

	// const paths = getPathBetween(myRoot, path).slice(1);
	// const whatWillBeAdded: Array<Array<string>> = []
	// for (const path of paths) {
	// 	const siblings = findSiblings(path, allDirs);
	// 	whatWillBeAdded.push(siblings);
	// }
	// const whatAdded = whatWillBeAdded.flat().filter(path => !newIgnorance.includes(path))
	// newIgnorance = [...newIgnorance, ...whatAdded]
	// newIgnorance.sort()

	// return ignoreList;
}
// export function isThisDirInIgnoreList(currentPath: string, ignoreList: Array<string>): boolean {
// 	return ignoreList.some(ignorePath => {
// 		if (currentPath === ignorePath) return true;
// 		return false;
// 	});
// }

// export function isParentOfThisDirInIgnoreList(currentPath: string, ignoreList: Array<string>): boolean {
// 	return ignoreList.some(ignorePath => {
// 		if (currentPath === ignorePath) return false;
// 		return currentPath.startsWith(ignorePath);
// 	});
// }
// export function isChildrenOfThisDirInIgnoreList(currentPath: string, ignoreList: Array<string>, defaultList: Array<string>): boolean {
// 	const defaultSet = new Set(defaultList);
// 	return ignoreList.filter(ignorePath => !defaultSet.has(ignorePath)).some(ignorePath => {
// 		if (currentPath === ignorePath) return false;
// 		return ignorePath.startsWith(currentPath);
// 	});
// }


// export function canBeAddedToIgnorance(currentPath: string, ignoreList: Array<string>): boolean {
// 	return !ignoreList.some(ignoredPath => {
// 		// Проверяем точное совпадение
// 		if (currentPath === ignoredPath) {
// 			return true;
// 		}

// 		// Проверяем, является ли ignoredPath родительской папкой для currentPath
// 		// Добавляем слеш в конец, чтобы избежать ложных совпадений
// 		const normalizedIgnoredPath = ignoredPath.endsWith('/') ? ignoredPath : ignoredPath + '/';
// 		return currentPath.startsWith(normalizedIgnoredPath);
// 	});
// }


// export function pureAddToIgnorance(path: string, ignoreList: Array<string>): Array<string> {
// 	const newIgnorance = [...ignoreList]
// 	newIgnorance.push(path)
// 	newIgnorance.sort()
// 	return newIgnorance
// }


// export function pureRemoveFromIgnorance(path: string, ignoreList: Array<string>): Array<string> {
// 	const newIgnorance = ignoreList.filter(item => !(item === path));
// 	return newIgnorance;

// }


// export function addToIgnorance(path: string, ignoreList: Array<string>, defaultList: Array<string>): {
// 	ignoreList: Array<string>,
// 	whatDeleted: Array<string>
// } {
// 	const defaultSet = new Set(defaultList);
// 	let [newIgnorance, whatDeleted] = splitArrayByCondition(ignoreList, item => !item.startsWith(path) || defaultSet.has(item))
// 	newIgnorance.push(path)
// 	newIgnorance.sort()
// 	return { ignoreList: newIgnorance, whatDeleted: whatDeleted }
// }

// export function removeSubsFromIgnorance(path: string, ignoreList: Array<string>, defaultList: Array<string>): {
// 	ignoreList: Array<string>,
// 	whatDeleted: Array<string>
// } {
// 	const defaultSet = new Set(defaultList);
// 	let [newIgnorance, whatDeleted] = splitArrayByCondition(ignoreList, item => !item.startsWith(path) || defaultSet.has(item))
// 	return { ignoreList: newIgnorance, whatDeleted: whatDeleted }
// }


// export function removeOnParentFromIgnorance(path: string, ignoreList: Array<string>, allDirs: Array<string>): {
// 	ignoreList: Array<string>,
// 	whatDeleted: Array<string>,
// 	whatAdded: Array<string>
// } {
// 	let [newIgnorance, parents] = splitArrayByCondition(ignoreList, item => !path.startsWith(item));

// 	// if there are multiple parents or non parents.
// 	if (parents.length == 0) return { ignoreList: ignoreList, whatDeleted: [], whatAdded: [] }
// 	const grandParent = parents.reduce((shortest, current) => { return current.length < shortest.length ? current : shortest; })

// 	// спускаемся вниз по дереву. Каждый раз добавляем лишь соседей.
// 	const paths = getPathBetween(grandParent, path).slice(1);
// 	const whatWillBeAdded: Array<Array<string>> = []
// 	for (const path of paths) {
// 		const siblings = findSiblings(path, allDirs);
// 		whatWillBeAdded.push(siblings);
// 	}
// 	const whatAdded = whatWillBeAdded.flat().filter(path => !newIgnorance.includes(path))
// 	newIgnorance = [...newIgnorance, ...whatAdded]
// 	newIgnorance.sort();
// 	return {
// 		ignoreList: newIgnorance,
// 		whatDeleted: parents,
// 		whatAdded: whatAdded
// 	}
// }


// export function addEverythingExсept(path: string, ignoreList: Array<string>, defaultList: Array<string>, allDirs: Array<string>): {
// 	ignoreList: Array<string>,
// 	whatDeleted: Array<string>,
// 	whatAdded: Array<string>
// } {

// 	// удаляем всё кроме дефолтных значений
// 	// добавляем все руты
// 	// для нужного рута проделываем спуск как раньше
// 	// аккуратно смотрим что изменилось
// 	const defaultSet = new Set(defaultList.filter(d => !path.startsWith(d))); // родители path будут исключены, даже если они есть

// 	// если path в defaultList - мы всё равно его убираем.
// 	// defaultSet.delete(path);
// 	let [newIgnorance, whatDeleted] = splitArrayByCondition(ignoreList, item => defaultSet.has(path))
// 	const roots = getRoots(allDirs);
// 	const myRoot = roots.filter(r => path.startsWith(r))[0]
// 	newIgnorance = [...newIgnorance, ...roots.filter(r => r !== myRoot && !newIgnorance.includes(r))]

// 	const paths = getPathBetween(myRoot, path).slice(1);
// 	const whatWillBeAdded: Array<Array<string>> = []
// 	for (const path of paths) {
// 		const siblings = findSiblings(path, allDirs);
// 		whatWillBeAdded.push(siblings);
// 	}
// 	const whatAdded = whatWillBeAdded.flat().filter(path => !newIgnorance.includes(path))
// 	newIgnorance = [...newIgnorance, ...whatAdded]
// 	newIgnorance.sort()

// 	return {
// 		ignoreList: newIgnorance,
// 		whatAdded: whatAdded.filter(wa => !ignoreList.includes(wa)),
// 		whatDeleted: ignoreList.filter(il => !newIgnorance.includes(il)),
// 	};

// }
// export function canBeRemovedFromIgnorance(currentPath: string, ignoreList: Array<string>): boolean {
// 	return ignoreList.some(ignoredPath => {
// 		// Проверяем точное совпадение
// 		if (currentPath === ignoredPath) {
// 			return true;
// 		}

// 		// Проверяем, является ли ignoredPath родительской папкой для currentPath
// 		// Добавляем слеш в конец, чтобы избежать ложных совпадений
// 		const normalizedIgnoredPath = ignoredPath.endsWith('/') ? ignoredPath : ignoredPath + '/';
// 		return currentPath.startsWith(normalizedIgnoredPath) || normalizedIgnoredPath.startsWith(currentPath);
// 	});
// }

// export function removeFromIgnorance(path: string, ignoreList: Array<string>, defaultList: Array<string>, allDirs: Array<string>): Array<string> {
// 	return ignoreList
// }
