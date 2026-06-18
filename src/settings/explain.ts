import Explain from './Explain.svelte';
import { mount } from 'svelte';

export function createSettingExplainFragment(): DocumentFragment {
	const fragment = createFragment();
	const container = createDiv();

	mount(Explain, {
		target: container,
	});

	fragment.appendChild(container);
	return fragment;
}
