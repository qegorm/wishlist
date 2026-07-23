<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { flip } from 'svelte/animate'

	import { products } from '$lib/data/products'
	import { getWishlistContext } from '$lib/context/wishlist'
	import { createReservationService } from '$lib/services/reservation'

	import Section from '$lib/components/layout/Section.svelte'
	import Grid from '$lib/components/layout/Grid.svelte'
	import ProductCard from '$lib/components/common/ProductCard.svelte'
	import Dialog from '$lib/components/common/Dialog.svelte'
	import Text from '$lib/components/typography/Text.svelte'
	import Button from '$lib/components/common/Button.svelte'

	const ctx = getWishlistContext()
	const reservationService = createReservationService(ctx)

	const { userReservations, toggle, canReserve } = reservationService

	const filteredProducts = $derived.by(() => {
		switch (ctx.filterBy) {
			case 'upTo500':
				return products.filter((p) => p.price && p.price <= 500)
			case 'upTo1000':
				return products.filter((p) => p.price && p.price <= 1000)
			case 'upTo2000':
				return products.filter((p) => p.price && p.price <= 2000)
			case 'above2000':
				return products.filter((p) => p.price && p.price > 2000)
			default:
				return products
		}
	})
</script>

<Section name="products">
	<Grid>
		{#each filteredProducts as product (product.id)}
			{@const canReserveProduct = canReserve(product.id, product.maxReservations)}
			{@const hasUserReservation = userReservations().includes(product.id)}
			{@const cardFlipped = !canReserveProduct || hasUserReservation}

			<div class="grid__item" animate:flip={{ duration: 300 }}>
				<ProductCard
					flipped={cardFlipped}
					onclick={() => goto(`#${product.id}`, { noScroll: true, replaceState: true })}
					{...product}
				/>
				<Dialog
					item={product}
					bind:open={
						() => page.url.hash.slice(1) === product.id, () => goto('', { noScroll: true })
					}
				>
					{#snippet actions()}
						<Button
							block
							variant={hasUserReservation ? 'accent' : 'default'}
							loading={ctx.loading}
							disabled={!canReserveProduct || !ctx.hasAccess}
							onclick={() => toggle(product.id, product.maxReservations)}
						>
							{#if hasUserReservation}
								Не буду дарить
							{:else if !ctx.hasAccess}
								Нужен ключ
							{:else if canReserveProduct}
								Буду дарить
							{:else}
								Недоступно
							{/if}
						</Button>
						{#if product.link}
							<Button variant="outline" href={product.link} target="_blank">Купить</Button>
						{/if}
					{/snippet}
				</Dialog>
			</div>
		{:else}
			<div class="products__empty">
				<Text as="p" alignment="center" color="muted">
					Нет товаров, соответствующих выбранному фильтру
				</Text>
			</div>
		{/each}
	</Grid>
</Section>

<style lang="scss">
	.products {
		&__empty {
			grid-column: 1 / -1;
			padding: 24px 0;
		}
	}

	.grid {
		&__item {
			display: flex;
			justify-content: center;
		}
	}
</style>
