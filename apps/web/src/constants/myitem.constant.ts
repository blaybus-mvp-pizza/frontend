type StatusVariant = 'default' | 'error' | 'subtle';

type MyItemStatusInfo = {
  header: string;
  variant: StatusVariant;
  description: string;
  buttonText?: string;
};

export enum MyItemStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  ENDED_BY_BUY_NOW = 'ENDED_BY_BUY_NOW',
  PENDING_PAYMENT_FOR_SECOND_BIDDER = 'PENDING_PAYMENT_FOR_SECOND_BIDDER',
  TEMPORARILY_SUSPENDED = 'TEMPORARILY_SUSPENDED',
  AUTO_PAYMENT_FAILED = 'AUTO_PAYMENT_FAILED',
  WINNING_BID_CONFIRMED = 'WINNING_BID_CONFIRMED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
}

export const MY_ITEM_STATUS_INFO: { [key in MyItemStatus]: MyItemStatusInfo } =
  {
    [MyItemStatus.IN_PROGRESS]: {
      header: '경매 진행중',
      variant: 'default',
      description: '경매가 진행중입니다.',
      buttonText: '경매 보러가기',
    },
    [MyItemStatus.ENDED_BY_BUY_NOW]: {
      header: '경매 종료',
      variant: 'subtle',
      description: `다른 사용자의 즉시구매로\n경매가 종료되었습니다.`,
    },
    [MyItemStatus.PENDING_PAYMENT_FOR_SECOND_BIDDER]: {
      header: '차순위 결제 대기중',
      variant: 'default',
      description: '입찰 차순위 결제 대기중입니다.',
    },
    [MyItemStatus.TEMPORARILY_SUSPENDED]: {
      header: '일시중단됨',
      variant: 'error',
      description: '운영자의 사유로 경매가 일시중지 되었습니다.',
    },
    [MyItemStatus.AUTO_PAYMENT_FAILED]: {
      header: '자동 결제 실패',
      variant: 'error',
      description: '자동 결제에 실패하였습니다.',
      buttonText: '결제수단 확인하기',
    },
    [MyItemStatus.WINNING_BID_CONFIRMED]: {
      header: '낙찰 확정',
      variant: 'default',
      description: '경매가 종료되어 배송 준비중입니다.',
    },
    [MyItemStatus.IN_TRANSIT]: {
      header: '배송중인 상품',
      variant: 'default',
      description: '상품 배송중입니다.',
      buttonText: '배송 조회하기',
    },
    [MyItemStatus.DELIVERED]: {
      header: '배송완료',
      variant: 'subtle',
      description: '상품이 배송되었습니다.',
    },
  };
