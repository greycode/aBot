


var db = null;
const DB_VERSION = 1;
const BOOK_INTERVAL = 50;
const TAG_INTERVAL = 1500;
var stopRequest = false;
var stopQueryInfo = true;
<<<<<<< HEAD
var SEARCH_TYPE = "";
=======
var searchType = '';
>>>>>>> 479bc14207e0c2d7b0e57530489a6dd7b04794ee

(function () {

    if (location.host.startsWith('book')) {
        db = new Dexie("douban_book");
        if (db.verno < DB_VERSION) {
            db.version(DB_VERSION).stores({
                books: '++id,subjectId,title,subtitle,author,press',
                tasks: '++id,[type+value]',
                pages: '++id,taskId,value',
                doulist: '++id,subjectId,author'
            });
        }
        if (!db.isOpen()) db.open();

        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .nav-menu-bottom {
                position: fixed;
                bottom: 1em;
                right: 1em;
                z-index: 1000;
            }
            .nav-menu-bottom .nav-item {
                margin-top: 0.1em;
                font-size: 1.25em;
                display: block;
                padding: 0.25em 0.5em;
                background-color: #ddd;
                text-align: center;
            }
            input {padding: 2px;}
            `
        document.getElementsByTagName('head')[0].appendChild(style);

        var btnHtml = `
            <div id="nav-menu-bottom" class="nav-menu-bottom">
                <div class="nav-item" title="导入数据">
                    <input id="fileImport" type="file" value="导入数据">
                </div>
                <div  class="nav-item">
                    <input id="btnImport"  type="button" value="导入数据">
                    <input id="btnExport"  type="button" value="导出数据">
                </div>
                <div  class="nav-item">
                    <input id="btnGetTags"  type="button" value="标签综合">
                    <input id="btnGetNewTags"  type="button" value="标签最新">
                    <input id="btnGetNewBook"  type="button" value="新书速递">
                </div>
                <div  class="nav-item">
                    <input id="btnGetBooks"  type="button" value="随机爬取">
                    <input id="btnGetBooksBreadth"  type="button" value="广度爬取">
                    <input id="btnGetBooksDeep"  type="button" value="深度爬取">
                </div>
                <div id="bookInfo" class="nav-item" title="图书统计" style="">
                    <span id="booksIsDone">0</span>
                    <span > / </span>
                    <span id="booksTotal">0</span>
                </div>
            </div>
            `
        $(btnHtml).appendTo('body')
        $('#btnGetTags').click(function () { processDoubanTagsAndBooks() })
        $('#btnGetBooks').click(function () {
            if ($(this).get(0).disabled) return
            $(this).get(0).disabled = true
            processDoubanBook()
        })
        $('#btnGetNewTags').click(function () {
            searchType = '&type=R'
        })
        $('#btnGetBooksBreadth').click(function () {
            if ($(this).get(0).disabled) return
            $(this).get(0).disabled = true
            processDoubanBookBreadth()
        })
        $('#btnGetBooksDeep').click(function () {
            if ($(this).get(0).disabled) return
            $(this).get(0).disabled = true
            processDoubanBookDeep()
        })

        $('#btnExport').click(exportDBData)
        $('#bookInfo').click(showBookInfo)
        $('#btnImport').click(function () {
            var f = $('#fileImport').get(0)
            if (f.files.length < 1) return;
            var fileName = f.files[0].name
            if (!fileName.toLowerCase().endsWith('.json')) return;

            var reader = new FileReader();
            reader.onloadend = () => {
                try {
                    var data = JSON.parse(reader.result)
                    if (fileName.indexOf('books') > -1) {
                        db.books.bulkAdd(data)
                    }
                    else if (fileName.indexOf('tasks') > -1) {
                        db.tasks.bulkAdd(data)
                    }
                    else if (fileName.indexOf('pages') > -1) {
                        db.pages.bulkAdd(data)
                    }
                    else if (fileName.indexOf('doulist') > -1) {
                        db.doulist.bulkAdd(data)
                    }
                } catch (e) {
                    console.error('解析导入文件出错：' + e)
                }
            }
            reader.readAsText(f.files[0])
        })
        //processDoubanBook()
    }

    console.info("a robot 加载完成 👽");
    setInterval(console.clear, 180e3)
<<<<<<< HEAD
    setInterval(showBookInfo, 60e3)
})()

function showBookInfo() {
=======
    setInterval(showBooksInfo, 60e3)
})()

function showBooksInfo() {
>>>>>>> 479bc14207e0c2d7b0e57530489a6dd7b04794ee
    db.books.count(x => $('#booksTotal').text(x))
    db.books.filter(x => x.isDone && !x.notFound).count(x => $('#booksIsDone').text(x))
}

function getBooksNumInfo() {
    if (stopQueryInfo) return;
<<<<<<< HEAD
    showBookInfo()
=======
    showBooksInfo()
>>>>>>> 479bc14207e0c2d7b0e57530489a6dd7b04794ee
}

function randomRange(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

function exportDBData() {
    db.tasks.toArray(x => downloadData(x, 'tasks.json'))
    db.pages.toArray(x => downloadData(x, 'pages.json'))
    // var b = []
    // db.books.filter( x => x.id < 90000).toArray( x => x.forEach(e => b.push(e)))
    db.books.toArray(x => downloadData(x, 'books.json'))
    db.doulist.toArray(x => downloadData(x, 'doulist.json'))
}

function downloadData(obj, file) {
    var blob = new Blob([JSON.stringify(obj)])
    var downloadUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file || "data.json";
    document.body.appendChild(a);
    a.click();
}

function processDoubanTagsAndBooks() {
    if (stopRequest) return;
    db.tasks.count().then(count => {
        if (count < 50) {
            $.ajax({ url: 'https://book.douban.com/tag/', type: 'GET' })
                .done(resp => {
                    $('.tagCol a', $(resp)).each(function () {
                        if ($(this).attr('href').startsWith('/tag/')) {
                            db.tasks.add({ type: 'tag', value: $(this).text(), isDone: false }).then(x => {
                                for (var i = 0; i < 50; i++) {
                                    db.pages.add({ taskId: x, value: i, isDone: false })
                                }
                            })
                        }
                    })
                })
                .then(() => processDoubanBookTask())
        } else {
            processDoubanBookTask()
        }
    })

}

function processDoubanBookTask() {
    if (stopRequest) return;
    db.tasks.filter(x => !x.isDone).first().then(processCurrentTask)
}

var SHOULD_COUNT_DUPL = false
var duplBooks = 0
var curTagIsDone = {}
var curTagName = ''
const MAX_DUPL_BOOKS = 20
function resetAndRestartProcessNew() {
    db.tasks.toArray().then(ts => {
        ts.forEach(e => e.isNew = false)
        db.tasks.bulkPut(ts).then(() => {
            db.pages.toArray().then(ps => {
                ps.forEach(e => e.isNew = false)
                db.pages.bulkPut(ps).then(() => {
                    stopRequest = false
                    SHOULD_COUNT_DUPL = true
                    processDoubanBookTaskNew()
                })
            })
        })
    })

}

function processDoubanBookTaskNew() {
    if (stopRequest) return;
    SEARCH_TYPE = '&type=R'
    db.tasks.filter(task => !task.isNew && (SHOULD_COUNT_DUPL && !curTagIsDone[task.value])).first().then(task => {
        if (SHOULD_COUNT_DUPL) {
            duplBooks = 0
            curTagIsDone[task.value] = false
            curTagName = task.value
        }
        processCurrentTaskNew(task)
    })
}

function processDoubanBook() {
    if (stopRequest) return;

    var max = ($('#booksTotal').text() - $('#booksIsDone').text()) || 30;
    var offset = randomRange(0, max - 1)
    db.books.filter(x => !x.isDone).offset(offset).first().then(b => {
        processBookDetailPage(b, processDoubanBook)
    })
}

function processDoubanBookBreadth() {
    if (stopRequest) return;
    db.books.filter(x => !x.isDone).first().then(b => {
        processBookDetailPage(b, processDoubanBookBreadth)
    })
}

var buffer = []
var bookBuffer = []
var recBookBuffer = []
var douListBuffer = []
var useBuffer = false
const BOOK_BUFFER_SIZE = 100
var bufferCount = 0
var bufferStartTime = null
function processDoubanBookBreadthBuffer() {
    if (stopRequest) return;
    useBuffer = true
    bufferStartTime = new Date()

    if (buffer.length < 1) {
        if (bookBuffer.length > 0) {
            recBookBuffer.forEach(e => {
                db.books
                    .where('subjectId')
                    .equals(e.subjectId)
                    .first(c => {
                        if (!c) {
                            db.books.add(e)
                        }
                    })
            })

            douListBuffer.forEach(x => {
                db.doulist
                    .where('subjectId')
                    .equals(x.subjectId)
                    .first(c => {
                        if (!c) {
                            db.doulist.add(x)
                        }
                    })
            })

            db.books.bulkPut(bookBuffer).then(() => {
                console.info('批量增加 ' + bookBuffer.length + ' 本图书!')
                bufferCount += bookBuffer.length
                var costTime = (new Date() - bufferStartTime) / 60e3
                console.info('平均每分钟新增 ' + bufferCount / costTime + ' 本图书!')

                bookBuffer = []
                douListBuffer = []
                recBookBuffer = []
                db.books.filter(x => !x.isDone).limit(BOOK_BUFFER_SIZE).toArray(x => {
                    x.forEach(e => buffer.push(e))
                    processBookDetailPage(buffer.pop(), processDoubanBookBreadthBuffer)
                })
            })
        } else {
            db.books.filter(x => !x.isDone).limit(BOOK_BUFFER_SIZE).toArray(x => {
                x.forEach(e => buffer.push(e))
                processBookDetailPage(buffer.pop(), processDoubanBookBreadthBuffer)
            })
        }

    } else {
        processBookDetailPage(buffer.pop(), processDoubanBookBreadthBuffer)
    }

}

function processDoubanBookDeep() {
    if (stopRequest) return;
    db.books.filter(x => !x.isDone).last().then(b => {
        processBookDetailPage(b, processDoubanBookDeep)
    })
}

function processCurrentTask(t) {
    if (stopRequest) return;
    db.pages
        .where('taskId')
        .equals(t.id)
        .filter(x => x.isDone == false)
        .sortBy('value')
        .then(x => {
            if (x && x.length > 0) {
                var p = x[0]
                if (p.isDone) return;
                // TODO 处理该tag下该页面的内容
                processBookTagListPage(t.value, p.value * 20, () => {
                    db.pages.update(p.id, { isDone: true }).then(() => {
                        console.info('Tag[' + t.value + '] at page ' + p.value + ' is done!')
                        getBooksNumInfo()
                        processCurrentTask(t)
                    })
                })
            } else {
                db.tasks
                    .update(t.id, { isDone: true })
                    .then(processDoubanBookTask)
            }
        })

}

function processCurrentTaskNew(t) {
    if (stopRequest) return;
    if (SHOULD_COUNT_DUPL && curTagIsDone[t.value]) {
        processDoubanBookTaskNew()
        return
    }
    db.pages
        .where('taskId')
        .equals(t.id)
        .filter(x => !x.isNew)
        .sortBy('value')
        .then(x => {
            if (x && x.length > 0) {
                var p = x[0]
                if (p.isNew) return;
                // TODO 处理该tag下该页面的内容
                processBookTagListPage(t.value, p.value * 20, () => {
                    db.pages.update(p.id, { isNew: true }).then(() => {
                        console.info('Tag[' + t.value + '] of New at page ' + p.value + ' is done!')
                        //getBooksNumInfo()
                        processCurrentTaskNew(t)
                    })
                })
            } else {
                db.tasks
                    .update(t.id, { isNew: true })
                    .then(processDoubanBookTaskNew)
            }
        })

}

function processBookTagListPage(tag, page, callBack) {
    if (stopRequest) return;
    if (SHOULD_COUNT_DUPL) curTag = tag
    setTimeout(() => {
        try {
<<<<<<< HEAD
            $.ajax({ url: 'https://book.douban.com/tag/' + tag + '?start=' + page + SEARCH_TYPE, type: 'GET' })
=======
            $.ajax({ url: 'https://book.douban.com/tag/' + tag + '?start=' + page + searchType, type: 'GET' })
>>>>>>> 479bc14207e0c2d7b0e57530489a6dd7b04794ee
                .done(resp => {
                    parseBookTagListPage($(resp), callBack)
                })
                .fail(() => {
                    stopRequest = true
                    console.error("    获取标签" + tag + "下的图书列表 第 " + page + " 页失败")
                });
        } catch (e) {
            stopRequest = true
            console.error("    获取标签" + tag + "下的图书列表 第 " + page + " 页失败")
        }
    }, TAG_INTERVAL)

}

function parseBookTagListPage(html, callBack) {
    $('.subject-list .subject-item', html).each(function () {
        var info = $('.info h2 a', this)
        var pic = $('.pic img', this).attr('src')
        var v = info.attr('href');
        var t = info.attr('title').trim();
        var st = $('.info h2 a span', this).text().replace(':', '').trim();
        var id = v.substring(v.lastIndexOf('subject/') + 8).replace('/', '');
        var book = {
            subjectId: id,
            title: t,
            subtitle: st,
            doubanRef: v,
            thumbnail: pic
        }
        // TODO 将标签页中的内容存储起来，考虑书已经添加的情况
        db.books
            .where('subjectId')
            .equals(id)
            .first(c => {
                if (c) {
                    if (SHOULD_COUNT_DUPL && duplBooks++ > MAX_DUPL_BOOKS) {
                        curTagIsDone[curTagName] = true
                    }
                    db.books.update(c.id, book)
                } else {
                    book.isDone = false
                    db.books.add(book)
                }
            })

        // bl[id] = {'id': id,'link':v,'title':t}
    })
    if (callBack) callBack()
}

function processBookDetailPage(b, caller) {
    if (!b || stopRequest) return;

    setTimeout(() => {
        try {
            $.ajax({ url: b.doubanRef, type: 'GET' })
                .done(resp => {
                    if (caller && caller == processDoubanBook) caller()

                    parseBookDetailPage($(resp), b, () => {
                        if (caller && caller != processDoubanBook) caller()
                        getBooksNumInfo()
                        console.info("《" + b.title + '》 is Done!')
                    })
                })
                .fail(function (x) {
                    if (x && x.status == 404) {
                        if (useBuffer) {
                            b.isDone = true
                            b.notFound = true
                            bookBuffer.push(b)
                        } else {
                            db.books.update(b.id, { isDone: true, notFound: true })
                        }
                    }
                    markError(b, caller)
                });
        } catch (e) {
            markError(b, caller)
        }
    }, BOOK_INTERVAL)
}

var errorCount = 0
function markError(b, caller) {
    errorCount++
    if (errorCount > 50) {
        stopRequest = true
        $('#btnGetBooks').val('爬取图书')
        $('#btnGetTags').get(0).disabled = false
    }
    console.error("    获取图书详情页  " + b.subjectId + " 失败")
    if (caller) {
        caller()
    } else {
        processDoubanBook();
    }
}

function parseBookDetailPage(html, b, callBack) {
    var book = getBookBaseInfo(html)
    book.id = b.id
    book.mainPic = $('#mainpic img', html).attr('src')
    var t = $('#dale_book_subject_top_icon', html).next().text().trim()
    if (t) book.title = t
    book.rating = $('.rating_num', html).text().trim()
    book.ratingPeople = $('.rating_people > span', html).text().trim()

    var contentIntro = ''
    var authorIntro = ''

    $('.related_info h2', html).each(function () {
        var text = $('span', $(this)).text()
        if (text.indexOf('内容简介') > -1) {
            var ctx = $(this).next()
            contentIntro = getIntroFromHtml($('.intro:last', ctx).html())
        }
        else if (text.indexOf('作者简介') > -1) {
            var ctx = $(this).next()
            authorIntro = getIntroFromHtml($('.intro:last', ctx).html())
        }
    })

    book.recBooks = []
    $('#db-rec-section dl > dd > a', html).each(function () {
        var _book = {}
        _book.doubanRef = $(this).attr('href')
        _book.title = $(this).text().trim()
        _book.subjectId = getSubjectIdFromRef(_book.doubanRef)
        _book.isDone = false
        book.recBooks.push(_book)
    })

    book.doulist = []
    $('#db-doulist-section li > a', html).each(function () {
        var _doulist = {}
        _doulist.title = $(this).text()
        _doulist.href = $(this).attr('href')
        _doulist.author = $(this).next().text().replace(/\(|\)/g, '')
        _doulist.subjectId = _doulist.href.substring(_doulist.href.indexOf('doulist') + 7).replace(/\//g, '').trim()
        book.doulist.push(_doulist)
    })

    if (useBuffer) {
        book.recBooks.forEach(e => {
            recBookBuffer.push(e)
        })
        book.doulist.forEach(e => {
            douListBuffer.push(e)
        })
    } else {
        // 将相关图书加入库中
        book.recBooks.forEach(e => {
            db.books
                .where('subjectId')
                .equals(e.subjectId)
                .first(c => {
                    if (!c) {
                        db.books.add(e)
                    }
                })
        })

        book.doulist.forEach(x => {
            db.doulist
                .where('subjectId')
                .equals(x.subjectId)
                .first(c => {
                    if (!c) {
                        db.doulist.add(x)
                    }
                })
        })
    }

    book.comments = []
    $('#comment-list-wrapper > .comment-list.hot .comment-item', html).each(function () {
        var _comment = {}
        _comment.user = $('.comment-info > a', this).text()
        _comment.rating = $('.comment-info > .user-stars', this).attr('title')
        _comment.content = $('.comment-content', this).text()

        if (_comment.user)
            book.comments.push(_comment)
    })

    book.tags = []
    $('#db-tags-section .tag', html).each(function () {
        book.tags.push($(this).text())
    })

    $('#collector > p.pl > a', html).each(function () {
        var t = $(this).text();
        if (t.indexOf('想读') > -1) {
            book.readerWishes = t.substring(0, t.indexOf('人想读'))
        }
        else if (t.indexOf('在读') > -1) {
            book.readerDoings = t.substring(0, t.indexOf('人在读'))
        }
        else if (t.indexOf('读过') > -1) {
            book.readerReaded = t.substring(0, t.indexOf('人读过'))
        }
    })

    book.isDone = true
    if (useBuffer) {
        bookBuffer.push(book)
        if (callBack) callBack()
    } else {
        db.books.update(b.id, book).then(() => { if (callBack) callBack() })
    }

}

function getIntroFromHtml(html) {
    return html.trim().replace(/\s*<p>/g, '').replace(/<\/p>/g, '\n')
}

function getSubjectIdFromRef(s) {
    return s.substring(s.indexOf('subject') + 7).replace(/\//g, '').trim()
}

function getBookBaseInfo(html) {
    var b = {}
    $('.subject #info span.pl', html).each(function () {
        var t = $(this).text()
        var nt = $(this).get(0).nextSibling.textContent.trim();
        var text = ''
        var href = ''

        if (nt == '' || nt == ':') {
            var a = $(this).next()
            if (a.get(0).tagName.toLowerCase() == 'a') {
                text = a.text().trim();
                href = a.attr('href')
            }
        } else {
            text = nt
        }

        if (t.indexOf('作者') > -1) {
            b.author = text.replace(/\s/g, '')
            b.authorRef = href
        }
        else if (t.indexOf('出版社') > -1) {
            b.press = text
        }
        else if (t.indexOf('副标题') > -1) {
            b.subtitle = text
        }
        else if (t.indexOf('原作') > -1) {
            b.original = text
        }
        else if (t.indexOf('译者') > -1) {
            b.translator = text
        }
        else if (t.indexOf('出版年') > -1 || t.indexOf('出版日') > -1) {
            b.pubdate = text
        }
        else if (t.indexOf('页数') > -1) {
            b.pagesize = text
        }
        else if (t.indexOf('定价') > -1) {
            b.price = text
        }
        else if (t.indexOf('丛书') > -1) {
            b.series = text
            b.seriesRef = href
        }
        else if (t.toLowerCase().indexOf('isbn') > -1) {
            b.isbn = text
        }
    })

    return b
}