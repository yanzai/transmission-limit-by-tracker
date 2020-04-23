const Tr = require('transmission');
const _ = require('lodash');
const config = require('./config');
const {info, error, log} = require('./logger')
const doing = msg => info(`【...】 ${msg}`)
const succ = msg => info(`【√】 ${msg}`)
const err = msg => error(`【×】 ${msg}`)

const default_fields = ['bandwidthPriority', 'downloadDir', 'downloadLimit', 'downloadLimited',
  'error', 'errorString', 'hashString', 'id', 'isFinished', 'name', 'peer-limit',
  'status', 'trackers', 'totalSize', 'torrentFile', 'uploadLimit', 'uploadLimited',
  'queuePosition'
  // 'trackerStats'
]
require('./exts');

const tr = new Tr(config.transmission);

const asyncSet = async (ids, options) => new Promise((resolve, reject) => {
  tr.set(ids, options, (e, arg) => e ? reject(e) : resolve(arg))
});

const asyncGetSomeFields = async (fields = default_fields) => new Promise((resolve, reject) => {
  tr.getSomeFields(fields, (e, arg) => e ? reject(e) : resolve(arg))
});

(async () => {
  doing(`开始获取所有种子信息`)
  let torrents, total_count;
  try {
    torrents = (await asyncGetSomeFields()).torrents
    total_count = _.size(torrents)
    succ(`共获取到 ${total_count} 个种子`)
  } catch (e) {
    err(`获取种子信息失败: ${e.toString()}`)
  }
  const {speed_limits: limits, queue_head: head, queue_tail: tail} = config
  if (!total_count) return err(`没有任何种子!`)

  const filterByTrackersKeyword =
    keyword => {
      const filtered = _.filter(torrents, it =>
        !_.isUndefined(
          _.find(
            _.get(it, 'trackers'), tracker_obj => _.includes(_.get(tracker_obj, 'announce'), keyword)
          )
        )
      )
      succ(`根据关键词 (${keyword}) 过滤出 ${_.size(filtered)} 个种子`)
      return filtered;
    }

  doing(`handling speed limits`)
  for (const limit of limits || []) {
    if (_.isString(limit.keyword)) {
      const matched_items = filterByTrackersKeyword(limit.keyword)
      const matched_ids = _.map(matched_items, it => it.id)
      const options = {};
      if (!_.isUndefined(limit.upload)) {
        options.uploadLimit = limit.upload;
        options.uploadLimited = true
      }
      if (!_.isUndefined(limit.download)) {
        options.downloadLimit = limit.download;
        options.downloadLimited = true
      }
      if (!_.isEmpty(matched_ids) && !_.isEmpty(options)) {
        try {
          await asyncSet(matched_ids, options)
          succ(`${_.size(matched_ids)}个符合 (${limit.keyword}) 的种子速率被设置为：${JSON.stringify(options)}`)
        } catch (e) {
          err(`设置种子速率失败: ${e.toString()}`)
        }
      }
    }
  }

  doing(`handling queue head`)
  for (const keyword of _.reverse(head) || []) {
    const matched_ids = _.map(filterByTrackersKeyword(keyword), it => it.id)
    if (!_.isEmpty(matched_ids)) {
      try {
        await asyncSet(matched_ids, {queuePosition: 0})
        succ(`${_.size(matched_ids)}个符合 (${keyword}) 的种子被移到队首`)
      } catch (e) {
        err(`设置种子到队首失败: ${e.toString()}`)
      }
    }
  }

  doing(`handling queue tail`)
  for (const keyword of tail || []) {
    const matched_ids = _.map(filterByTrackersKeyword(keyword), it => it.id)
    if (!_.isEmpty(matched_ids)) {
      try {
        // total_count - 1  is  ok !
        await asyncSet(matched_ids, {queuePosition: total_count + 100})
        succ(`${_.size(matched_ids)}个符合 (${keyword}) 的种子被移到队尾`)
      } catch (e) {
        err(`设置种子到队尾失败: ${e.toString()}`)
      }
    }
  }
})();

