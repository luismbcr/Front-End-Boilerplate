module.exports = () => {
  class Config {
    constructor () {
      this.src = './app/'
      this.dest = './dist/'
    }
  }
  const config = new Config()
  return config
}
