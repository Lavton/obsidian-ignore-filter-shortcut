export interface IgnoreFilterSettings {
	basicIgnores: Array<string>;
	lookAtTree: boolean;
}

export const DEFAULT_SETTINGS: IgnoreFilterSettings = {
	basicIgnores: [],
	lookAtTree: true
}

