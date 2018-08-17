// For a google+ api key, go to:
// http://console.developers.google.com
// and enable the google+ api. Create credentials
// and put them in the cooresponding spots below.

// for the database, you can set up a simple mongodb
// deployement here:
// http://mlab.com
// Create a new user and paste the dbURI below.
module.exports = {
    google: {
        clientID: "",
        clientSecret: "",
    },
    mongodb: {
        dbURI: ""
    },
    session: {
        cookieKey: "dontstealmycookies"
    }
}