# Generate Bibliographies

So, I use pages and find it repugnant that one has to purchase a more-than-200-euros expensive program to create a
bibliography. That's why I bodged together this; a small library that does that, but free (and probably not as well).

## Usage

You need to have [Node](https://nodejs.org) installed, and [NPX](https://npmjs.com/npx).  
Then, navigate to a directory in which this library can create a json file and run:

```shell
npx github:drinking-code/gen-biblio
```

A browser window will open, and you will be prompted to enter a file name for the file in which the bibliography data is
stored. Do that and hit enter, and the file will be created.  
To open this file after you closed this `gen-biblio` program use:

```shell
npx github:drinking-code/gen-biblio path/to/your/file.json
```

### Adding a DOI entry

To add an entry, enter a DOI or the DOI url, and hit enter. The program will automatically fetch the data and the
appropriate citation for you. This may take a couple seconds, the DOI are slow (lol).

### Adding a non-DOI entry
