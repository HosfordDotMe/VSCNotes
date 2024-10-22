# VSC NOTES

VSC Notes is a simple tool that takes care of the creation and management of plain text notes and harnesses the power of VS Code via the Command Palette.

![](https://github.com/HosfordDotMe/VSCNotes/raw/master/img/vscnotes_commands.png)

<!-- TOC -->

-   [VSC NOTES](#vsc-notes)
-   [Repository](#repository)
-   [Features](#features)
-   [Quick Start](#quick-start)
-   [Taking Notes](#taking-notes)
    -   [Note Filename](#note-filename)
        -   [Filename Tokens](#filename-tokens)
        -   [File Path Detection](#file-path-detection)
        -   [Default Template](#default-template)
        -   [Custom Templates](#custom-templates)
        -   [Tags](#tags)
        -   [Custom Activity Bar Section & Explorer View](#custom-activity-bar-section--explorer-view)
        -   [Commit and Push](#commit-and-push)
-   [Settings](#settings)
-   [Tips and tricks](#tips-and-tricks)
-   [Roadmap & Features](#roadmap--features)
-   [Change log](#change-log)
-   [Contributing](#contributing)
-   [Contributors](#contributors)
-   [Reviews](#reviews)

# Repository

[VSC Notes is MIT Licensed and available on Github](https://github.com/HosfordDotMe/VSCNotes)

# Features

1. Access commands quickly from the VS Code command palette `Ctrl/Cmd + Shift + p`.
2. Set a base folder for your notes and all notes created will be saved in that folder.
3. Easily access latest notes with `Open Note` command.
4. Retrieve notes via tags in YAML encoded frontmatter on your notes.
5. Open your note folder in a new window.
6. View your notes and tags in your filebar.
7. Automatically insert a VS Code snippet upon creation of a new note.
8. Commit and push to your upstream repository with a single command.
9. _New_ Create a note in a currently open workspace.

# Quick Start

<!-- -   Install the extension from the VS Code Extension menu or [click install on this page.](). -->

-   Open the command palette `Ctrl/Cmd + Shift + p` and type `vscnotes`. Select Run Setup.
-   Click start and then select a directory to save your notes to.

> To modify other settings, open the VS Code settings `Preferences > Settings` or hit `Ctrl/Cmd + ,` and type in vscnotes in the search bar. To override the setting, copy it over to your user settings file and modify.

-   Access VSCNotes commands in the command pallette by pressing `ctrl/cmd + shift + p` and typing vscnotes.

# Taking Notes

VSCNotes is just a quick way to create files in a single location and retrieve them later. Harness the power of VSCode and the extension ecosystem to customize your note taking workflow. The default file type is markdown and features are built around taking markdown notes. However if you want to save your notes as other types of plain text files, you can change the settings to append a different file extension.

Create a note in one of the currently open workspaces with the Create note in workspace command. If you have multiple workspaces open, you will be down a dropdown list to pick which workspace to create a note in.

## Note Filename

When creating a new note, VSC Notes will look at the `vscnotes.defaultNoteTitle` setting to grab the format for the file name. This string contains several [tokens](#filename-tokens) that are converted by VSC Notes when a note is created. Tokens can be modified in the `vscnotes.tokens` setting, but shouldn't be modified unless necessary. When asked to input a title for your new note, VSCNotes can [detect file paths and will create subfolders as necessary](#file-path-detection).

### Filename Tokens

Tokens are added to the `defaultNoteTitle` setting and will automatically insert desired data into the file name of the note. This gives us the ability to specify a simple title for a note and have additional metadata added to the file name.

-   datetime: Inserts the current date time in a format specified by the format key. [Formatting options](https://momentjs.com/docs/#/displaying/format/). Don't modify type or token keys unless you know what you're doing.

    ```
    {
        "type": "datetime",
        "token": "{dt}",
        "format": "YYYY-MM-DD_HH-mm",
        "description": "Insert current datetime"
    }
    ```

-   title: When you create a new note, VSC Notes will ask you for a title for the note. After entering a title, it will replace this token with the input text. There shouldn't be any need to modify this setting.

    ```
    {
        "type": "title",
        "token": "{title}",
        "description": "Insert note title",
        "format": "Untitled"
    },
    ```

-   extension: The file extension for the file. Defaults to markdown but you can change it to whatever you want. For example, if you prefer plain text notes, change it to `.txt`.

    ```
    {
        "type": "extension",
        "token": "{ext}",
        "description": "Insert file extension",
        "format": "md"
    }
    ```

### Additional Note Titles

The option `vscnotes.additionalNoteTitles` which is an array that contains note title tokens has been added. If there are any tokens in this array, a picker will be shown with the option to choose which note title format you'd like to use.

### File Path Detection

VSCNotes understands file paths and will create folders as necessary. When prompted for a note title, inputting a path will nest the new note under the folders designated in the path. All paths are generated from the main notes folder.

_Input text delimited by your system's file path separator. Windows: `\` Mac/Linux: `/`_

![](https://github.com/HosfordDotMe/VSCNotes/raw/master/img/vscnotes_path_detection.png)

_VSCode generates necessary subfolders and places the new note inside_

![](https://github.com/HosfordDotMe/VSCNotes/raw/master/img/vscnotes_path_detection_completed.png)

### Default Template

VSC Notes will automatically execute a snippet after creating a note to pre-populate the note with a handy form template. The default snippet is called `vsnote_template_default` and created for the markdown language. You can override it by adding this option to your settings.json file and pointing it to a [custom snippet you've created](https://code.visualstudio.com/docs/editor/userdefinedsnippets).

```
  "vscnotes.defaultSnippet": {
    "langId": "markdown",
    "name": "vsnote_template_default"
  },
```

-   Set `langId` to the desired language and `name` to a snippet's name.
-   Set `langId` to a language and `name` to `null` and a menu will open with all available snippets for your chosen language.
-   Set both `langId` and `name` to null to disable automatic snippet insertion.

### Custom Templates

VSC Notes adds the ability to choose markdown snippets on new note creation. To use this new feature, you first must add markdown snippets with a `vsnote_template_` prefix.

Navigate to `Code > Preferences > User Snippets > Markdown` and add additional snippets. For example:

```
  "vsnote_template_meeting": {
    "prefix": "vsnote_template_meeting",
    "body": [
      "---",
      "tags:",
      "\t- meeting",
      "---",
      "\n# Meeting: $1 - $CURRENT_DATE/$CURRENT_MONTH/$CURRENT_YEAR\n",
      "$2",
    ],
    "description": "Generic Meeting Template",
  },
```

Once you create your snippet in `settings.json`, add the `vscnotes.templates` to your settings and add the name of the template (without the `vsnote_template_` prefix)

```
"vscnotes.templates": [
  "meeting",
],
```

Afterwards when you execute the `Create a New Note` command, you will be shown a prompt to select which template you'd like to use for your new note. To use the default template, hit escape.

### Tags

VSC Notes adds the ability to pull tags out of documents containing a [YAML](http://yaml.org/) [frontmatter block (a la jekyll's frontmatter)](https://jekyllrb.com/docs/frontmatter/). YAML frontmatter is a way to encode machine parsable data in a way that is friendly to read and write.

If a file in your note folder has YAML frontmatter with a tag array, VSC Notes will extract the tags from the note and show you all notes with specific tags.

Example YAML frontmatter

```
// file.md
---
tags:
  - tag1
  - tag2
---

The rest of the document goes here
...
```

VSC Notes ships with a default YAML encoded snippet that it will insert on creation of a new note.

### Custom Activity Bar Section & Explorer View

![](https://github.com/HosfordDotMe/VSCNotes/raw/master/img/vscnotes_view.png)

VSC Notes moves the treeview into it's own custom location in the activity bar.

Access your notes no matter what you're doing. This new treeview adds a quick way to access your tags or files at any time by placing a small window in your explorer (file bar) that displays your tags and the contents of your note folder. Now you don't have to navigate away from a project or open a new window to reference your notes. Quick and easy.

Show or hide the tags or files section of the treeview with the `treeviewHideTags` and `treeviewHideFiles` settings.

### Commit and Push

The Commit and Push command is a simple way to add all changes, commit, and push your changes if a version control system like Git is set up in your notes folder. The default command is set up for \*nix style systems and requires the git command be accessible.

To customize the command and the default command and commit message, update the settings: `vscnotes.commitPushShellCommand` and `vscnotes.commitPushDefaultCommitMessage`.

### Pull

The Pull command is a companion to the Commit and Push command. It pulls from remote repo with `git pull` by default. To customize the command, update the settings `vscnotes.pullShellCommand`.

# Settings

Available settings

```
// List of additional note title tokens to choose from. If supplied, a picker will be shown when creating a new note.
"vscnotes.additionalNoteTitles": [],

// The default commit message used if none is provided with the Commit and Push command.
"vscnotes.commitPushDefaultCommitMessage": "VSC Notes Commit and Push",

// Shell command to execute in the note directory when the Commit and Push command is executed. The {msg} token will be replaced with the contents of an input box shown or, if empty, the default commit message.
"vscnotes.commitPushShellCommand": "git add -A && git commit -m \"{msg}\" && git push",

// Default title for new notes.
"vscnotes.defaultNoteName": "New_Note",

// Path to directory to save notes. Use ~/ to denote a relative path from home folder.
"vscnotes.defaultNotePath": "",

// Default note title. Utilizes tokens set in vscnotes.tokens.
"vscnotes.defaultNoteTitle": "{dt}_{title}.{ext}",

// Default vscode snippet to execute after creating a note. Set both langId and name to null to disable.
"vscnotes.defaultSnippet": {
    "langId": "markdown",
    "name": "vsnote_template_default"
},

// Regular expressions for file names to ignore when parsing documents in note folder.
"vscnotes.ignorePatterns": [
    "^\\."
],

// Number of recent files to show when running command `List Notes`.
"vscnotes.listRecentLimit": 15,

// Automatically convert blank spaces in title to character. To disable set to `null`.
"vscnotes.noteTitleConvertSpaces": "_",

// A list of markdown templates to choose from when creating a new note.
"vscnotes.templates": [],

// Tokens used to replace text in file name.
"vscnotes.tokens": [
    {
        "type": "datetime",
        "token": "{dt}",
        "format": "YYYY-MM-DD_HH-mm",
        "description": "Insert formatted datetime."
    },
    {
        "type": "title",
        "token": "{title}",
        "description": "Insert note title from input box.",
        "format": "Untitled"
    },
    {
        "type": "extension",
        "token": "{ext}",
        "description": "Insert file vscnotes.",
        "format": "md"
    }
],

// Hide the files section in the sidebar. Requires application restart.
"vscnotes.treeviewHideFiles": false,

// Hide the tags section in the sidebar. Requires application restart.
"vscnotes.treeviewHideTags": false,
```

# Tips and tricks

-   [Customize your default template with snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets). Create your own snippets and automatically have them populate when creating a new note with the `vscnotes.defaultSnippet` setting.
-   [Take advantage of built in markdown features in VSCode](https://code.visualstudio.com/docs/languages/markdown). VS Code has some very rich Markdown features to take advantage of.
-   [Supercharge your markdown workflow with extensions](https://marketplace.visualstudio.com/search?term=markdown&target=VSCode&category=All%20categories&sortBy=Relevance). Find extensions in the marketplace to add markdown functionality to your workflow.

# Roadmap & Features

[See Github Issues](https://github.com/HosfordDotMe/VSCNotes/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

# Authors

[See CHANGELOG.md](./AUTHORS.md)

# Changelog

[See CHANGELOG.md](./CHANGELOG.md)

# Contributing

[See CONTRIBUTING.md](./CONTRIBUTING.md)

<!-- # Reviews

[Do you like VSC Notes? Leave a review.](https://marketplace.visualstudio.com/items?itemName=) -->
