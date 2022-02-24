# Create a SVG of France with DOM and COM as hexagonal grid map

## Hexagonal grid map

We downloaded the french hexagonal grid geopackage from https://www.r-bloggers.com/2020/05/polygons-to-hexagons/.

## Add the COM

Using QGis, I corrected some Geojson features inconsistencies and added 4 features for the COM: Wallis-et-Futuna, Saint-Pierre-et-Miquelon, Polynésie-française and Nouvelle-Calédonie and one historical french department: Corse (20).

## Transform to SVG

We use [geojson2svg](https://github.com/gagan-bansal/geojson2svg) from @gagan-bansal to convert the geojson into SVG:

- one SVG file not used in this project
- one JSON file combining the features' attributes with the PATH

It's the JSON file which is used in this web application to build the SVG from React.

