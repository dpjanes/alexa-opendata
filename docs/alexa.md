# Alexa

This is a fairly standard Alexa Voice Skill project,
of which there&apos;s quite a bit of instruction
for on the web. 

We&ll just provide the main details here:

* Create a New (Custom) Skill. It does not use the Audio Player
* In the **Interaction Model** tab:
  From `./skill` folder, copy the `SampleUtterances.txt`,
  the `What` and `Where` slots, and the `IntentSchema.json`
* In the **Configuration** Tab,
  select HTTPS and add your URL. In our case, this is
  `https://alexa-opendata.homestar.io/request`
* In the **Configuration** Tab,
  turn on **Account Linking**.
  Add an authorize URL (ours is `https://hey.homestar.io/authorize`),
  and make a client-id (ours in `alexa-openid`).
  Copy the **client-id** and one of the **redirect urls**
  to `./config.json`
* In the **SSL Certifcate** field, assuming you used
  Let&apos;s Encrypt, select **My development endpoint has a certificate from a trusted certificate authority**.

If all your servers are up and running, you should be ready to test
