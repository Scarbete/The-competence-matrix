const tableHeadTR = document.getElementById('tableHeadTR')
const tableBody = document.getElementById('tableBody')
const selectWorker = document.getElementById('selectWorker')
const theadTH = document.getElementById('theadTH')

let secondRoleQuestionsData = []
let roleQuestionsData = []
let allRoles = []
let mainDevs = []
let selectedRole
let role

const getUsers = async () => {
    try {
        const response = await fetch(`http://localhost:3000/users`)
        return response.json()
    }
    catch (error) {
        console.error(error)
    }
}

const getAllQuestion = async () => {
    try {
        const response = await fetch(`http://localhost:3000/questions`)
        return response.json()
    }
    catch (error) {
        console.error(error)
    }
}

const postQuestion = async (newQuestion) => {
    try {
        const response = await fetch(`http://localhost:3000/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newQuestion),
        })
        console.log(response)
    }
    catch (error) {
        console.error(error)
    }
}


const deleteQuestion = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/questions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        console.log(response)
    }
    catch (error) {
        console.error(error)
    }
}



/*      ВСЕ ЧТО СВЯЗАНО С TABLE       */
const renderSelectWorkerTheadTH = () => {
    for (let i = 0; i < allRoles.length; i++) {
        const option = document.createElement('option')
        option.classList.add('workerOption')
        option.value = allRoles[i].username
        option.text = allRoles[i].username
        selectWorker.append(option)
    }

    selectWorker.onchange = ({ target }) => {
        role = target.value
        localStorage.setItem('mainRole', role)

        let selectedMainRoleId

        for (let i = 0; i < allRoles.length; i++) {
            if (allRoles[i].username === role) {
                selectedMainRoleId = allRoles[i].id
                localStorage.setItem('selectedMainRoleId', selectedMainRoleId)
            }
        }
        localStorage.setItem('selectedMainRoleId', selectedMainRoleId)

        window.location.reload()
    }

    role = localStorage.getItem('mainRole')
    selectWorker.value = role
}

const renderSelectTheadTH = () => {
    const selectLabel = document.createElement('p')
    selectLabel.append('select user')
    const select = document.createElement('select')
    select.classList.add('confluenceTh', 'stickyEvery')
    selectLabel.style.marginTop = '10px'

    const newAllRoles = allRoles.filter(item => item.role !== 'admin')

    for (let i = 0; i < newAllRoles.length; i++) {
        const option = document.createElement('option')
        option.value = newAllRoles[i].username
        option.text = newAllRoles[i].username
        select.append(option)
    }

    select.onchange = ({ target }) => {
        selectedRole = target.value
        let selectedRoleId

        for (let i = 0; i < allRoles.length; i++) {
            if (allRoles[i].username === selectedRole) {
                selectedRoleId = allRoles[i].id
                localStorage.setItem('selectedRoleId', selectedRoleId)
                window.location.reload()
            }
        }
        localStorage.setItem('selectedRole', selectedRole)
    }

    selectedRole = localStorage.getItem('selectedRole')
    select.value = selectedRole

    theadTH.append(selectLabel)
    theadTH.append(select)
}


const getRoleQuestionsData = async () => {
    const allQuestions = await getAllQuestion()
    const mainRole = localStorage.getItem('mainRole')
    const selectedRole = localStorage.getItem('selectedRole')

    const newAllQuestions = allQuestions.filter(item => item.answeredBy === mainRole)
    const newAllQuestionsForSecond = allQuestions.filter(item => item.answeredBy === selectedRole)
    roleQuestionsData = [...newAllQuestions]
    secondRoleQuestionsData = [...newAllQuestionsForSecond]
}

const toggleCheckBox = () => {
    if (role === 'Admin') return

    const labelSpansStrong = document.querySelectorAll('.td__label__span__strong')

    const applyDecoration = (strongText) => {
        const found = Object.values(roleQuestionsData).some((questions) => {
            return Object.values(questions).includes(strongText.innerText)
        })

        if (found) {
            strongText.style.textDecoration = 'line-through'
            strongText.style.color = 'green'
        }
    }

    labelSpansStrong.forEach(applyDecoration)
}


const toggleMainCheckBox = () => {
    if (role !== 'Admin') return
    const td__label__div__checkbox = document.querySelectorAll('.td__label__div__checkbox')
    const labelSpansStrong = document.querySelectorAll('.td__label__span__strong')

    const applyDecoration = (strongText, index) => {
        const found = Object.values(secondRoleQuestionsData).some((questions) => {
            return Object.values(questions).includes(strongText.innerText)
        })

        if (found) td__label__div__checkbox[index].checked = true
    }

    labelSpansStrong.forEach(applyDecoration)
}


getUsers()
    .then(data => allRoles = data)
    .then(() => {
        renderSelectWorkerTheadTH()
        if (localStorage.getItem('mainRole') === 'Admin') renderSelectTheadTH()
        getRoleQuestionsData().then(() => {
            toggleCheckBox()
            toggleMainCheckBox()
        })
    })


const renderThForTableHead = devs => {
    for (let i = 0; i < devs.length; i++) {
        const th = document.createElement('th')
        const div = document.createElement('div')
        div.append(devs[i])

        th.append(div)
        th.classList.add('confluenceTh', 'stickyHeader', 'header_3')

        tableHeadTR.append(th)
    }
}


const renderDivLabels = async (div__td, subQuestions, devIndex, questionTheme) => {
    const div__label = document.createElement('div')
    div__label.classList.add('div__label')

    for (let i = 0; i < subQuestions.length; i++) {
        const [ title, id ] = subQuestions[i]
        const replacedTitle = title.replace(/_/g, '')
        const localRole = localStorage.getItem('mainRole')

        if (id === devIndex) {
            div__label.innerHTML += `
                <label class='td_label'>    
                    ${localRole === 'Admin' ? `<input 
                        class='td__label__div__checkbox' 
                        type='checkbox' 
                        name='${questionTheme}' 
                        value='${replacedTitle}level${devIndex}level'>` : ''
                    }    
                    <span class='td__label__span'>
                        <strong class='td__label__span__strong'>
                            ${replacedTitle}
                        </strong>
                    </span>
                </label>
            `
        }
    }
    div__td.append(div__label)
}


const renderDivForTD = (td, questions, devIndex, questionTheme) => {
    for (let i = 0; i < questions.length; i++) {
        const [ mainTitle, data ] = questions[i]
        const subQuestions = Object.entries(data)
        let subQuestionsID = []

        subQuestions.forEach(item => subQuestionsID.push(item[1]))

        if (subQuestionsID && subQuestionsID.includes(devIndex)) {
            const div__td = document.createElement('div')
            div__td.innerHTML = `
                <span>
                    <h5>${mainTitle}</h5>
                </span>
            `
            renderDivLabels(div__td, subQuestions, devIndex, questionTheme)
            td.append(div__td)
        }
    }
}


const renderThTdForTableBodyTR = (tr, data, questionTheme, devs) => {
    const questions = Object.entries(data)

    const th = document.createElement('th')
    th.classList.add('confluenceTh', 'stickThLeft')

    const div = document.createElement('div')
    div.append(questionTheme)
    th.append(div)
    tr.append(th)

    // преобразование массива devs в индексы
    const indexMap = {}
    devs.forEach((value, index) => indexMap[value] = index)
    const indexes = devs.map(value => indexMap[value])

    // cycle for render td`s for tr in body
    for (let i = 0; i < devs.length; i++) {
        const td = document.createElement('td')
        td.classList.add('confluenceTh', 'td__Width')
        tr.append(td)
        renderDivForTD(td, questions, indexes[i], questionTheme)
    }
}


const renderTrForTableBody = data => {
    const dataKeys = Object.keys(data).filter(item => item !== 'devs')
    const newData = {...data}
    delete newData.devs

    // cycle for render tr`s for body
    for (let i = 0; i < dataKeys.length; i++) {
        const tr = document.createElement('tr')
        renderThTdForTableBodyTR(tr, newData[dataKeys[i]], dataKeys[i], data.devs)
        tableBody.append(tr)
    }
}


const checkBoxEditing = () => {
    const checkBoxes = document.querySelectorAll('.td__label__div__checkbox')

    checkBoxes.forEach(item => {
        item.onchange = () => {
            const questionTitle = item.value.replace(/level[0-9]level/g, '')
            const questionCategory = item.name
            const answeredBy = localStorage.getItem('selectedRole')

            const matchingQuestion = secondRoleQuestionsData.find(question =>
                question.title === questionTitle &&
                question.category === questionCategory &&
                question.answeredBy === answeredBy
            )

            if (item.checked && !matchingQuestion) {
                const newQuestion = {
                    id: `${Date.now()}`,
                    category: questionCategory,
                    title: questionTitle,
                    answeredBy: answeredBy
                }

                const regex = /.*(\d+).*/
                const match = item.value.match(regex)

                if (match) {
                    const extractedText = match[1]
                    newQuestion['level'] = parseInt(extractedText, 10)
                }

                postQuestion(newQuestion)
            }
            else {
                deleteQuestion(matchingQuestion.id)
            }
        }
    })
}


fetch('./test.yaml')
    .then(response => response.text())
    .then(yamlData => {
        const data = jsyaml.load(yamlData)
        const devsData = data.devs ? data.devs : null
        mainDevs = devsData
        renderThForTableHead(devsData)
        renderTrForTableBody(data)
        checkBoxEditing()
    })
    .catch(error => console.log(error))