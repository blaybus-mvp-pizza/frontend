import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs";
import ProfileSection from "./profile-section";

export default function ProfileTabs() {
  const tabs = [
    {
      value: "profile",
      label: "프로필",
      component: <ProfileSection />,
      disabled: false,
    },
    {
      value: "address",
      label: "배송지",
      component: <></>,
      disabled: true,
    },
    {
      value: "payment",
      label: "결제수단",
      component: <></>,
      disabled: true,
    },
  ];

  return (
    <Tabs defaultValue='profile' className='w-[480px]'>
      <TabsList className='flex w-full h-[48px] justify-between p-0 relative bg-white border-b border-gray-200 shadow-none mb-4'>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className='w-full relative shadow-none border-none text-[16px] font-semibold text-[#767676] data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:after:content-[""] data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-[-1px] data-[state=active]:after:h-[1px] data-[state=active]:after:bg-black data-[state=active]:after:w-full'
            disabled={tab.disabled}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
