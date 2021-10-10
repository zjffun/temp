import convert from "xml-js";

const XML = {
  parse(xml: string, options: any) {
    return convert.xml2js(xml, options);
  },
  stringify(obj: any, options: any) {
    return convert.js2xml(obj, { ...options, compact: true });
  },
};

export default XML;
