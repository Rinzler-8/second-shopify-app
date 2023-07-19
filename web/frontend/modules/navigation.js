import React from 'react'
import {Navigation} from '@shopify/polaris'
import {
	HomeMajor, SettingsMajor,
	DiscountCodeMajor,
	AddProductMajor,
	DiscountsMajor,
	DetailedPopUpMajor,
	QuickSaleMajor,
	SocialPostMajor,
	ArrowLeftMinor,
	RepeatOrderMajor,
	CartMajor,
  ProductsMajor,
	ThemeEditMajor,
	BuyButtonButtonLayoutMajor,
	ConfettiMajor,
  CustomersMajor,
	OrdersMajor,
	LanguageMinor,ExchangeMajor, VariantMajor
} from "@shopify/polaris-icons"
import NavSection from "@modules/navSection"
import {useAuthStore} from "@container/Auth"

const boostItems = [
  {
    label: 'Free shipping goal',
    icon: QuickSaleMajor,
    url: '/free-shipping-goal'
  },
  {
    label: 'Countdown tools',
    icon: DiscountCodeMajor,
    url: '/countdown-timer',
    subNavigationItems: [
      {
        label: 'Countdown timer',
        url: '/countdown-timer'
      },
      {
        label: 'Stock countdown',
        url: '/stock-countdown'
      },
      {
        label: 'Cart countdown',
        url: '/cart-countdown'
      }
    ]
  },
  {
    label: 'Sales notifications',
    icon: SocialPostMajor,
    url: '/sales-notifications'
  },
  {
    label: 'Lucky wheel',
    icon: ConfettiMajor,
    url: '/lucky-wheel'
  },
  {
    label: 'Popup',
    icon: DetailedPopUpMajor,
    url: '/popup'
  },
  // {
  // 	label: 'Facebook chat',
  // 	icon: ChatMajor,
  // 	url: '/messenger'
  // },
  {
    label: 'Size chart',
    icon: ThemeEditMajor,
    url: '/size-chart'
  },
  {
    label: 'Back in stock',
    icon: BuyButtonButtonLayoutMajor,
    url: '/back-in-stock',
    subNavigationItems: [
      {
        label: "Subscriptions",
        url: "/back-in-stock"
      },
      {
        label: "Settings",
        url: "/back-in-stock/settings"
      }
    ]
  },
  {
    label: 'Pre-order',
    icon: OrdersMajor,
    url: '/pre-order'
  },
]

const AppNavigation = () => {
	const {shop_domain, license_active} = useAuthStore()

  if (license_active && boostItems?.[0]?.url !== '/variant-group-images') {
    boostItems.unshift({
      label: 'Variant group images',
      icon: VariantMajor,
      url: '/variant-group-images'
    })
  }
	return (
		<Navigation location="/">
			<Navigation.Section
				items={[
					{
						label: 'Back to Shopify',
						icon: ArrowLeftMinor,
						onClick: () => window.open(`https://${shop_domain}/admin`)
					}
				]}
			/>
			<NavSection
				separator
				items={[
					{
						label: 'Dashboard',
						icon: HomeMajor,
						url: '/'
					}
				]}
			/>
			<NavSection
				separator
				title={'Upsells'}
				items={[
					{
						label: 'Product bundles',
						icon: AddProductMajor,
						url: '/bundles',
					},
					{
						label: 'Quantity discounts',
						icon: DiscountsMajor,
						url: '/quantity-discounts',
					},
					{
						label: 'Pre-purchase',
						icon: RepeatOrderMajor,
						url: '/pre-purchase'
					},
					{
						label: 'In-cart',
						icon: CartMajor,
						url: '/in-cart'
					},
					{
						label: 'Related products',
						icon: ProductsMajor,
						url: '/product-recommendation'
					}
				]}
			/>
			<NavSection
				title={'Boost conversion'}
				items={[...new Set(boostItems)]}
			/>
			<NavSection
				title={'Manage'}
				fill
				items={[
					{
						label: 'Subscribers',
						url: '/manage/subscribers',
						icon: CustomersMajor
					},
					{
						label: 'Integrations',
						icon: ExchangeMajor,
						url: '/manage/integrations'
					},
          {
            label: 'Translations',
            url: '/translations',
            icon: LanguageMinor
          }
				]}
			/>
			<NavSection
				separator
				items={[
					{
						label: 'Settings',
						icon: SettingsMajor,
						url: '/settings'
					}
				]}
			/>
		</Navigation>
	)
}
export default AppNavigation
