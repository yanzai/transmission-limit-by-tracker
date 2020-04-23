const config = {
  transmission: {
    host: '1.2.3.4',
    port: 9091,
    username: '',
    password: '',
    ssl: false,
    url: '/transmission/rpc'
  },
  /**
   * [keyword] substring of a tracker's url, used to filter trackers
   * [download] max download speed (KBps)
   * [upload] max upload speed (KBps)
   *
   * the speed limit rules will be executed one by one according to your set order;
   * if keyword is an empty string, all torrents will be set to this speed limit rule.
   * (because any string includes empty string)
   */
  speed_limits: [
    {keyword: '', upload: 10240},
    {keyword: 'tracker.a.com', download: 20480, upload: 10240},
    {keyword: 'tracker.b.com', download: 10240},
  ],
  queue_head: ['tracker.a.com', 'tracker.b.com', 'tracker.c.com'],
  queue_tail: ['tracker.d.com', 'tracker.e.com']
}

module.exports = config;