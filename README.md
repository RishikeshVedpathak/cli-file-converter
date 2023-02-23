# CSV/PRN Converter

This command line utility is designed to read CSV and PRN files from standard input and, based on a command line option, print either JSON or HTML to standard output. The purpose of this utility is to be able to convert files between different formats while preserving all content, regardless of the input data format.

## Installation

To use this utility, first make sure you have Node.js installed on your machine. Then, in your terminal, navigate to the directory where you want to use this utility and run the following command to install the necessary dependencies:

```
npm install
```

## Usage

To use the converter, you can pipe the contents of your CSV or PRN file to the utility and specify the output format using a command line option. Here's an example:

1. CSV to HTML

```
cat ./Workbook2.csv | your-solution csv html > csv.html.txt
```

2. PRN to HTML

```
cat ./Workbook2.prn | your-solution prn html > prn.html.txt
```

3. CSV to JSON

```
cat ./Workbook2.csv | your-solution csv json > csv.json.txt
```

4. PRN to JSON

```
cat ./Workbook2.prn | your-solution prn json > prn.json.txt
```

In this example, my_file.csv is piped into the fileConverter.js file, with the input format specified as csv and the output format specified as html. The resulting HTML output is then saved to my_file.html.

You can also specify json as the output format to get JSON output instead of HTML.

## Options

This utility supports two command line options:

- csv: Specifies that the input file format is CSV.

- prn: Specifies that the input file format is PRN.

- html: Specifies that the output file format is HTML.

- json: Specifies that the output file format is JSON.

Note that the input and output formats must be specified in the correct order, otherwise the utility will not work properly.

## How it works

The csv-parse package is used to parse the CSV input data. Depending on the specified output format, the input data is processed and converted into either HTML or JSON output.

For CSV input files, the output HTML consists of a table with each row represented as a table row (<tr>) and each column as a table cell (<td>).

For PRN input files, the output HTML simply consists of the raw input data as a string, since there is no standardized format for PRN files.
