import config from '../config/server'

export const getApi = path => `${config.host}/api/${path}`

export const prettyDate = dateString => {
    let date = new Date()
    let dateArr = dateString.split(new RegExp('[:| |-]', 'ig'))
    let year = +dateArr[0]
    let month = +dateArr[1] - 1
    let day = +dateArr[2]
    let hour = +dateArr[3]
    let minute = +dateArr[4]
    let second = +dateArr[5]

    hour = hour < 10 ? '0' + hour : hour
    minute = minute < 10 ? '0' + minute : minute

    let opDate = new Date(year, month, day , hour, minute, second)
    let secondDiff = (new Date().getTime() - opDate.getTime()) / 1000

    if (secondDiff < 60) {
        return '刚刚'
    }
    if (secondDiff < 60 * 30) {
        return `${Math.ceil(secondDiff / 60)} 分钟前`
    }
    if (secondDiff < 1800) {
        return '半小时前'
    }
    if (secondDiff < 3600) {
        return '1 小时前'
    }
    if (secondDiff < 3600 * 2) {
        return '2 小时前'
    }
    if (secondDiff < 3600 * 3) {
        return '3 小时前'
    }
    if (date.getFullYear() == year && date.getMonth() == month && date.getDate() == day) {
        return `今天 ${hour}:${minute}`
    }
    if (date.getFullYear() == year && date.getMonth() == month && date.getDate() - 1 == day) {
        return `昨天 ${hour}:${minute}`
    }
    if (date.getFullYear() == year && date.getMonth() == month && date.getDate() - 2 == day) {
        return `前天 ${hour}:${minute}`
    }
    if (date.getFullYear() == year && date.getMonth() == month) {
        return `${month + 1} 月 ${day} 日`
    }
    if (date.getFullYear() == year) {
        return `今年 ${month + 1} 月 ${day} 日`
    }
    if (date.getFullYear() - 1 == year) {
        return `去年 ${month + 1} 月 ${day} 日`
    }

    return `${year} 年 ${month + 1} 月 ${day} 日`
}

export const toThousand = n => (n || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1, ')

export const getLineNumber = html => {
    let lines = ''
    let splits = html.split(/\r\n|\r|\n/g)
    let div = document.createElement('div')

    if (!splits[splits.length - 1]) {
        splits.pop()
    }

    splits.forEach((line, index) => {
        lines += `<div style="height:{pr}%;">${index + 1}</div>`
    })

    div.className = 'line-nubmer'
    div.innerHTML = `<div class="line-number-box">${lines.replace(/{pr}/g, 1 / splits.length * 100)}</div>`
    return div
}
