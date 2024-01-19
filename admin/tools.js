
document.addEventListener('DOMContentLoaded', () => {
    fetch('./data.yaml')
        .then(response => response.text())
        .then(yamlData => {

            const data = jsyaml.load(yamlData)
            const dataKeys = Object.keys(data)

            console.log(data)
            console.log(dataKeys)
        })
        .catch(error => console.log(error))
})