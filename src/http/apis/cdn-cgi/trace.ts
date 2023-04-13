export const ALLOWED_COUNTRY_CODES = new Set([
  'AL',
  'DZ',
  'AD',
  'AO',
  'AG',
  'AR',
  'AM',
  'AU',
  'AT',
  'AZ',
  'BS',
  'BD',
  'BB',
  'BE',
  'BZ',
  'BJ',
  'BT',
  'BO',
  'BA',
  'BW',
  'BR',
  'BN',
  'BG',
  'BF',
  'CV',
  'CA',
  'CL',
  'CO',
  'KM',
  'CG',
  'CR',
  'CI',
  'HR',
  'CY',
  'CZ',
  'DK',
  'DJ',
  'DM',
  'DO',
  'EC',
  'SV',
  'EE',
  'FJ',
  'FI',
  'FR',
  'GA',
  'GM',
  'GE',
  'DE',
  'GH',
  'GR',
  'GD',
  'GT',
  'GN',
  'GW',
  'GY',
  'HT',
  'VA',
  'HN',
  'HU',
  'IS',
  'IN',
  'ID',
  'IQ',
  'IE',
  'IL',
  'IT',
  'JM',
  'JP',
  'JO',
  'KZ',
  'KE',
  'KI',
  'KW',
  'KG',
  'LV',
  'LB',
  'LS',
  'LR',
  'LI',
  'LT',
  'LU',
  'MG',
  'MW',
  'MY',
  'MV',
  'ML',
  'MT',
  'MH',
  'MR',
  'MU',
  'MX',
  'FM',
  'MD',
  'MC',
  'MN',
  'ME',
  'MA',
  'MZ',
  'MM',
  'NA',
  'NR',
  'NP',
  'NL',
  'NZ',
  'NI',
  'NE',
  'NG',
  'MK',
  'NO',
  'OM',
  'PK',
  'PW',
  'PS',
  'PA',
  'PG',
  'PE',
  'PH',
  'PL',
  'PT',
  'QA',
  'RO',
  'RW',
  'KN',
  'LC',
  'VC',
  'WS',
  'SM',
  'ST',
  'SN',
  'RS',
  'SC',
  'SL',
  'SG',
  'SK',
  'SI',
  'SB',
  'ZA',
  'KR',
  'ES',
  'LK',
  'SR',
  'SE',
  'CH',
  'TW',
  'TZ',
  'TH',
  'TL',
  'TG',
  'TO',
  'TT',
  'TN',
  'TR',
  'TV',
  'UG',
  'UA',
  'AE',
  'GB',
  'US',
  'UY',
  'VU',
  'ZM',
])

export interface OpenAICDNCGITrace {
  fl: string
  h: string
  ip: string
  ts: string
  visit_scheme: string
  uag: string
  colo: string
  sliver: string
  http: string
  loc: string
  tls: string
  sni: string
  warp: string
  gateway: string
  rbi: string
  kex: string
}

function parseResponse(response: string): OpenAICDNCGITrace {
  const params: Record<string, string> = {}
  const pairs = response.split('\n')
  for (const pair of pairs) {
    const [key, value] = pair.split('=')
    if (key && value) {
      params[key.trim()] = value.trim()
    }
  }
  return params as unknown as OpenAICDNCGITrace
}

export async function requestOpenAICDNCGITrace() {
  try {
    // API endpoint of OpenAI's CDN that returns location information. No authentication needed.
    const resp = await fetch('https://chat.openai.com/cdn-cgi/trace', {
      method: 'GET',
    })
    const text = await resp.text()
    return parseResponse(text)
  } catch (e) {
    return Promise.reject(e)
  }
}
