# Разбор warning/error отчета

В исходном отчете есть только `Warning`; `Error` нет.

Как читать этот файл:

- `Старые координаты` - строки из исходного отчета. Они нужны для сопоставления с тем, что прислал валидатор, но после правок кода могут съехать.
- `Стабильный поиск` - основной способ найти проблему после частичных исправлений. Если поиск больше ничего не находит, соответствующая часть, скорее всего, уже исправлена.
- `Проверка после правки` - что должно измениться в коде или lock-файле.

## Source code

### SRC-W001 - заменить `builtin-modules`

**Статус:** исправлено 2026-06-18.

**Исходный warning:** `"builtin-modules" should be replaced with an alternative package.`

**Старые координаты:** `package.json:19`

**Стабильный поиск:**

```sh
rg -n "builtin-modules|from \"node:module\"|from 'node:module'" package.json package-lock.json esbuild.config.mjs
```

Искать нужно две связанные точки:

- `package.json`: devDependency `"builtin-modules": "3.3.0"`.
- `esbuild.config.mjs`: `import builtins from "builtin-modules";` и `...builtins` в `external`.

**Предлагаемое исправление:**

Использовать встроенный API Node вместо пакета `builtin-modules`.

```ts
import { builtinModules } from "node:module";

const nodeBuiltins = [
	...builtinModules,
	...builtinModules.map((name) => `node:${name}`),
];
```

В `external` заменить `...builtins` на `...nodeBuiltins`, затем удалить `builtin-modules` из `package.json` и обновить `package-lock.json`.

**Проверка после правки:**

- `rg -n "builtin-modules" package.json package-lock.json esbuild.config.mjs` ничего не находит.
- `esbuild.config.mjs` содержит импорт из `node:module`.

### SRC-W002 - `createDiv()` вместо `document.createElement('div')`

**Статус:** исправлено 2026-06-18.

**Исходный warning:** `Use 'createDiv()' instead of 'document.createElement('div')'.`

**Старые координаты:** `src/notifiing.ts:7`, `src/notifiing.ts:24`, `src/settings/explain.ts:6`

**Стабильный поиск:**

```sh
rg -n "document\\.createElement\\(['\"]div['\"]\\)" src/notifiing.ts src/settings/explain.ts
```

**Предлагаемое исправление:**

Заменить создание `div` через глобальный `document` на Obsidian helper:

```ts
const container = createDiv();
```

Это одновременно помогает с `SRC-W003`, потому что прямой доступ к `document` исчезает.

**Проверка после правки:**

- Поиск выше не находит `document.createElement('div')` / `document.createElement("div")`.
- В местах создания контейнера используется `createDiv()`.

### SRC-W003 - `activeDocument` вместо глобального `document`

**Статус:** исправлено 2026-06-18.

**Исходный warning:** `Use 'activeDocument' instead of 'document' for popout window compatibility.`

**Старые координаты:** `src/notifiing.ts:7`, `src/notifiing.ts:16`, `src/notifiing.ts:24`, `src/notifiing.ts:36`, `src/settings/explain.ts:5`, `src/settings/explain.ts:6`

**Стабильный поиск:**

```sh
rg -n "\\bdocument\\." src/notifiing.ts src/settings/explain.ts
```

**Предлагаемое исправление:**

В этих файлах лучше не заменять `document` напрямую на `activeDocument`, а убрать прямые вызовы через helpers Obsidian:

- `document.createElement('div')` -> `createDiv()`
- `document.createDocumentFragment()` -> `createFragment()`

Если в будущем останется реальная необходимость работать именно с DOM API, тогда использовать `activeDocument`:

```ts
import { activeDocument } from "obsidian";

const element = activeDocument.createElement("div");
```

**Проверка после правки:**

- `rg -n "\\bdocument\\." src/notifiing.ts src/settings/explain.ts` ничего не находит.
- `src/notifiing.ts` и `src/settings/explain.ts` используют `createDiv()` / `createFragment()`.

### SRC-W004 - неиспользуемый `component` после `mount()`

**Статус:** исправлено 2026-06-18.

