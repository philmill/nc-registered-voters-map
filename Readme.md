# Basic info about the project to be used hopefully for justice and eventually peace

## Here's the link to Registered Voters in NC
https://www.ncsbe.gov/Public-Records-Data-Info/Election-Results-Data

### Todo:
* Transform current CSV file into a json file filtering by zipcode and add geo 
coordinates with address data. At this point we would also want to filter out
unwanted columns and party affiliation.
* Seems like using https://www.geocod.io/ for geolocation for the script is more
affordable and can batch requests. We'll have to experiment with batching requests
to determine if the results remain ordered by addresses, so we can attach 
lat/lon to the correct address. Otherwise, we'll have to call the one by one.
Their API has a rate limit of about 12 request per second. 
* Should attach a map to the html page and play around with GeoJSON and some data points.
Going with https://leafletjs.com/examples/quick-start/ and https://www.mapbox.com/pricing/#maps 
