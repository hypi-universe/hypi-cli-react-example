const axios = require('axios');
const fs = require('fs')
const YAML = require('yaml')

async function run({
  netlifyConfig,
  inputs,
  error,
  constants: {
    CONFIG_PATH,
    PUBLISH_DIR,
    FUNCTIONS_SRC,
    FUNCTIONS_DIST,
    IS_LOCAL,
    NETLIFY_BUILD_VERSION,
    SITE_ID,
  },
  utils: {
    build,
    status,
    cache,
    run,
    git,
    functions,
  },
}) {
  status.show({ summary: 'Successfully called Hypi plugin' })

  //check .hypi folder exists
  if (!fs.existsSync('.hypi')) {
    build.failBuild('Error message', '.hypi folder not exists')
  }
  status.show({ summary: 'Found .hypi folder' })

  //check .hypi/instance.yaml file exists
  if (!fs.existsSync('.hypi/instance.yaml')) {
    build.failBuild('Error message', '.hypi/instance.yaml file not exists')
  }
  status.show({ summary: 'Found .hypi.instance.yaml file' })

  status.show({ summary: 'Read .hypi.instance.yaml file' })
  const instanceFile = fs.readFileSync('.hypi/instance.yaml', 'utf-8')

  let instanceYaml;
  status.show({ summary: 'Parse .hypi.instance.yaml file' })
  try {
    instanceYaml = YAML.parse(instanceFile); //parse to yaml
  } catch (error) {
    build.failBuild('Error message', 'Failed to parse yaml file .hypi/instance.yaml')
  }
  status.show({ summary: 'Parsed .hypi.instance.yaml file' })

  const domain = instanceYaml.domain;
  //write the domain to environemnt variables
  // netlifyConfig.build.environment.HYPI_DOMAIN = domain
  process.env['HYPI_DOMAIN'] = domain

  const token = 'gwVvAcu76qlr8wbl1r0KPDvhmYmswUCiKNrELv2S77U'
  const env = {
    HYPI_DOMAIN: domain,
  }
  const instance = axios.create({
    baseURL: 'https://api.netlify.com/api/v1/',
    timeout: 1000,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'content-type': 'application/json',
    }
  });
  status.show({ summary: 'Call api to get site' })
  const response = await instance.get(`/sites/${SITE_ID}`)
  const site = response.data;

  // console.log(site.build_settings.env)
  // console.log({...site.build_settings.env, ...env})

  status.show({ summary: 'Call api to save new environment variables' })
  try {
    const resposneP = await instance.patch(`/sites/${SITE_ID}`, {
      build_settings: {
        env: { ...site.build_settings.env, ...env }
      }
    })
    const data = await resposneP.data
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  async onPreBuild(args) {
    try {
      await run(args)
    } catch (error) {
      args.utils.build.failBuild('Hypi Plugin: Error message', { error })
    }
    args.utils.status.show({ summary: 'Hypi Plugin: Success!' })
  },
}
