// 우선순위 색상 클래스 반환
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'LOW':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// 상태 색상 클래스 반환
export const getStatusColor = (status) => {
  switch (status) {
    case 'TODO':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'IN_PROGRESS':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// 상태 레이블 반환
export const getStatusLabel = (status) => {
  switch (status) {
    case 'TODO':
      return '할 일';
    case 'IN_PROGRESS':
      return '진행 중';
    case 'COMPLETED':
      return '완료';
    default:
      return status;
  }
};

// 우선순위 레이블 반환
export const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'HIGH':
      return '높음';
    case 'MEDIUM':
      return '보통';
    case 'LOW':
      return '낮음';
    default:
      return priority;
  }
};
