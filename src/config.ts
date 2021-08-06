console.log(process.env.TEST)
console.log(process.env.REACT_APP_TEST)
console.log(process.env.GATSBY_HYPI_DOMAIN)

const data = {
  default_api_domain: 'https://api.hypi.app', 
  domain: process.env.REACT_APP_HYPI_DOMAIN,
  token: process.env.REACT_APP_HYPI_TOEKN
};
export default data;