import {EXCEPTION_TYPE_LIST} from 'utils/constants'

//根据level，关键字，是否ide格式处理log
export function handleLog(lines, logLevel, keyWord, isIde) {
  //获得每行level数组,level最低是0(verbose)
  let levels = lines.map(line => {
    let words = line.split(/\s+/);
    if (words.length >= 5) {
      switch (words[4]) {
        case "V":
          return {
            line,
            level: 0
          };
        case "D":
          return {
            line,
            level: 1
          };
        case "I":
          return {
            line,
            level: 2
          };
        case "W":
          return {
            line,
            level: 3
          };;
        case "E":
          return {
            line,
            level: 4
          };;
        default:
          return {
            line,
            level: 0
          };;
      }
    } else {
      return {
        line,
        level: 0
      };
    }
  });

  //根据logLevel筛选log
  let curLevel = 0;
  switch (logLevel) {
    case "verbose":
      curLevel = 0;
      break;
    case "debug":
      curLevel = 1;
      break;
    case "info":
      curLevel = 2;
      break;
    case "warn":
      curLevel = 3;
      break;
    case "error":
      curLevel = 4;
      break;
    default:
      curLevel = 0;
  }

  //处理keyword
  if (keyWord) {
    keyWord = keyWord.toLowerCase().trim();
  } else {
    keyWord = '';
  }

  levels = levels.filter(level => {
    let filterLevel = true;
    if (isIde) {
      filterLevel = level.level >= curLevel;
    } else {
      filterLevel = level.level == curLevel;
    }
    let filterKeyword = true;
    if (keyWord.length > 0 && level.line.toLowerCase().indexOf(keyWord) == -1) {
      filterKeyword = false;
    }
    return filterKeyword && filterLevel;
  });
  return levels;
}

/**
 *  判断当前路由是否是异常处理的路由
 */
export function isExceptionRoute(exceptionType) {
  return Object.keys(EXCEPTION_TYPE_LIST).indexOf(exceptionType) !== -1;
}