**Исходный warning:** `'component' is assigned a value but never used. Allowed unused vars must match /^_/u.`

**Старые координаты:** `src/notifiing.ts:9`, `src/notifiing.ts:26`, `src/settings/explain.ts:8`

**Стабильный поиск:**

```sh
rg -n "const component = mount\\(" src/notifiing.ts src/settings/explain.ts
```

**Предлагаемое исправление:**

Если результат `mount()` не используется, не сохранять его в переменную:

```ts
mount(IgnoreDiffNotice, {
	target: container,
	props: {
		newIgnoreList: whatIgnore,
	},
});
```

Для `src/settings/explain.ts` аналогично:

```ts
mount(Explain, {
	target: container,
});
```

Переименование в `_component` тоже уберет warning, но хуже отражает намерение: переменная действительно не нужна.

**Проверка после правки:**

- `rg -n "const component = mount\\(" src/notifiing.ts src/settings/explain.ts` ничего не находит.
- Вызовы `mount(...)` остались как обычные выражения.

### SRC-W005 - `createFragment()` вместо `document.createDocumentFragment()`

**Статус:** исправлено 2026-06-18.

**Исходный warning:** `Use 'createFragment()' instead of 'document.createDocumentFragment()'.`

**Старые координаты:** `src/notifiing.ts:16`, `src/notifiing.ts:36`, `src/settings/explain.ts:5`

**Стабильный поиск:**

```sh
rg -n "document\\.createDocumentFragment\\(\\)" src/notifiing.ts src/settings/explain.ts
```

**Предлагаемое исправление:**

Использовать Obsidian helper:

```ts
const fragment = createFragment();
```

**Проверка после правки:**

- Поиск выше ничего не находит.
- В местах создания фрагментов используется `createFragment()`.

### SRC-W006 - неиспользуемый `settingsComponent` после `mount()`

**Статус:** исправлено 2026-06-18.

**Исходный warning:** `'settingsComponent' is assigned a value but never used. Allowed unused vars must match /^_/u.`

**Старые координаты:** `src/settings/settingsObs.ts:40`

**Стабильный поиск:**

```sh
rg -n "const settingsComponent = mount\\(" src/settings/settingsObs.ts
```

**Предлагаемое исправление:**

Минимальная правка для текущего кода - не сохранять результат `mount()`:

```ts
mount(SettingsS, {
	target: containerEl,
	props: {
		// ...
	},
});
```

Если позже захочется явно размонтировать Svelte-компонент при закрытии вкладки настроек, тогда результат `mount()` нужно не удалять, а сохранить в поле класса и использовать вместе с `unmount()` из `svelte`. Для текущего warning достаточно убрать неиспользуемую локальную переменную.

**Проверка после правки:**

- `rg -n "settingsComponent" src/settings/settingsObs.ts` ничего не находит, если выбран минимальный вариант.
- Вызов `mount(SettingsS, ...)` остался.

### SRC-W007 - `string` вместо `String`

**Статус:** исправлено 2026-06-18.

**Исходный warning:** `Prefer using the primitive string as a type name, rather than the upper-cased String.`

**Старые координаты:** `src/settings/settingsObs.ts:48`, `src/utils.ts:31`

**Стабильный поиск:**

```sh
rg -n "\\bString\\b|Array<String>" src/settings/settingsObs.ts src/utils.ts
```

**Предлагаемое исправление:**

Заменить объектный тип `String` на примитивный `string`:

```ts
setIgnoreFilters: (whatIgnore: Array<string>) => {
	setIgnoreFilters(this.app, whatIgnore);
},
```

```ts
export function setIgnoreFilters(app: App, whatIgnore: Array<string>) {
	// ...
}
```

**Проверка после правки:**

- Поиск выше больше не находит `String`.
- Типы коллекций строк в этих местах используют `Array<string>`.

## Dependencies

Общее правило для dependency warnings: это dev-зависимости, но валидатор все равно видит их в `package-lock.json`. После правки нужно обновить lock-файл и повторить проверку. Основной стабильный локатор для каждой записи - блок `node_modules/<package>` в `package-lock.json`.

