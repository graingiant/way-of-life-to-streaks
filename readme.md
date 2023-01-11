# Convert [Way of Life](https://wayoflifeapp.com/) data for [Streaks](https://streaksapp.com/)

I've been looking for a habit tracking app to replace Way of Life that supported Shortcuts and iCloud sync. Streaks fit the bill, and thankfully, it offered a CSV data import.

Not wanting to lose my multiple years of habit tracking, I wrote a CSV transformation script to convert Way of Life data into a format Streaks could read.

## Requirements

Node: >= 12.20

## How to use

Clone this repo

```shell
git clonegit@github.com:graingiant/way-of-life-to-streaks.git
```

Switch to cloned directory and install dependencies

```shell
npm i
```

Run script with Way of Life export CSV as input

```shell
node index.js -i <path-to-csv-file> -p <output-path-for-new-csv> -n <name-of-outputted-csv>
```

## How do I export from Way of Life?

As of Jan 11, 2023:

Setup -> Export Journals

Make sure:

- Format = CSV
- Style = Colors

### Caveats

Notes aren't supported. Streaks doesn't have notes for a given day, so there's no way to bring them over.
