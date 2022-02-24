var geojson2svg = require("geojson2svg");
var fs = require("fs");

var viewportSize = { width: 1000, height: 1000 };
var converter = geojson2svg({
  attributes: [
    { property: "properties.insee_dep", type: "dynamic", key: "id" },
    "properties.nom_dep",
    "properties.insee_reg",
    { property: "fill", value: "white", type: "static" },
    { property: "stroke", value: "black", type: "static" },
  ],
  viewportSize,
  mapExtent: {
    left: 115491.3039531734539196,
    right: 1261580.463969221804291,
    top: 7146591.4072681115940213,
    bottom: 6059311.1466015791520476,
  },
});

var geo = JSON.parse(
  fs.readFileSync("./france_dom_com_hexagonal.geojson").toString()
);

var svgStr = converter.convert(geo);

// SVG file export
fs.writeFileSync(
  "./france_DOM_COM_hexagonal.svg",
  `<svg version="1.1"
width="${viewportSize.width}" height="${viewportSize.height}"
xmlns="http://www.w3.org/2000/svg">
${svgStr.join("\n")}
</svg>`
);

// JSON export to later render SVG from REACT
fs.writeFileSync(
  "./france_DOM_COM_hexagonal.json",
  JSON.stringify(
    converter
      .convert(geo, { output: "path" })
      .map((d, i) => ({ ...geo.features[i].properties, d })),
    null,
    2
  )
);
