import RestHelper from './RestHelper'

export default RestHelper.publish({
  issues: {
    list: {
      method: 'get',
      uri: '/issueList'
    }
  },
  issueOptions: {
    get: {
      method: 'get',
      uri: '/appId/{appId}/platformId/{platformId}/selInfos'
    }
  },

  issue: {
    getCrashDetail: {
      method: 'get',
      uri: '/lastCrashInfo/appId/{appId}/platformId/{pid}/issues/{issueId}'
    },
    lastCrashDetail: {
      method: 'get',
      uri: '/lastCrashInfo/appId/{appId}/platformId/{pid}/issues/{issueId}'
    }
  },

  issueInfo: {
    getIssueInfo: {
      method: 'get',
      uri: '/issueInfo/appId/{appId}/platformId/{pid}/issueId/{issueId}/exceptionTypeList/{exceptionTypeList}'
    }
  },

  lastCrashDoc: {
    getLastCrashDoc: {
      method: 'get',
      uri: '/crashDoc/appId/{appId}/platformId/{pid}/crashHash/{crashHash}'
    }
  },

  crashAttachment: {
    getCrashAttachment: {
      method: 'get',
      uri: '/appDetailCrash/appId/{appId}/platformId/{pid}/crashHash/{crashHash}'
    }
  },

  appDetailOs: {
    get: {
      method: 'get',
      uri: '/appDetailOs/appId/{appId}/platformId/{pid}/issueId/{issueId}'
    }
  },

  appDetailModel: {
    get: {
      method: 'get',
      uri: '/appDetailModel/appId/{appId}/platformId/{pid}/issueId/{issueId}'
    }
  },

  //查看版本信息
  issueVersion: {
    get: {
      method: 'get',
      uri: '/issueVersion/appId/{appId}/platformId/{pid}/issueId/{issueId}'
    }
  },

  //查看设备信息的占比
  resourceRadio: {
    get: {
      method: 'get',
      uri: '/phoneResource/appId/{appId}/platformId/{pid}/issueId/{issueId}'
    }
  },

  noteList: {
    get: {
      method: 'get',
      uri: '/noteList/appId/{appId}/platformId/{pid}/issueId/{issueId}'
    },
    add : {
      method: 'post',
      uri: '/addIssueNote'
    }
  },

  shortUrl: {
    get: {
      method: 'get',
      uri: '/shortUrl/appId/{appId}/platformId/{pid}/issueId/{issueId}/category/{category}'
    }
  },

  tag: {
    add: {
      method: 'post',
      uri: '/addTag'
    },
    del: {
      method: 'get',
      uri: '/deleteTag/appId/{appId}/platformId/{pid}/issueId/{issueId}/tagId/{tagId}'
    }
  }


})