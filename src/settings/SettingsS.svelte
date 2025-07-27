<script lang="ts">
	import {getIgnorenceNotice} from 'src/utils'

	interface Props {
		allDirs: Array<string>;
		settings: Array<string>;
		saveSettings(settings: Array<string>): Promise<void>;
		getIgnoreList(): Array<string>;
		setIgnoreFilters(whatIgnore: Array<string>);
	}
  
	let { allDirs, settings, saveSettings, getIgnoreList, setIgnoreFilters }: Props = $props();

	let inputText = $state('');
	let folders = allDirs;
	let basicIgnores = $state(settings || [])
  
	async function addItem() {
		if (inputText.trim() === "") return;
		if (basicIgnores.includes(inputText)) return;
		basicIgnores.push(inputText);
		basicIgnores.sort();
		inputText = ""
		await saveSettings(basicIgnores);
	}
  
	async function addCurrentToDefault() {
		const ignoreFilters = getIgnoreList();
		basicIgnores = [...new Set([...basicIgnores, ...ignoreFilters])]
		basicIgnores.sort();

		await saveSettings(basicIgnores);
	}

	async function removeAllDefault() {
		basicIgnores = []
		await saveSettings(basicIgnores);
	}
	async function putCurrent() {
		setIgnoreFilters(basicIgnores)
		getIgnorenceNotice(basicIgnores)
	}
  // Автосохранение при изменении
  async function removeItem(index) {
	basicIgnores = basicIgnores.filter((_, i) => i !== index);
	await saveSettings(basicIgnores);
  }


</script>

<div class="ignore-list-settings-container">
<div class="ignore-list-setting-item-info">
      <div class="ignore-list-setting-item-name">Default ignore filters</div>
      <div class="ignore-list-setting-item-description">
	These filters will be applied when you run command "return to default"
	  </div>
  {#if basicIgnores.length > 0}
  <button onclick={() => removeAllDefault()}>clear list</button>
  {/if}
    </div>

<div class="ignore-list">
  {#each basicIgnores as ignore, index}
    <div class="ignore-item">
      <button 
        class="ignore-list-remove-btn" 
        onclick={() => removeItem(index)}
        title="Удалить"
      >
        ✕
      </button>
      <p class="ignore-input">{basicIgnores[index]}</p>

    </div>
  {/each}
</div>

    <div class="ignore-list-setting-item-control">
      <input 
        type="text" 
        bind:value={inputText}
        placeholder="choose folder or regexp..."
        class="ignore-list-text-input"
        list="folders-list"
		onkeydown={(e) => e.key === 'Enter' && addItem()} 
      />

      <datalist id="folders-list">
        {#each folders as folder}
          <option value={folder}></option>
        {/each}
      </datalist>
    </div>
{#if getIgnoreList().length > 0}
  <button onclick={() => addCurrentToDefault()}>→ Add current ignore list to default</button>
  {/if}
<button onclick={() => putCurrent()}>← Put current defaults to ignore list</button>
</div>

