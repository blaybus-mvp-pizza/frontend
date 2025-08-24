import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'

import PaymentSection from './payment-section'
import ProfileSection from './profile-section'

export default function ProfileTabs() {
  const tabs = [
    {
      value: 'profile',
      label: '프로필',
      component: <ProfileSection />,
      disabled: false,
    },
    {
      value: 'address',
      label: '배송지',
      component: <></>,
      disabled: true,
    },
    {
      value: 'payment',
      label: '결제수단',
      component: <PaymentSection />,
      disabled: false,
    },
  ]

  return (
    <Tabs defaultValue="profile" className="w-[480px]">
      <TabsList className="relative mb-4 flex h-[48px] w-full justify-between border-b border-gray-200 bg-white p-0 shadow-none">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className='text-text-tertiary relative w-full border-none text-[16px] font-semibold shadow-none data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:bottom-[-1px] data-[state=active]:after:left-0 data-[state=active]:after:h-[1px] data-[state=active]:after:w-full data-[state=active]:after:bg-black data-[state=active]:after:content-[""]'
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
  )
}
