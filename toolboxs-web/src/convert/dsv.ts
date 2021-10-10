import { csvFormat, csvParse, tsvFormat, tsvParse } from "d3-dsv";

const CSV = {
  parse(csv: string) {
    return csvParse(csv);
  },
  stringify(obj: any) {
    return csvFormat(obj);
  },
};

const TSV = {
  parse(tsv: string) {
    return tsvParse(tsv);
  },
  stringify(obj: any) {
    return tsvFormat(obj);
  },
};

export { CSV, TSV };
