<script lang="ts">
  
  let { title, whatIgnore }: {title: string, whatIgnore: Array<string>} = $props();
	displayFilters = whatIgnore.slice(0, 10);

	hasMore = whatIgnore.length > 10;
</script>

<div>
	<p>{title}</p>
	<ul>
		{#each displayFilters as filter}
			<li>{filter}</li>
		{/each}

		{#if hasMore}
			<li>...</li>
		{/if}
	</ul>
</div>

<style>
p, ul, li {
	margin: 0;
 }
</style>
