<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllDirs } from "./utils"
  
  // Пропсы от плагина
  interface Props {
    plugin: any;
	settings: any; 
}
  
  let { plugin, settings }: Props = $props();
  
  let inputText = $state('');
  let folders = $state([]);
  let basicIgnores = $state(settings.basicIgnores || [])
  
  // Функция для сохранения настроек
  async function saveSettings() {
	settings.basicIgnores.sort()
    await plugin.saveSettings();
  }
  async function addItem() {
	settings.basicIgnores.push(inputText);
	basicIgnores.push(inputText);
	basicIgnores.sort();
	inputText = ""
	await saveSettings();
  }
  
  // Автосохранение при изменении
  async function removeItem(index) {
	basicIgnores = basicIgnores.filter((_, i) => i !== index);
	settings.basicIgnores = basicIgnores
	settings.basicIgnores.sort()
	await plugin.saveSettings();
  }

//  getAllDirs(plugin.app).then(result => {
  //console.log(result);
//});
onMount(async () => {
    try {
      folders = await getAllDirs(plugin.app);
    } catch (error) {
      console.error('Ошибка при загрузке папок:', error);
    }
  });
//  const dirs =  await getAllDirs(plugin.app);
  //console.log(dirs)

</script>

<div class="settings-container">
<div class="setting-item-info">
      <div class="setting-item-name">Отображаемый текст</div>
      <div class="setting-item-description">
        Выберите папку из списка или введите свой текст
      </div>
    </div>

<div class="ignore-list">
  {#each basicIgnores as ignore, index}
    <div class="ignore-item">
      <p class="ignore-input">{basicIgnores[index]}</p>

<hr/>
      <button 
        class="remove-btn" 
        onclick={() => removeItem(index)}
        title="Удалить"
      >
        ✕
      </button>
    </div>
  {/each}
</div>

    <div class="setting-item-control">
      <input 
        type="text" 
        bind:value={inputText}
        placeholder="Введите текст или выберите папку..."
        class="text-input"
        list="folders-list"
		onkeydown={(e) => e.key === 'Enter' && addItem()} 
      />
      <datalist id="folders-list">
        {#each Array.from(folders) as folder}
          <option value={folder}></option>
        {/each}
      </datalist>
    </div>
  
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
    gap: 8px;
  }

  .ignore-input {
    flex: 1;
    padding: 6px 10px;
    font-size: 14px;
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
