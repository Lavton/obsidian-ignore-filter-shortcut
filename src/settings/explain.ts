import Explain from './Explain.svelte';
import { mount } from 'svelte';

export function createSettingExplainFragment(): DocumentFragment {
	const fragment = document.createDocumentFragment();
	const container = document.createElement('div');

	const component = mount(Explain, {
		target: container,
	});

	fragment.appendChild(container);
	return fragment;
}
