
import raw from "raw.macro";
import YAML from 'yaml'

const rawConfig = raw('/home/eman/.config/hypi/config.json');
const config = JSON.parse(rawConfig)

const rawInstance = raw('../.hypi/instance.yaml');
const parsedInstance = YAML.parse(rawInstance)

const data = {
  default_api_domain: config.api_domain,
  domain: parsedInstance.domain,
  token: config.sessionToken
}

export default data