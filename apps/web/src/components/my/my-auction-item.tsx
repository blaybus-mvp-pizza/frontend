import { Button } from '@workspace/ui/components/button'

import { UserRelatedAuctionItem } from '@/api/types'
import { MY_ITEM_STATUS_INFO, MyItemStatus } from '@/constants/myitem.constant'

interface MyAuctionItemProps {
  item: UserRelatedAuctionItem
  onClick: () => void
}

export default function MyAuctionItem({ item, onClick }: MyAuctionItemProps) {
  // Map backend status to frontend status - backend sends the status string directly
  const getStatus = (): MyItemStatus => {
    // Backend sends status like "경매 진행중", "낙찰 확정", etc.
    switch (item.status) {
      case '경매 진행중':
        return MyItemStatus.RUNNING
      case '낙찰 확정':
        return MyItemStatus.WON_CONFIRMED
      case '경매 종료':
        return MyItemStatus.AUCTION_ENDED
      case '경매 일시중지':
        return MyItemStatus.PAUSED
      case '배송중':
        return MyItemStatus.SHIPPING
      case '배송완료':
        return MyItemStatus.DELIVERED
      default:
        return MyItemStatus.AUCTION_ENDED
    }
  }

  const status = getStatus()
  const statusInfo = MY_ITEM_STATUS_INFO[status] || {
    header: status,
    variant: 'subtle',
    description: '',
    buttonText: null,
  }

  let headerColor = ''
  switch (statusInfo.variant) {
    case 'error':
      headerColor = 'text-red-500'
      break
    case 'subtle':
      headerColor = 'text-gray-500'
      break
    default:
      headerColor = 'text-black'
      break
  }

  const imageUrl = item.image_url || '/placeholder-image.jpg'
  const productName = item.product_name || '상품명 없음'

  return (
    <div className="flex flex-col items-center gap-4 border-t border-gray-200 p-4 md:flex-row md:gap-8">
      <div className="flex w-full flex-1 flex-shrink-0 items-center gap-6">
        <img src={imageUrl} alt={productName} className="w-29 h-29 rounded-sm object-cover" />
        <div className="flex flex-col gap-1.5">
          <h5 className="text-base font-semibold">{productName}</h5>
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            {item.current_highest_bid && (
              <p>현재 최고가: {item.current_highest_bid.toLocaleString()}원</p>
            )}
            {item.my_bid_amount && <p>내 입찰가: {item.my_bid_amount.toLocaleString()}원</p>}
          </div>
        </div>
      </div>

      <div className="block h-px w-full bg-gray-100 md:hidden"></div>
      <div className="h-29 mx-4 hidden w-px bg-gray-100 md:block"></div>

      <div className="flex w-full flex-shrink-0 flex-col items-center gap-2 text-center md:w-1/3">
        <p className={`font-semibold ${headerColor}`}>{statusInfo.header}</p>
        <p className="whitespace-pre-line text-sm text-gray-500">{statusInfo.description}</p>
        {statusInfo.buttonText && (
          <Button
            className="mt-1 rounded-none border border-gray-200 bg-white text-black shadow-none hover:bg-gray-200"
            onClick={onClick}
          >
            {statusInfo.buttonText}
          </Button>
        )}
      </div>
    </div>
  )
}
