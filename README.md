# aBot

## 如何使用

下载后打开Chrome扩展配置页面

```
chrome://extensions/
```

如下图所示做好配置：

<img width="869" alt="2017-04-20_20-35-31" src="https://cloud.githubusercontent.com/assets/3759819/25231275/ddd3e438-2609-11e7-9cbc-f745ca389e61.png">


## 豆瓣图书
> 使用扩展爬取豆瓣图书信息只是作为一个实验，实际上这并不是一个高效爬虫的实现

进入豆瓣读书页面 `https://book.douban.com/` 可以看到右下角部分功能按钮：

<img width="1072" alt="2017-04-20_20-48-48" src="https://cloud.githubusercontent.com/assets/3759819/25231557/df2bde0c-260a-11e7-9c61-219bd7e3a6f0.png">

### 操作说明

- 选择文件 选择需要导入的数据文件，然后点击【导入数据】
- 导出数据 用于把抓取的数据导出来
- 提取标签 第一次使用需要先根据标签提取部分图书作为根，后续的抓取会根据这部分图书进行广度或深度搜索
- 爬取图书 进行图书的爬取

