import autocomplete from 'autocompleter'
import './uspsAddressAutocomplete.css'

const DEBOUNCE = 150
const REQUIRE_CONFIG_PARAMS = ['publicKey', 'selector', 'onSelect']

export default class uspsAddressAutoComplete {
  constructor(config) {
    this.validateRequired(config)


    config.debounceWaitMs = config.debounce || DEBOUNCE
    config.input = document.querySelector(config.selector)
    config.fetch = this.getSuggestions
    config.emptyMsg = config.emptyMsg || "No suggestions found."
    config.render = this.renderRow
    this.callerOnSelect = config.onSelect
    config.onSelect = this.onSelect
    this.autoComplete = new autocomplete(config)
    this.publicKey = config.publicKey
    this.xhr = new XMLHttpRequest();
    this.uspsBeta = config.uspsBeta
    delete config.publicKey
  }

  validateRequired(config) {
    for (const key of REQUIRE_CONFIG_PARAMS) {
      if (!config[key]) {
        throw new Error(`must provide ${key} in config, cannot run without it`)
      }
    }

  }

  getSuggestions = (inputText, update) => {
    if (!this.autoComplete) {
      return []
    }
    const query = encodeURIComponent(inputText)
    const url = `https://us-autocomplete.api.smartystreets.com/${this.uspsBeta ? 'lookup' : 'suggest' }?auth-id=${this.publicKey}&prefix=${query}`
    this.getUrl(url, (error, result) => {
      if (error) {
        throw new Error(error)
      }
      update(result.suggestions)
    })

  }

  getUrl(url, cb) {
    this.xhr.abort()
    this.xhr.onload = () => {
      if (this.xhr.status >= 200 && this.xhr.status < 300) {
        cb(null,JSON.parse(this.xhr.response))
      } else {
        cb(this.xhr)
      }
      // Code that should run regardless of the request status
    }
    this.xhr.open('GET', url)
    this.xhr.send()
  }

  renderRow = (item, query) => {
    const rowContainer = document.createElement('div')
    rowContainer.className = 'address-ac-item'
    const icon = document.createElement('span')
    icon.className = 'map-icon'
    rowContainer.appendChild(icon)
    const address1 = document.createElement('span')
    address1.className = 'address1'
    address1.innerText = item.street_line
    rowContainer.appendChild(address1)
    const text = document.createTextNode((this.uspsBeta) ?
      `${item.city} ${item.state} ${item.zipcode}` :
      item.text.substring(item.street_line.length)
    )
    rowContainer.appendChild(text)
    return rowContainer
  }

  onSelect = (item) => {
    if (this.uspsBeta) {
      this.callerOnSelect(item)
      return
    }
    this.getUrl(
      `https://us-street.api.smartystreets.com/street-address?auth-id=${this.publicKey}&street=${encodeURIComponent(item.street_line)}&city=${encodeURIComponent(item.city)}&state=${encodeURIComponent(item.state)}`,
      (error, results) => {
        if (!results || !results.length) {
          alert('selected address has no deliverable address, select another address please')
          return
        }
        this.callerOnSelect(results)
      }
    )
  }
}




