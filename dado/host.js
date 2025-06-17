export default class Host {
  static url() {
    return process.env.URL
  }
  static urlApi() {
    return process.env.URL_API
  }
}