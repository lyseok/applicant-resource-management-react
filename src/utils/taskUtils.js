// 우선순위 색상 클래스 반환
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'PCOD001': // HIGH
    case 'HIGH':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'PCOD002': // MEDIUM
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'PCOD003': // LOW
    case 'LOW':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// 상태 색상 클래스 반환
export const getStatusColor = (status) => {
  switch (status) {
    case 'PEND-001': // TODO
    case 'TODO':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'PEND-002': // IN_PROGRESS
    case 'IN_PROGRESS':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'PEND-003': // COMPLETED
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// 상태 레이블 반환
export const getStatusLabel = (status) => {
  switch (status) {
    case 'PEND-001':
    case 'TODO':
      return '할 일';
    case 'PEND-002':
    case 'IN_PROGRESS':
      return '진행 중';
    case 'PEND-003':
    case 'COMPLETED':
      return '완료';
    default:
      return status;
  }
};

// 우선순위 레이블 반환
export const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'PCOD001':
    case 'HIGH':
      return '높음';
    case 'PCOD002':
    case 'MEDIUM':
      return '보통';
    case 'PCOD003':
    case 'LOW':
      return '낮음';
    default:
      return priority;
  }
};

// API 응답의 상태 코드를 내부 상태로 변환
export const mapApiStatusToInternal = (apiStatus) => {
  switch (apiStatus) {
    case 'PEND-001':
      return 'TODO';
    case 'PEND-002':
      return 'IN_PROGRESS';
    case 'PEND-003':
      return 'COMPLETED';
    default:
      return apiStatus;
  }
};

// 내부 상태를 API 상태 코드로 변환
export const mapInternalStatusToApi = (internalStatus) => {
  switch (internalStatus) {
    case 'TODO':
      return 'PEND-001';
    case 'IN_PROGRESS':
      return 'PEND-002';
    case 'COMPLETED':
      return 'PEND-003';
    default:
      return internalStatus;
  }
};

// API 응답의 우선순위 코드를 내부 코드로 변환
export const mapApiPriorityToInternal = (apiPriority) => {
  switch (apiPriority) {
    case 'PCOD001':
      return 'HIGH';
    case 'PCOD002':
      return 'MEDIUM';
    case 'PCOD003':
      return 'LOW';
    default:
      return apiPriority;
  }
};

// 내부 우선순위를 API 코드로 변환
export const mapInternalPriorityToApi = (internalPriority) => {
  switch (internalPriority) {
    case 'HIGH':
      return 'PCOD001';
    case 'MEDIUM':
      return 'PCOD002';
    case 'LOW':
      return 'PCOD003';
    default:
      return internalPriority;
  }
};
