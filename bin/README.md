# bin

Executables

# Executables
## cli.js

Example commands:

    node cli --name "CN Tower" --firebase
    node cli --name "Toronto Eaton Centre" --firebase -n 10
    node cli --name "Toronto Eaton Centre" --theme "Indoor Rink" -n 10 --firebase
    node cli --name "Toronto Eaton Centre" --theme "Mosque" -n 10 --firebase
    node cli --theme "Beach" --firebase -n 10
    node cli --theme "Christian Church" --firebase -n 10
    node cli --theme "Mall" --firebase -n 10
    node cli --theme "Outdoor Rink" --firebase
    node cli --theme "Outdoor Rink" --firebase -n 10
    node cli --theme "Outdoor Rink" --name "CN Tower" --firebase -n 10
    node cli --theme "Outdoor Rink" --name "Toronto Eaton Centre" --firebase -n 10
    node cli --theme "Skateboard Park" --firebase -n 10

## compile-dst.js

This will go through everything in `../src/`, run the compile function
and output the data in `../dst/*.yaml`

## create-slots.js

This will create the Alexa slot information in `../skill/slots`. It will 
use the data from `../dst/*.yaml`
