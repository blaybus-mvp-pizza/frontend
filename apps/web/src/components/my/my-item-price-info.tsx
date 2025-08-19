import { Item } from "@/services/api/my";
import { MyItemStatus } from "@/constants/myitem.constant";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface MyItemPriceInfoProps {
  item: Item;
}

const InProgressInfo = ({ item }: { item: Item }) => {
  const { auction, myBid } = item;

  return (
    <>
      <p className='text-sm text-gray-600 font-normal'>
        {auction.currentBid?.amount ? (
          <>
            현재 최고가 :{" "}
            <span className='text-black font-bold text-base'>
              {auction.currentBid.amount.toLocaleString()}원
            </span>
          </>
        ) : (
          "최고가 정보 없음"
        )}
      </p>
      <p className='text-xs text-gray-500 font-normal'>
        {myBid?.amount
          ? `내 입찰가: ${myBid.amount.toLocaleString()}원`
          : "입찰 내역 없음"}
      </p>
    </>
  );
};

const SuspendedInfo = ({ item }: { item: Item }) => {
  return (
    <>
      <p className='text-sm text-gray-600 font-normal'>일시중단됨</p>
      {item.date && (
        <p className='text-xs text-gray-500 font-normal'>
          {format(new Date(item.date), "yyyy.MM.dd(HH:mm)", {
            locale: ko,
          })}
        </p>
      )}
    </>
  );
};

const DefaultInfo = ({ item }: { item: Item }) => {
  const { myBid } = item;

  return (
    <>
      <p className='text-sm text-gray-600 font-normal'>
        {myBid?.amount ? (
          <>
            낙찰가 :{" "}
            <span className='text-black font-bold text-base'>
              {myBid.amount.toLocaleString()}원
            </span>
          </>
        ) : (
          "낙찰가 정보 없음"
        )}
      </p>
      {item.date && (
        <p className='text-xs text-gray-500 font-normal'>
          {format(new Date(item.date), "yyyy.MM.dd(HH:mm)", {
            locale: ko,
          })}
        </p>
      )}
    </>
  );
};

export default function MyItemPriceInfo({ item }: MyItemPriceInfoProps) {
  switch (item.status) {
    case MyItemStatus.IN_PROGRESS:
      return <InProgressInfo item={item} />;
    case MyItemStatus.TEMPORARILY_SUSPENDED:
      return <SuspendedInfo item={item} />;
    default:
      return <DefaultInfo item={item} />;
  }
}
