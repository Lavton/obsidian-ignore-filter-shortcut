
import { Notice } from 'obsidian';
import IgnoreDiffNotice from 'src/IgnoreDiffNotice.svelte';
import { mount } from 'svelte';

export function notifyUserAboutNewIgnoreList(whatIgnore: Array<string>): Notice {
	const container = createDiv();

	const component = mount(IgnoreDiffNotice, {
		target: container,
		props: {
			newIgnoreList: whatIgnore,
		}
	});

	const fragment = createFragment();
	while (container.firstChild) {
		fragment.appendChild(container.firstChild);
	}
	return new Notice(fragment, 5000);
}

export function notifyUserAboutChangesInIgnoreList(oldList: Array<string>, newList: Array<string>, showAdded: boolean, showDeleted: boolean): Notice {
	const container = createDiv();

	const component = mount(IgnoreDiffNotice, {
		target: container,
		props: {
			newIgnoreList: newList,
			oldIgnoreList: oldList,
			showNew: showAdded,
			showOld: showDeleted
		}
	});

	const fragment = createFragment();
	while (container.firstChild) {
		fragment.appendChild(container.firstChild);
	}
	return new Notice(fragment, 10000);
}