### DEP-W001 - `js-yaml` via `@typescript-eslint/eslint-plugin`

**Исходный warning:** Potentially vulnerable dependency `js-yaml`; upgrade to `4.1.1` or later. Advisory: https://github.com/advisories/GHSA-mh29-5h37-fv8m

**Текущее состояние:** `package-lock.json` содержит `node_modules/js-yaml` version `4.1.0`.

**Стабильный поиск:**

```sh
rg -n "\"node_modules/js-yaml\"|\"js-yaml\"" package-lock.json package.json
```

**Предлагаемое исправление:**

Обновить ESLint-стек или транзитивную зависимость так, чтобы lock-файл поставил `js-yaml >= 4.1.1`. Предпочтительно обновлять `@typescript-eslint/eslint-plugin` и `@typescript-eslint/parser` вместе, потому что они закреплены одной версией `5.29.0`. Если после обновления они все еще тянут старую версию, добавить npm `overrides` для `js-yaml`.

**Проверка после правки:** в блоке `node_modules/js-yaml` версия `>= 4.1.1`.

### DEP-W002 - `svelte` advisory `GHSA-crpf-4hrx-3jrp`

**Исходный warning:** Potentially vulnerable dependency `svelte`; upgrade to `5.51.5` or later. Advisory: https://github.com/advisories/GHSA-crpf-4hrx-3jrp

**Текущее состояние:** `package.json` задает `"svelte": "^5.36.7"`, lock-файл содержит `node_modules/svelte` version `5.36.7`.

**Стабильный поиск:**

```sh
rg -n "\"svelte\":|\"node_modules/svelte\"" package.json package-lock.json
```

**Предлагаемое исправление:**

Обновить прямую devDependency `svelte` минимум до версии, которая закрывает все текущие Svelte warnings: `^5.53.5` или выше.

**Проверка после правки:** `package-lock.json` содержит `node_modules/svelte` version `>= 5.53.5`.

### DEP-W003 - `svelte` advisory `GHSA-m56q-vw4c-c2cp`

**Исходный warning:** Potentially vulnerable dependency `svelte`; upgrade to `5.51.5` or later. Advisory: https://github.com/advisories/GHSA-m56q-vw4c-c2cp

**Текущее состояние:** то же, что `DEP-W002`: `svelte 5.36.7`.

**Стабильный поиск:**

```sh
rg -n "\"svelte\":|\"node_modules/svelte\"" package.json package-lock.json
```

**Предлагаемое исправление:** то же, что `DEP-W002`: обновить `svelte` до `^5.53.5` или выше.

**Проверка после правки:** `node_modules/svelte` в lock-файле `>= 5.53.5`.

### DEP-W004 - `svelte` advisory `GHSA-f7gr-6p89-r883`

**Исходный warning:** Potentially vulnerable dependency `svelte`; upgrade to `5.51.5` or later. Advisory: https://github.com/advisories/GHSA-f7gr-6p89-r883

**Текущее состояние:** то же, что `DEP-W002`: `svelte 5.36.7`.

**Стабильный поиск:**

```sh
rg -n "\"svelte\":|\"node_modules/svelte\"" package.json package-lock.json
```

**Предлагаемое исправление:** то же, что `DEP-W002`: обновить `svelte` до `^5.53.5` или выше.

**Проверка после правки:** `node_modules/svelte` в lock-файле `>= 5.53.5`.

### DEP-W005 - `minimatch` advisory `GHSA-3ppc-4f35-3m26`

**Исходный warning:** Potentially vulnerable dependency `minimatch`; upgrade to `3.1.3` or later. Advisory: https://github.com/advisories/GHSA-3ppc-4f35-3m26

**Текущее состояние:** `package-lock.json` содержит `node_modules/minimatch` version `3.1.2`.

**Стабильный поиск:**

```sh
rg -n "\"node_modules/minimatch\"|\"minimatch\"" package-lock.json package.json
```

**Предлагаемое исправление:**

