import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { MyItemStatus } from '@/constants/myitem.constant'
import { Item } from '@/services/api/my'

interface MyItemPriceInfoProps {
  item: Item
}

const InProgressInfo = ({ item }: { item: Item }) => {
  const { auction, myBid } = item

  return (
    <>
      <p className="text-sm font-normal text-gray-600">
        {auction.currentBid?.amount ? (
          <>
            현재 최고가 :{' '}
            <span className="text-base font-bold text-black">
              {auction.currentBid.amount.toLocaleString()}원
            </span>
          </>
        ) : (
          '최고가 정보 없음'
        )}
      </p>
      <p className="text-xs font-normal text-gray-500">
        {myBid?.amount ? `내 입찰가: ${myBid.amount.toLocaleString()}원` : '입찰 내역 없음'}
      </p>
    </>
  )
}

const SuspendedInfo = ({ item }: { item: Item }) => {
  return (
    <>
      <p className="text-sm font-normal text-gray-600">일시중단됨</p>
      {item.date && (
        <p className="text-xs font-normal text-gray-500">
          {format(new Date(item.date), 'yyyy.MM.dd(HH:mm)', {
            locale: ko,
          })}
        </p>
      )}
    </>
  )
}

const DefaultInfo = ({ item }: { item: Item }) => {
  const { myBid } = item

  return (
    <>
      <p className="text-sm font-normal text-gray-600">
        {myBid?.amount ? (
          <>
            낙찰가 :{' '}
            <span className="text-base font-bold text-black">
              {myBid.amount.toLocaleString()}원
            </span>
          </>
        ) : (
          '낙찰가 정보 없음'
        )}
      </p>
      {item.date && (
        <p className="text-xs font-normal text-gray-500">
          {format(new Date(item.date), 'yyyy.MM.dd(HH:mm)', {
            locale: ko,
          })}
        </p>
      )}
    </>
  )
}

export default function MyItemPriceInfo({ item }: MyItemPriceInfoProps) {
  switch (item.status) {
    case MyItemStatus.IN_PROGRESS:
      return <InProgressInfo item={item} />
    case MyItemStatus.TEMPORARILY_SUSPENDED:
      return <SuspendedInfo item={item} />
    default:
      return <DefaultInfo item={item} />
  }
}
