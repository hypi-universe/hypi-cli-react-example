console.log(process.env.HYPI_DOMAIN)
const data = {
  default_api_domain: 'https://api.hypi.app', 
  domain: process.env.REACT_APP_HYPI_DOMAIN,
  token: process.env.REACT_APP_HYPI_TOEKN
};
export default data;