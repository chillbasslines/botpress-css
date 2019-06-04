function injectDOMElement(tagName, targetSelector, options) {
  const element = document.createElement(tagName)
  if (options) {
    Object.keys(options).forEach(function(key) {
      element[key] = options[key]
    })
  }
  document.querySelector(targetSelector).appendChild(element)
  return element
}

window.addEventListener('message', function(payload) {
  const data = payload.data
  if (!data || !data.type || data.type !== 'setClass') {
    return
  }
  document.querySelector('#bp-widget').setAttribute('class', data.value)
})

function setBrokerageId(brokerageId) {
  sendEvent({
    type: 'set-brokerage',
    channel: 'web',
    payload: {
      brokerage: brokerageId
    }
  })
}

function init(config) {
  const host = config.host || 'https://tightropechat.herokuapp.com'
  const botId = config.botId || 'learning'
  const brokerageId = config.brokerageId || ''
  config.extraStylesheet = config.extraStylesheet || 'https://chillbasslines.github.io/botpress-css/modern.css'
  const cssHref = host + '/assets/modules/channel-web/inject.css'
  injectDOMElement('link', 'head', { rel: 'stylesheet', href: cssHref })

  const options = encodeURIComponent(JSON.stringify({ config: config }))
  const iframeSrc = host + '/lite/' + botId + '/?m=channel-web&v=Embedded&options=' + options
  const iframeHTML = '<iframe id="bp-widget" frameborder="0" src="' + iframeSrc + '" class="bp-widget-web"/>'
  injectDOMElement('div', 'body', { id: 'bp-web-widget', innerHTML: iframeHTML })

  const iframeWindow = document.querySelector('#bp-web-widget > #bp-widget').contentWindow
  function configure(payload) {
    iframeWindow.postMessage({ action: 'configure', payload: payload }, '*')
  }
  function sendEvent(payload) {
    iframeWindow.postMessage({ action: 'event', payload: payload }, '*')
  }

  window.botpressWebChat.configure = configure
  window.botpressWebChat.sendEvent = sendEvent

  window.addEventListener('message', message => {
    if (message.data.userId) {
      const userId = message.data.userId;
      const preId = userId.substr(0,21);
      const postId = userId.slice(-brokerageId.length);
      if(postId !== brokerageId) {
        config.userId = preId + brokerageId;
        configure(config)
      }
    }
  })

  setTimeout(function(){sendEvent({
    type: 'set-brokerage',
    channel: 'web',
    payload: {
      brokerage: brokerageId
    }
  })
 }, 3000);
}

// Do we want to expose 'onPostback'
// Or do we let it as is (window listens on message) ?
window.botpressWebChat = { init: init }
