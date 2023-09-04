# Ignore Filters shortcut
obsidian plugin (https://obsidian.md/).

This plugin simpify the changes in ignore filters. Add command with lists of variants of ignore filters.

## goal
The goal is to focus on some notes in specific folder in a quick way.

in my case I have one folder contains notes about programming and another folder contains notes about productivity. I can add two variants in settings and then easilly switch on what I'm concentrate now: on programing or on projductivy.

### package trio
This package is invented as a part of the package trio:
- https://github.com/Lavton/obsidian-connections-to-tag -- a package that can add to notes subtree and its connections a common hashtag
- https://github.com/Lavton/obisidian-move-tag-to-folder -- a package that can move all notes with a common hashtag to a specific folder
- https://github.com/Lavton/obsidian-ignore-filter-shortcut -- a package that can add a Ignore Filter variant to focus on the specific folder.

So, the supposed workflow of the packages is the following: 
1. deside that you want to focus not on the whole vault, but on the specific subject
2. find the subtree of the subject and add a hashtag to the subtree
3. move all notes with the hashtag (so, all notes connected to the subject) to a specific folder
4. change the ignore filters so, that only the specific folder is not ignored
5. focus on the subject, do whatever you want to do
6. do reverse stuff: change ignore filters to a general one, move all notes from the specific folder to their original desitnation, remove the hashtag from the notes 

## settings
- `default ignore filter` put there all ignore filters line by line as they would be in `files and links -> ignore filters`. This filters will be added to all mentioned in the next settings section 
- `ignored filters` write the filter variants. Each variant must start with the `# name` and then have filters line by line. Variant must ends with a black line. You can navigate on `name`s by the plugin command. (*I know it is not user friendly, but it's just the first plugin version!*) Example:
```# name varient 1
path_that_will_be_ignored_1/
path_that_will_be_ignored_2/

# name varient 2
path_that_will_be_ignored_2/
path_that_will_be_ignored_3/
```

## commands
- `Open Ignore Filters Choose` opens a modal, where you can choose and switch between several ignore filters