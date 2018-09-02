module.exports = () => {
  class Config {
    constructor () {
      this.src = './app/'
      this.dest = './dist/'
      this.node_modules = 'node_modules/'
    }
  }
  const config = new Config()
  return config
}
