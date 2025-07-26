import type IgnoreFiltersPlugin from "main";
import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { mount } from "svelte";

import SettingsS from './SettingsS.svelte';
import { createSettingExplainFragment } from "src/utils";

export interface IgnoreFilterSettings {
	basicIgnores: Array<string>;
	lookAtTree: boolean;
}

export const DEFAULT_SETTINGS: IgnoreFilterSettings = {
	basicIgnores: [],
	lookAtTree: true
}

export interface SettingsSaver extends Plugin {
	settings: IgnoreFilterSettings;
	saveSettings(): Promise<void>;

}



export class IgnoreFiltersSettingTab extends PluginSettingTab {
	plugin: SettingsSaver;

	constructor(app: App, plugin: SettingsSaver) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const settingsComponent = mount(SettingsS, {
			target: containerEl,
			props: {
				plugin: this.plugin,
				settings: this.plugin.settings
			}
		});

		new Setting(containerEl)
			.setName("Look at folder tree")
			.setDesc(createSettingExplainFragment())
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.lookAtTree)
				.onChange(async (value) => {
					this.plugin.settings.lookAtTree = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
