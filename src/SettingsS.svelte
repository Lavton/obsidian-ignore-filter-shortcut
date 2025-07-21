<script lang="ts">
  import { onMount } from 'svelte';
  
  console.log("aooo")
  // Пропсы от плагина
  interface Props {
    plugin: any; // Ваш класс плагина
    settings: any; // Объект настроек
  }
  
  let { plugin, settings }: Props = $props();
//export let plugin: any;
  // export let settings: any;
  console.log("aaa", plugin)
  
  // Реактивная переменная для текста
  let inputText = $state(settings.displayText || '');
  
  // Функция для сохранения настроек
  async function saveSettings() {
    settings.displayText = inputText;
    await plugin.saveSettings();
  }
  
  // Автосохранение при изменении
  $effect(() => {
    if (inputText !== settings.displayText) {
      saveSettings();
    }
  });
</script>

<div class="settings-container">
  <div class="setting-item">
    <div class="setting-item-info">
      <div class="setting-item-name">Отображаемый текст</div>
      <div class="setting-item-description">
        Введите текст, который будет отображаться рядом
      </div>
    </div>
    <div class="setting-item-control">
      <input 
        type="text" 
        bind:value={inputText}
        placeholder="Введите текст..."
        class="text-input"
      />
    </div>
  </div>
  
  <div class="preview-container">
    <div class="preview-label">Предварительный просмотр:</div>
    <div class="preview-content">
      {inputText || 'Пусто'}
    </div>
  </div>
</div>

<style>
  .settings-container {
    padding: 20px;
  }
  
  .setting-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px 0;
    border-bottom: 1px solid var(--background-modifier-border);
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
  
  .preview-container {
    background: var(--background-secondary);
    padding: 15px;
    border-radius: 8px;
    border: 1px solid var(--background-modifier-border);
  }
  
  .preview-label {
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--text-normal);
  }
  
  .preview-content {
    padding: 10px;
    background: var(--background-primary);
    border-radius: 4px;
    border: 1px solid var(--background-modifier-border);
    min-height: 30px;
    color: var(--text-normal);
  }
</style>
