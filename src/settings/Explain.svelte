<p>
	<strong>Smart folder management:</strong> the plugin automatically handles nested folder 
	changes (if the explanation is confusing, just try it!):
</p>
<ul>
	<li>
		if you want to remove folder <code>A</code> from the ignoreList, when it contains 
		subfolders <code>A/B</code>, <code>A/C</code> -- these subfolders <code>A/B</code>, 
		<code>A/C</code> will be removed
	</li>
	<li>
		if you want to remove folder <code>A/B</code> from the ignoreList, when it contains 
		folder <code>A</code>, then (assuming your directory tree looks like: <code>A/B</code>, 
		<code>A/C</code>, <code>A/D</code>) the ignoreList will contain <code>A/C</code> and 
		<code>A/D</code>: folder <code>A</code> will "break down" into subdirectories and the 
		plugin will look at them
	</li>
	<li>
		if you want to add folder <code>A</code> to ignored folders, when it already contains 
		subfolder <code>A/B</code>, then path <code>A/</code> will be added to ignoreList, 
		and <code>A/B</code> will be removed as a subpath
	</li>
	<li>
		Also you will have an option to add everything <i>except</i> this folder to ignoreList
	</li>
</ul>
