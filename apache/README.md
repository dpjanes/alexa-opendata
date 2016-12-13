# apache

The configuration for using alexa-opendata with Apache.
There's two servers running:

* the "web" server, which is the user facing interface
* the "skill" server, which Alexa Skills talks to 

We assume that:

* you've installed [letsencrypt](https://letsencrypt.org/) to get SSH certificates
* the "web" server is running on port 22300
* the "skill" server is running on port 22200

If you're setting this up on your own, make sure you have DNS A Records
pointing to your host. Don't depend on "@" default records.

## conf

These are the apache configuration fiels

* Copy all the files in `conf` to `/etc/http/conf.d`.

Make the following changes to the files you've copied:

* change `ServerAdmin` to your email
* change `ServerName` to the <skill-domain> and <web-domain> you are using
* change `Redirect` to the URL for <skill-domain> and <web-domain> 
 that you are using (make sure you don't confuse the skill and web urls!)

To test, you can comment out the Proxy and Redirect lines and make sure you see
the sample web folders.

Then set up encryption using let's encrypt:

    letsencrypt run -d <skill-domain> -d <web-domain>

## web

These aren't really necessary, but are nice-to-have
when testing DNS, etc.

* Copy all the folders in `web` to `/var/www`

