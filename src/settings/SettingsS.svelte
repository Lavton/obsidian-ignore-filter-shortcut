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

<div class="settings-container">
<div class="setting-item-info">
      <div class="setting-item-name">Default ignore filters</div>
      <div class="setting-item-description">
	These filters will be applied when you run command "return to default"
	  </div>
    </div>

<div class="ignore-list">
  {#each basicIgnores as ignore, index}
    <div class="ignore-item">
      <button 
        class="remove-btn" 
        onclick={() => removeItem(index)}
        title="Удалить"
      >
        ✕
      </button>
      <p class="ignore-input">{basicIgnores[index]}</p>

    </div>
  {/each}
</div>

    <div class="setting-item-control">
      <input 
        type="text" 
        bind:value={inputText}
        placeholder="choose folder or regexp..."
        class="text-input"
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
  <button onclick={() => addCurrentToDefault()}>Add current ignore list to default</button>
  {/if}
  {#if basicIgnores.length > 0}
  <button onclick={() => removeAllDefault()}>clear the list above</button>
  {/if}
<button onclick={() => putCurrent()}> Put current defaults to ignore list</button>
</div>

<style>
  .settings-container {
    padding: 20px;
  }
  
  .setting-item-info {
    flex: 1;
    margin-right: 20px;
  }
  
  .setting-item-name {
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .setting-item-description {
    color: var(--text-muted);
    font-size: 0.9em;
  }
  
  .setting-item-control {
    min-width: 200px;
  }
  
  .text-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
    color: var(--text-normal);
  }
  
  .text-input:focus {
    outline: none;
    border-color: var(--interactive-accent);
  }
  

.ignore-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ignore-item {
    display: flex;
    align-items: center;
  }

  .ignore-input {
    flex: 1;
    font-size: 14px;
	padding-left: 5px;
	margin: 0;
  }

  .remove-btn {
    border: none;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  .remove-btn:hover {
    background: #ff3838;
  }
</style>
