<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'

	import { giftCards } from '$lib/data/gift-cards'
	import { getWishlistContext } from '$lib/context/wishlist'
	import { createReservationService } from '$lib/services/reservation'

	import Section from '$lib/components/layout/Section.svelte'
	import Text from '$lib/components/typography/Text.svelte'
	import GiftCard from '$lib/components/common/GiftCard.svelte'
	import Dialog from '$lib/components/common/Dialog.svelte'
	import Button from '$lib/components/common/Button.svelte'

	const ctx = getWishlistContext()
	const reservationService = createReservationService(ctx)

	const { userReservations, toggle, canReserve } = reservationService
</script>

<Section name="gift-cards">
	<Text as="h3" alignment="center">Или купить подарочную карту</Text>
	<div class="gift-cards__overflow">
		<div class="gift-cards__row">
			{#each giftCards as giftCard (giftCard.id)}
				{@const canReserveCard = canReserve(giftCard.id, giftCard.maxReservations)}
				{@const hasUserReservation = userReservations().includes(giftCard.id)}
				{@const cardDimmed = !canReserveCard || hasUserReservation}

				<GiftCard
					dimmed={cardDimmed}
					onclick={() => goto(`#${giftCard.id}`, { noScroll: true, replaceState: true })}
					{...giftCard}
				/>
				<Dialog
					item={giftCard}
					bind:open={
						() => page.url.hash.slice(1) === giftCard.id,
						() => goto('', { noScroll: true, replaceState: true })
					}
				>
					{#snippet actions()}
						<Button
							block
							variant={hasUserReservation ? 'accent' : 'default'}
							disabled={!canReserveCard || !ctx.hasAccess}
							loading={ctx.loading}
							onclick={() => toggle(giftCard.id, giftCard.maxReservations)}
						>
							{#if hasUserReservation}
								Не буду дарить
							{:else if !ctx.hasAccess}
								Нужен ключ
							{:else if canReserveCard}
								Буду дарить
							{:else}
								Недоступно
							{/if}
						</Button>
						<Button variant="outline" href={giftCard.link} target="_blank">Купить</Button>
					{/snippet}
					{#snippet side()}
						<div class="side">
							<div class="side__card">
								<GiftCard {...giftCard} />
							</div>
						</div>
					{/snippet}
				</Dialog>
			{/each}
		</div>
	</div>
</Section>

<style lang="scss">
	.side {
		position: relative;
		min-width: 256px;
		height: 100%;

		@media (max-width: 640px) {
			height: 256px;
		}

		&__card {
			position: absolute;
			top: 50%;
			left: 36px;
			transform: translateY(-50%);
			margin-block-start: -12px;

			@media (max-width: 640px) {
				top: auto;
				bottom: 96px;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}

	.gift-cards {
		&__overflow {
			overflow-x: clip;
			width: calc(100% + 32px);
			margin-inline: -16px;
			margin-block-end: 80px;
			margin-block-start: 48px;

			@media (max-width: 640px) {
				margin-block-start: 64px;
			}
		}

		&__row {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-inline-start: 64px;

			@media (max-width: 640px) {
				margin-inline-start: 112px;
			}
		}
	}
</style>