Обновить транзитивный `minimatch` до версии, которая закрывает все три minimatch warnings: `>= 3.1.4`. Практически это лучше делать через обновление ESLint / `@typescript-eslint/*`; если lock-файл все равно оставляет `3.1.2`, добавить npm `overrides` для `minimatch`.

**Проверка после правки:** `node_modules/minimatch` в lock-файле `>= 3.1.4`.

### DEP-W006 - `minimatch` advisory `GHSA-7r86-cg39-jmmj`

**Исходный warning:** Potentially vulnerable dependency `minimatch`; upgrade to `3.1.3` or later. Advisory: https://github.com/advisories/GHSA-7r86-cg39-jmmj

**Текущее состояние:** то же, что `DEP-W005`: `minimatch 3.1.2`.

**Стабильный поиск:**

```sh
rg -n "\"node_modules/minimatch\"|\"minimatch\"" package-lock.json package.json
```

**Предлагаемое исправление:** то же, что `DEP-W005`: поднять `minimatch` до `>= 3.1.4`.

**Проверка после правки:** `node_modules/minimatch` в lock-файле `>= 3.1.4`.

### DEP-W007 - `minimatch` advisory `GHSA-23c5-xmqv-rm74`

**Исходный warning:** Potentially vulnerable dependency `minimatch`; upgrade to `3.1.4` or later. Advisory: https://github.com/advisories/GHSA-23c5-xmqv-rm74

**Текущее состояние:** то же, что `DEP-W005`: `minimatch 3.1.2`.

**Стабильный поиск:**

```sh
rg -n "\"node_modules/minimatch\"|\"minimatch\"" package-lock.json package.json
```

**Предлагаемое исправление:** поднять `minimatch` до `>= 3.1.4`; это покрывает также `DEP-W005` и `DEP-W006`.

**Проверка после правки:** `node_modules/minimatch` в lock-файле `>= 3.1.4`.

### DEP-W008 - `ajv` via `@typescript-eslint/eslint-plugin`

**Исходный warning:** Potentially vulnerable dependency `ajv`; upgrade to `6.14.0` or later. Advisory: https://github.com/advisories/GHSA-2g4f-4pwh-qvx6

**Текущее состояние:** `package-lock.json` содержит `node_modules/ajv` version `6.12.6`.

**Стабильный поиск:**

```sh
rg -n "\"node_modules/ajv\"|\"ajv\"" package-lock.json package.json
```

**Предлагаемое исправление:**

Обновить транзитивный `ajv` через обновление ESLint / `@typescript-eslint/*`. Если совместимый update не поднимает `ajv`, добавить npm `overrides` для `ajv >= 6.14.0`.

**Проверка после правки:** `node_modules/ajv` в lock-файле `>= 6.14.0`.

### DEP-W009 - `svelte` advisory `GHSA-phwv-c562-gvmh`

**Исходный warning:** Potentially vulnerable dependency `svelte`; upgrade to `5.53.5` or later. Advisory: https://github.com/advisories/GHSA-phwv-c562-gvmh

**Текущее состояние:** то же, что `DEP-W002`: `svelte 5.36.7`.

**Стабильный поиск:**

```sh
rg -n "\"svelte\":|\"node_modules/svelte\"" package.json package-lock.json
```

**Предлагаемое исправление:** обновить прямую devDependency `svelte` до `^5.53.5` или выше. Это самый высокий минимум среди текущих Svelte warnings.

**Проверка после правки:** `node_modules/svelte` в lock-файле `>= 5.53.5`.

### DEP-W010 - `flatted` advisory `GHSA-25h7-pfq9-p65f`

**Исходный warning:** Potentially vulnerable dependency `flatted`; upgrade to `3.4.0` or later. Advisory: https://github.com/advisories/GHSA-25h7-pfq9-p65f

**Текущее состояние:** `package-lock.json` содержит `node_modules/flatted` version `3.2.7`.

**Стабильный поиск:**

```sh
rg -n "\"node_modules/flatted\"|\"flatted\"" package-lock.json package.json
```

**Предлагаемое исправление:**

Обновить транзитивный `flatted` до версии, которая закрывает оба flatted warnings: `>= 3.4.2`. Обычно это придет через обновление ESLint / `@typescript-eslint/*`; при необходимости добавить npm `overrides`.

