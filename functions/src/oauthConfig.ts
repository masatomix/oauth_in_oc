export default {
  client_id: 'xx',
  client_secret: 'xx',
  authorization_endpoint: 'https://slack.com/oauth/authorize',
  token_endpoint: 'https://slack.com/api/oauth.access',
  redirect_uri:
    'http://localhost:5000/xx/us-central1/oauth',
  // redirect_uri: 'https://us-central1-##PROJECT ID##.cloudfunctions.net/oauth',
  scope: 'identity.basic'
}
