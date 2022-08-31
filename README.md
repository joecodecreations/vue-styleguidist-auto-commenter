# vue-styleguidist-auto-commenter

# WORK IN PROGRESS | CURRENTLY NOT FINISHED

# DO NOT USE, WILL UPDATE THIS DOC WHEN IT'S READY

## Summary
Globally installed node module that will help you automatically generate files and update existing `.vue` files with relevant information to auto-populate your vue repository for [vue-styleguidist](https://github.com/vue-styleguidist/vue-styleguidist)

<div style="background:lightgrey; padding:50px;">

## How to install 

1. In your terminal, run `npm i @vue-styleguidist-auto-commenter -g` to install this globally for use on any vue projects within your system

</div>

<div style="background:lightgrey; padding:50px;">

## Prerequisites 

1. Install [vue-styleguidist](https://github.com/vue-styleguidist/vue-styleguidist) by following their docs and configuration setup as this project will not automate installing the core settings and module

</div>

<div style="background:lightgrey; padding:50px;">
## Options / Flags 


`-D` or `--dry` (set by default) Drymode no files will be generated only previewed of what will be done

`-l` or `--live` Ready to create your files? Turn on this flag to actually process things and create/edit files automagically 

`-P [value]` or `--path [value]` Provide the path to the source file you want to run this in (recursively). Default is set to `/` 

`-A` or `--absolute` Use this flag when your value you're using in `--path` will be absolute and not relative to where you are in the system 

`-R` or `--report` (Set by Default) Enables a report to be generated in dry and live mode 

`-X` or `--report-location` (Default is `./Reports`) Sets a new location for where your report will be saved (`--absolute` flag will being used will also require this to be an absolute path)

`-H` or `--help` Will provide you some help options (like a repeat of this menu :) ) 
</div>

<div style="background:lightgrey; padding:50px;">

## How To Run 

There's a few options for running this but essentially: 

1. open your vue project in a terminal and make sure you're in the root of the project

2. run `auto-styleguidst` or `autoguide` in your terminal to preview the files that will be created including their contents

3. Default run will NOT create any files or modify anything but only create a report of what will happen if you pass the `--live` flag 

3. Open the report in `./Reports/vue-auto-guide-report.html` to see the changes

4. Once you confirmed it looks good, you can pass `auto-styleguidst --live` and it will generate all the files necessary to auto populate your vue project

</div>
