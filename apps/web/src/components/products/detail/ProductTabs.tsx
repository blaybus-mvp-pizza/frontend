'use client'

interface ProductTabsProps {
  details?: React.ReactNode
  shipping?: React.ReactNode
  returns?: React.ReactNode
}

export function ProductTabs({ details, shipping, returns }: ProductTabsProps) {
  return (
    <div>
      <div className="border-border-light border-t pb-4 pt-8">
        <p className="text-text-primary text-xl font-semibold">상품상세</p>
        <div className="mt-4 border-t border-black bg-white">
          {details || (
            <table className="text-text-secondary w-full border-t text-sm">
              <tbody>
                <tr className="border-b border-[#F8F8F8]">
                  <td className="text-text-secondary w-32 bg-gray-50 px-6 py-4 text-sm font-medium">
                    제품명
                  </td>
                  <td className="px-6 py-4">카누 탑핑스토어 원두 에디션 커피이신</td>
                </tr>
                <tr className="border-b border-[#F8F8F8]">
                  <td className="text-text-secondary bg-gray-50 px-6 py-4 text-sm font-medium">
                    재질
                  </td>
                  <td className="px-6 py-4">스테인리스</td>
                </tr>
                text-text-secondary
                <tr className="border-b border-[#F8F8F8]">
                  <td className="bg-gray-50 px-6 py-4 text-sm font-medium text-[#505050]">
                    사용위치
                  </td>
                  <td className="px-6 py-4">거실</td>text-text-secondary
                </tr>
                <tr className="border-b border-[#F8F8F8]">
                  <td className="bg-gray-50 px-6 py-4 text-sm font-medium text-[#505050]">
                    가로 사이즈
                  </td>
                  <td className="px-6 py-4">50cm</td>
                </tr>
                <tr className="border-b border-[#F8F8F8]">
                  <td className="bg-gray-50 px-6 py-4 text-sm font-medium text-[#505050]">
                    세로 사이즈
                  </td>
                  <td className="px-6 py-4">100cm</td>
                </tr>
                <tr>
                  <td className="bg-gray-50 px-6 py-4 text-sm font-medium text-[#505050]">
                    오차범위
                  </td>
                  <td className="px-6 py-4">±1cm</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="py-4">
        <p className="text-text-primary text-xl font-semibold">배송안내</p>
        <div className="mt-4 border-t border-black bg-white py-6">
          {shipping || (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">배송기간(물류센터)</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                  <li>
                    본 상품은 오프라인 방어스토어에서 판매되고 넓은 상품을 온라인으로 판매합니다.
                  </li>
                  <li>낮낮 후 결제 완료 시점 기준으로 영업일 2~5일 이내 발송됩니다.</li>
                  <li>모든 상품은 맵핑그쓰와 천사/보관 과정을 거친 후 품질센터로 이동합니다.</li>
                  <li>예약/공동시설의 경우, 시전 공지된 발송일에 일괄 출고됩니다.</li>
                  <li>
                    상품 특성상 전시/보관 중 발생할 수 있는 미세 스크래치나 패키지 헤드든
                    상세페이지에서 사전 고지하며, 이는 반품 사유에 해당하지 않습니다.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">배송비</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                  <li>기본 배송비: 2,500원 (3만원 이상 구매 시 무료)</li>
                  <li>제주/도서산간: 추가 3,000원 ~ 9,000원 (지역별 상이)</li>
                  <li>지정 택배사: CJ 대한통운</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="py-4">
        <p className="text-text-primary text-xl font-semibold">교환/반품 안내</p>
        <div className="mt-4 border-t border-black bg-white py-6">
          {returns || (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">1. 신청 가능 기간 및 조건</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                  <li>교환 및 반품은 제품 수령 후 7일 이내에 가능합니다.</li>
                  <li>
                    경매 특성상 단순 변심에 의한 교환/반품은 불가합니다. (상품 하자/배송 오류 제외)
                  </li>
                  <li>
                    전시/보관 상품 특성상, 상세페이지에 안내된 하자/사용감은 반품 사유에 해당하지
                    않습니다.
                  </li>
                  <li>상품이 사용되었거나, 택/구성품/패키지 훼손 시 교환/반품이 불가합니다.</li>
                  <li>교환은 앞교환이 아닌, 반품 접수 후 재구매 방식으로 진행됩니다.</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">2. 교환 & 반품시 절차</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                  <li>
                    상품 수령 후 2~3일 [마이페이지 {'>'} 주문/배송내역]에서 직접 접수하거나
                    고객센터로 연락 주시기 바랍니다.
                  </li>
                  <li>
                    안내받은 배송지로 상품이 외부로 노출되지 않도록 안전하게 포장하여 발송해 주세요.
                    (택 이전 탈수)
                  </li>
                  <li>단순 변심 불가, 상품 하자/오배송 시 배송비는 판매자가 부담합니다.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
