const PRODUCT_TAGS = [
  { name: "가구/리빙", imgSrc: "/icons/가구리빙.png" },
  { name: "키친/테이블웨어", imgSrc: "/icons/키친테이블웨어.png" },
  { name: "디지털/가전", imgSrc: "/icons/디지털가전.png" },
  { name: "패션/잡화", imgSrc: "/icons/패션잡화.png" },
  { name: "아트/컬렉터블", imgSrc: "/icons/아트컬렉터블.png" },
  { name: "조명/소품", imgSrc: "/icons/조명소품.png" },
  { name: "오피스/비즈니스", imgSrc: "/icons/오피스비즈니스.png" },
];
export default function HomePage() {
  return (
    <div className="space-y-10 pt-2">
      <div className="w-full h-[380px] rounded-2xl bg-gradient-to-b from-gray-200 to-gray-600"></div>
      <div className="w-full grid grid-cols-7 gap-2 h-[110px]">
        {PRODUCT_TAGS.map((v) => (
          <div
            className="bg-[#f6f6f6] rounded-lg p-4 flex flex-col items-center gap-3 hover:bg-[#ececec] transition-colors cursor-pointer"
            key={v.name}
          >
            <img
              src={v.imgSrc}
              alt={v.name}
              className="w-12 h-12 object-contain"
            />
            <p className="text-sm text-center font-medium text-gray-700">
              {v.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
