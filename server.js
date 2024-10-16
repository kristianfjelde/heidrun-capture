const http = require('http')
const express = require('express')
const app = express()

const { BTCMD_GetStatus } = require('./lib/cgiByteCodeMap')
const { config } = require('./config')

const code = 'a'

let logging = true

process.argv.forEach(function (val, index, array) {
  if (val == 'no-log') {
    logging = false
  }
});

function parseOutputStatus(outputStatus) {
  let outputs = {
    'Heat Elements': [],
    Pumps: [],
    Valves: [],
  };

  for (let i = 0; i < 2; i++) {
    if (outputStatus & (1 << (11 + i))) {
      const heating = ['HTL', 'Boil'];
      outputs['Heat Elements'].push(heating[i]);
    }
  }

  for (let i = 0; i < 3; i++) {
    if (outputStatus & (1 << (8 + i))) {
      const pumps = ['HTL', 'Mash', 'Boil'];
      outputs['Pumps'].push(pumps[i]);
    }
  }

  for (let i = 0; i < 8; i++) {
    if (outputStatus & (1 << i)) {
      outputs['Valves'].push(i + 1);
    }
  }

  return outputs;
}

async function startLog() {
  const sendLogItem = (id, logItem) => {
    const newLogItem = logItem;

    let outputs = parseOutputStatus(logItem['outputStatus']);

    console.log('Activated Outputs:');
    if (outputs['Heat Elements'].length > 0) {
      console.log('Heating Elements: ' + outputs['Heat Elements'].join(', '));
    }
    if (outputs['Pumps'].length > 0) {
      console.log('Pumps: ' + outputs['Pumps'].join(', '));
    }
    if (outputs['Valves'].length > 0) {
      console.log('Valves: ' + outputs['Valves'].join(', '));
    }

    console.log(`Temperatures:`)
    console.log(`HLT: ${newLogItem['HLT_Temperature']} MASH: ${newLogItem['Mash_Temperature']} BOIL: ${newLogItem['Kettle_Temperature']}`)
  }
  
  setInterval(() => {
    const logItem = {
      _type: 'logItem',
      _key: new Date().getTime(),
      timestamp: new Date()
    }
  
    http.get(
      `${config.url}?${code}`, (resp) => {
        let data = ''
        resp.on('data', (chunk) => {
          data += chunk;
        })
    
        resp.on('end', () => {
          BTCMD_GetStatus().rspParams.map((param, i) => {
            logItem[param] = JSON.parse(data)[i]
          })

          if (logItem['responseCode'] === code) {
            sendLogItem(lastLog._id, logItem)
          }
          //else {
          //  console.log('Got empty status from brewtroller', data)
          //}
        })
    
      }
    ).on("error", (err) => {
      console.log("Error connecting to Brewtroller " + err.message)
    })  
  }, config.intervalSeconds * 1000 || 10000)
}

if (logging) {
  startLog()
} else {
  console.log('Logging disabled')
}


app.get('/', function (req, res) {
  res.send('Heidrun says hello 🍺')
})

app.get('/api/btnic', function (req, res) {

  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

  const params = req._parsedUrl.query
  console.log('parsedUrl.query', req._parsedUrl.query)

  http.get(
    `${config.url}?${params}`, resp => {
      let data = ''
      resp.on('data', chunk => {
        data += chunk
      })

      resp.on('end', () => {
        res.send(`OK ${data}`)
        return JSON.parse(data)
      })

    }
  ).on('error', err => {
    console.error(`Error connecting to Brewtroller ${err.message}`)
  })
})

app.listen(3000, () => console.log('Staring Heidrun Server: port 3000!'))
