const { launch } = require('lighthouse/chrome-launcher/chrome-launcher')
const CDP = require('chrome-remote-interface')

const url = 'http://google.com.br'
const porta = 9222
const parametros = ['--headless' ,'--disable-gpu']
const opcoes = { port: porta, chromeFlags: parametros }

const main = async () => {
  const headlessChromium = await launch(opcoes)
  const protocolo = await CDP({ port: porta })
  const { Page, Runtime } = protocolo

  await Promise.all([ Page.enable(), Runtime.enable() ])
  Page.navigate({ url })

  return Page.loadEventFired(async () => {
    const termo = 'scrapping'
    const consulta = `
    document.querySelector('input[title="Pesquisar"').value = '${termo}'
    document.querySelector('form').submit()`

    await Runtime.evaluate({ expression: consulta })

    return Page.loadEventFired(async () => {
      const elemento = 'document.querySelector("h3 > a")'
      const selecoes = [`${elemento}.innerHTML`, `${elemento}.href`]
      const [titulo, link] = await Promise
        .all(selecoes
          .map(x => Runtime
            .evaluate({ expression: x })))

      console.log(`Primeiro resultado para o termo "${termo}":`)
      console.log(`Título: ${titulo.result.value}`)
      console.log(`Link: ${link.result.value}`)

      protocolo.close()
      headlessChromium.kill()
    })
  })
}

main()
