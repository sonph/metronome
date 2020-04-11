## Get the code and install dependencies
```bash
git clone git@github.com:sonph/metronome.git
cd metronome
yarn install
```

## References

- [Pug.js reference](https://pugjs.org/language/attributes.html)

## Development flow

```bash
yarn run pug --watch pug/*.pug -o ./
```

Start web server:

```bash
python -m SimpleHTTPServer 8000
```

Then navigate to http://localhost:8000/

## Testing
- Run test once
  ```bash
  yarn test
  ```

- Watch the entire test suite and re-run when tests changed
  ```bash
  yarn test:watch
  ```

## Styleguide

Follow the [Google JavaScript style guide](https://google.github.io/styleguide/jsguide.html).

To auto-format JS code, use `clang-format`.
[Guide](https://github.com/google/closure-library/wiki/Formatting-.js-with-clang-format).

- Download pre-built binaries for your platform from [release.llvm.org](https://releases.llvm.org/download.html)

- Extract

- Run `./<download-dir>/bin/clang-format --style=Google -i <path/to/file.js>`

  - Note `-i` means editing the file in place. Omit it to view formatted output in stdout.
