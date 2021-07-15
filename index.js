#!/usr/bin/env node
const fs = require('fs')

//fungsi untuk membuat file json
function convertToJSON (arg, path) {
  const data = fs.readFileSync(arg[0], 'utf-8')
  const dataRow = data.split('\r\n')
  let result = []
  for (let i = 0; i < dataRow.length; i++) {
    const element = dataRow[i]
    const subElement = element.split(' ')
    const content = subElement.slice(5).join(' ')
    let oneLog = {
      date: `${subElement[0]} ${subElement[1]} ${subElement[2]}`,
      host: `${subElement[3]}`,
      service: `${subElement[4].slice(0, -1)}`,
      content: `${content}`
    }
    result.push(oneLog)
  }
  try {
    const final = fs.writeFileSync(path, JSON.stringify(result))
    console.log('file created at', path);
  } catch (err) {
    console.error(err)
  }
  return
}

//fungsi untuk membuat file plain text
function convertToText (arg, path) {
  const data = fs.readFileSync(arg[0], 'utf-8')
  try {
    const result = fs.writeFileSync(path, data)
    console.log('file created at', path);
  } catch (err) {
    console.error(err)
  }
  return
}

//fungsi untuk memanggil fitur help
function getHelp () {
  console.log(`
  .log file converter

  default command :
  log-converter var/log/<.log file> <flag1> <option1> <flag2> <option2>

  flag:
  - -t convert to specific file type.
    Option available:
    - json -> convert file into .json type
    - text -> convert file into plain text type
    (default result is plaintext)

  - -o convert file into specific path
    Option allowed:
    <path>/<fileName>.json  -> for json type result
    <path>/<fileName>.txt   -> for plaintext type result
  `)
}

//fungsi utama atau driver
function main (){

  //mendapatkan flag dan option dari argv
  const argInput = process.argv.slice(2)

  //memvalidasi argv yang diinputkan user
  if (argInput.length) {
    if (argInput.length === 1 && argInput[0] === '-h') {
      getHelp()
      return;
    } else {
      let flagT = false
      let tIndex = 0
      let flagO = false
      let oIndex = 0
      let targetPath = './'

      //validasi apakah ada flag -t dan atau flag -o
      argInput.forEach((argumen, idx) => {
        switch (argumen) {
          case '-t':
            flagT = true
            tIndex = idx
            break;
          case '-o':
            flagO = true
            oIndex = idx
            break;
          default:
            break;
        }
      })

      if (flagO) {
        targetPath = argInput[oIndex + 1]
      } else {
        const sourcePath = argInput[0]
        const sourceFileName = sourcePath.split('/').pop().split('.')[0]
        targetPath += sourceFileName
      }


      //action
      if (flagT) {
        switch (argInput[tIndex + 1]) {
          case 'json':
            if (!flagO) {
              targetPath += '.json'
            }
            convertToJSON(argInput, targetPath)
            return
          case 'text':
            if (!flagO) {
              targetPath += '.txt'
            }
            convertToText(argInput, targetPath)
            return
          default:
            console.log('error: no output type when use -t flag');
            return
        }
      } else {
        if (!flagO) {
          targetPath += '.txt'
        }
        convertToText(argInput, targetPath)
        return;
      }
    }
  } else {
    console.log('no file to convert. Please run program with flag -h to see detail');
    return
  }
}

main()