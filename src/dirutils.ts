

export function isRawRoot(path: string): boolean {
	return path === "/"
}

export function toCanonicalDir(dirPath: string): string {
	return dirPath.endsWith("/") ? dirPath : (dirPath + "/")
}

export function isDirInList(dirPath: string, testList: Array<string>): boolean {
	return testList.some(path => {
		if (dirPath === path) return true;
		return false;
	});
}

export function isParentOfDirInList(dirPath: string, testList: Array<string>): boolean {
	return testList.some(testPath => {
		if (dirPath === testPath) return false;
		if (!testPath.endsWith("/")) return false; // in test list it is not a dir 
		return dirPath.startsWith(testPath);
	});
}

export function isPathIsParent(parentPath: string, childPath: string): boolean {
	return childPath.startsWith(toCanonicalDir(parentPath))
}

// return the most closes to the root parent
export function getGrandParent(parents: Array<string>): string {
	return parents.reduce((shortest, current) => { return current.length < shortest.length ? current : shortest; })

}

export function removeSomeDirs(fromList: Array<string>, what: Array<string>): Array<string> {
	const whatSet = new Set(what);
	return fromList.filter(testPath => !whatSet.has(testPath))
}

export function getPathBetween(root: string, leaf: string): Array<string> {
	if (!leaf.startsWith(root)) {
		return [];
	}
	if (root === leaf) {
		return [root];
	}

	const relativePath = leaf.substring(root.length);
	const parts = relativePath.split('/').filter(p => p.length > 0);
	const result: Array<string> = [root];
	let currentPath = root;
	for (const part of parts) {
		const basePath = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
		currentPath = `${basePath}${part}/`;
		result.push(currentPath);
	}
	return result;
}

export function findSiblings(currentPath: string, allDirs: Array<string>): Array<string> {
	const normalizedCurrentPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
	const lastSlashIndex = normalizedCurrentPath.lastIndexOf('/');
	if (lastSlashIndex === -1) {
		return [];
	}
	const parentPath = normalizedCurrentPath.substring(0, lastSlashIndex + 1);
	const siblings = allDirs.filter(dir => {
		const normalizedDir = dir.endsWith('/') ? dir.slice(0, -1) : dir;
		if (normalizedDir === normalizedCurrentPath) {
			return false;
		}
		if (!normalizedDir.startsWith(parentPath)) {
			return false;
		}
		const relativePath = normalizedDir.substring(parentPath.length);
		return !relativePath.includes('/');
	});
	return siblings.map(sibling => sibling.endsWith('/') ? sibling : sibling + '/');
}

export function getRoots(allDirs: Array<string>): Array<string> {
	return allDirs.filter(dir => {
		const slashCount = (dir.match(/\//g) || []).length;
		return slashCount === 1;
	});
}

export function isChildrenInList(dirPath: string, testList: Array<string>): boolean {
	return testList.some(testPath => {
		if (dirPath === testPath) return false;
		return testPath.startsWith(dirPath); // even if it is a file, it is still a child... So no need for ".../" test
	});
}
