import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

const cert = `-----BEGIN CERTIFICATE-----
MIIC+zCCAeOgAwIBAgIJAWGMCUI0MvSsMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAMTEHdhYWhtNy5hdXRoMC5jb20wHhcNMjAwNDEyMTQwMjIxWhcNMzMxMjIwMTQw
MjIxWjAbMRkwFwYDVQQDExB3YWFobTcuYXV0aDAuY29tMIIBIjANBgkqhkiG9w0B
AQEFAAOCAQ8AMIIBCgKCAQEA043yRGwUHF3zKYhei5RU4CkKlO6DhNbc4B8vxFZV
AK0He/dgOvi27FdklQsgZDF8yM8AzKQndMpP+BXbZEV/r9wC25+1mSKov8sGeYAd
v0nPgL8wbn4YEbyQbCDLGdZlhjcExCNKeFPLidoqRln9HuJ5MsXzzL+pgyYCqQfM
9ADm+2ZE/8FYe43R5n0rtc2h0GCR4Lqc+5DXG7bWXuGafO4l1leG3HFi6b20U1v6
IvBqA36vku9NkQNTx2cm3WAXxGDgWKWj8SxfCOCXdOzYzhJG1jo4Cz1YWQhnevET
tuqVXaRIZG0gTz0szwlaKKyh3BU77kjgEVpi4GnHPN1cHwIDAQABo0IwQDAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBS8N67USoqvQMT5d6sqdvDgzq1NfjAOBgNV
HQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAJ4PFHXFD6rTKOKqvcsY+FoE
2noMgi4FEQ9C9GqeHn87OG5L8jVHKEKGKpwBmefA9xA7c8fEM0rndM52GZkUwu5d
K3iUy4hZj9TiinUNkU+/P6r0J2yg4rotlQ0JcyMHsLuMWdDYHasd18ULUXx1yxr+
p0U5Tz9zGPLUY163TetRkhpMX+eHYYSQ0SsvW5OC3r57vpuPtcGjsXz+dAo6C6DJ
/FkoeRgLD/34a9ryEudBFaHrdLxkGiOc3nSFgOKP9LA4W4EgzNeMpXe1ZjZy7Tml
lIGDgZ18ZqNCruzkoLSDsgKTamEHVvtdvVxS48tUTQkhKYcsj4Zk86uKBQHH5ZU=
-----END CERTIFICATE-----`



export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
