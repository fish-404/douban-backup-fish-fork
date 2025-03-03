<details>
  <summary>Readme by bambooom （原开发者）</summary>
  ![sync-rss](https://github.com/bambooom/douban-backup/actions/workflows/sync-rss.js.yml/badge.svg)

  ## update notion database from csv

  在前一次导出后过了一段时间，在豆瓣上又有新的标记，但没有简单方法可以同步，又不想手动添加。
  终于等到了 notion public API 发布出来。

  如果在豆瓣上又重新执行油猴脚本（`export.user.js`）导出了一个更新的 csv 文件。
  其中大多数都已经在上一次导出到 notion database 中。少数（大约 80 个）新条目需要更新到 database 中。

  可以使用 `update-notion.js` 脚本，用最新的 csv 文件作为输入，跳过所有已经导入过的条目。
  针对新的条目，一一去从页面获取扩展信息，并更新到 notion 中。
  因为访问条目数比较少，所以不容易被禁 IP。

  <details>
    <summary>example of one row of douban export.user.js csv data</summary>
    <pre>
  {
    '标题': '无间双龙：这份爱，才是正义 / ウロボロス～この愛こそ正  義。',
    '个人评分': '5',
    '打分日期': '2015/03/21',
    '我的短评': '5星打的绝对不是剧情！为建国，为toma，为一众cast就  是如此任性ˊ_>ˋ(1 有用)',
    '上映日期': '2015/01/16',
    '制片国家': '日本',
    '条目链接': 'https://movie.douban.com/subject/25953663/'
  }
    </pre>
  </details>

  <details>
    <summary>example of notion database properties</summary>
    <pre>
  {
    '条目链接': {
      id: '=jBf',
        type: 'url',
          url: 'https://movie.douban.com/subject/26277363/'
    },
    'IMDb 链接': {
      id: '@ME}',
        type: 'url',
          url: 'https://www.imdb.com/title/tt5419278'
    },
    '主演': { id: 'X{lL', type: 'rich_text', rich_text: [[Object]] },
    '个人评分': {
      id: 'Z^ph',
      type: 'multi_select',
      multi_select: [ { id: 'FRXk', name: '5', color: 'pink' } ]
      // multi_select: [], // empty array if no value for rating
    },
    '打分日期': {
      id: 'e\\{[',
        type: 'date',
          date: { start: '2021-01-19', end: null }
    },
    '类型': {
      id: 'pzY>',
        type: 'multi_select',
          multi_select: [[Object], [Object]]
    },
    '海报': {
      id: 't@Fv',
      type: 'files',
      files: [
      {
        name: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524998570.jpg'
      }
    ]
    },
    '我的短评': { id: 'wG?R', type: 'rich_text', rich_text: [[Object]] },
    '上映年份': { id: 'xghA', type: 'number', number: 2016 },
    '导演': { id: 'y]UL', type: 'rich_text', rich_text: [[Object]] },
    '标题': { id: 'title', type: 'title', title: [[Object]] }
  }
    </pre>
  </details>



  ## sync database from douban rss
  通过上面的脚本可以一次性处理添加几十个条目，但终究需要手动隔一段时间去执行。
  我想到的能够自动同步豆瓣标记的方法就是通过 RSS，所幸豆瓣的 RSS 功能一直健在。

  以下是 RSS 数据解析之后的例子：

  <details>
    <summary>douban rss parsed example</summary>
    <pre>
  #竹子哟竹子#✨ 的收藏
  {
    creator: '#竹子哟竹子#✨',
    title: '想看白蛇传·情',
    link: 'http://movie.douban.com/subject/34825976/',
    pubDate: 'Mon, 31 May 2021 15:14:58 GMT',
    'dc:creator': '#竹子哟竹子#✨',
    content:
      `<table><tr> <td width="80px"><a href="https://movie.douban.com/subject/34825976/" title="白蛇传·情"> <img src="https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2645106865.webp" alt="白蛇传·情"></a></td> <td> <p>推荐: 很差/较差/还行/推荐/力荐</p> </td></tr></table>`,
    contentSnippet: '',
    guid: 'https://www.douban.com/people/MoNoMilky/interests/2898270366',
    isoDate: '2021-05-31T15:14:58.000Z'
  }
  {
    creator: '#竹子哟竹子#✨',
    title: '想看大宋提刑官',
    link: 'http://movie.douban.com/subject/2239292/',
    pubDate: 'Mon, 31 May 2021 15:12:13 GMT',
    'dc:creator': '#竹子哟竹子#✨',
    content: '\n' +
      '\n' +
      '    <table><tr>\n' +
      '    <td width="80px"><a href="https://movie.douban.com/subject/2239292/" title="大宋提刑官">\n' +
      '    <img src="https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2397544089.jpg" alt="大宋提刑官"></a></td>\n' +
      '    <td>\n' +
      '<p>推荐: 还行</p><p>备注: 测试
      短评第 2 行</p>'
      '    </td></tr></table>\n',
    contentSnippet: '推荐: 还行\n备注: 测试\n短评第 2 行',
    guid: 'https://www.douban.com/people/MoNoMilky/interests/2898265663',
    isoDate: '2021-05-31T15:12:13.000Z'
  }
    </pre>
  </details>

  RSS 的好处一个是轻量，但又包含了个人标记的最重要的几个数据：名字、条目链接、时间、评分、短评。
  所以需求可以转换为，定时获取 RSS 更新，并对新的条目进行抓取信息并同步到 notion database。

  由此完成了 `sync-rss.js` 脚本工具，即获取 RSS 数据，对新加入的条目进行抓取信息，处理后添加到对应的 notion database 中即可。

  这个脚本只要能定时自己跑就可以自动从豆瓣标记去更新 notion 了！

  需要一个能跑 cron job 的服务即可，贫穷又很懒的我在想过一圈之后，发现 GitHub Actions 可以跑 [scheduled workflow](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#schedule), 完美满足需求。

  经过一番查找文档，设定好了 [sync-rss workflow](./.github/workflows/sync-rss.js.yml)。此处我的 schedule 是 "Runs every 6 hours"，也就是一天也只运行 4 次。

  但需要考虑的是，豆瓣的 RSS 数据每次都只保留 10 个，并且包括想看、想听、想读。本人仅处理看过、听过、读过的条目，所以如果某一天集中标记数量过多，可能使 RSS 数据并未全部被 workflow 获取。
  也在考虑改成 每小时或者每两个小时跑一次。

  另，GitHub 免费用户的开源仓库，actions 暂时是完全免费，也不计时间。

  [查看 workflow 运行结果 ->](https://github.com/bambooom/douban-backup/actions/workflows/sync-rss.js.yml)


  ## todo
  - 补全 notion 中的海报
  - 添加 *在\** 或者 *想\** 列表，考虑一下如何显示？
  - userscript 添加导出 在* 和 想* 的功能
</details>

<details>
  <summary>Readme by fish-404</summary>
  
  # 备忘

  * 暂时禁用 auto run action，依然可以手动运行 (`sync-rss.js.yml`)
  * `npm run dev` -  本地调试可使用 `example.rss` 文件进行调试 (或会新增更多的配置项)
  * `npm run start` - 实际获取豆瓣链接，即原脚本功能
  * `npm run test` - 用于测试部分接口功能（只写了简单的几个测试，仍需重新规划）

  # 更改中的代码结构说明

  将一条标记视为一个 Record，一个条目视为一个 Item，两者本身应该是互相独立的关系，用户标记行为是 Record 行为，status 从想读，在读到读过。一个书影音游剧目是单独的一个对象，对于整个 douban 或者不同用户可能对这个 Item 的信息需求是不同的。用户数据库记录的是用户所需要的 Item 属性信息。相当于用户标记了 Item id，再从 Item Id 获取用户想要记录的 Item 元数据。

  Notion 相当于一个存储用户需要的信息数据库，相当于关联了 Item 和 Record 的 View。

  以关系型数据库的结构来看，相当于一个 Record 表和一个 Item 表通过 Item id 关联构成用户记录 View。

  # 声明

  example.rss 中的数据为本人曾用账号（昵称：在逃的貓, fish-404），现已注销，但 Rss 源疑似仍可用，如其他人后来使用了该域名，与本人无关。
  
  理论上，**任何人** 可设置此脚本并同步 rss 源数据至私有 Notion 账户，即非豆瓣用户（与是否注册豆瓣和是否关注无关）均可能通过此脚本订阅 **任一** 豆瓣用户的书影音状态（设置不公开的状态除外，此处的不公开并非同步到广播，设置不公开的状态非 **账户登录人** 无法查看，并且不会同步到 rss 源，但同时 **账户登录人** 也将无法通过此脚本的方式同步个人的非公开书影音状态）。
</detials>