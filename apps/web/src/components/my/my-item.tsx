import { Button } from '@workspace/ui/components/button'

import { MY_ITEM_STATUS_INFO, MyItemStatus } from '@/constants/myitem.constant'
import { Item } from '@/services/api/my'

import MyItemPriceInfo from './my-item-price-info'

interface MyItemProps {
  item: Item
  onClick: () => void
}

export default function MyItem({ item, onClick }: MyItemProps) {
  const { auction } = item
  const status = item.status as MyItemStatus
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

  const imageUrl = auction.product?.images?.[0]?.imageUrl || '/placeholder-image.jpg'
  const productName = auction.product?.name || '상품명 없음'

  return (
    <div className="flex flex-col items-center gap-4 border-t border-gray-200 p-4 md:flex-row md:gap-8">
      <div className="flex w-full flex-1 flex-shrink-0 items-center gap-6">
        <img src={imageUrl} alt={productName} className="w-29 h-29 rounded-sm object-cover" />
        <div className="flex flex-col gap-1.5">
          <h5 className="text-base font-semibold">{productName}</h5>
          <MyItemPriceInfo item={item} />
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
