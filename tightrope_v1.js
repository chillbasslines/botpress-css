  window.botpressWebChat.init({
    host: 'https://tightropechat.herokuapp.com',
    botName: 'TightropeBot',
    botConvoDescription: 'Is Tightrope right for you?',
    botId: 'learning',
    enableReset: true,
    showConversationsButton: false,
    extraStylesheet: 'https://chillbasslines.github.io/botpress-css/modern.css'
  }) 
  let rand = Math.floor(Math.random() * 100000000);
  const brokerageId = '5cec7d5435bb0200174811f4';
  setTimeout(function(){window.botpressWebChat.sendEvent({
    type: 'set-brokerage',
    channel: 'web',
    brokerage: brokerageId
  })}, 2000);
  window.addEventListener('message', message => {
    let id = message.data.userId;
    if(id.substr(id.length - 6) !== brokerageId.substr(brokerageId.length - 6)) {
      window.botpressWebChat.configure({
        host: 'http://localhost:3000',
        botName: 'Yacht Bot 2',
        botConvoDescription: 'Grab your favorite yacht',
        botId: 'learning',
        extraStylesheet: 'https://chillbasslines.github.io/botpress-css/modern.css',
        userId: rand + brokerageId.substr(brokerageId.length - 6)
      })
    }
  })
