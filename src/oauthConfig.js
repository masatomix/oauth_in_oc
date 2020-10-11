export default {
  client_id: 'bbbb',
  authorization_endpoint:
    'https://iis2.ad.ki-no.org/identity/connect/authorize',
  token_endpoint: 'https://iis2.ad.ki-no.org/identity/connect/token',
  redirect_uri: 'http://localhost:8080/login',
  scope: 'openid profile email OrchestratorApiUserAccess offline_access',
}
