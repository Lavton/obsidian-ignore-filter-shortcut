

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

export function removeSomeDirs(fromList: Array<string>, what: Array<string>): Array<string> {
	const whatSet = new Set(what);
	return fromList.filter(testPath => !whatSet.has(testPath))
}

export function isChildrenInList(dirPath: string, testList: Array<string>): boolean {
	return testList.some(testPath => {
		if (dirPath === testPath) return false;
		return testPath.startsWith(dirPath); // even if it is a file, it is still a child... So no need for ".../" test
	});
}
