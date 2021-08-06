const axios = require('axios');
const fs = require('fs')
const YAML = require('yaml')
// var toml = require('toml');
const TOML = require('@iarna/toml')

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

  status.show({ summary: 'Read netlify.toml file' })

  //write platform environment variables
  process.env['GATSBY_HYPI_DOMAIN'] = domain
  process.env['REACT_APP_HYPI_DOMAIN'] = domain
  process.env['VUE_APP_HYPI_DOMAIN'] = domain
  process.env['NEXT_PUBLIC_HYPI_DOMAIN'] = domain

  // write the domain value to config.json file for non prefix frameworks
  const json = JSON.stringify({
    HYPI_DOMAIN: domain
  })

  try {
    fs.writeFileSync('./public/config.json', json)
  }
  catch (error) {
    build.failBuild('Error message', error)
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
