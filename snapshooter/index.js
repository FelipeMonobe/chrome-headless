const { spawn } = require('child_process')
const { createWriteStream } = require('fs')

const url = 'http://google.com.br'
const comando = 'chromium'
const parametros = ['--headless' ,'--disable-gpu', '--dump-dom', url]
const caminho = 'snapshooter/snapshot.txt'

const main = () => {
  const _arquivo = createWriteStream(caminho)
  const headlessChromium = spawn(comando, parametros)

  headlessChromium.on('close', code => console.log(`Finalizado com código: ${code}`))
  headlessChromium.stderr.on('data', data => console.error(data.toString()))
  headlessChromium.stdout.pipe(_arquivo)
}

main()
