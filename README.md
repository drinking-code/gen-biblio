> **Warning**
> Archived. Use [Zotero](https://www.zotero.org) instead

# Generate Bibliographies

So, I use pages and find it repugnant that one has to purchase a more-than-200-euros expensive program to create a
bibliography. That's why I bodged together this; a small library that does that, but free (and probably not as well).

## Usage

### With npx

Navigate to a directory in which this library can create a json file and run:

```shell
npx github:drinking-code/gen-biblio
```

A browser window will open, and you will be prompted to enter a file name for the file in which the bibliography data is
stored. Do that and hit enter, and the file will be created.  
To open this file after you closed this `gen-biblio` program use:

```shell
npx github:drinking-code/gen-biblio path/to/your/file.json
```

### Without npx

Install the package:

```shell
npm i -g drinking-code/gen-biblio
```

Navigate to a directory in which this library can create a json file and run:

```shell
gen-biblio
```

A browser window will open, and you will be prompted to enter a file name for the file in which the bibliography data is
stored. Do that and hit enter, and the file will be created.  
To open this file after you closed this `gen-biblio` program use:

```shell
gen-biblio path/to/your/file.json
```

### Adding a DOI entry

> Choose the style and locale first.

To add an entry, enter a DOI or the DOI url, and hit enter. The program will automatically fetch the data and the
appropriate citation for you. This may take a couple seconds, the DOI are slow (lol).

### Adding a non-DOI entry

Change the tab at the very top to "Custom (Book, Article without DOI, etc.)". Then, choose a type of entry and fill out
the fields. All fields are optional. The authors field has a "Parse name" variant. Paste names here, and click parse (
this should parse the string of all names neatly into multiply authors).  
The rest should be self-explanatory.  
The program will automatically format the reference for you.

### Generate a bibliography

Click "Generate Bibliography" (on the right above the table), then "Copy". Paste where you want the bibliography.
Entries, where you clicked "Don't output" will be excluded.
