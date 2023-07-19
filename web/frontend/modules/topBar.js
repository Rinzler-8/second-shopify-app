import {useState, useCallback, useEffect} from 'react'
import {TopBar, Button, ButtonGroup, Popover, Card, Link} from "@shopify/polaris"
import {useAuthStore} from "@container/Auth"
import styled from 'styled-components'
import ArticleCard, {SkeletonCard} from "@components/articleCard"
import axios from "@plugins/axios"

const TopBarWrapper = styled.div`
	.Polaris-TopBar__SearchField {
		width: auto;
	}
	.Polaris-TopBar__SecondaryMenu {
		padding-right: 2rem;
	}
`

export default function AppTopBar() {
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
	const {shop_domain, shop_owner, license_active, plan_name} = useAuthStore()
	const [popoverActive, setPopoverActive] = useState(false)

	const togglePopoverActive = useCallback(
		() => setPopoverActive((popoverActive) => !popoverActive),
		[],
	)
	const [showButton, setShowButton] = useState(false)

	useEffect(() => {
		setShowButton(!license_active)
	}, [license_active])

	const toggleIsUserMenuOpen = useCallback(
		() => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
		[]
	)

	const handleNavigationToggle = useCallback(() => {
		console.log('toggle navigation visibility')
	}, [])

	const userMenuMarkup = (
		<TopBar.UserMenu
			name={shop_owner}
			detail={shop_domain}
			initials={shop_owner?.charAt(0)}
			open={isUserMenuOpen}
			onToggle={toggleIsUserMenuOpen}
		/>
	)

	const secondaryMenuMarkup = (
		<ButtonGroup>
      <Button plain url={'https://foxecom.com'} external>
        foxecom.com
      </Button>
			<Button plain url={'https://docs.minimog.co/foxkit/what-is-foxkit'} external>Help center</Button>
			<Button plain url={'https://www.youtube.com/channel/UCVRHoOlsSn8xC4rw5XMgLdg'} external>Video tutorials</Button>
			<Popover
				active={popoverActive}
				activator={<Button onClick={togglePopoverActive} plain>Conversion tips</Button>}
				onClose={togglePopoverActive}
				fullHeight
			>
				<ArticleList />
			</Popover>
		</ButtonGroup>
	)
	return (
		<TopBarWrapper>
			<div id={'user-info'} className={'hidden'} hidden>
				<span className="shop-domain">{shop_domain}</span>
				<span className="shopify-plan">{plan_name}</span>
				<span className="license-activated">{license_active ? 'true' : 'false'}</span>
			</div>
			<TopBar
				// showNavigationToggle
				userMenu={userMenuMarkup}
				secondaryMenu={secondaryMenuMarkup}
				onNavigationToggle={handleNavigationToggle}
			/>
		</TopBarWrapper>
	)
}

const ArticleList = () => {
	const [loading, setLoading] = useState(true)
	const [articles, setArticles] = useState([])

	useEffect(async () => {
		const res = await axios.get('/api/shopify/foxecom-blog?limit=5')
		if (res && res.payload) {
			setArticles(res.payload.articles)
			setLoading(false)
		}
	}, [])
	return (
		<Card title={'Recent posts'}>
			{loading ? (
				<Card.Section>
					<SkeletonCard />
					<SkeletonCard />
					<SkeletonCard />
					<SkeletonCard />
					<SkeletonCard />
				</Card.Section>
			) : (
				<Card.Section>
					{articles.map((article, index) => {
						return <ArticleCard key={index} article={article} />
					})}
				</Card.Section>
			)}
			<Card.Section>
				<div style={{textAlign: 'center'}}>
					<Link url={'https://foxecom.com/blogs/all?utm_source=in-app&utm_medium=app+header&utm_campaign=in-app'} external>View more</Link>
				</div>
			</Card.Section>
		</Card>
	)
}
