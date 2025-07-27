# Ignore Filters Boost
[Obsidian.md plugin](https://obsidian.md/) to speed up work with excluding/including folders! 

👆 No need to go to settings anymore, just click at folder!

## What this plugin do?
- 👆 click at folder to add it to "excluded files"
- 👆 click at folder to remove it from "excluded files"

## Some advanced techniques?
- Want to focus on specific folder? Click "Add everything except this folder"!
- Want to remove folder from "excluded files", but it parents is still in the list? Plugin will automatically remove the parent and add siblings!
- Want to remove several subfolders from "excluded files"? Just click at their parent!
- Want to return to default? Do it in one command! 


## 📖 Manual
*The plugin works with folders, not files.*

Set "default ignore filters" at settings. 
![Ignore defaults](./images/ignore_defaults.png)
- Use `Ignore Filters Boost: return ignore filters to default` command to return to this filters 
- Plugin will not remove these folders implitly: if you as to remove subfolders of some folder from ignore list, the "default" filters will remains stable

- click at `Add current ignore list to default` will add the "excluded files", that is now in your project, to "default ignore filters"
- click at `Put current defaults to ignore list` will change "excluded files" to the list you see in this settings (same as `Ignore Filters Boost: return ignore filters to default` command)

![Look at tree](./images/look_at_tree.png)
if "Look at folder tree" is off, you'll just add or remove a folder. 

![pure add](./images/pure_add.png)

But when "Look at folder tree is on...

![add everything](./images/add_everything.png)

"add everything" and then just "ignore_2/" will return unignored. `"base/", "focusNodes/", "ignore_1/"` - all these folders will be in "excluded files". 

This plugin simpify the changes in ignore filters. Add command with lists of variants of ignore filters.

![remove parent](./images/remove_parent.png)
... and then you can remove `"ignore_1/sub_folder_1/"` from ignore list. But if list has only `"ignore_1/"`, it will be rearranged: it remove parent folder and add siblings. So now `ignore_1/sub_folder/` will be in the list :)


---

## 🔮 Future Plans 
Some plans for the project. Feel free to ask for features by creating issues!
- language translation. I want to add different language support
- create "white list" of folders in duality to black (ignore filters) list
- add workspaces. During publishing I found the [Smart Excluded Files plugin](https://github.com/vlwkaos/obsidian-smart-excluded). Had some similar ideas, so maybe I'll include the functionality here

