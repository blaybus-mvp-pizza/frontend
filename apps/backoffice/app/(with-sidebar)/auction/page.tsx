import AuctionTable from "@/components/auction/auction-table";

export default function AuctionPage() {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-2'>경매 목록</h2>
      <AuctionTable />
    </div>
  );
}