**Проверка после правки:** `node_modules/flatted` в lock-файле `>= 3.4.2`.

### DEP-W011 - `flatted` advisory `GHSA-rf6f-7fwh-wjgh`

**Исходный warning:** Potentially vulnerable dependency `flatted`; upgrade to `3.4.2` or later. Advisory: https://github.com/advisories/GHSA-rf6f-7fwh-wjgh

**Текущее состояние:** то же, что `DEP-W010`: `flatted 3.2.7`.

**Стабильный поиск:**

```sh
rg -n "\"node_modules/flatted\"|\"flatted\"" package-lock.json package.json
```

**Предлагаемое исправление:** поднять `flatted` до `>= 3.4.2`; это покрывает также `DEP-W010`.

**Проверка после правки:** `node_modules/flatted` в lock-файле `>= 3.4.2`.

### DEP-W012 - `brace-expansion` via `@typescript-eslint/eslint-plugin`

**Исходный warning:** Potentially vulnerable dependency `brace-expansion`; upgrade to `1.1.13` or later. Advisory: https://github.com/advisories/GHSA-f886-m6hf-6m8v

**Текущее состояние:** `package-lock.json` содержит `node_modules/brace-expansion` version `1.1.12`.

**Стабильный поиск:**

```sh
rg -n "\"node_modules/brace-expansion\"|\"brace-expansion\"" package-lock.json package.json
```

**Предлагаемое исправление:**

Поднять `brace-expansion` до `>= 1.1.13`. Так как он приходит через `minimatch`, часто достаточно исправления `DEP-W005`-`DEP-W007`; если нет - добавить npm `overrides` для `brace-expansion`.

**Проверка после правки:** `node_modules/brace-expansion` в lock-файле `>= 1.1.13`.

### DEP-W013 - `picomatch` advisory `GHSA-3v7f-55p6-f55p`

**Исходный warning:** Potentially vulnerable dependency `picomatch`; upgrade to `2.3.2` or later. Advisory: https://github.com/advisories/GHSA-3v7f-55p6-f55p

**Текущее состояние:** основной `node_modules/picomatch` в lock-файле имеет version `2.3.1`.

**Стабильный поиск:**

```sh
rg -n "\"node_modules/picomatch\"|\"picomatch\"" package-lock.json package.json
```

**Предлагаемое исправление:**

Поднять основной транзитивный `picomatch` до `>= 2.3.2`.

**Проверка после правки:** блок `node_modules/picomatch` в lock-файле `>= 2.3.2`.

### DEP-W014 - `picomatch` advisory `GHSA-c2c7-rcm5-vvqj`

**Исходный warning:** Potentially vulnerable dependency `picomatch`; upgrade to `2.3.2` or later. Advisory: https://github.com/advisories/GHSA-c2c7-rcm5-vvqj

**Текущее состояние:** то же, что `DEP-W013`: основной `picomatch 2.3.1`.

**Стабильный поиск:**

```sh
rg -n "\"node_modules/picomatch\"|\"picomatch\"" package-lock.json package.json
```

**Предлагаемое исправление:** поднять основной `picomatch` до `>= 2.3.2`; это покрывает также `DEP-W013`.

**Проверка после правки:** блок `node_modules/picomatch` в lock-файле `>= 2.3.2`.

## Лог исправлений

### 2026-06-18 - `SRC-W002`, `SRC-W003`, `SRC-W005`

Исправлено:

- `src/notifiing.ts`: `document.createElement('div')` заменен на `createDiv()`, `document.createDocumentFragment()` заменен на `createFragment()`.
- `src/settings/explain.ts`: `document.createElement('div')` заменен на `createDiv()`, `document.createDocumentFragment()` заменен на `createFragment()`.

Проверка:

```sh
rg -n "document\\.createElement\\(['\"]div['\"]\\)|document\\.createDocumentFragment\\(\\)|\\bdocument\\." src/notifiing.ts src/settings/explain.ts
```

Команда ничего не находит.

