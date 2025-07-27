
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

<IgnoreNotice title="Update ignore filters. Now they are:" whatIgnore={newIgnoreList}/>

{#if showNew || showOld }
<hr/>
{#if showNew}
{#if whatNew.length > 0}
<IgnoreNotice title="add following:" whatIgnore={whatNew}/>
{:else}
<div><i>nothing added</i></div>
{/if}
{/if}


{#if showOld}
{#if whatOld.length > 0}
<IgnoreNotice title="remove following:" whatIgnore={whatOld}/>
{:else}
<div><i>nothing removed</i></div>
{/if}
{/if}
{/if}
