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
  const netlifyToml = fs.readFileSync('netlify.toml', 'utf-8')

  const platformEnvVariables =
  {
    GATSBY_HYPI_DOMAIN: domain,
    REACT_APP_HYPI_DOMAIN: domain,
    VUE_APP_HYPI_DOMAIN: domain,
    NEXT_PUBLIC_HYPI_DOMAIN: domain,
  }

  //Parse the netlify.yaml and update environment variables
  try {
    var data = TOML.parse(netlifyToml);
    status.show({ summary: data.toString() })
    
    const envVarsExists = checkNested(data, 'context', 'production', 'environment')? true : false
    let envVars = envVarsExists ? data.context.production.environment : null;
    
    if (envVars) {
      if (Object.keys(envVars).length === 0) {
        envVars = platformEnvVariables
      } else {
        for (let key of Object.keys(platformEnvVariables)) {
          envVars[key] = platformEnvVariables[key]
        }
      }
    } else {
      envVars = platformEnvVariables
    }

    if (envVarsExists) {
      data.context.production.environment = envVars
    } else {
      data['context.production.environment'] = envVars
    }
    fs.writeFileSync('netlify.toml', TOML.stringify(data).replace("[\"context.production.environment\"]", "[context.production.environment]"));

    await run.command('git add netlify.toml && git commit -m "[skip ci] Set Hypi domain" && git push origin $BRANCH')

  } catch (e) {
    console.error("netlify.toml Parsing error on line " + e.line + ", column " + e.column +
      ": " + e.message);
  }

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
function checkNested(obj /*, level1, level2, ... levelN*/ ) {
  let args = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
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
