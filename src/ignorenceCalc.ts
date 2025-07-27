import { findSiblings, getGrandParent, getPathBetween, getRoots, isPathIsParent } from "./dirutils";

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
}