Первый запуск `npm run build` не дошел до проверки кода из-за окружения: `tsc: not found`.

### 2026-06-18 - проверка сборки и `svelte-check`

Сделано:

- Установлены npm-зависимости через `npm install`, чтобы появились локальные CLI (`tsc`, `svelte-check`).
- Исправлены ошибки `svelte-check` в `src/IgnoreNotice.svelte`: `displayFilters` и `hasMore` объявлены через `$derived`.
- Исправлены ошибки `svelte-check` в `src/IgnoreDiffNotice.svelte`: props с дефолтами вынесены из `interface` в destructuring, `bool` заменен на `boolean`, `oldIgnoreList` получил дефолтный пустой массив.
- Исправлены ошибки `svelte-check` в `src/settings/SettingsS.svelte`: добавлен return type для `setIgnoreFilters`, параметр `removeItem(index)` типизирован как `number`.

Проверка:

```sh
npm run svelte-check
npm run build
```

Обе команды проходят успешно: `svelte-check found 0 errors and 0 warnings`, `npm run build` завершается с кодом `0`.

### 2026-06-18 - `SRC-W004`, `SRC-W006`

Исправлено:

- `src/notifiing.ts`: убраны неиспользуемые локальные переменные `component` после `mount(IgnoreDiffNotice, ...)`.
- `src/settings/explain.ts`: убрана неиспользуемая локальная переменная `component` после `mount(Explain, ...)`.
- `src/settings/settingsObs.ts`: убрана неиспользуемая локальная переменная `settingsComponent` после `mount(SettingsS, ...)`.

Проверка:

```sh
rg -n "const component = mount\\(|const settingsComponent = mount\\(|settingsComponent" src/notifiing.ts src/settings/explain.ts src/settings/settingsObs.ts
npm run svelte-check
npm run build
```

`rg` ничего не находит. `npm run svelte-check` и `npm run build` проходят успешно.

### 2026-06-18 - `SRC-W007`

Исправлено:

- `src/settings/settingsObs.ts`: `Array<String>` заменен на `Array<string>` в callback `setIgnoreFilters`.
- `src/utils.ts`: `Array<String>` заменен на `Array<string>` в wrapper `setIgnoreFilters`.

Проверка:

```sh
rg -n "\\bString\\b|Array<String>" src/settings/settingsObs.ts src/utils.ts
npm run svelte-check
npm run build
```

`rg` ничего не находит. `npm run svelte-check` и `npm run build` проходят успешно.

### 2026-06-18 - `SRC-W001`

Исправлено:

- `esbuild.config.mjs`: `builtin-modules` заменен на встроенный `builtinModules` из `node:module`.
- `esbuild.config.mjs`: в `external` используется `nodeBuiltins`, включая обычные имена модулей Node и варианты с префиксом `node:`.
- `package.json`: devDependency `builtin-modules` удалена.
- `package-lock.json`: удален блок `node_modules/builtin-modules` и корневая ссылка на зависимость.

Проверка:

```sh
rg -n "builtin-modules|from \"node:module\"|from 'node:module'" package.json package-lock.json esbuild.config.mjs
npm run svelte-check
npm run build
```

`rg` находит только `import { builtinModules } from "node:module";` в `esbuild.config.mjs`. `npm run svelte-check` и `npm run build` проходят успешно.

## Рекомендуемый порядок будущих исправлений

1. Обновить зависимости:
   - `svelte` до `^5.53.5` или выше.
   - `@typescript-eslint/eslint-plugin` и `@typescript-eslint/parser` вместе, затем проверить транзитивные `js-yaml`, `minimatch`, `ajv`, `flatted`, `brace-expansion`, `picomatch`.
2. Если после обычного обновления lock-файл все еще содержит уязвимые транзитивные версии, добавить npm `overrides` только для оставшихся пакетов.
3. После правок прогнать:

```sh
npm run build
npm run svelte-check
npx eslint .
```

## Дополнительное замечание не из warning отчета

После `npm install` корневой блок `package-lock.json` синхронизирован с `package.json`: `ignore-filters-boost` version `1.0.0`.
