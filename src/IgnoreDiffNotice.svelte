
<script lang="ts">

	import IgnoreNotice from './IgnoreNotice.svelte';
	
	interface Props {
		oldIgnoreList: Array<string> | null=null;
		newIgnoreList: Array<string>;
		showNew: bool=false;
		showOld: bool=false; 
	}
  
  let {oldIgnoreList, newIgnoreList, showNew, showOld}: Props = $props();
  const whatNew: Array<string> = showNew ? newIgnoreList.filter(i => !oldIgnoreList.includes(i)) : []
  const whatOld: Array<string> = showOld ? oldIgnoreList.filter(i => !newIgnoreList.includes(i)) : []

</script>

<IgnoreNotice title="Updated ignore filters. Now they are:" whatIgnore={newIgnoreList}/>

{#if showNew || showOld }
<hr/>
{#if showNew}
{#if whatNew.length > 0}
<IgnoreNotice title="Added following:" whatIgnore={whatNew}/>
{:else}
<div><i>Nothing added</i></div>
{/if}
{/if}


{#if showOld}
{#if whatOld.length > 0}
<IgnoreNotice title="Removed following:" whatIgnore={whatOld}/>
{:else}
<div><i>Nothing removed</i></div>
{/if}
{/if}
{/if}
