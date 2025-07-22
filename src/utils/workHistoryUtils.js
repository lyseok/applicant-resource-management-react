// 작업 타입 상수
export const WORK_TYPES = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  STATUS_CHANGE: 'STATUS_CHANGE',
  PROGRESS_UPDATE: 'PROGRESS_UPDATE',
  ASSIGN: 'ASSIGN',
};

// 작업 테이블 상수
export const WORK_TABLES = {
  TASK: 'TASK',
  PROJECT: 'PROJECT',
  POST: 'POST',
  COMMENT: 'COMMENT',
};

// 상태 코드를 한글명으로 변환
export const getStatusLabel = (statusCode) => {
  const statusMap = {
    'PEND-001': '할 일',
    'PEND-002': '진행 중',
    'PEND-003': '완료',
    'PEND-004': '보류',
    'PEND-005': '취소',
  };
  return statusMap[statusCode] || statusCode;
};

// 작업 내용 텍스트 생성
export const generateWorkContent = (
  workType,
  workTable,
  targetName,
  options = {}
) => {
  const { oldValue, newValue, assigneeName } = options;

  switch (workType) {
    case WORK_TYPES.CREATE:
      return `새로운 ${getTableLabel(
        workTable
      )} '${targetName}'을(를) 생성했습니다.`;

    case WORK_TYPES.UPDATE:
      return `${getTableLabel(workTable)} '${targetName}'을(를) 수정했습니다.`;

    case WORK_TYPES.DELETE:
      return `${getTableLabel(workTable)} '${targetName}'을(를) 삭제했습니다.`;

    case WORK_TYPES.STATUS_CHANGE:
      return `'${targetName}' 작업의 상태를 '${getStatusLabel(
        oldValue
      )}'에서 '${getStatusLabel(newValue)}'로 변경했습니다.`;

    case WORK_TYPES.PROGRESS_UPDATE:
      return `'${targetName}' 작업의 진척도를 ${oldValue}%에서 ${newValue}%로 업데이트했습니다.`;

    case WORK_TYPES.ASSIGN:
      if (assigneeName) {
        return `'${targetName}' 작업을 ${assigneeName}님에게 할당했습니다.`;
      } else {
        return `'${targetName}' 작업의 담당자 할당을 해제했습니다.`;
      }

    default:
      return `${getTableLabel(
        workTable
      )} '${targetName}'에 대한 작업을 수행했습니다.`;
  }
};

// 테이블명을 한글로 변환
const getTableLabel = (workTable) => {
  const tableMap = {
    [WORK_TABLES.TASK]: '작업',
    [WORK_TABLES.PROJECT]: '프로젝트',
    [WORK_TABLES.POST]: '게시글',
    [WORK_TABLES.COMMENT]: '댓글',
  };
  return tableMap[workTable] || '항목';
};

// 작업 타입별 아이콘 반환
export const getWorkTypeIcon = (workType) => {
  const iconMap = {
    [WORK_TYPES.CREATE]: 'Plus',
    [WORK_TYPES.UPDATE]: 'Edit',
    [WORK_TYPES.DELETE]: 'Trash2',
    [WORK_TYPES.STATUS_CHANGE]: 'ArrowRight',
    [WORK_TYPES.PROGRESS_UPDATE]: 'TrendingUp',
    [WORK_TYPES.ASSIGN]: 'User',
  };
  return iconMap[workType] || 'Activity';
};

// 작업 타입별 색상 반환
export const getWorkTypeColor = (workType) => {
  const colorMap = {
    [WORK_TYPES.CREATE]: 'text-green-600 bg-green-100',
    [WORK_TYPES.UPDATE]: 'text-blue-600 bg-blue-100',
    [WORK_TYPES.DELETE]: 'text-red-600 bg-red-100',
    [WORK_TYPES.STATUS_CHANGE]: 'text-purple-600 bg-purple-100',
    [WORK_TYPES.PROGRESS_UPDATE]: 'text-orange-600 bg-orange-100',
    [WORK_TYPES.ASSIGN]: 'text-indigo-600 bg-indigo-100',
  };
  return colorMap[workType] || 'text-gray-600 bg-gray-100';
};

// 상대적 시간 표시
export const getRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return '방금 전';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}분 전`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}시간 전`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
};
