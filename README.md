transmission-limit-by-tracker  
====  

根据 tracker 类型批量设置 transmission 单种速率和队列优先级的小脚本



## 使用

```bash
npm install
```

### 配置 `config.js`

如果 `speed_limits` 配置为：

```javascript
[
    {keyword: '', upload: 10240},
    {keyword: 'tracker.a.com', download: 20480, upload: 10240},
    {keyword: 'tracker.b.com', download: 10240},
]
```

将会先对所有种子限制上传速率为 10240KBps ，然后过滤出 trackers 里包含字符串 `tracker.a.com` 的种子，限制其下载速率为 20480KBps 、上传速率为 10240KBps ，最后限制 `tracker.b.com` 的种子下载速率为 10240KBps .

- 限速规则按照设置的顺序依次执行
- keyword 为空字符串代表对所有的种子应用规则
- 注意匹配规则的顺序，`{keyword: '', upload: 10240}` 写在第一条规则和写在最后一条规则，效果完全不同



如果队列首尾（下载优先级）配置为：

```javascript
queue_head: ['tracker.a.com', 'tracker.b.com', 'tracker.c.com'],
queue_tail: ['tracker.d.com', 'tracker.e.com']
```

那么下载顺序依次为：

`tracker.a.com` , `tracker.b.com` , `tracker.c.com` ,  `其他种子` , `tracker.d.com` , `tracker.e.com` 

### 运行

```bash
npm start
```

日志会输出在控制台，并保存至 `info.log` 和 `error.log`



---