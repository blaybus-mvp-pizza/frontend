import { MyItemStatus, MY_ITEM_STATUS_INFO } from "@/constants/myitem.constant";
import { Item } from "@/services/api/my";
import { Button } from "@workspace/ui/components/button";
import MyItemPriceInfo from "./my-item-price-info";

interface MyItemProps {
  item: Item;
  onClick: () => void;
}

export default function MyItem({ item, onClick }: MyItemProps) {
  const { auction } = item;
  const status = item.status as MyItemStatus;
  const statusInfo = MY_ITEM_STATUS_INFO[status] || {
    header: status,
    variant: "subtle",
    description: "",
    buttonText: null,
  };

  let headerColor = "";
  switch (statusInfo.variant) {
    case "error":
      headerColor = "text-red-500";
      break;
    case "subtle":
      headerColor = "text-gray-500";
      break;
    default:
      headerColor = "text-black";
      break;
  }

  const imageUrl =
    auction.product?.images?.[0]?.imageUrl || "/placeholder-image.jpg";
  const productName = auction.product?.name || "상품명 없음";

  return (
    <div className='flex flex-col md:flex-row p-4 gap-4 md:gap-8 items-center border-t border-gray-200'>
      <div className='flex flex-shrink-0 gap-6 items-center flex-1 w-full'>
        <img
          src={imageUrl}
          alt={productName}
          className='w-29 h-29 object-cover rounded-sm'
        />
        <div className='flex flex-col gap-1.5'>
          <h5 className='font-semibold text-base'>{productName}</h5>
          <MyItemPriceInfo item={item} />
        </div>
      </div>

      <div className='block md:hidden w-full h-px bg-gray-100'></div>
      <div className='hidden md:block mx-4 h-29 w-px bg-gray-100'></div>

      <div className='flex flex-col items-center gap-2 text-center w-full md:w-1/3 flex-shrink-0'>
        <p className={`font-semibold ${headerColor}`}>{statusInfo.header}</p>
        <p className='text-sm text-gray-500 whitespace-pre-line'>
          {statusInfo.description}
        </p>
        {statusInfo.buttonText && (
          <Button
            className='mt-1 bg-white text-black border border-gray-200 rounded-none shadow-none hover:bg-gray-200'
            onClick={onClick}
          >
            {statusInfo.buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
