## Get the code and install dependencies
```bash
git clone git@github.com:sonph/metronome.git
cd metronome
yarn install
```

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
