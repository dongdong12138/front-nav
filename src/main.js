let siteMap = [
    { name: 'acfun.cn', url: 'https://www.acfun.cn/' },
    { name: 'bilibili.com', url: 'https://www.bilibili.com/' },
]
siteMap = JSON.parse(localStorage.getItem('siteMap')) || siteMap
console.log('siteMap:', siteMap)

/**
 * 遍历 siteMap，将数据渲染到页面中
 */
siteMap.forEach((value) => {
    insertNode(value.name, value.url)
})

/**
 * 新增网站
 */
$('.add-site').on('click', (e) => {
    e.preventDefault()

    let url = prompt('请输入网址，如: baidu.com')
    if (!url) return
    if (url.indexOf('http') !== 0) {
        url = 'https://' + url
    }
    console.log(url)
    // let name = url.replace('https://', '').replace('http://', '').replace('www.', '')
    let name = simpleUrl(url)
    insertNode(name, url)

    // 将新增的网站数据 push 到 siteMap 中，并将 siteMap 存到 localStorage
    siteMap.push({ name, url })
    localStorage.setItem('siteMap', JSON.stringify(siteMap))
})

/**
 * 将加载失败的 favicon 替换成网站 url 首字母
 */
let $favicon = $('li img')
Array.from($favicon).forEach((value) => {
    value.onerror = (e) => {
        let $p = $(`<p>${simpleUrl(value.src)[0].toUpperCase()}</p>`)
        $p.replaceAll($(value))
    }
})

/**
 * 删除指定网址
 */
$('.site-list > li:not(:last-child) svg').on('click', (e) => {
    e.preventDefault()

    let li = $(e.target).parent().parent()[0]
    if (li.nodeName !== 'LI') {
        li = $(e.target).parent().parent().parent()[0]
    }
    console.log(li)

    // 提示是否删除
    const text = $(li).find('span').text()
    const sure = confirm(`确定要删除 ${text} 吗？`)
    if (!sure) return

    // 将删除之后的数据更新到 localStorage
    siteMap.splice($(li).index(), 1)
    localStorage.setItem('siteMap', JSON.stringify(siteMap))

    $(li).remove()
})

/**
 * 监听键盘事件，跳转到对应网站
 */
$(document).on('keypress', (e) => {
    console.log(e.key)
    const { key } = e
    siteMap.forEach((value) => {
        if (value.name[0] === key.toLowerCase()) {
            location.href = value.url
        }
    })
})










/**
 * 向 .site-list 中插入节点
 * @param {String} name 网站名称
 * @param {String} url 网址
 */
function insertNode(name, url) {
    let $li = $(`<li>
            <a href="${url}/">
                <img src="${url}/favicon.ico" alt="logo">
                <span>${simpleUrl(name)}</span>
                <svg class="icon" aria-hidden="true" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <use xlink:href="#icon-close"></use>
                </svg>
            </a>
        </li>`)
    $li.insertBefore($('.site-list > li:last-child'))
}

/**
 * 简化 url
 * @param {String} url 链接
 * @returns 简化后的 url
 */
function simpleUrl(url) {
    return url.replace('https://', '')
              .replace('http://', '')
              .replace('www.', '')
              .replace(/\/.*/, '')
}