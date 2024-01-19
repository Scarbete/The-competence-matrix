const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const yaml = require('js-yaml')

const app = express()
const PORT = 3000

app.use(bodyParser.json())

app.post('/addQuestion', (req, res) => {
    try {
        const data = yaml.safeLoad(fs.readFileSync('./test.yaml', 'utf8'))
        data.Вёрстка.Разметка['новый_вопрос'] = 3
        fs.writeFileSync('your_file.yaml', yaml.safeDump(data))
        res.send('Вопрос успешно добавлен.')
    }
    catch (error) {
        console.log(error)
        res.status(500).send('Произошла ошибка при добавлении вопроса.')
    }
})

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`)
})
