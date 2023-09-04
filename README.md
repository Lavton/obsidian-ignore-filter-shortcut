# Ignore Filters shortcut
obsidian plugin (https://obsidian.md/).

This plugin simpify the changes in ignore filters. Add command with lists of variants of ignore filters.

## goal
The goal is to focus on some notes in specific folder in a quick way.

in my case I have one folder contains notes about programming and another folder contains notes about productivity. I can add two variants in settings and then easilly switch on what I'm concentrate now: on programing or on projductivy.

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